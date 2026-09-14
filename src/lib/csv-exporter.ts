import type { Project, UtmLink } from '@/types'

/**
 * Exporta os links de um projeto em formato CSV compatível com Excel e Google Sheets.
 * Inclui o cabeçalho UTF-8 BOM (\uFEFF) para garantir a correta renderização de acentos no Excel.
 */
export function exportProjectToCsv(project: Project, links: UtmLink[]): void {
  const headers = [
    'Projeto',
    'URL Destino',
    'Origem (utm_source)',
    'Mídia (utm_medium)',
    'Campanha (utm_campaign)',
    'Termo (utm_term)',
    'Conteúdo (utm_content)',
    'Descrição / Observações',
    'URL Final Gerada',
    'Data de Criação',
  ]

  const rows = links.map((link) => [
    escapeCsvCell(project.name),
    escapeCsvCell(link.urlDestino),
    escapeCsvCell(link.utmSource),
    escapeCsvCell(link.utmMedium),
    escapeCsvCell(link.utmCampaign),
    escapeCsvCell(link.utmTerm || ''),
    escapeCsvCell(link.utmContent || ''),
    escapeCsvCell(link.descricao || ''),
    escapeCsvCell(link.urlFinal),
    escapeCsvCell(new Date(link.createdAt).toLocaleString('pt-BR')),
  ])

  const csvContent = [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\r\n')

  // \uFEFF força o Excel a reconhecer o arquivo como UTF-8
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const downloadLink = document.createElement('a')
  downloadLink.href = url
  downloadLink.download = `links-${sanitizeSlug(project.name)}.csv`
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  URL.revokeObjectURL(url)
}

function escapeCsvCell(cell: string): string {
  if (!cell) return '""'
  const stringified = String(cell)
  if (stringified.includes(';') || stringified.includes('"') || stringified.includes('\n')) {
    return `"${stringified.replace(/"/g, '""')}"`
  }
  return `"${stringified}"`
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
