import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link2, Copy, Check, Sparkles, ExternalLink, RefreshCw, BookmarkPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { buildUtmUrl, sanitizeUtmParam, isValidUrl } from '@/lib/utm-sanitizer'
import type { Project, UtmLink } from '@/types'

// Esquema de validação com Zod
const utmSchema = z.object({
  urlDestino: z
    .string()
    .min(1, 'A URL de destino é obrigatória.')
    .max(2000, 'A URL deve ter no máximo 2000 caracteres.')
    .refine((val) => isValidUrl(val), {
      message: 'Insira um endereço web válido (ex: itaipuparquetec.org.br ou https://...)',
    }),
  utmSource: z
    .string()
    .min(1, 'A Origem (utm_source) é obrigatória.')
    .max(100, 'Origem deve ter no máximo 100 caracteres.'),
  utmMedium: z
    .string()
    .min(1, 'A Mídia (utm_medium) é obrigatória.')
    .max(100, 'Mídia deve ter no máximo 100 caracteres.'),
  utmCampaign: z
    .string()
    .min(1, 'O Nome da Campanha (utm_campaign) é obrigatório.')
    .max(150, 'Campanha deve ter no máximo 150 caracteres.'),
  utmTerm: z.string().max(100, 'Termo deve ter no máximo 100 caracteres.').optional(),
  utmContent: z.string().max(150, 'Conteúdo deve ter no máximo 150 caracteres.').optional(),
  descricao: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres.').optional(),
})

type UtmFormData = z.infer<typeof utmSchema>

interface UtmBuilderProps {
  activeProject: Project | undefined
  onSaveLink: (link: Omit<UtmLink, 'id' | 'createdAt' | 'updatedAt'>) => void
  presetSourceMedium?: { source: string; medium: string } | null
}

