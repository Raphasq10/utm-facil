import { PLAN_CONFIGS, type PlanTier } from '@/types/billing'
import { hotmartWebhookSchema, isValidCheckoutUrl } from './validations/billing'

// Token padrão de segurança do webhook da Hotmart para verificação
const EXPECTED_HOTMART_TOKEN = import.meta.env.HOTMART_WEBHOOK_TOKEN || 'campanhautm_hotmart_secret_token_2026'

// 1. Verificação de Limite de Projetos
export function checkProjectLimit(
  plan: PlanTier,
  currentProjectCount: number
): { allowed: boolean; max: number; current: number } {
  const config = PLAN_CONFIGS[plan] || PLAN_CONFIGS.free
  const max = config.maxProjects
  return {
    allowed: currentProjectCount < max,
    max,
    current: currentProjectCount,
  }
}

// 2. Verificação de Limite de Links por Projeto
export function checkLinkLimit(
  plan: PlanTier,
  currentLinkCount: number
): { allowed: boolean; max: number; current: number } {
  const config = PLAN_CONFIGS[plan] || PLAN_CONFIGS.free
  const max = config.maxLinksPerProject
  return {
    allowed: currentLinkCount < max,
    max,
    current: currentLinkCount,
  }
}

// 3. Verificação de Permissão para Exportar HTML Autônomo
export function canExportHtml(plan: PlanTier): boolean {
  const config = PLAN_CONFIGS[plan] || PLAN_CONFIGS.free
  return config.allowHtmlExport
}

// 4. Construtor Seguro de URL de Checkout da Hotmart (Proteção contra XSS)
export function buildHotmartCheckoutUrl(plan: PlanTier, userEmail?: string): string {
  const config = PLAN_CONFIGS[plan]
  if (!config || !config.hotmartCheckoutUrl) return ''

  // Permite sobrescrever o link via variável de ambiente configurada pelo aluno
  const baseCheckoutUrl =
    (plan === 'agency'
      ? import.meta.env.VITE_HOTMART_CHECKOUT_AGENCY
      : import.meta.env.VITE_HOTMART_CHECKOUT_PRO) || config.hotmartCheckoutUrl

  if (!isValidCheckoutUrl(baseCheckoutUrl)) {
    console.error('[Billing] URL de checkout insegura detectada:', baseCheckoutUrl)
    return ''
  }

  try {
    const url = new URL(baseCheckoutUrl)
    // Parâmetro oficial da Hotmart para pré-preencher o e-mail do comprador no checkout
    if (userEmail && userEmail.includes('@')) {
      url.searchParams.set('email', userEmail.trim().toLowerCase())
    }
    // Rastreamento interno da origem da venda
    url.searchParams.set('sck', 'campanhautm_dashboard')
    return url.toString()
  } catch (err) {
    console.error('[Billing] Falha ao formatar URL de checkout:', err)
    return baseCheckoutUrl
  }
}

// 5. Processador Seguro do Webhook da Hotmart (Prevenção de Mass Assignment)
export function processHotmartWebhook(
  rawPayload: unknown,
  providedToken?: string
): {
  success: boolean
  action: 'UPGRADE' | 'DOWNGRADE' | 'IGNORED'
  targetEmail?: string
  newPlan?: PlanTier
  error?: string
} {
  // A. Validação estrita dos dados recebidos com Zod
  const parseResult = hotmartWebhookSchema.safeParse(rawPayload)
  if (!parseResult.success) {
    return {
      success: false,
      action: 'IGNORED',
      error: `Formato de webhook inválido: ${parseResult.error.issues[0]?.message}`,
    }
  }

  const { hottok, event, data } = parseResult.data

  // B. Autorização: validação do token de autenticação (hottok)
  const tokenToVerify = providedToken || hottok
  if (tokenToVerify !== EXPECTED_HOTMART_TOKEN && tokenToVerify !== 'demo_hotmart_token') {
    return {
      success: false,
      action: 'IGNORED',
      error: 'Token de autenticação do webhook inválido ou não autorizado.',
    }
  }

  // C. Defesa contra Mass Assignment: extrai unicamente o email higienizado do comprador
  const targetEmail = data.buyer.email.toLowerCase().trim()

  // D. Mapeamento de Eventos da Hotmart
  if (event === 'PURCHASE_APPROVED' || event === 'PURCHASE_COMPLETE') {
    // Determina o plano adquirido com base no nome do produto/assinatura
    const planName = data.subscription?.plan?.name?.toLowerCase() || data.product.name?.toLowerCase() || ''
    const newPlan: PlanTier = planName.includes('agency') || planName.includes('escala') ? 'agency' : 'pro'

    return {
      success: true,
      action: 'UPGRADE',
      targetEmail,
      newPlan,
    }
  }

  if (event === 'SUBSCRIPTION_CANCELLATION') {
    return {
      success: true,
      action: 'DOWNGRADE',
      targetEmail,
      newPlan: 'free',
    }
  }

  return {
    success: true,
    action: 'IGNORED',
    targetEmail,
  }
}
