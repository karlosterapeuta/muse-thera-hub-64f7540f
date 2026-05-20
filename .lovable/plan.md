
# Reforma completa – Planos Musicoterapêuticos

Objetivo: transformar o módulo num fluxo profissional, fluido e responsivo, integrado ao restante do ciclo clínico (Anamnese → Avaliação → Plano → Intervenção → Reavaliação), com templates, IA, versionamento e PDF clínico repaginado.

## 1. Reformulação visual e UX

**Página de lista (`/musicotherapy-treatment-plans`)**
- Substituir a tabela atual por **cards clínicos premium** (grid responsivo: 1 col mobile, 2 col tablet, 3 col desktop) com foto/iniciais do paciente, diagnóstico, status colorido, barra de progresso de preenchimento, data de início e ações rápidas (Ver / Editar / Duplicar / PDF / Arquivar).
- Header com **estatísticas** (Total, Ativos, Rascunhos, Concluídos) em cards glassmorphism.
- Busca inteligente (paciente, diagnóstico, objetivos), filtros por status e diagnóstico, ordenação.
- Empty state ilustrado com CTA destacado.
- Ação **"Duplicar plano"** (gera novo rascunho a partir de plano existente).

**Página de edição (`/musicotherapy-treatment-plan/:id?`)**
- Layout **híbrido responsivo**:
  - Mobile: wizard puro (1 etapa por tela, barra de progresso fixa no topo, botões Voltar/Próximo sticky no rodapé).
  - Desktop: sidebar lateral com lista das 10 seções, badge de validação por seção (✓ completo, ● parcial, ! pendente), conteúdo da seção ativa no centro.
- Header sticky com: nome do paciente, status, badge de autosave ("Salvo há Xs"), botão Salvar, botão Gerar PDF, botão Voltar.
- Cada seção dividida em **cards menores** com microcopy explicativa ("Por que isso importa?") em popovers.
- Inputs de array (objetivos, instrumentos, etc.) com chips clicáveis e sugestões pré-definidas por diagnóstico.
- Resumo final ("Revisar e Salvar") antes de marcar como Ativo, mostrando pendências.

## 2. Novas funcionalidades

**Templates por diagnóstico**
- Biblioteca de templates pré-preenchidos: TEA, Síndrome de Down, Alzheimer, Parkinson, Paralisia Cerebral, AVC, Ansiedade/Depressão, Desenvolvimento Infantil.
- Cada template traz objetivos sugeridos, recursos típicos, frequência e critérios de avaliação.
- Ao escolher diagnóstico no passo 1, o app oferece "Aplicar template MuseTera para [diagnóstico]?".

**Preenchimento por IA (a partir de Anamnese + Avaliação)**
- Botão "🪄 Gerar plano com IA" no topo do formulário.
- Edge Function `generate-treatment-plan` consulta a anamnese e a última avaliação do paciente, gera proposta de objetivos gerais/específicos, recursos e estratégias usando Lovable AI Gateway (google/gemini-2.5-flash).
- Usuário revisa e edita antes de salvar.

**Versionamento**
- Toda alteração após "Ativo" cria uma nova versão (snapshot). Histórico acessível pelo botão "Versões anteriores" com diff visual simplificado.
- Permite reverter ou comparar.

**Integrações com o ciclo clínico**
- Pré-popular paciente, diagnóstico e idade a partir da Anamnese ao criar plano.
- Vincular plano ativo às sessões de Intervenção (mostrar objetivos do plano na tela de sessão).
- Botão "Gerar Reavaliação" a partir de um plano ativo.
- Card do paciente em `patient-history` mostra plano ativo + link rápido.

**Status com lógica**
- Rascunho (autosave), Ativo (após preencher mínimos + revisão), Em revisão, Concluído (com data de encerramento), Arquivado.
- Transições automáticas e indicação de "campos faltando para ativar".

## 3. PDF clínico repaginado

Novo `MusicotherapyTreatmentPlanPDF.tsx` (html2canvas, A4, [10,10], Base64):

- **Capa**: logo dourada MuseTera, título "Plano Musicoterapêutico", nome do paciente, diagnóstico, número do plano, data, profissional responsável.
- **Sumário** com paginação.
- **10 seções clínicas** com tipografia hierárquica (Inter/Lora), cabeçalho colorido por seção, ícone, microcopy de contexto.
- **Cabeçalho/rodapé** em todas as páginas: paciente + nº plano (header), assinatura digital + carimbo + paginação (footer).
- Bloco final com assinatura digital + carimbo do profissional, registro, contato e QR code de verificação (link público read-only do plano).
- Salvo automaticamente em `clinical-pdfs/{user_id}/treatment-plan/`.

## 4. Mudanças técnicas (resumo)

```text
NOVOS ARQUIVOS
├─ src/data/treatmentPlanTemplates.ts        # templates por diagnóstico
├─ src/components/treatment-plan/
│  ├─ PlanListCard.tsx                       # card premium da lista
│  ├─ PlanStatsHeader.tsx                    # 4 cards de estatística
│  ├─ PlanWizardLayout.tsx                   # layout responsivo wizard/sidebar
│  ├─ PlanSectionSidebar.tsx                 # nav + validação por seção
│  ├─ PlanStickyHeader.tsx                   # header com autosave + ações
│  ├─ PlanReviewSummary.tsx                  # tela final de revisão
│  ├─ PlanVersionHistory.tsx                 # versões anteriores
│  ├─ ApplyTemplateDialog.tsx                # escolher template
│  └─ AIGeneratePlanButton.tsx               # botão IA + revisão
├─ supabase/functions/generate-treatment-plan/index.ts
└─ src/components/MusicotherapyTreatmentPlanPDFv2.tsx

REESCRITOS
├─ src/pages/musicotherapy-treatment-plans/index.tsx   # lista em cards
└─ src/pages/musicotherapy-treatment-plan/index.tsx    # quebrado em <300 linhas

BANCO (migração)
├─ ALTER TABLE treatment_plans
│  ADD COLUMN plan_number serial,
│  ADD COLUMN completion_percent int,
│  ADD COLUMN ended_at timestamptz,
│  ADD COLUMN source_template text,
│  ADD COLUMN parent_plan_id uuid REFERENCES treatment_plans(id);
├─ CREATE TABLE treatment_plan_versions (
│  id, plan_id, version_number, snapshot jsonb, created_at, created_by)
│  + RLS (dono via plan_id → professional_id)
```

## 5. Entrega faseada

1. **Fase 1 (visual + UX)**: lista em cards + stats + duplicar; wizard responsivo; sticky header; review summary; sidebar de validação.
2. **Fase 2 (PDF v2)**: novo layout clínico com capa, sumário, QR.
3. **Fase 3 (Templates + IA)**: biblioteca de templates + Edge Function de geração via Lovable AI.
4. **Fase 4 (Versionamento + integrações)**: tabela de versões, histórico, vínculo com Intervenção e Reavaliação.

## 6. Fora de escopo

- Reformular o hub `/processes` (mantém o visual atual).
- Migração retroativa de planos antigos para o novo schema de versões (versões só começam a partir desta atualização).

---

Confirma este plano? Posso começar pela Fase 1 assim que aprovar, ou prefere reorganizar a ordem das fases.
