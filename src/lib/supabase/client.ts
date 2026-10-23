import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://sua-url-aqui.supabase.co'
)

/**
 * Cliente Supabase para uso no Navegador (Client-Side).
 * Utiliza a chave pública (anon key) e ativa renovação automática de token JWT.
 */
export const supabaseClient: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error(
      '[Supabase Client] As credenciais VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não estão configuradas no .env.'
    )
  }
  return supabaseClient
}
