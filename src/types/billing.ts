export type PlanTier = 'free' | 'pro' | 'agency'

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing'

export interface PlanDetails {
  id: PlanTier
  name: string
  price: number
  billingPeriod: string
  description: string
  features: string[]
  maxProjects: number
  maxLinksPerProject: number
  allowHtmlExport: boolean
  isPopular?: boolean
  hotmartCheckoutUrl: string
}

export const PLAN_CONFIGS: Record<PlanTier, PlanDetails> = {
  free: {
    id: 'free',
    name: 'Plano Free (Iniciante)',
    price: 0,
    billingPeriod: 'Para sempre',
    description: 'Ideal para validar o fluxo e gerenciar sua primeira campanha.',
    features: [
      '1 Projeto / Cliente ativo',
      'Até 25 links UTM rastreáveis',
      'Higienização automática GA4',
      'Exportação em planilha CSV',
      'Guia de regras de taxonomia',
    ],
    maxProjects: 1,
    maxLinksPerProject: 25,
    allowHtmlExport: false,
    hotmartCheckoutUrl: '',
  },
  pro: {
    id: 'pro',
    name: 'Plano Pro (Profissional)',
    price: 47,
    billingPeriod: 'mês',
    description: 'Para gestores de tráfego e e-commerces em expansão.',
    features: [
      'Até 10 Projetos / Clientes simultâneos',
      'Links UTM ilimitados por projeto',
      'Exportação de Guia HTML autônomo offline',
      'Exportação completa em CSV',
      'Histórico ilimitado e busca instantânea',
      'Suporte via e-mail prioritário',
    ],
    maxProjects: 10,
    maxLinksPerProject: Infinity,
    allowHtmlExport: true,
    isPopular: true,
    hotmartCheckoutUrl: 'https://pay.hotmart.com/J108170260D',
  },
  agency: {
    id: 'agency',
    name: 'Plano Agency (Escala)',
    price: 127,
    billingPeriod: 'mês',
    description: 'Para agências com múltiplos gestores e grandes operações.',
    features: [
      'Projetos e Clientes ilimitados',
      'Links UTM 100% ilimitados',
      'Exportação HTML + CSV sem restrições',
      'Multi-usuários / Equipe compartilhada (v1.1)',
      'Suporte prioritário via WhatsApp',
    ],
    maxProjects: Infinity,
    maxLinksPerProject: Infinity,
    allowHtmlExport: true,
    hotmartCheckoutUrl: 'https://pay.hotmart.com/AGENCY_CAMPANHA_UTM',
  },
}
