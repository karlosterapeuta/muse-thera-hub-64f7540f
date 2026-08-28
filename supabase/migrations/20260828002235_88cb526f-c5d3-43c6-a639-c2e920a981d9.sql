-- 1) Patients: remove blanket access to orphaned records
DROP POLICY IF EXISTS "Users can manage orphaned patients" ON public.patients;

-- 2) Course views: prevent spoofing another user's id
DROP POLICY IF EXISTS "Anyone can insert course views" ON public.course_views;
CREATE POLICY "Insert own course views"
ON public.course_views
FOR INSERT
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- 3) Reviews: cannot self-approve on insert
DROP POLICY IF EXISTS "Anyone can create a review" ON public.reviews;
CREATE POLICY "Anyone can create a pending review"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (rating >= 1 AND rating <= 5 AND is_approved = false);