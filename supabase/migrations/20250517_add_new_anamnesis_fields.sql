
-- Add new columns to anamnesis table
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS psychomotricity BOOLEAN;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS music_therapy BOOLEAN;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS nutrition BOOLEAN;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS alzheimer BOOLEAN;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS aba_therapy BOOLEAN;
ALTER TABLE anamnesis ADD COLUMN IF NOT EXISTS sensory_integration BOOLEAN;
