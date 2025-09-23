-- Atualizar relatórios existentes com professional_id nulo para o profissional correto
UPDATE reports 
SET professional_id = 'f439ba27-9f9c-48e5-afcd-391f57d04f01' 
WHERE professional_id IS NULL 
AND patient_id IN (
  SELECT id FROM patients 
  WHERE professional_id = 'b4ce7f79-b88c-42af-8752-e695085dd22c'
);