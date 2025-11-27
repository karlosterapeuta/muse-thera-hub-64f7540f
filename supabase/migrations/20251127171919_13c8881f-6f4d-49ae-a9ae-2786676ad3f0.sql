-- Corrigir thumbnail do curso "NOVIDADADES" (extrair ID do Shorts)
UPDATE courses 
SET thumbnail_url = 'https://img.youtube.com/vi/Wt8VMTmWFLU/maxresdefault.jpg',
    is_published = true
WHERE id = '5d099b16-b255-4913-9ae4-a0fd4c771b42';

-- Criar módulo de introdução para NOVIDADADES
INSERT INTO course_modules (id, course_id, title, description, order_index)
VALUES (
  gen_random_uuid(),
  '5d099b16-b255-4913-9ae4-a0fd4c771b42',
  'Módulo 1: Introdução',
  'Novidades e atualizações do MuseTera',
  0
);

-- Criar aula com YouTube Shorts
INSERT INTO course_lessons (module_id, title, description, youtube_url, duration_minutes, order_index, is_free_preview)
VALUES (
  (SELECT id FROM course_modules WHERE course_id = '5d099b16-b255-4913-9ae4-a0fd4c771b42' ORDER BY created_at DESC LIMIT 1),
  'Novidades do MuseTera',
  'Conheça as últimas novidades e funcionalidades do sistema MuseTera.',
  'https://youtube.com/shorts/Wt8VMTmWFLU',
  1,
  0,
  true
);