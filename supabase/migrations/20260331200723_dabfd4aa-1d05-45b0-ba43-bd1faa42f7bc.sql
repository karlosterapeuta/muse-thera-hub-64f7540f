
-- Fix digital-signatures bucket: make private and remove broad access
UPDATE storage.buckets SET public = false WHERE id = 'digital-signatures';

-- Remove overly permissive SELECT policy
DROP POLICY IF EXISTS "Allow public access to digital signatures" ON storage.objects;

-- Ensure ownership-based policies exist
DROP POLICY IF EXISTS "Users can view their own digital signatures" ON storage.objects;
CREATE POLICY "Users can view their own digital signatures"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'digital-signatures' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can upload their own digital signatures" ON storage.objects;
CREATE POLICY "Users can upload their own digital signatures"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'digital-signatures' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their own digital signatures" ON storage.objects;
CREATE POLICY "Users can update their own digital signatures"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'digital-signatures' AND (auth.uid())::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own digital signatures" ON storage.objects;
CREATE POLICY "Users can delete their own digital signatures"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'digital-signatures' AND (auth.uid())::text = (storage.foldername(name))[1]);
