
-- Fix user_activity_logs INSERT policy - ensure it works for both public and authenticated roles
DROP POLICY IF EXISTS "Authenticated users can insert own activity logs" ON public.user_activity_logs;
CREATE POLICY "Authenticated users can insert own activity logs"
ON public.user_activity_logs
FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

-- Ensure profiles SELECT works reliably for both role types
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO public
USING (auth.uid() = id);
