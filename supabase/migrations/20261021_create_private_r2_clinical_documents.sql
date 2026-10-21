-- Documentos privados do MuseTera no Cloudflare R2.
-- Mantém somente metadados no PostgreSQL; NÃO altera PDFs já armazenados no Supabase.
create table if not exists public.clinical_documents (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  patient_id uuid references public.patients(id) on delete set null,
  provider text not null default 'cloudflare_r2' check (provider = 'cloudflare_r2'),
  object_key text not null unique,
  filename text not null,
  document_kind text not null check (document_kind in ('anamnesis','report','evaluation','treatment-plan','intervention','session')),
  mime_type text not null default 'application/pdf' check (mime_type = 'application/pdf'),
  byte_size bigint not null check (byte_size > 0 and byte_size <= 20971520),
  sha256_hex text not null check (sha256_hex ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  constraint clinical_documents_private_owner_prefix check (object_key like owner_user_id::text || '/%')
);

create index if not exists clinical_documents_owner_created_idx
on public.clinical_documents(owner_user_id, created_at desc);

create index if not exists clinical_documents_patient_idx
on public.clinical_documents(patient_id);

alter table public.clinical_documents enable row level security;

-- Leitura apenas do próprio profissional; sem permissão pública.
create policy "clinical_documents_select_owner"
on public.clinical_documents for select to authenticated
using ((select auth.uid()) = owner_user_id);

-- O novo PDF só pode ser referenciado por seu autor, e o paciente deve ser dele.
create policy "clinical_documents_insert_owner_patient"
on public.clinical_documents for insert to authenticated
with check (
  (select auth.uid()) = owner_user_id
  and (
    patient_id is null or exists (
      select 1 from public.patients p
      where p.id = patient_id and p.professional_id = (select auth.uid())
    )
  )
);

-- Sem políticas UPDATE/DELETE: dados clínicos arquivados não podem ser apagados
-- acidentalmente por requisições do navegador.
revoke update, delete on public.clinical_documents from anon, authenticated;
grant select, insert on public.clinical_documents to authenticated;
revoke all on public.clinical_documents from anon;
