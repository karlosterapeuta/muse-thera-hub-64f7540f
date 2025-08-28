-- Fix insecure RLS on VerificationToken: deny all client access
ALTER TABLE public."VerificationToken" ENABLE ROW LEVEL SECURITY;

-- Drop overly-permissive policy
DROP POLICY IF EXISTS "Users can only access their own verification tokens" ON public."VerificationToken";

-- Deny all access by default (explicit)
CREATE POLICY "No client access to verification tokens"
ON public."VerificationToken"
FOR ALL
USING (false)
WITH CHECK (false);
