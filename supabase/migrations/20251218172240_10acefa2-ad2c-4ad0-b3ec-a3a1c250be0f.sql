-- Criar bucket para thumbnails de cursos
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-thumbnails', 'course-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Usuários autenticados podem fazer upload
CREATE POLICY "Authenticated users can upload course thumbnails"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-thumbnails');

-- Policy: Qualquer um pode ver thumbnails (público)
CREATE POLICY "Public can view course thumbnails"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'course-thumbnails');

-- Policy: Usuários podem deletar suas próprias thumbnails
CREATE POLICY "Users can delete own course thumbnails"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'course-thumbnails');

-- Policy: Usuários podem atualizar suas próprias thumbnails
CREATE POLICY "Users can update own course thumbnails"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'course-thumbnails');