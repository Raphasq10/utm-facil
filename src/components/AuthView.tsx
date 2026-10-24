import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  calculatePasswordStrength,
  type LoginFormData,
  type SignupFormData,
  type ResetPasswordFormData,
  type UpdatePasswordFormData,
} from '@/lib/validations/auth'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Loader2,
  Sparkles,
  ShieldCheck,
  Zap,
  FolderKanban,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

export type AuthMode =
  | 'login'
  | 'signup'
  | 'forgot_password'
  | 'reset_password_new'
  | 'verify_email'
  | 'callback'

interface AuthViewProps {
  initialMode?: 'login' | 'signup'
  onBackToLanding?: () => void
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onBackToLanding,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [pendingEmail, setPendingEmail] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  // Sincroniza modo quando initialMode mudar
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode)
    }
  }, [initialMode])

  const {
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    resendConfirmationEmail,
    needsEmailVerification,
    user,
    signOut,
    isDemoMode,
  } = useAuth()

  // 1. Form de Login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // 2. Form de Cadastro (com Honeypot)
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', website: '' },
  })

  // 3. Form de Solicitação de Recuperação (Forgot Password)
  const forgotForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  })

  // 4. Form de Definição de Nova Senha (Reset Password)
  const updateForm = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  // Observa senhas para calcular força visualmente
  const watchedSignupPassword = signupForm.watch('password')
  const watchedUpdatePassword = updateForm.watch('password')
  const passwordStrength = calculatePasswordStrength(
    mode === 'reset_password_new' ? watchedUpdatePassword || '' : watchedSignupPassword || ''
  )

  // Detecta se a URL contém token de recuperação de senha ou confirmação de email
  useEffect(() => {
    const hash = window.location.hash
    const search = window.location.search

    if (hash.includes('type=recovery') || search.includes('type=recovery')) {
      setMode('reset_password_new')
      toast.info('Link de recuperação identificado! Digite sua nova senha.')
    } else if (hash.includes('access_token') || search.includes('code=')) {
      setMode('callback')
      setTimeout(() => {
        setMode('login')
        toast.success('Autenticação processada! Você pode fazer login.')
      }, 1500)
    } else if (needsEmailVerification && user) {
      setPendingEmail(user.email)
      setMode('verify_email')
    }
  }, [needsEmailVerification, user])

  // Handlers de submissão com proteção contra Race Conditions
  const handleLoginSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await signIn(data)
      if (!res.success) {
        // Regra de segurança: Sempre mensagem genérica
        toast.error(res.error || 'Email ou senha inválidos')
      } else {
        toast.success('Bem-vindo(a) de volta!')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignupSubmit = async (data: SignupFormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await signUp(data)
      if (!res.success) {
        toast.error(res.error || 'Falha ao processar cadastro.')
      } else {
        setPendingEmail(data.email)
        setMode('verify_email')
        toast.success(res.message || 'Conta criada! Confirme seu e-mail para ativar.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotSubmit = async (data: ResetPasswordFormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await resetPassword(data)
      if (!res.success) {
        toast.error(res.error || 'Erro ao enviar e-mail de recuperação.')
      } else {
        toast.success(res.message || 'Instruções enviadas para seu e-mail.')
        setPendingEmail(data.email)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdatePasswordSubmit = async (data: UpdatePasswordFormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await updatePassword(data.password)
      if (!res.success) {
        toast.error(res.error || 'Não foi possível atualizar a senha.')
      } else {
        toast.success('Senha atualizada com sucesso! Faça login com a nova senha.')
        setMode('login')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!pendingEmail || isResending) return
    setIsResending(true)
    try {
      const res = await resendConfirmationEmail(pendingEmail)
      if (res.success) {
        toast.success('Novo e-mail de confirmação enviado! Verifique sua caixa de entrada.')
      } else {
        toast.error(res.error || 'Aguarde alguns minutos antes de reenviar.')
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white">
      {/* Botão de Retorno à Landing Page */}
      {onBackToLanding && (
        <div className="w-full max-w-4xl mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Página Inicial
          </button>
        </div>
      )}

      {/* Banner de Demonstração quando Supabase ainda não estiver conectado no .env */}
      {isDemoMode && (
        <div className="w-full max-w-4xl mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Modo Demonstração Local:</strong> Cadastre-se ou entre para testar todas as funcionalidades.
            </span>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
        {/* Coluna da Esquerda: Apresentação da Marca & Proposta de Valor */}
        <div className="hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-emerald-600 via-teal-700 to-zinc-950 text-white relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-medium mb-6">
              <Zap className="w-3.5 h-3.5 text-emerald-300" />
              <span>SaaS de Taxonomia GA4 & Performance</span>
            </div>

            <div className="mb-4">
              <img
                src="/logo-clara.png"
                alt="CampanhaUTM"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-emerald-50 text-sm leading-relaxed mb-8">
              Padronize o rastreamento das suas campanhas em múltiplos clientes com isolamento seguro, limites por plano e regras GA4 automáticas.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Multi-Tenancy Estrito</h4>
                  <p className="text-[11px] text-emerald-100/80">Dados protegidos por Row Level Security no PostgreSQL.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-emerald-300">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Gestão por Projetos</h4>
                  <p className="text-[11px] text-emerald-100/80">Separação limpa entre clientes, contas e campanhas.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/80">
            <span>© 2026 CampanhaUTM</span>
            <span>Versão SaaS 2.0</span>
          </div>
        </div>

        {/* Coluna da Direita: Formulários Dinâmicos */}
        <div className="p-6 sm:p-8 flex flex-col justify-center bg-zinc-900 text-zinc-100">
          {/* TELA: VERIFY EMAIL */}
          {mode === 'verify_email' && (
            <div>
              <div className="text-center mb-5">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Mail className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verifique seu E-mail</h2>
                <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
                  Enviamos o link de ativação para{' '}
                  <strong className="text-emerald-400">{pendingEmail || 'seu e-mail'}</strong>.
                </p>
              </div>

              {/* Box de Orientação para o Usuário */}
              <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Como localizar o e-mail:</span>
                </div>
                <ul className="text-[11px] text-zinc-300 space-y-1.5 list-disc list-inside">
                  <li>
                    <strong>Remetente:</strong> O e-mail é enviado em nome do nosso provedor seguro (<strong>Supabase</strong>).
                  </li>
                  <li>
                    <strong>Assunto:</strong> <code className="bg-zinc-800 px-1 py-0.5 rounded text-amber-200">Confirm your email address</code>
                  </li>
                  <li>
                    <strong>Não viu na entrada?</strong> Verifique a pasta de <em>Spam</em> ou <em>Lixo Eletrônico</em>.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={isResending}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer h-10 text-xs"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Reenviando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reenviar E-mail de Ativação
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (user) signOut()
                    setMode('login')
                  }}
                  className="w-full border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer text-xs h-9"
                >
                  Voltar para o Login
                </Button>
              </div>
            </div>
          )}

          {/* TELA: CALLBACK PROCESSING */}
          {mode === 'callback' && (
            <div className="text-center py-10 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Processando confirmação segura...</h3>
              <p className="text-xs text-zinc-400">Validando token criptográfico com o Supabase.</p>
            </div>
          )}

          {/* TELA: DEFINIR NOVA SENHA (/reset-password) */}
          {mode === 'reset_password_new' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Criar Nova Senha</h2>
                <p className="text-xs text-zinc-400">Defina uma nova senha segura com no mínimo 10 caracteres.</p>
              </div>

              <form onSubmit={updateForm.handleSubmit(handleUpdatePasswordSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="new-pass" className="text-xs font-semibold text-zinc-300">Nova Senha</Label>
                  <Input
                    id="new-pass"
                    type="password"
                    maxLength={72}
                    placeholder="Mínimo 10 caracteres com maiúscula e número"
                    {...updateForm.register('password')}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  />
                  {updateForm.formState.errors.password && (
                    <p className="text-[11px] text-rose-400">{updateForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-new-pass" className="text-xs font-semibold text-zinc-300">Confirmar Senha</Label>
                  <Input
                    id="confirm-new-pass"
                    type="password"
                    maxLength={72}
                    placeholder="Repita a nova senha"
                    {...updateForm.register('confirmPassword')}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  />
                  {updateForm.formState.errors.confirmPassword && (
                    <p className="text-[11px] text-rose-400">{updateForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Nova Senha'}
                </Button>
              </form>
            </div>
          )}

          {/* TELA: FORGOT PASSWORD */}
          {mode === 'forgot_password' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Recuperar Senha</h2>
                <p className="text-xs text-zinc-400">
                  Informe seu e-mail cadastrado para receber o link seguro de redefinição.
                </p>
              </div>

              <form onSubmit={forgotForm.handleSubmit(handleForgotSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="forgot-email" className="text-xs font-semibold text-zinc-300">E-mail</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    maxLength={255}
                    placeholder="seu.email@empresa.com"
                    {...forgotForm.register('email')}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  />
                  {forgotForm.formState.errors.email && (
                    <p className="text-[11px] text-rose-400">{forgotForm.formState.errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar Link de Recuperação'}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-zinc-400 hover:text-emerald-400 cursor-pointer"
                  >
                    Lembrou da senha? Faça login
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TELA: LOGIN & SIGNUP (COM ABAS) */}
          {(mode === 'login' || mode === 'signup') && (
            <div>
              {/* Abas Alternadoras */}
              <div className="grid grid-cols-2 bg-zinc-950 p-1 rounded-xl mb-6 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Entrar na Conta
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Criar Conta
                </button>
              </div>

              {/* FORMULÁRIO DE LOGIN */}
              {mode === 'login' && (
                <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-xs font-semibold text-zinc-300">E-mail</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="login-email"
                        type="email"
                        maxLength={255}
                        placeholder="gestor@agencia.com.br"
                        {...loginForm.register('email')}
                        className="pl-9 bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-[11px] text-rose-400">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-pass" className="text-xs font-semibold text-zinc-300">Senha</Label>
                      <button
                        type="button"
                        onClick={() => setMode('forgot_password')}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="login-pass"
                        type="password"
                        maxLength={72}
                        placeholder="••••••••••"
                        {...loginForm.register('password')}
                        className="pl-9 bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                      />
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-[11px] text-rose-400">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer shadow-lg shadow-emerald-950/40"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Autenticando...
                      </>
                    ) : (
                      <>
                        Acessar Minha Conta
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* FORMULÁRIO DE CADASTRO (COM HONEYPOT) */}
              {mode === 'signup' && (
                <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-3.5">
                  {/* Honeypot Invisível para Bots */}
                  <div className="opacity-0 absolute -z-50 pointer-events-none select-none h-0 w-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
                    <Label htmlFor="hp-website">Website da Empresa</Label>
                    <Input
                      id="hp-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...signupForm.register('website')}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name" className="text-xs font-semibold text-zinc-300">Nome Completo</Label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="signup-name"
                        type="text"
                        maxLength={100}
                        placeholder="Ex: Carlos Silva"
                        {...signupForm.register('fullName')}
                        className="pl-9 bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                      />
                    </div>
                    {signupForm.formState.errors.fullName && (
                      <p className="text-[11px] text-rose-400">{signupForm.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-xs font-semibold text-zinc-300">E-mail Profissional</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="signup-email"
                        type="email"
                        maxLength={255}
                        placeholder="carlos@agencia.com.br"
                        {...signupForm.register('email')}
                        className="pl-9 bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="text-[11px] text-rose-400">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-pass" className="text-xs font-semibold text-zinc-300">Senha (Mín. 10 Caracteres)</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="signup-pass"
                        type="password"
                        maxLength={72}
                        placeholder="Letras maiúsculas, minúsculas e números"
                        {...signupForm.register('password')}
                        className="pl-9 bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                      />
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-[11px] text-rose-400">{signupForm.formState.errors.password.message}</p>
                    )}

                    {/* Medidor de Força */}
                    {watchedSignupPassword && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          Força: {passwordStrength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-confirm-pass" className="text-xs font-semibold text-zinc-300">Confirmar Senha</Label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        id="signup-confirm-pass"
                        type="password"
                        maxLength={72}
                        placeholder="Repita a senha exata"
                        {...signupForm.register('confirmPassword')}
                        className="pl-9 bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500"
                      />
                    </div>
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-[11px] text-rose-400">{signupForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer shadow-lg shadow-emerald-950/40"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando Conta Segura...
                      </>
                    ) : (
                      <>
                        Criar Minha Conta Grátis
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
