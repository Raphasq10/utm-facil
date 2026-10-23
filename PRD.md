# PRD — Documento de Requisitos do Produto (v2.0 — Comercial / SaaS)
## CampanhaUTM (campanhautm.com.br) — Central de Links UTM & Taxonomia de Campanhas

---

## 1. Visão Geral

- **Nome Oficial do Produto:** **CampanhaUTM**
- **Domínio Oficial:** `campanhautm.com.br`
- **Elevator Pitch:** Para agências de tráfego pago e e-commerces que perdem vendas e tempo tentando padronizar URLs em planilhas dispersas e propensas a erros humanos, o **CampanhaUTM** é uma plataforma SaaS acessível que centraliza a criação, validação e governança de links UTM por cliente/campanha em segundos. Diferente de planilhas frágeis do Google Sheets ou softwares corporativos inflacionados de atribuição, o CampanhaUTM oferece higienização automática rigorosa de dados GA4, colaboração por projetos e exportação instantânea com planos que cabem no bolso da sua operação.
- **Objetivo do MVP (Lançamento até 01/11):** Lançar um SaaS funcional e monetizável com:
  1. Autenticação de usuários (login/cadastro) com isolamento estrito de dados (*multi-tenancy*).
  2. Gerenciamento de Projetos/Clientes (com limites conforme o plano).
  3. Construtor de URLs com higienização estrita (padrão GA4) e guia visual de taxonomia.
  4. Banco histórico de links pesquisável com cópia em 1 clique e exportação (CSV/HTML).
  5. Integração com Hotmart para cobrança de assinaturas recorrentes com suporte a Pix e Cartão (Plano Gratuito + Planos Pagos).

---

## 2. Personas

### Persona 1: Gestor de Tráfego / Dono de Agência de Performance
- **Nome fictício:** Rodrigo Martins (32 anos)
- **Perfil:** Proprietário de uma agência boutique de tráfego com 12 clientes ativos de Google Ads e Meta Ads. Lidera 3 gestores júniores.
- **Dores principais:**
  - Cada gestor usa uma planilha diferente ou escreve parâmetros sem padrão (`facebook` vs `fb` vs `face_ads`), destruindo a precisão dos relatórios de ROI e atribuição no GA4.
  - Perde tempo auditando links quebrados e não tem uma forma rápida de entregar links prontos para os clientes e copywriters.
  - Ferramentas enterprise de tracking custam centenas de dólares por mês, inviáveis para agências em fase de crescimento.
- **O que quer alcançar:** Um painel único onde cria "Projetos" para cada cliente, garante que sua equipe gere links 100% padronizados e exporta guias limpos de divulgação com 1 clique.
- **Como descobriria o produto:** Grupos de gestores de tráfego no WhatsApp/Telegram, comunidades de marketing digital (ex: Pedro Sobral, O Novo Mercado), anúncios no Instagram/LinkedIn ou indicação de colegas.

### Persona 2: Coordenadora de Growth / E-commerce Lead
- **Nome fictício:** Camila Albuquerque (28 anos)
- **Perfil:** Responsável pelo marketing de um e-commerce de moda e produtos para casa com campanhas simultâneas de influenciadores, e-mail marketing semanal, afiliados e mídia paga.
- **Dores principais:**
  - A planilha mestre de UTMs já foi corrompida diversas vezes por membros da equipe comercial e influenciadores.
  - Links com espaços, acentuação ou caracteres especiais quebram parâmetros de rastreamento na plataforma de e-commerce (Shopify/Nuvemshop/Vtex).
  - Dificuldade em manter registro de quais influenciadores receberam quais links no mês corrente.
- **O que quer alcançar:** Centralizar todos os links de influenciadores, CRM e mídia em um banco consultável com busca rápida, sem risco de corrupção de fórmulas e com garantia de que os parâmetros não quebrarão na loja virtual.
- **Como descobriria o produto:** Pesquisas no Google como "como padronizar UTMs no e-commerce", "gerador de UTM compartilhado", ou vídeos tutoriais no YouTube.

---

## 3. User Stories Priorizadas (MoSCoW)

