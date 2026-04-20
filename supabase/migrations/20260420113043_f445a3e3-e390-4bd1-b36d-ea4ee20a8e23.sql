-- Allow public read access to digital-signatures bucket so signature/stamp images embedded in PDFs and previews load correctly
CREATE POLICY "Public can view digital signatures"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'digital-signatures');

-- Mark bucket as public so getPublicUrl returns a working URL
UPDATE storage.buckets SET public = true WHERE id = 'digital-signatures';