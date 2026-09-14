import { useState } from 'react'
import { Link2, FolderKanban, Lock, Unlock, Download, Plus } from 'lucide-react'
import type { Project } from '@/types'

interface HeaderProps {
  projects: Project[]
  activeProject: Project | undefined
  onSelectProject: (id: string) => void
  onOpenNewProjectModal: () => void
  onOpenExportModal: () => void
  isEditor: boolean
  onToggleEditorMode: () => void
  linksCount: number
}

export function Header({
  projects,
  activeProject,
  onSelectProject,
  onOpenNewProjectModal,
  onOpenExportModal,
  isEditor,
  onToggleEditorMode,
  linksCount,
}: HeaderProps) {
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false)

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Marca */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-slate-950 font-bold shadow-sm">
              <Link2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  Gerador de UTMs
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Itaipu Parquetec
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Banco Central de Links Rastreáveis • Marketing & Comunicação
              </p>
            </div>
          </div>

          {/* Seletor de Projetos & Ações */}
          <div className="flex items-center gap-3">
            {/* Seletor de Projeto Ativo */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 text-sm font-medium transition-all text-slate-200"
              >
                <FolderKanban className="w-4 h-4 text-sky-400" />
                <span className="max-w-[160px] sm:max-w-[220px] truncate text-white">
                  {activeProject ? activeProject.name : 'Selecionar Projeto'}
                </span>
                <span className="text-[11px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                  {linksCount} links
                </span>
              </button>

              {/* Dropdown Menu */}
              {projectDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProjectDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-2 text-sm">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      Projetos Cadastrados
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                      {projects.map((proj) => (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() => {
                            onSelectProject(proj.id)
                            setProjectDropdownOpen(false)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                            activeProject?.id === proj.id
                              ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{proj.name}</span>
                          {activeProject?.id === proj.id && (
                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setProjectDropdownOpen(false)
                          onOpenNewProjectModal()
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-sky-400 hover:bg-sky-950/40 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Criar Novo Projeto
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Botão Novo Projeto */}
            <button
              type="button"
              onClick={onOpenNewProjectModal}
              className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-2 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
              title="Cadastrar nova pasta de campanha"
            >
              <Plus className="w-3.5 h-3.5 text-slate-300" />
              Novo Projeto
            </button>

            {/* Botão Exportar Guia / CSV */}
            <button
              type="button"
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
              title="Exportar arquivo HTML autônomo para o time de conteúdo ou planilha CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Exportar Guia / CSV</span>
              <span className="md:hidden">Exportar</span>
            </button>

            {/* Toggle Modo Editor */}
            <button
              type="button"
              onClick={onToggleEditorMode}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                isEditor
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title={
                isEditor
                  ? 'Modo Editor Ativo (Edição e Exclusão liberadas)'
                  : 'Acesso Especial: clique para desbloquear edição com senha'
              }
            >
              {isEditor ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline font-semibold">Editor</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Acesso Edição</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
