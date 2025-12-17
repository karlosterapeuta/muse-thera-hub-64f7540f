-- Allow public INSERT on course_creators for self-registration
CREATE POLICY "Anyone can register as creator"
ON public.course_creators
FOR INSERT
WITH CHECK (true);

-- Allow creators to delete their own account
CREATE POLICY "Creators can delete own account"
ON public.course_creators
FOR DELETE
USING (id = id);