-- Adicionar campos para carimbo e assinatura digital na tabela professionals
ALTER TABLE professionals 
ADD COLUMN IF NOT EXISTS digital_signature_url TEXT,
ADD COLUMN IF NOT EXISTS digital_stamp_url TEXT;

-- Comentários para documentação
COMMENT ON COLUMN professionals.digital_signature_url IS 'URL da assinatura digital do profissional armazenada no Supabase Storage';
COMMENT ON COLUMN professionals.digital_stamp_url IS 'URL do carimbo digital do profissional armazenado no Supabase Storage';