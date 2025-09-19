-- Clean up conflicting RLS policies on anamnesis table
DROP POLICY IF EXISTS "Profissionais podem atualizar anamneses que criaram" ON public.anamnesis;
DROP POLICY IF EXISTS "Profissionais podem criar anamneses" ON public.anamnesis;
DROP POLICY IF EXISTS "Profissionais podem ver anamneses que criaram" ON public.anamnesis;

-- Keep only the simple policies that use auth.uid() = professional_id
-- These policies are already in place and working:
-- "Enable insert for professionals" 
-- "Enable read access for professionals"
-- "Enable update for professionals" 
-- "Users can delete their own anamnesis"