-- Perfil funcional TEA: informações de anamnese, não instrumento diagnóstico.
-- Migração aditiva: preserva integralmente os registros existentes.
ALTER TABLE public.anamnesis
  ADD COLUMN IF NOT EXISTS tea_functional_profile jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.anamnesis.tea_functional_profile IS
  'Dados funcionais relatados pelo paciente/responsável para planejamento musicoterapêutico; não equivalem a diagnóstico ou escala validada.';
