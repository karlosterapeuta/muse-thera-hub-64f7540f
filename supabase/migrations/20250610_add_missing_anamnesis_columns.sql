
-- Migration to add missing columns to anamnesis table
-- This ensures all columns referenced in the code exist in the database

-- Force PostgreSQL to release schema cache locks
SELECT pg_advisory_unlock_all();

-- Set client messages to notice level
SET client_min_messages TO notice;

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_notify('pgrst', 'reload config');
END $$;

-- Wait for notification processing
SELECT pg_sleep(1);

-- Add missing columns with robust error handling
DO $$
DECLARE
  column_exists BOOLEAN;
BEGIN
  -- epilepsy
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'epilepsy'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN epilepsy BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column epilepsy';
  ELSE
    RAISE NOTICE 'Column epilepsy already exists';
  END IF;

  -- cerebral_palsy
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'cerebral_palsy'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN cerebral_palsy BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column cerebral_palsy';
  ELSE
    RAISE NOTICE 'Column cerebral_palsy already exists';
  END IF;

  -- fragile_x_syndrome
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'fragile_x_syndrome'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN fragile_x_syndrome BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column fragile_x_syndrome';
  ELSE
    RAISE NOTICE 'Column fragile_x_syndrome already exists';
  END IF;

  -- williams_syndrome
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'williams_syndrome'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN williams_syndrome BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column williams_syndrome';
  ELSE
    RAISE NOTICE 'Column williams_syndrome already exists';
  END IF;

  -- depression
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'depression'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN depression BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column depression';
  ELSE
    RAISE NOTICE 'Column depression already exists';
  END IF;

  -- bipolar_disorder
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'bipolar_disorder'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN bipolar_disorder BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column bipolar_disorder';
  ELSE
    RAISE NOTICE 'Column bipolar_disorder already exists';
  END IF;

  -- rett_syndrome
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'rett_syndrome'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN rett_syndrome BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column rett_syndrome';
  ELSE
    RAISE NOTICE 'Column rett_syndrome already exists';
  END IF;

  -- aba_therapy (from previous migration)
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'aba_therapy'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN aba_therapy BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column aba_therapy';
  ELSE
    RAISE NOTICE 'Column aba_therapy already exists';
  END IF;

  -- psychomotricity (from previous migration)
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'psychomotricity'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN psychomotricity BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column psychomotricity';
  ELSE
    RAISE NOTICE 'Column psychomotricity already exists';
  END IF;

  -- music_therapy (from previous migration)
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'music_therapy'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN music_therapy BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column music_therapy';
  ELSE
    RAISE NOTICE 'Column music_therapy already exists';
  END IF;

  -- nutrition (from previous migration)
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'nutrition'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN nutrition BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column nutrition';
  ELSE
    RAISE NOTICE 'Column nutrition already exists';
  END IF;

  -- sensory_integration (from previous migration)
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'sensory_integration'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN sensory_integration BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column sensory_integration';
  ELSE
    RAISE NOTICE 'Column sensory_integration already exists';
  END IF;

  -- alzheimer (from previous migration)
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'alzheimer'
  ) INTO column_exists;
  
  IF NOT column_exists THEN
    EXECUTE 'ALTER TABLE public.anamnesis ADD COLUMN alzheimer BOOLEAN DEFAULT false';
    RAISE NOTICE 'Added column alzheimer';
  ELSE
    RAISE NOTICE 'Column alzheimer already exists';
  END IF;
END $$;

-- Multiple aggressive schema cache refreshes
DO $$
BEGIN
  FOR i IN 1..5 LOOP
    PERFORM pg_notify('pgrst', 'reload schema');
    RAISE NOTICE 'Notified PostgREST to reload schema (attempt %)', i;
    PERFORM pg_sleep(0.5);
  END LOOP;
END $$;

-- Vacuum analyze to update statistics
VACUUM ANALYZE anamnesis;

-- Force cache update
SELECT pg_advisory_unlock_all();
NOTIFY pgrst, 'reload schema';

-- Add comment to force timestamp update
COMMENT ON TABLE anamnesis IS 'Schema updated with all missing therapy and condition fields at ' || now()::text;

-- Final schema reload
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_notify('pgrst', 'reload config');
  RAISE NOTICE 'Final schema reload notification sent';
END $$;

-- Verify all columns were created successfully
DO $$
DECLARE
  missing_columns TEXT := '';
  column_exists BOOLEAN;
BEGIN
  -- Check each column
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'epilepsy') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'epilepsy, '; END IF;
  
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'cerebral_palsy') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'cerebral_palsy, '; END IF;
  
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'fragile_x_syndrome') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'fragile_x_syndrome, '; END IF;
  
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'williams_syndrome') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'williams_syndrome, '; END IF;
  
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'depression') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'depression, '; END IF;
  
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'bipolar_disorder') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'bipolar_disorder, '; END IF;
  
  SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'anamnesis' AND column_name = 'rett_syndrome') INTO column_exists;
  IF NOT column_exists THEN missing_columns := missing_columns || 'rett_syndrome, '; END IF;
  
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
  
  -- Report results
  IF length(missing_columns) > 0 THEN
    RAISE EXCEPTION 'The following columns were not created successfully: %', missing_columns;
  ELSE
    RAISE NOTICE 'All columns were successfully created and verified';
  END IF;
END $$;
