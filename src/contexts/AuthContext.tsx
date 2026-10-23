import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { LoginFormData, SignupFormData, ResetPasswordFormData } from '@/lib/validations/auth'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  plan: 'free' | 'pro' | 'agency'
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isDemoMode: boolean
  signIn: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>
  signUp: (data: SignupFormData) => Promise<{ success: boolean; error?: string; message?: string }>
  resetPassword: (data: ResetPasswordFormData) => Promise<{ success: boolean; error?: string; message?: string }>
  signOut: () => Promise<void>
  updateUserPlan: (newPlan: 'free' | 'pro' | 'agency') => Promise<void>
}

const LOCAL_STORAGE_AUTH_KEY = 'campanhautm_auth_session'
const LOCAL_STORAGE_USERS_KEY = 'campanhautm_demo_users'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Tradução amigável dos erros do Supabase para Português
function translateSupabaseError(errorMsg: string): string {
  const lower = errorMsg.toLowerCase()
  if (lower.includes('invalid login credentials')) return 'E-mail ou senha incorretos. Verifique suas credenciais.'
  if (lower.includes('user already registered')) return 'Já existe uma conta cadastrada com este e-mail.'
  if (lower.includes('email not confirmed')) return 'Por favor, confirme seu e-mail antes de fazer login.'
  if (lower.includes('password is too short') || lower.includes('at least 6 characters')) {
    return 'A senha é muito curta. Use pelo menos 8 caracteres.'
  }
  if (lower.includes('rate limit')) return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos.'
  return 'Ocorreu um erro ao processar sua solicitação. Tente novamente.'
}

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
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                fullName: (session.user.user_metadata?.full_name as string) || session.user.email?.split('@')[0] || 'Usuário',
                plan: 'free',
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

    // Se o Supabase estiver configurado, escuta mudanças em tempo real (login, logout, refresh de token)
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: (session.user.user_metadata?.full_name as string) || session.user.email?.split('@')[0] || 'Usuário',
            plan: 'free',
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

  // 2. Ação de Login (Sign In)
  const signIn = useCallback(async (data: LoginFormData): Promise<{ success: boolean; error?: string }> => {
    // Defesa contra Mass Assignment: extrai explicitamente apenas os campos esperados
    const { email, password } = data

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          return { success: false, error: translateSupabaseError(error.message) }
        }
        return { success: true }
      } catch {
        return { success: false, error: 'Erro de conexão com o servidor. Tente novamente mais tarde.' }
      }
    } else {
      // Simulação no Modo Demo Local
      const storedUsersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY)
      const users: Array<AuthUser & { passwordHash: string }> = storedUsersRaw ? JSON.parse(storedUsersRaw) : []
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (!found || found.passwordHash !== password) {
        // Simula pequena latência de rede para testes realistas
        await new Promise((r) => setTimeout(r, 400))
        return { success: false, error: 'E-mail ou senha incorretos. (Dica no modo demo: crie uma conta primeiro).' }
      }

      const activeUser: AuthUser = {
        id: found.id,
        email: found.email,
        fullName: found.fullName,
        plan: found.plan || 'free',
      }
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(activeUser))
      setUser(activeUser)
      return { success: true }
    }
  }, [])

  // 3. Ação de Cadastro (Sign Up)
  const signUp = useCallback(async (data: SignupFormData): Promise<{ success: boolean; error?: string; message?: string }> => {
    // Defesa contra Mass Assignment
    const { email, password, fullName } = data

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        })
        if (error) {
          return { success: false, error: translateSupabaseError(error.message) }
        }
        return {
          success: true,
          message: 'Cadastro realizado com sucesso! Verifique sua caixa de entrada para confirmar o e-mail.',
        }
      } catch {
        return { success: false, error: 'Erro ao conectar com o serviço de cadastro.' }
      }
    } else {
      // Simulação no Modo Demo Local
      const storedUsersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY)
      const users: Array<AuthUser & { passwordHash: string }> = storedUsersRaw ? JSON.parse(storedUsersRaw) : []

      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'Já existe uma conta cadastrada com este e-mail.' }
      }

      const newUser: AuthUser = {
        id: `demo-user-${Date.now()}`,
        email,
        fullName,
        plan: 'free',
      }
      users.push({ ...newUser, passwordHash: password })
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users))
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(newUser))
      setUser(newUser)
      return {
        success: true,
        message: 'Conta criada com sucesso! Você já está autenticado.',
      }
    }
  }, [])

  // 4. Ação de Recuperação de Senha (Reset Password)
  const resetPassword = useCallback(async (data: ResetPasswordFormData): Promise<{ success: boolean; error?: string; message?: string }> => {
    const { email } = data

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) {
          return { success: false, error: translateSupabaseError(error.message) }
        }
        return {
          success: true,
          message: 'Se o e-mail estiver cadastrado, enviamos as instruções para redefinição de senha.',
        }
      } catch {
        return { success: false, error: 'Falha ao solicitar redefinição de senha.' }
      }
    } else {
      // Simulação no Modo Demo
      await new Promise((r) => setTimeout(r, 400))
      return {
        success: true,
        message: 'Instruções de recuperação simuladas com sucesso para ' + email,
      }
    }
  }, [])

  // 5. Ação de Logout (Sign Out)
  const signOut = useCallback(async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut()
      } catch (err) {
        console.error('[Auth] Erro ao encerrar sessão no Supabase:', err)
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY)
    }
    setUser(null)
  }, [])

  // 6. Atualização de Plano (Upgrade / Downgrade via Hotmart Webhook ou Simulação)
  const updateUserPlan = useCallback(async (newPlan: 'free' | 'pro' | 'agency'): Promise<void> => {
    if (!user) return

    const updatedUser: AuthUser = {
      ...user,
      plan: newPlan,
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ plan: newPlan, updated_at: new Date().toISOString() })
          .eq('id', user.id)
      } catch (err) {
        console.error('[Auth] Erro ao atualizar plano no Supabase:', err)
      }
    } else {
      // Atualiza no localStorage
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(updatedUser))

      const storedUsersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY)
      if (storedUsersRaw) {
        const users = JSON.parse(storedUsersRaw) as Array<AuthUser & { passwordHash: string }>
        const idx = users.findIndex((u) => u.id === user.id)
        if (idx !== -1) {
          users[idx].plan = newPlan
          localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users))
        }
      }
    }

    setUser(updatedUser)
  }, [user])

  const value = useMemo(
    () => ({
      user,
      loading,
      isDemoMode: !isSupabaseConfigured,
      signIn,
      signUp,
      resetPassword,
      signOut,
      updateUserPlan,
    }),
    [user, loading, signIn, signUp, resetPassword, signOut, updateUserPlan]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um <AuthProvider>')
  }
  return context
}
