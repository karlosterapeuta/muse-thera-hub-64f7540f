-- Arquivamento legível do Storage histórico para Cloudflare R2 privado.
-- Migração aditiva, sem apagar, mover, sobrescrever ou ler arquivos clínicos.
ALTER TABLE public.clinical_documents
  ADD COLUMN IF NOT EXISTS legacy_source_bucket text,
  ADD COLUMN IF NOT EXISTS legacy_source_path text,
  ADD COLUMN IF NOT EXISTS legacy_verified_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS clinical_docs_unique_legacy_source
ON public.clinical_documents(legacy_source_bucket,legacy_source_path)
WHERE legacy_source_bucket IS NOT NULL AND legacy_source_path IS NOT NULL;

-- A origem histórica não pode ser forjada em inserts do navegador.
REVOKE INSERT ON public.clinical_documents FROM authenticated;
GRANT INSERT (
  id, owner_user_id, patient_id, provider, object_key, filename,
  document_kind, mime_type, byte_size, sha256_hex, created_at
) ON public.clinical_documents TO authenticated;

-- Somente um administrador com sessão Supabase válida pode requisitar
-- a próxima origem elegível. A consulta nunca modifica arquivos.
CREATE OR REPLACE FUNCTION public.admin_next_legacy_clinical_pdf()
RETURNS TABLE(source_path text, owner_user_id uuid, expected_bytes bigint, document_kind text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public'
AS $body$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role('admin'::public.app_role) THEN
    RAISE EXCEPTION 'Acesso restrito ao administrador' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
  SELECT
    o.name::text,
    o.owner_id::uuid,
    (o.metadata->>'size')::bigint,
    split_part(o.name, '/', 2)::text
  FROM storage.objects o
  WHERE o.bucket_id='clinical-pdfs'
    AND o.owner_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    AND split_part(o.name,'/',1) = o.owner_id
    AND split_part(o.name,'/',2) IN ('anamnesis','evaluation','report','intervention','session','treatment-plan')
    AND o.metadata->>'mimetype'='application/pdf'
    AND o.metadata->>'size' ~ '^[0-9]+$'
    AND (o.metadata->>'size')::bigint BETWEEN 1 AND 20971520
    AND EXISTS (SELECT 1 FROM auth.users au WHERE au.id=o.owner_id::uuid)
    AND NOT EXISTS (
      SELECT 1 FROM public.clinical_documents cd
      WHERE cd.legacy_source_bucket='clinical-pdfs' AND cd.legacy_source_path=o.name
    )
  ORDER BY o.created_at ASC, o.id
  LIMIT 1;
END;
$body$;

REVOKE ALL ON FUNCTION public.admin_next_legacy_clinical_pdf() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_next_legacy_clinical_pdf() TO authenticated;

COMMENT ON FUNCTION public.admin_next_legacy_clinical_pdf() IS
  'Somente administrador. Localiza PDF legado elegível sem alterar Storage. Requer autenticação.';

-- Lembrete de segurança: não existe função SQL de exclusão de PDFs.
