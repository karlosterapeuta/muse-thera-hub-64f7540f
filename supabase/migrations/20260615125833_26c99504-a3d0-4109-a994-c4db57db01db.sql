CREATE TABLE public.patient_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_name text,
  patient_name text NOT NULL,
  patient_age integer,
  city text,
  state text,
  phone text,
  whatsapp text,
  email text,
  diagnosis text,
  cid text,
  therapeutic_goal text,
  insurance text,
  mode public.attendance_mode NOT NULL DEFAULT 'online',
  notes text,
  preferred_profile_id uuid REFERENCES public.public_profiles(id) ON DELETE SET NULL,
  lgpd_consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.patient_leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.patient_leads TO authenticated;
GRANT ALL ON public.patient_leads TO service_role;
ALTER TABLE public.patient_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create a lead" ON public.patient_leads
  FOR INSERT TO anon, authenticated WITH CHECK (lgpd_consent = true);
CREATE TRIGGER trg_patient_leads_updated BEFORE UPDATE ON public.patient_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.lead_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.patient_leads(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.public_profiles(id) ON DELETE CASCADE,
  score numeric(6,2) NOT NULL DEFAULT 0,
  status public.lead_status NOT NULL DEFAULT 'novo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lead_id, profile_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_matches TO authenticated;
GRANT ALL ON public.lead_matches TO service_role;
ALTER TABLE public.lead_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Professional or admin reads matches" ON public.lead_matches
  FOR SELECT TO authenticated USING (
    public.has_role('admin')
    OR EXISTS (SELECT 1 FROM public.public_profiles p WHERE p.id = profile_id AND p.user_id = auth.uid())
  );
CREATE POLICY "Professional or admin updates matches" ON public.lead_matches
  FOR UPDATE TO authenticated USING (
    public.has_role('admin')
    OR EXISTS (SELECT 1 FROM public.public_profiles p WHERE p.id = profile_id AND p.user_id = auth.uid())
  ) WITH CHECK (
    public.has_role('admin')
    OR EXISTS (SELECT 1 FROM public.public_profiles p WHERE p.id = profile_id AND p.user_id = auth.uid())
  );
CREATE POLICY "Admin manage matches" ON public.lead_matches
  FOR ALL TO authenticated USING (public.has_role('admin')) WITH CHECK (public.has_role('admin'));
CREATE TRIGGER trg_lead_matches_updated BEFORE UPDATE ON public.lead_matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Matched professional or admin reads lead" ON public.patient_leads
  FOR SELECT TO authenticated USING (
    public.has_role('admin')
    OR EXISTS (
      SELECT 1 FROM public.lead_matches m
      JOIN public.public_profiles p ON p.id = m.profile_id
      WHERE m.lead_id = patient_leads.id AND p.user_id = auth.uid()
    )
  );

CREATE TABLE public.triage_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.patient_leads(id) ON DELETE CASCADE,
  case_summary text,
  identified_needs text,
  therapeutic_area text,
  priority_level text,
  recommended_profile text,
  raw_response jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.triage_reports TO authenticated;
GRANT ALL ON public.triage_reports TO service_role;
ALTER TABLE public.triage_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Matched professional or admin reads triage" ON public.triage_reports
  FOR SELECT TO authenticated USING (
    public.has_role('admin')
    OR EXISTS (
      SELECT 1 FROM public.lead_matches m
      JOIN public.public_profiles p ON p.id = m.profile_id
      WHERE m.lead_id = triage_reports.lead_id AND p.user_id = auth.uid()
    )
  );

CREATE TABLE public.lead_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.lead_matches(id) ON DELETE CASCADE,
  previous_status public.lead_status,
  new_status public.lead_status NOT NULL,
  changed_by uuid,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.lead_status_history TO authenticated;
GRANT ALL ON public.lead_status_history TO service_role;
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Professional or admin reads status history" ON public.lead_status_history
  FOR SELECT TO authenticated USING (
    public.has_role('admin')
    OR EXISTS (
      SELECT 1 FROM public.lead_matches m
      JOIN public.public_profiles p ON p.id = m.profile_id
      WHERE m.id = lead_status_history.match_id AND p.user_id = auth.uid()
    )
  );
CREATE POLICY "Professional or admin inserts status history" ON public.lead_status_history
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role('admin')
    OR EXISTS (
      SELECT 1 FROM public.lead_matches m
      JOIN public.public_profiles p ON p.id = m.profile_id
      WHERE m.id = lead_status_history.match_id AND p.user_id = auth.uid()
    )
  );

CREATE TABLE public.captacao_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.captacao_notifications TO authenticated;
GRANT ALL ON public.captacao_notifications TO service_role;
ALTER TABLE public.captacao_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User reads own notifications" ON public.captacao_notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role('admin'));
CREATE POLICY "User updates own notifications" ON public.captacao_notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.seo_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  page_type text NOT NULL,
  title text NOT NULL,
  meta_description text,
  h1 text,
  body_content text,
  city text,
  specialty_slug text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seo_pages TO anon, authenticated;
GRANT ALL ON public.seo_pages TO service_role;
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published seo pages are public" ON public.seo_pages
  FOR SELECT TO anon, authenticated USING (is_published = true OR public.has_role('admin'));
CREATE POLICY "Admin manage seo pages" ON public.seo_pages
  FOR ALL TO authenticated USING (public.has_role('admin')) WITH CHECK (public.has_role('admin'));
CREATE TRIGGER trg_seo_pages_updated BEFORE UPDATE ON public.seo_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();