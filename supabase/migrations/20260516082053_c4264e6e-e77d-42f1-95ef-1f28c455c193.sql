
CREATE POLICY "Admins can view all course purchases"
ON public.course_purchases
FOR SELECT
TO authenticated
USING (public.has_role('admin'::app_role));
