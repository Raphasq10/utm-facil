import type { Project, UtmLink } from '@/types'

const STORAGE_KEYS = {
  PROJECTS: 'utm_itaipu_projects_v2',
  LINKS: 'utm_itaipu_links_v2',
  ACTIVE_PROJECT: 'utm_itaipu_active_project_v2',
  AUTH_SESSION: 'utm_itaipu_auth_session',
}

const DEFAULT_EDITOR_KEY = import.meta.env.VITE_EDITOR_MASTER_KEY || 'parquetec2026'

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
    pais: 'BR',
    canal: 'Social',
    produto: 'Edital Aceleração',
    source: 'Instagram',
    medium: 'Stories',
    macroEstrategia: 'Conversão',
    identifier: 'Video Teaser Startups 01',
    microEstrategia: 'Leads de Fevereiro',
    descricao: 'Anúncio no Stories do Instagram convidando startups de energia limpa',
    urlFinal:
      'https://itaipuparquetec.org.br/editais?utm_source=instagram&utm_medium=stories&utm_campaign=br_edital-aceleracao_conversao_leads-de-fevereiro&utm_content=video-teaser-startups-01&utm_term=social',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'link-linkedin-institucional',
    projectId: 'proj-institucional-marca',
    urlDestino: 'https://itaipuparquetec.org.br/visitas-tecnicas',
    pais: 'BR',
    canal: 'Social',
    produto: 'Visitas Técnicas',
    source: 'LinkedIn',
    medium: 'Post Orgânico',
    macroEstrategia: 'Branding',
    identifier: 'Carrossel Fotos Usina',
    microEstrategia: 'Acessos 11-02',
    descricao: 'Post no feed do LinkedIn para universidades parceiras',
    urlFinal:
      'https://itaipuparquetec.org.br/visitas-tecnicas?utm_source=linkedin&utm_medium=post-organico&utm_campaign=br_visitas-tecnicas_branding_acessos-11-02&utm_content=carrossel-fotos-usina&utm_term=social',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
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

  const links = getLinks().filter((l) => l.projectId !== projectId)
  setToStorage(STORAGE_KEYS.LINKS, links)

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

export function exportFullBackup(): string {
  const backup = {
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    projects: getProjects(),
    links: getLinks(),
  }
  return JSON.stringify(backup, null, 2)
}
