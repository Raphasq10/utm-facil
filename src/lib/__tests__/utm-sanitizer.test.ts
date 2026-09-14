import { describe, it, expect } from 'vitest'
import { sanitizeUtmParam, isValidUrl, buildUtmUrl, buildCampaignName } from '../utm-sanitizer'

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
})

describe('isValidUrl (Validação de URL)', () => {
  it('valida URLs com e sem protocolo', () => {
    expect(isValidUrl('https://itaipuparquetec.org.br')).toBe(true)
    expect(isValidUrl('itaipuparquetec.org.br/hackathon')).toBe(true)
    expect(isValidUrl('invalido')).toBe(false)
  })
})

describe('buildCampaignName (Composição Estruturada de Campanha)', () => {
  it('monta o nome unificado da campanha com País, Produto, Macro e Micro Estratégia', () => {
    const campaign = buildCampaignName({
      pais: 'BR',
      produto: 'Edital Aceleração',
      macroEstrategia: 'Conversão',
      microEstrategia: 'Leads de Fevereiro',
    })

    expect(campaign).toBe('br_edital-aceleracao_conversao_leads-de-fevereiro')
  })

  it('monta nome de campanha mesmo se algum campo opcional não for preenchido', () => {
    const campaign = buildCampaignName({
      pais: 'BR',
      produto: 'Vestibular 2026',
    })

    expect(campaign).toBe('br_vestibular-2026')
  })
})

describe('buildUtmUrl (Construção da URL com os 9 Parâmetros Oficiais)', () => {
  it('monta URL completa com todos os parâmetros oficiais da referência', () => {
    const url = buildUtmUrl({
      urlDestino: 'https://itaipuparquetec.org.br/hackathon',
      pais: 'BR',
      canal: 'Social',
      produto: 'Hackathon 2026',
      source: 'Instagram',
      medium: 'Stories',
      macroEstrategia: 'Captação',
      identifier: 'Video 01 Teaser',
      microEstrategia: 'Inscrições Abertas',
    })

    expect(url).toContain('utm_source=instagram')
    expect(url).toContain('utm_medium=stories')
    expect(url).toContain('utm_campaign=br_hackathon-2026_captacao_inscricoes-abertas')
    expect(url).toContain('utm_content=video-01-teaser')
    expect(url).toContain('utm_term=social')
  })

  it('preserva parâmetros pré-existentes na URL usando &', () => {
    const url = buildUtmUrl({
      urlDestino: 'https://itaipuparquetec.org.br/evento?origem=portal',
      source: 'linkedin',
      medium: 'feed',
      produto: 'parcerias',
    })

    expect(url).toContain('origem=portal&')
    expect(url).toContain('utm_source=linkedin')
    expect(url).toContain('utm_medium=feed')
  })
})
