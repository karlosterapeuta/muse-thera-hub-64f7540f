-- Job vacancies discovered/validated for the WhatsApp dissemination engine
CREATE TABLE public.job_vacancies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  url TEXT NOT NULL,
  source TEXT,
  description TEXT,
  posted_at DATE,
  content_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected','sent','expired')),
  is_music_therapy BOOLEAN NOT NULL DEFAULT true,
  link_ok BOOLEAN,
  relevance_score INTEGER,
  sent_at TIMESTAMP WITH TIME ZONE,
  sent_period TEXT CHECK (sent_period IN ('manha','tarde','noite')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_vacancies_status ON public.job_vacancies (status);
CREATE INDEX idx_job_vacancies_created_at ON public.job_vacancies (created_at DESC);

GRANT SELECT ON public.job_vacancies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_vacancies TO authenticated;
GRANT ALL ON public.job_vacancies TO service_role;

ALTER TABLE public.job_vacancies ENABLE ROW LEVEL SECURITY;

-- Public can only see vacancies that were approved or already sent
CREATE POLICY "Public can view approved/sent vacancies"
  ON public.job_vacancies FOR SELECT
  USING (status IN ('approved','sent'));

-- Admins manage everything
CREATE POLICY "Admins can view all vacancies"
  ON public.job_vacancies FOR SELECT TO authenticated
  USING (public.has_role('admin'::app_role));
CREATE POLICY "Admins can insert vacancies"
  ON public.job_vacancies FOR INSERT TO authenticated
  WITH CHECK (public.has_role('admin'::app_role));
CREATE POLICY "Admins can update vacancies"
  ON public.job_vacancies FOR UPDATE TO authenticated
  USING (public.has_role('admin'::app_role));
CREATE POLICY "Admins can delete vacancies"
  ON public.job_vacancies FOR DELETE TO authenticated
  USING (public.has_role('admin'::app_role));

CREATE TRIGGER update_job_vacancies_updated_at
  BEFORE UPDATE ON public.job_vacancies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Single-row settings for the engine (admin configurable)
CREATE TABLE public.vagas_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auto_send BOOLEAN NOT NULL DEFAULT false,
  search_enabled BOOLEAN NOT NULL DEFAULT true,
  whatsapp_group_url TEXT,
  keywords TEXT[] NOT NULL DEFAULT ARRAY['musicoterapeuta','musicoterapia'],
  per_period INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vagas_settings TO authenticated;
GRANT ALL ON public.vagas_settings TO service_role;

ALTER TABLE public.vagas_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage settings"
  ON public.vagas_settings FOR ALL TO authenticated
  USING (public.has_role('admin'::app_role))
  WITH CHECK (public.has_role('admin'::app_role));

CREATE TRIGGER update_vagas_settings_updated_at
  BEFORE UPDATE ON public.vagas_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.vagas_settings (whatsapp_group_url)
VALUES ('https://chat.whatsapp.com/Hu1VVjWrYFZ2zCOzb5qbor?s=cl&p=i&ilr=2');