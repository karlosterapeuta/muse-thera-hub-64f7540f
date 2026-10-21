-- Piloto: migrar inicialmente SOMENTE arquivo pertencente ao usuário administrador.
-- Posteriormente, habilitar demais proprietários com procedimento auditado.
CREATE OR REPLACE FUNCTION public.admin_next_legacy_clinical_pdf()
RETURNS TABLE(source_path text, owner_user_id uuid, expected_bytes bigint, document_kind text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public'
AS $body$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role('admin'::public.app_role) THEN
    RAISE EXCEPTION 'Acesso restrito ao administrador' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
  SELECT o.name::text,o.owner_id::uuid,(o.metadata->>'size')::bigint,split_part(o.name,'/',2)::text
  FROM storage.objects o
  WHERE o.bucket_id='clinical-pdfs'
    AND o.owner_id=auth.uid()::text
    AND split_part(o.name,'/',1)=o.owner_id
    AND split_part(o.name,'/',2) IN ('anamnesis','evaluation','report','intervention','session','treatment-plan')
    AND o.metadata->>'mimetype'='application/pdf'
    AND o.metadata->>'size' ~ '^[0-9]+$'
    AND (o.metadata->>'size')::bigint BETWEEN 1 AND 20971520
    AND NOT EXISTS(
      SELECT 1 FROM public.clinical_documents cd WHERE cd.legacy_source_bucket='clinical-pdfs' AND cd.legacy_source_path=o.name
    )
  ORDER BY o.created_at, o.id
  LIMIT 1;
END;
$body$;
REVOKE ALL ON FUNCTION public.admin_next_legacy_clinical_pdf() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.admin_next_legacy_clinical_pdf() TO authenticated;
