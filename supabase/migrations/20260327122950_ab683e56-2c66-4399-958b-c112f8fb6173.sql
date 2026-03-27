-- Fix 1: Create a secure view that excludes password_hash from course_creators
CREATE OR REPLACE VIEW public.course_creators_secure AS
SELECT 
  id, email, name, phone, bio, avatar_url,
  cpf_cnpj, pix_key, pix_key_type,
  commission_percentage, is_active,
  asaas_customer_id, asaas_wallet_id, asaas_account_status,
  user_id, created_at, updated_at
FROM public.course_creators;

-- Fix 2: Restrict course_purchases INSERT to prevent buyers from setting sensitive financial fields
DROP POLICY IF EXISTS "System can insert purchases" ON public.course_purchases;
DROP POLICY IF EXISTS "Buyers can create purchases" ON public.course_purchases;
DROP POLICY IF EXISTS "Users can create purchases" ON public.course_purchases;

CREATE POLICY "Users can create own purchases"
ON public.course_purchases
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (payment_status IS NULL OR payment_status = 'pending')
);