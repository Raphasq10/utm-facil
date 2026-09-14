import type { Project, UtmLink } from '@/types'

/**
 * Gera e dispara o download de um arquivo HTML autônomo contendo o banco de links
 * e o guia de regras de taxonomia do projeto.
 * 
 * O arquivo gerado é 100% autossuficiente: possui CSS e JavaScript inline,
 * funcionando perfeitamente em qualquer computador, mesmo sem internet!
 */
export function exportProjectToStandaloneHtml(project: Project, links: UtmLink[]): void {
  const dateFormatted = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Guia de Links & UTMs — ${escapeHtml(project.name)}</title>
  <style>
    :root {
      --primary: #0284c7;
      --primary-dark: #0369a1;
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --accent: #059669;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background-color: var(--bg); color: var(--text); padding: 24px 16px; line-height: 1.5; }
    .container { max-width: 1200px; margin: 0 auto; }
    
    header { background: linear-gradient(135deg, #0f172a, #1e293b); color: white; padding: 28px; border-radius: 16px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .badge { display: inline-block; background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; margin-bottom: 8px; }
    header h1 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
    header p { color: #94a3b8; font-size: 14px; }
    .meta { display: flex; gap: 16px; font-size: 13px; color: #cbd5e1; margin-top: 14px; flex-wrap: wrap; }
    
    .rules-card { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .rules-card h2 { color: #1e40af; font-size: 16px; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
    .rules-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 12px; }
    .rule-item { background: white; padding: 12px; border-radius: 8px; border: 1px solid #dbeafe; font-size: 13px; }
    .rule-item strong { color: #1e3a8a; display: block; margin-bottom: 4px; }
    .rule-item code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #0284c7; }

    .table-container { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .table-toolbar { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .search-input { flex: 1; min-width: 250px; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; outline: none; }
    .search-input:focus { border-color: var(--primary); ring: 2px solid var(--primary); }
    .count-badge { font-size: 13px; color: var(--text-muted); font-weight: 500; }

    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { background: #f8fafc; padding: 12px 16px; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--border); }
    td { padding: 14px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #f8fafc; }
    
    .pill { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .pill-source { background: #e0f2fe; color: #0369a1; }
    .pill-medium { background: #fef3c7; color: #92400e; }
    
    .btn-copy { background: #0284c7; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.2s; display: inline-flex; align-items: center; gap: 4px; }
    .btn-copy:hover { background: #0369a1; }
    .btn-copy.copied { background: #059669; }
    
    .url-text { max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace; font-size: 11px; color: #475569; display: block; margin-top: 4px; }
    footer { text-align: center; margin-top: 32px; font-size: 12px; color: var(--text-muted); }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">Itaipu Parquetec • Comunicação & Marketing</div>
      <h1>${escapeHtml(project.name)}</h1>
      <p>${escapeHtml(project.description || 'Links rastreados padronizados para campanhas e peças de conteúdo.')}</p>
      <div class="meta">
        <span>📅 Gerado em: ${dateFormatted}</span>
        <span>🔗 Total de Links: ${links.length}</span>
        <span>🛡️ Guia Oficial de Disparo</span>
      </div>
    </header>

    <section class="rules-card">
      <h2>📌 Regras de Ouro para a Equipe de Conteúdo</h2>
      <p style="font-size: 13px; color: #1e3a8a; margin-top: 4px;">Utilize <strong>estritamente</strong> os links oficiais desta tabela ao agendar posts, disparar e-mails ou enviar a parceiros. Não altere as tags na barra de endereço.</p>
      <div class="rules-grid">
        <div class="rule-item">
          <strong>Instagram Stories</strong>
          Origem: <code>instagram</code><br>Mídia: <code>stories</code>
        </div>
        <div class="rule-item">
          <strong>Instagram / LinkedIn Feed</strong>
          Origem: <code>instagram</code> / <code>linkedin</code><br>Mídia: <code>feed</code> ou <code>post-organico</code>
        </div>
        <div class="rule-item">
          <strong>E-mail & Newsletters</strong>
          Origem: <code>email-marketing</code><br>Mídia: <code>newsletter</code> ou <code>disparo-direto</code>
        </div>
        <div class="rule-item">
          <strong>Mídia Paga (Meta / Google)</strong>
          Origem: <code>meta-ads</code> / <code>google-ads</code><br>Mídia: <code>cpc</code> ou <code>carrossel</code>
        </div>
      </div>
    </section>

    <div class="table-container">
      <div class="table-toolbar">
        <input type="text" id="searchInput" class="search-input" placeholder="🔍 Buscar por canal, criativo ou descrição...">
        <div class="count-badge" id="countBadge">${links.length} links catalogados</div>
      </div>

      <table id="linksTable">
        <thead>
          <tr>
            <th>Canal / Mídia</th>
            <th>Campanha & Descrição</th>
            <th>Conteúdo / Termo</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          ${links
            .map(
              (link) => `
          <tr class="link-row" data-search="${escapeHtml(
            `${link.utmSource} ${link.utmMedium} ${link.utmCampaign} ${link.descricao || ''} ${link.utmContent || ''} ${link.urlFinal}`.toLowerCase()
          )}">
            <td>
              <span class="pill pill-source">${escapeHtml(link.utmSource)}</span>
              <span class="pill pill-medium" style="margin-left: 4px;">${escapeHtml(link.utmMedium)}</span>
            </td>
            <td>
              <strong>${escapeHtml(link.utmCampaign)}</strong>
              ${link.descricao ? `<div style="color: #64748b; font-size: 12px; margin-top: 2px;">${escapeHtml(link.descricao)}</div>` : ''}
              <span class="url-text" title="${escapeHtml(link.urlFinal)}">${escapeHtml(link.urlFinal)}</span>
            </td>
            <td>
              ${link.utmContent ? `<code>${escapeHtml(link.utmContent)}</code>` : '<span style="color:#94a3b8;">—</span>'}
            </td>
            <td>
              <button class="btn-copy" onclick="copyLink(this, '${escapeHtml(link.urlFinal)}')">
                📋 Copiar Link
              </button>
            </td>
          </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <footer>
      Guia gerado pelo <strong>Gerador de Links UTM — Itaipu Parquetec</strong>. Este arquivo funciona offline.
    </footer>
  </div>

  <script>
    function copyLink(btn, url) {
      navigator.clipboard.writeText(url).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('copied');
        }, 2000);
      });
    }

    const searchInput = document.getElementById('searchInput');
    const tableRows = document.querySelectorAll('.link-row');
    const countBadge = document.getElementById('countBadge');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let visibleCount = 0;
      tableRows.forEach(row => {
        const text = row.getAttribute('data-search') || '';
        if (!query || text.includes(query)) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });
      countBadge.textContent = visibleCount + ' de ' + tableRows.length + ' links visíveis';
    });
  </script>
</body>
</html>`

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `guia-links-${sanitizeSlug(project.name)}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function sanitizeSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'projeto'
}
