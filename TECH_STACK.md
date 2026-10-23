# Planejamento Técnico e Arquitetura do MVP (v2.0 — Comercial / SaaS)
## CampanhaUTM (`campanhautm.com.br`)

Este documento serve como o mapa da arquitetura técnica do **CampanhaUTM**, escrito em linguagem clara, direta e acessível para quem tem perfil de **Web Designer** e está aprendendo a desenvolver aplicações web modernas e seguras.

---

## 1. Stack Frontend

### Escolha Recomendada: **Vite + React (TypeScript)**

Dentre as quatro alternativas analisadas:
- **Next.js 15 (App Router):** Excelente se o produto dependesse de blogs públicos ou dezenas de páginas indexadas no Google (SEO). Como o CampanhaUTM é um **painel operacional de uso interno e fechado por login**, o Next.js adicionaria complexidade desnecessária de servidores e renderização híbrida.
- **Vite + React:** **A escolha perfeita.** É a ferramenta padrão do mercado para construir dashboards rápidos: inicia instantaneamente, atualiza a tela no milissegundo em que você edita o código (Hot Module Replacement) e tem uma curva de aprendizado direta para quem vem do design.
- **Astro:** Ideal para sites institucionais estáticos com pouco dinamismo. Não é indicado para um SaaS com formulários interativos e banco de dados reativo.
- **HTML/CSS/JS puro:** Ficaria desorganizado e difícil de manter à medida que o sistema ganhasse regras de autenticação, validações e múltiplos modais.

#### Por que essa escolha se encaixa perfeitamente no PRD:
Nosso prazo de lançamento é **01/11**. Precisamos de uma stack veloz, com zero tempo de compilação pesado e que permita construir a interface com componentes visuais reutilizáveis. O Vite entrega tudo isso de forma limpa.

#### Trade-offs (concessões) aceitos:
Abrimos mão de renderização prévia no servidor (SSR), o que significa que o Google não lê os conteúdos dinâmicos dentro do painel logado (o que não tem problema nenhum, pois links e campanhas de clientes são informações privadas).

#### Versões Recomendadas:
- **Vite:** 8.x
- **React:** 19.x (com TypeScript para evitar erros comuns de digitação de nomes de variáveis)

