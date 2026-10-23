import { useState } from 'react'
import {
  Link2,
  FolderKanban,
  Lock,
  Unlock,
  Download,
  Plus,
  LogOut,
  UserCheck,
  Pencil,
  Trash2,
  Sparkles,
} from 'lucide-react'
import type { Project } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import { PLAN_CONFIGS } from '@/types/billing'

interface HeaderProps {
  projects: Project[]
  activeProject: Project | undefined
  onSelectProject: (id: string) => void
  onOpenNewProjectModal: () => void
  onEditProject?: (project: Project) => void
  onDeleteProject?: (projectId: string) => void
  onOpenExportModal: () => void
  onOpenPricingModal: () => void
  isEditor: boolean
  onToggleEditorMode: () => void
  linksCount: number
  getProjectLinksCount?: (projectId: string) => number
}

export function Header({
  projects,
  activeProject,
  onSelectProject,
  onOpenNewProjectModal,
  onEditProject,
  onDeleteProject,
  onOpenExportModal,
  onOpenPricingModal,
  isEditor,
  onToggleEditorMode,
  linksCount,
  getProjectLinksCount,
}: HeaderProps) {
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const { user, signOut } = useAuth()

  const userPlan = user?.plan || 'free'
  const planConfig = PLAN_CONFIGS[userPlan] || PLAN_CONFIGS.free
  const maxProjects = planConfig.maxProjects

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Marca Comercial CampanhaUTM */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-sm shrink-0">
              <Link2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  Campanha<span className="text-emerald-400">UTM</span>
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  campanhautm.com.br
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden lg:block">
                Plataforma de Taxonomia GA4 & Banco Central de Links
              </p>
            </div>
          </div>

          {/* Seletor de Projetos, Ações e Perfil do Usuário */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Seletor de Projeto Ativo */}
            <div className="relative">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2.5 bg-slate-800/90 hover:bg-slate-800 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-700 text-xs sm:text-sm font-medium transition-all text-slate-200 cursor-pointer"
                >
                  <FolderKanban className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                  <span className="max-w-[85px] sm:max-w-[180px] truncate text-white">
                    {activeProject ? activeProject.name : 'Selecionar'}
                  </span>
                  <span className="text-[10px] sm:text-[11px] bg-slate-700 text-slate-300 px-1.5 sm:px-2 py-0.5 rounded-md font-mono shrink-0">
                    {linksCount}
                  </span>
                </button>

                {/* Botão de Edição Rápida do Projeto Ativo */}
                {activeProject && onEditProject && (
                  <button
                    type="button"
                    onClick={() => onEditProject(activeProject)}
                    className="ml-1 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    title={`Editar pasta "${activeProject.name}"`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dropdown Menu de Projetos */}
              {projectDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProjectDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-2.5 text-sm">
                    <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                      <span>Projetos ({projects.length})</span>
                      <span className="text-[10px] text-emerald-400 font-normal">Multi-Tenancy</span>
                    </div>

                    {/* Barra de Uso vs Limite do Plano */}
                    <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800/80 mb-2 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">Limite do {planConfig.name}:</span>
                        <span className="font-mono font-bold text-emerald-400 text-[11px]">
                          {projects.length} de {maxProjects === Infinity ? 'Ilimitados' : maxProjects}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            maxProjects !== Infinity && projects.length >= maxProjects
                              ? 'bg-amber-400'
                              : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${
                              maxProjects === Infinity
                                ? 25
                                : Math.min(100, (projects.length / maxProjects) * 100)
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Lista dos Projetos */}
                    <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                      {projects.map((proj) => {
                        const count = getProjectLinksCount ? getProjectLinksCount(proj.id) : 0
                        const isActive = activeProject?.id === proj.id

                        return (
                          <div
                            key={proj.id}
                            className={`w-full px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors group ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                onSelectProject(proj.id)
                                setProjectDropdownOpen(false)
                              }}
                              className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer"
                            >
                              <span className="truncate">{proj.name}</span>
                              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono shrink-0">
                                {count}
                              </span>
                            </button>

                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0 ml-1">
                              {onEditProject && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProjectDropdownOpen(false)
                                    onEditProject(proj)
                                  }}
                                  className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors"
                                  title="Editar nome/descrição"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              )}
                              {onDeleteProject && projects.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProjectDropdownOpen(false)
                                    onDeleteProject(proj.id)
                                  }}
                                  className="p-1 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 rounded transition-colors"
                                  title="Excluir projeto e seus links"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setProjectDropdownOpen(false)
                          onOpenNewProjectModal()
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
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
              className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-2 rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Cadastrar nova pasta de campanha"
            >
              <Plus className="w-3.5 h-3.5 text-slate-300" />
              Novo Projeto
            </button>

            {/* Botão Exportar Guia / CSV */}
            <button
              type="button"
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
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
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
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

            {/* Perfil do Usuário Autenticado & Logout */}
            {user && (
              <div className="flex items-center gap-2">
                {/* Botão de Upgrade Rápido para usuários Free */}
                {user.plan === 'free' && (
                  <button
                    type="button"
                    onClick={onOpenPricingModal}
                    className="hidden lg:inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                    title="Aumente seus limites de projetos e links"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fazer Upgrade</span>
                  </button>
                )}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white pl-2.5 pr-3 py-1.5 rounded-xl border border-slate-700 text-xs font-medium transition-all cursor-pointer"
                    title="Menu da Conta"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-[11px]">
                      {user.fullName ? user.fullName[0].toUpperCase() : user.email[0].toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate hidden sm:inline">
                      {user.fullName || user.email}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 px-1.5 border-emerald-500/40 text-emerald-300 bg-emerald-500/10">
                      {user.plan || 'Free'}
                    </Badge>
                  </button>

                  {userDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-2 text-sm">
                        <div className="p-3 border-b border-slate-800 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Conectado como:</span>
                          </div>
                          <p className="font-semibold text-white text-xs truncate">{user.fullName}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>

                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false)
                              onOpenPricingModal()
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-950/30 rounded-lg transition-colors cursor-pointer"
                          >
                            <span>Planos & Assinatura</span>
                            <Badge variant="outline" className="text-[9px] uppercase font-bold px-1 py-0 border-emerald-500/40 text-emerald-300">
                              {user.plan || 'Free'}
                            </Badge>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false)
                              signOut()
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer border-t border-slate-800/80 mt-1"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Encerrar Sessão (Sair)
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
