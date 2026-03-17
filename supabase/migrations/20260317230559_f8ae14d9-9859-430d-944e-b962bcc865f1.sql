
-- FIX 1: course_purchases - creators can see ALL purchases, not just their own
DROP POLICY IF EXISTS "Creators can view their course purchases" ON public.course_purchases;
CREATE POLICY "Creators can view their course purchases"
  ON public.course_purchases
  FOR SELECT
  TO public
  USING (creator_id IN (SELECT id FROM course_creators WHERE user_id = auth.uid()));

-- FIX 2: invite_codes - remove anon role from code enumeration policy
DROP POLICY IF EXISTS "Anyone can check if an invite code is valid" ON public.invite_codes;
CREATE POLICY "Authenticated users can check if an invite code is valid"
  ON public.invite_codes
  FOR SELECT
  TO authenticated
  USING ((status = 'unused'::invite_code_status) AND (expires_at > now()));

-- FIX 3: profiles - restrict user self-update to safe columns only
-- Revoke blanket UPDATE and grant only safe columns
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (name, avatar_url) ON public.profiles TO authenticated;

-- Replace overly permissive update policies with column-restricted ones
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;

CREATE POLICY "Users can update own safe profile fields"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
