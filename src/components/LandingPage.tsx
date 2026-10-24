import React, { useState } from 'react'
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  FolderKanban,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Layers,
  Database,
  Search,
  Globe,
  QrCode,
  CreditCard,
  Lock,
  XCircle,
  Copy,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PlanTier } from '@/types/billing'

interface LandingPageProps {
  onLogin: () => void
  onSignup: () => void
  onSelectPlan: (plan: PlanTier) => void
  onOpenTerms?: () => void
  onOpenPrivacy?: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  onSignup,
  onSelectPlan,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* 1. NAVBAR / HEADER PÚBLICO */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Logo Oficial CampanhaUTM */}
          <a href="#" className="flex items-center">
            <img
              src="/logo-clara.png"
              alt="CampanhaUTM"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </a>

          {/* Links de Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#recursos" className="hover:text-emerald-400 transition-colors">
              Recursos
            </a>
            <a href="#comparativo" className="hover:text-emerald-400 transition-colors">
              Planilha vs CampanhaUTM
            </a>
            <a href="#planos" className="hover:text-emerald-400 transition-colors">
              Planos & Preços
            </a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">
              Perguntas Frequentes
            </a>
          </nav>

          {/* Botões de Acesso (Login / Cadastro / Menu Mobile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onLogin}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Entrar
            </button>
            <Button
              type="button"
              onClick={onSignup}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <span className="hidden sm:inline">Começar Grátis</span>
              <span className="sm:hidden">Criar Conta</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
            </Button>
            {/* Botão Hambúrguer Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
              aria-label="Alternar menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Retrátil Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-lg px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
            <a
              href="#recursos"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 border-b border-slate-900"
            >
              Recursos
            </a>
            <a
              href="#comparativo"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 border-b border-slate-900"
            >
              Planilha vs CampanhaUTM
            </a>
            <a
              href="#planos"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 border-b border-slate-900"
            >
              Planos & Preços
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
            >
              Perguntas Frequentes
            </a>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Luzes de fundo atmosféricas */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-teal-500/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge de introdução */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold mb-6 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>A Ferramenta Oficial de Taxonomia GA4 & Performance</span>
          </div>

          {/* Título Principal de Alto Impacto */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight mb-6">
            Chega de planilhas quebradas e links perdidos no WhatsApp
          </h1>

          {/* Subtítulo explicativo */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Centralize, higienize e proteja todos os links de campanhas da sua agência ou e-commerce em segundos. 
            Relatórios 100% confiáveis no Google Analytics 4 por um preço acessível.
          </p>

          {/* CTAs do Hero */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              onClick={onSignup}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-xl shadow-emerald-600/30 text-base transition-all cursor-pointer"
            >
              Criar Conta Gratuita
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <a
              href="#planos"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-900 text-slate-200 font-semibold text-base transition-all inline-flex items-center justify-center gap-2"
            >
              Conhecer os Planos (a partir de R$ 0)
            </a>
          </div>

          {/* Micro-provas sociais */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-2 pb-6 border-b border-slate-900">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sem necessidade de cartão de crédito no Free</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pagamento seguro via Pix na Hotmart</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% no padrão oficial do Google Analytics 4</span>
            </div>
          </div>

          {/* MOCKUP VISUAL INTERATIVO DO PRODUTO */}
          <div className="mt-12 rounded-2xl p-2 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 shadow-2xl max-w-5xl mx-auto">
            <div className="rounded-xl bg-slate-950 p-4 sm:p-6 text-left space-y-4">
              {/* Barra superior do mockup */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-slate-400 ml-2 font-mono text-[11px]">app.campanhautm.com.br/dashboard</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                  Higienização Ativa
                </Badge>
              </div>

              {/* Linha de parâmetros demonstrativa */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Origem (utm_source)</span>
                  <span className="font-mono text-emerald-400 font-semibold">instagram</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Mídia (utm_medium)</span>
                  <span className="font-mono text-sky-400 font-semibold">stories</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Campanha (utm_campaign)</span>
                  <span className="font-mono text-purple-400 font-semibold">black-friday-2026</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Criativo (utm_content)</span>
                  <span className="font-mono text-amber-400 font-semibold">banner-azul</span>
                </div>
              </div>

              {/* Caixa de URL Final Concatena */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 font-mono text-xs text-slate-200 flex items-center justify-between gap-4 break-all">
                <span>
                  https://minhaloja.com.br/tenis?<strong className="text-emerald-400">utm_source=instagram</strong>&<strong className="text-sky-400">utm_medium=stories</strong>&<strong className="text-purple-400">utm_campaign=black-friday-2026</strong>
                </span>
                <span className="shrink-0 px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-semibold flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copiado!
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRÊS PILARES DE VALOR (Cards logo abaixo do Hero) */}
      <section className="py-12 bg-slate-900/50 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Higienização Automática GA4</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Esqueça variações como <code className="text-rose-400">CPC</code> e <code className="text-rose-400">cpc</code> ou espaços acidentais que duplicam canais nos seus relatórios. O sistema limpa tudo em tempo real.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
                <FolderKanban className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Organização por Clientes & Pastas</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Isole os links de cada cliente ou produto em projetos independentes. Chega de planilhas gigantes com dezenas de abas que travam o navegador.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Exportação Autônoma para Equipes</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Gere guias em HTML ou planilhas CSV com 1 clique para entregar aos copywriters, designers e clientes. Eles abrem no navegador e copiam o link sem precisar de login.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPARATIVO: O JEITO ANTIGO vs CAMPANHAUTM */}
      <section id="comparativo" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Por que agências estão abandonando as planilhas do Google Sheets?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Planilhas foram feitas para cálculos contábeis, não para governança de URLs de tráfego pago.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* O Jeito Antigo */}
            <div className="p-8 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-4">
              <div className="flex items-center gap-3 text-rose-400 font-bold text-lg">
                <XCircle className="w-6 h-6" />
                <span>O Jeito Antigo (Planilhas Descentralizadas)</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Alguém apaga acidentalmente uma fórmula e o link é postado sem UTM.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Cada gestor escreve de um jeito: <code className="text-rose-300">facebook</code>, <code className="text-rose-300">fb</code>, <code className="text-rose-300">Face_Ads</code> poluindo o GA4.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Links espalhados em abas esquecidas e perda de histórico de campanhas passadas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Redatores e clientes interrompem o gestor o dia todo no WhatsApp pedindo o link certo.</span>
                </li>
              </ul>
            </div>

            {/* O Jeito CampanhaUTM */}
            <div className="p-8 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-4 shadow-xl shadow-emerald-500/5">
              <div className="flex items-center gap-3 text-emerald-400 font-bold text-lg">
                <CheckCircle2 className="w-6 h-6" />
                <span>O Jeito CampanhaUTM (Governança & Agilidade)</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Higienização obrigatória: minúsculas, hífens e remoção de acentos em tempo real.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Tratamento automático de sintaxe: concatenação correta com <code className="text-emerald-300">?</code>, <code className="text-emerald-300">&</code> e âncoras.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Banco de links central com busca instantânea em menos de 50 milissegundos.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Exportação em HTML autônomo e CSV prontos para compartilhar com o time.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RECURSOS PRINCIPAIS (Grid Visual) */}
      <section id="recursos" className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Tudo o que sua agência precisa para ter ordem no tráfego
            </h2>
            <p className="text-slate-400 text-sm">
              Criado especificamente para resolver a dor diária de quem roda anúncios e campanhas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Busca Textual Instantânea</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Encontre qualquer link gerado meses atrás digitando apenas uma palavra do criativo, campanha ou canal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Guia de Taxonomia Embutido</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tabela fixa de referência rápida com as regras recomendadas para que estagiários e redatores não tenham dúvidas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Isolamento Multi-Tenancy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada usuário possui sua conta isolada com banco de dados seguro, garantindo sigilo absoluto entre clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NÚMEROS E IMPACTO */}
      <section className="py-16 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border-y border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 block mb-1">100%</span>
              <span className="text-xs text-slate-400">Padronização no GA4</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-sky-400 block mb-1">-85%</span>
              <span className="text-xs text-slate-400">Tempo caçando links antigos</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-purple-400 block mb-1">&lt; 50ms</span>
              <span className="text-xs text-slate-400">Velocidade de busca no banco</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 block mb-1">Pix</span>
              <span className="text-xs text-slate-400">Liberação imediata na Hotmart</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DEPOIMENTOS DAS PERSONAS REAIS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Quem usa e aprova a metodologia
            </h2>
            <p className="text-slate-400 text-sm">
              Profissionais de mídia de performance e e-commerces que acabaram com o caos das planilhas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Depoimento Rodrigo Martins */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "Na minha agência temos 12 clientes ativos e 3 gestores de tráfego. Antes, cada um escrevia de um jeito nas planilhas e o relatório do cliente ficava uma bagunça. Com o CampanhaUTM, tudo virou um padrão só e a equipe de copy agora pega os links direto no HTML sem me chamar."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  RM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Rodrigo Martins</h4>
                  <p className="text-xs text-slate-400">Dono de Agência de Tráfego Pago • 12 clientes</p>
                </div>
              </div>
            </div>

            {/* Depoimento Camila Albuquerque */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "No nosso e-commerce fazemos disparos de newsletter toda semana e enviamos dezenas de links para influenciadores. A planilha vivia corrompendo as fórmulas. O CampanhaUTM garantiu que nenhum link quebre na loja e ainda exportamos o CSV para a diretoria em segundos."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                  CA
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Camila Albuquerque</h4>
                  <p className="text-xs text-slate-400">Coordenadora de Growth em E-commerce de Moda</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TABELA DE PREÇOS (Com Hotmart, Pix e Plano Grátis) */}
      <section id="planos" className="py-20 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5" /> Planos Acessíveis
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Escolha o plano ideal para a sua operação
            </h2>
            <p className="text-slate-400 text-sm">
              Comece gratuitamente hoje mesmo. Faça upgrade para Pix ou Cartão de Crédito na Hotmart com 7 dias de garantia incondicional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* PLANO FREE */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Plano Free</h3>
                <p className="text-xs text-slate-400 mb-6">Para validar o fluxo na sua primeira campanha.</p>
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <span className="text-4xl font-extrabold text-white">R$ 0</span>
                  <span className="text-xs text-slate-400 block mt-1">Sem necessidade de cartão</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Projeto / Pasta ativa
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Até 25 links rastreáveis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Higienização automática GA4
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Exportação em planilha CSV
                  </li>
                </ul>
              </div>
              <Button
                type="button"
                onClick={onSignup}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold cursor-pointer shadow-sm py-2.5 transition-colors"
              >
                Começar Grátis
              </Button>
            </div>

            {/* PLANO PRO (DESTAQUE) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-emerald-950/30 border-2 border-emerald-500 relative flex flex-col justify-between shadow-2xl shadow-emerald-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Mais Escolhido por Agências
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Plano Pro</h3>
                <p className="text-xs text-slate-400 mb-6">Para gestores com múltiplos clientes em expansão.</p>
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">R$ 47</span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>
                  <span className="text-xs text-emerald-400 block mt-1">Pix ou Cartão de Crédito na Hotmart</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-200 mb-8">
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Até 10 Projetos / Clientes simultâneos
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Links UTM 100% ilimitados
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Exportação Guia HTML autônomo offline
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Histórico completo e pesquisa instantânea
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Suporte prioritário via e-mail
                  </li>
                </ul>
              </div>
              <Button
                type="button"
                onClick={() => onSelectPlan('pro')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all"
              >
                Assinar Plano Pro na Hotmart
                <ExternalLink className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            {/* PLANO AGENCY (EM BREVE) */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between overflow-hidden opacity-50 select-none">
              {/* Faixa transversal Em Breve */}
              <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                <div className="absolute top-6 -right-9 w-36 bg-amber-400 text-slate-950 font-black text-[10px] tracking-widest uppercase py-1 text-center rotate-45 shadow-md border-y border-amber-300">
                  Em Breve
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-400 mb-1">Plano Agency</h3>
                <p className="text-xs text-slate-500 mb-6">Para agências de escala e grandes operações.</p>
                <div className="mb-6 pb-6 border-b border-slate-800/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white filter blur-[6px] select-none pointer-events-none">
                      R$ 127
                    </span>
                    <span className="text-xs text-slate-400 filter blur-[4px] select-none">/mês</span>
                  </div>
                  <span className="text-xs text-amber-400 block mt-1 font-semibold">
                    Lançamento em breve
                  </span>
                </div>
                <ul className="space-y-3 text-xs text-slate-400 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-600" /> Projetos e Clientes ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-600" /> Links UTM ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-600" /> Exportação HTML + CSV completa
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-600" /> Suporte prioritário via WhatsApp
                  </li>
                </ul>
              </div>
              <Button
                type="button"
                disabled
                className="w-full bg-slate-800/80 text-slate-400 border border-slate-700/60 font-semibold cursor-not-allowed py-2.5 opacity-90"
              >
                <Lock className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                Em Breve
              </Button>
            </div>
          </div>

          {/* Selos de Garantia Hotmart */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Checkout Seguro <strong>Hotmart</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Acesso Imediato via <strong>Pix</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Cartão de Crédito Nacional</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>7 dias de garantia incondicional</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ (Perguntas Frequentes) */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Perguntas Frequentes
            </h2>
            <p className="text-slate-400 text-sm">
              Tudo o que você precisa saber antes de começar.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Preciso cadastrar cartão de crédito para usar o Plano Free?',
                a: 'Não! O Plano Free é 100% gratuito e não exige nenhum dado financeiro. Você só precisa criar sua conta com e-mail e senha para começar a organizar seu primeiro projeto.',
              },
              {
                q: 'Como funciona o pagamento via Hotmart?',
                a: 'Ao escolher o Plano Pro ou Agency, você é direcionado para a página oficial de pagamento da Hotmart. Você pode pagar via Pix (com liberação imediata) ou Cartão de Crédito. Assim que o pagamento é aprovado, a Hotmart avisa nosso sistema e seu plano é desbloqueado automaticamente.',
              },
              {
                q: 'Meus redatores e clientes precisam de conta para ver os links?',
                a: 'Não! Esse é um dos maiores diferenciais do CampanhaUTM. Com o recurso de Exportar Guia em HTML, você gera um arquivo autônomo que pode ser enviado por e-mail ou WhatsApp. Qualquer membro da equipe pode abrir no navegador e copiar os links oficiais com 1 clique.',
              },
              {
                q: 'O que acontece se eu cancelar minha assinatura?',
                a: 'Você pode cancelar a qualquer momento diretamente pelo painel da Hotmart. Caso cancele, seus dados não são apagados; você apenas retorna aos limites do Plano Free para novas criações.',
              },
              {
                q: 'Por que a higienização de UTMs é tão importante para o GA4?',
                a: 'O Google Analytics 4 diferencia maiúsculas de minúsculas e espaços. Se uma pessoa digita "instagram" e outra digita "Instagram" ou "insta ", o GA4 separa em três canais diferentes, destruindo a precisão da sua atribuição de vendas e cálculo de ROI.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA BANNER FINAL */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Pronto para colocar ordem nos links da sua agência?
          </h2>
          <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto">
            Crie sua conta agora mesmo no plano gratuito e gere seus primeiros links higienizados em menos de 2 minutos.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              onClick={onSignup}
              className="bg-white text-slate-950 hover:bg-slate-100 font-extrabold px-8 py-3.5 rounded-xl shadow-2xl text-base cursor-pointer"
            >
              Criar Conta Gratuita Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* 11. FOOTER INSTITUCIONAL */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo-clara.png"
              alt="CampanhaUTM"
              className="h-7 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={onOpenTerms}
              className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Termos de Uso
            </button>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Política de Privacidade
            </button>
          </div>

          <p className="text-center sm:text-right text-[11px] text-slate-500">
            © {new Date().getFullYear()} CampanhaUTM. Todos os direitos reservados. Plataforma de Taxonomia e Governança GA4.
          </p>
        </div>
      </footer>
    </div>
  )
}
