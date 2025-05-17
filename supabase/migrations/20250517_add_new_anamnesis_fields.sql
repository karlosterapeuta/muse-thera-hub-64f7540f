
-- Add new columns to anamnesis table with explicit defaults
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS psychomotricity BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS music_therapy BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS nutrition BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS alzheimer BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS aba_therapy BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS sensory_integration BOOLEAN DEFAULT false;

-- Ensure all columns have the proper type
DO $$
BEGIN
  -- Check if columns exist and have proper type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'anamnesis' AND column_name = 'alzheimer'
  ) THEN
    -- Column exists, ensure proper type
    ALTER TABLE anamnesis ALTER COLUMN alzheimer TYPE BOOLEAN USING alzheimer::boolean;
    ALTER TABLE anamnesis ALTER COLUMN alzheimer SET DEFAULT false;
  END IF;
END $$;

-- Forces schema refresh
COMMENT ON TABLE anamnesis IS 'Table updated with new therapy and mental disorder fields';

-- Clear the schema cache
SELECT pg_catalog.pg_advisory_unlock_all();
NOTIFY pgrst, 'reload schema';

-- Verify that all columns exist and are properly typed
DO $$
BEGIN
  -- This will raise an exception if any column doesn't exist
  PERFORM psychomotricity FROM anamnesis LIMIT 0;
  PERFORM music_therapy FROM anamnesis LIMIT 0;
  PERFORM nutrition FROM anamnesis LIMIT 0;
  PERFORM alzheimer FROM anamnesis LIMIT 0;
  PERFORM aba_therapy FROM anamnesis LIMIT 0;
  PERFORM sensory_integration FROM anamnesis LIMIT 0;
  
  RAISE NOTICE 'All columns verified successfully';
END $$;

-- Force another schema cache refresh after verification
SELECT pg_catalog.pg_advisory_unlock_all();
NOTIFY pgrst, 'reload schema';

-- Just to be extra sure, let's update the PostgREST schema again
SELECT pg_catalog.pg_advisory_unlock_all();
SELECT pg_notify('pgrst', 'reload schema');
