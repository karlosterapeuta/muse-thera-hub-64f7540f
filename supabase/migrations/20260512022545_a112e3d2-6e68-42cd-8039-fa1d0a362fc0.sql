ALTER TABLE public.anamnesis
  ADD COLUMN IF NOT EXISTS diagnosis_details text,
  ADD COLUMN IF NOT EXISTS cid_code text,
  ADD COLUMN IF NOT EXISTS clinical_details text,
  ADD COLUMN IF NOT EXISTS medication_schedule text,
  ADD COLUMN IF NOT EXISTS medication_effects text;