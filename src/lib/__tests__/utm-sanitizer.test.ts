import { describe, it, expect } from 'vitest'
import { sanitizeUtmParam, isValidUrl, buildUtmUrl } from '../utm-sanitizer'

describe('sanitizeUtmParam (Higienização de Parâmetros UTM)', () => {
  it('converte caracteres maiúsculos para minúsculos', () => {
    expect(sanitizeUtmParam('META-ADS')).toBe('meta-ads')
    expect(sanitizeUtmParam('GoogleAds')).toBe('googleads')
    expect(sanitizeUtmParam('CPC')).toBe('cpc')
  })

  it('remove acentos gráficos e caracteres diacríticos', () => {
    expect(sanitizeUtmParam('inscrição-verão')).toBe('inscricao-verao')
    expect(sanitizeUtmParam('ação-acadêmica')).toBe('acao-academica')
    expect(sanitizeUtmParam('inovação-tecnológica')).toBe('inovacao-tecnologica')
  })

  it('substitui espaços e caracteres especiais por hífens', () => {
    expect(sanitizeUtmParam('feed carrossel post')).toBe('feed-carrossel-post')
    expect(sanitizeUtmParam('criativo #1 (azul)')).toBe('criativo-1-azul')
    expect(sanitizeUtmParam('stories & reels')).toBe('stories-reels')
  })

  it('remove múltiplos hífens consecutivos e das extremidades', () => {
    expect(sanitizeUtmParam('---campanha---teste---')).toBe('campanha-teste')
    expect(sanitizeUtmParam('post--duplo--hifen')).toBe('post-duplo-hifen')
  })

  it('trata valores vazios com segurança', () => {
    expect(sanitizeUtmParam('')).toBe('')
    expect(sanitizeUtmParam('   ')).toBe('')
  })
})

describe('isValidUrl (Validação de Endereços Web)', () => {
  it('valida URLs completas com https:// ou http://', () => {
    expect(isValidUrl('https://itaipuparquetec.org.br')).toBe(true)
    expect(isValidUrl('http://itaipuparquetec.org.br/hackathon')).toBe(true)
  })

  it('aceita domínios digitados sem protocolo adicionando https implicitamente', () => {
    expect(isValidUrl('itaipuparquetec.org.br')).toBe(true)
    expect(isValidUrl('itaipuparquetec.org.br/editais?ano=2026')).toBe(true)
  })

  it('rejeita strings inválidas que não formam domínios web', () => {
    expect(isValidUrl('')).toBe(false)
    expect(isValidUrl('apenas-texto')).toBe(false)
    expect(isValidUrl('   ')).toBe(false)
  })
})

describe('buildUtmUrl (Construção Concatenação de URLs)', () => {
  it('anexa parâmetros UTM com ? quando a URL não possui parâmetros prévios', () => {
    const url = buildUtmUrl({
      urlDestino: 'https://itaipuparquetec.org.br',
      utmSource: 'Instagram',
      utmMedium: 'Stories',
      utmCampaign: 'Vestibular 2026',
    })

    expect(url).toBe(
      'https://itaipuparquetec.org.br/?utm_source=instagram&utm_medium=stories&utm_campaign=vestibular-2026'
    )
  })

  it('preserva parâmetros pré-existentes na URL usando & para concatenar', () => {
    const url = buildUtmUrl({
      urlDestino: 'https://itaipuparquetec.org.br/evento?origem=site&id=42',
      utmSource: 'meta-ads',
      utmMedium: 'cpc',
      utmCampaign: 'hackathon',
    })

    const parsed = new URL(url)
    expect(parsed.searchParams.get('origem')).toBe('site')
    expect(parsed.searchParams.get('id')).toBe('42')
    expect(parsed.searchParams.get('utm_source')).toBe('meta-ads')
    expect(parsed.searchParams.get('utm_medium')).toBe('cpc')
    expect(parsed.searchParams.get('utm_campaign')).toBe('hackathon')
  })

  it('inclui parâmetros opcionais utm_term e utm_content sanitizados', () => {
    const url = buildUtmUrl({
      urlDestino: 'https://itaipuparquetec.org.br',
      utmSource: 'google-ads',
      utmMedium: 'cpc',
      utmCampaign: 'edital-aceleracao',
      utmTerm: 'Startups DeepTech',
      utmContent: 'Botão Inscreva-se Já!',
    })

    expect(url).toContain('utm_term=startups-deeptech')
    expect(url).toContain('utm_content=botao-inscreva-se-ja')
  })
})
