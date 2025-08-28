-- Update orphaned patients (with null professional_id) to assign them to the first authenticated user
-- This will help populate the dropdown for users who have patients without professional_id
UPDATE patients 
SET professional_id = (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at 
  LIMIT 1
)
WHERE professional_id IS NULL;