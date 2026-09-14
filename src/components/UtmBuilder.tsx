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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { buildUtmUrl, sanitizeUtmParam, isValidUrl } from '@/lib/utm-sanitizer'
import type { Project, UtmLink } from '@/types'

// Lista de Origens (Source) — De onde o visitante vem
export const SOURCE_GROUPS = [
  {
    group: 'Redes Sociais',
    options: [
      { label: 'Instagram', value: 'instagram' },
      { label: 'LinkedIn', value: 'linkedin' },
      { label: 'Facebook', value: 'facebook' },
      { label: 'YouTube', value: 'youtube' },
      { label: 'TikTok', value: 'tiktok' },
      { label: 'X (antigo Twitter)', value: 'twitter' },
    ],
  },
  {
    group: 'Mecanismos de Busca & Anúncios',
    options: [
      { label: 'Google', value: 'google' },
      { label: 'Meta Ads (Gerenciador de Anúncios)', value: 'meta-ads' },
      { label: 'Bing', value: 'bing' },
    ],
  },
  {
    group: 'Mensageria & E-mail',
    options: [
      { label: 'WhatsApp', value: 'whatsapp' },
      { label: 'E-mail / RD Station', value: 'email-marketing' },
      { label: 'Telegram', value: 'telegram' },
    ],
  },
  {
    group: 'Outros Canais',
    options: [
      { label: 'Pop-up no Site Institucional', value: 'popup-site' },
      { label: 'QR Code Impresso', value: 'qrcode' },
      { label: 'Portal de Notícias / Assessoria de Imprensa', value: 'imprensa' },
      { label: 'Outro (digitar manualmente)', value: 'custom' },
    ],
  },
]

// Lista de Mídias (Medium) — Desagrupada, granular e dividida por tipo de mídia
export const MEDIUM_GROUPS = [
  {
    group: 'Mídias Patrocinadas (Tráfego Pago)',
    options: [
      { label: 'Post Patrocinado', value: 'post-patrocinado' },
      { label: 'Vídeo Patrocinado', value: 'video-patrocinado' },
      { label: 'Stories Patrocinado', value: 'stories-patrocinado' },
      { label: 'Reels Patrocinado', value: 'reels-patrocinado' },
      { label: 'Banner Patrocinado', value: 'banner-patrocinado' },
      { label: 'Display Patrocinado', value: 'display-patrocinado' },
      { label: 'Anúncio de Pesquisa (CPC / Google Search)', value: 'cpc' },
    ],
  },
  {
    group: 'Redes Sociais (Orgânico)',
    options: [
      { label: 'Stories (Instagram)', value: 'stories' },
      { label: 'Feed (Post / Carrossel)', value: 'feed' },
      { label: 'Reels (Instagram)', value: 'reels' },
      { label: 'Shorts (YouTube)', value: 'shorts' },
      { label: 'Link na Bio', value: 'link-bio' },
      { label: 'Post Orgânico (LinkedIn / Facebook)', value: 'post-organico' },
      { label: 'Vídeo Orgânico', value: 'video' },
    ],
  },
  {
    group: 'E-mail & Mensagens',
    options: [
      { label: 'E-mail Marketing', value: 'email' },
      { label: 'Newsletter', value: 'newsletter' },
      { label: 'Mensagem Direta (WhatsApp / Direct)', value: 'mensagem-direta' },
    ],
  },
  {
    group: 'Materiais Físicos & Outros',
    options: [
      { label: 'Cartaz / Banner Físico (QR Code)', value: 'cartaz-impresso' },
      { label: 'Crachá / Folder de Evento', value: 'evento-impresso' },
      { label: 'Outro (digitar manualmente)', value: 'custom' },
    ],
  },
]

// Esquema 100% no padrão do Google URL Builder
const utmSchema = z.object({
  urlDestino: z
    .string()
    .min(1, 'A URL de destino é obrigatória.')
    .max(2000, 'A URL deve ter no máximo 2000 caracteres.')
    .refine((val) => isValidUrl(val), {
      message: 'Insira um endereço web válido (ex: itaipuparquetec.org.br ou https://...)',
    }),
  source: z.string().min(1, 'Origem (source) é obrigatória.').max(100),
  medium: z.string().min(1, 'Mídia (medium) é obrigatória.').max(100),
  campaignName: z.string().min(1, 'Nome da campanha é obrigatório.').max(150),
  content: z.string().max(150).optional(),
  term: z.string().max(100).optional(),
  descricao: z.string().max(500).optional(),
})

