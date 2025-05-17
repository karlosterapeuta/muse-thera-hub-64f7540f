
-- Forçar atualização do schema cache antes de adicionar colunas
SELECT pg_advisory_unlock_all();
NOTIFY pgrst, 'reload schema';

-- Forçar limpeza de cache antes de iniciar
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_notify('pgrst', 'reload config');
END $$;

-- Adicionar as colunas com verificação de existência
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
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN aba_therapy BOOLEAN DEFAULT false';
    RAISE NOTICE 'Coluna aba_therapy adicionada';
  ELSE
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN aba_therapy TYPE BOOLEAN USING aba_therapy::BOOLEAN';
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN aba_therapy SET DEFAULT false';
    RAISE NOTICE 'Coluna aba_therapy atualizada';
  END IF;

  -- psychomotricity
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'psychomotricity'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN psychomotricity BOOLEAN DEFAULT false';
    RAISE NOTICE 'Coluna psychomotricity adicionada';
  ELSE
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN psychomotricity TYPE BOOLEAN USING psychomotricity::BOOLEAN';
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN psychomotricity SET DEFAULT false';
    RAISE NOTICE 'Coluna psychomotricity atualizada';
  END IF;

  -- music_therapy
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'music_therapy'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN music_therapy BOOLEAN DEFAULT false';
    RAISE NOTICE 'Coluna music_therapy adicionada';
  ELSE
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN music_therapy TYPE BOOLEAN USING music_therapy::BOOLEAN';
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN music_therapy SET DEFAULT false';
    RAISE NOTICE 'Coluna music_therapy atualizada';
  END IF;

  -- nutrition
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'nutrition'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN nutrition BOOLEAN DEFAULT false';
    RAISE NOTICE 'Coluna nutrition adicionada';
  ELSE
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN nutrition TYPE BOOLEAN USING nutrition::BOOLEAN';
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN nutrition SET DEFAULT false';
    RAISE NOTICE 'Coluna nutrition atualizada';
  END IF;

  -- sensory_integration
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'sensory_integration'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN sensory_integration BOOLEAN DEFAULT false';
    RAISE NOTICE 'Coluna sensory_integration adicionada';
  ELSE
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN sensory_integration TYPE BOOLEAN USING sensory_integration::BOOLEAN';
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN sensory_integration SET DEFAULT false';
    RAISE NOTICE 'Coluna sensory_integration atualizada';
  END IF;

  -- alzheimer
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'alzheimer'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN alzheimer BOOLEAN DEFAULT false';
    RAISE NOTICE 'Coluna alzheimer adicionada';
  ELSE
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN alzheimer TYPE BOOLEAN USING alzheimer::BOOLEAN';
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN alzheimer SET DEFAULT false';
    RAISE NOTICE 'Coluna alzheimer atualizada';
  END IF;
END $$;

-- Atualizar timestamp na tabela para forçar atualização no cache
COMMENT ON TABLE anamnesis IS 'Table updated with new fields at: ' || NOW()::text;

-- Forçar atualização do cache do schema de múltiplas formas
SELECT pg_advisory_unlock_all();
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_notify('pgrst', 'reload config');

-- Forçar vacuum e analyze para atualizar estatísticas da tabela
VACUUM ANALYZE anamnesis;

-- Verificar se as colunas foram criadas
DO $$
DECLARE
  missing_columns TEXT := '';
  column_exists BOOLEAN;
BEGIN
  -- Verificar cada coluna
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'aba_therapy') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'aba_therapy, '; END IF;
  
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'psychomotricity') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'psychomotricity, '; END IF;
  
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'music_therapy') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'music_therapy, '; END IF;
  
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'nutrition') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'nutrition, '; END IF;
  
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'sensory_integration') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'sensory_integration, '; END IF;
  
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'alzheimer') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'alzheimer, '; END IF;
  
  -- Verificar se há colunas faltando
  IF length(missing_columns) > 0 THEN
    RAISE EXCEPTION 'As seguintes colunas não foram criadas corretamente: %', missing_columns;
  ELSE
    RAISE NOTICE 'Todas as colunas foram criadas e verificadas com sucesso';
  END IF;
END $$;

-- Refresh do cache uma última vez antes de terminar
SELECT pg_notify('pgrst', 'reload schema');
