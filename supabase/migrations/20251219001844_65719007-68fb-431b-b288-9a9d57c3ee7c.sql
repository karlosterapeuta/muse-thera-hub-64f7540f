-- Publicar o curso "TIO SOM" e corrigir created_by
UPDATE courses 
SET 
  created_by = 'd200d9c9-487c-41fa-ba08-958d4234a715',
  is_published = true
WHERE id = '157d5ae6-0c21-4792-b859-31414d0c4cf2';

-- Corrigir todos os cursos que têm created_by NULL mas têm creator_id
UPDATE courses c
SET created_by = cc.user_id
FROM course_creators cc
WHERE c.creator_id = cc.id
AND c.created_by IS NULL
AND cc.user_id IS NOT NULL;