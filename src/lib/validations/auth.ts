import { z } from 'zod'

// 1. Schema para Login
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'O e-mail é obrigatório')
    .email('Insira um endereço de e-mail válido')
    .max(120, 'O e-mail deve ter no máximo 120 caracteres'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(72, 'A senha deve ter no máximo 72 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// 2. Schema para Cadastro com Força de Senha
export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'O nome deve ter pelo menos 2 caracteres')
      .max(80, 'O nome deve ter no máximo 80 caracteres'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'O e-mail é obrigatório')
      .email('Insira um endereço de e-mail válido')
      .max(120, 'O e-mail deve ter no máximo 120 caracteres'),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .max(72, 'A senha deve ter no máximo 72 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter ao menos 1 letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter ao menos 1 letra minúscula')
      .regex(/[0-9]/, 'A senha deve conter ao menos 1 número'),
    confirmPassword: z
      .string()
      .min(1, 'Confirme a sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type SignupFormData = z.infer<typeof signupSchema>

// 3. Schema para Recuperação de Senha
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'O e-mail é obrigatório')
    .email('Insira um endereço de e-mail válido')
    .max(120, 'O e-mail deve ter no máximo 120 caracteres'),
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// Utilitário para medir a força da senha visualmente (0 a 4)
export function calculatePasswordStrength(pass: string): {
  score: number
  label: string
  color: string
} {
  if (!pass) return { score: 0, label: 'Vazia', color: 'bg-zinc-200 dark:bg-zinc-700' }
  
  let score = 0
  if (pass.length >= 8) score++
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++
  if (/[0-9]/.test(pass)) score++
  if (/[^A-Za-z0-9]/.test(pass)) score++

  switch (score) {
    case 1:
      return { score: 1, label: 'Fraca', color: 'bg-rose-500' }
    case 2:
      return { score: 2, label: 'Razoável', color: 'bg-amber-500' }
    case 3:
      return { score: 3, label: 'Boa', color: 'bg-blue-500' }
    case 4:
      return { score: 4, label: 'Forte', color: 'bg-emerald-500' }
    default:
      return { score: 0, label: 'Muito Fraca', color: 'bg-rose-400' }
  }
}
