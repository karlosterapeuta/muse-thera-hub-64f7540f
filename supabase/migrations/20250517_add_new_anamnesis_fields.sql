
-- Limpeza de cache antes de iniciar
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
END $$;

-- Adicionar as colunas se não existirem com tratamento mais robusto
DO $$
DECLARE
  column_exists BOOLEAN;
BEGIN
  -- aba_therapy
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'aba_therapy'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE anamnesis ADD COLUMN aba_therapy BOOLEAN DEFAULT false';
  ELSE
    EXECUTE 'ALTER TABLE anamnesis ALTER COLUMN aba_therapy TYPE BOOLEAN USING aba_therapy::BOOLEAN';
    EXECUTE 'ALTER TABLE anamnesis ALTER COLUMN aba_therapy SET DEFAULT false';
  END IF;

  -- psychomotricity
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'psychomotricity'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE anamnesis ADD COLUMN psychomotricity BOOLEAN DEFAULT false';
  ELSE
    EXECUTE 'ALTER TABLE anamnesis ALTER COLUMN psychomotricity TYPE BOOLEAN USING psychomotricity::BOOLEAN';
    EXECUTE 'ALTER TABLE anamnesis ALTER COLUMN psychomotricity SET DEFAULT false';
  END IF;

  -- music_therapy
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'music_therapy'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE anamnesis ADD COLUMN music_therapy BOOLEAN DEFAULT false';
  ELSE
    EXECUTE 'ALTER TABLE anamnesis ALTER COLUMN music_therapy TYPE BOOLEAN USING music_therapy::BOOLEAN';
    EXECUTE 'ALTER TABLE anamnesis ALTER COLUMN music_therapy SET DEFAULT false';
  END IF;

  -- nutrition
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'nutrition'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE anamnesis ADD COLUMN nutrition BOOLEAN DEFAULT false';
  ELSE
    EXECUTE 'ALTER TABLE anamnesis ALTER COLUMN nutrition TYPE BOOLEAN USING nutrition::BOOLEAN';
    EXECUTE 'ALTER TABLE anamnesis ALTER COLUMN nutrition SET DEFAULT false';
  END IF;

  -- sensory_integration
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'sensory_integration'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE anamnesis ADD COLUMN sensory_integration BOOLEAN DEFAULT false';
  ELSE
    EXECUTE 'ALTER TABLE anamnesis ALTER COLUMN sensory_integration TYPE BOOLEAN USING sensory_integration::BOOLEAN';
    EXECUTE 'ALTER TABLE anamnesis ALTER COLUMN sensory_integration SET DEFAULT false';
  END IF;

  -- alzheimer
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'alzheimer'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE anamnesis ADD COLUMN alzheimer BOOLEAN DEFAULT false';
  ELSE
    EXECUTE 'ALTER TABLE anamnesis ALTER COLUMN alzheimer TYPE BOOLEAN USING alzheimer::BOOLEAN';
    EXECUTE 'ALTER TABLE anamnesis ALTER COLUMN alzheimer SET DEFAULT false';
  END IF;
END $$;

-- Atualizar timestamp na tabela para forçar atualização no cache
COMMENT ON TABLE anamnesis IS 'Table updated with new fields at: ' || NOW()::text;

-- Forçar atualização do cache do schema de múltiplas formas
SELECT pg_advisory_unlock_all();
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_notify('pgrst', 'reload config');

-- Atualizar estatísticas da tabela
ANALYZE anamnesis;

-- Verificação final
DO $$
BEGIN
  PERFORM column_name 
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = 'anamnesis' 
    AND column_name IN ('aba_therapy', 'psychomotricity', 'music_therapy', 'nutrition', 'sensory_integration', 'alzheimer');
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Colunas necessárias não foram criadas corretamente';
  END IF;
  
  RAISE NOTICE 'Todas as colunas foram criadas e verificadas com sucesso';
END $$;
