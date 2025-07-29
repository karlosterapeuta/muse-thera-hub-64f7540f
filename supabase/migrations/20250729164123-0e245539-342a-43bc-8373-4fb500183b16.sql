-- Inserir alguns pacientes de exemplo para testar
-- Usando o professional_id correto que já existe na tabela professionals
INSERT INTO public.patients (name, birth_date, age, professional_id, contact, responsible)
VALUES 
  ('João Silva', '2015-03-15', 9, (SELECT id FROM professionals WHERE user_id = 'b4ce7f79-b88c-42af-8752-e695085dd22c'), '(81) 98765-4321', 'Maria Silva'),
  ('Ana Costa', '2012-08-22', 12, (SELECT id FROM professionals WHERE user_id = 'b4ce7f79-b88c-42af-8752-e695085dd22c'), '(81) 99876-5432', 'José Costa'),
  ('Pedro Santos', '2017-12-10', 7, (SELECT id FROM professionals WHERE user_id = 'b4ce7f79-b88c-42af-8752-e695085dd22c'), '(81) 97654-3210', 'Carla Santos'),
  ('Lucia Oliveira', '2014-06-05', 10, (SELECT id FROM professionals WHERE user_id = 'b4ce7f79-b88c-42af-8752-e695085dd22c'), '(81) 96543-2109', 'Roberto Oliveira');