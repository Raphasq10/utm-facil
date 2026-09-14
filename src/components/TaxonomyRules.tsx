import { useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MousePointerClick,
  Layers,
  Tag,
  FileCode,
  Search,
  ExternalLink,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function TaxonomyRules() {
  const [isOpen, setIsOpen] = useState(true)

  const googleFields = [
    {
      name: 'website URL *',
      icon: ExternalLink,
      title: 'Página de Destino',
      rule: 'O link exato do seu site onde o visitante deve cair ao clicar.',
      example: 'https://itaipuparquetec.org.br/hackathon',
      required: true,
    },
    {
      name: 'campaign source *',
      icon: MousePointerClick,
      title: 'Origem: "DE ONDE ele veio?"',
      rule: 'A plataforma ou parceiro onde o link foi publicado (Google, Instagram, LinkedIn, WhatsApp).',
      example: 'instagram, google, linkedin, whatsapp',
      required: true,
    },
    {
      name: 'campaign medium *',
      icon: Layers,
      title: 'Mídia / Formato: "COMO / EM QUAL FORMATO ele veio?"',
      rule: 'O veículo ou formato que levou o link. Separe sempre pago de orgânico (ex: post-patrocinado vs stories orgânico).',
      example: 'post-patrocinado, video-patrocinado, stories, feed, cpc, newsletter',
      required: true,
    },
    {
      name: 'campaign name *',
      icon: Tag,
      title: 'Nome da Campanha',
      rule: 'O nome da ação, edital, produto ou evento promovido no link.',
      example: 'vestibular-2026, edital-aceleracao, feira-inovacao',
      required: true,
    },
    {
      name: 'campaign content',
      icon: FileCode,
      title: 'Conteúdo / Criativo',
      rule: 'Diferencia criativos ou variações de botões da mesma campanha (A/B testing).',
      example: 'banner-azul, video-depoimento, botao-topo',
      required: false,
    },
    {
      name: 'campaign term',
      icon: Search,
      title: 'Termo / Palavra-chave',
      rule: 'Usado quase exclusivamente para registrar a palavra-chave paga no Google Ads.',
      example: 'energia-solar, startups-deeptech',
      required: false,
    },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
      {/* Cabeçalho */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Guia Prático: Padrão Oficial Google Analytics (GA4)
              <Badge variant="info" className="text-[10px] py-0 px-2">
                Padrão Oficial
              </Badge>
            </h3>
            <p className="text-xs text-slate-500">
              Entenda o papel exato de cada um dos parâmetros oficiais do Google Campaign URL Builder
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-sky-600">
          <span>{isOpen ? 'Recolher guia' : 'Ver parâmetros'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Conteúdo com os campos oficiais */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
          {/* Card Dica de Ouro: Source vs Medium */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50/60 p-4 rounded-xl border border-sky-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                A Regra de Ouro definitiva para não confundir:
              </span>
              <p className="text-xs text-sky-900">
                • <strong>Source (Origem):</strong> Responde <em>"De onde o visitante veio?"</em> (Instagram, Google, LinkedIn).
                <br />
                • <strong>Medium (Mídia):</strong> Responde <em>"Qual o formato ou como ele veio?"</em> (Post Patrocinado, Stories, Feed, CPC, E-mail).
              </p>
            </div>
            <span className="text-[11px] font-semibold text-sky-800 bg-white px-3 py-1.5 rounded-lg border border-sky-200 shrink-0">
              Mantenha pago separado de orgânico!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {googleFields.map((field) => {
              const Icon = field.icon
              return (
                <div
                  key={field.name}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
                        <Icon className="w-3.5 h-3.5 text-sky-600" />
                        {field.name}
                      </span>
                      {field.required && (
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-100">
                          obrigatório
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-sky-950 block">{field.title}</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{field.rule}</p>
                  </div>
                  <div className="pt-1 text-[10px] font-mono text-slate-600 bg-slate-100/80 px-2 py-1 rounded break-all">
                    Ex: {field.example}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
