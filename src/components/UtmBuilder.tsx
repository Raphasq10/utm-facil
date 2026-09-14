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

// Listas padrão do mercado de publicidade e marketing
export const STANDARD_CANAIS = [
  'Social',
  'Email',
  'Blog',
  'Evento',
  'Mídia Paga',
  'Institucional',
  'Outro (digitar)',
]

export const STANDARD_SOURCES = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Google', value: 'google' },
  { label: 'Meta (Facebook / Instagram Ads)', value: 'meta-ads' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'E-mail / RD Station', value: 'email-marketing' },
  { label: 'Pop-up no Site', value: 'popup-site' },
  { label: 'QR Code Impresso', value: 'qrcode' },
  { label: 'Portal de Notícias / Imprensa', value: 'portal-noticias' },
  { label: 'Outro (digitar)', value: 'custom' },
]

export const STANDARD_MEDIUMS = [
  { label: 'Stories (Instagram)', value: 'stories' },
  { label: 'Feed (Post / Imagem / Carrossel)', value: 'feed' },
  { label: 'Reels / Shorts (Vídeo curto)', value: 'reels' },
  { label: 'CPC / Link Patrocinado (Pago)', value: 'cpc' },
  { label: 'Banner / Display', value: 'banner' },
  { label: 'Newsletter / Boletim', value: 'newsletter' },
  { label: 'Post Orgânico', value: 'post-organico' },
  { label: 'Link na Bio', value: 'link-bio' },
  { label: 'Vídeo Dedicado', value: 'video' },
  { label: 'Cartaz / Totem Impresso', value: 'cartaz-impresso' },
  { label: 'Disparo Direto', value: 'disparo-direto' },
  { label: 'Outro (digitar)', value: 'custom' },
]

export const STANDARD_PAISES = [
  { label: 'BR (Brasil)', value: 'BR' },
  { label: 'PY (Paraguai)', value: 'PY' },
  { label: 'AR (Argentina)', value: 'AR' },
  { label: 'GLOBAL (Internacional)', value: 'GLOBAL' },
  { label: 'Outro', value: 'custom' },
]

const utmSchema = z.object({
  urlDestino: z
    .string()
    .min(1, 'A URL sem UTM é obrigatória.')
    .max(2000, 'A URL deve ter no máximo 2000 caracteres.')
    .refine((val) => isValidUrl(val), {
      message: 'Insira um endereço web válido (ex: itaipuparquetec.org.br ou https://...)',
    }),
  pais: z.string().max(10).optional(),
  canal: z.string().max(50).optional(),
  produto: z.string().max(100).optional(),
  source: z.string().min(1, 'Source é obrigatório.').max(100),
  medium: z.string().min(1, 'Medium é obrigatório.').max(100),
  macroEstrategia: z.string().max(100).optional(),
  identifier: z.string().max(150).optional(),
  microEstrategia: z.string().max(100).optional(),
  descricao: z.string().max(500).optional(),
})

type UtmFormData = z.infer<typeof utmSchema>

