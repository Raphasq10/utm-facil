import type { User, Session } from '@supabase/supabase-js'
import { supabaseClient } from './client'

export interface RouteGuardResult {
  allowed: boolean
  redirectTo?: '/login' | '/verify-email' | '/app' | string
  reason?: 'unauthenticated' | 'unconfirmed_email' | 'authenticated_already'
}

export interface RouteGuardOptions {
  requireAuth?: boolean
  requireEmailConfirmed?: boolean
  guestOnly?: boolean
}

/**
 * Validador de Sessão e Renovação de Token (Middleware Layer).
 * Garante que a sessão JWT está ativa e não expirou.
 */
export async function getValidSession(): Promise<{
  session: Session | null
  user: User | null
}> {
  if (!supabaseClient) {
    return { session: null, user: null }
  }

  const { data, error } = await supabaseClient.auth.getSession()
  if (error || !data.session) {
    return { session: null, user: null }
  }

  // Se o token estiver prestes a expirar (menos de 60s), renova
  const expiresAt = data.session.expires_at ? data.session.expires_at * 1000 : 0
  const now = Date.now()
  if (expiresAt && expiresAt - now < 60000) {
    const { data: refreshData, error: refreshError } = await supabaseClient.auth.refreshSession()
    if (!refreshError && refreshData.session) {
      return { session: refreshData.session, user: refreshData.user }
    }
  }

  return { session: data.session, user: data.session.user }
}

/**
 * Verifica se o e-mail do usuário foi confirmado na autenticação do Supabase.
 */
export function isEmailConfirmed(user: User | null): boolean {
  if (!user) return false
  return Boolean(user.email_confirmed_at || user.confirmed_at)
}

/**
 * Middleware para proteção de rotas privadas e verificação de e-mail.
 */
export function protectRoute(
  path: string,
  user: User | null,
  options: RouteGuardOptions = { requireAuth: true, requireEmailConfirmed: true }
): RouteGuardResult {
  // 1. Se a página é exclusiva para convidados (login/signup) e o usuário já está logado
  if (options.guestOnly && user) {
    if (options.requireEmailConfirmed && !isEmailConfirmed(user)) {
      return {
        allowed: false,
        redirectTo: '/verify-email',
        reason: 'unconfirmed_email',
      }
    }
    return {
      allowed: false,
      redirectTo: '/app',
      reason: 'authenticated_already',
    }
  }

  // 2. Se a rota exige login e não há usuário autenticado
  if (options.requireAuth && !user) {
    return {
      allowed: false,
      redirectTo: '/login',
      reason: 'unauthenticated',
    }
  }

  // 3. Se a rota exige confirmação de e-mail e o usuário não confirmou
  if (options.requireAuth && options.requireEmailConfirmed && user && !isEmailConfirmed(user)) {
    if (path !== '/verify-email') {
      return {
        allowed: false,
        redirectTo: '/verify-email',
        reason: 'unconfirmed_email',
      }
    }
  }

  return { allowed: true }
}
