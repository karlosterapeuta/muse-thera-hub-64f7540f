-- Adicionar coluna user_id na tabela course_creators para vincular ao Supabase Auth
ALTER TABLE course_creators 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_course_creators_user_id ON course_creators(user_id);

-- Criar função security definer para obter o creator_id do usuário autenticado
CREATE OR REPLACE FUNCTION public.get_creator_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM course_creators 
  WHERE user_id = auth.uid() 
  AND is_active = true
  LIMIT 1
$$;

-- Criar função para verificar se usuário é criador de um curso específico
CREATE OR REPLACE FUNCTION public.is_course_creator(p_course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM courses c
    JOIN course_creators cc ON c.creator_id = cc.id
    WHERE c.id = p_course_id
    AND cc.user_id = auth.uid()
    AND cc.is_active = true
  )
$$;

-- Criar função para verificar se usuário é criador de um módulo específico
CREATE OR REPLACE FUNCTION public.is_module_creator(p_module_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM course_modules m
    JOIN courses c ON m.course_id = c.id
    JOIN course_creators cc ON c.creator_id = cc.id
    WHERE m.id = p_module_id
    AND cc.user_id = auth.uid()
    AND cc.is_active = true
  )
$$;

-- RLS Policies para courses - Criadores podem gerenciar seus próprios cursos
CREATE POLICY "Creators can insert own courses" ON courses
FOR INSERT TO authenticated
WITH CHECK (creator_id = get_creator_id());

CREATE POLICY "Creators can update own courses" ON courses
FOR UPDATE TO authenticated
USING (creator_id = get_creator_id())
WITH CHECK (creator_id = get_creator_id());

CREATE POLICY "Creators can delete own courses" ON courses
FOR DELETE TO authenticated
USING (creator_id = get_creator_id());

CREATE POLICY "Creators can view own unpublished courses" ON courses
FOR SELECT TO authenticated
USING (creator_id = get_creator_id());

-- RLS Policies para course_modules - Criadores podem gerenciar módulos dos seus cursos
CREATE POLICY "Creators can insert own modules" ON course_modules
FOR INSERT TO authenticated
WITH CHECK (is_course_creator(course_id));

CREATE POLICY "Creators can update own modules" ON course_modules
FOR UPDATE TO authenticated
USING (is_course_creator(course_id))
WITH CHECK (is_course_creator(course_id));

CREATE POLICY "Creators can delete own modules" ON course_modules
FOR DELETE TO authenticated
USING (is_course_creator(course_id));

-- RLS Policies para course_lessons - Criadores podem gerenciar aulas dos seus módulos
CREATE POLICY "Creators can insert own lessons" ON course_lessons
FOR INSERT TO authenticated
WITH CHECK (is_module_creator(module_id));

CREATE POLICY "Creators can update own lessons" ON course_lessons
FOR UPDATE TO authenticated
USING (is_module_creator(module_id))
WITH CHECK (is_module_creator(module_id));

CREATE POLICY "Creators can delete own lessons" ON course_lessons
FOR DELETE TO authenticated
USING (is_module_creator(module_id));