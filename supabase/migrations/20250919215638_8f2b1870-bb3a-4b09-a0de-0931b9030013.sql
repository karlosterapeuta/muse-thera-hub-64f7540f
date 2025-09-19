-- Modify the force_user_logout function to allow system triggers
CREATE OR REPLACE FUNCTION public.force_user_logout(target_user_id uuid, bypass_auth_check boolean DEFAULT false)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Skip admin check if this is called by a system trigger
  IF NOT bypass_auth_check THEN
    SELECT EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    ) INTO is_admin;
    
    IF NOT is_admin THEN
      RAISE EXCEPTION 'Apenas administradores podem forçar o logout de usuários';
    END IF;
  END IF;
  
  DELETE FROM auth.sessions
  WHERE user_id = target_user_id;
  
  RETURN TRUE;
END;
$$;

-- Create a function to automatically force logout when user status changes to inactive
CREATE OR REPLACE FUNCTION public.auto_force_logout_on_inactive()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if the status changed to 'inactive'
  IF OLD.status != 'inactive' AND NEW.status = 'inactive' THEN
    -- Call the force_user_logout function with bypass_auth_check = true
    PERFORM public.force_user_logout(NEW.id, true);
    
    -- Log the automatic logout
    RAISE LOG 'Auto force logout executed for user %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger on profiles table
DROP TRIGGER IF EXISTS trigger_auto_force_logout ON public.profiles;
CREATE TRIGGER trigger_auto_force_logout
  AFTER UPDATE OF status ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_force_logout_on_inactive();

-- Immediately force logout for the specific user teste1musetera using admin context
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get an admin user ID
  SELECT user_id INTO admin_user_id
  FROM user_roles 
  WHERE role = 'admin'::app_role 
  LIMIT 1;
  
  IF admin_user_id IS NOT NULL THEN
    -- Force logout for teste1 user
    PERFORM public.force_user_logout('84310732-0428-40de-8298-108bcc67e099', true);
    RAISE LOG 'Immediate force logout executed for teste1 user';
  END IF;
END;
$$;