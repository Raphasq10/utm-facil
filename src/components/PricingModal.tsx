import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLAN_CONFIGS, type PlanTier } from '@/types/billing'
import { useAuth } from '@/contexts/AuthContext'
import { buildHotmartCheckoutUrl } from '@/lib/billing'
import { toast } from 'sonner'
import {
  Check,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Lock,
  QrCode,
  CreditCard,
} from 'lucide-react'

interface PricingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  highlightPlan?: PlanTier
}

export const PricingModal: React.FC<PricingModalProps> = ({
  open,
  onOpenChange,
  highlightPlan = 'pro',
}) => {
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const currentPlan = user?.plan || 'free'

  // Redireciona de forma segura para o checkout oficial
  const handleGoToCheckout = (planKey: PlanTier) => {
    if (isProcessing) return
    setIsProcessing(planKey)

    const checkoutUrl = buildHotmartCheckoutUrl(planKey, user?.email)
    if (!checkoutUrl) {
      toast.error('Link de checkout não configurado.')
      setIsProcessing(null)
      return
    }

    // Feedback amigável antes de redirecionar
    toast.info('Redirecionando para o ambiente seguro de pagamento...')

    setTimeout(() => {
      // Abre o checkout em nova aba com segurança
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
      setIsProcessing(null)
    }, 400)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-4xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
      <DialogClose onClick={() => onOpenChange(false)} />
      <DialogContent className="max-w-4xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-2 pb-2">
          <DialogTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Evolua a Gestão de Campanhas da sua Operação
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Escolha o nível ideal para o tamanho da sua agência ou e-commerce. Pagamento seguro via Pix instantâneo ou Cartão de Crédito.
          </DialogDescription>
        </DialogHeader>

        {/* Grade dos 3 Planos */}
        <div className="grid md:grid-cols-3 gap-5 pt-4">
          {(['free', 'pro', 'agency'] as PlanTier[]).map((planKey) => {
            const plan = PLAN_CONFIGS[planKey]
            const isCurrent = currentPlan === planKey
            const isHighlight = highlightPlan === planKey && !isCurrent
            const isAgencySoon = planKey === 'agency'

            return (
              <div
                key={planKey}
                className={`relative rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 border overflow-hidden ${
                  isAgencySoon
                    ? 'border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 opacity-60 select-none'
                    : isHighlight
                    ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 bg-gradient-to-b from-white to-emerald-50/20 dark:from-zinc-900 dark:to-emerald-950/20'
                    : isCurrent
                    ? 'border-emerald-600/40 bg-emerald-500/5 dark:border-emerald-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                }`}
              >
                {/* Faixa transversal Em Breve para Plano Agency */}
                {isAgencySoon && (
                  <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden pointer-events-none z-20">
                    <div className="absolute top-5 -right-8 w-32 bg-amber-400 text-slate-950 font-black text-[10px] tracking-widest uppercase py-1 text-center rotate-45 shadow-md border-y border-amber-300">
                      Em Breve
                    </div>
                  </div>
                )}

                {/* Badge de Destaque (Apenas exibida se o plano não for o atual) */}
                {plan.isPopular && !isAgencySoon && !isCurrent && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-b-lg shadow-sm tracking-wide uppercase">
                      Mais Escolhido
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{plan.name}</h3>
                    {isCurrent && (
                      <Badge className="bg-emerald-600 text-white font-semibold text-[10px] uppercase">
                        Plano Atual
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 min-h-[32px] mb-4">
                    {plan.description}
                  </p>

                  {/* Preço */}
                  <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 ${
                          isAgencySoon ? 'filter blur-[5px] select-none pointer-events-none' : ''
                        }`}
                      >
                        {plan.price === 0 ? 'Grátis' : `R$ ${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span
                          className={`text-xs text-zinc-500 font-medium ${
                            isAgencySoon ? 'filter blur-[3px] select-none' : ''
                          }`}
                        >
                          /{plan.billingPeriod}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">
                      {isAgencySoon
                        ? 'Lançamento em breve'
                        : plan.price === 0
                        ? 'Sem cartão de crédito'
                        : 'Cobrança mensal com renovação automática'}
                    </span>
                  </div>

                  {/* Lista de Recursos */}
                  <div className="space-y-2.5 mb-6 text-xs text-zinc-600 dark:text-zinc-300">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botão de Ação do Card */}
                <div className="pt-2">
                  {isAgencySoon ? (
                    <Button
                      variant="outline"
                      className="w-full border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 cursor-not-allowed text-xs font-semibold"
                      disabled
                    >
                      <Lock className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                      Em Breve
                    </Button>
                  ) : isCurrent ? (
                    <Button
                      variant="outline"
                      className="w-full border-zinc-200 dark:border-zinc-700 text-zinc-500 cursor-default"
                      disabled
                    >
                      Seu Plano Ativo
                    </Button>
                  ) : planKey === 'free' ? (
                    <Button
                      variant="outline"
                      className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 bg-transparent cursor-default text-xs"
                      disabled
                    >
                      Plano Gratuito
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        type="button"
                        onClick={() => handleGoToCheckout(planKey)}
                        disabled={isProcessing === planKey}
                        className={`w-full font-semibold transition-all cursor-pointer ${
                          isHighlight
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        }`}
                      >
                        {isProcessing === planKey ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Abrindo Checkout...
                          </>
                        ) : (
                          <>
                            Assinar Plano Pro
                            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Rodapé com Selos de Confiança */}
        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pagamento 100% seguro e criptografado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Liberação instantânea com <strong>Pix</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Aceita todos os cartões de crédito</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>7 dias de garantia incondicional</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
