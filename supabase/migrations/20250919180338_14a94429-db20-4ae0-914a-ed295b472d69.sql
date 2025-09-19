-- Tornar o bucket digital-signatures público para permitir URLs públicas
UPDATE storage.buckets 
SET public = true 
WHERE id = 'digital-signatures';