import { z } from 'zod'

// 1. Schema para validação dos Webhooks da Hotmart (Segurança do Servidor)
export const hotmartWebhookSchema = z.object({
  hottok: z
    .string()
    .trim()
    .min(1, 'Token de autenticação do webhook é obrigatório')
    .max(120, 'Token excede o limite seguro'),
  event: z.enum([
    'PURCHASE_APPROVED',
    'PURCHASE_COMPLETE',
    'SUBSCRIPTION_CANCELLATION',
    'SWITCH_PLAN',
  ]),
  data: z.object({
    buyer: z.object({
      email: z
        .string()
        .trim()
        .toLowerCase()
        .email('E-mail do comprador inválido')
        .max(120, 'E-mail excede o limite seguro'),
      name: z.string().trim().max(100).optional(),
    }),
    product: z.object({
      id: z.union([z.number(), z.string()]),
      name: z.string().max(100).optional(),
    }),
    purchase: z
      .object({
        status: z.string().max(50).optional(),
        approved_date: z.union([z.number(), z.string()]).optional(),
      })
      .optional(),
    subscription: z
      .object({
        plan: z
          .object({
            name: z.string().max(100).optional(),
          })
          .optional(),
      })
      .optional(),
  }),
})

export type HotmartWebhookPayload = z.infer<typeof hotmartWebhookSchema>

// 2. Schema para Seleção de Plano e Geração de Checkout
export const planSelectionSchema = z.object({
  plan: z.enum(['free', 'pro', 'agency']),
  userEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email('E-mail do usuário inválido')
    .max(120),
})

export type PlanSelectionData = z.infer<typeof planSelectionSchema>

// 3. Validador estrito de URL de checkout (Defesa contra XSS e Protocolos Perigosos)
export function isValidCheckoutUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  // Permite apenas https seguro e restringe a domínios da Hotmart ou links autorizados
  if (!trimmed.startsWith('https://')) return false
  if (trimmed.includes('javascript:') || trimmed.includes('data:')) return false
  return true
}
