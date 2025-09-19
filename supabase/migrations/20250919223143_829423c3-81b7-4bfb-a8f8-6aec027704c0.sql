-- Remove test user teste1musetera@gmail.com completely and fix system errors (corrected)

-- 1. Remove test user data (cascading will handle most relationships)
-- First, let's clean up any related data for the test user
DELETE FROM public.user_status_logs 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'teste1musetera@gmail.com'
);

DELETE FROM public.user_roles 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'teste1musetera@gmail.com'
);

DELETE FROM public.professionals 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'teste1musetera@gmail.com'
);

DELETE FROM public.profiles 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email = 'teste1musetera@gmail.com'
);

-- Finally, remove the user from auth.users (this should cascade)
DELETE FROM auth.users 
WHERE email = 'teste1musetera@gmail.com';

-- 2. Fix RLS policy issues for patients table
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their patients" ON public.patients;
DROP POLICY IF EXISTS "Users can manage orphaned patients" ON public.patients;

-- Create improved policies
CREATE POLICY "Users can manage their patients" ON public.patients
FOR ALL 
USING (professional_id = auth.uid())
WITH CHECK (professional_id = auth.uid());

CREATE POLICY "Users can manage orphaned patients" ON public.patients
FOR ALL 
USING (professional_id IS NULL AND auth.uid() IS NOT NULL)
WITH CHECK (professional_id IS NULL AND auth.uid() IS NOT NULL);

-- 3. Fix the UUID validation issues by adding a validation function
CREATE OR REPLACE FUNCTION public.is_valid_uuid(input_text text)
RETURNS boolean AS $$
BEGIN
    -- Try to cast the input to UUID, return false if it fails
    PERFORM input_text::uuid;
    RETURN true;
EXCEPTION WHEN invalid_text_representation THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Improve the force_user_logout function to handle invalid UUIDs
CREATE OR REPLACE FUNCTION public.force_user_logout(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Validate input UUID
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Apenas administradores podem forçar o logout de usuários';
  END IF;
  
  DELETE FROM auth.sessions
  WHERE user_id = target_user_id;
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in force_user_logout for user %: %', target_user_id, SQLERRM;
  RETURN FALSE;
END;
$function$;

-- 5. Clean up any other inactive/expired test users
DELETE FROM public.user_status_logs 
WHERE user_id IN (
  SELECT p.id FROM public.profiles p
  WHERE p.status = 'inactive' 
  AND p.expires_at < NOW()
  AND p.id IN (SELECT id FROM auth.users WHERE email LIKE '%teste%')
);

DELETE FROM public.user_roles 
WHERE user_id IN (
  SELECT p.id FROM public.profiles p
  WHERE p.status = 'inactive' 
  AND p.expires_at < NOW()
  AND p.id IN (SELECT id FROM auth.users WHERE email LIKE '%teste%')
);

DELETE FROM public.professionals 
WHERE user_id IN (
  SELECT p.id FROM public.profiles p
  WHERE p.status = 'inactive' 
  AND p.expires_at < NOW()
  AND p.id IN (SELECT id FROM auth.users WHERE email LIKE '%teste%')
);

DELETE FROM public.profiles 
WHERE id IN (
  SELECT p.id FROM public.profiles p
  WHERE p.status = 'inactive' 
  AND p.expires_at < NOW()
  AND p.id IN (SELECT id FROM auth.users WHERE email LIKE '%teste%')
);

DELETE FROM auth.users 
WHERE email LIKE '%teste%'
AND id IN (
  SELECT p.id FROM public.profiles p
  WHERE p.status = 'inactive' 
  AND p.expires_at < NOW()
);

-- 6. Add better error handling for user management functions
CREATE OR REPLACE FUNCTION public.update_user_status(target_user_id uuid, new_status text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  is_admin BOOLEAN;
  current_status TEXT;
BEGIN
  -- Validate inputs
  IF target_user_id IS NULL OR new_status IS NULL THEN
    RAISE EXCEPTION 'User ID and status cannot be null';
  END IF;
  
  IF new_status NOT IN ('active', 'inactive') THEN
    RAISE EXCEPTION 'Invalid status. Must be active or inactive';
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only administrators can update user status';
  END IF;
  
  SELECT status INTO current_status FROM profiles WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  UPDATE profiles SET status = new_status WHERE id = target_user_id;
  
  INSERT INTO user_status_logs (
    user_id, 
    changed_by, 
    previous_status, 
    new_status
  ) VALUES (
    target_user_id,
    auth.uid(),
    current_status,
    new_status
  );
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in update_user_status for user %: %', target_user_id, SQLERRM;
  RETURN FALSE;
END;
$function$;