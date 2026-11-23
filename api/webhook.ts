import { createClient } from '@supabase/supabase-js'

// Inicializa cliente Supabase para execução no backend da Vercel
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wfewtbmxupftgunmeesr.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZXd0Ym14dXBmdGd1bm1lZXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MjU1MDUsImV4cCI6MjEwODMwMTUwNX0.WpKu1mJWhNRx3IWH9tglYXn4t7YHsMAWP5Cp_gttsD8'

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: any, res: any) {
  // Configura CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Hotmart-Hottok')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Health-check básico via GET
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      service: 'CampanhaUTM Hotmart Webhook Receiver',
      timestamp: new Date().toISOString(),
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = req.body || {}
    console.log('[Hotmart Webhook] Payload recebido:', JSON.stringify(payload))

    // Hotmart pode enviar como formato de URL encoded ou JSON
    const body = typeof payload === 'string' ? JSON.parse(payload) : payload

    // Validação opcional de segurança do Hottok (se configurado na Vercel)
    const expectedToken = process.env.HOTMART_WEBHOOK_TOKEN
    if (expectedToken) {
      const receivedToken =
        req.headers?.['x-hotmart-hottok'] ||
        req.headers?.['X-Hotmart-Hottok'] ||
        body.hottok ||
        ''
      if (receivedToken !== expectedToken) {
        console.warn('[Hotmart Webhook] Token hottok inválido ou ausente.')
        return res.status(401).json({ error: 'Unauthorized webhook token' })
      }
    }

    const rawEvent = body.event || body.status || ''
    const event = String(rawEvent).trim().toUpperCase()

    // Hotmart v2 envia data.buyer.email em compras e data.subscriber.email em cancelamentos de assinatura
    const buyerEmail =
      body.data?.buyer?.email ||
      body.data?.subscriber?.email ||
      body.buyer?.email ||
      body.subscriber?.email ||
      body.email ||
      ''

    const transactionId =
      body.data?.purchase?.transaction ||
      body.data?.subscription?.subscriber?.code ||
      body.transaction ||
      body.data?.purchase?.order_date ||
      ''

    if (!buyerEmail) {
      console.warn('[Hotmart Webhook] Requisição sem e-mail do comprador/assinante.')
      return res.status(400).json({ error: 'E-mail do comprador não encontrado no payload' })
    }

    const cleanEmail = String(buyerEmail).trim().toLowerCase()

    // 1. Eventos de Compra Aprovada / Concluída
    const APPROVAL_EVENTS = new Set([
      'PURCHASE_APPROVED',
      'PURCHASE_COMPLETE',
      'APPROVED',
      'COMPLETE',
    ])

    if (APPROVAL_EVENTS.has(event)) {
      console.log(`[Hotmart Webhook] Ativando Plano Pro para: ${cleanEmail} (evento: ${event})`)

      const { data, error } = await supabase.rpc('apply_hotmart_purchase', {
        buyer_email: cleanEmail,
        target_plan: 'pro',
        transaction_id: String(transactionId),
      })

      if (error) {
        console.error('[Hotmart Webhook] Erro ao aplicar compra no Supabase:', error)
        return res.status(500).json({ error: error.message })
      }

      return res.status(200).json({
        success: true,
        message: `Plano Pro ativado com sucesso para ${cleanEmail}`,
        data,
      })
    }

    // 2. Eventos de Cancelamento de Assinatura / Expiração / Reembolso / Chargeback
    const CANCELLATION_EVENTS = new Set([
      'SUBSCRIPTION_CANCELLATION',
      'SUBSCRIPTION_EXPIRED',
      'PURCHASE_REFUNDED',
      'PURCHASE_CHARGEBACK',
      'PURCHASE_CANCELED',
      'PURCHASE_PROTEST',
      'CANCELED',
      'REFUNDED',
      'CHARGEBACK',
      'EXPIRED',
    ])

    if (CANCELLATION_EVENTS.has(event)) {
      console.log(`[Hotmart Webhook] Cancelando assinatura para: ${cleanEmail} (evento: ${event})`)

      const { data, error } = await supabase.rpc('apply_hotmart_cancellation', {
        buyer_email: cleanEmail,
      })

      if (error) {
        console.error('[Hotmart Webhook] Erro ao aplicar cancelamento no Supabase:', error)
        return res.status(500).json({ error: error.message })
      }

      return res.status(200).json({
        success: true,
        message: `Assinatura cancelada para ${cleanEmail}`,
        data,
      })
    }

    // Outros eventos informativos (ex: carrinho abandonado, boleto gerado)
    console.log(`[Hotmart Webhook] Evento ignorado ou não acionável: ${event}`)
    return res.status(200).json({
      received: true,
      event,
      note: 'Evento não requer alteração de plano',
    })
  } catch (err: any) {
    console.error('[Hotmart Webhook] Erro inesperado ao processar requisição:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