#### O que você precisa instalado no seu computador:
- **Node.js (LTS 20 ou 22):** O motor que executa JavaScript no seu sistema (gratuito em [nodejs.org](https://nodejs.org/)).
- **VS Code:** O editor de código visual padrão.
- **Git:** Para salvar e versionar seu trabalho no GitHub.

---

## 2. Estilização: Tailwind CSS + shadcn/ui

### Por que Tailwind CSS?
Para quem vem do design, o **Tailwind CSS** é muito prático: em vez de criar dezenas de arquivos `.css` separados e inventar nomes difíceis de classes (como `.box-wrapper-inner-link`), você aplica o estilo diretamente no elemento visual através de classes padronizadas (`flex`, `p-4`, `text-emerald-600`, `rounded-xl`).
- O Tailwind v4 já vem com uma escala profissional de cores, sombras e espaçamentos, impedindo que a interface fique desalinhada ou com tamanhos improvisados.

### Por que shadcn/ui?
Diferente de bibliotecas antigas que você instala como um bloco fechado que não pode ser customizado, o **shadcn/ui** copia o código dos componentes diretamente para dentro da sua pasta `src/components/ui/`.
- **Controle Total de Design:** Se você quiser mudar o raio da borda de um botão, a cor de destaque da marca (`emerald`) ou a sombra de um card, o código está na sua mão.
- **Acessibilidade Nativa (WCAG 2.1 AA):** Todos os modais fecham no `Esc`, os botões recebem foco por teclado para deficientes visuais e os leitores de tela funcionam automaticamente.

---

## 3. Backend e Banco de Dados

> **O que é um "Backend"?**  
> É o cérebro que roda nos bastidores (em um servidor na nuvem), longe dos olhos do usuário. Ele processa regras confidenciais de negócio, valida se uma senha está certa e se comunica com o banco de dados.  
>  
> **O que é um "Banco de Dados"?**  
> É o caderno de anotações seguro e permanente onde guardamos informações estruturadas (como a lista de usuários, projetos e links gerados) para que nada desapareça quando a página for recarregada.

### Recomendação: **Supabase (PostgreSQL Gerenciado)**
- **Como funciona no tutorial:** O aluno desenvolverá o fluxo localmente e integrará o Supabase seguindo o **Anexo A**.
- **Por que o Supabase:** Ele entrega um banco de dados relacional poderoso (PostgreSQL) com uma interface visual parecida com uma planilha do Excel. Além disso, conta com o **Row Level Security (RLS)**, garantindo que nenhum usuário consiga ver ou mexer nos links do projeto de outro usuário.

---

## 4. Autenticação

> **O que é Autenticação?**  
> É o processo de conferir o crachá digital da pessoa — como pedir e-mail e senha antes de permitir que alguém acerte ou acesse uma área privada da empresa.

### Recomendação: **Supabase Auth**
- O Supabase Auth já resolve criptografia de senhas, envio de e-mails para recuperação de senha esquecida e emissão de tokens de sessão seguros (JWT) sem você precisar programar sistemas complexos de criptografia do zero.

---

## 5. Pagamentos (Monetização e Assinaturas)

> **O que é um Gateway de Pagamento?**  
> É a empresa financeira intermediadora (como Hotmart, Stripe ou Mercado Pago) que processa transações de cartão de crédito e Pix de forma segura, cuidando da cobrança sem que sua aplicação precise lidar com dados bancários sensíveis.

### Recomendação Principal: **Hotmart (com suporte a Webhooks)**
*(Opção secundária internacional: Stripe)*

#### Por que a Hotmart faz tanto sentido para o CampanhaUTM no Brasil?
1. **Confiança e Familiaridade:** Todo gestor de tráfego, agência e produtor de marketing digital no Brasil já possui cadastro ou compra frequentemente pela Hotmart.
2. **Pix Instantâneo:** No Brasil, o Pix é responsável por mais de 50% das contratações rápidas de ferramentas e infoprodutos. A Hotmart gerencia o Pix nativamente com compensação em segundos.
3. **Cartão de Crédito Nacional e Parcelamento:** Aceita cartões emitidos no Brasil sem risco de bloqueio de compras internacionais.
4. **Checkout Hospedado:** Você não precisa programar telas de cartão de crédito nem se preocupar com certificações bancárias (PCI-DSS). Ao clicar em "Assinar Plano Pro", o usuário vai para o checkout oficial da Hotmart.
5. **Webhooks Automáticos:** Assim que o cliente paga na Hotmart, a Hotmart envia um aviso automático (*webhook*) para a sua aplicação dizendo: `"O e-mail rodrigo@agencia.com.br pagou o plano Pro"`. O sistema atualiza o perfil do usuário para `plan: 'pro'` no mesmo instante!

---

## 6. Hospedagem (Planejamento Futuro)

> **O que é Hospedagem?**  
> É o computador especial ("servidor") conectado à internet 24 horas por dia para onde enviamos os arquivos do site, para que qualquer pessoa consiga acessá-lo através de um link público como `campanhautm.com.br`.

- **Durante o Desenvolvimento do MVP:** O aplicativo roda **100% no seu computador (`http://localhost:5174/`)**. Você não gasta nada e não precisa configurar servidores agora.
- **Quando for Publicar na Internet (Anexo C do Tutorial):** A recomendação oficial é a **Vercel**:
  - Gratuita para começar.
  - Conecta-se diretamente ao seu GitHub: a cada novo commit, ela atualiza o site na internet automaticamente.
  - Gera certificado de segurança HTTPS (cadeado verde) automático.
  - Fornece funções serverless para receber os webhooks da Hotmart com estabilidade.

---

## 7. Bibliotecas Principais (Apenas o Essencial)

| Biblioteca | O que ela faz em 1 linha | Por que é necessária no nosso MVP |
| :--- | :--- | :--- |
| **`react-hook-form`** | Gerencia os campos dos formulários sem travar a digitação do usuário. | O construtor de UTM tem vários campos e precisa responder de forma instantânea. |
| **`zod`** | Validador rigoroso de dados com regras de segurança. | Impede e-mails inválidos, senhas fracas ou URLs quebradas antes de salvar. |
| **`@supabase/supabase-js`** | Biblioteca oficial que conversa com o banco e autenticação do Supabase. | Permite cadastrar usuários, logar e ler projetos isolados via RLS. |
| **`lucide-react`** | Coleção moderna e consistente de ícones vetoriais em SVG. | Ícones visuais de copiar, pastas, cadeado de edição, check e download. |
| **`sonner`** | Sistema de notificações flutuantes e elegantes ("Toasts"). | Mostra avisos de sucesso imediatos ("Link copiado!", "Projeto criado com sucesso"). |
| **`clsx` + `tailwind-merge`** | Utilitário (`cn`) para combinar e concatenar classes do Tailwind dinamicamente. | Essencial para o funcionamento correto dos componentes do shadcn/ui. |

---

## 8. Estrutura de Pastas

```
utms-generator-facil/
├── public/                  # Arquivos estáticos servidos diretamente (logo, favicons)
├── docs/                    # Documentação técnica e roteiros de testes manuais
│   └── tests/               # Guias passo a passo para o aluno testar no navegador
├── supabase/                # Scripts SQL e configurações do banco de dados na nuvem
│   └── schema.sql           # Tabelas e regras de segurança (RLS) para colar no Supabase
├── src/
│   ├── assets/              # Imagens e ilustrações locais da aplicação
│   ├── components/          # Pedaços visuais reutilizáveis da interface
│   │   ├── ui/              # Componentes base do shadcn (botões, inputs, cards, modais)
│   │   ├── AuthView.tsx     # Tela visual de Login, Cadastro e Recuperação de Senha
│   │   ├── Header.tsx       # Cabeçalho com logo, seletor de projetos, perfil e logout
│   │   ├── UtmBuilder.tsx   # Formulário com higienização em tempo real e preview de UTM
│   │   ├── LinksTable.tsx   # Tabela histórica com busca rápida, cópia em 1 clique e ações
│   │   ├── TaxonomyRules.tsx# Card visual com as regras e convenções do Itaipu Parquetec/GA4
│   │   ├── ProjectModal.tsx # Modal para cadastrar novas pastas de campanhas
│   │   ├── EditLinkModal.tsx# Modal protegido para alterar parâmetros de links existentes
│   │   └── ExportModal.tsx  # Modal para baixar o arquivo HTML autônomo ou planilha CSV
│   ├── contexts/            # Estados globais compartilhados da aplicação
│   │   └── AuthContext.tsx  # Gerenciador global de usuário logado e sessão ativa
│   ├── lib/                 # Funções lógicas e utilitárias sem parte visual
│   │   ├── validations/     # Schemas Zod de segurança (auth.ts, utm.ts)
│   │   ├── supabase.ts      # Conexão segura com a API do Supabase
│   │   ├── utm-sanitizer.ts # A lógica que converte textos em minúsculas, hífens e sem acentos
│   │   ├── html-exporter.ts # Gera o arquivo HTML offline para os criadores de conteúdo
│   │   ├── csv-exporter.ts  # Gera a planilha CSV para download
│   │   ├── storage.ts       # Camada de persistência multi-tenant (com suporte local e nuvem)
│   │   └── utils.ts         # Utilitário 'cn' para estilos do Tailwind
│   ├── types/               # Definições TypeScript do formato dos dados (Project, UtmLink)
│   │   └── index.ts
│   ├── App.tsx              # Componente principal que junta todos os blocos na tela
│   ├── main.tsx             # Ponto de entrada que inicializa o React e o AuthProvider
│   └── index.css            # Estilos globais e importação do Tailwind CSS v4
├── .env.example             # Modelo das variáveis de configuração (sem senhas reais)
├── package.json             # Lista de dependências e comandos do projeto
└── vite.config.ts           # Configuração do Vite e apelidos de importação (@/)
```

---

## 9. Variáveis de Ambiente (`.env`)

As variáveis de ambiente guardam configurações que mudam de acordo com o ambiente (no seu computador ou na internet), mantendo segredos longe do código compartilhado no GitHub.

### 9.1. Variáveis Públicas (Podem ser lidas pelo navegador do usuário)
No Vite, variáveis públicas começam obrigatoriamente com o prefixo `VITE_`:

| Variável | O que é | Onde obter | Consequência se for pública |
| :--- | :--- | :--- | :--- |
| `VITE_APP_TITLE` | Título oficial que aparece na aba do navegador. | Definido por você no `.env`. | Nenhuma. É um dado puramente visual. |
| `VITE_SUPABASE_URL` | O endereço web do seu projeto no Supabase. | No painel do Supabase: *Project Settings > API*. | Nenhuma. É pública por padrão; a segurança é feita pelas regras RLS do banco. |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anônima do cliente Supabase. | No painel do Supabase: *Project Settings > API*. | Nenhuma, pois ela só tem permissão para o que as políticas RLS permitirem. |
| `VITE_HOTMART_CHECKOUT_PRO` | Link direto do checkout do plano Pro na Hotmart. | No painel da Hotmart: *Produtos > Links de Divulgação*. | Nenhuma. É o link público onde o cliente clica para pagar. |

### 9.2. Variáveis Secretas (NUNCA podem ir para o navegador — apenas no servidor / Vercel)
Essas variáveis **NUNCA** devem ter o prefixo `VITE_` e devem ser guardadas exclusivamente no servidor:

| Variável | O que é | Onde obter | Consequência se vazar |
| :--- | :--- | :--- | :--- |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave mestra do Supabase que ignora as regras do RLS. | No painel do Supabase: *Project Settings > API*. | **CRÍTICA:** Se vazar, um atacante pode ler, alterar ou apagar todos os dados de todos os usuários do banco! |
| `HOTMART_WEBHOOK_TOKEN` | Token secreto de validação enviado pela Hotmart nos webhooks. | No painel da Hotmart: *Ferramentas > Webhook (API)*. | **ALTA:** Se vazar, uma pessoa mal-intencionada poderia forjar pagamentos falsos e liberar planos pagos de graça. |

---

## 10. Riscos Técnicos e Como Mitigá-los

1. **Risco 1: Quebra de Isolamento entre Clientes (Vazamento de Projetos)**
   - *O que é:* O usuário da Agência A conseguir visualizar os links e campanhas da Agência B.
   - *Como mitigar:* Ativação obrigatória do **Row Level Security (RLS)** em todas as tabelas do Supabase (`projects` e `utm_links`) com a condição `auth.uid() = user_id`. Nenhuma linha é devolvida se o usuário não for o dono legítimo.
2. **Risco 2: Falha na Entrega de Webhook da Hotmart (Cliente pagou mas não liberou o plano)**
   - *O que é:* O cliente paga via Pix na Hotmart, mas a internet da Vercel oscila e o webhook falha no recebimento.
   - *Como mitigar:* Implementar um endpoint de webhook idempotente que registra as tentativas e configurar a função de reenvio automático (*retry*) oferecida nativamente pela Hotmart.
3. **Risco 3: URLs Inválidas ou Caracteres Proibidos Quebrarem o GA4**
   - *O que é:* O usuário digitar parâmetros com acentos (`promoção`), espaços ou interrogações mal posicionadas que dividem a URL.
   - *Como mitigar:* Validação dupla: o formulário higieniza em tempo real enquanto o usuário digita através do [`utm-sanitizer.ts`](file:///c:/xampp/htdocs/utms-generator-facil/src/lib/utm-sanitizer.ts) e a camada de persistência revalida com Zod antes de gravar.
4. **Risco 4: Bloqueio de Acesso com Mudança de Portas Locais**
   - *O que é:* O aluno já ter outro projeto rodando na porta 5173 do XAMPP e o Vite tentar abrir em outra porta sem aviso.
   - *Como mitigar:* Fixamos explicitamente a porta `5174` no [`vite.config.ts`](file:///c:/xampp/htdocs/utms-generator-facil/vite.config.ts) para evitar conflitos de portas com outros projetos do XAMPP.

---

## 11. Ordem de Implementação Recomendada

1. **Etapa 1 — Setup e Validações Seguras:** Configurar Vite, TypeScript, Tailwind CSS e schemas Zod. *(Concluída)*
2. **Etapa 2 — Feature 1: Autenticação e Multi-Tenancy:** Cadastro, login, recuperação de senha, telas visuais e isolamento de projetos por conta. *(Concluída)*
3. **Etapa 3 — Feature 2: Gestão de Planos & Assinaturas Hotmart:** Modal de limites de uso, tabela visual de planos, redirecionamento para o checkout Hotmart e endpoint para receber notificações de pagamento. *(Próximo passo)*
4. **Etapa 4 — Feature 3: Construtor Avançado e Banco de Links:** Refinamento do gerador com atalhos de canais comuns e exportação (HTML/CSV). *(Concluída no MVP local)*
5. **Etapa 5 — Conexão Supabase na Nuvem (Anexo A):** Execução do script `supabase/schema.sql` e preenchimento das chaves no `.env`.
6. **Etapa 6 — Publicação na Internet via Vercel (Anexo C):** Subir para a internet com domínio próprio `campanhautm.com.br` e HTTPS ativo.
