import { z } from 'zod'
import { isValidUrl } from '@/lib/utm-sanitizer'

// Schema Zod para criação e validação rigorosa de Links UTM (Padrão Oficial GA4)
export const utmFormSchema = z.object({
  urlDestino: z
    .string()
    .trim()
    .min(1, 'A URL de destino é obrigatória.')
    .max(2000, 'A URL deve ter no máximo 2000 caracteres.')
    .refine(
      (val) => {
        const lower = val.toLowerCase().trim()
        return !lower.startsWith('javascript:') && !lower.startsWith('data:') && !lower.startsWith('vbscript:')
      },
      {
        message: 'Protocolo inseguro detectado. Utilize apenas endereços padrão (http:// ou https://).',
      }
    )
    .refine((val) => isValidUrl(val), {
      message: 'Insira um endereço web válido (ex: https://minhaloja.com.br ou seudominio.com.br)',
    }),
  source: z
    .string()
    .trim()
    .min(1, 'A origem (utm_source) é obrigatória.')
    .max(80, 'A origem deve ter no máximo 80 caracteres.'),
  medium: z
    .string()
    .trim()
    .min(1, 'A mídia (utm_medium) é obrigatória.')
    .max(80, 'A mídia deve ter no máximo 80 caracteres.'),
  campaignName: z
    .string()
    .trim()
    .min(1, 'O nome da campanha (utm_campaign) é obrigatório.')
    .max(100, 'A campanha deve ter no máximo 100 caracteres.'),
  term: z
    .string()
    .trim()
    .max(100, 'O termo deve ter no máximo 100 caracteres.')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .trim()
    .max(100, 'O criativo/conteúdo deve ter no máximo 100 caracteres.')
    .optional()
    .or(z.literal('')),
  descricao: z
    .string()
    .trim()
    .max(300, 'As notas internas devem ter no máximo 300 caracteres.')
    .optional()
    .or(z.literal('')),
})

export type UtmFormData = z.infer<typeof utmFormSchema>
