-- Limpar compras órfãs (onde o curso foi deletado)
DELETE FROM course_purchases 
WHERE course_id IS NULL;

-- Limpar acessos órfãos
DELETE FROM course_access 
WHERE course_id IS NULL;