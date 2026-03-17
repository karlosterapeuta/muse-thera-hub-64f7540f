
-- Fix course_creators RLS: remove overly permissive policies
DROP POLICY IF EXISTS "Creators can view own data" ON public.course_creators;
DROP POLICY IF EXISTS "Creators can update own data" ON public.course_creators;
DROP POLICY IF EXISTS "Creators can delete own account" ON public.course_creators;

-- Restrict SELECT: creators can only see their own data, admins can see all
CREATE POLICY "Creators can view own data securely"
ON public.course_creators
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR has_role('admin'::app_role));

-- Allow anon/public to see only non-sensitive fields via a limited policy
-- (needed for course display - but we'll create a view instead)

-- Fix UPDATE: creators can only update their own data  
CREATE POLICY "Creators can update own data securely"
ON public.course_creators
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Fix DELETE: creators can only delete their own account
CREATE POLICY "Creators can delete own account securely"
ON public.course_creators
FOR DELETE
TO authenticated
USING (user_id = auth.uid());
