import type { Project, UtmLink } from '@/types'

const STORAGE_KEYS = {
  PROJECTS: 'utm_itaipu_projects_clean',
  LINKS: 'utm_itaipu_links_clean',
  ACTIVE_PROJECT: 'utm_itaipu_active_project_clean',
  AUTH_SESSION: 'utm_itaipu_auth_session',
}

const DEFAULT_EDITOR_KEY = import.meta.env.VITE_EDITOR_MASTER_KEY || 'parquetec2026'

// Base limpa — sem dados fictícios
const INITIAL_PROJECTS: Project[] = []
const INITIAL_LINKS: UtmLink[] = []

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
    setToStorage(STORAGE_KEYS.ACTIVE_PROJECT, '')
  }
}

export function clearDatabase(): void {
  localStorage.removeItem(STORAGE_KEYS.PROJECTS)
  localStorage.removeItem(STORAGE_KEYS.LINKS)
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROJECT)
  setToStorage(STORAGE_KEYS.PROJECTS, [])
  setToStorage(STORAGE_KEYS.LINKS, [])
  setToStorage(STORAGE_KEYS.ACTIVE_PROJECT, '')
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
  return getFromStorage<string>(STORAGE_KEYS.ACTIVE_PROJECT, '')
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
    version: '3.0.0',
    exportDate: new Date().toISOString(),
    projects: getProjects(),
    links: getLinks(),
  }
  return JSON.stringify(backup, null, 2)
}
