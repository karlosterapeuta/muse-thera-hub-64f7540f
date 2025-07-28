-- Criar bucket para armazenar assinaturas digitais
INSERT INTO storage.buckets (id, name, public) 
VALUES ('digital-signatures', 'digital-signatures', true);

-- Criar políticas para o bucket de assinaturas digitais
CREATE POLICY "Allow public access to digital signatures" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'digital-signatures');

CREATE POLICY "Allow authenticated users to upload digital signatures" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'digital-signatures' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own digital signatures" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'digital-signatures' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to delete their own digital signatures" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'digital-signatures' AND auth.role() = 'authenticated');