### Must Have (Essenciais para o MVP até 01/11)
1. **US01:** *Como* visitante, *eu quero* me cadastrar com e-mail/senha ou Google *para* criar minha conta e acessar o painel da minha organização.
2. **US02:** *Como* usuário, *eu quero* assinar um plano pago via Hotmart (Pix ou Cartão) *para* liberar os recursos do meu nível de assinatura.
3. **US03:** *Como* usuário autenticado, *eu quero* criar e gerenciar projetos (clientes/marcas) *para* segmentar os links por operação comercial.
4. **US04:** *Como* gestor de tráfego, *eu quero* gerar uma URL com parâmetros UTM preenchidos e higienizados automaticamente (caixa baixa, hífens, sem acentos) *para* garantir qualidade de dados nos relatórios de conversão.
5. **US05:** *Como* usuário, *eu quero* consultar um guia fixo de regras de taxonomia na própria tela de criação *para* preencher parâmetros com consistência.
6. **US06:** *Como* usuário, *eu quero* consultar a tabela de links históricos com busca textual em tempo real e cópia em 1 clique *para* reutilizar links com agilidade.
7. **US07:** *Como* usuário, *eu quero* exportar os links de um projeto em planilha CSV e arquivo HTML autônomo *para* compartilhar facilmente com redatores, clientes e designers.
8. **US08:** *Como* assinante, *eu quero* acessar o link de gerenciamento de assinaturas da Hotmart *para* atualizar meus dados de pagamento ou cancelar a assinatura a qualquer momento.

### Should Have (Pós-MVP imediato — Sprint seguinte)
9. **US09:** *Como* usuário de agência, *eu quero* convidar membros da minha equipe com permissões de somente criação *para* colaborar no mesmo projeto.
10. **US10:** *Como* gestor de e-commerce, *eu quero* gerar links em lote (batch generator) selecionando múltiplos canais (ex: Stories, Feed, Newsletter) *para* economizar tempo.
11. **US11:** *Como* usuário, *eu quero* gerar e baixar um QR Code vetorizado para qualquer link gerado *para* usar em materiais físicos ou feiras.

### Could Have (Desejáveis para versões futuras)
12. **US12:** *Como* usuário do plano Pro/Agência, *eu quero* importar links legados via planilha CSV para migrar do Google Sheets facilmente.
13. **US13:** *Como* agência, *eu quero* exportar o relatório HTML com a logo personalizada da minha agência (White-label básico).
14. **US14:** *Como* assinante, *eu quero* receber alertas caso um link de destino retorne erro 404 (Link Health Checker).

### Won't Have (Fora do escopo do MVP de 01/11)
15. **US15:** Encurtador de URLs próprio com domínio personalizado (`link.minhaagencia.com`).
16. **US16:** Dashboard analítico consumindo cliques da API do Google Analytics 4 em tempo real.
17. **US17:** Aplicativo mobile nativo (iOS / Android).
18. **US18:** Múltiplas opções de moedas/gateways (ex: Mercado Pago, Pix manual — MVP focado em Stripe).

---

## 4. Features do MVP (Apenas Must Have)

### Feature 1: Módulo de Autenticação e Multi-Tenancy
- **Descrição:** Cadastro, login e sessão segura utilizando Supabase Auth com isolamento de dados por usuário/organização via RLS (Row Level Security).
- **Critérios de Aceitação:**
  - Formulário de login/cadastro com validação de e-mail e força de senha.
  - Suporte a recuperação de senha via e-mail.
  - Bloqueio de rotas privadas sem sessão válida.
  - Cada usuário só visualiza, cria e edita dados pertencentes ao seu próprio ID de conta.
- **Dependências:** Nenhuma.
- **Justificativa:** Indispensável para o modelo comercial SaaS e proteção dos dados proprietários de cada cliente/agência.

### Feature 2: Faturamento e Gestão de Assinaturas (Hotmart / Stripe)
- **Descrição:** Fluxo de contratação de planos com checkout seguro da Hotmart (com suporte a Pix e Cartão de Crédito) e sincronização automática via Webhooks da Hotmart.
- **Critérios de Aceitação:**
  - Página de Planos/Preços clara dentro e fora da aplicação.
  - Botões de contratação que redirecionam para o link oficial de checkout do produto na Hotmart.
  - Ativação imediata do status de assinatura na conta do usuário após webhook da Hotmart (`PURCHASE_APPROVED` / `SUBSCRIPTION_CANCELLATION`).
  - Bloqueio suave ao exceder os limites do plano ativo (ex: popup de upgrade ao tentar criar projetos acima do limite).
