import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  calculatePasswordStrength,
  type LoginFormData,
  type SignupFormData,
  type ResetPasswordFormData,
} from '@/lib/validations/auth'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Sparkles,
  ShieldCheck,
  Zap,
  FolderKanban,
} from 'lucide-react'

type AuthMode = 'login' | 'signup' | 'reset'

interface AuthViewProps {
  initialMode?: 'login' | 'signup'
  onBackToLanding?: () => void
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onBackToLanding,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const { signIn, signUp, resetPassword, isDemoMode } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Form de Login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // 2. Form de Cadastro
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  })

  // 3. Form de Recuperação de Senha
  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  })

  // Observador de senha para calcular força em tempo real
  const watchedSignupPassword = signupForm.watch('password')
  const passwordStrength = calculatePasswordStrength(watchedSignupPassword || '')

  // Handlers de submissão com proteção contra Race Conditions
  const handleLoginSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await signIn(data)
      if (!res.success) {
        toast.error(res.error || 'Falha ao autenticar.')
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
        toast.error(res.error || 'Falha ao criar conta.')
      } else {
        toast.success(res.message || 'Conta criada com sucesso!')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetSubmit = async (data: ResetPasswordFormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await resetPassword(data)
      if (!res.success) {
        toast.error(res.error || 'Falha na recuperação de senha.')
      } else {
        toast.success(res.message || 'Instruções enviadas com sucesso.')
        setMode('login')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-100 to-emerald-50/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white relative">
      {/* Botão de Retorno à Landing Page */}
      {onBackToLanding && (
        <div className="w-full max-w-4xl mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Página Inicial
          </button>
        </div>
      )}

      {/* Banner de Demonstração quando Supabase ainda não estiver conectado no .env */}
      {isDemoMode && (
        <div className="w-full max-w-4xl mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Modo Demonstração Local Ativo:</strong> Você pode se cadastrar e logar imediatamente. Para sincronizar com a nuvem, preencha as chaves no arquivo <code className="bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">.env</code>.
            </span>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden">
        {/* Coluna da Esquerda: Apresentação da Marca & Proposta de Valor */}
        <div className="hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-emerald-600 via-teal-700 to-zinc-900 text-white relative overflow-hidden">
          {/* Efeito decorativo de fundo */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-medium mb-6">
              <Zap className="w-3.5 h-3.5 text-emerald-300" />
              <span>SaaS de Taxonomia GA4 & Performance</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight mb-3">
              Campanha<span className="text-emerald-300">UTM</span>
            </h1>
            <p className="text-emerald-100 text-sm leading-relaxed mb-6">
              Centralize, higienize e proteja os links de tráfego de toda a sua agência ou e-commerce sem depender de planilhas frágeis.
            </p>

            <div className="space-y-4 text-sm text-emerald-50">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <span>
                  <strong>Higienização Automática:</strong> 100% de conformidade com o Google Analytics 4 (sem maiúsculas ou acentos).
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FolderKanban className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <span>
                  <strong>Organização por Projetos:</strong> Separe campanhas por cliente ou linha de produto com isolamento estrito.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <span>
                  <strong>Exportação Portátil:</strong> Gere guias HTML autônomos e planilhas CSV para criadores em 1 clique.
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200">
            <span>campanhautm.com.br</span>
            <span>Versão 2.0 (SaaS)</span>
          </div>
        </div>

        {/* Coluna da Direita: Formulários com Validação */}
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          {/* 1. Modo LOGIN */}
          {mode === 'login' && (
            <Card className="border-0 shadow-none bg-transparent p-0">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Acessar Plataforma
                </CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400">
                  Entre com suas credenciais para gerenciar seus links e projetos.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0 space-y-4">
                <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email">E-mail Corporativo</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu.email@agencia.com.br"
                        maxLength={120}
                        autoComplete="email"
                        className="pl-9"
                        disabled={isSubmitting}
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-rose-500 font-medium">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Senha</Label>
                      <button
                        type="button"
                        onClick={() => setMode('reset')}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                        tabIndex={0}
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        maxLength={72}
                        autoComplete="current-password"
                        className="pl-9"
                        disabled={isSubmitting}
                        {...loginForm.register('password')}
                      />
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-rose-500 font-medium">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 mt-2 transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Autenticando...
                      </>
                    ) : (
                      <>
                        Entrar no Painel
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="px-0 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-center text-sm text-zinc-500 dark:text-zinc-400">
                Ainda não tem conta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="ml-1 text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer"
                >
                  Cadastre-se grátis
                </button>
              </CardFooter>
            </Card>
          )}

          {/* 2. Modo CADASTRO (Sign Up) */}
          {mode === 'signup' && (
            <Card className="border-0 shadow-none bg-transparent p-0">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Criar Conta Gratuita
                </CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400">
                  Comece no Plano Free com 1 projeto e até 25 links hoje mesmo.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0 space-y-4">
                <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-3" noValidate>
                  <div className="space-y-1">
                    <Label htmlFor="signup-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Ex: Rodrigo Martins"
                        maxLength={80}
                        autoComplete="name"
                        className="pl-9"
                        disabled={isSubmitting}
                        {...signupForm.register('fullName')}
                      />
                    </div>
                    {signupForm.formState.errors.fullName && (
                      <p className="text-xs text-rose-500 font-medium">{signupForm.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="signup-email">E-mail Profissional</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="rodrigo@agencia.com.br"
                        maxLength={120}
                        autoComplete="email"
                        className="pl-9"
                        disabled={isSubmitting}
                        {...signupForm.register('email')}
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="text-xs text-rose-500 font-medium">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="signup-password">Senha (mínimo 8 caracteres, maiúscula e número)</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        maxLength={72}
                        autoComplete="new-password"
                        className="pl-9"
                        disabled={isSubmitting}
                        {...signupForm.register('password')}
                      />
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-xs text-rose-500 font-medium">{signupForm.formState.errors.password.message}</p>
                    )}

                    {/* Medidor visual de força da senha */}
                    {watchedSignupPassword && (
                      <div className="pt-1.5 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">Força da senha:</span>
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">{passwordStrength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex gap-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`h-full flex-1 transition-all duration-300 ${
                                step <= passwordStrength.score ? passwordStrength.color : 'bg-transparent'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="signup-confirm">Confirmação de Senha</Label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        maxLength={72}
                        autoComplete="new-password"
                        className="pl-9"
                        disabled={isSubmitting}
                        {...signupForm.register('confirmPassword')}
                      />
                    </div>
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-rose-500 font-medium">
                        {signupForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 mt-2 transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        Concluir Cadastro
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="px-0 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-center text-sm text-zinc-500 dark:text-zinc-400">
                Já possui uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="ml-1 text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer"
                >
                  Entrar
                </button>
              </CardFooter>
            </Card>
          )}

          {/* 3. Modo RECUPERAÇÃO DE SENHA (Reset) */}
          {mode === 'reset' && (
            <Card className="border-0 shadow-none bg-transparent p-0">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Recuperar Senha
                </CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400">
                  Digite seu e-mail cadastrado para enviarmos um link seguro de redefinição.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0 space-y-4">
                <form onSubmit={resetForm.handleSubmit(handleResetSubmit)} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="reset-email">E-mail Cadastrado</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="seu.email@agencia.com.br"
                        maxLength={120}
                        autoComplete="email"
                        className="pl-9"
                        disabled={isSubmitting}
                        {...resetForm.register('email')}
                      />
                    </div>
                    {resetForm.formState.errors.email && (
                      <p className="text-xs text-rose-500 font-medium">{resetForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 mt-2 transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando instruções...
                      </>
                    ) : (
                      'Enviar Link de Recuperação'
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="px-0 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-center text-sm text-zinc-500 dark:text-zinc-400">
                Lembrou da senha?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="ml-1 text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer"
                >
                  Voltar para o Login
                </button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
