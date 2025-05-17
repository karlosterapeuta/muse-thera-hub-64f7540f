
-- First, let's force PostgreSQL to release all schema cache locks
SELECT pg_advisory_unlock_all();

-- Set client_min_messages to notice to see our output
SET client_min_messages TO notice;

-- Force a schema cache refresh before we begin
NOTIFY pgrst, 'reload schema';
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_notify('pgrst', 'reload config');
END $$;

-- Wait a moment to ensure notification is processed
SELECT pg_sleep(1);

-- Add or update each column with a more robust approach
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
    RAISE NOTICE 'Added column aba_therapy';
  ELSE
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN aba_therapy TYPE BOOLEAN USING aba_therapy::BOOLEAN';
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN aba_therapy SET DEFAULT false';
    RAISE NOTICE 'Updated column aba_therapy';
  END IF;

  -- psychomotricity
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'psychomotricity'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN psychomotricity BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column psychomotricity';
  ELSE
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN psychomotricity TYPE BOOLEAN USING psychomotricity::BOOLEAN';
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN psychomotricity SET DEFAULT false';
    RAISE NOTICE 'Updated column psychomotricity';
  END IF;

  -- music_therapy
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'music_therapy'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN music_therapy BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column music_therapy';
  ELSE
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN music_therapy TYPE BOOLEAN USING music_therapy::BOOLEAN';
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN music_therapy SET DEFAULT false';
    RAISE NOTICE 'Updated column music_therapy';
  END IF;

  -- nutrition
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'nutrition'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN nutrition BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column nutrition';
  ELSE
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN nutrition TYPE BOOLEAN USING nutrition::BOOLEAN';
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN nutrition SET DEFAULT false';
    RAISE NOTICE 'Updated column nutrition';
  END IF;

  -- sensory_integration
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'sensory_integration'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN sensory_integration BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column sensory_integration';
  ELSE
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN sensory_integration TYPE BOOLEAN USING sensory_integration::BOOLEAN';
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN sensory_integration SET DEFAULT false';
    RAISE NOTICE 'Updated column sensory_integration';
  END IF;

  -- alzheimer
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'alzheimer'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN alzheimer BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column alzheimer';
  ELSE
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN alzheimer TYPE BOOLEAN USING alzheimer::BOOLEAN';
    EXECUTE 'ALTER TABLE public.anamnesis ALTER COLUMN alzheimer SET DEFAULT false';
    RAISE NOTICE 'Updated column alzheimer';
  END IF;
END $$;

-- Force Supabase to refresh the schema cache
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
  RAISE NOTICE 'Notified PostgREST to reload schema';
END $$;

-- Wait a moment to ensure notification is processed
SELECT pg_sleep(1);

-- Vacuum analyze the table to update statistics
VACUUM ANALYZE anamnesis;

-- Force the cache to update one more time
SELECT pg_advisory_unlock_all();
NOTIFY pgrst, 'reload schema';

-- Add a comment to the table to force a timestamp update
COMMENT ON TABLE anamnesis IS 'Schema updated with new therapy fields at ' || now()::text;

-- Perform another schema reload
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_notify('pgrst', 'reload config');
  RAISE NOTICE 'Final schema reload notification sent';
END $$;

-- Verify the columns were added successfully
DO $$
DECLARE
  missing_columns TEXT := '';
  column_exists BOOLEAN;
BEGIN
  -- Check each column
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
  
  -- Check if any columns are missing
  IF length(missing_columns) > 0 THEN
    RAISE EXCEPTION 'The following columns were not created successfully: %', missing_columns;
  ELSE
    RAISE NOTICE 'All columns were successfully created and verified';
  END IF;
END $$;