- **Dependências:** Feature 1.
- **Justificativa:** A Hotmart é a plataforma de maior confiança e familiaridade no ecossistema de marketing digital e tráfego pago no Brasil, com aceitação imediata de Pix e cartões nacionais.

### Feature 3: Gestão de Projetos com Limites por Plano
- **Descrição:** Agrupamento de links em projetos/pastas correspondentes a clientes ou campanhas.
- **Critérios de Aceitação:**
  - Criação, edição e exclusão de projetos com Nome e Descrição.
  - Exibição visual do uso atual vs limite do plano (ex: "2 de 3 projetos utilizados").
  - Contagem dinâmica de links vinculados a cada projeto.
- **Dependências:** Feature 1 e Feature 2.
- **Justificativa:** É a estrutura central de organização do usuário; serve como alavanca de conversão para planos superiores.

### Feature 4: Construtor Inteligente de UTMs com Higienização GA4
- **Descrição:** Formulário com validação em tempo real e sanitização automática de parâmetros de rastreamento.
- **Critérios de Aceitação:**
  - Campos: URL de Destino (obrigatória e validada), `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` e Rótulo/Descrição interna.
  - Higienização automática no preenchimento: conversão para minúsculas, remoção de acentuação, substituição de espaços por hífen `-`, e limpeza de caracteres proibidos.
  - Tratamento correto de interrogação (`?`) e conjunção (`&`) na URL base.
  - Preview dinâmico da URL final com destaque visual dos parâmetros concatenados.
  - Atribuição automática obrigatória ao projeto atualmente selecionado.
- **Dependências:** Feature 3.
- **Justificativa:** É o core de valor do produto — elimina a contaminação de dados de tráfego nos relatórios das empresas.

### Feature 5: Banco de Links, Busca Instantânea e Cópia
- **Descrição:** Listagem dos links criados no projeto com filtro textual instantâneo e cópia em um clique.
- **Critérios de Aceitação:**
  - Tabela organizada do mais recente para o mais antigo com tags visuais para Source e Medium.
  - Campo de busca em tempo real que filtra instantaneamente por qualquer termo, campanha ou URL.
  - Botão "Copiar URL" com feedback visual imediato ("Copiado!").
  - Ações de editar parâmetros e excluir link.
- **Dependências:** Feature 4.
- **Justificativa:** Resolve o caos da busca em dezenas de planilhas desatualizadas.

### Feature 6: Painel de Regras de Taxonomia Embutido
- **Descrição:** Seção de referência rápida com as boas práticas e convenções recomendadas pelo mercado.
- **Critérios de Aceitação:**
  - Guia visual permanente com exemplos canônicos de canais (`meta_ads`, `google_ads`, `influenciadores`, `newsletter`, `stories`, `cpc`).
  - Destaque das regras de ouro de padronização para evitar erros por parte de novos membros da equipe.
- **Dependências:** Nenhuma.
- **Justificativa:** Reduz atrito de uso e educa a equipe da agência/e-commerce dentro da própria ferramenta.

### Feature 7: Exportação de Guias (HTML Autônomo e Planilha CSV)
- **Descrição:** Geração de arquivos portáteis prontos para compartilhamento externo.
- **Critérios de Aceitação:**
  - **Exportar CSV:** Baixa imediatamente a planilha estruturada de todos os links do projeto.
  - **Exportar Guia em HTML:** Baixa um arquivo `.html` autossuficiente (estilos e scripts inline) com a tabela de links, botões de cópia e guia de regras, funcionando 100% offline em qualquer dispositivo do cliente ou copywriter.
- **Dependências:** Feature 5.
- **Justificativa:** Resolve o compartilhamento ágil com criadores de conteúdo e clientes sem exigir que eles tenham conta no sistema.

---

## 5. Fluxos Principais

### 5.1. Cadastro, Seleção de Plano e Onboarding
1. O usuário acessa a Landing Page do **CampanhaUTM** (`campanhautm.com.br`) e clica em "Começar Gratuitamente".
2. Preenche e-mail e senha (ou faz login social) e confirma a criação da conta.
3. É direcionado para a tela de Onboarding com duas opções:
   - **Plano Free (Iniciante):** Acesso imediato com limites (1 projeto, até 20 links).
   - **Plano Pro / Agency:** Redirecionamento seguro para o Stripe Checkout com 7 dias de trial.
