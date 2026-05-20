
CREATE TABLE IF NOT EXISTS public.treatment_plan_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL,
  professional_id uuid NOT NULL,
  version_number integer NOT NULL,
  label text,
  snapshot jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (plan_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_tpv_plan ON public.treatment_plan_versions(plan_id, version_number DESC);

ALTER TABLE public.treatment_plan_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own plan versions"
ON public.treatment_plan_versions
FOR ALL
TO authenticated
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);
