-- Create course_views table to track course views
CREATE TABLE public.course_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id uuid,
  viewed_at timestamp with time zone DEFAULT now(),
  session_id text
);

-- Index for fast counting by course
CREATE INDEX idx_course_views_course_id ON public.course_views(course_id);
CREATE INDEX idx_course_views_viewed_at ON public.course_views(viewed_at);

-- Enable RLS
ALTER TABLE public.course_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert views (for tracking)
CREATE POLICY "Anyone can insert course views"
ON public.course_views
FOR INSERT
WITH CHECK (true);

-- Creators can view stats for their courses
CREATE POLICY "Creators can view their course stats"
ON public.course_views
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM courses c
    JOIN course_creators cc ON c.creator_id = cc.id
    WHERE c.id = course_views.course_id
    AND cc.user_id = auth.uid()
  )
);

-- Admins can view all
CREATE POLICY "Admins can view all course views"
ON public.course_views
FOR SELECT
USING (has_role('admin'::app_role));