4. Concluído o cadastro ou pagamento, o sistema cria automaticamente o primeiro projeto padrão ("Campanha Inicial") e abre o painel principal com um tour guiado.

### 5.2. Fluxo Principal de Valor (Geração e Gestão de Links)
1. O usuário seleciona o projeto correspondente ao cliente/campanha desejada.
2. No formulário do Construtor de UTMs:
   - Cola a URL de destino (ex: `https://minhaloja.com.br/tenis-corrida`).
   - Seleciona ou digita a Origem (`utm_source`) e Mídia (`utm_medium`) usando as sugestões automáticas.
   - Digita o nome da campanha e o identificador do criativo (`utm_content`).
3. O sistema aplica a sanitização em tempo real (removendo acentos e inserindo hífens) e exibe o preview da URL final.
4. O usuário clica em "Salvar e Copiar Link".
5. O link é gravado no banco de dados da nuvem e a URL final é transferida para a área de transferência do usuário com notificação instantânea.
6. O novo registro aparece no topo da tabela histórica do projeto.

### 5.3. Fluxo de Compartilhamento Externo
1. Ao final do planejamento da semana, o gestor de tráfego abre o projeto.
2. Clica no botão "Exportar Guia em HTML".
3. O sistema faz o download de um arquivo único (ex: `links-black-friday-2026.html`).
4. O gestor envia esse arquivo via Slack/WhatsApp/E-mail para os criadores de conteúdo e designers.
5. Os criadores abrem o arquivo direto no navegador (sem login) e copiam com 1 clique o link exato de cada postagem.

### 5.4. Fluxo de Assinatura, Upgrade e Liberação via Hotmart
1. Ao atingir o limite de projetos do plano atual, o usuário tenta criar um novo projeto e visualiza um modal de Upgrade.
2. O usuário escolhe o plano Pro ou Agency e clica em "Assinar na Hotmart".
3. É redirecionado para a página oficial e segura de checkout da Hotmart com opções de Pix e Cartão de Crédito.
4. Concluído o pagamento, a Hotmart dispara um webhook automático (`PURCHASE_APPROVED`) para a aplicação.
5. O status da assinatura do usuário é atualizado imediatamente no banco de dados e os novos limites são liberados.
6. Para cancelamento ou alteração de forma de pagamento, o usuário utiliza a própria central de compras da Hotmart.

---

## 6. Regras de Negócio e Níveis de Assinatura

### 6.1. Tabela de Planos e Limites (SaaS Tiers)

| Recurso | **Plano Free (Iniciante)** | **Plano Pro (Profissional)** | **Plano Agency (Escala)** |
| :--- | :--- | :--- | :--- |
| **Preço Sugerido** | R$ 0 / mês | R$ 47 / mês | R$ 127 / mês |
| **Limite de Projetos / Clientes** | 1 Projeto | Até 10 Projetos | Projetos Ilimitados |
| **Limite de Links Ativos** | Até 25 links | Links Ilimitados | Links Ilimitados |
| **Exportação CSV & HTML** | Apenas CSV | CSV + HTML Estático | CSV + HTML Estático |
| **Histórico de Links** | Últimos 30 dias | Histórico Completo | Histórico Completo |
| **Colaboradores / Membros** | 1 usuário | 1 usuário | Até 5 membros (v1.1) |
| **Suporte** | Comunitário / FAQ | Suporte via E-mail | Suporte Prioritário WhatsApp |

### 6.2. Regras de Cobrança e Acesso
1. **Cobrança Recorrente:** Assinaturas mensais processadas pela Hotmart (com suporte a Pix e Cartão de Crédito).
2. **Inadimplência (Past Due):** Em caso de cancelamento ou falha de renovação informada pelo webhook da Hotmart, a conta entra em modo somente leitura (consulta e cópia liberadas, criação de novos links ou projetos bloqueada).
3. **Downgrade / Cancelamento:** Se o usuário cancelar a assinatura e possuir mais projetos que o limite do plano gratuito, nenhum dado é excluído; apenas os projetos excedentes ficam congelados para novas criações até reativação.
4. **Higienização Rígida:** É proibida a gravação de parâmetros com espaços ou acentos. O sistema sempre aplicará a sanitização automática antes da persistência.
5. **Isolamento de Dados (Tenant Isolation):** Nenhuma consulta (`SELECT`) ou mutação (`INSERT/UPDATE/DELETE`) pode ser executada sem a cláusula de restrição ao `user_id` da conta autenticada.

