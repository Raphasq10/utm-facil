-- ==============================================================================
-- SCHEMA COMPLETO — CampanhaUTM (Multi-Tenancy & RLS)
-- ==============================================================================

-- 0. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT profiles_email_length_check CHECK (char_length(email) BETWEEN 3 AND 255),
  CONSTRAINT profiles_full_name_length_check CHECK (full_name IS NULL OR char_length(full_name) BETWEEN 1 AND 100),
  CONSTRAINT profiles_avatar_url_length_check CHECK (avatar_url IS NULL OR char_length(avatar_url) BETWEEN 1 AND 1000),
  CONSTRAINT profiles_plan_valid_check CHECK (plan IN ('free', 'pro', 'agency'))
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Tabela projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT projects_name_length_check CHECK (char_length(name) BETWEEN 1 AND 100),
  CONSTRAINT projects_description_length_check CHECK (description IS NULL OR char_length(description) BETWEEN 0 AND 1000)
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_created ON public.projects(user_id, created_at DESC);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own_projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Tabela utm_links
CREATE TABLE IF NOT EXISTS public.utm_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  utm_source TEXT NOT NULL,
  utm_medium TEXT NOT NULL,
  utm_campaign TEXT NOT NULL,
  utm_term TEXT,
  utm_content TEXT,
  final_url TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT utm_links_original_url_length_check CHECK (char_length(original_url) BETWEEN 5 AND 2000),
  CONSTRAINT utm_links_utm_source_length_check CHECK (char_length(utm_source) BETWEEN 1 AND 100),
  CONSTRAINT utm_links_utm_medium_length_check CHECK (char_length(utm_medium) BETWEEN 1 AND 100),
  CONSTRAINT utm_links_utm_campaign_length_check CHECK (char_length(utm_campaign) BETWEEN 1 AND 150),
  CONSTRAINT utm_links_utm_term_length_check CHECK (utm_term IS NULL OR char_length(utm_term) BETWEEN 0 AND 100),
  CONSTRAINT utm_links_utm_content_length_check CHECK (utm_content IS NULL OR char_length(utm_content) BETWEEN 0 AND 100),
  CONSTRAINT utm_links_final_url_length_check CHECK (char_length(final_url) BETWEEN 5 AND 4000),
  CONSTRAINT utm_links_label_length_check CHECK (label IS NULL OR char_length(label) BETWEEN 0 AND 255)
);

CREATE INDEX IF NOT EXISTS idx_utm_links_user_id ON public.utm_links(user_id);
CREATE INDEX IF NOT EXISTS idx_utm_links_project_id ON public.utm_links(project_id);
CREATE INDEX IF NOT EXISTS idx_utm_links_user_project ON public.utm_links(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_utm_links_created ON public.utm_links(project_id, created_at DESC);

ALTER TABLE public.utm_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_utm_links" ON public.utm_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_utm_links" ON public.utm_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_utm_links" ON public.utm_links
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own_utm_links" ON public.utm_links
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER trg_utm_links_updated_at
  BEFORE UPDATE ON public.utm_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Verificação de RLS
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false;
