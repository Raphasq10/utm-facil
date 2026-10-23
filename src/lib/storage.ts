import type { Project, UtmLink } from '@/types'

const STORAGE_KEYS = {
  PROJECTS: 'campanhautm_projects_v2',
  LINKS: 'campanhautm_links_v2',
  ACTIVE_PROJECT: 'campanhautm_active_project_v2',
  AUTH_SESSION: 'utm_itaipu_auth_session',
}

const DEFAULT_EDITOR_KEY = import.meta.env.VITE_EDITOR_MASTER_KEY || 'parquetec2026'

// Fallback em memória para testes automatizados (Node / Vitest) e SSR
const memoryStorage: Record<string, string> = {}

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof localStorage === 'undefined') {
      const item = memoryStorage[key]
      return item ? (JSON.parse(item) as T) : defaultValue
    }
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : defaultValue
  } catch {
    return defaultValue
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    if (typeof localStorage === 'undefined') {
      memoryStorage[key] = JSON.stringify(value)
      return
    }
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`Erro ao salvar ${key} no localStorage:`, err)
  }
}

export function initStorage(userId?: string): void {
  // Inicialização limpa por usuário
  const userProjects = getProjects(userId)
  if (userProjects.length === 0 && userId) {
    // Cria projeto padrão para novos usuários
    saveProject('Campanha Inicial', 'Projeto padrão para suas primeiras UTMs', userId)
  }
}

export function clearDatabase(): void {
  if (typeof localStorage === 'undefined') {
    delete memoryStorage[STORAGE_KEYS.PROJECTS]
    delete memoryStorage[STORAGE_KEYS.LINKS]
    delete memoryStorage[STORAGE_KEYS.ACTIVE_PROJECT]
    return
  }
  localStorage.removeItem(STORAGE_KEYS.PROJECTS)
  localStorage.removeItem(STORAGE_KEYS.LINKS)
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROJECT)
}

// 1. Obter Projetos (Isolados por userId para Multi-Tenancy)
export function getProjects(userId?: string): Project[] {
  const allProjects = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, [])
  if (!userId) return allProjects
  return allProjects.filter((p) => p.userId === userId || !p.userId)
}

// 2. Salvar Projeto com Proteção contra Mass Assignment
export function saveProject(name: string, description?: string, userId?: string): Project {
  const allProjects = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, [])
  
  // Defesa contra Mass Assignment: campos estritamente definidos
  const cleanName = (name || '').trim().slice(0, 100)
  const cleanDesc = (description || '').trim().slice(0, 255)

  const newProject: Project = {
    id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: userId || undefined,
    name: cleanName,
    description: cleanDesc,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const updated = [newProject, ...allProjects]
  setToStorage(STORAGE_KEYS.PROJECTS, updated)
  setActiveProjectId(newProject.id, userId)
  return newProject
}

// 3. Excluir Projeto e seus links associados
export function deleteProject(projectId: string, userId?: string): void {
  const allProjects = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, [])
  const filteredProjects = allProjects.filter((p) => {
    if (p.id !== projectId) return true
    // Verificação de autorização: só o dono pode excluir
    if (userId && p.userId && p.userId !== userId) return true
    return false
  })
  setToStorage(STORAGE_KEYS.PROJECTS, filteredProjects)

  const allLinks = getFromStorage<UtmLink[]>(STORAGE_KEYS.LINKS, [])
  const filteredLinks = allLinks.filter((l) => l.projectId !== projectId)
  setToStorage(STORAGE_KEYS.LINKS, filteredLinks)

  if (getActiveProjectId(userId) === projectId) {
    const userRemaining = getProjects(userId)
    setActiveProjectId(userRemaining.length > 0 ? userRemaining[0].id : '', userId)
  }
}

// 4. Atualizar Projeto com Autorização e Proteção contra Mass Assignment
export function updateProject(
  projectId: string,
  updates: { name: string; description?: string },
  userId?: string
): Project | null {
  const allProjects = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, [])
  const index = allProjects.findIndex((p) => p.id === projectId)
  if (index === -1) return null

  // Autorização: garante que só o dono da conta pode editar
  if (userId && allProjects[index].userId && allProjects[index].userId !== userId) {
    console.warn('[Storage] Tentativa de alteração não autorizada em projeto de outro usuário.')
    return null
  }

  // Prevenção de Mass Assignment: atualiza estritamente os campos autorizados
  const current = allProjects[index]
  const updatedProject: Project = {
    ...current,
    name: (updates.name || current.name).trim().slice(0, 80),
    description: updates.description !== undefined ? updates.description.trim().slice(0, 250) : current.description,
    updatedAt: new Date().toISOString(),
  }

  allProjects[index] = updatedProject
  setToStorage(STORAGE_KEYS.PROJECTS, allProjects)
  return updatedProject
}

