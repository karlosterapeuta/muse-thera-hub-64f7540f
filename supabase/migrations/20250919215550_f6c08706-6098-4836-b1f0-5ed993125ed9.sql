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
    -- Call the force_user_logout function
    PERFORM public.force_user_logout(NEW.id);
    
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

-- Immediately force logout for the specific user teste1musetera
SELECT public.force_user_logout('84310732-0428-40de-8298-108bcc67e099');