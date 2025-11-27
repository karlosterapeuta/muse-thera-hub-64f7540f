-- =============================================
-- RESTRICT COURSE MANAGEMENT TO ADMINS ONLY
-- =============================================

-- 1. UPDATE COURSES TABLE POLICIES
-- Remove policy that allows any authenticated user to create
DROP POLICY IF EXISTS "Authenticated users can create courses" ON courses;

-- Create new policy: Only admins can create courses
CREATE POLICY "Only admins can create courses" ON courses
FOR INSERT TO authenticated
WITH CHECK (has_role('admin'));

-- Update policy: Only admins can update courses
DROP POLICY IF EXISTS "Creators can update their courses" ON courses;
CREATE POLICY "Only admins can update courses" ON courses
FOR UPDATE TO authenticated
USING (has_role('admin'))
WITH CHECK (has_role('admin'));

-- Update policy: Only admins can delete courses
DROP POLICY IF EXISTS "Creators can delete their courses" ON courses;
CREATE POLICY "Only admins can delete courses" ON courses
FOR DELETE TO authenticated
USING (has_role('admin'));

-- 2. UPDATE COURSE_MODULES TABLE POLICIES
-- Remove creator-based policy
DROP POLICY IF EXISTS "Course creators can manage modules" ON course_modules;

-- Create admin-only policy for all operations
CREATE POLICY "Only admins can manage modules" ON course_modules
FOR ALL TO authenticated
USING (has_role('admin'))
WITH CHECK (has_role('admin'));

-- 3. UPDATE COURSE_LESSONS TABLE POLICIES
-- Remove creator-based policy
DROP POLICY IF EXISTS "Course creators can manage lessons" ON course_lessons;

-- Create admin-only policy for all operations
CREATE POLICY "Only admins can manage lessons" ON course_lessons
FOR ALL TO authenticated
USING (has_role('admin'))
WITH CHECK (has_role('admin'));