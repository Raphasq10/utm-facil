import { useState, useMemo } from 'react'
import {
  Search,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  Trash2,
  FolderOpen,
  FilterX,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Project, UtmLink } from '@/types'

interface LinksTableProps {
  project: Project | undefined
  links: UtmLink[]
  isLoading?: boolean
  error?: string | null
  isEditor: boolean
  onEditLink: (link: UtmLink) => void
  onDeleteLink: (linkId: string) => void
  onOpenExportModal: () => void
}

export function LinksTable({
  project,
  links,
  isLoading = false,
  error = null,
  isEditor,
  onEditLink,
  onDeleteLink,
  onOpenExportModal,
}: LinksTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Filtra os links em tempo real com base no texto digitado
  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return links
    const query = searchQuery.toLowerCase().trim()
    return links.filter((link) => {
      const source = link.utmSource.toLowerCase()
      const medium = link.utmMedium.toLowerCase()
      const campaign = link.utmCampaign.toLowerCase()
      const content = (link.utmContent || '').toLowerCase()
      const term = (link.utmTerm || '').toLowerCase()
      const desc = (link.descricao || '').toLowerCase()
      const url = link.urlFinal.toLowerCase()
      return (
        source.includes(query) ||
        medium.includes(query) ||
        campaign.includes(query) ||
        content.includes(query) ||
        term.includes(query) ||
        desc.includes(query) ||
        url.includes(query)
      )
    })
  }, [links, searchQuery])

  const handleCopyLink = (link: UtmLink) => {
    navigator.clipboard.writeText(link.urlFinal).then(() => {
      setCopiedId(link.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  return (
    <Card className="shadow-xs border-slate-200/80 overflow-hidden">
      <CardHeader className="bg-slate-50/50 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" />
                Banco de Links do Projeto:
              </CardTitle>
              <span className="font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md text-xs">
                {project ? project.name : 'Nenhum projeto ativo'}
              </span>
            </div>
            <CardDescription>
              {project?.description || 'Consulte, busque e copie os links oficiais cadastrados para esta campanha.'}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenExportModal}
              disabled={links.length === 0}
              className="text-xs font-medium"
              title="Exportar para a equipe de conteúdo ou planilha"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Exportar ({links.length})
            </Button>
          </div>
        </div>

        {/* Barra de Busca Rápida */}
        <div className="relative mt-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Buscar por campanha, canal, termo ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxLength={100}
            className="pl-9 pr-8 text-xs bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
              title="Limpar busca"
            >
              ×
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* ESTADO 1: LOADING */}
        {isLoading && (
          <div className="p-6 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {/* ESTADO 2: ERRO */}
        {!isLoading && error && (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <FilterX className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Ocorreu um erro ao carregar os links</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">{error}</p>
          </div>
        )}

        {/* ESTADO 3: VAZIO GERAL (Sem nenhum link no projeto) */}
        {!isLoading && !error && links.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto border border-sky-100">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">Nenhum link gerado neste projeto ainda</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Preencha os campos no <strong>Construtor Inteligente de UTMs</strong> acima para cadastrar o primeiro link rastreado.
              </p>
            </div>
          </div>
        )}

        {/* ESTADO 4: VAZIO POR FILTRO DE BUSCA */}
        {!isLoading && !error && links.length > 0 && filteredLinks.length === 0 && (
          <div className="p-10 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-700">Nenhum link encontrado para "{searchQuery}"</h4>
            <p className="text-xs text-slate-500">Tente buscar por outro canal, criativo ou limpe a busca.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="text-xs mt-2"
            >
              Limpar Filtro
            </Button>
          </div>
        )}

        {/* TABELA DE LINKS */}
        {!isLoading && !error && filteredLinks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-semibold">
                  <th className="py-3 px-4 w-[160px]">Origem / Mídia</th>
                  <th className="py-3 px-4">Campanha & Descrição</th>
                  <th className="py-3 px-4 w-[150px]">Conteúdo (Criativo)</th>
                  <th className="py-3 px-4 w-[280px]">Link Rastreável</th>
                  <th className="py-3 px-4 w-[110px] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Origem e Mídia */}
                    <td className="py-3.5 px-4 align-top space-y-1">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="info" className="text-[10px] font-mono px-1.5 py-0.5">
                          {link.utmSource}
                        </Badge>
                        <Badge variant="warning" className="text-[10px] font-mono px-1.5 py-0.5">
                          {link.utmMedium}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(link.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </td>

                    {/* Campanha e Descrição */}
                    <td className="py-3.5 px-4 align-top space-y-1">
                      <span className="font-bold text-slate-900 text-xs block">
                        {link.utmCampaign}
                      </span>
                      {link.descricao && (
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                          {link.descricao}
                        </p>
                      )}
                    </td>

                    {/* Conteúdo / Termo */}
                    <td className="py-3.5 px-4 align-top space-y-1">
                      {link.utmContent ? (
                        <code className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded block truncate max-w-[130px]">
                          {link.utmContent}
                        </code>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                      {link.utmTerm && (
                        <span className="text-[10px] text-slate-400 block truncate max-w-[130px]" title={link.utmTerm}>
                          termo: {link.utmTerm}
                        </span>
                      )}
                    </td>

                    {/* URL Final com Atalho de Cópia */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2 font-mono text-[11px] text-slate-700 group-hover:border-sky-300 transition-colors">
                        <div className="truncate max-w-[250px]" title={link.urlFinal}>
                          {link.urlFinal}
                        </div>
                      </div>
                    </td>

                    {/* Botões de Ação */}
                    <td className="py-3.5 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Botão Copiar Link */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(link)}
                          className={`h-7 px-2 text-[11px] font-medium transition-all ${
                            copiedId === link.id
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300'
                          }`}
                          title="Copiar URL para a área de transferência"
                        >
                          {copiedId === link.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="hidden lg:inline">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="hidden lg:inline">Copiar</span>
                            </>
                          )}
                        </Button>

                        {/* Botão Abrir em Nova Aba */}
                        <a
                          href={link.urlFinal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-7 w-7 rounded-lg border border-slate-200 inline-flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="Testar link em nova aba"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {/* Botão Editar (Acesso Especial) */}
                        <button
                          type="button"
                          onClick={() => onEditLink(link)}
                          className="h-7 w-7 rounded-lg border border-slate-200 inline-flex items-center justify-center text-slate-500 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-colors"
                          title={isEditor ? 'Editar este link' : 'Acesso especial necessário para editar'}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>

                        {/* Botão Excluir (Acesso Especial) */}
                        <button
                          type="button"
                          onClick={() => onDeleteLink(link.id)}
                          className="h-7 w-7 rounded-lg border border-slate-200 inline-flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-colors"
                          title={isEditor ? 'Excluir este link' : 'Acesso especial necessário para excluir'}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Rodapé do Banco de Links */}
      {!isLoading && links.length > 0 && (
        <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Mostrando <strong>{filteredLinks.length}</strong> de <strong>{links.length}</strong> links cadastrados neste projeto
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Sparkles className="w-3 h-3 text-sky-500" />
            <span>Todos os links possuem taxonomia GA4 higienizada</span>
          </div>
        </div>
      )}
    </Card>
  )
}
