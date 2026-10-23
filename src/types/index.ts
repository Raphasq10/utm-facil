export interface Project {
  id: string
  userId?: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface UtmLink {
  id: string
  userId?: string
  projectId: string
  urlDestino: string        // URL sem UTM
  pais: string              // País (ex: BR, PY, AR)
  canal: string             // Canal (Email, Blog, Evento, Social...)
  produto: string           // Produto específico da empresa
  source: string            // Source (Google, Instagram, LinkedIn, Pop-up...)
  medium: string            // Medium (Banner, Stories, Feed, CPC, Email Marketing...)
  macroEstrategia: string   // Macro Estratégias (Branding, Conversão, Captação...)
  identifier: string        // Identifier (Nome específico do material, vídeo ou criativo)
  microEstrategia?: string  // Micro Estratégia (Intenção da campanha, data: ex: leads de fevereiro)
  descricao?: string        // Anotações internas opcionais
  urlFinal: string          // URL montada com parâmetros UTM (GA4)
  createdAt: string
  updatedAt: string
}
