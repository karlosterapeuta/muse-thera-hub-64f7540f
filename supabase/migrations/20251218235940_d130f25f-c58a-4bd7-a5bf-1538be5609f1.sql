-- Add new RLS policies for course_modules to allow creators to view their own modules
CREATE POLICY "Creators can view own course modules" 
ON course_modules
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM courses c
    JOIN course_creators cc ON c.creator_id = cc.id
    WHERE c.id = course_modules.course_id
    AND cc.user_id = auth.uid()
    AND cc.is_active = true
  )
);

-- Add new RLS policies for course_lessons to allow creators to view their own lessons
CREATE POLICY "Creators can view own course lessons" 
ON course_lessons
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM course_modules m
    JOIN courses c ON m.course_id = c.id
    JOIN course_creators cc ON c.creator_id = cc.id
    WHERE m.id = course_lessons.module_id
    AND cc.user_id = auth.uid()
    AND cc.is_active = true
  )
);

-- Add new RLS policy for courses to allow creators to view their own courses
CREATE POLICY "Creators can view own courses via creator_id" 
ON courses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM course_creators cc
    WHERE cc.id = courses.creator_id
    AND cc.user_id = auth.uid()
    AND cc.is_active = true
  )
);