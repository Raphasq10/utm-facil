import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Copy, Check, Sparkles, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface TaxonomyRulesProps {
  onApplyPreset?: (source: string, medium: string) => void
}

export function TaxonomyRules({ onApplyPreset }: TaxonomyRulesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copiedPreset, setCopiedPreset] = useState<string | null>(null)

  const presets = [
    {
      channel: 'Instagram Stories',
      source: 'instagram',
      medium: 'stories',
      tip: 'Para links inseridos em figurinhas de stories orgânicos',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      channel: 'Instagram / LinkedIn Feed',
      source: 'instagram',
      medium: 'feed',
      tip: 'Para posts em imagem única ou carrossel orgânico',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      channel: 'LinkedIn Institucional',
      source: 'linkedin',
      medium: 'post-organico',
      tip: 'Para publicações de artigos, vagas ou editais corporativos',
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      channel: 'E-mail & Newsletters',
      source: 'email-marketing',
      medium: 'newsletter',
      tip: 'Para disparos periódicos a parceiros e comunidade',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      channel: 'Meta Ads (Tráfego Pago)',
      source: 'meta-ads',
      medium: 'cpc',
      tip: 'Para anúncios patrocinados no Facebook e Instagram',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      channel: 'Google Ads (Pesquisa)',
      source: 'google-ads',
      medium: 'cpc',
      tip: 'Para campanhas na rede de pesquisa ou performance max',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      channel: 'Materiais Impressos (QR Code)',
      source: 'qrcode',
      medium: 'cartaz-impresso',
      tip: 'Para totens, banners, crachás e folders de eventos físicos',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ]

  const handlePresetClick = (source: string, medium: string, label: string) => {
    if (onApplyPreset) {
      onApplyPreset(source, medium)
      setCopiedPreset(label)
      setTimeout(() => setCopiedPreset(null), 2000)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
      {/* Cabeçalho do Card */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Guia Rápido de Taxonomia & Padrões
              <Badge variant="info" className="text-[10px] py-0 px-2">
                Para o Time de Conteúdo
              </Badge>
            </h3>
            <p className="text-xs text-slate-500">
              Regras oficiais de nomenclatura e atalhos rápidos de preenchimento (GA4)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-sky-600">
          <span>{isOpen ? 'Recolher guia' : 'Ver convenções'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Conteúdo Expansível */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
          {/* Regras de Ouro */}
          <div className="bg-amber-50/80 rounded-xl p-3.5 border border-amber-200/60 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <span className="font-bold block">Regras de Ouro do Itaipu Parquetec:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
                <li>
                  <strong>Apenas minúsculas:</strong> o sistema converte automaticamente para evitar duplicidades como <code>cpc</code> vs <code>CPC</code> no Google Analytics.
                </li>
                <li>
                  <strong>Sem espaços ou acentos:</strong> espaços viram hífens (<code>-</code>) e letras como <code>ç</code> viram <code>c</code>.
                </li>
                <li>
                  <strong>Padronização:</strong> use sempre os mesmos termos para os canais para que os relatórios do time de dados fiquem limpos.
                </li>
              </ul>
            </div>
          </div>

          {/* Atalhos Rápidos para Preencher o Gerador */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                Clique em um atalho para aplicar direto no formulário:
              </span>
              {copiedPreset && (
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3 h-3" /> Aplicado no formulário!
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.channel}
                  type="button"
                  onClick={() => handlePresetClick(preset.source, preset.medium, preset.channel)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-sky-50/50 hover:border-sky-300 text-left transition-all group flex flex-col justify-between"
                  title="Clique para preencher Origem e Mídia"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-sky-700 flex items-center justify-between">
                      {preset.channel}
                      <Copy className="w-3 h-3 text-slate-400 group-hover:text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{preset.tip}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-700">
                      s: {preset.source}
                    </span>
                    <span className="bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-700">
                      m: {preset.medium}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
