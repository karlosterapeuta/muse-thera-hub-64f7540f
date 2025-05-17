
-- Add new columns to anamnesis table
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS psychomotricity BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS music_therapy BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS nutrition BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS alzheimer BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS aba_therapy BOOLEAN DEFAULT false;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS sensory_integration BOOLEAN DEFAULT false;

-- Force Supabase to recognize the new columns by touching the table
COMMENT ON TABLE anamnesis IS 'Table updated with new therapy and mental disorder fields';

-- Force schema cache refresh
SELECT pg_catalog.pg_advisory_unlock_all();
NOTIFY pgrst, 'reload schema';
