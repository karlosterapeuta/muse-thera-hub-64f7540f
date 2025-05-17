
-- Drop and recreate the migration to ensure clean execution
-- First, explicitly create each column if it doesn't exist
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS psychomotricity BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS music_therapy BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS nutrition BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS alzheimer BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS aba_therapy BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS sensory_integration BOOLEAN DEFAULT false;

-- Explicit type conversions and default value settings
ALTER TABLE anamnesis ALTER COLUMN psychomotricity SET DATA TYPE BOOLEAN USING COALESCE(psychomotricity::boolean, false);
ALTER TABLE anamnesis ALTER COLUMN music_therapy SET DATA TYPE BOOLEAN USING COALESCE(music_therapy::boolean, false);
ALTER TABLE anamnesis ALTER COLUMN nutrition SET DATA TYPE BOOLEAN USING COALESCE(nutrition::boolean, false);
ALTER TABLE anamnesis ALTER COLUMN alzheimer SET DATA TYPE BOOLEAN USING COALESCE(alzheimer::boolean, false);
ALTER TABLE anamnesis ALTER COLUMN aba_therapy SET DATA TYPE BOOLEAN USING COALESCE(aba_therapy::boolean, false);
ALTER TABLE anamnesis ALTER COLUMN sensory_integration SET DATA TYPE BOOLEAN USING COALESCE(sensory_integration::boolean, false);

-- Make sure default values are set for all columns
ALTER TABLE anamnesis ALTER COLUMN psychomotricity SET DEFAULT false;
ALTER TABLE anamnesis ALTER COLUMN music_therapy SET DEFAULT false;
ALTER TABLE anamnesis ALTER COLUMN nutrition SET DEFAULT false;
ALTER TABLE anamnesis ALTER COLUMN alzheimer SET DEFAULT false;
ALTER TABLE anamnesis ALTER COLUMN aba_therapy SET DEFAULT false;
ALTER TABLE anamnesis ALTER COLUMN sensory_integration SET DEFAULT false;

-- Update comment with timestamp to force schema refresh
COMMENT ON TABLE anamnesis IS 'Table updated with alzheimer and other fields at: ' || NOW()::text;

-- Force schema cache refresh using multiple approaches
SELECT pg_catalog.pg_advisory_unlock_all();

-- Multiple notification approaches to ensure cache is refreshed
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_notify('pgrst', 'reload config');

-- Wait a moment and try again with another notification
DO $$
BEGIN
  PERFORM pg_sleep(1);
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_notify('pgrst', 'reload config');
END $$;

-- More aggressive schema refresh
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Update table statistics
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'anamnesis'
  LOOP
    EXECUTE 'ANALYZE ' || quote_ident(r.tablename);
  END LOOP;
  
  -- Issue more notifications
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_sleep(1);
  PERFORM pg_notify('pgrst', 'reload schema');
END $$;

-- One final cache flush attempt
SELECT pg_notify('pgrst', 'reload schema');
NOTIFY pgrst, 'reload schema';

-- Verification step
DO $$
BEGIN
  -- This will raise an error if any column doesn't exist
  PERFORM psychomotricity::boolean FROM anamnesis LIMIT 0;
  PERFORM music_therapy::boolean FROM anamnesis LIMIT 0;
  PERFORM nutrition::boolean FROM anamnesis LIMIT 0;
  PERFORM alzheimer::boolean FROM anamnesis LIMIT 0;
  PERFORM aba_therapy::boolean FROM anamnesis LIMIT 0;
  PERFORM sensory_integration::boolean FROM anamnesis LIMIT 0;
  
  RAISE NOTICE 'All columns verified successfully';
END $$;
