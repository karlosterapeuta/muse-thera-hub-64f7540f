
-- 1) payment_receipts: drop overly permissive anon SELECT and provide a safe RPC
DROP POLICY IF EXISTS "Public can verify receipts by id" ON public.payment_receipts;

CREATE OR REPLACE FUNCTION public.verify_receipt(p_id uuid)
RETURNS TABLE (
  receipt_number integer,
  amount numeric,
  patient_name text,
  payment_date date,
  service_description text,
  issued_at timestamptz,
  status text,
  verification_hash text,
  issuer_snapshot jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT receipt_number, amount, patient_name, payment_date,
         service_description, issued_at, status, verification_hash,
         issuer_snapshot
  FROM public.payment_receipts
  WHERE id = p_id;
$$;

REVOKE ALL ON FUNCTION public.verify_receipt(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_receipt(uuid) TO anon, authenticated;

-- 2) digital-signatures bucket: make private (per-user SELECT policy already exists)
UPDATE storage.buckets SET public = false WHERE id = 'digital-signatures';
DROP POLICY IF EXISTS "Public can view digital signatures" ON storage.objects;

-- 3) course_purchases: restrict creator UPDATE columns via trigger
CREATE OR REPLACE FUNCTION public.restrict_creator_purchase_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
  is_owning_creator boolean;
BEGIN
  SELECT has_role('admin'::app_role) INTO is_admin;
  IF is_admin THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM course_creators cc
    WHERE cc.id = OLD.creator_id
      AND cc.user_id = auth.uid()
      AND cc.is_active = true
  ) INTO is_owning_creator;

  IF is_owning_creator THEN
    -- Creators may only modify confirmation timestamp
    IF NEW.buyer_email IS DISTINCT FROM OLD.buyer_email
       OR NEW.buyer_name IS DISTINCT FROM OLD.buyer_name
       OR NEW.buyer_phone IS DISTINCT FROM OLD.buyer_phone
       OR NEW.buyer_cpf_cnpj IS DISTINCT FROM OLD.buyer_cpf_cnpj
       OR NEW.amount_cents IS DISTINCT FROM OLD.amount_cents
       OR NEW.payment_status IS DISTINCT FROM OLD.payment_status
       OR NEW.pix_code IS DISTINCT FROM OLD.pix_code
       OR NEW.pix_qr_code_url IS DISTINCT FROM OLD.pix_qr_code_url
       OR NEW.asaas_pix_copy_paste IS DISTINCT FROM OLD.asaas_pix_copy_paste
       OR NEW.asaas_pix_qr_code IS DISTINCT FROM OLD.asaas_pix_qr_code
       OR NEW.asaas_payment_id IS DISTINCT FROM OLD.asaas_payment_id
       OR NEW.user_id IS DISTINCT FROM OLD.user_id
       OR NEW.creator_id IS DISTINCT FROM OLD.creator_id
       OR NEW.course_id IS DISTINCT FROM OLD.course_id
    THEN
      RAISE EXCEPTION 'Creators can only update the confirmation status of a purchase';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_restrict_creator_purchase_updates ON public.course_purchases;
CREATE TRIGGER trg_restrict_creator_purchase_updates
BEFORE UPDATE ON public.course_purchases
FOR EACH ROW EXECUTE FUNCTION public.restrict_creator_purchase_updates();
