
-- 1) notification_logs INSERT restricted to own user_id
DROP POLICY IF EXISTS "System can insert notification logs" ON public.notification_logs;
CREATE POLICY "Users can insert own notification logs"
ON public.notification_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 2) avatars bucket: restrict writes to own folder
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: users insert own folder" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: users update own folder" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: users delete own folder" ON storage.objects;

CREATE POLICY "Avatars: users insert own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatars: users update own folder"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatars: users delete own folder"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3) course-thumbnails: restrict writes to course owner
DROP POLICY IF EXISTS "Course thumbnails: creators insert" ON storage.objects;
DROP POLICY IF EXISTS "Course thumbnails: creators update" ON storage.objects;
DROP POLICY IF EXISTS "Course thumbnails: creators delete" ON storage.objects;

CREATE POLICY "Course thumbnails: creators insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'course-thumbnails'
  AND public.is_valid_uuid((storage.foldername(name))[1])
  AND EXISTS (
    SELECT 1 FROM public.courses c
    LEFT JOIN public.course_creators cc ON c.creator_id = cc.id
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
    SELECT 1 FROM public.courses c
    LEFT JOIN public.course_creators cc ON c.creator_id = cc.id
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
    SELECT 1 FROM public.courses c
    LEFT JOIN public.course_creators cc ON c.creator_id = cc.id
    WHERE c.id = ((storage.foldername(name))[1])::uuid
      AND (c.created_by = auth.uid() OR cc.user_id = auth.uid() OR public.has_role('admin'::app_role))
  )
);

-- 4) report-logos: restrict to own folder
DROP POLICY IF EXISTS "Report logos: users insert own folder" ON storage.objects;
DROP POLICY IF EXISTS "Report logos: users update own folder" ON storage.objects;
DROP POLICY IF EXISTS "Report logos: users delete own folder" ON storage.objects;

CREATE POLICY "Report logos: users insert own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'report-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Report logos: users update own folder"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'report-logos' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'report-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Report logos: users delete own folder"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'report-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5) is_valid_uuid: set search_path
CREATE OR REPLACE FUNCTION public.is_valid_uuid(input_text text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $function$
BEGIN
    PERFORM input_text::uuid;
    RETURN true;
EXCEPTION WHEN invalid_text_representation THEN
    RETURN false;
END;
$function$;
