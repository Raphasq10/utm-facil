import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Link2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  RefreshCw,
  BookmarkPlus,
  Globe2,
  Share2,
  Package,
  Layers,
  FileCode,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { buildUtmUrl, sanitizeUtmParam, isValidUrl } from '@/lib/utm-sanitizer'
import type { Project, UtmLink } from '@/types'

// Esquema Zod baseado nos 9 campos do anexo
const utmSchema = z.object({
  urlDestino: z
    .string()
    .min(1, 'A URL sem UTM é obrigatória.')
    .max(2000, 'A URL deve ter no máximo 2000 caracteres.')
    .refine((val) => isValidUrl(val), {
      message: 'Insira um endereço web válido (ex: itaipuparquetec.org.br ou https://...)',
    }),
  pais: z.string().max(10, 'País deve ter no máximo 10 caracteres.').optional(),
  canal: z.string().max(50, 'Canal deve ter no máximo 50 caracteres.').optional(),
  produto: z.string().max(100, 'Produto deve ter no máximo 100 caracteres.').optional(),
  source: z.string().min(1, 'Source é obrigatório.').max(100, 'Source máx 100 caracteres.'),
  medium: z.string().min(1, 'Medium é obrigatório.').max(100, 'Medium máx 100 caracteres.'),
  macroEstrategia: z.string().max(100, 'Macro Estratégia máx 100 caracteres.').optional(),
  identifier: z.string().max(150, 'Identifier máx 150 caracteres.').optional(),
  microEstrategia: z.string().max(100, 'Micro Estratégia máx 100 caracteres.').optional(),
  descricao: z.string().max(500, 'Descrição máx 500 caracteres.').optional(),
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
      pais: 'BR',
      canal: 'Social',
      produto: '',
      source: '',
      medium: '',
      macroEstrategia: '',
      identifier: '',
      microEstrategia: '',
      descricao: '',
    },
    mode: 'onChange',
  })

  // Aplica preset quando clicado no guia
  useEffect(() => {
    if (presetSourceMedium) {
      setValue('source', presetSourceMedium.source, { shouldValidate: true })
      setValue('medium', presetSourceMedium.medium, { shouldValidate: true })
    }
  }, [presetSourceMedium, setValue])

  const watched = watch()

  // Constrói a URL em tempo real
  const previewUrl = buildUtmUrl({
    urlDestino: watched.urlDestino || '',
    pais: watched.pais || '',
    canal: watched.canal || '',
    produto: watched.produto || '',
    source: watched.source || '',
    medium: watched.medium || '',
    macroEstrategia: watched.macroEstrategia || '',
    identifier: watched.identifier || '',
    microEstrategia: watched.microEstrategia || '',
  })

  // Sanitização automática no evento blur
  const handleSanitizeBlur = (
    field:
      | 'pais'
      | 'canal'
      | 'produto'
      | 'source'
      | 'medium'
      | 'macroEstrategia'
      | 'identifier'
      | 'microEstrategia'
  ) => {
    const current = watched[field]
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

    onSaveLink({
      projectId: activeProject.id,
      urlDestino: data.urlDestino.trim(),
      pais: sanitizeUtmParam(data.pais || 'BR'),
      canal: sanitizeUtmParam(data.canal || 'Social'),
      produto: sanitizeUtmParam(data.produto || activeProject.name),
      source: sanitizeUtmParam(data.source),
      medium: sanitizeUtmParam(data.medium),
      macroEstrategia: sanitizeUtmParam(data.macroEstrategia || ''),
      identifier: sanitizeUtmParam(data.identifier || ''),
      microEstrategia: sanitizeUtmParam(data.microEstrategia || ''),
      descricao: data.descricao ? data.descricao.trim() : undefined,
      urlFinal: previewUrl,
    })

    // Limpa apenas o criativo para agilizar geração de variações
    setValue('identifier', '')
    setValue('descricao', '')
  }

  return (
    <Card className="shadow-xs border-slate-200/80 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <Link2 className="w-5 h-5 text-sky-600" />
              Construtor de Links UTM (Parâmetros Oficiais)
            </CardTitle>
            <CardDescription>
              Campos estruturados conforme a metodologia oficial: País, Canal, Produto, Source, Medium, Macro/Micro Estratégia e Identifier.
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
          {/* 1. URL SEM UTM */}
          <div className="space-y-1.5 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <Label htmlFor="urlDestino" required className="text-xs font-bold text-slate-800">
                1. URL sem UTM (Página de Destino)
              </Label>
              <span className="text-[11px] text-slate-500">Link onde o usuário vai aterrissar</span>
            </div>
            <Input
              id="urlDestino"
              type="text"
              placeholder="https://itaipuparquetec.org.br/sua-campanha"
              maxLength={2000}
              {...register('urlDestino')}
              className={errors.urlDestino ? 'border-rose-300 focus-visible:ring-rose-200' : 'bg-white'}
            />
            {errors.urlDestino && (
              <p className="text-xs text-rose-600 font-medium">{errors.urlDestino.message}</p>
            )}
          </div>

          {/* GRID: PAÍS, CANAL, PRODUTO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 2. PAÍS */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pais" className="flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-sky-600" /> 2. País
                </Label>
                <span className="text-[10px] text-slate-400">Iniciais (BR, PY, AR)</span>
              </div>
              <Input
                id="pais"
                type="text"
                placeholder="BR"
                maxLength={10}
                {...register('pais')}
                onBlur={() => handleSanitizeBlur('pais')}
              />
              <p className="text-[10px] text-slate-400">Iniciais do país da campanha (ideal para ações binacionais).</p>
            </div>

            {/* 3. CANAL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="canal" className="flex items-center gap-1">
                  <Share2 className="w-3 h-3 text-sky-600" /> 3. Canal
                </Label>
                <span className="text-[10px] text-slate-400">Fonte principal</span>
              </div>
              <Input
                id="canal"
                type="text"
                placeholder="Social, Email, Blog, Evento"
                maxLength={50}
                {...register('canal')}
                onBlur={() => handleSanitizeBlur('canal')}
              />
              <p className="text-[10px] text-slate-400">Fonte principal (ex: Social, Email, Evento, Blog).</p>
            </div>

            {/* 4. PRODUTO */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="produto" className="flex items-center gap-1">
                  <Package className="w-3 h-3 text-sky-600" /> 4. Produto
                </Label>
                <span className="text-[10px] text-slate-400">Iniciativa / Oferta</span>
              </div>
              <Input
                id="produto"
                type="text"
                placeholder="Edital, Hub, Vestibular..."
                maxLength={100}
                {...register('produto')}
                onBlur={() => handleSanitizeBlur('produto')}
              />
              <p className="text-[10px] text-slate-400">Produto ou serviço divulgado.</p>
            </div>
          </div>

          {/* GRID: SOURCE & MEDIUM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* 5. SOURCE */}
            <div className="space-y-1.5">
              <Label htmlFor="source" required className="flex items-center gap-1">
                5. Source (Onde a campanha será exibida)
              </Label>
              <Input
                id="source"
                type="text"
                placeholder="google, instagram, linkedin, popup-site..."
                maxLength={100}
                {...register('source')}
                onBlur={() => handleSanitizeBlur('source')}
                className={errors.source ? 'border-rose-300' : ''}
              />
              {errors.source && (
                <p className="text-xs text-rose-600 font-medium">{errors.source.message}</p>
              )}
              <p className="text-[10px] text-slate-400">Local exato de exibição (Google, rede social específica, etc.).</p>
            </div>

            {/* 6. MEDIUM */}
            <div className="space-y-1.5">
              <Label htmlFor="medium" required className="flex items-center gap-1">
                6. Medium (Tipo de mídia / formato)
              </Label>
              <Input
                id="medium"
                type="text"
                placeholder="banner, email-marketing, cpc, stories, feed..."
                maxLength={100}
                {...register('medium')}
                onBlur={() => handleSanitizeBlur('medium')}
                className={errors.medium ? 'border-rose-300' : ''}
              />
              {errors.medium && (
                <p className="text-xs text-rose-600 font-medium">{errors.medium.message}</p>
              )}
              <p className="text-[10px] text-slate-400">Formato da mídia (Banner, CPC, Stories, Feed, etc.).</p>
            </div>
          </div>

          {/* GRID: MACRO ESTRATÉGIAS, IDENTIFIER, MICRO ESTRATÉGIA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 7. MACRO ESTRATÉGIAS */}
            <div className="space-y-1.5">
              <Label htmlFor="macroEstrategia" className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-sky-600" /> 7. Macro Estratégias
              </Label>
              <Input
                id="macroEstrategia"
                type="text"
                placeholder="branding, conversao, aceleracao..."
                maxLength={100}
                {...register('macroEstrategia')}
                onBlur={() => handleSanitizeBlur('macroEstrategia')}
              />
              <p className="text-[10px] text-slate-400">Qual estratégia macro está sendo trabalhada.</p>
            </div>

            {/* 8. IDENTIFIER */}
            <div className="space-y-1.5">
              <Label htmlFor="identifier" className="flex items-center gap-1">
                <FileCode className="w-3 h-3 text-sky-600" /> 8. Identifier (utm_content)
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="video-01, banner-azul, cta-topo..."
                maxLength={150}
                {...register('identifier')}
                onBlur={() => handleSanitizeBlur('identifier')}
              />
              <p className="text-[10px] text-slate-400">Nome específico do material, criativo ou vídeo.</p>
            </div>

            {/* 9. MICRO ESTRATÉGIA */}
            <div className="space-y-1.5">
              <Label htmlFor="microEstrategia" className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-sky-600" /> 9. Micro Estratégia
              </Label>
              <Input
                id="microEstrategia"
                type="text"
                placeholder="leads-fevereiro, acessos-11-02..."
                maxLength={100}
                {...register('microEstrategia')}
                onBlur={() => handleSanitizeBlur('microEstrategia')}
              />
              <p className="text-[10px] text-slate-400">Intenção específica ou data da campanha.</p>
            </div>
          </div>

          {/* Anotação / Descrição Opcional */}
          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição Interna / Observação</Label>
            <Input
              id="descricao"
              type="text"
              placeholder="Anotações para a equipe de redatores e designers..."
              maxLength={500}
              {...register('descricao')}
            />
          </div>

          {/* PREVIEW DA URL EM TEMPO REAL */}
          <div className="mt-4 rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50/70 to-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                URL Final Montada (Preview em Tempo Real):
              </span>
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sky-700 hover:text-sky-900 font-medium inline-flex items-center gap-1 hover:underline"
                >
                  Testar link <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="bg-white rounded-lg border border-sky-100 p-3 font-mono text-xs text-slate-800 break-all select-all min-h-[44px] flex items-center">
              {previewUrl || (
                <span className="text-slate-400 font-sans italic text-xs">
                  Preencha a URL sem UTM e os campos de origem para visualizar a URL pronta...
                </span>
              )}
            </div>

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
                    <Copy className="w-3.5 h-3.5" /> Copiar Link
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
