
-- First, create the columns if they don't exist
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS psychomotricity BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS music_therapy BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS nutrition BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS alzheimer BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS aba_therapy BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS sensory_integration BOOLEAN DEFAULT false;

-- Make sure the columns have the correct type and default value
DO $$
BEGIN
  -- Ensure proper type for all new columns
  ALTER TABLE anamnesis ALTER COLUMN psychomotricity TYPE BOOLEAN USING psychomotricity::boolean;
  ALTER TABLE anamnesis ALTER COLUMN music_therapy TYPE BOOLEAN USING music_therapy::boolean;
  ALTER TABLE anamnesis ALTER COLUMN nutrition TYPE BOOLEAN USING nutrition::boolean;
  ALTER TABLE anamnesis ALTER COLUMN alzheimer TYPE BOOLEAN USING alzheimer::boolean;
  ALTER TABLE anamnesis ALTER COLUMN aba_therapy TYPE BOOLEAN USING aba_therapy::boolean;
  ALTER TABLE anamnesis ALTER COLUMN sensory_integration TYPE BOOLEAN USING sensory_integration::boolean;
  
  -- Set default values explicitly
  ALTER TABLE anamnesis ALTER COLUMN psychomotricity SET DEFAULT false;
  ALTER TABLE anamnesis ALTER COLUMN music_therapy SET DEFAULT false;
  ALTER TABLE anamnesis ALTER COLUMN nutrition SET DEFAULT false;
  ALTER TABLE anamnesis ALTER COLUMN alzheimer SET DEFAULT false;
  ALTER TABLE anamnesis ALTER COLUMN aba_therapy SET DEFAULT false;
  ALTER TABLE anamnesis ALTER COLUMN sensory_integration SET DEFAULT false;
END $$;

-- Add a timestamp to force schema refresh
COMMENT ON TABLE anamnesis IS 'Table updated with new therapy and mental disorder fields at time: ' || NOW();

-- Multiple approaches to force schema cache refresh
SELECT pg_catalog.pg_advisory_unlock_all();
NOTIFY pgrst, 'reload schema';

-- Force immediate cache invalidation
SELECT pg_notify('pgrst', 'reload schema');

-- Add another notification with a different approach
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload config');
  PERFORM pg_notify('pgrst', 'reload schema');
END $$;

-- Verify all columns exist and are properly typed
DO $$
BEGIN
  -- This will raise an exception if any column doesn't exist or has wrong type
  PERFORM psychomotricity::boolean FROM anamnesis LIMIT 0;
  PERFORM music_therapy::boolean FROM anamnesis LIMIT 0;
  PERFORM nutrition::boolean FROM anamnesis LIMIT 0;
  PERFORM alzheimer::boolean FROM anamnesis LIMIT 0;
  PERFORM aba_therapy::boolean FROM anamnesis LIMIT 0;
  PERFORM sensory_integration::boolean FROM anamnesis LIMIT 0;
  
  RAISE NOTICE 'All columns verified successfully';
END $$;

-- One final schema refresh
SELECT pg_catalog.pg_advisory_unlock_all();
SELECT pg_notify('pgrst', 'reload schema');
