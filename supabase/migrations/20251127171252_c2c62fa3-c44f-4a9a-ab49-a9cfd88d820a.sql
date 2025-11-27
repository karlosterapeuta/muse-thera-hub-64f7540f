-- Corrigir thumbnail do curso "teste"
UPDATE courses 
SET thumbnail_url = 'https://img.youtube.com/vi/muKorppBmQI/maxresdefault.jpg'
WHERE id = '484be0e9-5fc5-49f3-9232-d8046eda997f';

-- Criar módulo de introdução
INSERT INTO course_modules (id, course_id, title, description, order_index)
VALUES (
  gen_random_uuid(),
  '484be0e9-5fc5-49f3-9232-d8046eda997f',
  'Módulo 1: Introdução',
  'Aulas introdutórias do curso',
  0
);

-- Criar aula de teste com vídeo do YouTube
INSERT INTO course_lessons (module_id, title, description, youtube_url, duration_minutes, order_index, is_free_preview)
VALUES (
  (SELECT id FROM course_modules WHERE course_id = '484be0e9-5fc5-49f3-9232-d8046eda997f' ORDER BY created_at DESC LIMIT 1),
  'Aula 1: Bem-vindo ao Curso',
  'Nesta aula introdutória, você conhecerá os principais conceitos que serão abordados.',
  'https://www.youtube.com/watch?v=muKorppBmQI',
  5,
  0,
  true
);