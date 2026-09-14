import type { Project, UtmLink } from '@/types'

const STORAGE_KEYS = {
  PROJECTS: 'utm_itaipu_projects',
  LINKS: 'utm_itaipu_links',
  ACTIVE_PROJECT: 'utm_itaipu_active_project',
  AUTH_SESSION: 'utm_itaipu_auth_session',
}

const DEFAULT_EDITOR_KEY = import.meta.env.VITE_EDITOR_MASTER_KEY || 'parquetec2026'

// Dados iniciais de demonstração (representando iniciativas reais do Itaipu Parquetec)
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-inovacao-2026',
    name: 'Hub de Inovação & Aceleração 2026',
    description: 'Campanhas para captação de startups e projetos para os editais do Itaipu Parquetec.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-institucional-marca',
    name: 'Ações Institucionais & Parcerias',
    description: 'Divulgação de eventos, visitas técnicas e comunicação de sustentabilidade.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const INITIAL_LINKS: UtmLink[] = [
  {
    id: 'link-meta-startups',
    projectId: 'proj-inovacao-2026',
    urlDestino: 'https://itaipuparquetec.org.br/editais',
    utmSource: 'meta-ads',
    utmMedium: 'feed-carrossel',
    utmCampaign: 'edital-aceleracao-2026',
    utmTerm: 'startups-deeptech',
    utmContent: 'cta-inscreva-se-agora',
    descricao: 'Anúncio no Feed do Instagram para startups de energia limpa',
    urlFinal: 'https://itaipuparquetec.org.br/editais?utm_source=meta-ads&utm_medium=feed-carrossel&utm_campaign=edital-aceleracao-2026&utm_term=startups-deeptech&utm_content=cta-inscreva-se-agora',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'link-linkedin-aceleracao',
    projectId: 'proj-inovacao-2026',
    urlDestino: 'https://itaipuparquetec.org.br/editais',
    utmSource: 'linkedin',
    utmMedium: 'post-organico',
    utmCampaign: 'edital-aceleracao-2026',
    utmTerm: '',
    utmContent: 'depoimento-fundador',
    descricao: 'Post no perfil oficial do Itaipu Parquetec no LinkedIn',
    urlFinal: 'https://itaipuparquetec.org.br/editais?utm_source=linkedin&utm_medium=post-organico&utm_campaign=edital-aceleracao-2026&utm_content=depoimento-fundador',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'link-newsletter-visitas',
    projectId: 'proj-institucional-marca',
    urlDestino: 'https://itaipuparquetec.org.br/visitas-tecnicas',
    utmSource: 'email-marketing',
    utmMedium: 'newsletter-mensal',
    utmCampaign: 'visitas-tecnicas-outubro',
    utmTerm: '',
    utmContent: 'botao-agendar-visita',
    descricao: 'Disparo de e-mail institucional para universidades parceiras',
    urlFinal: 'https://itaipuparquetec.org.br/visitas-tecnicas?utm_source=email-marketing&utm_medium=newsletter-mensal&utm_campaign=visitas-tecnicas-outubro&utm_content=botao-agendar-visita',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
]

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : defaultValue
  } catch {
    return defaultValue
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`Erro ao salvar ${key} no localStorage:`, err)
  }
}

// Inicializa dados no primeiro uso
export function initStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    setToStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS)
  }
  if (!localStorage.getItem(STORAGE_KEYS.LINKS)) {
    setToStorage(STORAGE_KEYS.LINKS, INITIAL_LINKS)
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT)) {
    setToStorage(STORAGE_KEYS.ACTIVE_PROJECT, INITIAL_PROJECTS[0].id)
  }
}

// ==========================================================
// PROJETOS
// ==========================================================

export function getProjects(): Project[] {
  initStorage()
  return getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS)
}

export function saveProject(name: string, description?: string): Project {
  const projects = getProjects()
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    name: name.trim(),
    description: description ? description.trim() : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const updated = [newProject, ...projects]
  setToStorage(STORAGE_KEYS.PROJECTS, updated)
  setActiveProjectId(newProject.id)
  return newProject
}

export function deleteProject(projectId: string): void {
  const projects = getProjects().filter((p) => p.id !== projectId)
  setToStorage(STORAGE_KEYS.PROJECTS, projects)

  // Remove também todos os links atrelados a este projeto
  const links = getLinks().filter((l) => l.projectId !== projectId)
  setToStorage(STORAGE_KEYS.LINKS, links)

  // Se o projeto ativo for o removido, troca para o primeiro restante
  if (getActiveProjectId() === projectId) {
    setActiveProjectId(projects.length > 0 ? projects[0].id : '')
  }
}

export function getActiveProjectId(): string {
  initStorage()
  return getFromStorage<string>(STORAGE_KEYS.ACTIVE_PROJECT, INITIAL_PROJECTS[0]?.id || '')
}

export function setActiveProjectId(id: string): void {
  setToStorage(STORAGE_KEYS.ACTIVE_PROJECT, id)
}

// ==========================================================
// LINKS
// ==========================================================

export function getLinks(projectId?: string): UtmLink[] {
  initStorage()
  const allLinks = getFromStorage<UtmLink[]>(STORAGE_KEYS.LINKS, INITIAL_LINKS)
  if (!projectId) return allLinks
  return allLinks.filter((link) => link.projectId === projectId)
}

export function saveLink(linkData: Omit<UtmLink, 'id' | 'createdAt' | 'updatedAt'>): UtmLink {
  const allLinks = getLinks()
  const newLink: UtmLink = {
    ...linkData,
    id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const updated = [newLink, ...allLinks]
  setToStorage(STORAGE_KEYS.LINKS, updated)
  return newLink
}

export function updateLink(id: string, updates: Partial<Omit<UtmLink, 'id' | 'createdAt'>>): UtmLink | null {
  const allLinks = getLinks()
  const index = allLinks.findIndex((l) => l.id === id)
  if (index === -1) return null

  const updatedLink: UtmLink = {
    ...allLinks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  allLinks[index] = updatedLink
  setToStorage(STORAGE_KEYS.LINKS, allLinks)
  return updatedLink
}

export function deleteLink(id: string): boolean {
  const allLinks = getLinks()
  const filtered = allLinks.filter((l) => l.id !== id)
  if (filtered.length === allLinks.length) return false
  setToStorage(STORAGE_KEYS.LINKS, filtered)
  return true
}

// ==========================================================
// AUTENTICAÇÃO / MODO DE EDIÇÃO
// ==========================================================

export function isEditorAuthenticated(): boolean {
  return sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === 'true'
}

export function verifyEditorKey(inputKey: string): boolean {
  if (inputKey.trim() === DEFAULT_EDITOR_KEY) {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true')
    return true
  }
  return false
}

export function logoutEditor(): void {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION)
}

// ==========================================================
// BACKUP / EXPORTAÇÃO JSON
// ==========================================================

export function exportFullBackup(): string {
  const backup = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    projects: getProjects(),
    links: getLinks(),
  }
  return JSON.stringify(backup, null, 2)
}

export function importFullBackup(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString)
    if (data && Array.isArray(data.projects) && Array.isArray(data.links)) {
      setToStorage(STORAGE_KEYS.PROJECTS, data.projects)
      setToStorage(STORAGE_KEYS.LINKS, data.links)
      if (data.projects.length > 0) {
        setActiveProjectId(data.projects[0].id)
      }
      return true
    }
    return false
  } catch {
    return false
  }
}
