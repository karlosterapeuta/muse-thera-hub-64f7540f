-- Corrige incompatibilidade entre os campos textuais da anamnese
-- e a tabela public.anamnesis: mantém os registros clínicos existentes.
-- Campo "discomfort_sounds" identificado no salvamento em 2026-10-21.
ALTER TABLE public.anamnesis
  ADD COLUMN IF NOT EXISTS discomfort_sounds text,
  ADD COLUMN IF NOT EXISTS calming_sounds text,
  ADD COLUMN IF NOT EXISTS musical_behavior_description text,
  ADD COLUMN IF NOT EXISTS regulation_strategies text;

COMMENT ON COLUMN public.anamnesis.discomfort_sounds IS
  'Sons e características auditivas relatados ou observados como desconfortáveis.';
COMMENT ON COLUMN public.anamnesis.calming_sounds IS
  'Sons ou músicas relatados ou observados como confortáveis.';
COMMENT ON COLUMN public.anamnesis.musical_behavior_description IS
  'Descrição clínica contextualizada do comportamento musical.';
COMMENT ON COLUMN public.anamnesis.regulation_strategies IS
  'Estratégias de regulação relatadas ou observadas e suas condições de uso.';
