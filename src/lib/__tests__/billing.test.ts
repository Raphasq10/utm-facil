import { describe, it, expect } from 'vitest'
import {
  checkProjectLimit,
  checkLinkLimit,
  canExportHtml,
  buildHotmartCheckoutUrl,
  processHotmartWebhook,
} from '../billing'
import { hotmartWebhookSchema, isValidCheckoutUrl } from '../validations/billing'

describe('Módulo de Faturamento e Assinaturas (Feature 2)', () => {
  describe('Limites por Plano (Plan Limits)', () => {
    it('deve limitar o Plano Free a 1 projeto', () => {
      expect(checkProjectLimit('free', 0).allowed).toBe(true)
      expect(checkProjectLimit('free', 1).allowed).toBe(false)
      expect(checkProjectLimit('free', 2).allowed).toBe(false)
    })

    it('deve limitar o Plano Pro a 10 projetos', () => {
      expect(checkProjectLimit('pro', 9).allowed).toBe(true)
      expect(checkProjectLimit('pro', 10).allowed).toBe(false)
    })

    it('deve permitir projetos ilimitados no Plano Agency', () => {
      expect(checkProjectLimit('agency', 999).allowed).toBe(true)
    })

    it('deve limitar links no Free e permitir ilimitado no Pro', () => {
      expect(checkLinkLimit('free', 24).allowed).toBe(true)
      expect(checkLinkLimit('free', 25).allowed).toBe(false)
      expect(checkLinkLimit('pro', 500).allowed).toBe(true)
    })

    it('deve restringir exportação HTML apenas para Pro e Agency', () => {
      expect(canExportHtml('free')).toBe(false)
      expect(canExportHtml('pro')).toBe(true)
      expect(canExportHtml('agency')).toBe(true)
    })
  })

  describe('Validação Segura de URLs de Checkout', () => {
    it('deve aceitar links HTTPS válidos da Hotmart', () => {
      expect(isValidCheckoutUrl('https://pay.hotmart.com/PRO123')).toBe(true)
    })

    it('deve rejeitar links inseguros ou scripts maliciosos (XSS)', () => {
      expect(isValidCheckoutUrl('http://inseguro.com')).toBe(false)
      expect(isValidCheckoutUrl('javascript:alert(1)')).toBe(false)
      expect(isValidCheckoutUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
    })

    it('deve anexar e-mail do usuário de forma codificada na URL', () => {
      const url = buildHotmartCheckoutUrl('pro', 'rodrigo@agencia.com.br')
      expect(url).toContain('email=rodrigo%40agencia.com.br')
      expect(url).toContain('sck=campanhautm_dashboard')
    })
  })

  describe('Validação do Schema de Webhooks Hotmart com Zod', () => {
    it('deve validar um payload autêntico da Hotmart', () => {
      const validPayload = {
        hottok: 'token_secreto_123',
        event: 'PURCHASE_APPROVED',
        data: {
          buyer: {
            email: 'comprador@agencia.com.br',
            name: 'Rodrigo Martins',
          },
          product: {
            id: 987654,
            name: 'CampanhaUTM Pro',
          },
          purchase: {
            status: 'approved',
          },
        },
      }
      const result = hotmartWebhookSchema.safeParse(validPayload)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar payload sem token ou com e-mail inválido', () => {
      const invalidPayload = {
        hottok: '',
        event: 'PURCHASE_APPROVED',
        data: {
          buyer: {
            email: 'email_invalido',
          },
          product: {
            id: 123,
          },
        },
      }
      const result = hotmartWebhookSchema.safeParse(invalidPayload)
      expect(result.success).toBe(false)
    })
  })

  describe('Processamento de Webhooks (Proteção de Mass Assignment)', () => {
    it('deve processar PURCHASE_APPROVED e retornar plano correto', () => {
      const payload = {
        hottok: 'demo_hotmart_token',
        event: 'PURCHASE_APPROVED',
        data: {
          buyer: {
            email: 'gestor@agencia.com.br',
          },
          product: {
            id: 111,
            name: 'CampanhaUTM Plano Pro',
          },
        },
      }

      const res = processHotmartWebhook(payload, 'demo_hotmart_token')
      expect(res.success).toBe(true)
      expect(res.action).toBe('UPGRADE')
      expect(res.targetEmail).toBe('gestor@agencia.com.br')
      expect(res.newPlan).toBe('pro')
    })

    it('deve processar SUBSCRIPTION_CANCELLATION e reverter para Free', () => {
      const payload = {
        hottok: 'demo_hotmart_token',
        event: 'SUBSCRIPTION_CANCELLATION',
        data: {
          buyer: {
            email: 'gestor@agencia.com.br',
          },
          product: {
            id: 111,
          },
        },
      }

      const res = processHotmartWebhook(payload, 'demo_hotmart_token')
      expect(res.success).toBe(true)
      expect(res.action).toBe('DOWNGRADE')
      expect(res.newPlan).toBe('free')
    })

    it('deve rejeitar token falso ou não autorizado', () => {
      const payload = {
        hottok: 'token_falso_atacante',
        event: 'PURCHASE_APPROVED',
        data: {
          buyer: {
            email: 'hacker@malicioso.com',
          },
          product: {
            id: 111,
          },
        },
      }

      const res = processHotmartWebhook(payload, 'token_real_esperado')
      expect(res.success).toBe(false)
      expect(res.error).toContain('Token de autenticação')
    })
  })
})
