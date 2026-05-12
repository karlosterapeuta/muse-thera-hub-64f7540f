
-- 1) Digital signatures: make bucket private and remove broad policies
UPDATE storage.buckets SET public = false WHERE id = 'digital-signatures';

DROP POLICY IF EXISTS "Public can view digital signatures" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload digital signatures" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own digital signatures" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own digital signatures" ON storage.objects;
-- Path-scoped policies already exist:
--   "Users can view their own digital signatures" (SELECT)
--   "Users can upload their own digital signatures" (INSERT)
--   "Users can update their own digital signatures" (UPDATE)
--   "Users can delete their own digital signatures" (DELETE)

-- 2) Course thumbnails: drop unscoped write policies (path-scoped versions exist)
DROP POLICY IF EXISTS "Users can update own course thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own course thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload course thumbnails" ON storage.objects;

-- 3) Report logos: drop unscoped policies (path-scoped versions exist)
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload de logos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar suas logos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar suas logos" ON storage.objects;

-- 4) Avatars: drop unscoped INSERT policy (path-scoped INSERT exists)
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;

-- 5) Realtime: remove profiles from publication (no client subscribes to it)
ALTER PUBLICATION supabase_realtime DROP TABLE public.profiles;
