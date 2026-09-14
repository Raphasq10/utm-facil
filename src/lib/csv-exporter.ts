import type { Project, UtmLink } from '@/types'

/**
 * Exporta os links do projeto em CSV compatível com Excel e Google Sheets
 * com as 9 colunas da taxonomia de referência.
 */
export function exportProjectToCsv(project: Project, links: UtmLink[]): void {
  const headers = [
    'Projeto',
    'URL sem UTM',
    'País',
    'Canal',
    'Produto',
    'Source',
    'Medium',
    'Macro Estratégias',
    'Identifier',
    'Micro Estratégia',
    'Descrição / Observações',
    'URL Final Gerada',
    'Data de Criação',
  ]

  const rows = links.map((link) => [
    escapeCsvCell(project.name),
    escapeCsvCell(link.urlDestino),
    escapeCsvCell(link.pais || 'BR'),
    escapeCsvCell(link.canal || 'Social'),
    escapeCsvCell(link.produto || ''),
    escapeCsvCell(link.source),
    escapeCsvCell(link.medium),
    escapeCsvCell(link.macroEstrategia || ''),
    escapeCsvCell(link.identifier || ''),
    escapeCsvCell(link.microEstrategia || ''),
    escapeCsvCell(link.descricao || ''),
    escapeCsvCell(link.urlFinal),
    escapeCsvCell(new Date(link.createdAt).toLocaleString('pt-BR')),
  ])

  const csvContent = [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\r\n')

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
