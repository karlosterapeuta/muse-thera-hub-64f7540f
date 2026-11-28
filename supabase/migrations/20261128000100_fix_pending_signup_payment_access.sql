-- Separate an explicitly granted unlimited account from a new account
-- whose subscription has not yet been paid.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_unlimited boolean NOT NULL DEFAULT false;

-- Preserve the one currently active administrator whose NULL expiry represents
-- a legitimate unlimited account. Inactive and pending profiles remain false.
UPDATE public.profiles p
SET is_unlimited = true,
    updated_at = now()
WHERE p.status = 'active'
  AND p.expires_at IS NULL
  AND EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = p.id
      AND ur.role = 'admin'::public.app_role
  );

-- Prevent authenticated users from granting themselves access or changing
-- subscription validity. Administrators and trusted server-side operations
-- retain the existing administrative workflow.
CREATE OR REPLACE FUNCTION public.guard_profile_subscription_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_role text := current_setting('request.jwt.claim.role', true);
  requester_id uuid := auth.uid();
  requester_is_admin boolean := false;
BEGIN
  IF request_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF requester_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = requester_id
        AND role = 'admin'::public.app_role
    ) INTO requester_is_admin;
  END IF;

  IF NOT requester_is_admin AND (
    NEW.status IS DISTINCT FROM OLD.status
    OR NEW.expires_at IS DISTINCT FROM OLD.expires_at
    OR NEW.is_unlimited IS DISTINCT FROM OLD.is_unlimited
    OR NEW.plan_start_date IS DISTINCT FROM OLD.plan_start_date
  ) THEN
    RAISE EXCEPTION 'Subscription fields can only be changed by an administrator or trusted server operation'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_profile_subscription_fields
  ON public.profiles;

CREATE TRIGGER guard_profile_subscription_fields
BEFORE UPDATE OF status, expires_at, is_unlimited, plan_start_date
ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.guard_profile_subscription_fields();

-- Payment confirmation must also activate a brand-new profile, whose
-- expires_at is intentionally NULL until the first approved payment.
CREATE OR REPLACE FUNCTION public.apply_paid_plan_renewal(p_renewal_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r public.plan_renewals%ROWTYPE;
BEGIN
  IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role' THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT *
  INTO r
  FROM public.plan_renewals
  WHERE id = p_renewal_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF r.applied_at IS NOT NULL THEN
    RETURN true;
  END IF;

  IF r.status <> 'pending' THEN
    RETURN false;
  END IF;

  UPDATE public.profiles
  SET expires_at = greatest(now(), coalesce(expires_at, now()))
                   + CASE r.plan_code
                       WHEN '6m' THEN interval '6 months'
                       WHEN '12m' THEN interval '12 months'
                       ELSE interval '30 days'
                     END,
      plan_start_date = coalesce(plan_start_date, now()),
      status = 'active',
      updated_at = now()
  WHERE id = r.user_id
    AND is_unlimited = false;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile missing or explicitly unlimited; review manually';
  END IF;

  UPDATE public.plan_renewals
  SET status = 'paid',
      paid_at = now(),
      applied_at = now()
  WHERE id = r.id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.apply_paid_plan_renewal(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_paid_plan_renewal(uuid) TO service_role;
