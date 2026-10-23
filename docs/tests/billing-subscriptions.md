# Roteiro de Testes Manuais — Feature 2: Faturamento & Assinaturas (Hotmart)
## CampanhaUTM (`campanhautm.com.br`)

Este guia prático foi preparado para você, web designer, testar no navegador como o sistema lida com limites de planos, checkout da Hotmart, bloqueio suave (*Soft Paywall*) e liberação de recursos.

---

## 1. Caminho Feliz (Happy Path — Tudo dando certo)

### Teste 1.1: Visualização da Tabela de Planos
1. Abra a aplicação em **`http://localhost:5174/`** e faça login na sua conta.
2. No cabeçalho (ou no rodapé), clique em **"Planos"** ou **"Fazer Upgrade"**.
3. **Resultado esperado:**
   - O modal de planos se abre exibindo os 3 níveis: **Free (Grátis)**, **Pro (R$ 47/mês)** e **Agency (R$ 127/mês)**.
   - O plano em que você se encontra exibe a tag **"Plano Atual"** e botão desabilitado.
   - O Plano Pro exibe o selo **"Mais Escolhido"**.
   - No rodapé do modal aparecem os selos de segurança: *Processado pela Hotmart*, *Pix imediato* e *7 dias de garantia*.

---

### Teste 1.2: Bloqueio Suave (*Soft Paywall*) ao tentar exceder 1 projeto no Plano Free
1. Certifique-se de que sua conta está no **Plano Free** (aparece a tag `FREE` no cabeçalho).
2. Se você já possui 1 projeto cadastrado (ex: "Campanha Inicial"):
   - Clique no botão **"+ Novo Projeto"** no cabeçalho.
3. **Resultado esperado:**
   - Em vez de uma mensagem de erro feia ou tela travada, abre-se o modal amigável de **Upgrade Suave**:
     *"Limite de Projetos Atingido no Plano Free — Você já está utilizando o seu projeto gratuito. Para cadastrar novos clientes, faça upgrade para o Plano Pro."*
   - O sistema protege os limites do seu negócio com respeito ao usuário.

---

### Teste 1.3: Simulação de Pagamento e Aprovação de Webhook da Hotmart
1. No modal de planos, localize a coluna do **Plano Pro (R$ 47/mês)**.
2. Como você está no modo de desenvolvimento/demonstração, repare no botão especial abaixo:
   - **"Simular Aprovação Hotmart (Teste Rápido)"**.
3. Dê um clique nesse botão.
4. **Resultado esperado:**
   - O sistema valida internamente o payload idêntico ao da Hotmart (`PURCHASE_APPROVED`) com Zod.
   - Surge um toast verde: *"Parabéns! Assinatura do Plano Pro (Profissional) ativada via Hotmart!"*.
   - A badge no cabeçalho muda automaticamente de `FREE` para **`PRO`**.
   - Agora, clique em **"+ Novo Projeto"**: o modal de criação de projeto se abre normalmente, permitindo criar até 10 projetos!

---

### Teste 1.4: Desbloqueio da Exportação em Guia HTML
1. No Plano Free, clique em **"Exportar Guia / CSV"**:
   - O botão de "Guia em HTML Autônomo" exibe o aviso **"RECURSO PRO"**.
   - Ao clicar nele, o sistema convida você a conhecer o Plano Pro.
2. Após o upgrade para o **Plano Pro**:
   - Ao clicar em "Guia em HTML Autônomo", o arquivo `.html` é baixado imediatamente sem barreiras!

---

## 2. Testes de Prevenção contra Falhas e Entradas Inválidas

### Teste 2.1: Prevenção de Duplo Clique (Double-Submit / Race Condition)
1. Abra o modal de planos.
2. Dê **dois cliques muito rápidos** no botão **"Assinar na Hotmart"** ou **"Simular Aprovação"**.
3. **Resultado esperado:**
   - No primeiro milissegundo do clique, o botão é desabilitado (`disabled`) e exibe o ícone giratório com *"Abrindo Checkout..."* ou processando.
   - O segundo clique é ignorado, impedindo aberturas duplicadas de abas ou transações concorrentes.

---

### Teste 2.2: Proteção contra Links Inseguros e Ataques XSS
1. No arquivo `src/lib/__tests__/billing.test.ts`, nós automatizamos a verificação de URLs de checkout.
2. Caso alguém tente configurar um link malicioso do tipo `javascript:alert(1)` ou `http://inseguro`, o validador [`isValidCheckoutUrl`](file:///c:/xampp/htdocs/utms-generator-facil/src/lib/validations/billing.ts) detecta o perigo e bloqueia o redirecionamento.

---

### Teste 2.3: Reversão / Downgrade para o Plano Free
1. Se quiser voltar para o Plano Free para testar os limites novamente:
   - Abra o modal de planos.
   - Na primeira coluna (Plano Free), clique em **"Reverter para o Plano Free"**.
   - O sistema simula o evento de cancelamento da Hotmart (`SUBSCRIPTION_CANCELLATION`), voltando sua conta para o nível inicial de forma segura.
