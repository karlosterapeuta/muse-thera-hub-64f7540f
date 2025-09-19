-- Fix function search path security issues

-- Update functions to have proper search_path set for security
CREATE OR REPLACE FUNCTION public.validate_and_use_invite_code(invite_code text, user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  code_record invite_codes%ROWTYPE;
BEGIN
  UPDATE invite_codes
  SET status = 'used',
      used_at = NOW(),
      used_by_user_id = user_id
  WHERE code = invite_code
    AND status = 'unused'
    AND expires_at > NOW()
  RETURNING * INTO code_record;

  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_professional_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.professionals (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NEW.email);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(role app_role)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND user_roles.role = has_role.role
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_user_access_expired(user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND expires_at IS NOT NULL
      AND expires_at < NOW()
  );
$function$;

CREATE OR REPLACE FUNCTION public.validate_invite_code_with_limits(invite_code text, user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  code_record invite_codes%ROWTYPE;
  attempt_count int;
BEGIN
  -- Check for too many recent failed attempts from this IP/user
  -- (This is a simplified version - in production you'd want IP tracking)
  
  -- Validate code format (8 uppercase alphanumeric)
  IF NOT (invite_code ~ '^[A-Z0-9]{8}$') THEN
    RETURN FALSE;
  END IF;
  
  -- Try to use the code
  UPDATE invite_codes
  SET status = 'used',
      used_at = NOW(),
      used_by_user_id = user_id
  WHERE code = invite_code
    AND status = 'unused'
    AND expires_at > NOW()
  RETURNING * INTO code_record;
  
  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_sessions_count(target_user_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  session_count integer;
  is_admin boolean;
BEGIN
  -- Check if current user is admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::public.app_role
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only administrators can check user sessions';
  END IF;
  
  -- Count active sessions for target user
  SELECT COUNT(*) INTO session_count
  FROM auth.sessions
  WHERE user_id = target_user_id;
  
  RETURN session_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_invite_code(expiration_days integer DEFAULT 7)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := upper(substring(md5(random()::text) from 1 for 8));
    
    SELECT EXISTS (
      SELECT 1 FROM invite_codes WHERE code = new_code
    ) INTO code_exists;
    
    IF NOT code_exists THEN
      INSERT INTO invite_codes (
        code,
        expires_at
      ) VALUES (
        new_code,
        NOW() + (expiration_days || ' days')::INTERVAL
      );
      
      RETURN new_code;
    END IF;
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_force_logout_on_inactive()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$function$;