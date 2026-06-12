ALTER TABLE public.anamnesis ADD COLUMN IF NOT EXISTS odd_disorder BOOLEAN DEFAULT FALSE;
COMMENT ON COLUMN public.anamnesis.odd_disorder IS 'TOD - Transtorno Opositor Desafiador';
GRANT ALL ON public.anamnesis TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.anamnesis TO authenticated;
