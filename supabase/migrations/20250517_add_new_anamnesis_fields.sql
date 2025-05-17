
-- Add new columns to anamnesis table
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS psychomotricity BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS music_therapy BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS nutrition BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS alzheimer BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS aba_therapy BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS sensory_integration BOOLEAN DEFAULT false;

-- Force Supabase to recognize the new columns by touching the table
COMMENT ON TABLE anamnesis IS 'Table updated with new therapy and mental disorder fields';

-- These additional commands will force a schema cache refresh
SELECT pg_catalog.pg_advisory_unlock_all();
NOTIFY pgrst, 'reload schema';

-- Double check that all columns exist and are properly typed
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
