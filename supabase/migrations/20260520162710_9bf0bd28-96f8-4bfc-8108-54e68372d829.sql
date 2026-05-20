-- Add column to link receipts to original payment proof file
ALTER TABLE public.payment_receipts
ADD COLUMN IF NOT EXISTS payment_proof_path TEXT;

-- Storage policies for payment-proofs bucket (private, scoped to user folder)
DROP POLICY IF EXISTS "Users can read own payment proofs" ON storage.objects;
CREATE POLICY "Users can read own payment proofs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'payment-proofs' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can upload own payment proofs" ON storage.objects;
CREATE POLICY "Users can upload own payment proofs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'payment-proofs' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own payment proofs" ON storage.objects;
CREATE POLICY "Users can delete own payment proofs"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'payment-proofs' AND (storage.foldername(name))[1] = auth.uid()::text);