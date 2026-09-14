import { useState, useEffect } from 'react'
import { KeyRound, Edit3, Sparkles } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { buildUtmUrl, sanitizeUtmParam } from '@/lib/utm-sanitizer'
import { verifyEditorKey } from '@/lib/storage'
import { SOURCE_GROUPS, MEDIUM_GROUPS } from '@/components/UtmBuilder'
import type { UtmLink } from '@/types'

interface EditLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  linkToEdit: UtmLink | null
  isEditor: boolean
  onAuthenticatedEditor: () => void
  onUpdateLink: (id: string, updates: Partial<UtmLink>) => void
}

export function EditLinkModal({
  open,
  onOpenChange,
  linkToEdit,
  isEditor,
  onAuthenticatedEditor,
  onUpdateLink,
}: EditLinkModalProps) {
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  // Campos no padrão oficial do Google
  const [urlDestino, setUrlDestino] = useState('')
  const [source, setSource] = useState('instagram')
  const [medium, setMedium] = useState('post-patrocinado')
  const [campaignName, setCampaignName] = useState('')
  const [content, setContent] = useState('')
  const [term, setTerm] = useState('')
  const [descricao, setDescricao] = useState('')

  useEffect(() => {
    if (linkToEdit) {
      setUrlDestino(linkToEdit.urlDestino || '')
      setSource(linkToEdit.source || 'instagram')
      setMedium(linkToEdit.medium || 'post-patrocinado')
      setCampaignName(linkToEdit.macroEstrategia || linkToEdit.produto || '')
      setContent(linkToEdit.identifier || '')
      setTerm(linkToEdit.canal || '')
      setDescricao(linkToEdit.descricao || '')
      setPassword('')
      setAuthError('')
    }
  }, [linkToEdit, open])

  const calculatedUrl = buildUtmUrl({
    urlDestino,
    source,
    medium,
    macroEstrategia: campaignName,
    identifier: content,
    canal: term,
  })

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (verifyEditorKey(password)) {
      onAuthenticatedEditor()
      setAuthError('')
    } else {
      setAuthError('Chave especial incorreta. A senha padrão inicial é: parquetec2026')
    }
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkToEdit) return

    onUpdateLink(linkToEdit.id, {
      urlDestino: urlDestino.trim(),
      source: sanitizeUtmParam(source),
      medium: sanitizeUtmParam(medium),
      macroEstrategia: sanitizeUtmParam(campaignName),
      identifier: content ? sanitizeUtmParam(content) : '',
      canal: term ? sanitizeUtmParam(term) : 'web',
      descricao: descricao ? descricao.trim() : undefined,
      urlFinal: calculatedUrl,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose onClick={() => onOpenChange(false)} />

      {!isEditor ? (
        <div>
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 border border-amber-200">
              <KeyRound className="w-5 h-5" />
            </div>
            <DialogTitle>Acesso Especial para Edição</DialogTitle>
            <DialogDescription>
              Para proteger a integridade dos links oficiais da equipe, digite a Chave Mestra de Marketing.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerifyPassword} className="space-y-4 mt-3">
            <div className="space-y-1.5">
              <Label htmlFor="masterKey" required>
                Chave Especial de Edição
              </Label>
              <Input
                id="masterKey"
                type="password"
                placeholder="Digite a chave mestra..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (authError) setAuthError('')
                }}
                maxLength={50}
                autoFocus
                className={authError ? 'border-rose-300 focus-visible:ring-rose-200' : ''}
              />
              {authError ? (
                <p className="text-xs text-rose-600 font-medium">{authError}</p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Dica: a senha padrão inicial é <code>parquetec2026</code>.
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="default" size="sm" className="bg-amber-600 hover:bg-amber-500">
                Desbloquear Edição
              </Button>
            </DialogFooter>
          </form>
        </div>
      ) : (
        <div>
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
              <Edit3 className="w-5 h-5" />
            </div>
            <DialogTitle>Editar Parâmetros do Link (Google Analytics)</DialogTitle>
            <DialogDescription>
              Modifique a URL, origem, mídia ou criativo. A URL será recalculada instantaneamente.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-3 mt-3 max-h-[72vh] overflow-y-auto pr-1">
            {/* 1. WEBSITE URL */}
            <div className="space-y-1">
              <Label htmlFor="editUrlDestino" required>
                Website URL (Página de Destino) *
              </Label>
              <Input
                id="editUrlDestino"
                type="text"
                value={urlDestino}
                onChange={(e) => setUrlDestino(e.target.value)}
                maxLength={2000}
                required
              />
            </div>

            {/* GRID: SOURCE & MEDIUM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-sky-50/50 p-2.5 rounded-lg border border-sky-100">
              <div className="space-y-1">
                <Label htmlFor="editSource" required className="font-bold text-sky-950 text-xs">
                  Campaign Source *
                </Label>
                <select
                  id="editSource"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-sky-200 bg-white px-2 py-1 text-xs text-slate-800"
                >
                  {SOURCE_GROUPS.map((g) => (
                    <optgroup key={g.group} label={g.group}>
                      {g.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="editMedium" required className="font-bold text-sky-950 text-xs">
                  Campaign Medium *
                </Label>
                <select
                  id="editMedium"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-sky-200 bg-white px-2 py-1 text-xs text-slate-800"
                >
                  {MEDIUM_GROUPS.map((g) => (
                    <optgroup key={g.group} label={g.group}>
                      {g.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* CAMPAIGN NAME */}
            <div className="space-y-1">
              <Label htmlFor="editCampaignName" required>
                Campaign Name (Nome da Campanha) *
              </Label>
              <Input
                id="editCampaignName"
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                maxLength={150}
                required
              />
            </div>

            {/* GRID: CONTENT & TERM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="editContent">Campaign Content (Criativo)</Label>
                <Input
                  id="editContent"
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={150}
                  placeholder="ex: banner-azul, video-01"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="editTerm">Campaign Term (Palavra-chave)</Label>
                <Input
                  id="editTerm"
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  maxLength={100}
                  placeholder="ex: tecnologia, deeptech"
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-1">
              <Label htmlFor="editDescricao">Observações Internas</Label>
              <Input
                id="editDescricao"
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                maxLength={500}
              />
            </div>

            {/* Preview Recalculado */}
            <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3 space-y-1">
              <span className="text-[11px] font-bold text-sky-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-600" />
                Nova URL Recalculada:
              </span>
              <p className="font-mono text-[11px] text-slate-800 break-all bg-white p-2 rounded-lg border border-sky-100">
                {calculatedUrl}
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="default" size="sm" className="bg-sky-600 hover:bg-sky-500">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </div>
      )}
    </Dialog>
  )
}
