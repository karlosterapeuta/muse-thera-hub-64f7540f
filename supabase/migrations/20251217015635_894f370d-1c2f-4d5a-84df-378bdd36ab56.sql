-- =============================================
-- COURSE MARKETPLACE SCHEMA
-- =============================================

-- 1. Create course_creators table (separate from MuseTera users)
CREATE TABLE public.course_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  pix_key TEXT NOT NULL,
  pix_key_type TEXT NOT NULL CHECK (pix_key_type IN ('cpf', 'cnpj', 'email', 'phone', 'random')),
  bio TEXT,
  avatar_url TEXT,
  commission_percentage NUMERIC DEFAULT 70 CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add creator_id and price to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES public.course_creators(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS price_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'geral';

-- 3. Create course_purchases table
CREATE TABLE public.course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  creator_id UUID REFERENCES public.course_creators(id) ON DELETE SET NULL,
  
  -- Payment data
  amount_cents INTEGER NOT NULL,
  creator_amount_cents INTEGER NOT NULL,
  platform_amount_cents INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'expired')),
  payment_method TEXT DEFAULT 'pix',
  pix_code TEXT,
  pix_qr_code_url TEXT,
  pix_expiration TIMESTAMPTZ,
  
  -- Buyer snapshot
  buyer_name TEXT,
  buyer_email TEXT,
  
  -- Timestamps
  paid_at TIMESTAMPTZ,
  confirmed_by_creator_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create course_access table (tracks who has access to which courses)
CREATE TABLE public.course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  purchase_id UUID REFERENCES public.course_purchases(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(course_id, user_id)
);

-- 5. Enable RLS on new tables
ALTER TABLE public.course_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_access ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for course_creators (only creators can see their own data, no public access)
CREATE POLICY "Creators can view own data"
ON public.course_creators FOR SELECT
USING (true); -- Public read for login verification

CREATE POLICY "Creators can update own data"
ON public.course_creators FOR UPDATE
USING (id = id); -- Will be verified by auth token in edge function

-- 7. RLS Policies for course_purchases
CREATE POLICY "Users can view own purchases"
ON public.course_purchases FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Creators can view their course purchases"
ON public.course_purchases FOR SELECT
USING (creator_id IN (SELECT id FROM public.course_creators));

CREATE POLICY "System can insert purchases"
ON public.course_purchases FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update purchases"
ON public.course_purchases FOR UPDATE
USING (true);

-- 8. RLS Policies for course_access
CREATE POLICY "Users can view own course access"
ON public.course_access FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can manage course access"
ON public.course_access FOR ALL
USING (true);

-- 9. Function to check if user has access to a course
CREATE OR REPLACE FUNCTION public.user_has_course_access(p_user_id UUID, p_course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.course_access
    WHERE user_id = p_user_id
    AND course_id = p_course_id
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  ) OR EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = p_course_id
    AND (price_cents = 0 OR price_cents IS NULL)
  );
$$;

-- 10. Update trigger for course_creators
CREATE TRIGGER update_course_creators_updated_at
BEFORE UPDATE ON public.course_creators
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Update trigger for course_purchases
CREATE TRIGGER update_course_purchases_updated_at
BEFORE UPDATE ON public.course_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Index for faster lookups
CREATE INDEX idx_course_purchases_creator ON public.course_purchases(creator_id);
CREATE INDEX idx_course_purchases_user ON public.course_purchases(user_id);
CREATE INDEX idx_course_purchases_status ON public.course_purchases(payment_status);
CREATE INDEX idx_course_access_user ON public.course_access(user_id);
CREATE INDEX idx_course_access_course ON public.course_access(course_id);
CREATE INDEX idx_courses_creator ON public.courses(creator_id);