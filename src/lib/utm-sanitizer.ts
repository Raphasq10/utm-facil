/**
 * Utilitário de Sanitização e Construção de UTMs (Google Analytics 4)
 * Higienização estrita:
 * - Converte para minúsculas
 * - Remove acentos e caracteres especiais
 * - Substitui espaços e caracteres proibidos por hífens
 * - Suporta URLs com query strings existentes (? e &) e âncoras (#)
 */

export function sanitizeUtmParam(value: string): string {
  if (!value) return ''

  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export interface UtmInput {
  urlDestino: string
  source: string
  medium: string
  campaignName?: string
  pais?: string
  canal?: string
  produto?: string
  macroEstrategia?: string
  identifier?: string
  microEstrategia?: string
}

export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  try {
    const parsed = new URL(
      trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`
    )
    return Boolean(parsed.hostname && parsed.hostname.includes('.'))
  } catch {
    return false
  }
}

/**
 * Constrói o nome unificado e padronizado da campanha (utm_campaign)
 * Composição: [pais]_[produto]_[macroEstrategia]_[microEstrategia]
 * Exemplo: br_hub-inovacao_aceleracao_leads-fevereiro
 */
export function buildCampaignName(input: {
  pais?: string
  produto?: string
  macroEstrategia?: string
  microEstrategia?: string
}): string {
  const parts = [
    input.pais ? sanitizeUtmParam(input.pais) : '',
    input.produto ? sanitizeUtmParam(input.produto) : '',
    input.macroEstrategia ? sanitizeUtmParam(input.macroEstrategia) : '',
    input.microEstrategia ? sanitizeUtmParam(input.microEstrategia) : '',
  ].filter(Boolean)

  return parts.join('_')
}

/**
 * Constrói a URL final parametrizada para o Google Analytics 4
 * Preserva parâmetros existentes (? e &) e âncoras de seção (#hash)
 */
export function buildUtmUrl(input: UtmInput): string {
  const rawUrl = input.urlDestino ? input.urlDestino.trim() : ''
  if (!rawUrl) return ''

  const fullUrl =
    rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
      ? rawUrl
      : `https://${rawUrl}`

  try {
    const url = new URL(fullUrl)

    const source = sanitizeUtmParam(input.source)
    const medium = sanitizeUtmParam(input.medium)
    const campaign = input.campaignName
      ? sanitizeUtmParam(input.campaignName)
      : buildCampaignName({
          pais: input.pais,
          produto: input.produto,
          macroEstrategia: input.macroEstrategia,
          microEstrategia: input.microEstrategia,
        })
    const content = input.identifier ? sanitizeUtmParam(input.identifier) : ''
    const term = input.canal ? sanitizeUtmParam(input.canal) : ''

    if (source) url.searchParams.set('utm_source', source)
    if (medium) url.searchParams.set('utm_medium', medium)
    if (campaign) url.searchParams.set('utm_campaign', campaign)
    if (content) url.searchParams.set('utm_content', content)
    if (term) url.searchParams.set('utm_term', term)

    return url.toString()
  } catch {
    return ''
  }
}
