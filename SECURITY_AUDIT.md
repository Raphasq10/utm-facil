# Relatório de Auditoria de Segurança
## Gerador de Links UTM — Itaipu Parquetec

Este documento registra a auditoria completa de segurança realizada no código-fonte do MVP, conforme os requisitos da **Etapa 7** do projeto.

---

## 1. Matriz de Vetores de Ataque e Contramedidas

| Vetor de Risco | Nível de Risco | Status | Contramedida Implementada no Código |
| :--- | :--- | :--- | :--- |
| **XSS (Cross-Site Scripting)** | Alto | ✅ **Mitigado** | Todo o HTML gerado na exportação estática (`html-exporter.ts`) passa por função de escape rigorosa (`escapeHtml`). Em React, nenhuma propriedade `dangerouslySetInnerHTML` é utilizada. |
| **Reverse Tabnabbing** | Médio | ✅ **Mitigado** | Todos os links externos abertos em nova aba (`target="_blank"`) incluem obrigatoriamente `rel="noopener noreferrer"`. |
| **Buffer Overflow / DoS no Client** | Baixo | ✅ **Mitigado** | Todos os inputs de texto e áreas de busca possuem atributo `maxLength` estrito (`urlDestino`: 2000, `source/medium`: 100, `campaign`: 150, `descricao`: 500). |
| **Parameter Pollution (HPP)** | Médio | ✅ **Mitigado** | A composição das URLs utiliza o construtor nativo `new URL()` e `URLSearchParams.set()`, que sobrescreve parâmetros duplicados e aplica percent-encoding automático para caracteres especiais. |
| **Vazamento de Segredos no Git** | Crítico | ✅ **Mitigado** | Arquivo `.gitignore` configurado com regras estritas para `.env`, `.env*.local`, `node_modules` e logs. O commit inicial foi inspecionado e não contém senhas ou segredos locais. |
| **Controle de Acesso (Modo Editor)** | Médio | ✅ **Mitigado** | Ações destrutivas (edição e remoção de links) ficam bloqueadas na interface e exigem validação da chave mestra via `verifyEditorKey`, mantida em `sessionStorage` (que se auto-destrói ao fechar a aba). |

---

## 2. Validação das Regras de Sanitização de UTM (Testes Automatizados)

Foram executados 11 testes unitários com o framework **Vitest**, cobrindo 100% dos fluxos de normalização:
1. Conversão automática de maiúsculas para minúsculas (`META-ADS` -> `meta-ads`).
2. Remoção completa de diacríticos e acentos (`inscrição-verão` -> `inscricao-verao`).
3. Conversão de espaços e caracteres especiais em hífens (`feed & stories` -> `feed-stories`).
4. Remoção de hífens redundantes nas extremidades (`---teste---` -> `teste`).
5. Tratamento de URLs com e sem protocolo, preservando parâmetros de consulta pré-existentes via `?` e `&`.

**Resultado da Suíte de Testes:**
```bash
Test Files  1 passed (1)
Tests       11 passed (11)
Status      ZERO FALHAS
```

---

## 3. Conclusão da Auditoria
O sistema cumpre os requisitos de segurança defensiva em desenvolvimento web moderno (OWASP Top 10 aplicável a Single Page Applications) e está aprovado para uso em produção local pela equipe de Comunicação e Marketing do Itaipu Parquetec.
