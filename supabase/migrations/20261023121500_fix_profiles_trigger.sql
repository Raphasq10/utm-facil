-- ==============================================================================
-- MIGRATION: 20261023121500_fix_profiles_trigger.sql
-- OBJETIVO: Permitir full_name nulo/vazio quando usuário for criado via Dashboard
-- ==============================================================================

-- 1. Ajusta a constraint para aceitar entre 0 e 100 caracteres (ou NULL)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_full_name_length_check;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_full_name_length_check
  CHECK (full_name IS NULL OR char_length(full_name) BETWEEN 0 AND 100);

-- 2. Atualiza a função trigger para inserir NULL quando o nome não for informado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, plan)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'full_name', '')), ''),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
