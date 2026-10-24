import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react'

export type LegalDocType = 'terms' | 'privacy'

interface LegalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDoc?: LegalDocType
}

export const LegalModal: React.FC<LegalModalProps> = ({
  open,
  onOpenChange,
  initialDoc = 'terms',
}) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialDoc)

  // Sincroniza se a prop mudar
  React.useEffect(() => {
    if (initialDoc) {
      setActiveDoc(initialDoc)
    }
  }, [initialDoc])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-slate-950 text-slate-100 border border-slate-800 shadow-2xl p-6 sm:p-8 rounded-2xl">
        <DialogHeader className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              {activeDoc === 'terms' ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </span>
            <DialogTitle className="text-xl font-bold text-white tracking-tight">
              {activeDoc === 'terms' ? 'Termos de Uso e Serviço' : 'Política de Privacidade e Proteção de Dados (LGPD)'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-400">
            CampanhaUTM — Plataforma de Taxonomia GA4 & Governança de Links de Performance.
            Última atualização: {new Date().toLocaleDateString('pt-BR')}.
          </DialogDescription>

          {/* Abas de Navegação entre Documentos */}
          <div className="flex items-center gap-2 pt-3">
            <button
              type="button"
              onClick={() => setActiveDoc('terms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeDoc === 'terms'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              Termos de Uso
            </button>
            <button
              type="button"
              onClick={() => setActiveDoc('privacy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeDoc === 'privacy'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              Política de Privacidade (LGPD)
            </button>
          </div>
        </DialogHeader>

        {/* Conteúdo com rolagem suave */}
        <div className="max-h-[60vh] overflow-y-auto pr-3 space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          {activeDoc === 'terms' ? (
            <>
              <section className="space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1. Aceitação e Objeto
                </h4>
                <p>
                  Bem-vindo ao <strong>CampanhaUTM</strong> (disponível em <code className="text-emerald-400 font-mono">campanhautm.com.br</code> e aplicações associadas). Ao criar uma conta, utilizar nossos geradores ou assinar qualquer plano pago, você concorda expressa e integralmente com estes Termos de Uso. Caso discorde de qualquer cláusula, solicitamos a interrupção imediata do uso da plataforma.
                </p>
                <p>
                  O CampanhaUTM é uma plataforma SaaS (Software as a Service) voltada para agências de marketing, gestores de tráfego e e-commerces, oferecendo padronização de taxonomia, higienização de URLs segundo as diretrizes oficiais do Google Analytics 4 (GA4), isolamento de dados por projeto e governança de links de campanhas digitais.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  2. Contas de Usuário e Segurança
                </h4>
                <p>
                  Para acessar recursos da plataforma, o usuário deve se cadastrar fornecendo endereço de e-mail válido e senha segura. O usuário é o único responsável pela guarda e confidencialidade de suas credenciais de acesso. Cada conta é de uso pessoal e intransferível no plano contratado. Notifique imediatamente nosso suporte em caso de suspeita de uso não autorizado.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  3. Planos, Cobrança e Renovação Recorrente
                </h4>
                <p>
                  O CampanhaUTM é disponibilizado sob diferentes modalidades:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
                  <li><strong>Plano Free:</strong> Gratuito por tempo indeterminado, limitado a 1 projeto e 25 links rastreáveis ativos.</li>
                  <li><strong>Plano Pro:</strong> R$ 47,00/mês, incluindo até 10 projetos simultâneos, links UTM ilimitados e exportação de Guia HTML offline.</li>
                  <li><strong>Plano Agency:</strong> Destinado a operações em escala, sujeito à disponibilidade e termos adicionais.</li>
                </ul>
                <p>
                  Os pagamentos são processados com total segurança e criptografia de ponta a ponta pela plataforma <strong>Hotmart</strong> (HotPay, certificação PCI-DSS nível 1), aceitando Cartão de Crédito Nacional e Internacional e Pix. A assinatura do Plano Pro é renovada automaticamente todo mês na data da contratação, salvo cancelamento prévio pelo usuário.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  4. Direito de Arrependimento e Cancelamento
                </h4>
                <p>
                  Em total conformidade com o <strong>Art. 49 do Código de Defesa do Consumidor (Lei 8.078/1990)</strong>, o comprador tem direito à garantia incondicional de reembolso integral no prazo de <strong>7 (sete) dias corridos</strong> a contar da primeira contratação, solicitável diretamente pelo painel da Hotmart ou pelo nosso canal de atendimento.
                </p>
                <p>
                  Após esse prazo, o usuário pode cancelar a renovação da assinatura a qualquer momento, sem multa ou fidelidade contratual, mantendo o acesso aos recursos Pro até o término do ciclo mensal já pago.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  5. Uso Aceitável e Vedações
                </h4>
                <p>
                  O usuário compromete-se a utilizar a ferramenta exclusivamente para fins lícitos de marketing e análise. É terminantemente proibido utilizar o CampanhaUTM para criar ou mascarar URLs destinadas a distribuição de malware, phishing, spam, fraudes eletrônicas ou violação de direitos autorais de terceiros, sob pena de bloqueio imediato sem reembolso.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  6. Propriedade Intelectual e Suporte
                </h4>
                <p>
                  Todo o design, interface, logotipos, algoritmos de higienização e códigos-fonte da plataforma são propriedade exclusiva do CampanhaUTM. O suporte técnico é prestado de forma prioritária via e-mail para assinantes Pro e canais oficiais disponíveis.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  1. Nosso Compromisso com a LGPD
                </h4>
                <p>
                  A presente Política de Privacidade foi elaborada em estrita conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais do Brasil (Lei nº 13.709/2018 - LGPD)</strong> e o Marco Civil da Internet (Lei nº 12.965/2014). Tratamos seus dados com seriedade, transparência e medidas técnicas de segurança de alto padrão.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  2. Dados Pessoais Coletados e Finalidade
                </h4>
                <p>Coletamos estritamente os dados necessários para o funcionamento e faturamento do serviço:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
                  <li><strong>Dados Cadastrais:</strong> Nome completo e endereço de e-mail para autenticação de acesso e comunicação operacional.</li>
                  <li><strong>Dados de Pagamento:</strong> O CampanhaUTM <strong>não coleta nem armazena números de cartões de crédito</strong>. Todas as transações financeiras são processadas de forma isolada e segura pelo gateway da <strong>Hotmart</strong>. Recebemos apenas a confirmação do pagamento e identificador da assinatura para liberação do plano Pro.</li>
                  <li><strong>Dados de Campanhas:</strong> Nomes de projetos e parâmetros de links (ex: origem, mídia, campanha) inseridos voluntariamente para organização interna do usuário.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  3. Segurança, Criptografia e Isolamento (RLS)
                </h4>
                <p>
                  Adotamos infraestrutura de nível corporativo via <strong>Supabase Cloud</strong> com políticas ativas de <strong>Row Level Security (RLS)</strong> forçadas em banco de dados. Isso garante que nenhum usuário tenha acesso aos dados, links ou projetos de outro usuário. Todo o tráfego é criptografado via protocolo HTTPS/TLS 1.3 de ponta a ponta.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  4. Compartilhamento de Dados
                </h4>
                <p>
                  O CampanhaUTM não comercializa, aluga ou compartilha suas informações pessoais com terceiros para fins de marketing. O compartilhamento ocorre unicamente com prestadores de infraestrutura essencial (ex: Supabase para banco de dados e Hotmart para cobrança) e quando exigido por ordem judicial nos termos da legislação brasileira.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  5. Seus Direitos como Titular (Art. 18 da LGPD)
                </h4>
                <p>Você possui o direito a qualquer momento de:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
                  <li>Confirmar a existência de tratamento e acessar seus dados pessoais;</li>
                  <li>Corrigir dados incompletos ou desatualizados;</li>
                  <li>Solicitar a portabilidade ou a exclusão definitiva dos seus dados e histórico de links;</li>
                  <li>Revogar o consentimento para envio de comunicações institucionais.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  6. Contato com o Encarregado de Dados (DPO)
                </h4>
                <p>
                  Para exercer seus direitos de titular ou esclarecer qualquer dúvida sobre o tratamento de dados pessoais, entre em contato diretamente com nossa equipe de suporte pelo e-mail: <strong className="text-emerald-400">suporte@campanhautm.com.br</strong>.
                </p>
              </section>
            </>
          )}
        </div>

        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            CampanhaUTM © {new Date().getFullYear()} — Todos os direitos reservados.
          </span>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2 cursor-pointer shadow-md"
          >
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
