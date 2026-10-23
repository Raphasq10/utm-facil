import { createClient, type SupabaseClient } from '@supabase/supabase-js'

declare const process: { env: Record<string, string | undefined> } | undefined

// Suporte para execução em ambiente Node.js / Edge runtime
const env = typeof process !== 'undefined' && process?.env ? process.env : {}

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  env.SUPABASE_URL ||
  ''

// Service Role Key (SECRETA - Nunca deve ser exposta no navegador)
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  env.SUPABASE_ANON_KEY ||
  ''

/**
 * Cliente Supabase para uso em ambiente de Servidor / Edge / Scripts de Backend.
 * - Desativa autoRefreshToken e persistência de sessão (stateless por requisição).
 * - Quando executado em backend real com a chave service_role, ganha acesso total de administração.
 */
export function createServerSupabaseClient(options?: {
  useServiceRole?: boolean
  customHeaders?: Record<string, string>
}): SupabaseClient {
  const key =
    options?.useServiceRole && supabaseServiceRoleKey
      ? supabaseServiceRoleKey
      : supabaseAnonKey

  if (!supabaseUrl || !key) {
    throw new Error(
      '[Supabase Server] Credenciais do servidor Supabase não configuradas no ambiente.'
    )
  }

  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: options?.customHeaders || {},
    },
  })
}
