-- Limpar todas as políticas existentes para patients
DROP POLICY IF EXISTS "Enable delete access for authenticated professionals" ON public.patients;
DROP POLICY IF EXISTS "Enable insert access for authenticated professionals" ON public.patients;
DROP POLICY IF EXISTS "Enable read access for authenticated professionals" ON public.patients;
DROP POLICY IF EXISTS "Enable update access for authenticated professionals" ON public.patients;
DROP POLICY IF EXISTS "Professionals can delete their own patients" ON public.patients;
DROP POLICY IF EXISTS "Professionals can insert their own patients" ON public.patients;
DROP POLICY IF EXISTS "Professionals can update their own patients" ON public.patients;
DROP POLICY IF EXISTS "Professionals can view their own patients" ON public.patients;
DROP POLICY IF EXISTS "Profissionais podem acessar seus próprios pacientes" ON public.patients;
DROP POLICY IF EXISTS "Profissionais podem adicionar pacientes" ON public.patients;
DROP POLICY IF EXISTS "Profissionais podem atualizar seus próprios pacientes" ON public.patients;
DROP POLICY IF EXISTS "Profissionais podem criar pacientes" ON public.patients;
DROP POLICY IF EXISTS "Profissionais podem deletar seus próprios pacientes" ON public.patients;
DROP POLICY IF EXISTS "Profissionais podem inserir pacientes" ON public.patients;
DROP POLICY IF EXISTS "Profissionais podem ler seus próprios pacientes" ON public.patients;
DROP POLICY IF EXISTS "Profissionais podem ver apenas seus próprios pacientes" ON public.patients;
DROP POLICY IF EXISTS "Profissionais podem ver seus pacientes" ON public.patients;
DROP POLICY IF EXISTS "Profissionais podem ver seus próprios pacientes" ON public.patients;
DROP POLICY IF EXISTS "Todos podem inserir pacientes" ON public.patients;
DROP POLICY IF EXISTS "Todos podem visualizar pacientes" ON public.patients;
DROP POLICY IF EXISTS "Users can view their own patients" ON public.patients;
DROP POLICY IF EXISTS "Usuários só podem atualizar seus próprios pacientes" ON public.patients;
DROP POLICY IF EXISTS "Usuários só podem deletar seus próprios pacientes" ON public.patients;
DROP POLICY IF EXISTS "Usuários só podem inserir pacientes associados a eles" ON public.patients;
DROP POLICY IF EXISTS "Usuários só podem ver seus próprios pacientes" ON public.patients;
DROP POLICY IF EXISTS "view_own_patients" ON public.patients;

-- Criar políticas simples e corretas para patients
CREATE POLICY "Users can manage their own patients" 
ON public.patients 
FOR ALL 
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);

-- Limpar políticas duplicadas de anamnesis
DROP POLICY IF EXISTS "Users can view their own anamnesis" ON public.anamnesis;
DROP POLICY IF EXISTS "Users can create their own anamnesis" ON public.anamnesis;
DROP POLICY IF EXISTS "Users can update their own anamnesis" ON public.anamnesis;

-- Limpar políticas duplicadas de reports  
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can create their own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.reports;

-- Adicionar políticas de DELETE que faltam
CREATE POLICY "Users can delete their own anamnesis" 
ON public.anamnesis 
FOR DELETE 
USING (auth.uid() = professional_id);

-- Adicionar políticas UPDATE e DELETE que faltam para treatment_plans
CREATE POLICY "Users can update their own treatment plans" 
ON public.treatment_plans 
FOR UPDATE 
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Users can delete their own treatment plans" 
ON public.treatment_plans 
FOR DELETE 
USING (auth.uid() = professional_id);