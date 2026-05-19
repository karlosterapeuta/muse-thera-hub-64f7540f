-- Add payment tracking fields to financial_records
ALTER TABLE public.financial_records
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS payment_proof_url text,
  ADD COLUMN IF NOT EXISTS payment_notes text;

ALTER TABLE public.financial_records
  DROP CONSTRAINT IF EXISTS financial_records_payment_status_check;

ALTER TABLE public.financial_records
  ADD CONSTRAINT financial_records_payment_status_check
  CHECK (payment_status IN ('pendente', 'pago'));

CREATE INDEX IF NOT EXISTS idx_financial_records_payment_status
  ON public.financial_records(professional_id, payment_status);

-- Create payment-proofs bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for payment-proofs
DROP POLICY IF EXISTS "Users can view own payment proofs" ON storage.objects;
CREATE POLICY "Users can view own payment proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can upload own payment proofs" ON storage.objects;
CREATE POLICY "Users can upload own payment proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update own payment proofs" ON storage.objects;
CREATE POLICY "Users can update own payment proofs"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own payment proofs" ON storage.objects;
CREATE POLICY "Users can delete own payment proofs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);