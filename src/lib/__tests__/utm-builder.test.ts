import { describe, it, expect } from 'vitest'
import { utmFormSchema } from '../validations/utm'
import { buildUtmUrl, sanitizeUtmParam } from '../utm-sanitizer'

describe('Construtor Inteligente de UTMs (Feature 4)', () => {
  describe('Validação com Zod (utmFormSchema)', () => {
    it('deve validar dados de formulário corretos e aplicar trim', () => {
      const result = utmFormSchema.safeParse({
        urlDestino: '  https://campanhautm.com.br/planos  ',
        source: '  instagram  ',
        medium: '  stories  ',
        campaignName: '  black-friday-2026  ',
        content: '  video-depoimento  ',
        term: '  marketing  ',
        descricao: '  anúncio no topo do feed  ',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.urlDestino).toBe('https://campanhautm.com.br/planos')
        expect(result.data.source).toBe('instagram')
      }
    })

    it('deve rejeitar URL vazia ou com formato inválido', () => {
      const resultEmpty = utmFormSchema.safeParse({
        urlDestino: '',
        source: 'google',
        medium: 'cpc',
        campaignName: 'campanha',
      })
      expect(resultEmpty.success).toBe(false)

      const resultInvalid = utmFormSchema.safeParse({
        urlDestino: 'url_invalida_sem_ponto',
        source: 'google',
        medium: 'cpc',
        campaignName: 'campanha',
      })
      expect(resultInvalid.success).toBe(false)
    })

    it('deve rejeitar URLs com protocolos maliciosos (XSS)', () => {
      const resultJs = utmFormSchema.safeParse({
        urlDestino: 'javascript:alert("XSS")',
        source: 'google',
        medium: 'cpc',
        campaignName: 'campanha',
      })
      expect(resultJs.success).toBe(false)
      if (!resultJs.success) {
        expect(resultJs.error.issues[0].message).toContain('Protocolo inseguro')
      }

      const resultData = utmFormSchema.safeParse({
        urlDestino: 'data:text/html,<script>alert(1)</script>',
        source: 'google',
        medium: 'cpc',
        campaignName: 'campanha',
      })
      expect(resultData.success).toBe(false)
    })

    it('deve rejeitar campos obrigatórios ausentes', () => {
      const resultNoSource = utmFormSchema.safeParse({
        urlDestino: 'https://exemplo.com',
        source: '',
        medium: 'stories',
        campaignName: 'campanha',
      })
      expect(resultNoSource.success).toBe(false)

      const resultNoCampaign = utmFormSchema.safeParse({
        urlDestino: 'https://exemplo.com',
        source: 'meta',
        medium: 'feed',
        campaignName: '',
      })
      expect(resultNoCampaign.success).toBe(false)
    })
  })

  describe('Tratamento de Query Strings Existentes (? e &) e Âncoras (#)', () => {
    it('deve anexar ? quando a URL não possui parâmetros prévios', () => {
      const url = buildUtmUrl({
        urlDestino: 'https://minhaloja.com.br/tenis',
        source: 'instagram',
        medium: 'stories',
        campaignName: 'natal-2026',
      })
      expect(url).toBe('https://minhaloja.com.br/tenis?utm_source=instagram&utm_medium=stories&utm_campaign=natal-2026')
    })

    it('deve preservar parâmetros existentes e concatenar com &', () => {
      const url = buildUtmUrl({
        urlDestino: 'https://minhaloja.com.br/tenis?cupom=10OFF&afiliado=123',
        source: 'google',
        medium: 'cpc',
        campaignName: 'busca-marcas',
      })
      expect(url).toContain('cupom=10OFF')
      expect(url).toContain('afiliado=123')
      expect(url).toContain('&utm_source=google')
      expect(url).toContain('&utm_medium=cpc')
      expect(url).toContain('&utm_campaign=busca-marcas')
    })

    it('deve posicionar âncoras (#hash) no final da URL após as UTMs', () => {
      const url = buildUtmUrl({
        urlDestino: 'https://minhaloja.com.br/landing#tabela-precos',
        source: 'email',
        medium: 'newsletter',
        campaignName: 'disparo-semanal',
      })
      expect(url).toContain('utm_source=email')
      expect(url.endsWith('#tabela-precos')).toBe(true)
    })
  })

  describe('Higienização Rigorosa GA4 (sanitizeUtmParam)', () => {
    it('deve converter para minúsculas, remover acentos e substituir espaços por hífens', () => {
      expect(sanitizeUtmParam('PROMOÇÃO DE VERÃO 2026!')).toBe('promocao-de-verao-2026')
      expect(sanitizeUtmParam('Ação Social & Educação')).toBe('acao-social-educacao')
      expect(sanitizeUtmParam('   espaços   extras   ')).toBe('espacos-extras')
      expect(sanitizeUtmParam('Criativo #01 (Versão Azul)')).toBe('criativo-01-versao-azul')
    })
  })
})
