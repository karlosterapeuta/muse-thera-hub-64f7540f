
-- Create storage bucket for clinical PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('clinical-pdfs', 'clinical-pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- RLS: Professionals can upload their own PDFs
CREATE POLICY "Users can upload own PDFs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'clinical-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS: Professionals can view their own PDFs
CREATE POLICY "Users can view own PDFs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'clinical-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS: Professionals can delete their own PDFs
CREATE POLICY "Users can delete own PDFs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'clinical-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);
