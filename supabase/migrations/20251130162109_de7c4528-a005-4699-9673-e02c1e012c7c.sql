-- Função para definir expiração para usuários sem data definida (exceto admin)
CREATE OR REPLACE FUNCTION public.set_default_expiration_for_users(
  default_days integer DEFAULT 365
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  updated_count integer;
BEGIN
  -- Atualiza apenas usuários que:
  -- 1. Não são admin
  -- 2. Têm expires_at NULL
  UPDATE profiles p
  SET expires_at = NOW() + (default_days || ' days')::INTERVAL,
      updated_at = NOW()
  WHERE p.expires_at IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = p.id 
      AND ur.role = 'admin'
    );
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Executar a função para definir 365 dias de acesso para todos os usuários não-admin
SELECT set_default_expiration_for_users(365);