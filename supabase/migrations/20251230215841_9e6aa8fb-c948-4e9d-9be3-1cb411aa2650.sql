-- Adicionar coluna plan_start_date na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN plan_start_date timestamp with time zone;

-- Para usuários existentes, definir plan_start_date = created_at como padrão inicial
UPDATE public.profiles 
SET plan_start_date = created_at 
WHERE plan_start_date IS NULL;