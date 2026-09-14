import { useState } from 'react'
import { FolderPlus } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveProject: (name: string, description?: string) => void
}

export function ProjectModal({ open, onOpenChange, onSaveProject }: ProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('O nome do projeto é obrigatório.')
      return
    }
    onSaveProject(name.trim(), description.trim() || undefined)
    setName('')
    setDescription('')
    setError('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose onClick={() => onOpenChange(false)} />
      <DialogHeader>
        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
          <FolderPlus className="w-5 h-5" />
        </div>
        <DialogTitle>Criar Novo Projeto</DialogTitle>
        <DialogDescription>
          Projetos funcionam como pastas para organizar suas campanhas e iniciativas (ex: "Vestibular 2026", "Hackathon").
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div className="space-y-1.5">
          <Label htmlFor="projectName" required>
            Nome do Projeto
          </Label>
          <Input
            id="projectName"
            type="text"
            placeholder="ex: Vestibular Itaipu Parquetec 2026"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            maxLength={100}
            autoFocus
            className={error ? 'border-rose-300 focus-visible:ring-rose-200' : ''}
          />
          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="projectDescription">Descrição ou Objetivo</Label>
            <span className="text-[10px] text-slate-400">Opcional</span>
          </div>
          <Input
            id="projectDescription"
            type="text"
            placeholder="ex: Links para as campanhas de captação de novos alunos e vestibulares"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" variant="default" size="sm" className="bg-sky-600 hover:bg-sky-500">
            Salvar Projeto
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
