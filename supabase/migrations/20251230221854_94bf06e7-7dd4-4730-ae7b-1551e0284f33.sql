CREATE OR REPLACE FUNCTION public.configure_user_plan(
  target_user_id UUID,
  new_plan_start_date TIMESTAMP WITH TIME ZONE,
  new_expires_at TIMESTAMP WITH TIME ZONE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Verificar se o usuário atual é admin
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only administrators can configure user plans';
  END IF;
  
  -- Atualizar o plano do usuário
  UPDATE profiles 
  SET plan_start_date = new_plan_start_date,
      expires_at = new_expires_at,
      updated_at = NOW()
  WHERE id = target_user_id;
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in configure_user_plan for user %: %', target_user_id, SQLERRM;
  RETURN FALSE;
END;
$$;