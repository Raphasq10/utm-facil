import { z } from 'zod'

// Schema Zod para validação rigorosa de Projetos (Clientes / Campanhas)
export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome do projeto deve ter pelo menos 2 caracteres')
    .max(80, 'O nome do projeto deve ter no máximo 80 caracteres'),
  description: z
    .string()
    .trim()
    .max(250, 'A descrição deve ter no máximo 250 caracteres')
    .optional()
    .or(z.literal('')),
})

export type ProjectFormData = z.infer<typeof projectSchema>
