# Pós-MVP — Próximos Passos e Roteiro de Iteração
## Gerador de Links UTM — Itaipu Parquetec

Este documento orienta a evolução do produto após a validação bem-sucedida do MVP local pela equipe de Comunicação e Marketing.

---

## 1. Status Atual do MVP

- ✅ **Etapa 1:** PRD completo e alinhado (`PRD.md`)
- ✅ **Etapa 2:** Planejamento Técnico e Arquitetura (`TECH_STACK.md`)
- ✅ **Etapa 3:** Setup do Ambiente com repositório Git (`README.md`)
- ✅ **Etapa 4:** Interface completa (UI) com Tailwind CSS e componentes acessíveis
- ✅ **Etapa 5:** Features Core funcionando (Projetos, Construtor UTM com Sanitização, Banco de Links, Exportação HTML/CSV, Modo Editor)
- ✅ **Etapa 6:** 11 Testes Automatizados com Vitest (`npm run test`)
- ✅ **Etapa 7:** Auditoria de Segurança aprovada (`SECURITY_AUDIT.md`)
- ✅ **Skills Integradas:** `frontend-design`, `vite`, `vercel-react-best-practices`

---

## 2. Roteiro dos Anexos Opcionais (Conforme Tutorial Original)

### Anexo A: Migração para Banco de Dados em Nuvem (Supabase)
Quando a equipe desejar que múltiplos colaboradores alimentem o mesmo banco de dados simultaneamente sem depender de exportações:
1. Criar um projeto gratuito no [Supabase](https://supabase.com).
2. Criar as tabelas `projects` e `utm_links` com chaves estrangeiras.
3. Ativar o **Row Level Security (RLS)**:
   - Política `SELECT`: pública para qualquer usuário autenticado ou anônimo com a chave da instituição.
   - Políticas `INSERT`, `UPDATE`, `DELETE`: restritas aos colaboradores com login administrativo (Supabase Auth).
4. Substituir as chamadas de `src/lib/storage.ts` pelas chamadas do cliente `@supabase/supabase-js`.

### Anexo B: Pagamentos (Stripe)
- **Status:** **Dispensado permanentemente.** Ferramenta interna e institucional do Itaipu Parquetec.

### Anexo C: Publicação na Internet (Vercel ou GitHub Pages)
1. **Opção 1 — Vercel (Recomendada no TECH_STACK):**
   - Importar o repositório do GitHub na Vercel.
   - Configurar a variável `VITE_EDITOR_MASTER_KEY` nas configurações de Environment Variables da Vercel.
   - Deploy automático com HTTPS e domínio gratuito `.vercel.app`.
2. **Opção 2 — GitHub Pages:**
   - Adicionar o comando `base: './'` no `vite.config.ts`.
   - Gerar a pasta `dist` via `npm run build` e publicar via GitHub Actions.

---

## 3. Melhorias Sugeridas para a Versão 1.1 (Backlog)

1. **Importador de CSV Antigo:** Um botão para ler a planilha antiga do Google Sheets em `.csv` e importar automaticamente os links legados para um projeto "Histórico RD Station".
2. **Geração em Lote (Batch Generator):** Permitir gerar múltiplos links de uma só vez para os mesmos criativos (ex: selecionar Instagram Stories + Feed + LinkedIn e gerar 3 links de uma só vez).
3. **QR Code Generator Integrado:** Um botão ao lado de cada link que gera um código QR em formato PNG/SVG pronto para download e envio aos designers de materiais impressos.
