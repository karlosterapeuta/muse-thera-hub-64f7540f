
-- Fix course_access: replace overly permissive "System can manage course access" 
DROP POLICY IF EXISTS "System can manage course access" ON public.course_access;

-- Allow service role (edge functions) to manage, but not anon/public
-- Users can only view their own access
CREATE POLICY "Authenticated users can view own access"
ON public.course_access
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can insert/update/delete course access
CREATE POLICY "Admins can manage course access"
ON public.course_access
FOR ALL
TO authenticated
USING (has_role('admin'::app_role))
WITH CHECK (has_role('admin'::app_role));

-- Fix course_purchases: replace overly permissive insert/update
DROP POLICY IF EXISTS "System can insert purchases" ON public.course_purchases;
DROP POLICY IF EXISTS "System can update purchases" ON public.course_purchases;

-- Users can insert their own purchases
CREATE POLICY "Users can insert own purchases"
ON public.course_purchases
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only admins can update purchases (webhooks use service role)
CREATE POLICY "Admins can update purchases"
ON public.course_purchases
FOR UPDATE
TO authenticated
USING (has_role('admin'::app_role));

-- Fix course_creators INSERT: restrict registration
DROP POLICY IF EXISTS "Anyone can register as creator" ON public.course_creators;

CREATE POLICY "Authenticated users can register as creator"
ON public.course_creators
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());
