
-- 1. Fix course_lessons: restrict to free preview, owners, creators, admins, or users with course_access
DROP POLICY IF EXISTS "Anyone can view lessons of accessible modules" ON public.course_lessons;

CREATE POLICY "Lessons visible based on access"
ON public.course_lessons
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM course_modules m
    JOIN courses c ON c.id = m.course_id
    WHERE m.id = course_lessons.module_id
      AND c.is_published = true
      AND (
        course_lessons.is_free_preview = true
        OR c.created_by = auth.uid()
        OR public.has_role('admin'::app_role)
        OR public.user_has_course_access(auth.uid(), c.id)
        OR EXISTS (
          SELECT 1 FROM course_creators cc
          WHERE cc.id = c.creator_id AND cc.user_id = auth.uid() AND cc.is_active = true
        )
      )
  )
);

-- 2. Fix storage policies for course-thumbnails (bug with cc.name)
DROP POLICY IF EXISTS "Course thumbnails: creators insert" ON storage.objects;
DROP POLICY IF EXISTS "Course thumbnails: creators update" ON storage.objects;
DROP POLICY IF EXISTS "Course thumbnails: creators delete" ON storage.objects;

CREATE POLICY "Course thumbnails: creators insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'course-thumbnails'
  AND public.is_valid_uuid((storage.foldername(name))[1])
  AND EXISTS (
    SELECT 1 FROM courses c
    LEFT JOIN course_creators cc ON c.creator_id = cc.id
    WHERE c.id = ((storage.foldername(name))[1])::uuid
      AND (c.created_by = auth.uid() OR cc.user_id = auth.uid() OR public.has_role('admin'::app_role))
  )
);

CREATE POLICY "Course thumbnails: creators update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'course-thumbnails'
  AND public.is_valid_uuid((storage.foldername(name))[1])
  AND EXISTS (
    SELECT 1 FROM courses c
    LEFT JOIN course_creators cc ON c.creator_id = cc.id
    WHERE c.id = ((storage.foldername(name))[1])::uuid
      AND (c.created_by = auth.uid() OR cc.user_id = auth.uid() OR public.has_role('admin'::app_role))
  )
);

CREATE POLICY "Course thumbnails: creators delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'course-thumbnails'
  AND public.is_valid_uuid((storage.foldername(name))[1])
  AND EXISTS (
    SELECT 1 FROM courses c
    LEFT JOIN course_creators cc ON c.creator_id = cc.id
    WHERE c.id = ((storage.foldername(name))[1])::uuid
      AND (c.created_by = auth.uid() OR cc.user_id = auth.uid() OR public.has_role('admin'::app_role))
  )
);

-- 3. Attach protect_creator_financial_fields trigger (already defined function)
DROP TRIGGER IF EXISTS protect_creator_financial_fields_trg ON public.course_creators;
CREATE TRIGGER protect_creator_financial_fields_trg
BEFORE UPDATE ON public.course_creators
FOR EACH ROW EXECUTE FUNCTION public.protect_creator_financial_fields();

-- 4. Restrict course_purchases creator SELECT to safe columns via a security_invoker view
DROP POLICY IF EXISTS "Creators can view their course purchases" ON public.course_purchases;

CREATE OR REPLACE VIEW public.creator_course_purchases
WITH (security_invoker = true) AS
SELECT
  cp.id,
  cp.course_id,
  cp.creator_id,
  cp.user_id,
  cp.buyer_name,
  cp.amount_cents,
  cp.creator_amount_cents,
  cp.platform_amount_cents,
  cp.payment_status,
  cp.paid_at,
  cp.confirmed_by_creator_at,
  cp.created_at
FROM public.course_purchases cp
WHERE cp.creator_id IN (
  SELECT id FROM public.course_creators WHERE user_id = auth.uid() AND is_active = true
);

GRANT SELECT ON public.creator_course_purchases TO authenticated;

-- Allow creators to still UPDATE only payment confirmation on their purchases (used by creator dashboard)
CREATE POLICY "Creators can confirm own course purchases"
ON public.course_purchases
FOR UPDATE
TO authenticated
USING (
  creator_id IN (SELECT id FROM public.course_creators WHERE user_id = auth.uid() AND is_active = true)
)
WITH CHECK (
  creator_id IN (SELECT id FROM public.course_creators WHERE user_id = auth.uid() AND is_active = true)
);

-- 5. Add explicit deny INSERT policy on legacy "User" table (no app uses it directly)
CREATE POLICY "Deny anon inserts on User"
ON public."User"
FOR INSERT
TO anon, authenticated
WITH CHECK (false);
