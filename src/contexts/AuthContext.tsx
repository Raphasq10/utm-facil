import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { LoginFormData, SignupFormData, ResetPasswordFormData } from '@/lib/validations/auth'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  plan: 'free' | 'pro' | 'agency'
  emailConfirmed: boolean
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isDemoMode: boolean
  needsEmailVerification: boolean
  signIn: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>
  signUp: (data: SignupFormData) => Promise<{ success: boolean; error?: string; message?: string }>
  resetPassword: (data: ResetPasswordFormData) => Promise<{ success: boolean; error?: string; message?: string }>
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>
  resendConfirmationEmail: (email: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateUserPlan: (newPlan: 'free' | 'pro' | 'agency') => Promise<void>
}

const LOCAL_STORAGE_AUTH_KEY = 'campanhautm_auth_session'
const LOCAL_STORAGE_USERS_KEY = 'campanhautm_demo_users'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // 1. Inicializa a sessão ao carregar a aplicação
  useEffect(() => {
    let isMounted = true

    async function initializeAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession()
          if (error) {
            console.error('[Auth] Erro ao obter sessão ativa:', error.message)
          }

          if (isMounted) {
            if (session?.user) {
              const isConfirmed = Boolean(session.user.email_confirmed_at || session.user.confirmed_at)
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                fullName: (session.user.user_metadata?.full_name as string) || session.user.email?.split('@')[0] || 'Usuário',
                plan: 'free',
                emailConfirmed: isConfirmed,
              })
            } else {
              setUser(null)
            }
          }
        } catch (err) {
          console.error('[Auth] Falha inesperada ao inicializar sessão:', err)
        }
      } else {
        // Modo Demo Local (quando as chaves do Supabase ainda não foram preenchidas)
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY)
          if (stored && isMounted) {
            const parsed = JSON.parse(stored) as AuthUser
            setUser(parsed)
          }
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY)
        }
      }

      if (isMounted) {
        setLoading(false)
      }
    }

    initializeAuth()

    // Escuta mudanças de autenticação em tempo real no Supabase
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const isConfirmed = Boolean(session.user.email_confirmed_at || session.user.confirmed_at)
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: (session.user.user_metadata?.full_name as string) || session.user.email?.split('@')[0] || 'Usuário',
            plan: 'free',
            emailConfirmed: isConfirmed,
          })
        } else {
          setUser(null)
        }
      })

      return () => {
        isMounted = false
        subscription.unsubscribe()
      }
    }

    return () => {
      isMounted = false
    }
  }, [])

  // 2. Ação de Login (Sign In) com Mensagem Genérica Estrita de Segurança
  const signIn = useCallback(async (data: LoginFormData): Promise<{ success: boolean; error?: string }> => {
    const { email, password } = data

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          // Regra de Segurança: NUNCA revelar se o e-mail existe ou se a senha estava errada
          return { success: false, error: 'Email ou senha inválidos' }
        }
        return { success: true }
      } catch {
        return { success: false, error: 'Email ou senha inválidos' }
      }
    } else {
      // Simulação no Modo Demo Local
      const storedUsersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY)
      const users: Array<AuthUser & { passwordHash: string }> = storedUsersRaw ? JSON.parse(storedUsersRaw) : []
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (!found || found.passwordHash !== password) {
        await new Promise((r) => setTimeout(r, 400))
        // Mensagem genérica mesmo em demo
        return { success: false, error: 'Email ou senha inválidos' }
      }

      const activeUser: AuthUser = {
        id: found.id,
        email: found.email,
        fullName: found.fullName,
        plan: found.plan || 'free',
        emailConfirmed: true,
      }
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(activeUser))
      setUser(activeUser)
      return { success: true }
    }
  }, [])

  // 3. Ação de Cadastro (Sign Up) com Honeypot Anti-Bot
  const signUp = useCallback(async (data: SignupFormData): Promise<{ success: boolean; error?: string; message?: string }> => {
    // Regra de Segurança: Honeypot Anti-Bot invisível
    if (data.website && data.website.trim().length > 0) {
      // Rejeita silenciosamente sem processar
      return {
        success: true,
        message: 'Cadastro recebido com sucesso! Verifique sua caixa de entrada para confirmar o e-mail.',
      }
    }

    const { email, password, fullName } = data

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) {
          const lower = error.message.toLowerCase()
          // Resposta graciosa se o e-mail já existir
          if (lower.includes('already registered')) {
            return {
              success: false,
              error: 'Não foi possível concluir o cadastro com este e-mail. Se já possui conta, faça login.',
            }
          }
          return { success: false, error: 'Erro ao processar cadastro. Tente novamente mais tarde.' }
        }
        return {
          success: true,
          message: 'Cadastro realizado com sucesso! Verifique sua caixa de entrada para confirmar o e-mail.',
        }
      } catch {
        return { success: false, error: 'Erro de conexão ao realizar cadastro.' }
      }
    } else {
      // Modo Demo
      const storedUsersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY)
      const users: Array<AuthUser & { passwordHash: string }> = storedUsersRaw ? JSON.parse(storedUsersRaw) : []

      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'Não foi possível concluir o cadastro com este e-mail. Se já possui conta, faça login.' }
      }

      const newUser: AuthUser = {
        id: `demo-user-${Date.now()}`,
        email,
        fullName,
        plan: 'free',
        emailConfirmed: true,
      }
      users.push({ ...newUser, passwordHash: password })
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users))
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(newUser))
      setUser(newUser)
      return {
        success: true,
        message: 'Conta criada com sucesso no modo demonstração!',
      }
    }
  }, [])

  // 4. Solicitação de Recuperação de Senha (Forgot Password)
  const resetPassword = useCallback(async (data: ResetPasswordFormData): Promise<{ success: boolean; error?: string; message?: string }> => {
    const { email } = data

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) {
          return { success: false, error: 'Não foi possível enviar o e-mail de recuperação. Tente novamente.' }
        }
        return {
          success: true,
          message: 'Se o e-mail estiver cadastrado, você receberá um link seguro de recuperação em instantes.',
        }
      } catch {
        return { success: false, error: 'Falha ao solicitar recuperação de senha.' }
      }
    } else {
      return {
        success: true,
        message: 'Link de recuperação simulado gerado com sucesso (modo demo).',
      }
    }
  }, [])

  // 5. Atualização de Nova Senha (/reset-password)
  const updatePassword = useCallback(async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) {
          return { success: false, error: 'Token expirado ou inválido. Solicite uma nova recuperação.' }
        }
        return { success: true }
      } catch {
        return { success: false, error: 'Erro ao redefinir senha.' }
      }
    }
    return { success: true }
  }, [])

  // 6. Reenvio de E-mail de Confirmação
  const resendConfirmationEmail = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
        })
        if (error) {
          return { success: false, error: 'Aguarde alguns minutos antes de solicitar novo envio.' }
        }
        return { success: true }
      } catch {
        return { success: false, error: 'Erro ao reenviar e-mail de confirmação.' }
      }
    }
    return { success: true }
  }, [])

  // 7. Logout Server-Side (com scope global para invalidar tokens no servidor)
  const signOut = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut({ scope: 'global' })
      } catch (err) {
        console.error('[Auth] Erro ao deslogar no servidor:', err)
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY)
    setUser(null)
  }, [])

  // 8. Atualiza Plano do Usuário (Feature 2)
  const updateUserPlan = useCallback(async (newPlan: 'free' | 'pro' | 'agency') => {
    setUser((prev) => (prev ? { ...prev, plan: newPlan } : null))
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser
        parsed.plan = newPlan
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(parsed))
      }
    }
  }, [])

  const isDemo = !isSupabaseConfigured
  const needsEmailVerification = Boolean(user && !user.emailConfirmed && isSupabaseConfigured)

  const value = useMemo(
    () => ({
      user,
      loading,
      isDemoMode: isDemo,
      needsEmailVerification,
      signIn,
      signUp,
      resetPassword,
      updatePassword,
      resendConfirmationEmail,
      signOut,
      updateUserPlan,
    }),
    [
      user,
      loading,
      isDemo,
      needsEmailVerification,
      signIn,
      signUp,
      resetPassword,
      updatePassword,
      resendConfirmationEmail,
      signOut,
      updateUserPlan,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um <AuthProvider>')
  }
  return context
}
