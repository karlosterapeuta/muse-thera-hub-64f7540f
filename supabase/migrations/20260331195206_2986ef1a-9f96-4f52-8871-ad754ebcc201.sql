
-- 1. Fix course_creators_secure view - recreate excluding password_hash
-- The view already exists but has no RLS. Since it's SECURITY INVOKER, 
-- the underlying table's RLS applies. Let's verify it excludes password_hash.
DROP VIEW IF EXISTS public.course_creators_secure;
CREATE VIEW public.course_creators_secure WITH (security_invoker = true) AS
SELECT 
  id, name, email, phone, bio, avatar_url, 
  cpf_cnpj, pix_key, pix_key_type,
  commission_percentage, is_active,
  asaas_customer_id, asaas_wallet_id, asaas_account_status,
  user_id, created_at, updated_at
FROM public.course_creators;

-- 2. Fix course_creators UPDATE - restrict creators to safe fields only
-- Drop the existing permissive update policy
DROP POLICY IF EXISTS "Creators can update own data securely" ON public.course_creators;

-- Create a restrictive update policy using a trigger to prevent financial field modifications
-- Since RLS can't do column-level restrictions, use a trigger
CREATE OR REPLACE FUNCTION public.protect_creator_financial_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Check if the current user is an admin
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  ) INTO is_admin;
  
  -- If not admin, prevent changes to financial fields
  IF NOT is_admin THEN
    NEW.commission_percentage := OLD.commission_percentage;
    NEW.asaas_customer_id := OLD.asaas_customer_id;
    NEW.asaas_wallet_id := OLD.asaas_wallet_id;
    NEW.asaas_account_status := OLD.asaas_account_status;
    NEW.password_hash := OLD.password_hash;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_creator_financial_fields_trigger ON public.course_creators;
CREATE TRIGGER protect_creator_financial_fields_trigger
  BEFORE UPDATE ON public.course_creators
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_creator_financial_fields();

-- Recreate the creator update policy
CREATE POLICY "Creators can update own data securely"
ON public.course_creators
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 3. Fix avatars bucket - add ownership checks to UPDATE and DELETE
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);
