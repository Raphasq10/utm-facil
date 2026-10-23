# Roteiro de Testes Manuais — Feature 4: Construtor Inteligente de UTMs com Higienização GA4
## CampanhaUTM (`campanhautm.com.br`)

Este guia prático foi preparado especialmente para você, web designer, testar no navegador a criação de URLs rastreadas, higienização de acentos/espaços e proteção de links.

---

## 1. Caminho Feliz (Happy Path — Tudo dando certo)

### Teste 1.1: Geração de Link UTM Padrão GA4
1. Acesse **`http://localhost:5174/`** e entre no seu painel.
2. Certifique-se de ter um projeto selecionado (observe a badge: *"Vinculado a: Nome do Projeto"* no topo do formulário).
3. No formulário do Construtor:
   - **Website URL:** `https://minhaloja.com.br/tenis-corrida`
   - **Campaign Source:** Selecione `Instagram` (ou `Google`).
   - **Campaign Medium:** Selecione `Stories` (ou `CPC`).
   - **Campaign Name:** Digite `Black Friday 2026 Promoção` (com maiúsculas e acentos de propósito).
   - **Campaign Content:** Digite `Banner Azul Lateral` (com espaços e maiúsculas).
4. Observe a caixa de **Preview em Tempo Real**:
   - As badges visuais coloridas mostram a higienização instantânea:
     - `source`: **`instagram`**
     - `medium`: **`stories`**
     - `campaign`: **`black-friday-2026-promocao`**
     - `content`: **`banner-azul-lateral`**
   - O link montado é exibido:
     `https://minhaloja.com.br/tenis-corrida?utm_source=instagram&utm_medium=stories&utm_campaign=black-friday-2026-promocao&utm_content=banner-azul-lateral`
5. Clique em **"Copiar Link Pronto"**:
   - O botão exibe um ícone de check verde e o texto *"Copiado!"* por 2 segundos.
6. Clique em **"Salvar no Projeto Atual"**:
   - Toast verde confirmando o salvamento.
   - O link aparece imediatamente no topo da tabela histórica do projeto.

---

## 2. Teste de Concatenação Avançada: Query Strings (? e &) e Âncoras (#)

### Teste 2.1: URL que já possui Parâmetros Prévios (`?` e `&`)
1. No campo Website URL, digite uma URL que já tenha parâmetros:
   `https://loja.com.br/checkout?cupom=DESCONTO10&afiliado=rodrigo`
2. Preencha a campanha como `natal-2026`.
3. **Resultado esperado:**
   - O sistema **NÃO duplica** o ponto de interrogação (`?`).
   - Os parâmetros originais são mantidos e as UTMs são anexadas com o caractere `&`:
     `https://loja.com.br/checkout?cupom=DESCONTO10&afiliado=rodrigo&utm_source=instagram...`

### Teste 2.2: URL com Âncora de Navegação (`#hash`)
1. No campo Website URL, digite uma página com âncora de seção:
   `https://meusite.com.br/landing-page#tabela-precos`
2. **Resultado esperado:**
   - No padrão oficial do Google Analytics, as variáveis UTM devem vir antes da âncora:
     `https://meusite.com.br/landing-page?utm_source=instagram...#tabela-precos`
   - O sistema monta a URL com precisão cirúrgica sem quebrar o link de salto da página.

---

## 3. Testes com Entradas Inválidas (Validação Zod)

### Teste 3.1: Campos Obrigatórios Vazios
1. Deixe o campo Website URL em branco e tente salvar:
   - **Resultado:** O Zod barra a gravação e exibe *"A URL de destino é obrigatória."*.
2. Deixe o campo Campaign Name em branco:
   - **Resultado:** O Zod avisa que o nome da campanha é obrigatório.

### Teste 3.2: URL sem Domínio Válido
1. Digite no campo de URL apenas `apenasumapalavra` ou `teste`.
   - **Resultado:** O Zod informa *"Insira um endereço web válido (ex: https://minhaloja.com.br ou seudominio.com.br)"*.

---

## 4. Tentativa de Injeção de Código (Proteção XSS)

### Teste 4.1: Protocolos Maliciosos no Campo de URL
1. Tente colar no campo Website URL:
   ```
   javascript:alert('Ataque XSS')
   ```
   ou
   ```
   data:text/html,<script>alert(1)</script>
   ```
2. **Resultado esperado:**
   - O validador do Zod barra imediatamente e avisa: *"Protocolo inseguro detectado. Utilize apenas endereços padrão (http:// ou https://)."*.
   - A URL não é concatenada nem salva no banco de dados.

### Teste 4.2: Injeção de Código HTML no Nome da Campanha
1. No campo Campaign Name, digite:
   ```html
   <script>alert('hack')</script>
   ```
2. **Resultado esperado:**
   - A função de sanitização converte os caracteres perigosos em hífens limpos:
     `script-alert-hack-script`
   - Nenhum script é executado. A integridade dos relatórios do GA4 é 100% preservada.

---

## 5. Prevenção de Duplo Clique (Double-Submit / Race Condition)

### Teste 5.1: Cliques Rápidos no Botão de Gravação
1. Com todos os campos preenchidos, clique rapidamente 2 vezes seguidas no botão **"Salvar no Projeto Atual"**.
2. **Resultado esperado:**
   - No primeiro milissegundo, o botão fica desabilitado (`disabled`) exibindo o spinner giratório com o texto *"Salvando no Projeto..."*.
   - Apenas 1 link é gravado no banco, sem duplicar o registro na tabela.
