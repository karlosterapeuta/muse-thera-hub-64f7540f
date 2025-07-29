-- Primeiro, limpar dados órfãos da tabela patients
DELETE FROM patients 
WHERE professional_id NOT IN (SELECT id FROM professionals);

-- Agora inserir pacientes de exemplo para o profissional correto
INSERT INTO public.patients (name, birth_date, age, professional_id, contact, responsible)
VALUES 
  ('João Silva', '2015-03-15', 9, 'f439ba27-9f9c-48e5-afcd-391f57d04f01', '(81) 98765-4321', 'Maria Silva'),
  ('Ana Costa', '2012-08-22', 12, 'f439ba27-9f9c-48e5-afcd-391f57d04f01', '(81) 99876-5432', 'José Costa'),
  ('Pedro Santos', '2017-12-10', 7, 'f439ba27-9f9c-48e5-afcd-391f57d04f01', '(81) 97654-3210', 'Carla Santos'),
  ('Lucia Oliveira', '2014-06-05', 10, 'f439ba27-9f9c-48e5-afcd-391f57d04f01', '(81) 96543-2109', 'Roberto Oliveira');