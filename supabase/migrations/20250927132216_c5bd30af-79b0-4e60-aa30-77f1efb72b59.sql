-- Fix RLS for treatment_plans to use professionals.user_id linkage
-- Drop old policy if exists
DROP POLICY IF EXISTS "Users can manage their own treatment plans" ON public.treatment_plans;

-- Create granular policies using professionals.user_id
CREATE POLICY "Professionals can view own treatment plans"
ON public.treatment_plans
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.professionals p
    WHERE p.id = treatment_plans.professional_id
      AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Professionals can insert own treatment plans"
ON public.treatment_plans
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.professionals p
    WHERE p.id = treatment_plans.professional_id
      AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Professionals can update own treatment plans"
ON public.treatment_plans
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.professionals p
    WHERE p.id = treatment_plans.professional_id
      AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.professionals p
    WHERE p.id = treatment_plans.professional_id
      AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Professionals can delete own treatment plans"
ON public.treatment_plans
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.professionals p
    WHERE p.id = treatment_plans.professional_id
      AND p.user_id = auth.uid()
  )
);