interface UtmBuilderProps {
  activeProject: Project | undefined
  onSaveLink: (link: Omit<UtmLink, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function UtmBuilder({ activeProject, onSaveLink }: UtmBuilderProps) {
  const [copied, setCopied] = useState(false)

  // Estados dos seletores suspensos
  const [selectedPais, setSelectedPais] = useState('BR')
  const [customPais, setCustomPais] = useState('')

  const [selectedCanal, setSelectedCanal] = useState('Social')
  const [customCanal, setCustomCanal] = useState('')

  const [selectedSource, setSelectedSource] = useState('instagram')
  const [customSource, setCustomSource] = useState('')

  const [selectedMedium, setSelectedMedium] = useState('stories')
  const [customMedium, setCustomMedium] = useState('')

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
      source: 'instagram',
      medium: 'stories',
      macroEstrategia: '',
      identifier: '',
      microEstrategia: '',
      descricao: '',
    },
    mode: 'onChange',
  })

  // Sincroniza selects com react-hook-form
  useEffect(() => {
    const finalPais = selectedPais === 'custom' ? customPais : selectedPais
    setValue('pais', finalPais, { shouldValidate: true })
  }, [selectedPais, customPais, setValue])

  useEffect(() => {
    const finalCanal = selectedCanal === 'Outro (digitar)' ? customCanal : selectedCanal
    setValue('canal', finalCanal, { shouldValidate: true })
  }, [selectedCanal, customCanal, setValue])

  useEffect(() => {
    const finalSource = selectedSource === 'custom' ? customSource : selectedSource
    setValue('source', finalSource, { shouldValidate: true })
  }, [selectedSource, customSource, setValue])

  useEffect(() => {
    const finalMedium = selectedMedium === 'custom' ? customMedium : selectedMedium
    setValue('medium', finalMedium, { shouldValidate: true })
  }, [selectedMedium, customMedium, setValue])

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
              Construtor de Links UTM (Padrões de Publicidade)
            </CardTitle>
            <CardDescription>
              Seleção rápida por listas suspensas padronizadas (evita erros de digitação e inconsistências no GA4).
            </CardDescription>
          </div>
          <button
            type="button"
            onClick={() => {
              reset()
              setSelectedPais('BR')
              setSelectedCanal('Social')
              setSelectedSource('instagram')
              setSelectedMedium('stories')
            }}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
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
            {/* 2. PAÍS (LISTA SUSPENSA) */}
            <div className="space-y-1.5">
              <Label htmlFor="selectPais" className="flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-sky-600" /> 2. País
              </Label>
              <select
                id="selectPais"
                value={selectedPais}
                onChange={(e) => setSelectedPais(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/20"
              >
                {STANDARD_PAISES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              {selectedPais === 'custom' && (
                <Input
                  type="text"
                  placeholder="Digite a sigla do país..."
                  value={customPais}
                  onChange={(e) => setCustomPais(e.target.value)}
                  maxLength={10}
                  className="mt-1 text-xs"
                />
              )}
            </div>

            {/* 3. CANAL (LISTA SUSPENSA) */}
            <div className="space-y-1.5">
              <Label htmlFor="selectCanal" className="flex items-center gap-1">
                <Share2 className="w-3 h-3 text-sky-600" /> 3. Canal (Fonte Geral)
              </Label>
              <select
                id="selectCanal"
                value={selectedCanal}
                onChange={(e) => setSelectedCanal(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/20"
              >
                {STANDARD_CANAIS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {selectedCanal === 'Outro (digitar)' && (
                <Input
                  type="text"
                  placeholder="Digite o canal..."
                  value={customCanal}
                  onChange={(e) => setCustomCanal(e.target.value)}
                  maxLength={50}
                  className="mt-1 text-xs"
                />
              )}
            </div>

            {/* 4. PRODUTO */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="produto" className="flex items-center gap-1">
                  <Package className="w-3 h-3 text-sky-600" /> 4. Produto
                </Label>
                <span className="text-[10px] text-slate-400">Oferta da empresa</span>
              </div>
              <Input
                id="produto"
                type="text"
                placeholder="Edital, Hub, Vestibular..."
                maxLength={100}
                {...register('produto')}
              />
              <p className="text-[10px] text-slate-400">Produto ou serviço divulgado no link.</p>
            </div>
          </div>

          {/* GRID: SOURCE & MEDIUM (LISTAS SUSPENSAS CONSAGRADAS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-sky-50/40 p-3.5 rounded-xl border border-sky-100">
            {/* 5. SOURCE (LISTA SUSPENSA) */}
            <div className="space-y-1.5">
              <Label htmlFor="selectSource" required className="flex items-center gap-1 text-sky-950 font-bold">
                5. Source (Onde a campanha será exibida)
              </Label>
              <select
                id="selectSource"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/20"
              >
                {STANDARD_SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {selectedSource === 'custom' && (
                <Input
                  type="text"
                  placeholder="Digite a fonte/rede..."
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  maxLength={100}
                  className="mt-1 text-xs"
                />
              )}
              <p className="text-[10px] text-slate-500">Ex: Google, Instagram, LinkedIn, Pop-up...</p>
            </div>

            {/* 6. MEDIUM (LISTA SUSPENSA) */}
            <div className="space-y-1.5">
              <Label htmlFor="selectMedium" required className="flex items-center gap-1 text-sky-950 font-bold">
                6. Medium (Formato da mídia)
              </Label>
              <select
                id="selectMedium"
                value={selectedMedium}
                onChange={(e) => setSelectedMedium(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/20"
              >
                {STANDARD_MEDIUMS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              {selectedMedium === 'custom' && (
                <Input
                  type="text"
                  placeholder="Digite o tipo de mídia..."
                  value={customMedium}
                  onChange={(e) => setCustomMedium(e.target.value)}
                  maxLength={100}
                  className="mt-1 text-xs"
                />
              )}
              <p className="text-[10px] text-slate-500">Ex: Stories, Feed, CPC, Banner, Newsletter...</p>
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
                placeholder="branding, conversao, captacao..."
                maxLength={100}
                {...register('macroEstrategia')}
              />
              <p className="text-[10px] text-slate-400">Estratégia macro trabalhada.</p>
            </div>

            {/* 8. IDENTIFIER */}
            <div className="space-y-1.5">
              <Label htmlFor="identifier" className="flex items-center gap-1">
                <FileCode className="w-3 h-3 text-sky-600" /> 8. Identifier (Material/Vídeo)
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="video-01, banner-azul..."
                maxLength={150}
                {...register('identifier')}
              />
              <p className="text-[10px] text-slate-400">Nome específico do criativo ou conteúdo.</p>
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
              />
              <p className="text-[10px] text-slate-400">Intenção específica ou data da campanha.</p>
            </div>
          </div>

          {/* Anotação / Descrição Opcional */}
          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição Interna / Observações</Label>
            <Input
              id="descricao"
              type="text"
              placeholder="Instruções para os redatores ou local onde o link deve ser inserido..."
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
                  Preencha a URL sem UTM para visualizar a URL completa...
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
