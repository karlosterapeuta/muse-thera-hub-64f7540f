-- Fix patients RLS policy to handle null professional_id
DROP POLICY IF EXISTS "Users can manage their own patients" ON patients;

-- Create new policy that allows users to manage patients where professional_id matches their user_id OR professional_id is null
CREATE POLICY "Users can manage their patients" ON patients
FOR ALL 
USING (
  professional_id = auth.uid() OR 
  (professional_id IS NULL AND auth.uid() IS NOT NULL)
)
WITH CHECK (
  professional_id = auth.uid() OR 
  (professional_id IS NULL AND auth.uid() IS NOT NULL)
);

-- Update orphaned patients (with null professional_id) to assign them to existing users
-- This will help populate the dropdown for users who have patients without professional_id
UPDATE patients 
SET professional_id = (
  SELECT user_id 
  FROM professionals 
  WHERE professionals.email = (
    SELECT email 
    FROM auth.users 
    WHERE auth.users.id = professionals.user_id
  )
  LIMIT 1
)
WHERE professional_id IS NULL;

-- If there are still null professional_id after the above update, 
-- assign them to the first authenticated user (fallback)
UPDATE patients 
SET professional_id = (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at 
  LIMIT 1
)
WHERE professional_id IS NULL;