import { useState, useEffect, useCallback } from 'react'
import { Toaster, toast } from 'sonner'
import { FolderPlus, Trash2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { TaxonomyRules } from '@/components/TaxonomyRules'
import { UtmBuilder } from '@/components/UtmBuilder'
import { LinksTable } from '@/components/LinksTable'
import { ProjectModal } from '@/components/ProjectModal'
import { EditLinkModal } from '@/components/EditLinkModal'
import { ExportModal } from '@/components/ExportModal'
import { Button } from '@/components/ui/button'
import {
  getProjects,
  saveProject,
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
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjectId, setActiveId] = useState<string>('')
  const [links, setLinks] = useState<UtmLink[]>([])
  const [isEditor, setIsEditor] = useState<boolean>(false)

  // Modais
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [linkToEdit, setLinkToEdit] = useState<UtmLink | null>(null)

  // Carrega dados
  const refreshData = useCallback(() => {
    const loadedProjects = getProjects()
    setProjects(loadedProjects)

    let currentActiveId = getActiveProjectId()
    if (!currentActiveId && loadedProjects.length > 0) {
      currentActiveId = loadedProjects[0].id
      setActiveProjectId(currentActiveId)
    }
    setActiveId(currentActiveId)

    const loadedLinks = getLinks(currentActiveId)
    setLinks(loadedLinks)
    setIsEditor(isEditorAuthenticated())
  }, [])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  // Recarrega links ao mudar o projeto ativo
  const handleSelectProject = (id: string) => {
    setActiveProjectId(id)
    setActiveId(id)
    const projLinks = getLinks(id)
    setLinks(projLinks)
    const proj = projects.find((p) => p.id === id)
    if (proj) {
      toast.info(`Projeto ativo alterado para "${proj.name}"`)
    }
  }

  // Cria novo projeto
  const handleSaveProject = (name: string, description?: string) => {
    const newProj = saveProject(name, description)
    toast.success(`Projeto "${newProj.name}" criado com sucesso!`)
    refreshData()
  }

  // Salva novo link
  const handleSaveLink = (linkData: Omit<UtmLink, 'id' | 'createdAt' | 'updatedAt'>) => {
    saveLink(linkData)
    toast.success('Link UTM gerado e salvo com sucesso!')
    setLinks(getLinks(activeProjectId))
  }

  // Abre modal de edição
  const handleOpenEditLink = (link: UtmLink) => {
    setLinkToEdit(link)
    setEditModalOpen(true)
  }

  // Atualiza link existente
  const handleUpdateLink = (id: string, updates: Partial<UtmLink>) => {
    const updated = updateLink(id, updates)
    if (updated) {
      toast.success('Link atualizado com sucesso!')
      setLinks(getLinks(activeProjectId))
    }
  }

  // Exclui link
  const handleDeleteLink = (id: string) => {
    if (!isEditor) {
      setLinkToEdit(links.find((l) => l.id === id) || null)
      setEditModalOpen(true)
      return
    }

    if (window.confirm('Tem certeza de que deseja excluir este link rastreável?')) {
      deleteLink(id)
      toast.success('Link removido do projeto.')
      setLinks(getLinks(activeProjectId))
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

  // Limpa o banco de dados completamente
  const handleClearDatabase = () => {
    if (window.confirm('Tem certeza de que deseja limpar TODO o banco de dados local? Esta ação apagará todos os projetos e links salvos no navegador.')) {
      clearDatabase()
      toast.success('Banco de dados local limpo com sucesso!')
      refreshData()
    }
  }

  const activeProject = projects.find((p) => p.id === activeProjectId)

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
      <Toaster position="top-right" richColors closeButton />

      {/* Header Institucional */}
      <Header
        projects={projects}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        onOpenNewProjectModal={() => setProjectModalOpen(true)}
        onOpenExportModal={() => setExportModalOpen(true)}
        isEditor={isEditor}
        onToggleEditorMode={handleToggleEditorMode}
        linksCount={links.length}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner do Guia de Taxonomia */}
        <TaxonomyRules />

        {/* CASO 1: AINDA NÃO HÁ NENHUM PROJETO CADASTRADO */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto border border-sky-100 shadow-xs">
              <FolderPlus className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Banco de Dados Limpo & Pronto para Começar!
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Para começar a gerar e organizar seus links rastreáveis, crie o seu projeto (ex: o nome da sua campanha, evento ou área).
              </p>
            </div>
            <div className="pt-2">
              <Button
                type="button"
                size="lg"
                onClick={() => setProjectModalOpen(true)}
                className="bg-sky-600 hover:bg-sky-500 font-semibold cursor-pointer shadow-md shadow-sky-600/20"
              >
                <FolderPlus className="w-5 h-5" />
                Criar Meu Primeiro Projeto
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

      {/* Rodapé Acessível */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-700">Gerador de Links UTM — Itaipu Parquetec</span>
            <p className="text-[11px] text-slate-400">
              Ambiente Localhost • Padrão WCAG 2.1 AA • Taxonomia Oficial GA4
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap justify-center">
            <span>
              Status:{' '}
              <strong className="text-emerald-600 font-medium">● Local Storage Ativo</strong>
            </span>
            <span>•</span>
            <button
              type="button"
              onClick={handleClearDatabase}
              className="text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              title="Apagar todos os dados locais e recomeçar do zero"
            >
              <Trash2 className="w-3 h-3" /> Limpar Banco Local
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
      />
    </div>
  )
}

export default App
