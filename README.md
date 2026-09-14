# Gerador de Links UTM — Itaipu Parquetec

Aplicação web desenvolvida para a equipe de Comunicação e Marketing do Itaipu Parquetec, centralizando a geração padronizada de URLs rastreáveis (Google Analytics 4), o armazenamento seguro do histórico por projetos, a edição protegida de links e a exportação de guias estáticos (HTML autônomo com regras e botões de cópia em 1 clique) para o time de conteúdo e criação.

---

## Como Rodar Localmente

Siga os passos abaixo para executar o projeto no seu computador:

1. **Pré-requisitos:** Certifique-se de ter o [Node.js](https://nodejs.org/) (v20+ ou v22+) instalado.
2. **Abrir a pasta do projeto:** Abra o terminal no diretório do projeto:
   ```bash
   cd c:\xampp\htdocs\gerador-utm-itaipu-parquetec
   ```
3. **Instalar dependências (caso seja a primeira vez):**
   ```bash
   npm install
   ```
4. **Configurar variáveis de ambiente:**
   Copie o arquivo `.env.example` para `.env.local` (já configurado por padrão):
   ```bash
   cp .env.example .env.local
   ```
5. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
6. **Acessar no navegador:**  
   Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

---

## Stack Técnica

- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes & Acessibilidade:** [shadcn/ui](https://ui.shadcn.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Formulários & Validação:** `react-hook-form` + `zod`
- **Feedback Visual:** `sonner` (toasts)

---

## Documentação do Projeto

- 📄 [PRD — Documento de Requisitos do Produto](./PRD.md)
- 🛠️ [TECH_STACK — Planejamento Técnico e Arquitetura](./TECH_STACK.md)
