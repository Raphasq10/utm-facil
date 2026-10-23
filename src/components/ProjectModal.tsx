import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormData } from '@/lib/validations/project'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FolderPlus, Pencil, Loader2, Sparkles } from 'lucide-react'
import type { Project } from '@/types'
import { PLAN_CONFIGS, type PlanTier } from '@/types/billing'

interface ProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveProject: (name: string, description?: string) => void
  onUpdateProject?: (id: string, name: string, description?: string) => void
  projectToEdit?: Project | null
  currentProjectCount?: number
  userPlan?: PlanTier
  onOpenPricing?: () => void
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  open,
  onOpenChange,
  onSaveProject,
  onUpdateProject,
  projectToEdit,
  currentProjectCount = 0,
  userPlan = 'free',
  onOpenPricing,
}) => {
  const isEditing = Boolean(projectToEdit)
  const planConfig = PLAN_CONFIGS[userPlan] || PLAN_CONFIGS.free
  const maxProjects = planConfig.maxProjects

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  // Preenche os campos se estiver editando ou limpa se for novo
  useEffect(() => {
    if (projectToEdit) {
      reset({
        name: projectToEdit.name,
        description: projectToEdit.description || '',
      })
    } else {
      reset({
        name: '',
        description: '',
      })
    }
  }, [projectToEdit, open, reset])

  const onSubmit = async (data: ProjectFormData) => {
    // Sanitização e proteção contra espaços extras
    const cleanName = data.name.trim()
    const cleanDesc = data.description?.trim() || undefined

    if (isEditing && projectToEdit && onUpdateProject) {
      onUpdateProject(projectToEdit.id, cleanName, cleanDesc)
    } else {
      onSaveProject(cleanName, cleanDesc)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-md p-6">
      <DialogClose onClick={() => onOpenChange(false)} />
      <DialogHeader>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 border border-emerald-100">
          {isEditing ? <Pencil className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
        </div>
        <DialogTitle>{isEditing ? 'Editar Pasta do Projeto' : 'Criar Novo Projeto'}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Atualize o nome ou descrição da iniciativa para manter seu histórico organizado.'
            : 'Projetos funcionam como pastas para agrupar campanhas de clientes ou linhas de produtos.'}
        </DialogDescription>
      </DialogHeader>

      {/* Indicador visual de uso vs limite do plano */}
      {!isEditing && (
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-xs space-y-1.5">
          <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300">
            <span className="font-medium">Capacidade do {planConfig.name}:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {currentProjectCount} de {maxProjects === Infinity ? '∞' : maxProjects} projetos
            </span>
          </div>

          <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                maxProjects !== Infinity && currentProjectCount >= maxProjects
                  ? 'bg-rose-500'
                  : 'bg-emerald-500'
              }`}
              style={{
                width: `${
                  maxProjects === Infinity ? 15 : Math.min(100, (currentProjectCount / maxProjects) * 100)
                }%`,
              }}
            />
          </div>

          {userPlan === 'free' && onOpenPricing && (
            <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Precisa de mais clientes?</span>
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false)
                  onOpenPricing()
                }}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Upgrade para 10 projetos
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2" noValidate>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="projectName">
              Nome do Projeto <span className="text-rose-500">*</span>
            </Label>
            <span className="text-[10px] text-zinc-400">Máx. 80 caracteres</span>
          </div>
          <Input
            id="projectName"
            type="text"
            placeholder="Ex: Vestibular 2026, Black Friday, Cliente Alfa"
            maxLength={80}
            autoFocus
            disabled={isSubmitting}
            {...register('name')}
            className={errors.name ? 'border-rose-400 focus-visible:ring-rose-200' : ''}
          />
          {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="projectDescription">Descrição ou Objetivo</Label>
            <span className="text-[10px] text-zinc-400">Opcional (máx. 250)</span>
          </div>
          <Input
            id="projectDescription"
            type="text"
            placeholder="Ex: Links rastreados para captação de leads e campanhas de Meta Ads"
            maxLength={250}
            disabled={isSubmitting}
            {...register('description')}
            className={errors.description ? 'border-rose-400 focus-visible:ring-rose-200' : ''}
          />
          {errors.description && (
            <p className="text-xs text-rose-500 font-medium">{errors.description.message}</p>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : isEditing ? (
              'Atualizar Projeto'
            ) : (
              'Salvar Projeto'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
