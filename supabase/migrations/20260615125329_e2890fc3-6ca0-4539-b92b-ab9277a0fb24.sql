DROP TABLE IF EXISTS public.test_captacao;

DO $$ BEGIN CREATE TYPE public.plan_tier AS ENUM ('gratuito','profissional','premium'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.lead_status AS ENUM ('novo','contatado','avaliacao_agendada','em_atendimento','convertido','perdido'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE public.attendance_mode AS ENUM ('online','presencial','ambos'); EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE public.specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.specialties TO anon, authenticated;
GRANT ALL ON public.specialties TO service_role;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Specialties are public" ON public.specialties FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage specialties" ON public.specialties FOR ALL TO authenticated USING (public.has_role('admin')) WITH CHECK (public.has_role('admin'));

CREATE TABLE public.insurance_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.insurance_providers TO anon, authenticated;
GRANT ALL ON public.insurance_providers TO service_role;
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insurances are public" ON public.insurance_providers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage insurances" ON public.insurance_providers FOR ALL TO authenticated USING (public.has_role('admin')) WITH CHECK (public.has_role('admin'));

INSERT INTO public.specialties (name, slug) VALUES
  ('TEA','tea'),('TDAH','tdah'),('Linguagem','linguagem'),
  ('Desenvolvimento Infantil','desenvolvimento-infantil'),
  ('Síndrome de Down','sindrome-de-down'),
  ('Deficiência Intelectual','deficiencia-intelectual'),
  ('Neuroreabilitação','neuroreabilitacao'),
  ('Parkinson','parkinson'),('Alzheimer','alzheimer'),
  ('Saúde Mental','saude-mental'),('Idosos','idosos'),
  ('Estimulação Cognitiva','estimulacao-cognitiva')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.insurance_providers (name, slug) VALUES
  ('Unimed','unimed'),('Hapvida','hapvida'),('Amil','amil'),
  ('SulAmérica','sulamerica'),('Bradesco Saúde','bradesco-saude'),
  ('NotreDame Intermédica','notredame-intermedica'),('Particular','particular')
ON CONFLICT (slug) DO NOTHING;