type UtmFormData = z.infer<typeof utmSchema>

interface UtmBuilderProps {
  activeProject: Project | undefined
  onSaveLink: (link: Omit<UtmLink, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function UtmBuilder({ activeProject, onSaveLink }: UtmBuilderProps) {
  const [copied, setCopied] = useState(false)

  // Seletores para Source e Medium
  const [selectedSource, setSelectedSource] = useState('instagram')
  const [customSource, setCustomSource] = useState('')

  const [selectedMedium, setSelectedMedium] = useState('post-patrocinado')
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
      source: 'instagram',
      medium: 'post-patrocinado',
      campaignName: '',
      content: '',
      term: '',
      descricao: '',
    },
    mode: 'onChange',
  })

  // Sincroniza selects com react-hook-form
  useEffect(() => {
    const finalSource = selectedSource === 'custom' ? customSource : selectedSource
    setValue('source', finalSource, { shouldValidate: true })
  }, [selectedSource, customSource, setValue])

  useEffect(() => {
    const finalMedium = selectedMedium === 'custom' ? customMedium : selectedMedium
    setValue('medium', finalMedium, { shouldValidate: true })
  }, [selectedMedium, customMedium, setValue])

  const watched = watch()

  // Constrói a URL no padrão do Google Analytics
  const previewUrl = buildUtmUrl({
    urlDestino: watched.urlDestino || '',
    source: watched.source || '',
    medium: watched.medium || '',
    macroEstrategia: watched.campaignName || '', // mapeia para campaign name
    identifier: watched.content || '',          // mapeia para content
    canal: watched.term || '',                  // mapeia para term
  })

  const handleSanitizeBlur = (field: 'campaignName' | 'content' | 'term') => {
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
      source: sanitizeUtmParam(data.source),
      medium: sanitizeUtmParam(data.medium),
      macroEstrategia: sanitizeUtmParam(data.campaignName),
      identifier: data.content ? sanitizeUtmParam(data.content) : '',
      canal: data.term ? sanitizeUtmParam(data.term) : 'web',
      pais: 'BR',
      produto: activeProject.name,
      descricao: data.descricao ? data.descricao.trim() : undefined,
      urlFinal: previewUrl,
    })

    // Limpa apenas o criativo para criar o próximo anúncio rapidamente
    setValue('content', '')
    setValue('descricao', '')
  }

  return (
    <Card className="shadow-xs border-slate-200/80 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
              <Link2 className="w-5 h-5 text-sky-600" />
              Construtor de UTMs (Padrão Oficial Google Analytics)
            </CardTitle>
            <CardDescription>
              Campos oficiais do Google com seleção rápida por tipo de mídia (sem misturar formatos).
            </CardDescription>
          </div>
          <button
            type="button"
            onClick={() => {
              reset()
              setSelectedSource('instagram')
              setSelectedMedium('post-patrocinado')
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
          {/* 1. WEBSITE URL (URL DE DESTINO) */}
          <div className="space-y-1.5 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <Label htmlFor="urlDestino" required className="text-xs font-bold text-slate-800">
                Website URL (Página de Destino) *
              </Label>
              <span className="text-[11px] text-slate-500">Ex: https://itaipuparquetec.org.br/inscricoes</span>
            </div>
            <Input
              id="urlDestino"
              type="text"
              placeholder="https://itaipuparquetec.org.br/sua-pagina"
              maxLength={2000}
              {...register('urlDestino')}
              className={errors.urlDestino ? 'border-rose-300 focus-visible:ring-rose-200' : 'bg-white'}
            />
            {errors.urlDestino && (
              <p className="text-xs text-rose-600 font-medium">{errors.urlDestino.message}</p>
            )}
          </div>

          {/* GRID: SOURCE & MEDIUM (AS DUAS DÚVIDAS PRINCIPAIS COM EXPLICAÇÕES CLARAS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-sky-50/40 p-4 rounded-xl border border-sky-100">
            {/* CAMPAIGN SOURCE */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="selectSource" required className="font-bold text-sky-950 text-xs">
                  Campaign Source (Origem) *
                </Label>
                <span className="text-[11px] text-sky-700 font-medium bg-sky-100/80 px-2 py-0.5 rounded">
                  "De onde o visitante veio?"
                </span>
              </div>
              <select
                id="selectSource"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/20"
              >
                {SOURCE_GROUPS.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {selectedSource === 'custom' && (
                <Input
                  type="text"
                  placeholder="Digite a origem (ex: threads, parceiro-x)..."
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                  maxLength={100}
                  className="mt-1.5 text-xs"
                />
              )}
              <p className="text-[10px] text-slate-500">
                A plataforma onde o link está divulgado (Instagram, Google, LinkedIn, etc.).
              </p>
            </div>

            {/* CAMPAIGN MEDIUM */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="selectMedium" required className="font-bold text-sky-950 text-xs">
                  Campaign Medium (Mídia / Formato) *
                </Label>
                <span className="text-[11px] text-sky-700 font-medium bg-sky-100/80 px-2 py-0.5 rounded">
                  "Como/qual o formato?"
                </span>
              </div>
              <select
                id="selectMedium"
                value={selectedMedium}
                onChange={(e) => setSelectedMedium(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/20"
              >
                {MEDIUM_GROUPS.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {selectedMedium === 'custom' && (
                <Input
                  type="text"
                  placeholder="Digite o formato (ex: podcast, webinar)..."
                  value={customMedium}
                  onChange={(e) => setCustomMedium(e.target.value)}
                  maxLength={100}
                  className="mt-1.5 text-xs"
                />
              )}
              <p className="text-[10px] text-slate-500">
                O veículo específico: pós patrocinado, vídeo patrocinado, stories, feed, etc.
              </p>
            </div>
          </div>

          {/* 4. CAMPAIGN NAME */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="campaignName" required className="font-bold text-slate-800 text-xs">
                Campaign Name (Nome da Campanha) *
              </Label>
              <span className="text-[10px] text-slate-400">Ex: vestibular-2026, edital-aceleracao, black-friday</span>
            </div>
            <Input
              id="campaignName"
              type="text"
              placeholder="ex: vestibular-2026, feira-inovacao-outubro"
              maxLength={150}
              {...register('campaignName')}
              onBlur={() => handleSanitizeBlur('campaignName')}
              className={errors.campaignName ? 'border-rose-300' : ''}
            />
            {errors.campaignName && (
              <p className="text-xs text-rose-600 font-medium">{errors.campaignName.message}</p>
            )}
            <p className="text-[10px] text-slate-500">Identifica a campanha ou produto geral (ex: vestibular-2026).</p>
          </div>

          {/* GRID: CONTENT & TERM (CAMPOS OPCIONAIS DO GOOGLE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* CAMPAIGN CONTENT */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Campaign Content (Criativo / Conteúdo)</Label>
                <span className="text-[10px] text-slate-400 font-normal">Opcional</span>
              </div>
              <Input
                id="content"
                type="text"
                placeholder="ex: banner-azul, video-depoimento, botao-cta-topo"
                maxLength={150}
                {...register('content')}
                onBlur={() => handleSanitizeBlur('content')}
              />
              <p className="text-[10px] text-slate-400">Usado para diferenciar anúncios ou criativos da mesma campanha.</p>
            </div>

            {/* CAMPAIGN TERM */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="term">Campaign Term (Palavra-chave)</Label>
                <span className="text-[10px] text-slate-400 font-normal">Opcional (Google Ads)</span>
              </div>
              <Input
                id="term"
                type="text"
                placeholder="ex: inovacao-energia, startups-deeptech"
                maxLength={100}
                {...register('term')}
                onBlur={() => handleSanitizeBlur('term')}
              />
              <p className="text-[10px] text-slate-400">Palavra-chave paga no Google Ads (quase sempre vazio em redes sociais).</p>
            </div>
          </div>

          {/* DESCRIÇÃO INTERNA */}
          <div className="space-y-1">
            <Label htmlFor="descricao">Observações / Anotações Internas</Label>
            <Input
              id="descricao"
              type="text"
              placeholder="Instruções para a equipe de redatores ou onde colar o link..."
              maxLength={500}
              {...register('descricao')}
            />
          </div>

          {/* PREVIEW DA URL EM TEMPO REAL */}
          <div className="mt-4 rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50/70 to-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                URL Final Montada (Preview Oficial do Google Analytics):
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
                  Preencha os campos obrigatórios acima para visualizar o link completo...
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
