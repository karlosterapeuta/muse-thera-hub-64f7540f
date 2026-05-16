## Escopo
Análise completa do fluxo de **Gestão Financeira** (`/finance`, `/finance/records`, `/finance/clinics`, `/finance/reports`) — corrigir bugs conhecidos e entregar melhorias de UX, performance e segurança.

---

## Bugs identificados (com causa raiz)

### 1. Travamento ao excluir agenda (raiz definitiva)
- Hoje há um workaround forçando `body.style.pointerEvents=""`. A causa real: o diálogo de confirmação é aberto a partir de um `DropdownMenu`. O Radix mantém o focus trap do menu enquanto o Dialog monta, sobrepondo overlays e travando ponteiros.
- **Correção:** trocar o `Dialog` de confirmação por `AlertDialog`, abrir com `requestAnimationFrame` após fechar o dropdown, e remover o hack do `pointerEvents`.

### 2. `useFinancialRecords` sem filtro `professional_id`
- Depende só de RLS. Se houver bug no policy, vaza dados; sem filtro também não usa o índice composto.
- **Correção:** filtrar `.eq("professional_id", user.id)` explicitamente (defense-in-depth) e padronizar com `useFinanceDashboard`.

### 3. Página `records.tsx` busca lista 2x
- `useFinancialRecords(dateFilter)` + `useFinancialRecords(undefined)` baixam quase os mesmos dados; em conexões móveis dobra latência.
- **Correção:** baixar uma única vez sem filtro e aplicar o filtro de período no cliente (volume típico baixo) **ou** derivar a "agenda fixa" a partir do mesmo dataset filtrado.

### 4. `useUpdateFinancialRecord` perde campos
- Faz `update` apenas de 5 colunas, descartando `session_status`, `is_recurring`, `recurrence_type`, etc. ao editar um registro recorrente.
- **Correção:** só enviar os campos realmente presentes no payload (`Object.fromEntries` filtrando `undefined`).

### 5. Hooks de mutação não invalidam o dashboard
- `useDeleteFinancialRecord` e `useUpdateSessionStatus` não invalidam `["finance-dashboard"]`; cards e gráficos ficam desatualizados até refresh manual.
- **Correção:** invalidar ambas as queries em todos os hooks (add/update/delete/clearAll/recurring/status).

### 6. Bug de regex no form de edição
- `FinancialRecordForm.tsx` linha ~230 tem `\\s` (escape duplo) na regex de limpeza usada no `useEffect`, então ao editar a descrição vem suja com "Dia da semana: … | Horário: … | Duração: …".
- **Correção:** usar a mesma regex do `getCleanDescription` (helper compartilhado).

### 7. Recorrência: descrição duplica "(Recorrente)" e quebra parser
- `generateFutureRecords` faz `description: \`${parentRecord.description || ''} (Recorrente)\``. Como o `description` do pai já contém `Dia da semana: … | Horário: … | Duração: … | <texto>`, o sufixo é colado **depois** dos pipes e fica dentro do bloco de texto. Em edições subsequentes, vira `... (Recorrente) (Recorrente)`.
- **Correção:** ao gerar filhos, preservar exatamente o `description` do pai (sem sufixo) e usar o badge `RecurringRecordIndicator` para sinalizar visualmente.

### 8. Datas em UTC violando a regra do projeto
- `parseISO(record.session_date)` interpreta `yyyy-MM-dd` como UTC midnight → off-by-one em fusos negativos.
- **Correção:** criar helper `parseDateLocal(yyyyMMdd)` (já existe em `src/utils/dateUtils.ts` — usar) e substituir todas as chamadas `parseISO` em records/dashboard.

### 9. Dedupe da agenda fixa cancela pacientes sem nome
- A chave é `patient_name + time + clinic_name`. Quando `patient_name` é `undefined`, todos viram a mesma chave e somem.
- **Correção:** usar `record.id` ou `patient_id ?? record.id` na chave de dedupe.

