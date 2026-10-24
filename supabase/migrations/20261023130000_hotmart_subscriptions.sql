-- ==============================================================================
-- MIGRATION: 20261023130000_hotmart_subscriptions.sql
-- OBJETIVO: Integração Hotmart (Anexo B) - Assinaturas, Webhook & Auto-Provisioning
-- ==============================================================================

-- 1. Tabela para registrar pagamentos confirmados pela Hotmart
CREATE TABLE IF NOT EXISTS public.hotmart_subscriptions (
  email text PRIMARY KEY,
  plan text NOT NULL DEFAULT 'pro',
  status text NOT NULL DEFAULT 'active',
  hotmart_transaction text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilita RLS para segurança estrita
ALTER TABLE public.hotmart_subscriptions ENABLE ROW LEVEL SECURITY;

-- 2. Atualiza o gatilho de cadastro para atribuir o plano Pro se o e-mail já pagou na Hotmart
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  initial_plan text := 'free';
BEGIN
  -- Se o comprador pagou na Hotmart antes de criar a conta, ele já inicia no plano contratado
  SELECT plan INTO initial_plan
  FROM public.hotmart_subscriptions
  WHERE lower(email) = lower(NEW.email) AND status = 'active'
  LIMIT 1;

  IF initial_plan IS NULL THEN
    initial_plan := 'free';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, plan)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'full_name', '')), ''),
    initial_plan
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    plan = CASE WHEN profiles.plan = 'free' THEN EXCLUDED.plan ELSE profiles.plan END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Função RPC para processar aprovação de compra vinda do Webhook da Hotmart
CREATE OR REPLACE FUNCTION public.apply_hotmart_purchase(
  buyer_email text,
  target_plan text DEFAULT 'pro',
  transaction_id text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  affected_profiles int := 0;
BEGIN
  IF buyer_email IS NULL OR trim(buyer_email) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email obrigatorio');
  END IF;

  -- Registra ou atualiza a assinatura da Hotmart
  INSERT INTO public.hotmart_subscriptions (email, plan, status, hotmart_transaction, updated_at)
  VALUES (lower(trim(buyer_email)), target_plan, 'active', transaction_id, now())
  ON CONFLICT (email) DO UPDATE SET
    plan = EXCLUDED.plan,
    status = 'active',
    hotmart_transaction = COALESCE(EXCLUDED.hotmart_transaction, hotmart_subscriptions.hotmart_transaction),
    updated_at = now();

  -- Atualiza o perfil caso o usuário já possua conta criada
  UPDATE public.profiles
  SET plan = target_plan
  WHERE lower(email) = lower(trim(buyer_email));

  GET DIAGNOSTICS affected_profiles = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'email', lower(trim(buyer_email)),
    'plan', target_plan,
    'profile_updated', affected_profiles > 0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Função RPC para cancelamento de assinatura
CREATE OR REPLACE FUNCTION public.apply_hotmart_cancellation(
  buyer_email text
)
RETURNS jsonb AS $$
BEGIN
  IF buyer_email IS NULL OR trim(buyer_email) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email obrigatorio');
  END IF;

  UPDATE public.hotmart_subscriptions
  SET status = 'canceled', updated_at = now()
  WHERE lower(email) = lower(trim(buyer_email));

  UPDATE public.profiles
  SET plan = 'free'
  WHERE lower(email) = lower(trim(buyer_email));

  RETURN jsonb_build_object(
    'success', true,
    'email', lower(trim(buyer_email)),
    'status', 'canceled'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
