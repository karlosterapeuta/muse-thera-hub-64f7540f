-- Permitir que admins vejam todos os profissionais (para visualizar emails no painel de usuários)
CREATE POLICY "Admins can view all professionals"
ON public.professionals
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  )
);