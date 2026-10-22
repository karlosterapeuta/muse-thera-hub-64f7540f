ALTER TABLE public.clinical_documents ADD COLUMN IF NOT EXISTS legacy_removed_at timestamptz;
CREATE INDEX IF NOT EXISTS clinical_docs_legacy_cleanup_idx ON public.clinical_documents(legacy_verified_at,legacy_removed_at) WHERE legacy_source_bucket='clinical-pdfs';
-- A removal timestamp may only be written by service role.
REVOKE UPDATE ON public.clinical_documents FROM anon,authenticated;
