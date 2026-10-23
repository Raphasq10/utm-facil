# Roteiro de Testes Manuais — Feature 1: Autenticação & Multi-Tenancy
## CampanhaUTM (`campanhautm.com.br`)

Este guia foi preparado especialmente para você, web designer, testar a segurança e o funcionamento da autenticação passo a passo no seu navegador.

---

## 1. Caminho Feliz (Happy Path — Tudo dando certo)

### Teste 1.1: Cadastro de Nova Conta
1. Abra a aplicação no navegador em `http://localhost:5174/`.
2. Como você ainda não está autenticado, a tela de **Acessar Plataforma** deve ser exibida automaticamente.
3. Clique em **"Cadastre-se grátis"** no rodapé do card.
4. Preencha os campos:
   - **Nome Completo:** `Rodrigo Martins`
   - **E-mail:** `rodrigo@agencia.com.br`
   - **Senha:** `Campanha2026!` (observe o medidor de força mudar de cor até verde: *Forte*).
   - **Confirmação:** `Campanha2026!`
5. Clique em **"Concluir Cadastro"**.
6. **Resultado esperado:**
   - Toast verde informando sucesso ("Conta criada com sucesso!").
   - A tela de autenticação dá lugar ao painel principal do CampanhaUTM.
   - O projeto padrão "Campanha Inicial" é criado para o seu usuário.
   - No topo direito do cabeçalho, aparece seu nome, avatar com a inicial `R` e a badge `FREE`.

---

### Teste 1.2: Isolamento de Dados entre Usuários (Multi-Tenancy)
1. Estando logado como `rodrigo@agencia.com.br`:
   - Crie um novo projeto chamado `Cliente Alfa`.
   - Gere 1 link UTM dentro dele.
2. Clique no seu perfil no canto superior direito e clique em **"Encerrar Sessão (Sair)"**.
3. Você voltará imediatamente para a tela de login.
4. Clique em **"Cadastre-se grátis"** e crie um **SEGUNDO usuário**:
   - **Nome:** `Camila E-commerce`
   - **E-mail:** `camila@loja.com.br`
   - **Senha:** `LojaSegura2026!`
   - **Confirmação:** `LojaSegura2026!`
5. **Resultado esperado:**
   - Camila entra no painel dela.
   - **Camila NÃO enxerga o projeto "Cliente Alfa" do Rodrigo nem os links dele.**
   - O isolamento de dados (*Multi-Tenancy*) está funcionando perfeitamente!

---

## 2. Testes com Inputs Inválidos

### Teste 2.1: Campos Vazios ou Formatos Inválidos
1. Na tela de login, clique direto em **"Entrar no Painel"** sem digitar nada.
   - **Resultado:** O Zod intercepta o formulário antes de enviar. Aparecem alertas vermelhos: *"Insira um endereço de e-mail válido"* e *"A senha deve ter pelo menos 6 caracteres"*.
2. Digite no e-mail apenas `rodrigo@` ou `teste`.
   - **Resultado:** O sistema avisa que o formato é inválido.

### Teste 2.2: Senha Fraca no Cadastro
1. Na aba de cadastro, tente digitar a senha `12345` ou `apenasletras`.
   - **Resultado:** A barra de força fica vermelha (*Muito Fraca*) e a validação do Zod exige pelo menos 8 caracteres, uma letra maiúscula e um número.

### Teste 2.3: Senhas que Não Coincidem
1. Digite a senha `Campanha2026!` e no campo de confirmação digite `OutraCoisa123!`.
   - **Resultado:** O campo de confirmação exibe o erro *"As senhas não coincidem"*, impedindo a submissão.

---

## 3. Tentativa de Injeção de Código (Proteção contra XSS)

### Teste 3.1: Injeção de Scripts no Nome do Usuário
1. No campo de cadastro, digite no Nome Completo:
   ```html
   <script>alert('Ataque XSS!');</script>
   ```
2. Conclua o cadastro com um e-mail novo.
3. Observe como o nome é renderizado no Header.
4. **Resultado esperado:**
   - NENHUM popup de alerta deve aparecer na tela.
   - O React converte os caracteres `<` e `>` em texto seguro (`&lt;script&gt;...`), neutralizando o ataque com sucesso.

---

## 4. Prevenção de Duplo Clique (Double-Submit / Race Condition)

### Teste 4.1: Clique Rápido Consecutivo no Botão de Cadastro
1. Preencha todos os campos do formulário de cadastro.
2. Dê **dois ou três cliques rápidos** seguidos no botão de submit.
3. **Resultado esperado:**
   - Imediatamente no primeiro clique, o botão é **desabilitado** (`disabled`) e exibe o ícone de carregamento giratório com o texto *"Criando conta..."*.
   - Cliques subsequentes são ignorados pelo navegador, evitando que o backend processe a mesma requisição duas vezes.

---

## 5. Recuperação de Senha & Comportamento em Conexão Lenta

### Teste 5.1: Fluxo de Recuperação
1. Na tela de login, clique no link **"Esqueceu a senha?"**.
2. Digite seu e-mail cadastrado e clique em **"Enviar Link de Recuperação"**.
3. **Resultado esperado:**
   - Mensagem de sucesso em toast informando que as instruções foram enviadas.
   - O sistema volta automaticamente para a tela de login.

---

## 6. Conexão com o Supabase Real (Opcional — Quando Desejar Usar a Nuvem)

Se quiser testar com o banco PostgreSQL real na nuvem do Supabase:
1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No menu **SQL Editor**, copie e cole o script do arquivo `supabase/schema.sql` e execute.
3. No menu **Project Settings > API**, copie a **Project URL** e o **anon key**.
4. Cole no seu arquivo local `.env`:
   ```env
   VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
   VITE_SUPABASE_ANON_KEY="sua-chave-anon-aqui"
   ```
5. Salve o arquivo e recarregue a página: o sistema se conectará automaticamente à nuvem com Row Level Security (RLS) ativo!
