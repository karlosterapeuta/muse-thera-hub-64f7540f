
# Repaginação profissional do módulo Financeiro

Tom: linguagem **financeira corporativa** (sem termos musicais, sem emojis decorativos no corpo, sem metáforas). Visual limpo, sóbrio, foco em dados.

## O que está errado hoje

- Copy poluída com termos musicais em contexto financeiro: "Partituras Financeiras", "Calculadora IR Musical", "Receita de Musicoterapia", "Harmonia financeira acumulada", "Melodias terapêuticas realizadas", "Crescendo do valor terapêutico", "Harmonizando seus dados financeiros".
- Cabeçalho com **6 botões** competindo por atenção, sem hierarquia.
- Subpáginas (`records`, `receipts`, `clinics`, `reports`) **desconectadas**, cada uma com header e botão Voltar próprios.
- Duplicação de ações ("Nova Sessão" e "Registros" abrem a mesma página; "Perfil Emissor" só redireciona).
- Calculadora de IR no mesmo nível dos gráficos principais — não é tarefa diária.

## Nova arquitetura

Shell único em `/finance` com **navegação por abas** (sidebar no desktop, abas com scroll horizontal no mobile). Rotas antigas continuam funcionando via redirect para `/finance?tab=...`.

```text
┌──────────────────────────────────────────────────┐
│ Gestão Financeira              [+ Atendimento]   │
├──────────┬───────────────────────────────────────┤
│ Visão    │                                       │
│ Atendim. │   Conteúdo da aba ativa               │
│ Agenda   │                                       │
│ Recibos  │                                       │
│ Clínicas │                                       │
│ Relatóri.│                                       │
│ Imposto  │                                       │
└──────────┴───────────────────────────────────────┘
```

## Abas

1. **Visão geral** — KPIs (Receita total, Atendimentos, Ticket médio, A receber), gráfico de evolução, distribuição por clínica, últimos atendimentos, últimos recibos.
2. **Atendimentos** — antiga `/finance/records`. Tabela filtrável, busca, status (Agendado / Realizado / Faltou / **Pago**), botão "Emitir recibo" inline.
3. **Agenda** — visão semanal fixa de atendimentos.
4. **Recibos** — antiga `/finance/receipts` com sub-abas (Histórico, Clientes, Modelos, Emissor) preservadas.
5. **Clínicas** — cadastro e gestão.
6. **Relatórios** — exportação CSV/PDF por período.
7. **Imposto de Renda** — calculadora movida pra cá.

## Copy reescrita (antes → depois)

| Antes | Depois |
|---|---|
| Gestão Financeira – MuseTera | Gestão Financeira |
| Controle financeiro especializado para musicoterapeutas | Controle de receitas, atendimentos e recibos |
| Receita de Musicoterapia | Receita total |
| Sessões de Musicoterapia | Atendimentos |
| Valor Médio por Sessão | Ticket médio |
| Harmonia financeira acumulada | Faturamento no período |
| Melodias terapêuticas realizadas | Sessões registradas |
| Crescendo do valor terapêutico | Valor médio por atendimento |
| Partituras Financeiras | Análise gráfica |
| Calculadora IR Musical | Calculadora de IR |
| Harmonizando seus dados financeiros... | Carregando dados... |
| Relatório Financeiro MuseTera | Relatório financeiro |
| Partitura gerada em | Gerado em |

## Design

- Tipografia: títulos `font-semibold tracking-tight`, dados numéricos com `tabular-nums`.
- Paleta sóbria: superfícies em `card`, acentos em `primary`, status em `emerald` (positivo) / `amber` (pendente) / `destructive` (negativo).
- Remover gradientes azul→roxo e ícones musicais; usar ícones financeiros (`WalletIcon`, `ReceiptIcon`, `TrendingUpIcon`, `ClipboardListIcon`, `CalendarIcon`).
- KPIs em cards limpos, sem decorações curvas; bordas finas, hover sutil.
- Loading com **skeletons**, não spinner com texto temático.
- Empty states discretos com CTA contextual ("Cadastre seu primeiro atendimento").
- Aplicar padrão de dark mode já memorizado para Finance.

## Mudanças nas rotas

| Rota atual | Comportamento novo |
|---|---|
| `/finance` | Shell unificado com abas |
| `/finance/records` | Redireciona para `/finance?tab=atendimentos` |
| `/finance/receipts` | Redireciona para `/finance?tab=recibos` (preserva `?tab=` interno) |
| `/finance/clinics` | Redireciona para `/finance?tab=clinicas` |
| `/finance/reports` | Redireciona para `/finance?tab=relatorios` |
| `/finance/receipt-profile` | Redireciona para `/finance?tab=recibos&sub=emissor` |

## Detalhes técnicos

- Refatorar `src/pages/finance/index.tsx` em `FinanceShell` controlado por `useSearchParams("tab")`.
- Mover conteúdo de `records.tsx`, `receipts.tsx`, `clinics.tsx`, `reports.tsx` para `src/pages/finance/sections/`, **sem headers próprios e sem botão Voltar**.
- Atualizar `src/App.tsx` com `<Navigate>` para todas as rotas antigas.
- Reescrever `FinancialStatCards.tsx` (já está com copy musical).
- Atualizar `FinanceCharts.tsx`, `IncomeTaxCalculator.tsx`, `DateRangeFilter.tsx` para remover qualquer copy musical/emoji decorativo.
- Sidebar do app: garantir que o link "Finanças" leve para `/finance` (não para subrotas).

## Fora do escopo

- Cálculos de IR, geração de PDF dos recibos, lógica de recorrência: **inalterados**.
- Esquema de banco: **inalterado**.
- Integração com gateways de pagamento: próxima iteração.

Aprova essa repaginação completa, ou quer ajustar alguma aba/copy antes?
