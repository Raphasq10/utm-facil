import { Globe, FileSpreadsheet, Download, FileJson, Lock } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { exportProjectToStandaloneHtml } from '@/lib/html-exporter'
import { exportProjectToCsv } from '@/lib/csv-exporter'
import { exportFullBackup } from '@/lib/storage'
import type { Project, UtmLink } from '@/types'

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | undefined
  links: UtmLink[]
  userPlan?: string
  onRequireUpgrade?: (reason: 'project' | 'link' | 'html_export') => void
}

export function ExportModal({
  open,
  onOpenChange,
  project,
  links,
  userPlan = 'free',
  onRequireUpgrade,
}: ExportModalProps) {
  if (!project) return null

  const isFreePlan = userPlan === 'free'

  const handleExportHtml = () => {
    if (isFreePlan && onRequireUpgrade) {
      onOpenChange(false)
      onRequireUpgrade('html_export')
      return
    }
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
          className="w-full p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-400 text-left transition-all flex items-start gap-4 group cursor-pointer relative"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Globe className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                Guia em HTML Autônomo
              </span>
              {isFreePlan ? (
                <span className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> RECURSO PRO
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                  Recomendado para Conteúdo
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gera um arquivo <code>.html</code> independente e bonito com a tabela completa e botões
              de cópia rápida para redatores e designers abrirem no navegador sem login.
            </p>
          </div>
        </button>

        {/* OPÇÃO 2: PLANILHA CSV (COMPATÍVEL COM EXCEL / SHEETS) */}
        <button
          type="button"
          onClick={handleExportCsv}
          className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 text-left transition-all flex items-start gap-4 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 group-hover:text-slate-800">
                Planilha CSV (Excel / Google Sheets)
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                Disponível no Free
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Baixa uma planilha com todas as colunas de taxonomia, datas de criação e parâmetros UTM formatados.
            </p>
          </div>
        </button>

        {/* OPÇÃO 3: BACKUP JSON COMPLETO */}
        <button
          type="button"
          onClick={handleExportJson}
          className="w-full p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all flex items-start gap-4 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200 group-hover:scale-105 transition-transform">
            <FileJson className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
              Backup Completo em JSON
            </span>
            <p className="text-xs text-slate-400">
              Arquivo estruturado contendo todos os projetos e links armazenados localmente para recuperação de dados.
            </p>
          </div>
        </button>
      </div>
    </Dialog>
  )
}
