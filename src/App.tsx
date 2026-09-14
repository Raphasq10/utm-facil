import { Link2, Sparkles, CheckCircle2 } from 'lucide-react'

export function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-2">
          <Link2 className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Setup Concluído com Sucesso
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gerador de Links UTM
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Itaipu Parquetec — Comunicação & Marketing
          </p>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
          Ambiente local configurado com <strong>Vite</strong>, <strong>React</strong>, <strong>TypeScript</strong>, <strong>Tailwind CSS</strong> e <strong>Lucide Icons</strong>. Pronto para o desenvolvimento da Interface (Etapa 4).
        </p>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Etapa 3 de 8 concluída com sucesso</span>
        </div>
      </div>
    </main>
  )
}

export default App
