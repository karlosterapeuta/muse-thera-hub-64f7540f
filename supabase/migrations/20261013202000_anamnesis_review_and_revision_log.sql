-- Fluxo de revisão da anamnese, preservando registros existentes.
ALTER TABLE public.anamnesis
 ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'draft',
 ADD COLUMN IF NOT EXISTS finalized_at timestamptz,
 ADD COLUMN IF NOT EXISTS finalized_by uuid;
ALTER TABLE public.anamnesis DROP CONSTRAINT IF EXISTS anamnesis_review_status_check;
ALTER TABLE public.anamnesis ADD CONSTRAINT anamnesis_review_status_check CHECK (review_status IN ('draft','finalized'));
CREATE TABLE IF NOT EXISTS public.anamnesis_revision_log (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 anamnesis_id uuid NOT NULL REFERENCES public.anamnesis(id) ON DELETE CASCADE,
 professional_id uuid NOT NULL,
 changed_at timestamptz NOT NULL DEFAULT now(),
 old_snapshot jsonb,
 new_snapshot jsonb NOT NULL,
 event text NOT NULL CHECK (event IN ('created','updated'))
);
ALTER TABLE public.anamnesis_revision_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anamnesis_revision_log_read_owner ON public.anamnesis_revision_log;
CREATE POLICY anamnesis_revision_log_read_owner ON public.anamnesis_revision_log FOR SELECT TO authenticated
 USING (professional_id = auth.uid() AND EXISTS (
 SELECT 1 FROM public.anamnesis a WHERE a.id = anamnesis_id AND a.professional_id = auth.uid()
 ));
-- Snapshots are written by DB trigger, never directly by clients.
CREATE OR REPLACE FUNCTION public.capture_anamnesis_revision() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.anamnesis_revision_log(anamnesis_id, professional_id, old_snapshot, new_snapshot, event)
 VALUES (NEW.id, NEW.professional_id,
   CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
   to_jsonb(NEW), CASE WHEN TG_OP = 'INSERT' THEN 'created' ELSE 'updated' END);
 RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS capture_anamnesis_revision_trigger ON public.anamnesis;
CREATE TRIGGER capture_anamnesis_revision_trigger AFTER INSERT OR UPDATE ON public.anamnesis
 FOR EACH ROW EXECUTE FUNCTION public.capture_anamnesis_revision();
