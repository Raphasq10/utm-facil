# Guia de Testes Manuais de Segurança da Autenticação

Este documento detalha os procedimentos de teste manual para validar a blindagem de segurança do fluxo de autenticação do **CampanhaUTM** integrado ao Supabase.

---

## 🛡️ Checklist de Regras de Segurança Implementadas

| Regra de Segurança | O que faz? | Onde está no código? |
| :--- | :--- | :--- |
| **Validação Dupla** | Zod valida no cliente e no servidor antes do salvamento | `src/lib/validations/auth.ts` |
| **Mensagem Genérica no Login** | Sempre *"Email ou senha inválidos"*, sem revelar se o email existe | `src/contexts/AuthContext.tsx` (`signIn`) |
| **Honeypot Anti-Bot** | Campo invisível `website`. Bots preenchem e são rejeitados | `src/components/AuthView.tsx` + `signUp` |
| **Proteção de Rotas & Middleware** | Bloqueia acesso não autenticado e exige e-mail confirmado | `src/lib/supabase/middleware.ts` |
| **Email Confirmado Obrigatório** | Bloqueia painel principal até clicar no link de confirmação | `src/App.tsx` (`needsEmailVerification`) |
| **Logout Global no Servidor** | Invalida todos os tokens JWT no Supabase (`scope: 'global'`) | `src/contexts/AuthContext.tsx` (`signOut`) |
| **Proteção contra Overflow de Input** | Limite rígido `maxLength` em todos os campos HTML | `src/components/AuthView.tsx` |

---

## 🧪 Roteiro de Testes Manuais

### Teste 1: Cadastro com Senha Fraca (Deve Falhar)
1. Acesse `http://localhost:5174/` e clique em **"Entrar"** ➔ **"Criar Conta"**.
2. Preencha seu nome e um e-mail válido.
3. No campo senha, tente digitar:
   - `12345` (menos de 10 caracteres) ➔ O Zod bloqueia: *"Senha deve ter no mínimo 10 caracteres"*.
   - `senhasomeminuscula` (sem maiúscula e sem número) ➔ O Zod bloqueia: *"Senha deve conter ao menos uma maiúscula"* e *"ao menos um número"*.
   - `SENHASOMAIUSCULA123` (sem minúscula) ➔ O Zod bloqueia: *"Senha deve conter ao menos uma minúscula"*.
4. **Resultado esperado:** O botão de envio não prossegue e o formulário exibe os avisos de segurança em vermelho.

---

### Teste 2: Cadastro com E-mail já Existente (Tratamento Gracioso)
1. Tente criar uma nova conta usando um e-mail que já existe no Supabase (ex: `usuarioA@teste.com`).
2. Digite uma senha válida com mais de 10 caracteres (`SenhaForte2026`).
3. Clique em **"Criar Minha Conta Grátis"**.
4. **Resultado esperado:** O sistema exibe um aviso amigável:  
   *"Não foi possível concluir o cadastro com este e-mail. Se já possui conta, faça login."*  
   Nenhum erro de banco nem stacktrace interno é revelado.

---

### Teste 3: Login com Credenciais Erradas (Mensagem Genérica)
1. Vá para a aba **"Entrar na Conta"**.
2. Tente fazer login com um e-mail que não existe (ex: `naoexiste@teste.com`) e senha `qualquercoisa`.
3. Tente fazer login com o e-mail real `usuarioA@teste.com` e a senha errada `senhaerrada123`.
4. **Resultado esperado:** Em ambos os casos, a mensagem exibida na tela é estritamente:  
   👉 **`"Email ou senha inválidos"`**  
   Isso impede ataques de enumeração de e-mails (um hacker não consegue descobrir quais e-mails estão cadastrados no seu sistema).

---

### Teste 4: Acesso a Rotas Protegidas sem Login (Redirecionamento)
1. Abra uma janela anônima no navegador.
2. Acesse diretamente a URL raiz `http://localhost:5174/`.
3. **Resultado esperado:**
   - O usuário não logado vê a Landing Page pública ou é direcionado para a tela de Login.
   - Nenhuma informação de links, projetos ou clientes é carregada na memória do navegador.

---

### Teste 5: Tentativa de Burlar a Confirmação de E-mail
1. Crie uma nova conta com e-mail real.
2. Como o Supabase está com a opção *"Confirm email"* ativa, o usuário é cadastrado com `email_confirmed_at = null`.
3. Tente entrar no painel antes de clicar no link do e-mail.
4. **Resultado esperado:**
   - O aplicativo intercepta via Middleware (`needsEmailVerification`) e exibe a tela:  
     👉 **`"Verifique seu E-mail"`** com botão para reenviar a mensagem.
   - O acesso ao painel de links UTM permanece bloqueado até a confirmação.

---

### Teste 6: Redefinição de Senha (Esqueci a Senha)
1. Na tela de login, clique em **"Esqueceu a senha?"**.
2. Digite seu e-mail cadastrado e clique em **"Enviar Link de Recuperação"**.
3. Verifique o recebimento do e-mail de recuperação do Supabase.
4. Clique no link recebido:
   - A aplicação detecta o hash `#access_token=...&type=recovery`.
   - Abre automaticamente a tela **"Criar Nova Senha"** (`/reset-password`).
5. Digite a nova senha forte e salve.
6. Tente usar o link do e-mail uma segunda vez:
   - **Resultado esperado:** O Supabase expira o token de uso único e rejeita a reutilização.

---

### Teste 7: Teste do Honeypot Anti-Bot (Robôs de Spam)
1. Abra as Ferramentas de Desenvolvedor (`F12` ➔ Console).
2. No formulário de cadastro, simule um robô preenchendo o input oculto:
   ```javascript
   document.getElementById('hp-website').value = 'http://site-hacker.com';
   ```
3. Clique em **"Criar Minha Conta Grátis"**.
4. **Resultado esperado:** O sistema rejeita o salvamento silenciosamente sem disparar chamadas ao Supabase, poupando a cota de requisições do seu projeto.
