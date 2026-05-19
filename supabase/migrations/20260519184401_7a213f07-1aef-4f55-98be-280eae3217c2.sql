
-- Tabela perfil do emissor
CREATE TABLE public.receipt_issuer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  document_type TEXT NOT NULL CHECK (document_type IN ('cpf','cnpj')),
  document_number TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  trade_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.receipt_issuer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own issuer profile"
ON public.receipt_issuer_profiles
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_receipt_issuer_profiles_updated
BEFORE UPDATE ON public.receipt_issuer_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tabela de recibos emitidos
CREATE TABLE public.payment_receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  receipt_number INTEGER NOT NULL,
  financial_record_id UUID,
  patient_id UUID,
  patient_name TEXT NOT NULL,
  patient_document TEXT,
  amount NUMERIC(12,2) NOT NULL,
  service_description TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'pix',
  payment_date DATE NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pdf_path TEXT,
  verification_hash TEXT,
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued','cancelled')),
  issuer_snapshot JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, receipt_number)
);

ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own receipts"
ON public.payment_receipts
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Permitir verificação pública por id (somente leitura) para página /verify-receipt
CREATE POLICY "Public can verify receipts by id"
ON public.payment_receipts
FOR SELECT
TO anon
USING (true);

CREATE TRIGGER trg_payment_receipts_updated
BEFORE UPDATE ON public.payment_receipts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_payment_receipts_user ON public.payment_receipts(user_id, issued_at DESC);

-- Função para gerar número sequencial por usuário
CREATE OR REPLACE FUNCTION public.set_receipt_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  IF NEW.receipt_number IS NULL OR NEW.receipt_number = 0 THEN
    SELECT COALESCE(MAX(receipt_number), 0) + 1
    INTO next_num
    FROM public.payment_receipts
    WHERE user_id = NEW.user_id;
    NEW.receipt_number := next_num;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_receipt_number
BEFORE INSERT ON public.payment_receipts
FOR EACH ROW EXECUTE FUNCTION public.set_receipt_number();
