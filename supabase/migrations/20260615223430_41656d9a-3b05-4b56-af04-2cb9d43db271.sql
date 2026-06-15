-- 1. course_creators: force safe defaults on self-registration
CREATE OR REPLACE FUNCTION public.enforce_creator_insert_defaults()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
BEGIN
  SELECT has_role('admin'::app_role) INTO is_admin;
  IF NOT is_admin THEN
    NEW.commission_percentage := 70;
    NEW.asaas_customer_id := NULL;
    NEW.asaas_wallet_id := NULL;
    NEW.asaas_account_status := 'pending';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_creator_insert_defaults_trg ON public.course_creators;
CREATE TRIGGER enforce_creator_insert_defaults_trg
  BEFORE INSERT ON public.course_creators
  FOR EACH ROW EXECUTE FUNCTION public.enforce_creator_insert_defaults();

-- 2. course_purchases: remove broad creator UPDATE access, replace with safe function
DROP POLICY IF EXISTS "Creators can confirm own course purchases" ON public.course_purchases;

CREATE OR REPLACE FUNCTION public.creator_confirm_purchase(p_purchase_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_purchase course_purchases%ROWTYPE;
  is_owner boolean;
BEGIN
  SELECT * INTO v_purchase FROM course_purchases WHERE id = p_purchase_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Purchase not found';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM course_creators cc
    WHERE cc.id = v_purchase.creator_id
      AND cc.user_id = auth.uid()
      AND cc.is_active = true
  ) INTO is_owner;

  IF NOT is_owner AND NOT has_role('admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized to confirm this purchase';
  END IF;

  UPDATE course_purchases
  SET payment_status = 'paid',
      paid_at = now(),
      confirmed_by_creator_at = now()
  WHERE id = p_purchase_id;

  INSERT INTO course_access (course_id, user_id, purchase_id, is_active)
  VALUES (v_purchase.course_id, v_purchase.user_id, p_purchase_id, true)
  ON CONFLICT (course_id, user_id)
  DO UPDATE SET is_active = true, purchase_id = EXCLUDED.purchase_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.creator_confirm_purchase(uuid) TO authenticated;

-- 3 & 4. patients bucket: owner-scoped access policies (set bucket "patients" to Private in Storage)
DROP POLICY IF EXISTS "Patient photos: public read" ON storage.objects;
DROP POLICY IF EXISTS "Patient photos: authenticated insert" ON storage.objects;
DROP POLICY IF EXISTS "Patient photos: authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Patient photos: authenticated delete" ON storage.objects;

CREATE POLICY "Patient photos: owner read"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'patients' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Patient photos: owner insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'patients' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Patient photos: owner update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'patients' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'patients' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Patient photos: owner delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'patients' AND (storage.foldername(name))[1] = auth.uid()::text);