import { z } from 'zod'

// 1. Schemas Base Obrigatórios com Tipagem Rigorosa
export const passwordSchema = z
  .string()
  .min(10, 'Senha deve ter no mínimo 10 caracteres')
  .max(72, 'Senha muito longa')
  .regex(/[A-Z]/, 'Senha deve conter ao menos uma maiúscula')
  .regex(/[a-z]/, 'Senha deve conter ao menos uma minúscula')
  .regex(/[0-9]/, 'Senha deve conter ao menos um número')

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'O e-mail é obrigatório')
  .email('Email inválido')
  .max(255, 'O email deve ter no máximo 255 caracteres')

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, 'O nome deve ter pelo menos 2 caracteres')
  .max(100, 'O nome deve ter no máximo 100 caracteres')

// 2. Schema para Login
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(72, 'A senha deve ter no máximo 72 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// 3. Schema para Cadastro com Honeypot e Confirmação de Senha
export const signupSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme a sua senha'),
    // Campo Honeypot invisível: bots costumam preencher todos os inputs.
    // Usuários humanos não enxergam e deixam vazio.
    website: z.string().max(0, 'Acesso automatizado detectado').optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type SignupFormData = z.infer<typeof signupSchema>

// 4. Schema para Solicitação de Recuperação de Senha (Forgot Password)
export const resetPasswordSchema = z.object({
  email: emailSchema,
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// 5. Schema para Troca de Nova Senha (/reset-password)
export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>

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
      return { score: 3, label: 'Forte', color: 'bg-blue-500' }
    case 4:
      return { score: 4, label: 'Excelente', color: 'bg-emerald-500' }
    default:
      return { score: 0, label: 'Muito Fraca', color: 'bg-rose-400' }
  }
}
