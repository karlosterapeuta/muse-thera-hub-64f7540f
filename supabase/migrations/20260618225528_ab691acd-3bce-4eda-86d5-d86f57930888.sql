-- Table to store public anamnesis invitation links
CREATE TABLE public.anamnesis_invitations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token text NOT NULL UNIQUE,
  professional_id uuid NOT NULL,
  patient_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  anamnesis_id uuid,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.anamnesis_invitations TO authenticated;
GRANT ALL ON public.anamnesis_invitations TO service_role;

ALTER TABLE public.anamnesis_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals manage their own invitations"
ON public.anamnesis_invitations
FOR ALL
TO authenticated
USING (professional_id = auth.uid())
WITH CHECK (professional_id = auth.uid());

CREATE TRIGGER update_anamnesis_invitations_updated_at
BEFORE UPDATE ON public.anamnesis_invitations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Flag on anamnesis to mark records filled by the guardian via public link
ALTER TABLE public.anamnesis ADD COLUMN IF NOT EXISTS filled_by_guardian boolean NOT NULL DEFAULT false;