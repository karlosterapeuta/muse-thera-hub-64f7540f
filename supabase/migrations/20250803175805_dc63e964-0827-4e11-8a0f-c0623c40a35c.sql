-- Habilitar RLS nas tabelas que precisam
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;

-- Criar políticas para treatment_plans
CREATE POLICY "Users can view their own treatment plans" 
ON public.treatment_plans 
FOR SELECT 
USING (auth.uid() = professional_id);

CREATE POLICY "Users can create their own treatment plans" 
ON public.treatment_plans 
FOR INSERT 
WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Users can update their own treatment plans" 
ON public.treatment_plans 
FOR UPDATE 
USING (auth.uid() = professional_id);

CREATE POLICY "Users can delete their own treatment plans" 
ON public.treatment_plans 
FOR DELETE 
USING (auth.uid() = professional_id);

-- Criar políticas mais permissivas para acesso aos dados do dashboard
-- Permitir que usuários vejam seus próprios dados através de todas as tabelas necessárias

-- Políticas para patients
DROP POLICY IF EXISTS "Allow authenticated users to view patients" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated users to insert patients" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated users to update patients" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated users to delete patients" ON public.patients;

CREATE POLICY "Users can view their own patients" 
ON public.patients 
FOR SELECT 
USING (auth.uid() = professional_id);

CREATE POLICY "Users can create their own patients" 
ON public.patients 
FOR INSERT 
WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Users can update their own patients" 
ON public.patients 
FOR UPDATE 
USING (auth.uid() = professional_id);

CREATE POLICY "Users can delete their own patients" 
ON public.patients 
FOR DELETE 
USING (auth.uid() = professional_id);

-- Políticas para anamnesis
CREATE POLICY "Users can view their own anamnesis" 
ON public.anamnesis 
FOR SELECT 
USING (auth.uid() = professional_id);

CREATE POLICY "Users can create their own anamnesis" 
ON public.anamnesis 
FOR INSERT 
WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Users can update their own anamnesis" 
ON public.anamnesis 
FOR UPDATE 
USING (auth.uid() = professional_id);

-- Políticas para reports
CREATE POLICY "Users can view their own reports" 
ON public.reports 
FOR SELECT 
USING (auth.uid() = professional_id);

CREATE POLICY "Users can create their own reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Users can update their own reports" 
ON public.reports 
FOR UPDATE 
USING (auth.uid() = professional_id);

-- Políticas para financial_records
CREATE POLICY "Users can view their own financial records" 
ON public.financial_records 
FOR SELECT 
USING (auth.uid() = professional_id);

CREATE POLICY "Users can create their own financial records" 
ON public.financial_records 
FOR INSERT 
WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Users can update their own financial records" 
ON public.financial_records 
FOR UPDATE 
USING (auth.uid() = professional_id);

CREATE POLICY "Users can delete their own financial records" 
ON public.financial_records 
FOR DELETE 
USING (auth.uid() = professional_id);