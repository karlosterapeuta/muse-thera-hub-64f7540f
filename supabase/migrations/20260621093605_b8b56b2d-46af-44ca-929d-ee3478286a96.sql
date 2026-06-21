
-- Helper to resolve current professional id
CREATE OR REPLACE FUNCTION public.get_professional_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.professionals WHERE user_id = auth.uid() LIMIT 1
$$;

-- PTI plans
CREATE TABLE public.pti_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES public.patients(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT 'Plano Terapêutico Individual',
  status text NOT NULL DEFAULT 'rascunho',
  plan_date date NOT NULL DEFAULT CURRENT_DATE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  progress integer NOT NULL DEFAULT 0,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pti_plans TO authenticated;
GRANT ALL ON public.pti_plans TO service_role;
ALTER TABLE public.pti_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals manage own PTI plans"
ON public.pti_plans FOR ALL
TO authenticated
USING (professional_id = public.get_professional_id() OR public.has_role('admin'::app_role))
WITH CHECK (professional_id = public.get_professional_id() OR public.has_role('admin'::app_role));

-- PTI versions
CREATE TABLE public.pti_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pti_id uuid NOT NULL REFERENCES public.pti_plans(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.pti_versions TO authenticated;
GRANT ALL ON public.pti_versions TO service_role;
ALTER TABLE public.pti_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals manage own PTI versions"
ON public.pti_versions FOR ALL
TO authenticated
USING (professional_id = public.get_professional_id() OR public.has_role('admin'::app_role))
WITH CHECK (professional_id = public.get_professional_id() OR public.has_role('admin'::app_role));

-- PTI reavaliacoes
CREATE TABLE public.pti_reavaliacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pti_id uuid NOT NULL REFERENCES public.pti_plans(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  report jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pti_reavaliacoes TO authenticated;
GRANT ALL ON public.pti_reavaliacoes TO service_role;
ALTER TABLE public.pti_reavaliacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals manage own PTI reavaliacoes"
ON public.pti_reavaliacoes FOR ALL
TO authenticated
USING (professional_id = public.get_professional_id() OR public.has_role('admin'::app_role))
WITH CHECK (professional_id = public.get_professional_id() OR public.has_role('admin'::app_role));

-- updated_at trigger
CREATE TRIGGER update_pti_plans_updated_at
BEFORE UPDATE ON public.pti_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_pti_plans_professional ON public.pti_plans(professional_id);
CREATE INDEX idx_pti_plans_patient ON public.pti_plans(patient_id);
CREATE INDEX idx_pti_versions_pti ON public.pti_versions(pti_id);
CREATE INDEX idx_pti_reavaliacoes_pti ON public.pti_reavaliacoes(pti_id);
