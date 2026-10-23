import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  passwordSchema,
  calculatePasswordStrength,
} from '../validations/auth'

describe('Validações de Autenticação com Zod', () => {
  describe('loginSchema', () => {
    it('deve validar credenciais corretas e higienizar email', () => {
      const result = loginSchema.safeParse({
        email: '  Usuario@Agencia.com.BR ',
        password: 'senhaSegura123',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('usuario@agencia.com.br')
      }
    })

    it('deve rejeitar e-mail inválido', () => {
      const result = loginSchema.safeParse({
        email: 'email-invalido',
        password: 'senhaSegura123',
      })
      expect(result.success).toBe(false)
    })

    it('deve rejeitar senha muito curta', () => {
      const result = loginSchema.safeParse({
        email: 'gestor@agencia.com',
        password: '123',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('passwordSchema (Segurança Estrita - 10 caracteres)', () => {
    it('deve aceitar senha com 10 caracteres contendo maiúscula, minúscula e número', () => {
      const result = passwordSchema.safeParse('SenhaForte1')
      expect(result.success).toBe(true)
    })

    it('deve rejeitar senha com menos de 10 caracteres', () => {
      const result = passwordSchema.safeParse('Senha1!')
      expect(result.success).toBe(false)
    })

    it('deve rejeitar senha sem número', () => {
      const result = passwordSchema.safeParse('SenhaMuitoLonga')
      expect(result.success).toBe(false)
    })

    it('deve rejeitar senha sem maiúscula', () => {
      const result = passwordSchema.safeParse('senhaforte1234')
      expect(result.success).toBe(false)
    })
  })

  describe('signupSchema (com Honeypot Anti-Bot)', () => {
    it('deve aceitar cadastro válido com senha forte e honeypot vazio', () => {
      const result = signupSchema.safeParse({
        fullName: 'Rodrigo Martins',
        email: 'rodrigo@agenciatrafego.com.br',
        password: 'SenhaForte2026',
        confirmPassword: 'SenhaForte2026',
        website: '',
      })
      expect(result.success).toBe(true)
    })

    it('deve rejeitar quando bot preencher o campo honeypot', () => {
      const result = signupSchema.safeParse({
        fullName: 'Bot Spammer',
        email: 'bot@spam.com',
        password: 'SenhaForte2026',
        confirmPassword: 'SenhaForte2026',
        website: 'https://spam-link.com',
      })
      expect(result.success).toBe(false)
    })

    it('deve rejeitar senhas que não coincidem', () => {
      const result = signupSchema.safeParse({
        fullName: 'Rodrigo Martins',
        email: 'rodrigo@agenciatrafego.com.br',
        password: 'SenhaForte2026',
        confirmPassword: 'OutraSenhaDiferente2026',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('updatePasswordSchema', () => {
    it('deve validar redefinição de senha com requisitos de segurança', () => {
      const result = updatePasswordSchema.safeParse({
        password: 'NovaSenhaForte2026',
        confirmPassword: 'NovaSenhaForte2026',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('resetPasswordSchema', () => {
    it('deve validar e-mail de recuperação', () => {
      const result = resetPasswordSchema.safeParse({
        email: 'contato@loja.com.br',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('calculatePasswordStrength', () => {
    it('deve calcular níveis de força gradativos', () => {
      expect(calculatePasswordStrength('').score).toBe(0)
      expect(calculatePasswordStrength('abc').score).toBe(0)
      expect(calculatePasswordStrength('abcdefgh').score).toBe(1)
      expect(calculatePasswordStrength('Abcdefgh').score).toBe(2)
      expect(calculatePasswordStrength('Abcdefgh1').score).toBe(3)
      expect(calculatePasswordStrength('Abcdefgh1!').score).toBe(4)
    })
  })
})
