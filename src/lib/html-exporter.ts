import type { Project, UtmLink } from '@/types'

/**
 * Gera e dispara o download de um arquivo HTML autônomo contendo o banco de links
 * e o guia oficial com os 9 parâmetros de taxonomia (conforme imagem de referência).
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
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background-color: var(--bg); color: var(--text); padding: 24px 16px; line-height: 1.5; }
    .container { max-width: 1200px; margin: 0 auto; }
    
    header { background: linear-gradient(135deg, #0f172a, #1e293b); color: white; padding: 28px; border-radius: 16px; margin-bottom: 24px; }
    .badge { display: inline-block; background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; margin-bottom: 8px; }
    header h1 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
    header p { color: #94a3b8; font-size: 14px; }
    .meta { display: flex; gap: 16px; font-size: 13px; color: #cbd5e1; margin-top: 14px; flex-wrap: wrap; }
    
    .guide-card { background: white; border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .guide-card h2 { color: #0f172a; font-size: 16px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 14px; }
    .param-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
    .param-item { background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px; }
    .param-item strong { color: #0369a1; display: block; font-size: 13px; margin-bottom: 3px; }
    
    .table-container { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
    .table-toolbar { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .search-input { flex: 1; min-width: 250px; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; }
    
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 12px; }
    th { background: #f8fafc; padding: 12px 14px; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--border); }
    td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: top; }
    tr:hover td { background: #f8fafc; }
    
    .pill { display: inline-block; padding: 2px 7px; border-radius: 6px; font-size: 11px; font-weight: 600; font-family: monospace; }
    .pill-source { background: #e0f2fe; color: #0369a1; }
    .pill-medium { background: #fef3c7; color: #92400e; }
    
    .btn-copy { background: #0284c7; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.2s; }
    .btn-copy:hover { background: #0369a1; }
    .btn-copy.copied { background: #059669; }
    
    .url-text { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace; font-size: 11px; color: #475569; display: block; margin-top: 4px; }
    footer { text-align: center; margin-top: 32px; font-size: 12px; color: var(--text-muted); }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">Itaipu Parquetec • Comunicação & Marketing</div>
      <h1>${escapeHtml(project.name)}</h1>
      <p>${escapeHtml(project.description || 'Links parametrizados conforme a taxonomia oficial de 9 parâmetros.')}</p>
      <div class="meta">
        <span>📅 Gerado em: ${dateFormatted}</span>
        <span>🔗 Total de Links: ${links.length}</span>
        <span>🛡️ Guia Oficial para Equipe de Conteúdo</span>
      </div>
    </header>

    <section class="guide-card">
      <h2>Entenda cada um dos parâmetros:</h2>
      <div class="param-list">
        <div class="param-item">
          <strong>País</strong>
          Selecione as iniciais do país onde irá divulgar a campanha. É ideal para empresas que trabalham com campanhas internacionais também.
        </div>
        <div class="param-item">
          <strong>Canal</strong>
          Com o canal, você escolhe a fonte principal de divulgação. Alguns exemplos são Email, Blog, Evento e Social.
        </div>
        <div class="param-item">
          <strong>Produto</strong>
          Escolha qual produto específico da sua empresa essa divulgação se refere.
        </div>
        <div class="param-item">
          <strong>Source</strong>
          Com o Source, você vai identificar onde a sua campanha será exibida. Pode ser o próprio Google, Pop-up ou qualquer rede social.
        </div>
        <div class="param-item">
          <strong>Medium</strong>
          O Medium identifica que tipo de mídia você está usando para promover o link (Banner, Email Marketing, CPC, etc.).
        </div>
        <div class="param-item">
          <strong>Macro Estratégias</strong>
          Selecione qual a estratégia macro está trabalhando a partir da divulgação desse link.
        </div>
        <div class="param-item">
          <strong>Identifier</strong>
          Com o Identifier, você define o nome específico do material, vídeo ou outro tipo de conteúdo.
        </div>
        <div class="param-item">
          <strong>Micro Estratégia</strong>
          Defina qual a intenção específica dessa campanha. Você pode incluir a data da campanha, como leads de fevereiro, acessos 11-02, entre outros.
        </div>
        <div class="param-item">
          <strong>URL sem UTM</strong>
          Aqui você vai colocar o link da URL que deseja inserir o UTM.
        </div>
      </div>
    </section>

    <div class="table-container">
      <div class="table-toolbar">
        <input type="text" id="searchInput" class="search-input" placeholder="🔍 Buscar por canal, produto, identifier ou termo...">
        <div id="countBadge" style="font-size: 13px; color: #64748b;">${links.length} links catalogados</div>
      </div>

      <table id="linksTable">
        <thead>
          <tr>
            <th>Source / Medium</th>
            <th>País & Canal</th>
            <th>Produto & Estratégias</th>
            <th>Identifier</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          ${links
            .map(
              (link) => `
          <tr class="link-row" data-search="${escapeHtml(
            `${link.source} ${link.medium} ${link.produto || ''} ${link.macroEstrategia || ''} ${link.microEstrategia || ''} ${link.identifier || ''} ${link.urlFinal}`.toLowerCase()
          )}">
            <td>
              <span class="pill pill-source">${escapeHtml(link.source)}</span>
              <span class="pill pill-medium" style="margin-left: 4px;">${escapeHtml(link.medium)}</span>
              <span class="url-text" title="${escapeHtml(link.urlFinal)}">${escapeHtml(link.urlFinal)}</span>
            </td>
            <td>
              <strong>${escapeHtml(link.pais || 'BR')}</strong> • ${escapeHtml(link.canal || 'Social')}
            </td>
            <td>
              <strong>${escapeHtml(link.produto || 'Geral')}</strong>
              ${link.macroEstrategia ? `<div style="color: #64748b; font-size: 11px;">macro: ${escapeHtml(link.macroEstrategia)}</div>` : ''}
              ${link.microEstrategia ? `<div style="color: #64748b; font-size: 11px;">micro: ${escapeHtml(link.microEstrategia)}</div>` : ''}
            </td>
            <td>
              ${link.identifier ? `<code>${escapeHtml(link.identifier)}</code>` : '<span style="color:#94a3b8;">—</span>'}
            </td>
            <td>
              <button class="btn-copy" onclick="copyLink(this, '${escapeHtml(link.urlFinal)}')">
                📋 Copiar
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
  return (
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'projeto'
  )
}
