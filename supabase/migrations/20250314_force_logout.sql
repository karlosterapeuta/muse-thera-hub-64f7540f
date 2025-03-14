
-- Esta função permite forçar o logout de um usuário específico
-- Ela revoga todas as sessões do usuário alvo
CREATE OR REPLACE FUNCTION public.force_user_logout(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Verifica se o usuário atual é administrador
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Apenas administradores podem forçar o logout de usuários';
  END IF;
  
  -- Revoga todas as sessões do usuário alvo
  -- Isso é feito através de uma operação interna do Supabase que invalida todas as sessões
  -- Quando o usuário tentar usar uma sessão inválida, o sistema forçará o logout
  DELETE FROM auth.sessions
  WHERE user_id = target_user_id;
  
  RETURN TRUE;
END;
$$;
