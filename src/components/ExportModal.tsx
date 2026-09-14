import { Globe, FileSpreadsheet, Download, FileJson } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { exportProjectToStandaloneHtml } from '@/lib/html-exporter'
import { exportProjectToCsv } from '@/lib/csv-exporter'
import { exportFullBackup } from '@/lib/storage'
import type { Project, UtmLink } from '@/types'

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | undefined
  links: UtmLink[]
}

export function ExportModal({ open, onOpenChange, project, links }: ExportModalProps) {
  if (!project) return null

  const handleExportHtml = () => {
    exportProjectToStandaloneHtml(project, links)
    onOpenChange(false)
  }

  const handleExportCsv = () => {
    exportProjectToCsv(project, links)
    onOpenChange(false)
  }

  const handleExportJson = () => {
    const json = exportFullBackup()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-gerador-utm-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose onClick={() => onOpenChange(false)} />
      <DialogHeader>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 border border-emerald-100">
          <Download className="w-5 h-5" />
        </div>
        <DialogTitle>Exportar Links & Guias de Campanha</DialogTitle>
        <DialogDescription>
          Escolha o formato ideal para compartilhar os links oficiais do projeto{' '}
          <strong>"{project.name}"</strong> ({links.length} links).
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3 mt-3">
        {/* OPÇÃO 1: HTML AUTÔNOMO (DIFERENCIAL PARA TIME DE CONTEÚDO) */}
        <button
          type="button"
          onClick={handleExportHtml}
          className="w-full p-4 rounded-2xl border-2 border-sky-200 bg-sky-50/50 hover:bg-sky-50 hover:border-sky-400 text-left transition-all flex items-start gap-4 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Globe className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 group-hover:text-sky-700">
                Guia em HTML Autônomo
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                Recomendado para Conteúdo
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gera um arquivo <code>.html</code> estático com o guia visual de regras e botões de "Copiar Link".
              Os redatores e designers podem abrir no navegador em qualquer computador sem precisar de internet ou servidor.
            </p>
          </div>
        </button>

        {/* OPÇÃO 2: PLANILHA CSV */}
        <button
          type="button"
          onClick={handleExportCsv}
          className="w-full p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-left transition-all flex items-start gap-4 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                Planilha CSV (Excel / Google Sheets)
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Baixa a tabela estruturada com separador compatível e codificação UTF-8 BOM para abrir sem erros de acentuação no Microsoft Excel.
            </p>
          </div>
        </button>

        {/* OPÇÃO 3: BACKUP TOTAL JSON */}
        <button
          type="button"
          onClick={handleExportJson}
          className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-left transition-all flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
            <FileJson className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-800">Backup Completo do Banco (JSON)</span>
            <p className="text-[11px] text-slate-500">Salva todos os projetos e links para restauração local futura.</p>
          </div>
        </button>
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
          Fechar
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