export function UtmBuilder({ activeProject, onSaveLink, presetSourceMedium }: UtmBuilderProps) {
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UtmFormData>({
    resolver: zodResolver(utmSchema),
    defaultValues: {
      urlDestino: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmTerm: '',
      utmContent: '',
      descricao: '',
    },
    mode: 'onChange',
  })

  // Aplica preset quando o usuário clica em um atalho do guia
  useEffect(() => {
    if (presetSourceMedium) {
      setValue('utmSource', presetSourceMedium.source, { shouldValidate: true })
      setValue('utmMedium', presetSourceMedium.medium, { shouldValidate: true })
    }
  }, [presetSourceMedium, setValue])

  // Assiste aos valores em tempo real para calcular a URL final
  const watchedValues = watch()

  // Constrói a URL em tempo real com higienização
  const previewUrl = buildUtmUrl({
    urlDestino: watchedValues.urlDestino || '',
    utmSource: watchedValues.utmSource || '',
    utmMedium: watchedValues.utmMedium || '',
    utmCampaign: watchedValues.utmCampaign || '',
    utmTerm: watchedValues.utmTerm || '',
    utmContent: watchedValues.utmContent || '',
  })

  // Sanitização automática no evento blur do campo
  const handleSanitizeBlur = (field: 'utmSource' | 'utmMedium' | 'utmCampaign' | 'utmTerm' | 'utmContent') => {
    const current = watchedValues[field]
    if (current) {
      setValue(field, sanitizeUtmParam(current), { shouldValidate: true })
    }
  }

  const handleCopyPreview = () => {
    if (!previewUrl) return
    navigator.clipboard.writeText(previewUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const onSubmit = (data: UtmFormData) => {
    if (!activeProject) return

    const sanitizedData: Omit<UtmLink, 'id' | 'createdAt' | 'updatedAt'> = {
      projectId: activeProject.id,
      urlDestino: data.urlDestino.trim(),
      utmSource: sanitizeUtmParam(data.utmSource),
      utmMedium: sanitizeUtmParam(data.utmMedium),
      utmCampaign: sanitizeUtmParam(data.utmCampaign),
      utmTerm: data.utmTerm ? sanitizeUtmParam(data.utmTerm) : undefined,
      utmContent: data.utmContent ? sanitizeUtmParam(data.utmContent) : undefined,
      descricao: data.descricao ? data.descricao.trim() : undefined,
      urlFinal: previewUrl,
    }

    onSaveLink(sanitizedData)
    // Mantém a campanha e a URL de destino para facilitar criar múltiplos criativos para o mesmo post
    setValue('utmContent', '')
    setValue('descricao', '')
  }

  return (
    <Card className="shadow-xs border-slate-200/80 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <Link2 className="w-5 h-5 text-sky-600" />
              Construtor Inteligente de UTMs
            </CardTitle>
            <CardDescription>
              Preencha os campos abaixo. O sistema higieniza automaticamente maiúsculas, acentos e espaços.
            </CardDescription>
          </div>
          <button
            type="button"
            onClick={() => reset()}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
            title="Limpar formulário"
          >
            <RefreshCw className="w-3 h-3" /> Limpar
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* URL de Destino */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="urlDestino" required>
                URL da Página de Destino
              </Label>
              <span className="text-[11px] text-slate-400">ex: itaipuparquetec.org.br/hackathon</span>
            </div>
            <Input
              id="urlDestino"
              type="text"
              placeholder="https://itaipuparquetec.org.br/sua-landing-page"
              maxLength={2000}
              {...register('urlDestino')}
              className={errors.urlDestino ? 'border-rose-300 focus-visible:ring-rose-200' : ''}
            />
            {errors.urlDestino && (
              <p className="text-xs text-rose-600 font-medium">{errors.urlDestino.message}</p>
            )}
          </div>

          {/* Grid Parâmetros Principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* utm_source */}
            <div className="space-y-1.5">
              <Label htmlFor="utmSource" required>
                Origem (utm_source)
              </Label>
              <Input
                id="utmSource"
                type="text"
                placeholder="instagram, linkedin, google..."
                maxLength={100}
                {...register('utmSource')}
                onBlur={() => handleSanitizeBlur('utmSource')}
                className={errors.utmSource ? 'border-rose-300' : ''}
              />
              {errors.utmSource && (
                <p className="text-xs text-rose-600 font-medium">{errors.utmSource.message}</p>
              )}
            </div>

            {/* utm_medium */}
            <div className="space-y-1.5">
              <Label htmlFor="utmMedium" required>
                Mídia (utm_medium)
              </Label>
              <Input
                id="utmMedium"
                type="text"
                placeholder="stories, feed, cpc, newsletter..."
                maxLength={100}
                {...register('utmMedium')}
                onBlur={() => handleSanitizeBlur('utmMedium')}
                className={errors.utmMedium ? 'border-rose-300' : ''}
              />
              {errors.utmMedium && (
                <p className="text-xs text-rose-600 font-medium">{errors.utmMedium.message}</p>
              )}
            </div>

            {/* utm_campaign */}
            <div className="space-y-1.5">
              <Label htmlFor="utmCampaign" required>
                Campanha (utm_campaign)
              </Label>
              <Input
                id="utmCampaign"
                type="text"
                placeholder="edital-2026, vestibular..."
                maxLength={150}
                {...register('utmCampaign')}
                onBlur={() => handleSanitizeBlur('utmCampaign')}
                className={errors.utmCampaign ? 'border-rose-300' : ''}
              />
              {errors.utmCampaign && (
                <p className="text-xs text-rose-600 font-medium">{errors.utmCampaign.message}</p>
              )}
            </div>
          </div>

          {/* Grid Parâmetros Secundários */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* utm_content */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="utmContent">Conteúdo / Criativo (utm_content)</Label>
                <span className="text-[10px] text-slate-400 font-normal">Opcional</span>
              </div>
              <Input
                id="utmContent"
                type="text"
                placeholder="ex: banner-azul, video-depoimento, botao-cta"
                maxLength={150}
                {...register('utmContent')}
                onBlur={() => handleSanitizeBlur('utmContent')}
              />
            </div>

            {/* utm_term */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="utmTerm">Palavra-chave / Termo (utm_term)</Label>
                <span className="text-[10px] text-slate-400 font-normal">Opcional (Google Ads)</span>
              </div>
              <Input
                id="utmTerm"
                type="text"
                placeholder="ex: startups-deeptech, energia-solar"
                maxLength={100}
                {...register('utmTerm')}
                onBlur={() => handleSanitizeBlur('utmTerm')}
              />
            </div>
          </div>

          {/* Descrição / Anotação Interna */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="descricao">Descrição Interna / Anotação</Label>
              <span className="text-[10px] text-slate-400 font-normal">
                Ajuda os redatores a saberem onde usar este link
              </span>
            </div>
            <Input
              id="descricao"
              type="text"
              placeholder="ex: Link exclusivo para a bio do Instagram durante a semana de inscrições"
              maxLength={500}
              {...register('descricao')}
            />
          </div>

          {/* Card de Preview da URL Gerada em Tempo Real */}
          <div className="mt-4 rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50/70 to-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                URL Final Gerada (Visualização em Tempo Real):
              </span>
              {previewUrl && (
                <div className="flex items-center gap-2">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-700 hover:text-sky-900 font-medium inline-flex items-center gap-1 hover:underline"
                    title="Testar link em nova aba"
                  >
                    Testar <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-sky-100 p-3 font-mono text-xs text-slate-800 break-all select-all min-h-[44px] flex items-center">
              {previewUrl || (
                <span className="text-slate-400 font-sans italic text-xs">
                  Preencha a URL e os canais acima para visualizar o link completo...
                </span>
              )}
            </div>

            {/* Ações do Preview */}
            <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyPreview}
                disabled={!previewUrl}
                className="text-xs font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar Link Pronto
                  </>
                )}
              </Button>

              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={!previewUrl || isSubmitting}
                className="bg-sky-600 hover:bg-sky-500 font-semibold text-xs"
              >
                <BookmarkPlus className="w-4 h-4" />
                Salvar no Banco do Projeto
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
