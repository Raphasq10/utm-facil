# Planejamento Técnico e Arquitetura do MVP
## Gerador de Links UTM — Itaipu Parquetec

Este documento serve como o mapa técnico do projeto, escrito de forma clara e acessível para quem tem perfil de **Web Designer** e está dando os primeiros passos no desenvolvimento de aplicações interativas.

---

## 1. Stack Frontend

### Escolha Recomendada: **Vite + React (TypeScript)**
*(Opção alternativa igualmente viável: Next.js 15, caso o curso exija a estrutura do App Router)*

- **Por que essa escolha se encaixa perfeitamente no PRD:**  
  O nosso produto é uma **ferramenta de uso interno (dashboard operacional)**. Ele não precisa de indexação de busca pública no Google (SEO) nem de renderização pesada no servidor para páginas públicas. O **Vite + React** é o padrão moderno da indústria para construir ferramentas rápidas e painéis: ele inicia instantaneamente no seu computador, atualiza a tela no mesmo segundo em que você altera o código (Hot Module Replacement) e possui uma curva de aprendizado muito mais suave e direta para quem vem do design.
- **Trade-offs aceitos:**  
  Abrimos mão da renderização prévia no servidor (SSR) e de rotas automáticas de servidor (Server Components), que seriam complexidade desnecessária para um gerador de links local. O resultado é um código muito mais fácil de ler, debugar e manter.
- **Versão recomendada:**  
  - Vite 6+
  - React 18 ou 19 (com TypeScript para evitar erros comuns de digitação)
