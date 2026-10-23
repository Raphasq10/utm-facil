import { useState, useEffect, useCallback } from 'react'
import { Toaster, toast } from 'sonner'
import { FolderPlus, Trash2, Loader2, Sparkles, Zap } from 'lucide-react'
import { Header } from '@/components/Header'
import { TaxonomyRules } from '@/components/TaxonomyRules'
import { UtmBuilder } from '@/components/UtmBuilder'
import { LinksTable } from '@/components/LinksTable'
import { ProjectModal } from '@/components/ProjectModal'
import { EditLinkModal } from '@/components/EditLinkModal'
import { ExportModal } from '@/components/ExportModal'
import { AuthView } from '@/components/AuthView'
import { LandingPage } from '@/components/LandingPage'
import { PricingModal } from '@/components/PricingModal'
import { UpgradePromptModal } from '@/components/UpgradePromptModal'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { checkProjectLimit, checkLinkLimit } from '@/lib/billing'
import {
  initStorage,
  getProjects,
  saveProject,
  updateProject,
  deleteProject,
  getActiveProjectId,
  setActiveProjectId,
  getLinks,
  saveLink,
  updateLink,
  deleteLink,
  isEditorAuthenticated,
  logoutEditor,
  clearDatabase,
} from '@/lib/storage'
import type { Project, UtmLink } from '@/types'

