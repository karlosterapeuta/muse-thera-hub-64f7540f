-- Corrigir o expires_at do usuário teste1 para 30 minutos após sua criação
UPDATE profiles 
SET expires_at = created_at + INTERVAL '30 minutes'
WHERE id = '84310732-0428-40de-8298-108bcc67e099';