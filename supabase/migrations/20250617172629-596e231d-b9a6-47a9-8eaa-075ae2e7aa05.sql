
-- Create storage bucket for professional avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('professional-avatars', 'professional-avatars', true);

-- Create policy to allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'professional-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'professional-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'professional-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow public access to view avatars
CREATE POLICY "Public can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'professional-avatars');

-- Add license_number column to professionals table if it doesn't exist
ALTER TABLE professionals 
ADD COLUMN IF NOT EXISTS license_number text;
