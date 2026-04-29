
## Objetivo

No "Histórico do Paciente", listar **todos os processos clínicos** do paciente — da Anamnese até a Devolutiva TEA — e, ao clicar em um paciente, mostrar na **timeline cada processo individualizado** com a **quantidade já realizada** de cada tipo.

## Situação atual

A página `src/pages/patient-history.tsx` já busca dados de `anamnesis`, `assessments`, `treatment_plans`, `sessions` e `reports`, mas **agrupa tudo de `reports` como um único tipo "Relatório"**. Isso esconde processos importantes como **MuseTera TEA**, **Evolução Musicoterapia** e **Devolutiva TEA**, que são salvos em `reports.type` com valores específicos.

Hoje a contagem mostra apenas 5 categorias genéricas. O usuário quer ver cada processo do menu "Processos Clínicos" como um item próprio.

## Mudanças propostas (apenas em `src/pages/patient-history.tsx`)

### 1. Expandir o tipo `HistoryItem` e `typeConfig`

Adicionar subtipos específicos para cada processo clínico, derivados de `reports.type`:

- `anamnesis` — Anamnese (já existe)
- `assessment` — Avaliação MuseTera (já existe)
- `treatment_plan` — Plano Terapêutico (já existe)
- `session` — Sessão / Intervenção (já existe)
- `musicoterapia_tea` — **Relatório MuseTera TEA** (novo, vem de `reports.type='musicoterapia'`)
- `evolution_musicoterapia` — **Evolução Musicoterapia** (novo)
- `devolutiva_tea` — **Devolutiva TEA** (novo, de `reports.type='devolutiva_tea'`)
- `evolution_report` — Evolução (diária/mensal/semestral) — agrupa `daily_evolution`, `monthly_evolution`, `semester_evolution`
- `discharge` — Alta (terapêutica/administrativa)
- `clinical_report` — Relatórios clínicos (família, equipe, técnico, sessão individual/grupo, escala TEA)

Cada subtipo recebe cor, ícone e gradiente próprios (paleta cosmic já usada no projeto).

### 2. Atualizar `usePatientHistory`

Em vez de mapear todo `reports` para `type: "report"`, fazer um switch sobre `r.type` e atribuir o subtipo correto, com título e descrição apropriados (ex: "Relatório MuseTera TEA", "Devolutiva TEA — Análise Clínica").

### 3. Atualizar o painel de estatísticas (`stats`)

Trocar os 5 contadores fixos por uma grade dinâmica com **um card por subtipo presente**, mostrando ícone + label + quantidade (ex: "3 Anamneses", "5 MuseTera TEA", "2 Devolutivas TEA"). Ordem fixa seguindo o fluxo clínico: Anamnese → Avaliação → Plano → Sessão → MuseTera TEA → Evolução Musicoterapia → Devolutiva TEA → Outros relatórios.

### 4. Atualizar timeline

A timeline já renderiza `filteredHistory`. Como cada item agora tem subtipo, ícone e cor próprios, automaticamente cada processo aparece individualizado e identificável visualmente.

### 5. Atualizar filtros (`typeFilter`)

O `Select` de filtro passa a listar todos os subtipos disponíveis em vez de só 5 categorias.

### 6. Atualizar gráficos (`MonthlyBarChart`, `DocumentDistributionChart`, `ActivityChart`)

- **DocumentDistributionChart** (pizza): já é dinâmico via `typeConfig`, basta funcionar com os novos subtipos.
- **MonthlyBarChart**: adicionar barras para `musicoterapia_tea`, `evolution_musicoterapia`, `devolutiva_tea`. Para evitar excesso visual, agrupar relatórios "secundários" (alta, família, equipe) em uma barra única "Outros".
- **ActivityChart** (área): mantém total + sessões.

### 7. Atualizar `PatientInsights`

Acrescentar mais dois cards: "Devolutivas TEA" e "Relatórios MuseTera TEA" para destaque rápido dos processos principais.

## Arquivos afetados

- `src/pages/patient-history.tsx` (única alteração necessária — toda a lógica está concentrada lá)

## Detalhes técnicos

- Sem mudanças de banco — todos os dados já existem em `anamnesis`, `assessments`, `treatment_plans`, `sessions`, `reports`.
- Mapeamento em `reports.type`:
  - `'musicoterapia'` → subtipo `musicoterapia_tea`
  - `'evolution_musicoterapia'` → subtipo `evolution_musicoterapia`
  - `'devolutiva_tea'` → subtipo `devolutiva_tea`
  - `'daily_evolution' | 'monthly_evolution' | 'semester_evolution'` → `evolution_report`
  - `'therapeutic_discharge' | 'administrative_discharge'` → `discharge`
  - resto → `clinical_report`
- Manter retrocompatibilidade: itens antigos com `type: "report"` continuam sendo renderizados via fallback.
- Performance preservada: mesma única query paralela já existente.

## Resultado visual

Ao selecionar um paciente:
- Aparece uma fileira de **chips/cards de contagem por processo** (ex: "Anamnese: 1 • Avaliação: 4 • Plano: 2 • Sessão: 18 • MuseTera TEA: 3 • Devolutiva TEA: 1").
- A **timeline** mostra cada processo com seu próprio ícone/cor (Devolutiva TEA com cor distinta de Anamnese, etc.), em ordem cronológica.
- O filtro permite ver apenas um tipo de processo por vez.
