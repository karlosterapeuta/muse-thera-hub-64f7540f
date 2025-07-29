-- Primeiro, vamos verificar e corrigir a constraint da tabela patients
-- A tabela patients deve referenciar professionals, não profiles

-- Verificar se existe uma constraint incorreta
SELECT conname, contype, pg_get_constraintdef(oid) as constraint_def
FROM pg_constraint 
WHERE conrelid = 'patients'::regclass 
AND contype = 'f';

-- Remover a constraint incorreta se existir
ALTER TABLE patients DROP CONSTRAINT IF EXISTS patients_professional_id_fkey;

-- Adicionar a constraint correta para referenciar professionals
ALTER TABLE patients 
ADD CONSTRAINT patients_professional_id_fkey 
FOREIGN KEY (professional_id) REFERENCES professionals(id);