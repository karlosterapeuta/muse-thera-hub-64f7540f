CREATE TABLE public.public_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  full_name text NOT NULL,
  avatar_url text,
  city text,
  state text,
  professional_registration text,
  bio text,
  education text,
  postgraduate text,
  target_audience text,
  attends_online boolean NOT NULL DEFAULT false,
  attends_in_person boolean NOT NULL DEFAULT false,
  accepts_private boolean NOT NULL DEFAULT true,
  whatsapp text,
  instagram text,
  website text,
  plan public.plan_tier NOT NULL DEFAULT 'gratuito',
  is_published boolean NOT NULL DEFAULT false,
  avg_rating numeric(3,2) NOT NULL DEFAULT 0,
  reviews_count integer NOT NULL DEFAULT 0,
  years_experience integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.public_profiles TO authenticated;
GRANT ALL ON public.public_profiles TO service_role;
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published profiles are public" ON public.public_profiles
  FOR SELECT TO anon, authenticated USING (is_published = true OR auth.uid() = user_id OR public.has_role('admin'));
CREATE POLICY "Owner can insert own public profile" ON public.public_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner or admin can update public profile" ON public.public_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role('admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role('admin'));
CREATE POLICY "Owner or admin can delete public profile" ON public.public_profiles
  FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role('admin'));
CREATE TRIGGER trg_public_profiles_updated BEFORE UPDATE ON public.public_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.professional_specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.public_profiles(id) ON DELETE CASCADE,
  specialty_id uuid NOT NULL REFERENCES public.specialties(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, specialty_id)
);
GRANT SELECT ON public.professional_specialties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professional_specialties TO authenticated;
GRANT ALL ON public.professional_specialties TO service_role;
ALTER TABLE public.professional_specialties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prof specialties public read" ON public.professional_specialties FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Owner manage prof specialties" ON public.professional_specialties FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.public_profiles p WHERE p.id = profile_id AND (p.user_id = auth.uid() OR public.has_role('admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.public_profiles p WHERE p.id = profile_id AND (p.user_id = auth.uid() OR public.has_role('admin'))));

CREATE TABLE public.professional_insurances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.public_profiles(id) ON DELETE CASCADE,
  insurance_id uuid NOT NULL REFERENCES public.insurance_providers(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, insurance_id)
);
GRANT SELECT ON public.professional_insurances TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professional_insurances TO authenticated;
GRANT ALL ON public.professional_insurances TO service_role;
ALTER TABLE public.professional_insurances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prof insurances public read" ON public.professional_insurances FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Owner manage prof insurances" ON public.professional_insurances FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.public_profiles p WHERE p.id = profile_id AND (p.user_id = auth.uid() OR public.has_role('admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.public_profiles p WHERE p.id = profile_id AND (p.user_id = auth.uid() OR public.has_role('admin'))));

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.public_profiles(id) ON DELETE CASCADE,
  reviewer_name text,
  rating integer NOT NULL,
  comment text,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved reviews are public" ON public.reviews
  FOR SELECT TO anon, authenticated USING (
    is_approved = true OR public.has_role('admin')
    OR EXISTS (SELECT 1 FROM public.public_profiles p WHERE p.id = profile_id AND p.user_id = auth.uid())
  );
CREATE POLICY "Anyone can create a review" ON public.reviews
  FOR INSERT TO anon, authenticated WITH CHECK (rating BETWEEN 1 AND 5);
CREATE POLICY "Admin manage reviews" ON public.reviews
  FOR ALL TO authenticated USING (public.has_role('admin')) WITH CHECK (public.has_role('admin'));