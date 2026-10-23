-- ==============================================================================
-- MIGRATION: 20261023123000_force_rls_for_owner.sql
-- OBJETIVO: Forçar RLS mesmo no SQL Editor (para donos de tabela e superuser)
-- ==============================================================================

ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.projects FORCE ROW LEVEL SECURITY;
ALTER TABLE public.utm_links FORCE ROW LEVEL SECURITY;
