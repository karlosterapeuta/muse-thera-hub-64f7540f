

## Mini-gráfico de evolução por domínio na página "Apresentação dos Resultados"

Vou adicionar, na página voltada aos pais do PDF de Gráficos de Parâmetros, um **mini-gráfico de evolução (sparkline)** ao lado de cada área avaliada, com um selo claro indicando se o paciente **Melhorou**, **Manteve** ou **Oscilou** entre as avaliações anteriores.

### O que o terapeuta vai ver no PDF

Para cada uma das áreas (Música, Relações, Cognitivo, Sensório-Motor, Comunicação) na seção "Visão geral por área avaliada" será adicionado:

- Uma **mini linha de evolução** (largura ~90px, altura ~28px) plotando o score daquela área nas últimas 4–6 avaliações salvas, com pontos destacados no início e fim.
- Um **selo de tendência** colorido com ícone simples (sem emoji, compatível com html2canvas):
  - `▲ Melhorou` (verde) — variação ≥ +5 pontos entre 1ª e última avaliação.
  - `● Manteve` (cinza) — variação dentro de ±5 pontos.
  - `▼ Oscilou` (âmbar) — variação ≥ +5 e desvio padrão alto OU queda significativa; também usado quando há subidas e descidas alternadas.
- Um pequeno texto auxiliar: "Última: 72% · Variação: +12% · 4 avaliações".

Quando houver **apenas 1 avaliação** salva, exibe um selo neutro `Primeira avaliação` (sem mini-gráfico) — mantendo o layout limpo e sem espaços vazios.

### Layout proposto (por linha de domínio)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Música e expressão sonora                          ╱╲___╱   ▲ Melhorou  │
│ Habilidade bem presente                       ▁▃▅▇         72%  +12%   │
│ ████████████████████░░░░░░ 72%                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

Mini-gráfico fica entre o texto descritivo e a barra de % atual, sem aumentar a altura do card além do necessário (a página continua cabendo em A4).

### Detalhes técnicos

**Arquivo único alterado:** `src/components/ParametersGraphsPDF.tsx`

1. **Construir histórico por domínio** a partir de `allEvaluations` (já recebido como prop):
   - Ordenar por `date` ascendente.
   - Para cada avaliação, ler `evaluation.content?.domainScores` e mapear `domain → score`.
   - Gerar `domainHistory: Record<string, number[]>` com até as últimas 6 avaliações.

2. **Função `computeTrend(scores: number[])`** que retorna `{ status: 'improved'|'stable'|'oscillated'|'first', delta, last, color, bg, label, icon }`:
   - `delta = last - first`.
   - `improved` se `delta >= 5` e desvio padrão moderado.
   - `oscillated` se houver ≥3 pontos com sinal de variação alternado OU desvio padrão alto relativo à média.
   - `stable` se `|delta| < 5`.
   - `first` se `scores.length <= 1`.

3. **Sub-componente `Sparkline`** (SVG inline, sem Recharts para evitar overhead numa página com muitos):
   - `viewBox="0 0 90 28"`, `polyline` com pontos normalizados (0–100 → 0–28 invertido).
   - Gradiente de preenchimento sob a linha (`<path>` fechado), cor = cor do status.
   - Pontos `<circle>` no primeiro e último valor.

4. **Integração na página de pais** (bloco "Visão geral por área avaliada", linhas ~528–549):
   - Substituir o item `<div>` atual por uma estrutura flex de 2 linhas:
     - Linha 1: nome amigável + label + sparkline + selo tendência.
     - Linha 2: barra de progresso atual + % (mantida).
   - Tudo em `pageBreakInside: 'avoid'`.

5. **Mapeamento de nomes de domínio** entre `radarData[i].name` (ex: "Musical") e `evaluation.content.domainScores[i].domain` (ex: "Domínio Musical") — usar normalização (`.replace("Domínio ", "")`) para casar as chaves.

6. **Compatibilidade html2canvas**: SVG inline com `width`/`height` explícitos, sem `filter` CSS, sem emojis (usar `▲ ● ▼` que renderizam bem). Cores em hex sólido.

### Fora do escopo

- Não alterar o PDF estático (`ParametersGraphsPDFStatic.tsx`) nem o relatório MuseTera completo nesta tarefa.
- Não persistir nada novo no banco — usar apenas `allEvaluations` que já é passado pelo `evaluation/index.tsx`.

