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
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  // 9 Parâmetros de Edição
  const [urlDestino, setUrlDestino] = useState('')
  const [pais, setPais] = useState('')
  const [canal, setCanal] = useState('')
  const [produto, setProduto] = useState('')
  const [source, setSource] = useState('')
  const [medium, setMedium] = useState('')
  const [macroEstrategia, setMacroEstrategia] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [microEstrategia, setMicroEstrategia] = useState('')
  const [descricao, setDescricao] = useState('')

  useEffect(() => {
    if (linkToEdit) {
      setUrlDestino(linkToEdit.urlDestino || '')
      setPais(linkToEdit.pais || 'BR')
      setCanal(linkToEdit.canal || 'Social')
      setProduto(linkToEdit.produto || '')
      setSource(linkToEdit.source || '')
      setMedium(linkToEdit.medium || '')
      setMacroEstrategia(linkToEdit.macroEstrategia || '')
      setIdentifier(linkToEdit.identifier || '')
      setMicroEstrategia(linkToEdit.microEstrategia || '')
      setDescricao(linkToEdit.descricao || '')
      setPassword('')
      setAuthError('')
    }
  }, [linkToEdit, open])

  // Recalcula a URL com base nos novos parâmetros
  const calculatedUrl = buildUtmUrl({
    urlDestino,
    pais,
    canal,
    produto,
    source,
    medium,
    macroEstrategia,
    identifier,
    microEstrategia,
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
      pais: sanitizeUtmParam(pais),
      canal: sanitizeUtmParam(canal),
      produto: sanitizeUtmParam(produto),
      source: sanitizeUtmParam(source),
      medium: sanitizeUtmParam(medium),
      macroEstrategia: sanitizeUtmParam(macroEstrategia),
      identifier: sanitizeUtmParam(identifier),
      microEstrategia: sanitizeUtmParam(microEstrategia),
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
            <DialogTitle>Editar Parâmetros do Link</DialogTitle>
            <DialogDescription>
              Modifique os parâmetros desejados. A URL final será recalculada com higienização automática.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-3 mt-3 max-h-[72vh] overflow-y-auto pr-1">
            {/* 1. URL SEM UTM */}
            <div className="space-y-1">
              <Label htmlFor="editUrlDestino" required>
                1. URL sem UTM
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

            {/* GRID: PAÍS, CANAL, PRODUTO */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="editPais">2. País</Label>
                <Input
                  id="editPais"
                  type="text"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  maxLength={10}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="editCanal">3. Canal</Label>
                <Input
                  id="editCanal"
                  type="text"
                  value={canal}
                  onChange={(e) => setCanal(e.target.value)}
                  maxLength={50}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="editProduto">4. Produto</Label>
                <Input
                  id="editProduto"
                  type="text"
                  value={produto}
                  onChange={(e) => setProduto(e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>

            {/* GRID: SOURCE & MEDIUM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="editSource" required>
                  5. Source
                </Label>
                <Input
                  id="editSource"
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="editMedium" required>
                  6. Medium
                </Label>
                <Input
                  id="editMedium"
                  type="text"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>
            </div>

            {/* GRID: MACRO, IDENTIFIER, MICRO */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="editMacro">7. Macro Estratégias</Label>
                <Input
                  id="editMacro"
                  type="text"
                  value={macroEstrategia}
                  onChange={(e) => setMacroEstrategia(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="editIdentifier">8. Identifier</Label>
                <Input
                  id="editIdentifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  maxLength={150}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="editMicro">9. Micro Estratégia</Label>
                <Input
                  id="editMicro"
                  type="text"
                  value={microEstrategia}
                  onChange={(e) => setMicroEstrategia(e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-1">
              <Label htmlFor="editDescricao">Descrição Interna / Observação</Label>
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
