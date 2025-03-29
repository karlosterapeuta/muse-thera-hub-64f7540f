
-- Add association column to professionals table
ALTER TABLE IF EXISTS public.professionals 
ADD COLUMN IF NOT EXISTS association text;
