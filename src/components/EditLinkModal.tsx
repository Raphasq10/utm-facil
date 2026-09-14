import { useState, useEffect } from 'react'
import { KeyRound, Edit3, Sparkles } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { buildUtmUrl, sanitizeUtmParam } from '@/lib/utm-sanitizer'
import { verifyEditorKey } from '@/lib/storage'
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
  // Estado de senha caso não seja editor ainda
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  // Estados dos campos de edição
  const [urlDestino, setUrlDestino] = useState('')
  const [utmSource, setUtmSource] = useState('')
  const [utmMedium, setUtmMedium] = useState('')
  const [utmCampaign, setUtmCampaign] = useState('')
  const [utmTerm, setUtmTerm] = useState('')
  const [utmContent, setUtmContent] = useState('')
  const [descricao, setDescricao] = useState('')

  // Preenche os campos ao abrir para o link selecionado
  useEffect(() => {
    if (linkToEdit) {
      setUrlDestino(linkToEdit.urlDestino)
      setUtmSource(linkToEdit.utmSource)
      setUtmMedium(linkToEdit.utmMedium)
      setUtmCampaign(linkToEdit.utmCampaign)
      setUtmTerm(linkToEdit.utmTerm || '')
      setUtmContent(linkToEdit.utmContent || '')
      setDescricao(linkToEdit.descricao || '')
      setPassword('')
      setAuthError('')
    }
  }, [linkToEdit, open])

  // Recalcula preview em tempo real
  const calculatedUrl = buildUtmUrl({
    urlDestino,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
  })

  // Validação de Chave Especial
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (verifyEditorKey(password)) {
      onAuthenticatedEditor()
      setAuthError('')
    } else {
      setAuthError('Chave especial incorreta. Verifique a senha com o administrador.')
    }
  }

  // Submissão da Edição
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkToEdit) return

    onUpdateLink(linkToEdit.id, {
      urlDestino: urlDestino.trim(),
      utmSource: sanitizeUtmParam(utmSource),
      utmMedium: sanitizeUtmParam(utmMedium),
      utmCampaign: sanitizeUtmParam(utmCampaign),
      utmTerm: utmTerm ? sanitizeUtmParam(utmTerm) : undefined,
      utmContent: utmContent ? sanitizeUtmParam(utmContent) : undefined,
      descricao: descricao ? descricao.trim() : undefined,
      urlFinal: calculatedUrl,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose onClick={() => onOpenChange(false)} />

      {/* CASO 1: PRECISA DESBLOQUEAR MODO EDITOR */}
      {!isEditor ? (
        <div>
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 border border-amber-200">
              <KeyRound className="w-5 h-5" />
            </div>
            <DialogTitle>Acesso Especial para Edição</DialogTitle>
            <DialogDescription>
              Para proteger a integridade dos links oficiais da equipe, a edição retroativa exige a Chave Mestra de Marketing.
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
                  Dica: a senha padrão inicial do projeto é <code>parquetec2026</code>.
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
        /* CASO 2: AUTENTICADO COMO EDITOR — FORMULÁRIO DE EDIÇÃO */
        <div>
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
              <Edit3 className="w-5 h-5" />
            </div>
            <DialogTitle>Editar Link de Campanha</DialogTitle>
            <DialogDescription>
              Modifique os parâmetros desejados. A URL final será recalculada mantendo a higienização automática.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-3 mt-3 max-h-[70vh] overflow-y-auto pr-1">
            {/* URL Destino */}
            <div className="space-y-1">
              <Label htmlFor="editUrlDestino" required>
                URL de Destino
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

            {/* Grid 3 colunas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="editSource" required>
                  Origem (source)
                </Label>
                <Input
                  id="editSource"
                  type="text"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="editMedium" required>
                  Mídia (medium)
                </Label>
                <Input
                  id="editMedium"
                  type="text"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="editCampaign" required>
                  Campanha
                </Label>
                <Input
                  id="editCampaign"
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  maxLength={150}
                  required
                />
              </div>
            </div>

            {/* Grid Conteúdo e Termo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="editContent">Conteúdo (utm_content)</Label>
                <Input
                  id="editContent"
                  type="text"
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  maxLength={150}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="editTerm">Termo (utm_term)</Label>
                <Input
                  id="editTerm"
                  type="text"
                  value={utmTerm}
                  onChange={(e) => setUtmTerm(e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-1">
              <Label htmlFor="editDescricao">Descrição Interna</Label>
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
