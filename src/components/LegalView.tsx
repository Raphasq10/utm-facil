import React, { useState, useEffect } from 'react'
import { ArrowLeft, ShieldCheck, FileText, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type LegalDocType = 'terms' | 'privacy'

interface LegalViewProps {
  initialDoc?: LegalDocType
  onBackToLanding: () => void
}

export const LegalView: React.FC<LegalViewProps> = ({
  initialDoc = 'terms',
  onBackToLanding,
}) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialDoc)

  useEffect(() => {
    if (initialDoc) {
      setActiveDoc(initialDoc)
    }
    // Rola para o topo ao alternar documento
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [initialDoc])

  const switchDoc = (doc: LegalDocType) => {
    setActiveDoc(doc)
    const targetPath = doc === 'terms' ? '/termos' : '/privacidade'
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Header Fixo Minimalista */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onBackToLanding()
            }}
            className="flex items-center"
          >
            <img
              src="/logo-clara.png"
              alt="CampanhaUTM"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </a>

          <Button
            type="button"
            variant="ghost"
            onClick={onBackToLanding}
            className="text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 text-xs sm:text-sm font-semibold rounded-xl px-4 py-2 cursor-pointer transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o Início</span>
          </Button>
        </div>
      </header>

      {/* 2. Hero do Documento Legal */}
      <section className="border-b border-slate-800/80 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            {activeDoc === 'terms' ? (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Diretrizes e Contrato de Serviço</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Em Conformidade com a LGPD (Lei 13.709/2018)</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {activeDoc === 'terms' ? 'Termos de Uso e Serviço' : 'Política de Privacidade'}
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Transparência, segurança e clareza sobre como operamos a plataforma CampanhaUTM e protegemos os seus dados.
          </p>

          {/* Seletor de Documento em Pílulas */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => switchDoc('terms')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeDoc === 'terms'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 ring-1 ring-emerald-500'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-850'
              }`}
            >
              Termos de Uso
            </button>
            <button
              type="button"
              onClick={() => switchDoc('privacy')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeDoc === 'privacy'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 ring-1 ring-emerald-500'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-850'
              }`}
            >
              Política de Privacidade (LGPD)
            </button>
          </div>
        </div>
      </section>

      {/* 3. Corpo do Documento Legível */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-12 space-y-10 text-slate-300 text-sm sm:text-base leading-relaxed">
          {activeDoc === 'terms' ? (
            <>
              {/* Cláusula 1 */}
              <article className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </span>
                  Aceitação e Objeto
                </h2>
                <p>
                  Bem-vindo ao <strong>CampanhaUTM</strong> (disponível através do domínio oficial <code className="text-emerald-400 font-mono text-sm">campanhautm.com.br</code> e de suas aplicações vinculadas). Ao cadastrar uma conta, criar links de rastreamento ou assinar qualquer plano pago da nossa plataforma, você concorda expressa e integralmente com estes Termos de Uso.
                </p>
                <p>
                  O CampanhaUTM é um software SaaS (Software as a Service) comercial voltado para agências de tráfego pago, e-commerces e profissionais de marketing digital. A ferramenta oferece centralização de links de campanhas, padronização rigorosa de taxonomia, higienização de URLs segundo as normas do Google Analytics 4 (GA4), isolamento seguro de dados por cliente/projeto e exportação de guias estruturados.
                </p>
              </article>

              <hr className="border-slate-800/80" />

              {/* Cláusula 2 */}
              <article className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </span>
                  Contas de Usuário e Segurança
                </h2>
                <p>
                  Para utilizar os recursos do CampanhaUTM, o usuário deve criar uma conta informando um endereço de e-mail autêntico e definindo uma senha segura. O usuário é o único responsável pela guarda, confidencialidade e ações executadas sob suas credenciais de acesso.
                </p>
                <p>
                  Cada conta é individual e intransferível no respectivo plano contratado. É expressamente vedado o compartilhamento não autorizado de acessos individuais. Em caso de extravio ou suspeita de uso indevido de sua conta, o usuário deve acionar imediatamente nosso suporte oficial.
                </p>
              </article>

              <hr className="border-slate-800/80" />

              {/* Cláusula 3 */}
              <article className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </span>
                  Planos Comerciais, Cobrança e Recorrência
                </h2>
                <p>
                  A plataforma é oferecida sob diferentes níveis de contratação:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="font-bold text-white block">Plano Free (Gratuito)</span>
                    <p className="text-xs text-slate-400">
                      Disponível gratuitamente por prazo indeterminado, limitado a 1 projeto/cliente ativo e até 25 links rastreáveis com higienização automática GA4.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1">
                    <span className="font-bold text-emerald-400 block">Plano Pro (R$ 47,00/mês)</span>
                    <p className="text-xs text-slate-400">
                      Assinatura mensal recorrente com até 10 projetos simultâneos, links UTM ilimitados, exportação de Guia HTML offline autônomo e suporte prioritário.
                    </p>
                  </div>
                </div>
                <p className="pt-2">
                  Todas as transações e cobranças do CampanhaUTM são intermediadas com total segurança criptográfica pela plataforma <strong>Hotmart</strong> (HotPay, certificação internacional PCI-DSS nível 1). A assinatura do Plano Pro é renovada automaticamente a cada 30 dias na data de contratação, salvo cancelamento prévio.
                </p>
              </article>

              <hr className="border-slate-800/80" />

              {/* Cláusula 4 */}
              <article className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    4
                  </span>
                  Garantia Legal de 7 Dias e Cancelamento
                </h2>
                <p>
                  Em total conformidade com o <strong>Art. 49 do Código de Defesa do Consumidor (Lei nº 8.078/1990)</strong>, todo assinante conta com garantia incondicional de reembolso integral no prazo de <strong>7 (sete) dias corridos</strong> a partir da contratação inicial do plano pago. O reembolso pode ser solicitado diretamente pelo painel da Hotmart ou pelo nosso suporte, sem qualquer burocracia.
                </p>
                <p>
                  Após esse prazo, o usuário pode cancelar a renovação automática a qualquer momento. Ao cancelar, não há cobrança de qualquer multa ou taxa rescisória, permanecendo o acesso aos recursos Pro ativo até o último dia do período mensal já liquidado.
                </p>
              </article>

              <hr className="border-slate-800/80" />

              {/* Cláusula 5 */}
              <article className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    5
                  </span>
                  Uso Aceitável e Vedações Estritas
                </h2>
                <p>
                  O usuário declara expressamente que utilizará o CampanhaUTM para atividades lícitas de gestão de campanhas e marketing. É estritamente proibido utilizar a ferramenta para:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400 text-sm">
                  <li>Gerar, mascarar ou redirecionar links com destino a páginas de phishing, golpes ou engenharia social;</li>
                  <li>Distribuir malwares, spywares, vírus ou arquivos nocivos;</li>
                  <li>Práticas de spam e disparos em massa não autorizados;</li>
                  <li>Violar direitos de propriedade intelectual ou leis vigentes no território brasileiro.</li>
                </ul>
                <p>
                  A constatação de qualquer dessas práticas ensejará o bloqueio sumário da conta sem direito a restituição de valores, sem prejuízo das medidas cíveis e criminais cabíveis.
                </p>
              </article>

              <hr className="border-slate-800/80" />

              {/* Cláusula 6 */}
              <article className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    6
                  </span>
                  Propriedade Intelectual e Foro
                </h2>
                <p>
                  A marca CampanhaUTM, logotipos, layouts, estruturas de dados, códigos-fonte e algoritmos de sanitização são de titularidade exclusiva de seus desenvolvedores e estão protegidos pelas leis de propriedade intelectual e direitos autorais.
                </p>
                <p>
                  Estes Termos são regidos pelas leis da República Federativa do Brasil, elegendo-se o foro da comarca do domicílio do consumidor para dirimir quaisquer controvérsias decorrentes deste contrato.
                </p>
              </article>
            </>
          ) : (
            <>
              {/* LGPD 1 */}
              <article className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </span>
                  Nosso Compromisso com a LGPD
                </h2>
                <p>
                  O <strong>CampanhaUTM</strong> tem o compromisso fundamental de respeitar a privacidade e proteger os dados pessoais de todos os seus usuários. Esta Política foi desenvolvida em estrita observância à <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD)</strong> e ao Marco Civil da Internet (Lei nº 12.965/2014).
                </p>
              </article>

              <hr className="border-slate-800/80" />

              {/* LGPD 2 */}
              <article className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </span>
                  Dados Coletados e Finalidades
                </h2>
                <p>
                  Coletamos exclusivamente os dados estritamente indispensáveis para o fornecimento do serviço contratado:
                </p>
                <ul className="space-y-2.5 pt-2">
                  <li className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm">
                    <strong className="text-emerald-400 block mb-1">Dados de Autenticação:</strong>
                    Nome completo e e-mail para identificação, envio de e-mails de confirmação e recuperação de senha.
                  </li>
                  <li className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm">
                    <strong className="text-emerald-400 block mb-1">Dados de Pagamento (Zero Armazenamento Interno):</strong>
                    O CampanhaUTM <strong>nunca armazena dados de cartão de crédito</strong>. Todas as transações financeiras são criptografadas e processadas de forma isolada pela <strong>Hotmart</strong>. Recebemos unicamente a confirmação de liquidação para liberação do Plano Pro.
                  </li>
                  <li className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm">
                    <strong className="text-emerald-400 block mb-1">Dados de Campanhas:</strong>
                    Nomes de projetos e parâmetros de links (ex: origem, mídia, campanha) inseridos voluntariamente para organização das suas URLs no GA4.
                  </li>
                </ul>
              </article>

              <hr className="border-slate-800/80" />

              {/* LGPD 3 */}
              <article className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </span>
                  Segurança, Criptografia e Row Level Security (RLS)
                </h2>
                <p>
                  Adotamos infraestrutura de nível corporativo via <strong>Supabase Cloud</strong> com banco de dados PostgreSQL blindado por políticas obrigatórias de <strong>Row Level Security (RLS)</strong>.
                </p>
                <p>
                  Isso assegura, no nível mais profundo do banco de dados, que nenhuma agência, cliente ou terceiro consiga visualizar, consultar ou modificar links e projetos de outro usuário. Todo o tráfego de dados é protegido por criptografia de ponta a ponta (HTTPS com certificado TLS 1.3).
                </p>
              </article>

              <hr className="border-slate-800/80" />

              {/* LGPD 4 */}
              <article className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    4
                  </span>
                  Compartilhamento Restrito de Dados
                </h2>
                <p>
                  O CampanhaUTM <strong>não vende, aluga ou cede dados pessoais</strong> para terceiros para fins de marketing ou publicidade. O compartilhamento ocorre estritamente com os provedores técnicos essenciais ao funcionamento do software (ex: Supabase para banco de dados e Hotmart para cobrança) e mediante determinação legal de autoridade judicial competente.
                </p>
              </article>

              <hr className="border-slate-800/80" />

              {/* LGPD 5 */}
              <article className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    5
                  </span>
                  Seus Direitos como Titular (Art. 18 da LGPD)
                </h2>
                <p>Você pode, a qualquer tempo e sem qualquer custo, solicitar:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400 text-sm">
                  <li>Confirmação da existência de tratamento e cópia dos seus dados;</li>
                  <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
                  <li>Exclusão permanente da sua conta e de todos os links do histórico;</li>
                  <li>Portabilidade dos dados em formato estruturado (exportação CSV).</li>
                </ul>
              </article>

              <hr className="border-slate-800/80" />

              {/* LGPD 6 */}
              <article className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    6
                  </span>
                  Contato com o Encarregado de Proteção de Dados (DPO)
                </h2>
                <p>
                  Para exercer seus direitos de titular ou esclarecer qualquer dúvida sobre como seus dados são tratados na plataforma, entre em contato diretamente com o nosso canal oficial de suporte:
                </p>
                <div className="pt-2">
                  <a
                    href="mailto:suporte@campanhautm.com.br"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>suporte@campanhautm.com.br</span>
                  </a>
                </div>
              </article>
            </>
          )}
        </div>

        {/* Rodapé Interno do Documento */}
        <div className="mt-12 text-center">
          <Button
            type="button"
            onClick={onBackToLanding}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/25 cursor-pointer text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a Página Inicial
          </Button>
        </div>
      </main>

      {/* 4. Footer Institucional */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo-clara.png"
              alt="CampanhaUTM"
              className="h-6 w-auto object-contain opacity-80"
            />
          </div>
          <p className="text-center sm:text-right text-[11px] text-slate-500">
            © {new Date().getFullYear()} CampanhaUTM. Todos os direitos reservados. Plataforma de Taxonomia e Governança GA4.
          </p>
        </div>
      </footer>
    </div>
  )
}
