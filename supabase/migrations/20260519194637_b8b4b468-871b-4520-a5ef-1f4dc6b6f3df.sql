
-- receipt_clients
CREATE TABLE public.receipt_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  document_type text,
  document_number text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_receipt_clients_user ON public.receipt_clients(user_id);
CREATE INDEX idx_receipt_clients_doc ON public.receipt_clients(user_id, document_number);
ALTER TABLE public.receipt_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own clients" ON public.receipt_clients
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_receipt_clients_updated BEFORE UPDATE ON public.receipt_clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- receipt_templates
CREATE TABLE public.receipt_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  suggested_amount numeric,
  payment_method text DEFAULT 'pix',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_receipt_templates_user ON public.receipt_templates(user_id);
ALTER TABLE public.receipt_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own templates" ON public.receipt_templates
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_receipt_templates_updated BEFORE UPDATE ON public.receipt_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- payment_receipts: extra fields
ALTER TABLE public.payment_receipts
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS observations text,
  ADD COLUMN IF NOT EXISTS unique_code text,
  ADD COLUMN IF NOT EXISTS template_id uuid,
  ADD COLUMN IF NOT EXISTS client_id uuid;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_receipts_unique_code ON public.payment_receipts(unique_code) WHERE unique_code IS NOT NULL;

-- receipt_issuer_profiles: signature url
ALTER TABLE public.receipt_issuer_profiles
  ADD COLUMN IF NOT EXISTS signature_url text;
