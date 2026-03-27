-- Fix security definer view - recreate as SECURITY INVOKER
DROP VIEW IF EXISTS public.course_creators_secure;
CREATE VIEW public.course_creators_secure
WITH (security_invoker = true)
AS
SELECT 
  id, email, name, phone, bio, avatar_url,
  cpf_cnpj, pix_key, pix_key_type,
  commission_percentage, is_active,
  asaas_customer_id, asaas_wallet_id, asaas_account_status,
  user_id, created_at, updated_at
FROM public.course_creators;