import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { utmFormSchema, type UtmFormData } from '@/lib/validations/utm'
import {
  Link2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  RefreshCw,
  BookmarkPlus,
  Loader2,
  FolderKanban,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { buildUtmUrl, sanitizeUtmParam } from '@/lib/utm-sanitizer'
import { SOURCE_GROUPS, MEDIUM_GROUPS } from '@/lib/utm-constants'
import type { Project, UtmLink } from '@/types'

interface UtmBuilderProps {
  activeProject: Project | undefined
  onSaveLink: (link: Omit<UtmLink, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export const UtmBuilder: React.FC<UtmBuilderProps> = ({ activeProject, onSaveLink }) => {
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
    resolver: zodResolver(utmFormSchema),
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

  // Constrói a URL final parametrizada no padrão oficial Google Analytics 4
  const previewUrl = buildUtmUrl({
    urlDestino: watched.urlDestino || '',
    source: watched.source || '',
    medium: watched.medium || '',
    campaignName: watched.campaignName || '',
    identifier: watched.content || '',
    canal: watched.term || '',
  })

  // Sanitização automática ao perder o foco (remove acentos, espaços por hífens, minúsculas)
  const handleSanitizeBlur = (field: 'campaignName' | 'content' | 'term') => {
    const current = watched[field]
    if (current) {
      setValue(field, sanitizeUtmParam(current), { shouldValidate: true })
    }
  }

  // Cópia da URL final com feedback imediato
  const handleCopyPreview = () => {
    if (!previewUrl) return
    navigator.clipboard.writeText(previewUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Submissão protegida contra Mass Assignment e com vínculo obrigatório ao projeto ativo
  const onSubmit = (data: UtmFormData) => {
    if (!activeProject) return

    // Sanitização final de todos os parâmetros antes da gravação
    const cleanSource = sanitizeUtmParam(data.source)
    const cleanMedium = sanitizeUtmParam(data.medium)
    const cleanCampaign = sanitizeUtmParam(data.campaignName)
    const cleanContent = data.content ? sanitizeUtmParam(data.content) : ''
    const cleanTerm = data.term ? sanitizeUtmParam(data.term) : 'web'

    onSaveLink({
      projectId: activeProject.id,
      urlDestino: data.urlDestino.trim(),
      source: cleanSource,
      medium: cleanMedium,
      macroEstrategia: cleanCampaign,
      identifier: cleanContent,
      canal: cleanTerm,
      pais: 'BR',
      produto: activeProject.name,
      descricao: data.descricao ? data.descricao.trim().slice(0, 300) : undefined,
      urlFinal: previewUrl,
    })

    // Limpa apenas o criativo e notas para permitir gerar a próxima variação rapidamente
    setValue('content', '')
    setValue('descricao', '')
  }

  return (
    <Card className="shadow-xs border-slate-200/80 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
      <CardHeader className="bg-gradient-to-r from-slate-50 via-white to-emerald-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-emerald-950/20 pb-4 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base text-slate-900 dark:text-zinc-100 font-bold">
              <Link2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Construtor Inteligente de UTMs (Padrão GA4)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
              Campos padronizados com higienização instantânea de acentos, minúsculas e espaços.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {/* Indicação obrigatória do projeto ativo */}
            {activeProject && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                <FolderKanban className="w-3.5 h-3.5 text-emerald-500" />
                <span>Vinculado a: <strong>{activeProject.name}</strong></span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                reset()
                setSelectedSource('instagram')
                setSelectedMedium('post-patrocinado')
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800"
              title="Limpar formulário"
            >
              <RefreshCw className="w-3 h-3" /> Limpar
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* 1. WEBSITE URL (URL DE DESTINO) */}
          <div className="space-y-1.5 bg-slate-50/80 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-700/60">
            <div className="flex items-center justify-between">
              <Label htmlFor="urlDestino" className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                Website URL (Página de Destino) <span className="text-rose-500">*</span>
              </Label>
              <span className="text-[11px] text-slate-400">Ex: https://minhaloja.com.br/produto</span>
            </div>
            <Input
              id="urlDestino"
              type="url"
              placeholder="https://seudominio.com.br/pagina-ou-produto"
              maxLength={2000}
              disabled={isSubmitting}
              {...register('urlDestino')}
              className={errors.urlDestino ? 'border-rose-400 focus-visible:ring-rose-200' : 'bg-white dark:bg-zinc-900'}
            />
            {errors.urlDestino && (
              <p className="text-xs text-rose-500 font-medium">{errors.urlDestino.message}</p>
            )}
            <p className="text-[10px] text-slate-400">
              Pode conter parâmetros existentes (ex: <code>?cupom=10</code>) ou âncoras (ex: <code>#inscricao</code>). O sistema concatena corretamente.
            </p>
          </div>

          {/* GRID: SOURCE & MEDIUM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/30 dark:bg-emerald-950/10 p-4 rounded-xl border border-emerald-100/80 dark:border-emerald-900/30">
            {/* CAMPAIGN SOURCE */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="selectSource" className="font-bold text-slate-900 dark:text-zinc-100 text-xs">
                  Campaign Source (Origem) <span className="text-rose-500">*</span>
                </Label>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-100/80 dark:bg-emerald-900/40 px-2 py-0.5 rounded">
                  "De onde o visitante vem?"
                </span>
              </div>
              <select
                id="selectSource"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-xl border border-emerald-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-slate-800 dark:text-zinc-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
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
                  placeholder="Digite a origem (ex: parceiro-x, threads)..."
                  value={customSource}
                  onChange={(e) => setCustomSource(sanitizeUtmParam(e.target.value))}
                  maxLength={80}
                  disabled={isSubmitting}
                  className="mt-1.5 text-xs bg-white dark:bg-zinc-900"
                />
              )}
              <p className="text-[10px] text-slate-400">
                A plataforma onde o link será divulgado (Instagram, Google, LinkedIn, etc.).
              </p>
            </div>

            {/* CAMPAIGN MEDIUM */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="selectMedium" className="font-bold text-slate-900 dark:text-zinc-100 text-xs">
                  Campaign Medium (Mídia / Formato) <span className="text-rose-500">*</span>
                </Label>
                <span className="text-[11px] text-sky-700 dark:text-sky-400 font-medium bg-sky-100/80 dark:bg-sky-900/40 px-2 py-0.5 rounded">
                  "Qual o formato da peça?"
                </span>
              </div>
              <select
                id="selectMedium"
                value={selectedMedium}
                onChange={(e) => setSelectedMedium(e.target.value)}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-xl border border-emerald-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-slate-800 dark:text-zinc-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
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
                  onChange={(e) => setCustomMedium(sanitizeUtmParam(e.target.value))}
                  maxLength={80}
                  disabled={isSubmitting}
                  className="mt-1.5 text-xs bg-white dark:bg-zinc-900"
                />
              )}
              <p className="text-[10px] text-slate-400">
                O veículo específico: stories, feed, cpc, post-patrocinado, banner, etc.
              </p>
            </div>
          </div>

          {/* 3. CAMPAIGN NAME */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="campaignName" className="font-bold text-slate-800 dark:text-zinc-200 text-xs">
                Campaign Name (Nome da Campanha) <span className="text-rose-500">*</span>
              </Label>
              <span className="text-[10px] text-slate-400">Ex: black-friday-2026, captacao-leads</span>
            </div>
            <Input
              id="campaignName"
              type="text"
              placeholder="Ex: black-friday-2026, feira-inovacao"
              maxLength={100}
              disabled={isSubmitting}
              {...register('campaignName')}
              onBlur={() => handleSanitizeBlur('campaignName')}
              className={errors.campaignName ? 'border-rose-400' : ''}
            />
            {errors.campaignName && (
              <p className="text-xs text-rose-500 font-medium">{errors.campaignName.message}</p>
            )}
            <p className="text-[10px] text-slate-400">Identifica a campanha ou produto geral no Google Analytics 4.</p>
          </div>

          {/* GRID: CONTENT & TERM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* CAMPAIGN CONTENT */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Campaign Content (Criativo / Variação)</Label>
                <span className="text-[10px] text-slate-400 font-normal">Opcional</span>
              </div>
              <Input
                id="content"
                type="text"
                placeholder="Ex: banner-azul, video-depoimento-v2"
                maxLength={100}
                disabled={isSubmitting}
                {...register('content')}
                onBlur={() => handleSanitizeBlur('content')}
              />
              <p className="text-[10px] text-slate-400">Diferencia criativos ou testes A/B da mesma campanha.</p>
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
                placeholder="Ex: software-gestao, automacao"
                maxLength={100}
                disabled={isSubmitting}
                {...register('term')}
                onBlur={() => handleSanitizeBlur('term')}
              />
              <p className="text-[10px] text-slate-400">Palavra-chave contratada em links patrocinados no Google Ads.</p>
            </div>
          </div>

          {/* DESCRIÇÃO INTERNA */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="descricao">Observações / Rótulo Interno</Label>
              <span className="text-[10px] text-slate-400">Opcional (máx. 300)</span>
            </div>
            <Input
              id="descricao"
              type="text"
              placeholder="Instruções para o copywriter, designer ou onde o link deve ser colado..."
              maxLength={300}
              disabled={isSubmitting}
              {...register('descricao')}
            />
          </div>

          {/* PREVIEW DINÂMICO COM DESTAQUE VISUAL DOS PARÂMETROS */}
          <div className="mt-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50/50 via-slate-50 to-white dark:from-zinc-900 dark:via-zinc-900 dark:to-emerald-950/20 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Preview em Tempo Real (Google Analytics 4):
              </span>
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1"
                >
                  Testar link no navegador <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Destaque Visual em Badges dos Parâmetros Sanitizados */}
            {watched.urlDestino && (
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                  Base: {watched.urlDestino.split('?')[0].slice(0, 30)}...
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-mono">
                  source: <strong>{sanitizeUtmParam(watched.source)}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 font-mono">
                  medium: <strong>{sanitizeUtmParam(watched.medium)}</strong>
                </span>
                {watched.campaignName && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-mono">
                    campaign: <strong>{sanitizeUtmParam(watched.campaignName)}</strong>
                  </span>
                )}
                {watched.content && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-mono">
                    content: <strong>{sanitizeUtmParam(watched.content)}</strong>
                  </span>
                )}
                {watched.term && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20 font-mono">
                    term: <strong>{sanitizeUtmParam(watched.term)}</strong>
                  </span>
                )}
              </div>
            )}

            {/* Caixa da URL Concatena Pronta */}
            <div className="bg-white dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 p-3.5 font-mono text-xs text-slate-800 dark:text-zinc-200 break-all select-all min-h-[48px] flex items-center shadow-inner">
              {previewUrl || (
                <span className="text-slate-400 dark:text-zinc-500 font-sans italic text-xs">
                  Preencha a URL de destino e os parâmetros acima para visualizar o link completo...
                </span>
              )}
            </div>

            {/* Ações de Cópia e Gravação */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-1 gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyPreview}
                disabled={!previewUrl}
                className="w-full sm:w-auto h-10 sm:h-9 text-xs font-semibold cursor-pointer border-slate-300 dark:border-zinc-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copiar Link Pronto
                  </>
                )}
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={!previewUrl || isSubmitting || !activeProject}
                className="w-full sm:w-auto h-10 sm:h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Salvando no Projeto...
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4 mr-1.5" />
                    Salvar no Projeto Atual
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
