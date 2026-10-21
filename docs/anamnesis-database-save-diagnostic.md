# Diagnóstico de salvamento da anamnese — Supabase

O erro de salvamento pode ocorrer se as migrações recentes foram adicionadas ao repositório, mas não foram executadas no projeto Supabase conectado à versão publicada.

**Não execute alterações no banco apenas com base na hipótese.** Primeiro execute as consultas abaixo no SQL Editor do Supabase correto. Elas são somente de leitura e não consultam dados dos pacientes.

## 1. Colunas recentes

```sql
SELECT
  expected.column_name,
  col.data_type,
  CASE WHEN col.column_name IS NULL THEN 'AUSENTE' ELSE 'PRESENTE' END AS situacao
FROM (VALUES
  ('tea_functional_profile'),
  ('review_status'),
  ('finalized_at'),
  ('finalized_by'),
  ('mother_name'),
  ('father_name'),
  ('diagnosis_date'),
  ('support_level'),
  ('calming_strategies')
) AS expected(column_name)
LEFT JOIN information_schema.columns col
  ON col.table_schema = 'public'
 AND col.table_name = 'anamnesis'
 AND col.column_name = expected.column_name
ORDER BY expected.column_name;
```

**Se houver uma coluna ausente**, confirme primeiro se a migração correspondente foi aplicada. As migrações idempotentes disponíveis no repositório são:
- `supabase/migrations/20261013174500_add_tea_functional_profile_to_anamnesis.sql`
- `supabase/migrations/20261013202000_anamnesis_review_and_revision_log.sql`

Para `mother_name`, `father_name`, `diagnosis_date`, `support_level` e `calming_strategies`, verifique as migrações anteriores que criam esses campos. Não executar scripts que removam colunas ou sobrescrevam registros.

## 2. Histórico de versões da anamnese

```sql
SELECT
  to_regclass('public.anamnesis_revision_log') IS NOT NULL AS revision_table_exists,
  EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgrelid = 'public.anamnesis'::regclass
      AND tgname = 'capture_anamnesis_revision_trigger'
      AND NOT tgisinternal
  ) AS revision_trigger_exists;
```

## 3. Políticas RLS

```sql
SELECT tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('anamnesis','anamnesis_revision_log')
ORDER BY tablename, policyname;
```

A presença de uma política não garante por si só que as regras estejam corretas para os profissionais. Não desative RLS para resolver um erro de salvamento.

## Interpretação dos erros do portal

- `42703` / coluna ausente: esquema divergente, falta migração ou atualização do cache de esquema do PostgREST;
- `PGRST204`: coluna não reconhecida no cache do PostgREST;
- `42501`: acesso negado; verificar identidade do usuário e políticas RLS;
- `23503`: referência inválida ou paciente/profissional não encontrado pela chave estrangeira;
- `23505`: registro duplicado segundo restrição única.

O código do formulário passa a diferenciar colunas existentes de forma segura mesmo quando o usuário não possui anamneses anteriores, sem perder campos preenchidos e sem tentar adivinhar a estrutura do banco.

**Não se confirma o motivo específico do erro até obter o código/resposta da tentativa de gravação no Supabase da instalação ativa.** Não compartilhar tokens, cookies, prontuários ou dados clínicos na coleta dessa evidência.
