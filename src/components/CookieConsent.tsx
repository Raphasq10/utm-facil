import React, { useState, useEffect } from 'react'
import { Cookie, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CookieConsentProps {
  onOpenPrivacy?: () => void
  onOpenTerms?: () => void
}

const STORAGE_KEY = 'campanhautm_cookie_consent'

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY)
      if (!consent) {
        // Exibe suavemente após 600ms para não bloquear a renderização inicial
        const timer = setTimeout(() => setIsVisible(true), 600)
        return () => clearTimeout(timer)
      }
    } catch {
      // Caso localStorage esteja desativado no navegador
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {}
    setIsVisible(false)
  }

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'essential')
    } catch {}
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <aside
      role="region"
      aria-label="Aviso de Privacidade e Cookies"
      className="fixed bottom-3 left-3 right-3 sm:left-6 sm:bottom-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-slate-800/90 shadow-2xl shadow-black/70 text-slate-100 flex flex-col gap-3.5">
        
        {/* Cabeçalho do Banner de Cookies */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                Privacidade & Cookies
                <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                  LGPD
                </span>
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAcceptEssential}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            aria-label="Fechar aviso de cookies"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Texto Explicativo em Conformidade com a LGPD */}
        <p className="text-xs text-slate-300 leading-relaxed">
          Utilizamos cookies essenciais para o funcionamento seguro da plataforma e tecnologias de análise (Google Analytics 4) para aprimorar sua experiência, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
        </p>

        {/* Links Legais */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Conheça nossa</span>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
          >
            Política de Privacidade
          </button>
          <span>e</span>
          <button
            type="button"
            onClick={onOpenTerms}
            className="text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
          >
            Termos
          </button>
        </div>

        {/* Ações de Consentimento */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            size="sm"
            onClick={handleAcceptAll}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            Aceitar Todos
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAcceptEssential}
            className="flex-1 bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700 hover:text-white font-medium text-xs py-2 rounded-xl transition-all cursor-pointer"
          >
            Apenas Necessários
          </Button>
        </div>

      </div>
    </aside>
  )
}
