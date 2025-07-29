-- Corrigir a política RLS da tabela reports
-- A política atual está verificando professional_id = auth.uid()
-- Mas professional_id é o UUID do profissional, não o user_id
-- Precisamos verificar se o auth.uid() corresponde ao user_id do profissional

DROP POLICY IF EXISTS "Professionals can manage their own reports" ON public.reports;

-- Criar nova política que verifica se o usuário autenticado é o dono do relatório através da tabela professionals
CREATE POLICY "Professionals can manage their own reports" ON public.reports
FOR ALL
USING (
  professional_id IN (
    SELECT id 
    FROM professionals 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  professional_id IN (
    SELECT id 
    FROM professionals 
    WHERE user_id = auth.uid()
  )
);