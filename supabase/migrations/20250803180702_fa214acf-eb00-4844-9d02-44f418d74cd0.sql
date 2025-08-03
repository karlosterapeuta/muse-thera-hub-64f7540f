-- Fase 1: Correções de Banco de Dados

-- 1. Habilitar RLS na tabela treatment_plans
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;

-- 2. Criar política RLS para treatment_plans
CREATE POLICY "Users can manage their own treatment plans" 
ON public.treatment_plans 
FOR ALL 
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);

-- 3. Verificar e atualizar política RLS existente se necessário
DROP POLICY IF EXISTS "Users can delete their own treatment plans" ON public.treatment_plans;
DROP POLICY IF EXISTS "Users can update their own treatment plans" ON public.treatment_plans;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir planos terapêuticos" ON public.treatment_plans;
DROP POLICY IF EXISTS "Usuários podem ler seus próprios planos terapêuticos" ON public.treatment_plans;