export function App() {
  const { user, loading: authLoading, isDemoMode, needsEmailVerification } = useAuth()

  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjectId, setActiveId] = useState<string>('')
  const [links, setLinks] = useState<UtmLink[]>([])
  const [isEditor, setIsEditor] = useState<boolean>(false)

  // Controle de Navegação Pública (Landing Page vs Login/Cadastro)
  const [publicView, setPublicView] = useState<'landing' | 'auth'>('landing')
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'signup'>('login')

  // Modais Funcionais
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [linkToEdit, setLinkToEdit] = useState<UtmLink | null>(null)

  // Modais de Faturamento & Bloqueio Suave (Feature 2)
  const [pricingModalOpen, setPricingModalOpen] = useState(false)
  const [upgradePromptOpen, setUpgradePromptOpen] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<'project' | 'link' | 'html_export'>('project')

  // Carrega dados isolados por usuário (Multi-Tenancy)
  const refreshData = useCallback(() => {
    if (!user) return

    initStorage(user.id)
    const loadedProjects = getProjects(user.id)
    setProjects(loadedProjects)

    let currentActiveId = getActiveProjectId(user.id)
    if (!currentActiveId && loadedProjects.length > 0) {
      currentActiveId = loadedProjects[0].id
      setActiveProjectId(currentActiveId, user.id)
    }
    setActiveId(currentActiveId)

    const loadedLinks = getLinks(currentActiveId, user.id)
    setLinks(loadedLinks)
    setIsEditor(isEditorAuthenticated())
  }, [user])

  useEffect(() => {
    if (user) {
      refreshData()
    }
  }, [user, refreshData])

  // Recarrega links ao mudar o projeto ativo
  const handleSelectProject = (id: string) => {
    if (!user) return
    setActiveProjectId(id, user.id)
    setActiveId(id)
    const projLinks = getLinks(id, user.id)
    setLinks(projLinks)
    const proj = projects.find((p) => p.id === id)
    if (proj) {
      toast.info(`Projeto ativo alterado para "${proj.name}"`)
    }
  }

  // Cria novo projeto associado ao ID do usuário com validação de limites do plano
  const handleSaveProject = (name: string, description?: string) => {
    if (!user) return

    // Validação de Limite de Projetos por Plano
    const projectCheck = checkProjectLimit(user.plan || 'free', projects.length)
    if (!projectCheck.allowed) {
      setUpgradeReason('project')
      setUpgradePromptOpen(true)
      return
    }

    const newProj = saveProject(name, description, user.id)
    toast.success(`Projeto "${newProj.name}" criado com sucesso!`)
    refreshData()
  }

  // Abre modal para criar projeto com checagem prévia de limite
  const handleOpenNewProject = () => {
    if (!user) return
    const projectCheck = checkProjectLimit(user.plan || 'free', projects.length)
    if (!projectCheck.allowed) {
      setUpgradeReason('project')
      setUpgradePromptOpen(true)
      return
    }
    setProjectToEdit(null)
    setProjectModalOpen(true)
  }

  // Abre modal para editar projeto existente
  const handleEditProject = (proj: Project) => {
    setProjectToEdit(proj)
    setProjectModalOpen(true)
  }

  // Atualiza nome/descrição de projeto com autorização
  const handleUpdateProject = (id: string, name: string, description?: string) => {
    if (!user) return
    const updated = updateProject(id, { name, description }, user.id)
    if (updated) {
      toast.success(`Projeto "${updated.name}" atualizado com sucesso!`)
      refreshData()
    }
  }

  // Exclui projeto e seus links associados
  const handleDeleteProject = (projectId: string) => {
    if (!user) return
    if (projects.length <= 1) {
      toast.error('Você deve manter pelo menos um projeto ativo na sua conta.')
      return
    }
    const proj = projects.find((p) => p.id === projectId)
    const projName = proj ? `"${proj.name}"` : 'este projeto'

    if (
      window.confirm(
        `Tem certeza de que deseja excluir ${projName}? Todos os links vinculados a ele serão apagados permanentemente.`
      )
    ) {
      deleteProject(projectId, user.id)
      toast.success('Projeto e links excluídos com sucesso.')
      refreshData()
    }
  }

  // Retorna a contagem de links de um projeto específico
  const getProjectLinksCount = (projId: string) => {
    if (!user) return 0
    return getLinks(projId, user.id).length
  }

  // Salva novo link associado ao ID do usuário com validação de limite de links
  const handleSaveLink = (linkData: Omit<UtmLink, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    // Validação de Limite de Links por Projeto
    const linkCheck = checkLinkLimit(user.plan || 'free', links.length)
    if (!linkCheck.allowed) {
      setUpgradeReason('link')
      setUpgradePromptOpen(true)
      return
    }

    saveLink(linkData, user.id)
    toast.success('Link UTM gerado e salvo com sucesso!')
    setLinks(getLinks(activeProjectId, user.id))
  }

  // Abre modal de edição
  const handleOpenEditLink = (link: UtmLink) => {
    setLinkToEdit(link)
    setEditModalOpen(true)
  }

  // Atualiza link existente
  const handleUpdateLink = (id: string, updates: Partial<UtmLink>) => {
    if (!user) return
    const updated = updateLink(id, updates, user.id)
    if (updated) {
      toast.success('Link atualizado com sucesso!')
      setLinks(getLinks(activeProjectId, user.id))
    }
  }

  // Exclui link
  const handleDeleteLink = (id: string) => {
    if (!user) return

    if (!isEditor) {
      setLinkToEdit(links.find((l) => l.id === id) || null)
      setEditModalOpen(true)
      return
    }

    if (window.confirm('Tem certeza de que deseja excluir este link rastreável?')) {
      deleteLink(id, user.id)
      toast.success('Link removido do projeto.')
      setLinks(getLinks(activeProjectId, user.id))
    }
  }

  // Alterna Modo Editor
  const handleToggleEditorMode = () => {
    if (isEditor) {
      logoutEditor()
      setIsEditor(false)
      toast.info('Modo Editor encerrado. Sistema em modo leitura e cópia.')
    } else {
      setLinkToEdit(null)
      setEditModalOpen(true)
    }
  }

  // Limpa o banco de dados do usuário
  const handleClearDatabase = () => {
    if (window.confirm('Tem certeza de que deseja limpar os dados locais do seu navegador?')) {
      clearDatabase()
      toast.success('Banco de dados local limpo com sucesso!')
      refreshData()
    }
  }

  // 1. Tela de Carregamento da Sessão
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-sm text-slate-400 font-medium tracking-wide">
          Verificando credenciais seguras do CampanhaUTM...
        </p>
      </div>
    )
  }

  // 2. Experiência Pública: Landing Page de alta conversão ou Login/Cadastro
  if (!user) {
    if (publicView === 'landing') {
      return (
        <>
          <Toaster position="top-right" richColors closeButton />
          <LandingPage
            onLogin={() => {
              setAuthInitialTab('login')
              setPublicView('auth')
            }}
            onSignup={() => {
              setAuthInitialTab('signup')
              setPublicView('auth')
            }}
            onSelectPlan={(_plan) => {
              setAuthInitialTab('signup')
              setPublicView('auth')
            }}
          />
        </>
      )
    }

    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <AuthView
          initialMode={authInitialTab}
          onBackToLanding={() => setPublicView('landing')}
        />
      </>
    )
  }

  // 3. Bloqueio de Segurança: Exige confirmação de e-mail para acesso ao painel
  if (user && needsEmailVerification) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <AuthView onBackToLanding={() => setPublicView('landing')} />
      </>
    )
  }

  const activeProject = projects.find((p) => p.id === activeProjectId)

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
      <Toaster position="top-right" richColors closeButton />

      {/* Header Institucional, Ações & Perfil */}
      <Header
        projects={projects}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        onOpenNewProjectModal={handleOpenNewProject}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        onOpenExportModal={() => setExportModalOpen(true)}
        onOpenPricingModal={() => setPricingModalOpen(true)}
        isEditor={isEditor}
        onToggleEditorMode={handleToggleEditorMode}
        linksCount={links.length}
        getProjectLinksCount={getProjectLinksCount}
      />

      {/* Alerta informativo quando no Modo Demo Local */}
      {isDemoMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 text-xs text-amber-800 dark:text-amber-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              Sessão local isolada por usuário (Multi-Tenancy). Planos e webhooks da Hotmart prontos para simulação.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPricingModalOpen(true)}
                className="font-bold underline text-amber-900 dark:text-amber-200 hover:text-emerald-700 cursor-pointer"
              >
                Gerenciar Assinatura Hotmart
              </button>
              <span className="font-semibold text-[11px] uppercase tracking-wider bg-amber-200/60 dark:bg-amber-900/40 px-2 py-0.5 rounded">
                Plano {user.plan?.toUpperCase() || 'FREE'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner do Guia de Taxonomia */}
        <TaxonomyRules />

        {/* CASO 1: AINDA NÃO HÁ NENHUM PROJETO CADASTRADO */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
              <FolderPlus className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Seu Painel de Campanhas está Pronto!
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Crie o seu primeiro projeto (ex: o nome do seu cliente, campanha ou e-commerce) para começar a gerar links com UTMs limpos.
              </p>
            </div>
            <div className="pt-2">
              <Button
                type="button"
                size="lg"
                onClick={handleOpenNewProject}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <FolderPlus className="w-5 h-5 mr-1" />
                Criar Primeiro Projeto
              </Button>
            </div>
          </div>
        ) : (
          /* CASO 2: HÁ PROJETO ATIVO — MOSTRA O CONSTRUTOR E A TABELA */
          <div className="space-y-6">
            <UtmBuilder activeProject={activeProject} onSaveLink={handleSaveLink} />

            <LinksTable
              project={activeProject}
              links={links}
              isEditor={isEditor}
              onEditLink={handleOpenEditLink}
              onDeleteLink={handleDeleteLink}
              onOpenExportModal={() => setExportModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Rodapé Comercial Acessível */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-800">CampanhaUTM — campanhautm.com.br</span>
            <p className="text-[11px] text-slate-400">
              Ambiente Seguro • Padrão WCAG 2.1 AA • Taxonomia Oficial GA4 • Checkout Hotmart
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => setPricingModalOpen(true)}
              className="text-emerald-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-500" /> Ver Planos & Preços
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleClearDatabase}
              className="text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              title="Apagar todos os dados locais e recomeçar do zero"
            >
              <Trash2 className="w-3 h-3" /> Limpar Dados Locais
            </button>
            <span>•</span>
            <span>Chave de Edição: <code>parquetec2026</code></span>
          </div>
        </div>
      </footer>

      {/* Modais do Sistema */}
      <ProjectModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
        onSaveProject={handleSaveProject}
        onUpdateProject={handleUpdateProject}
        projectToEdit={projectToEdit}
        currentProjectCount={projects.length}
        userPlan={user.plan || 'free'}
        onOpenPricing={() => setPricingModalOpen(true)}
      />

      <EditLinkModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        linkToEdit={linkToEdit}
        isEditor={isEditor}
        onAuthenticatedEditor={() => {
          setIsEditor(true)
          toast.success('Modo Editor desbloqueado com sucesso!')
        }}
        onUpdateLink={handleUpdateLink}
      />

      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        project={activeProject}
        links={links}
        userPlan={user.plan || 'free'}
        onRequireUpgrade={(reason) => {
          setUpgradeReason(reason)
          setUpgradePromptOpen(true)
        }}
      />

      {/* Modais de Faturamento (Feature 2) */}
      <PricingModal
        open={pricingModalOpen}
        onOpenChange={setPricingModalOpen}
        highlightPlan={upgradeReason === 'project' ? 'pro' : 'pro'}
      />

      <UpgradePromptModal
        open={upgradePromptOpen}
        onOpenChange={setUpgradePromptOpen}
        onOpenPricing={() => setPricingModalOpen(true)}
        limitReason={upgradeReason}
      />
    </div>
  )
}

export default App