// 5. Projeto Ativo por Usuário
export function getActiveProjectId(userId?: string): string {
  const userKey = userId ? `${STORAGE_KEYS.ACTIVE_PROJECT}_${userId}` : STORAGE_KEYS.ACTIVE_PROJECT
  const activeId = getFromStorage<string>(userKey, '')
  if (activeId) return activeId

  const userProjects = getProjects(userId)
  return userProjects.length > 0 ? userProjects[0].id : ''
}

export function setActiveProjectId(id: string, userId?: string): void {
  const userKey = userId ? `${STORAGE_KEYS.ACTIVE_PROJECT}_${userId}` : STORAGE_KEYS.ACTIVE_PROJECT
  setToStorage(userKey, id)
}

// 5. Obter Links (Isolados por Projeto e userId)
export function getLinks(projectId?: string, userId?: string): UtmLink[] {
  let links = getFromStorage<UtmLink[]>(STORAGE_KEYS.LINKS, [])
  if (userId) {
    links = links.filter((l) => l.userId === userId || !l.userId)
  }
  if (projectId) {
    links = links.filter((link) => link.projectId === projectId)
  }
  return links
}

// 6. Salvar Link com Defesa de Mass Assignment
export function saveLink(
  linkData: Omit<UtmLink, 'id' | 'createdAt' | 'updatedAt'>,
  userId?: string
): UtmLink {
  const allLinks = getFromStorage<UtmLink[]>(STORAGE_KEYS.LINKS, [])

  // Defesa contra Mass Assignment: seleciona estritamente os campos autorizados
  const newLink: UtmLink = {
    id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: userId || undefined,
    projectId: linkData.projectId,
    urlDestino: linkData.urlDestino.slice(0, 500),
    urlFinal: linkData.urlFinal.slice(0, 1000),
    pais: linkData.pais.slice(0, 50),
    canal: linkData.canal.slice(0, 50),
    produto: linkData.produto.slice(0, 80),
    source: linkData.source.slice(0, 60),
    medium: linkData.medium.slice(0, 60),
    macroEstrategia: linkData.macroEstrategia.slice(0, 80),
    identifier: linkData.identifier.slice(0, 120),
    microEstrategia: linkData.microEstrategia ? linkData.microEstrategia.slice(0, 120) : undefined,
    descricao: linkData.descricao ? linkData.descricao.slice(0, 300) : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const updated = [newLink, ...allLinks]
  setToStorage(STORAGE_KEYS.LINKS, updated)
  return newLink
}

// 7. Atualizar Link com Autorização e Proteção
export function updateLink(
  id: string,
  updates: Partial<Omit<UtmLink, 'id' | 'createdAt'>>,
  userId?: string
): UtmLink | null {
  const allLinks = getFromStorage<UtmLink[]>(STORAGE_KEYS.LINKS, [])
  const index = allLinks.findIndex((l) => l.id === id)
  if (index === -1) return null

  // Autorização: verifica se o link pertence ao usuário
  if (userId && allLinks[index].userId && allLinks[index].userId !== userId) {
    console.warn('[Storage] Tentativa de edição não autorizada em link de outro usuário.')
    return null
  }

  // Prevenção de Mass Assignment: só mescla os campos permitidos
  const current = allLinks[index]
  const updatedLink: UtmLink = {
    ...current,
    urlDestino: updates.urlDestino !== undefined ? updates.urlDestino.slice(0, 500) : current.urlDestino,
    urlFinal: updates.urlFinal !== undefined ? updates.urlFinal.slice(0, 1000) : current.urlFinal,
    source: updates.source !== undefined ? updates.source.slice(0, 60) : current.source,
    medium: updates.medium !== undefined ? updates.medium.slice(0, 60) : current.medium,
    macroEstrategia: updates.macroEstrategia !== undefined ? updates.macroEstrategia.slice(0, 80) : current.macroEstrategia,
    identifier: updates.identifier !== undefined ? updates.identifier.slice(0, 120) : current.identifier,
    microEstrategia: updates.microEstrategia !== undefined ? updates.microEstrategia?.slice(0, 120) : current.microEstrategia,
    descricao: updates.descricao !== undefined ? updates.descricao?.slice(0, 300) : current.descricao,
    updatedAt: new Date().toISOString(),
  }

  allLinks[index] = updatedLink
  setToStorage(STORAGE_KEYS.LINKS, allLinks)
  return updatedLink
}

// 8. Excluir Link com Autorização
export function deleteLink(id: string, userId?: string): boolean {
  const allLinks = getFromStorage<UtmLink[]>(STORAGE_KEYS.LINKS, [])
  const linkToDelete = allLinks.find((l) => l.id === id)
  if (!linkToDelete) return false

  // Autorização
  if (userId && linkToDelete.userId && linkToDelete.userId !== userId) {
    console.warn('[Storage] Tentativa de exclusão não autorizada em link de outro usuário.')
    return false
  }

  const filtered = allLinks.filter((l) => l.id !== id)
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

export function exportFullBackup(userId?: string): string {
  const backup = {
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    projects: getProjects(userId),
    links: getLinks(undefined, userId),
  }
  return JSON.stringify(backup, null, 2)
}
