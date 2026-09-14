import { useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Globe2,
  Share2,
  Package,
  Layers,
  FileCode,
  Calendar,
  MousePointerClick,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function TaxonomyRules() {
  const [isOpen, setIsOpen] = useState(true)

  const parameters = [
    {
      name: 'País',
      icon: Globe2,
      desc: 'Selecione as iniciais do país onde irá divulgar a campanha. É ideal para empresas que trabalham com campanhas internacionais também (ex: BR, PY, AR).',
      example: 'BR, PY, AR, GLOBAL',
    },
    {
      name: 'Canal',
      icon: Share2,
      desc: 'Com o canal, você escolhe a fonte principal de divulgação. Alguns exemplos são Email, Blog, Evento e Social (em Source você define qual a rede social específica).',
      example: 'Social, Email, Blog, Evento',
    },
    {
      name: 'Produto',
      icon: Package,
      desc: 'Escolha qual produto específico da sua empresa essa divulgação se refere.',
      example: 'Edital de Aceleração, Vestibular, Visitas Técnicas',
    },
    {
      name: 'Source',
      icon: MousePointerClick,
      desc: 'Com o Source, você vai identificar onde a sua campanha será exibida. Pode ser o próprio Google, Pop-up ou qualquer rede social que você planeja rastrear.',
      example: 'Google, Instagram, LinkedIn, Pop-up',
    },
    {
      name: 'Medium',
      icon: Layers,
      desc: 'O Medium identifica que tipo de mídia você está usando para promover o link. Pode ser um Banner, Email Marketing, CPC ou qualquer formato que seja usado.',
      example: 'Banner, Email Marketing, CPC, Stories, Feed',
    },
    {
      name: 'Macro Estratégias',
      icon: Layers,
      desc: 'Selecione qual a estratégia macro está trabalhando a partir da divulgação desse link.',
      example: 'Branding, Conversão, Captação, Engajamento',
    },
    {
      name: 'Identifier',
      icon: FileCode,
      desc: 'Com o Identifier, você define o nome específico do material, vídeo ou outro tipo de conteúdo (utm_content).',
      example: 'video-teaser-01, banner-topo-azul, carrossel-02',
    },
    {
      name: 'Micro Estratégia',
      icon: Calendar,
      desc: 'Defina qual a intenção específica dessa campanha. Você pode incluir a data da campanha, como leads de fevereiro, acessos 11-02, entre outros.',
      example: 'leads-fevereiro, acessos-11-02, inscricoes-abertas',
    },
    {
      name: 'URL sem UTM',
      icon: BookOpen,
      desc: 'Aqui você vai colocar o link da URL que deseja inserir o UTM (página de destino).',
      example: 'https://itaipuparquetec.org.br/hackathon',
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
              Entenda cada um dos parâmetros oficiais
              <Badge variant="info" className="text-[10px] py-0 px-2">
                Referência Oficial
              </Badge>
            </h3>
            <p className="text-xs text-slate-500">
              Guia oficial para orientar o time de marketing e comunicação na criação padronizada de UTMs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-sky-600">
          <span>{isOpen ? 'Recolher guia' : 'Ver parâmetros'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Conteúdo com os 9 parâmetros */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {parameters.map((param) => {
              const Icon = param.icon
              return (
                <div
                  key={param.name}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-sky-300 transition-all space-y-1.5 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-sky-600" />
                      {param.name}
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{param.desc}</p>
                  </div>
                  <div className="pt-1 text-[10px] font-mono text-slate-500 bg-slate-100/80 px-2 py-1 rounded">
                    Ex: {param.example}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 bg-sky-50/60 p-3 rounded-xl border border-sky-100">
            <span className="flex items-center gap-1.5 font-medium text-sky-950">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              O sistema normaliza automaticamente todos os valores digitados (minúsculas, sem acentos e com hífens).
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
