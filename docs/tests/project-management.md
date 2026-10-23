# Roteiro de Testes Manuais — Feature 3: Gestão de Projetos & Limites por Plano
## CampanhaUTM (`campanhautm.com.br`)

Este guia prático foi preparado especialmente para você, web designer, testar a criação, edição, exclusão e os limites de projetos no seu navegador.

---

## 1. Caminho Feliz (Happy Path — Tudo dando certo)

### Teste 1.1: Criar um Projeto com Nome e Descrição
1. Acesse o sistema em **`http://localhost:5174/`** e faça login na sua conta.
2. Certifique-se de estar no **Plano Pro** (se estiver no Free, abra o menu "Planos" e clique em "Simular Aprovação Hotmart").
3. Clique no botão **"+ Novo Projeto"** no cabeçalho.
4. Repare no card visual de capacidade no topo do modal:
   - Exibe: *"Capacidade do Plano Pro: X de 10 projetos"*, com uma barra de progresso colorida.
5. Preencha os campos:
   - **Nome do Projeto:** `Vestibular Parquetec 2026`
   - **Descrição:** `Campanhas de captação de novos estudantes para o primeiro semestre`
6. Clique em **"Salvar Projeto"**.
7. **Resultado esperado:**
   - Toast verde confirmando a criação: *"Projeto 'Vestibular Parquetec 2026' criado com sucesso!"*.
   - O projeto recém-criado torna-se o projeto ativo no cabeçalho automaticamente.

---

### Teste 1.2: Contagem Dinâmica de Links por Projeto
1. Com o projeto `Vestibular Parquetec 2026` selecionado, gere 2 links no formulário de UTMs.
2. Clique no seletor de projetos no cabeçalho para abrir a lista suspensa.
3. **Resultado esperado:**
   - Ao lado do nome `Vestibular Parquetec 2026`, aparece uma pílula cinza indicando exatamente **`2`** links.
   - Ao lado de outros projetos, a contagem de links de cada um é refletida fielmente.

---

### Teste 1.3: Edição de Projeto Existente
1. Ao lado do seletor de projetos ativo no cabeçalho (ou dentro da lista suspensa), clique no ícone de **Lápis (Editar)**.
2. O modal se abre no modo de edição:
   - Título: *"Editar Pasta do Projeto"*.
   - O nome e a descrição atuais já vêm preenchidos nos campos.
3. Altere o nome para: `Vestibular Parquetec 2026 - Oficial`.
4. Clique em **"Atualizar Projeto"**.
5. **Resultado esperado:**
   - Toast verde confirmando a atualização.
   - O nome é atualizado instantaneamente no cabeçalho e na lista.

---

### Teste 1.4: Exclusão Segura de Projeto com Confirmação
1. Certifique-se de ter pelo menos 2 projetos cadastrados.
2. Abra a lista suspensa de projetos no cabeçalho.
3. No projeto que você deseja remover, clique no ícone de **Lixeira (Excluir)**.
4. O navegador exibe uma mensagem de confirmação:
   *"Tem certeza de que deseja excluir 'Nome do Projeto'? Todos os links vinculados a ele serão apagados permanentemente."*
5. Clique em **OK**.
6. **Resultado esperado:**
   - O projeto e todos os seus links são removidos.
   - Se o projeto excluído era o ativo, o sistema seleciona automaticamente o próximo projeto restante.
   - Se você tiver apenas 1 projeto restante, o botão de lixeira fica oculto (proteção para não deixar o usuário sem nenhuma pasta).

---

## 2. Testes com Entradas Inválidas (Validação Zod)

### Teste 2.1: Nome do Projeto Vazio ou Muito Curto
1. Clique em **"+ Novo Projeto"**.
2. Digite apenas `A` no campo "Nome do Projeto" e tente enviar.
   - **Resultado:** O Zod barra a submissão e mostra o alerta em vermelho: *"O nome do projeto deve ter pelo menos 2 caracteres"*.
3. Apague tudo e clique em salvar:
   - **Resultado:** O Zod avisa que o campo é obrigatório.

### Teste 2.2: Limite Máximo de Caracteres
1. O campo "Nome do Projeto" possui `maxLength={80}` e a descrição possui `maxLength={250}`.
2. Tente colar um texto gigantesco de 500 letras em cada campo.
   - **Resultado:** O navegador corta o texto no limite máximo exato, impedindo estouro de layout ou sobrecarga no banco.

---

## 3. Tentativa de Injeção de Código (Proteção XSS)

### Teste 3.1: Scripts Maliciosos no Nome do Projeto
1. Crie um projeto com o nome:
   ```html
   <script>alert('XSS Projeto');</script>
   ```
2. Salve o projeto e observe como ele é exibido no cabeçalho, no dropdown e na tabela.
3. **Resultado esperado:**
   - Nenhum script é executado.
   - O React trata o conteúdo estritamente como texto inofensivo.

---

## 4. Prevenção de Duplo Clique (Double-Submit / Race Condition)

### Teste 4.1: Clique Rápido Consecutivo
1. Preencha o nome do projeto e dê dois cliques muito rápidos no botão **"Salvar Projeto"**.
2. **Resultado esperado:**
   - No primeiro clique, o botão é imediatamente desabilitado (`disabled={isSubmitting}`) com ícone giratório e texto *"Salvando..."*.
   - Apenas 1 projeto é criado, evitando pastas duplicadas com o mesmo nome.

---

## 5. Bloqueio de Limite por Plano

### Teste 5.1: Exceder Limite do Plano Free
1. Se sua conta estiver no Plano Free (1 projeto permitido):
2. Tente clicar em **"+ Novo Projeto"**.
3. **Resultado esperado:**
   - O modal de criação nem chega a abrir; o sistema abre o modal de **Upgrade Suave**, orientando o usuário a assinar o Plano Pro para ter até 10 projetos.
