import { describe, it, expect, beforeEach } from 'vitest'
import { projectSchema } from '../validations/project'
import {
  saveProject,
  getProjects,
  updateProject,
  deleteProject,
  saveLink,
  getLinks,
  clearDatabase,
} from '../storage'

describe('Gestão de Projetos e Validações Zod (Feature 3)', () => {
  describe('projectSchema (Validação Zod)', () => {
    it('deve aceitar nome de projeto válido e aplicar trim', () => {
      const result = projectSchema.safeParse({
        name: '   Campanha Black Friday 2026   ',
        description: 'Links para anúncios de Meta e Google Ads',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Campanha Black Friday 2026')
      }
    })

    it('deve rejeitar nome muito curto (menos de 2 caracteres)', () => {
      const result = projectSchema.safeParse({
        name: 'A',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('pelo menos 2 caracteres')
      }
    })

    it('deve rejeitar nome vazio ou apenas com espaços', () => {
      const result = projectSchema.safeParse({
        name: '    ',
      })
      expect(result.success).toBe(false)
    })

    it('deve rejeitar nome maior que 80 caracteres', () => {
      const longName = 'A'.repeat(81)
      const result = projectSchema.safeParse({
        name: longName,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('máximo 80 caracteres')
      }
    })

    it('deve aceitar projeto sem descrição (opcional)', () => {
      const result = projectSchema.safeParse({
        name: 'Projeto Sem Descrição',
      })
      expect(result.success).toBe(true)
    })

    it('deve rejeitar descrição maior que 250 caracteres', () => {
      const longDesc = 'D'.repeat(251)
      const result = projectSchema.safeParse({
        name: 'Projeto Teste',
        description: longDesc,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('Operações de Projetos e Autorização (Multi-Tenancy & CRUD)', () => {
    beforeEach(() => {
      clearDatabase()
    })

    it('deve criar e atualizar projeto com sucesso', () => {
      const userA = 'user-test-123'
      const proj = saveProject('Vestibular 2026', 'Início das campanhas', userA)
      expect(proj.name).toBe('Vestibular 2026')

      const updated = updateProject(
        proj.id,
        { name: 'Vestibular Parquetec 2026', description: 'Descrição atualizada' },
        userA
      )
      expect(updated).not.toBeNull()
      expect(updated?.name).toBe('Vestibular Parquetec 2026')
      expect(updated?.description).toBe('Descrição atualizada')
    })

    it('deve impedir que outro usuário atualize projeto alheio (Autorização)', () => {
      const userA = 'user-owner'
      const userB = 'user-attacker'

      const proj = saveProject('Projeto Confidencial', 'Notas secretas', userA)

      // Usuário B tenta atualizar o projeto do Usuário A
      const attempt = updateProject(
        proj.id,
        { name: 'Tentativa de Hack' },
        userB
      )

      expect(attempt).toBeNull()

      // Confere se o nome original permaneceu intacto
      const userAProjects = getProjects(userA)
      expect(userAProjects[0].name).toBe('Projeto Confidencial')
    })

    it('deve excluir projeto e todos os seus links vinculados em cascata', () => {
      const userA = 'user-owner'
      const proj = saveProject('Projeto a Deletar', '', userA)

      // Adiciona link vinculado ao projeto
      saveLink(
        {
          projectId: proj.id,
          urlDestino: 'https://exemplo.com',
          urlFinal: 'https://exemplo.com?utm_source=meta',
          pais: 'BR',
          canal: 'Social',
          produto: 'App',
          source: 'meta',
          medium: 'cpc',
          macroEstrategia: 'conversao',
          identifier: 'ad1',
        },
        userA
      )

      expect(getLinks(proj.id, userA).length).toBe(1)

      // Exclui o projeto
      deleteProject(proj.id, userA)

      // Confere se o projeto foi removido
      const remainingProjects = getProjects(userA)
      expect(remainingProjects.find((p) => p.id === proj.id)).toBeUndefined()

      // Confere se os links do projeto também foram removidos
      expect(getLinks(proj.id, userA).length).toBe(0)
    })
  })
})
