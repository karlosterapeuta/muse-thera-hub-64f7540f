UPDATE storage.buckets SET public = true WHERE id = 'digital-signatures';

DROP POLICY IF EXISTS "Public can view digital signatures" ON storage.objects;
CREATE POLICY "Public can view digital signatures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'digital-signatures');