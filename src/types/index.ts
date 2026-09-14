export interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface UtmLink {
  id: string
  projectId: string
  urlDestino: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm?: string
  utmContent?: string
  descricao?: string
  urlFinal: string
  createdAt: string
  updatedAt: string
}
