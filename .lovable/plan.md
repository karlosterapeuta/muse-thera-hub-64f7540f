# Plano Terapêutico Individual (PTI) — Musicoterapia

A new, self-contained clinical module added to **Processos Musicoterapêuticos**, reusing the app's existing patterns (cosmic UI, professional signature/stamp, html2canvas PDF, Lovable AI) while introducing a richer, structured 18-section plan.

## Scope & approach

This is a large module. To ship it reliably and let you review along the way, I'll build it in phases. Phase 1 delivers a fully usable PTI (data model, card, editor, save, PDF). Later phases add AI, reavaliação and the dashboard.

The PTI is structurally different from the current `treatment_plans` (checkbox grids, scored scales 1–5, objetivos/metas as arrays of objects). So it gets its **own table** with a single structured `content` JSONB column — flexible, versionable, and easy to extend without constant migrations.

## Data model (Phase 1 migration)

New table `public.pti_plans`:
- `id`, `professional_id`, `patient_id`, `title`, `status` (rascunho/ativo/concluído), `plan_date`
- `content` JSONB — the entire 18-section structure
- `progress` int (0–100), `created_at`, `updated_at`, `created_by`
- RLS: a professional sees/edits only their own rows (`professional_id` via `professionals.user_id = auth.uid()`); admin full access. GRANTs to `authenticated` + `service_role`.

New table `public.pti_reavaliacoes`:
- `id`, `pti_id` (FK), `professional_id`, `snapshot` JSONB (scores + objetivos at that date), `report` JSONB (AI comparison output), `created_at`.

Version history reuses the same approach: each save can append to `pti_versions` (`id`, `pti_id`, `content`, `created_at`, `created_by`) for the audit/version diff requirement.

## UI structure

1. **Card in `src/pages/processes.tsx`** — "Plano Terapêutico Individual (PTI)" with a clinical icon (ClipboardList/HeartPulse), routed to `/pti`.
2. **`/pti` (list/dashboard)** — indicators (total, ativos, em reavaliação, objetivos concluídos, metas alcançadas), evolution chart, filters (paciente/diagnóstico/período), and actions: Novo Plano, Planos Salvos, Reavaliações, Histórico.
3. **`/pti/novo` and `/pti/:id`** — the editor.
4. **`/pti/:id/reavaliacao`** — reavaliação flow.

## Editor (18 sections, Accordion + progress bar)

Collapsible accordion sections with auto-save and a top progress bar:
1. Identificação (auto-fill nome, idade, nascimento, sexo, responsável, telefone, diagnóstico, CID, DSM, data, profissional, CBO)
2. Queixa Principal (textarea + IA)
3. Histórico Clínico (sub-campos: desenvolvimento, escolaridade, comunicação, terapias anteriores, histórico/preferências musicais, hiper/hipossensibilidades)
4. Avaliação Musicoterapêutica — checkbox grids + observações for Comunicação, Socialização, Cognição, Sensorial, Musicalidade
5. Potencialidades (textarea + IA)
6. Dificuldades (textarea + IA)
7. Objetivo Geral (textarea + IA)
8. Objetivos Específicos (repeatable: descrição, prazo, prioridade, área)
9. Metas Terapêuticas (repeatable: descrição, indicador, % esperado, prazo, critério de sucesso)
10. Estratégias Musicoterapêuticas (multi-select library + add custom)
11. Recursos Utilizados (multi-select + outros)
12. Frequência (sessões / duração / atendimento)
13. Critérios de Evolução (8 áreas, escala 1–5, chart in reavaliações)
14. Critérios para Alta (textarea + IA)
15. Plano Familiar (textarea + IA)
16. Integração Multiprofissional (multi-select + observações)
17. Fundamentação Técnica (textarea pre-filled with standard text + IA)
18. Assinatura (auto: nome, CBO, assinatura digital, carimbo, data)

## Integration / auto-fill

On patient select, prefill from `patients`, `anamnesis`, `assessments`/evaluation, and latest `treatment_plans`/evoluções where fields exist (diagnóstico, objetivos anteriores, histórico). All fields remain editable.

## AI (Phase 2)

Edge function `pti-ai-assist` (Lovable AI, `google/gemini-3-flash-preview`) with a `section` parameter. Each section's "✨ Gerar com IA" sends patient context (anamnese, avaliação, evoluções, diagnóstico, idade, objetivos antigos, histórico) and returns an **editable suggestion** shown in a dialog — never auto-replacing the professional's text.

## Reavaliação inteligente (Phase 3)

"📈 Gerar Reavaliação" snapshots current scores/objetivos, compares against the previous plan via AI, and produces a report: objetivos atingidos / parciais / não atingidos / novos, plus sugestões clínicas, with a comparison chart (recharts radar/bar).

## PDF export

Reuse the html2canvas A4 pattern (`generateStaticPDF`) and professional identity (logo, assinatura, carimbo) per existing memory constraints. Buttons: Exportar PDF, Imprimir, Compartilhar.

## Phasing

- **Phase 1** — Migration, Processos card, `/pti` list + dashboard shell, full 18-section editor with auto-save and PDF export. (Usable end-to-end.)
- **Phase 2** — AI assist edge function + "Gerar com IA" across sections; templates/biblioteca reutilizável of objetivos & estratégias.
- **Phase 3** — Reavaliação inteligente, evolution charts, version history/audit, duplicar plano, reavaliação reminders.

## Technical notes

- Stack: React + JSONB content model keeps the schema stable as sections evolve.
- Charts via existing `recharts`.
- New code under `src/pages/pti/**`, `src/components/pti/**`, `src/hooks/usePti*.ts`, `supabase/functions/pti-ai-assist`.
- `src/integrations/supabase/types.ts` regenerates automatically after the migration.

I'll start with Phase 1 once you approve. Want me to proceed with all three phases sequentially, or stop after Phase 1 for review?