### 10. "Editar Série" é botão morto
- `RecurringRecordActions` mostra toast "Funcionalidade em desenvolvimento".
- **Correção:** ligar ao hook `useUpdateRecurringSeries` que já existe, abrindo o `FinancialRecordForm` em modo "editar série" com flag.

### 11. `Limpar Tudo` perigoso demais
- Um clique + uma confirmação simples apagam **todo** o histórico financeiro do profissional. Sem backup.
- **Correção:** exigir digitar `EXCLUIR` para liberar o botão; mostrar contagem de registros que serão apagados.

### 12. Agregação semanal e dashboard
- `format(date, 'w')` não é ISO; chave colide entre anos próximos. Também não há gráfico de status (concluída/falta/agendada) nem de receita por paciente.

### 13. Limite de 1.000 linhas do Supabase
- Sem `range()` nem paginação. Profissionais com mais de 1.000 sessões nunca verão todas.
- **Correção:** paginar (`range(0, 4999)` com aviso) ou agregar no servidor via RPC.

### 14. Print quebrado
- `window.print()` no header de `index.tsx` mas não há `@media print` escondendo header/sidebar/abas.
- **Correção:** stylesheet `print:hidden` nas áreas certas (já parcialmente feito) e bloco `print:block` com o resumo.

---

## Melhorias

1. **Totais e KPIs no topo de `records.tsx`** — Receita do período, nº de sessões, ticket médio, taxa de falta — reaproveitando `FinancialStatCards`.
2. **Filtros na lista** — clínica, paciente, status (chips); persistir em querystring.
3. **Exportar CSV** dos registros filtrados (`papaparse` já é leve, sem nova dep usar `Blob`).
4. **Debounce** do campo de busca (300 ms) para evitar re-render a cada tecla.
5. **Loader esqueleto** ao invés de spinner com texto, mantendo a altura da tabela.
6. **Tooltip** no card da agenda fixa explicando "Permanente — não muda com o mês".
7. **Confirmação por digitação** no "Limpar Tudo".
8. **Atalho rápido** "Marcar todas as sessões de hoje como concluídas" no cabeçalho da agenda da semana.
9. **Acessibilidade** — `aria-label` nos botões só-ícone do header e nos cards da agenda; foco visível.
10. **Mensagens de erro humanas** — substituir `error.message` cru por mensagens em português.
11. **Memoização** — `useMemo` em `sortedRecords`, `recordsByWeekday`, `weeklyAgenda` para evitar recomputar a cada digitação.

---

## Detalhes técnicos

### Arquivos a alterar
```
src/pages/finance/records.tsx
src/pages/finance/index.tsx
src/pages/finance/components/FinancialRecordForm.tsx
src/pages/finance/components/RecurringRecordActions.tsx
src/pages/finance/hooks/useFinancialData.ts
src/pages/finance/hooks/useFinanceDashboard.ts
src/pages/finance/hooks/useUpdateSessionStatus.ts
src/pages/finance/hooks/useRecurringFinancialRecords.ts
src/utils/dateUtils.ts (adicionar parseDateLocal se faltar)
```

Nenhuma migração de banco necessária — todos os campos já existem.

### Ordem de implementação
1. Bugs críticos: 1, 4, 5, 6, 7, 8, 9 (corrigem dados errados/UI travada).
2. Refator de hooks e dedupe (2, 3, 12 parcial).
3. Recurso "Editar Série" (10).
4. Guard de "Limpar Tudo" (11).
5. Filtros, CSV, KPIs, debounce (melhorias 1–5).
6. Polimento (6–11).

---

## Pergunta antes de implementar

Quer que eu execute **tudo** num único build, ou prefere que eu vá em duas etapas — primeiro só os bugs críticos (1, 4, 5, 6, 7, 8, 9), valide com você, e depois aplico as melhorias?
