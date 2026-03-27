
-- Change default status for profiles to 'pending'
ALTER TABLE public.profiles ALTER COLUMN status SET DEFAULT 'pending';

-- Update handle_new_user to set status as 'pending'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
begin
  insert into public.profiles (id, name, status)
  values (new.id, new.raw_user_meta_data->>'name', 'pending');
  return new;
end;
$$;

-- Update update_user_status to accept 'pending' status
CREATE OR REPLACE FUNCTION public.update_user_status(target_user_id uuid, new_status text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  is_admin BOOLEAN;
  current_status TEXT;
BEGIN
  IF target_user_id IS NULL OR new_status IS NULL THEN
    RAISE EXCEPTION 'User ID and status cannot be null';
  END IF;
  
  IF new_status NOT IN ('active', 'inactive', 'pending') THEN
    RAISE EXCEPTION 'Invalid status. Must be active, inactive or pending';
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
  
  UPDATE profiles SET status = new_status, updated_at = NOW() WHERE id = target_user_id;
  
  INSERT INTO user_status_logs (
    user_id, changed_by, previous_status, new_status
  ) VALUES (
    target_user_id, auth.uid(), current_status, new_status
  );
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in update_user_status for user %: %', target_user_id, SQLERRM;
  RETURN FALSE;
END;
$$;
