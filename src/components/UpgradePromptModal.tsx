import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

interface UpgradePromptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenPricing: () => void
  title?: string
  description?: string
  limitReason?: 'project' | 'link' | 'html_export'
}

export const UpgradePromptModal: React.FC<UpgradePromptModalProps> = ({
  open,
  onOpenChange,
  onOpenPricing,
  title,
  description,
  limitReason = 'project',
}) => {
  const getDefaultContent = () => {
    switch (limitReason) {
      case 'project':
        return {
          title: 'Limite de Projetos Atingido no Plano Free',
          description:
            'Você já está utilizando o seu projeto gratuito. Para cadastrar novos clientes, separar campanhas por marca e expandir sua agência, faça upgrade para o Plano Pro.',
        }
      case 'link':
        return {
          title: 'Limite de 25 Links Atingido neste Projeto',
          description:
            'O Plano Free permite até 25 links por projeto. No Plano Pro você tem links UTM ilimitados para todas as suas peças e anúncios.',
        }
      case 'html_export':
        return {
          title: 'Exportação em HTML Autônomo é um Recurso Pro',
          description:
            'A exportação de guias estáticos em HTML para enviar a clientes e copywriters está disponível no Plano Pro e Agency. No plano Free, você pode exportar em planilha CSV.',
        }
    }
  }

  const content = {
    title: title || getDefaultContent().title,
    description: description || getDefaultContent().description,
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-md p-6 text-center">
      <DialogClose onClick={() => onOpenChange(false)} />
      <DialogContent className="p-0">
        <DialogHeader className="space-y-3 items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mx-auto">
            <Zap className="w-7 h-7" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-left space-y-1.5 text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Vantagens do Plano Pro (R$ 47/mês):</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-300 pl-1">
            <li>Até 10 Projetos / Clientes simultâneos</li>
            <li>Links UTM 100% ilimitados</li>
            <li>Exportação de Guias HTML offline para clientes</li>
            <li>Pagamento seguro via Pix ou Cartão de Crédito</li>
          </ul>
        </div>

        <DialogFooter className="flex flex-col sm:flex-col gap-2 pt-2">
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false)
              onOpenPricing()
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            Ver Planos & Fazer Upgrade
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 text-xs"
          >
            Continuar no Plano Atual
          </Button>
        </DialogFooter>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Checkout Seguro • 7 dias de garantia incondicional</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