---

## 7. Fora do Escopo (Explicitamente NÃO incluso no MVP de 01/11)

1. Encurtador de URLs próprio com DNS customizado (ex: `rdrct.me/xyz`).
2. Conexão via OAuth com as APIs do Google Analytics 4 ou Meta Ads para leitura de métricas e conversões dentro do painel.
3. Importador automatizado de planilhas antigas do Google Sheets via API.
4. Aplicativo mobile nativo para iOS ou Android.
5. Sistema complexo de logs de auditoria corporativa (Enterprise Audit Logs).

---

## 8. Requisitos Não-Funcionais

- **Performance:**
  - Carregamento inicial do painel web em menos de 1,5s em conexões 4G/banda larga padrão.
  - Filtro e pesquisa na tabela histórica de links em menos de 50ms para até 1.000 links por projeto.
- **Segurança e Privacidade:**
  - Criptografia de dados em trânsito com HTTPS/TLS 1.3 obrigatório.
  - Chaves de API e tokens secretos (Hotmart Webhook Token, Supabase Service Role) protegidos em variáveis de ambiente restritas ao servidor/edge functions, nunca expostas no bundle do frontend.
  - Proteção contra Cross-Site Scripting (XSS) e SQL Injection via queries parametrizadas no ORM/cliente Supabase.
- **Acessibilidade:** Padrão mínimo **WCAG 2.1 AA** (contrastes de texto acessíveis, rótulos explícitos em campos de formulário e suporte à navegação por teclado nos modais).
- **Compatibilidade:** Suporte completo aos navegadores modernos (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) e interface responsiva (Desktop, Tablet e Mobile).
- **LGPD / Proteção de Dados:**
  - Coleta restrita aos dados necessários para autenticação e faturamento: Nome, E-mail e Status de Assinatura.
  - Dados de pagamento (cartão/Pix) são processados diretamente pelos servidores certificados PCI-DSS da Hotmart, nunca passando pelos servidores da aplicação.
  - Mecanismo para exclusão definitiva de conta e dados a pedido do usuário.

---

## 9. Métricas de Sucesso do MVP (Primeiros 30 Dias)

1. **Volume de Aquisição:** Conquistar ao menos 150 contas criadas nas primeiras 3 semanas pós-lançamento.
2. **Taxa de Conversão para Planos Pagos:** Atingir uma taxa de conversão superior a 6% de usuários gratuitos/trials migrando para o plano Pro ou Agency na Hotmart.
3. **Engajamento & Retenção:** Mais de 65% dos usuários ativos gerando pelo menos 5 links UTM por semana.
4. **Redução de Inconsistências:** 0% de parâmetros fora do padrão GA4 nos links gerados pela plataforma.
5. **Estabilidade de Faturamento:** Menos de 4% de reembolsos solicitados na Hotmart no primeiro mês.

---

## 10. Decisões Técnicas Iniciais

| Dimensão | Solução Escolhida | Justificativa Técnica |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite 8 + TypeScript + Tailwind CSS v4 | Altíssima velocidade de carregamento, DX moderna e ecossistema ágil para cumprir o prazo de 01/11. |
| **Componentes de UI** | shadcn/ui + Lucide Icons + Sonner | Design profissional pronto para SaaS comercial, acessibilidade WCAG nativa e controle total de estilização. |
| **Banco de Dados & Autenticação** | **Supabase (PostgreSQL Gerenciado + Supabase Auth)** | Substitui o LocalStorage do protótipo por um banco relacional escalável com autenticação robusta e segurança via Row Level Security (RLS). |
| **Processamento de Pagamentos** | **Hotmart (Assinaturas com Pix e Cartão) / Webhooks** | Plataforma líder no Brasil para marketing digital e infoprodutos/ferramentas; alta taxa de conversão com Pix nativo e checkout confiável. |
| **Hospedagem & Deploy** | **Vercel** | CI/CD automatizado conectado ao GitHub, certificado SSL gratuito, borda global com baixa latência e Serverless/Edge Functions para receber os Webhooks da Hotmart. |
| **Desenvolvimento Local** | Vite Dev Server (`localhost:5174`) | Permite desenvolver e testar o painel, autenticação e regras de negócio com Hot Reload instantâneo. |
