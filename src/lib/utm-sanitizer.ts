/**
 * Utilitário de Sanitização e Construção de UTMs
 * Itaipu Parquetec — Comunicação & Marketing
 */

/**
 * Higieniza um valor de parâmetro UTM:
 * - Converte para minúsculas
 * - Remove acentos e caracteres diacríticos (ex: "é" -> "e", "ç" -> "c")
 * - Substitui espaços e caracteres especiais não permitidos por hífens (-)
 * - Remove hífens duplicados e remove hífens do início/fim
 */
export function sanitizeUtmParam(value: string): string {
  if (!value) return ''

  return value
    .trim()
    .toLowerCase()
    // Decompõe caracteres acentuados em caractere base + diacrítico
    .normalize('NFD')
    // Remove os diacríticos
    .replace(/[\u0300-\u036f]/g, '')
    // Substitui caracteres não alfanuméricos (exceto hífen e sublinhado) por hífen
    .replace(/[^a-z0-9-_]+/g, '-')
    // Remove múltiplos hífens consecutivos
    .replace(/-+/g, '-')
    // Remove hífens no início e no final
    .replace(/^-+|-+$/g, '')
}

export interface UtmInput {
  urlDestino: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm?: string
  utmContent?: string
}

/**
 * Valida se uma URL base possui formato válido com protocolo (http:// ou https://)
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  try {
    const parsed = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`)
    return Boolean(parsed.hostname && parsed.hostname.includes('.'))
  } catch {
    return false
  }
}

/**
 * Normaliza e constrói a URL final com todos os parâmetros UTM
 * Garante que parâmetros pré-existentes na URL sejam preservados e que a concatenação
 * com ? ou & seja 100% válida.
 */
export function buildUtmUrl(input: UtmInput): string {
  const rawUrl = input.urlDestino ? input.urlDestino.trim() : ''
  if (!rawUrl) return ''

  // Adiciona https:// caso o usuário digite apenas o domínio (ex: itaipuparquetec.org.br)
  const fullUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
    ? rawUrl
    : `https://${rawUrl}`

  try {
    const url = new URL(fullUrl)

    const source = sanitizeUtmParam(input.utmSource)
    const medium = sanitizeUtmParam(input.utmMedium)
    const campaign = sanitizeUtmParam(input.utmCampaign)
    const term = input.utmTerm ? sanitizeUtmParam(input.utmTerm) : ''
    const content = input.utmContent ? sanitizeUtmParam(input.utmContent) : ''

    if (source) url.searchParams.set('utm_source', source)
    if (medium) url.searchParams.set('utm_medium', medium)
    if (campaign) url.searchParams.set('utm_campaign', campaign)
    if (term) url.searchParams.set('utm_term', term)
    if (content) url.searchParams.set('utm_content', content)

    return url.toString()
  } catch {
    return ''
  }
}