- **O que você precisa instalar no computador:**  
  - **Node.js (versão LTS 20 ou 22):** O ambiente que executa o JavaScript no seu sistema (baixa direto em [nodejs.org](https://nodejs.org/)).
  - **VS Code:** O editor de código padrão da indústria.
  - O terminal do VS Code ou PowerShell para rodar os comandos do projeto.

---

## 2. Estilização: Tailwind CSS + shadcn/ui

### Por que Tailwind CSS?
Para um designer, o **Tailwind CSS** é intuitivo porque você não precisa ficar inventando nomes de classes em arquivos CSS separados (como `.box-container-wrapper-final`). Você aplica estilos direto no elemento visual usando classes utilitárias padronizadas (`flex`, `p-4`, `text-blue-600`, `rounded-lg`). Ele já vem com uma escala perfeita de espaçamentos, tipografia e cores, garantindo consistência visual de ponta a ponta sem você ter que medir pixels manualmente.

### Por que shadcn/ui?
Ao contrário de outras bibliotecas de componentes que você instala como um pacote fechado e não consegue mudar nada, o **shadcn/ui** copia o código dos componentes diretamente para dentro da pasta do seu projeto.
- **Vantagem para Designers:** Se você quiser alterar o raio de curvatura de um botão, a sombra de um card ou o fundo de um modal para as cores do Itaipu Parquetec, você tem 100% de controle visual.
- **Acessibilidade nativa:** Os modais fecham no botão `Esc`, os botões têm foco acessível para teclado e os leitores de tela funcionam por padrão (em conformidade com a WCAG 2.1 AA exigida no PRD).

---

## 3. Backend e Banco de Dados

> **O que é um "Backend"?**  
> É o cérebro que roda nos bastidores (fora do navegador do usuário). Ele processa regras críticas de negócio, valida senhas e conversa com o banco de dados.  
> **O que é um "Banco de Dados"?**  
> É o caderno de anotações seguro e permanente onde guardamos informações estruturadas (como a lista de projetos e o histórico de links criados) para que nada se perca quando a página for recarregada.

### Recomendação para o MVP:
1. **Fase 1 (MVP Local Imediato):** Armazenamento em **LocalStorage com persistência reativa** ou banco local simples em arquivo JSON/SQLite.  
   *Justificativa:* Permite que você veja a aplicação funcionando 100% no seu computador hoje mesmo, com zero dependências externas ou cadastros em plataformas de nuvem.
2. **Fase 2 (Próximo Passo — Anexo A do Tutorial):** Migração para o **Supabase (PostgreSQL gratuito)**.  
   *Justificativa:* O Supabase oferece um banco de dados real na nuvem com API pronta e painel visual intuitivo (parecido com uma planilha do Excel), permitindo que, futuramente, toda a equipe do Itaipu Parquetec acesse o mesmo banco de links em tempo real de qualquer lugar.

---

## 4. Autenticação (Acesso Especial para Edição)

> **O que é Autenticação?**  
> É o processo de conferir se a pessoa é realmente quem ela diz ser — como pedir um crachá, login e senha ou uma chave secreta antes de permitir que alguém entre em uma área reservada.

### Recomendação:
- **Para o MVP Local:** Como definido no PRD, qualquer pessoa da equipe pode consultar, buscar e copiar links livremente. Para a ação de **editar ou excluir um link existente**, o sistema exibirá um modal solicitando a **Chave de Acesso Especial** (uma senha mestra de edição).
- **Evolução (Anexo A):** Quando você integrar o Supabase, usaremos o **Supabase Auth**, que gerencia login e permissões sem você precisar programar sistemas complexos de criptografia do zero.

---

## 5. Pagamentos

> **O que é um Gateway de Pagamento?**  
> É a empresa intermediadora (como o Stripe ou Mercado Pago) que processa com segurança transações financeiras de cartão de crédito, PIX e assinaturas.

- **Definição para este projeto:**  
  **NÃO APLICÁVEL.** O Gerador de UTMs do Itaipu Parquetec é uma ferramenta de uso interno institucional e 100% gratuita. O Anexo B do tutorial de pagamentos está dispensado deste escopo.

---

## 6. Hospedagem (Planejamento Futuro)

> **O que é Hospedagem?**  
> É o computador especial ("servidor") conectado à internet 24 horas por dia para onde você envia os arquivos do seu site, para que qualquer pessoa do mundo consiga acessá-lo através de um link público.

- **Durante o desenvolvimento do MVP:**  
  O aplicativo rodará **100% na sua máquina local (`http://localhost:5173`)**. Você não gasta nada e não precisa configurar servidores.
- **Quando for publicar na internet (Anexo C):**  
  A recomendação padrão será a **Vercel** (ou GitHub Pages). A Vercel se conecta diretamente ao seu repositório no GitHub: toda vez que você envia uma alteração, ela constrói o site automaticamente, gera um link público seguro com HTTPS (cadeado verde) e oferece um plano gratuito generoso para projetos desse porte.

---

## 7. Bibliotecas Principais (Apenas o Essencial)

| Biblioteca | O que ela faz em 1 linha | Por que é necessária no nosso MVP |
| :--- | :--- | :--- |
| **`react-hook-form`** | Gerencia formulários sem travar ou deixar a digitação lenta. | O formulário de UTM tem vários campos e precisa responder rápido. |
| **`zod`** | Validador de dados com regras de segurança rígidas. | Garante que a URL seja válida e que os campos obrigatórios estejam preenchidos antes de salvar. |
| **`lucide-react`** | Pacote moderno de ícones vetoriais leves e elegantes. | Ícones de copiar, check, editar, lixeira, pastas de projetos e download. |
| **`sonner`** | Sistema de alertas rápidos e elegantes ("Toasts"). | Avisa o usuário na tela quando o link for "Copiado com sucesso!" ou "Salvo com sucesso". |
| **`clsx` + `tailwind-merge`** | Utilitário (`cn`) para combinar classes CSS do Tailwind dinamicamente. | Obrigatório para o funcionamento correto e sem conflitos dos componentes shadcn/ui. |

---

## 8. Estrutura de Pastas do Projeto

A organização das pastas foi pensada para ser limpa e fácil de navegar:

```
gerador-utm-itaipu-parquetec/
├── public/                 # Arquivos estáticos (logo do Itaipu Parquetec, favicons)
├── src/
│   ├── assets/             # Imagens e ícones locais da aplicação
│   ├── components/         # Pedaços visuais reutilizáveis da interface
│   │   ├── ui/             # Componentes base do shadcn (botões, inputs, modais, cards)
│   │   ├── ProjectSelector.tsx  # Seletor e criador de Projetos
│   │   ├── UtmBuilder.tsx       # Formulário com higienização e preview de UTM
│   │   ├── TaxonomyRules.tsx    # Card visual com as regras e exemplos para a equipe
│   │   ├── LinksTable.tsx       # Tabela histórica com busca, cópia e ações
│   │   ├── EditLinkModal.tsx    # Modal protegido por senha para editar links
│   │   └── ExportModal.tsx      # Modal para baixar o arquivo HTML ou CSV
│   ├── lib/                # Funções de apoio e lógica que não têm parte visual
│   │   ├── utm-sanitizer.ts     # A função que transforma textos em minúsculas e hífens
│   │   ├── html-exporter.ts     # A função que monta o arquivo HTML estático para o time de conteúdo
│   │   ├── csv-exporter.ts      # A função que gera o arquivo de planilha CSV
│   │   └── storage.ts           # A camada que lê e salva os dados no banco/storage
│   ├── types/              # Definições do formato dos dados (Projeto, Link, etc.)
│   │   └── index.ts
│   ├── App.tsx             # A página principal que junta todos os blocos visuais
│   ├── main.tsx            # O ponto de entrada que inicializa o React
│   └── index.css           # Configurações do Tailwind CSS e fontes
├── .env.example            # Modelo das variáveis de configuração (sem senhas reais)
├── index.html              # O HTML principal do navegador
├── package.json            # Lista de dependências e comandos do projeto
└── vite.config.ts          # Configuração do Vite
```

---

## 9. Variáveis de Ambiente (`.env`)

Variáveis de ambiente são configurações que mudam conforme o lugar onde o sistema está rodando (na sua máquina ou na nuvem), mantendo segredos longe do código compartilhado.

```env
# ==========================================================
# VARIÁVEIS PÚBLICAS (Acessíveis pelo navegador)
# ==========================================================
VITE_APP_TITLE="Gerador de Links UTM — Itaipu Parquetec"
VITE_DEFAULT_PROJECT_NAME="Geral"

# ==========================================================
# VARIÁVEIS SECRETAS / OPERACIONAIS (Configurações restritas)
# ==========================================================
# Senha mestra inicial para habilitar o modo de edição de links no MVP Local
VITE_EDITOR_MASTER_KEY="parquetec2026"
```

### Explicação de Segurança:
1. **Públicas (`VITE_...` informativos):**  
   - *O que são:* Textos como nome da ferramenta ou preferências de layout.  
   - *Risco se vazar:* Nenhum.
2. **Chave de Edição (`VITE_EDITOR_MASTER_KEY`):**  
   - *O que é:* A senha que o usuário digita para liberar o modal de edição de um link no MVP local.  
   - *Consequência se vazar:* Qualquer colaborador com acesso ao código local poderia editar ou excluir links cadastrados por engano. *(Na Fase 2 com Supabase, essa senha simples será substituída pelo Supabase Auth com login individual e seguro)*.

---

## 10. Riscos Técnicos e Como Mitigá-los

1. **Risco 1: Quebra de URLs já existentes com parâmetros prévios**  
   *O Problema:* Se a página de destino já tiver um ponto de interrogação (ex: `https://site.com/evento?id=123`), concatenar com outro `?` quebra a URL.  
   *Mitigação:* Usar a API nativa de URLs do navegador (`new URL()`), que insere `?` ou `&` de forma matematicamente perfeita.
2. **Risco 2: Perda de dados no navegador ao limpar cache (na Fase Local)**  
   *O Problema:* Se o colaborador limpar os dados de navegação do Chrome, o histórico do LocalStorage local pode ser apagado.  
   *Mitigação:* Criar um alerta amigável na interface recomendando o backup via botão "Exportar CSV", preparando a transição suave para o Supabase (Anexo A).
3. **Risco 3: Falha na exportação do HTML autônomo para a equipe de conteúdo**  
   *O Problema:* O arquivo HTML exportado ficar com visual quebrado em computadores sem internet.  
   *Mitigação:* O gerador do arquivo `html-exporter.ts` embutirá os estilos CSS essenciais diretamente dentro da tag `<style>` do próprio arquivo gerado. Ele abrirá com design perfeito em qualquer computador, mesmo sem internet!

---

## 11. Ordem de Implementação Recomendada

Cada etapa constrói a base necessária para a seguinte:

1. **Etapa 3: Setup do Ambiente**  
   Criar a estrutura do Vite + React + Tailwind CSS e inicializar o repositório Git local.
2. **Etapa 4: Interface (UI) e Componentes Base**  
   Criar o layout profissional com o cabeçalho do Itaipu Parquetec, o seletor de projetos e os cards estruturais com shadcn/ui.
3. **Etapa 5: Features Core (MVP)**  
   - Construir o formulário de UTM com sanitização em tempo real (minúsculas, sem acentos, hífens).
   - Implementar o painel visual com as regras de taxonomia.
   - Criar o banco de links com histórico, busca e botão de cópia.
   - Implementar a exportação de arquivo HTML estático autônomo e CSV.
   - Proteger a edição com o modal de chave especial.
4. **Etapa 6: Testes e Validação**  
   Testar casos extremos de digitação de URLs, caracteres especiais e validação de cópia.
5. **Etapa 7: Auditoria de Segurança**  
   Verificar higienização de inputs e integridade dos dados.
6. **Etapa 8: Pós-MVP e Transição para Anexos**  
   Preparação para persistência em nuvem (Anexo A - Supabase) e publicação (Anexo C - Vercel).
