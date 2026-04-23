

## Reduzir o número de páginas do PDF de Gráficos de Parâmetros

Hoje o PDF tem facilmente **5+ páginas**: capa com gráficos, apresentação aos pais, várias páginas de detalhamento (1 a cada 16 parâmetros) e a página de evolução. Vou consolidar e compactar para que **caiba em 2 páginas A4 na maioria dos casos** (3 apenas quando houver muitos parâmetros + evolução comparativa).

### Estrutura nova (alvo)

| Página | Conteúdo | Quando aparece |
|---|---|---|
| **1 (Visão Clínica + Pais)** | Header compacto · Radar + Pizza lado a lado · Resumo de subdomínios em chips · Visão geral por área (com sparkline + tendência) · Mensagem aos pais | Sempre |
| **2 (Detalhamento + Evolução)** | Pontos fortes + Áreas a estimular (2 colunas) · Detalhamento por domínio em tabela compacta de 2 colunas · Mini-bloco de evolução (timeline + linha) · Footer com assinatura | Sempre |
| **3 (overflow)** | Continuação do detalhamento + evolução | Apenas se >24 parâmetros avaliados |

Hoje totaliza facilmente 5–6 páginas; meta é **2 páginas (3 no caso extremo)**.

### Mudanças no `src/components/ParametersGraphsPDF.tsx`

1. **Remover página exclusiva "Apresentação dos Pais"** — mover seus blocos para a Página 1 (visão geral por área + sparklines) e Página 2 (pontos fortes/atenção + mensagem).

2. **Compactar Página 1**:
   - Reduzir `padding` da página de `20mm 22mm` → `12mm 14mm`.
   - Reduzir altura dos charts: Radar `220→160`, Pizza `200→160`, manter lado a lado.
   - Remover "Bar Chart de Subdomínios" (está duplicado: o Radar já cobre domínios e os chips já listam subdomínios). Manter apenas chips de resumo em **3 colunas** (ao invés de 2).
   - Remover bloco "Como ler os níveis usados na avaliação" (legenda) — movê-lo para um rodapé minúsculo de 1 linha.

3. **Unificar Página 2 (detalhamento + evolução)**:
   - Aumentar densidade do detalhamento: `MAX_PARAMS_PER_PAGE` de **16 → 28**, tabela em **2 colunas paralelas** (flex 50/50), fonte `11px → 9.5px`, padding de células `6px → 3px`.
   - Compactar selos de nível (apenas a inicial colorida + barra, sem chip grande).
   - Bloco "Evolução" reduzido: apenas o resumo de 3 cards (Primeira / Última / Variação) + um gráfico de linha 600×140 (sem tabelas extras de "áreas que melhoraram"). Áreas comparativas viram 2 chips inline (✔ X% melhoraram · ⚠ Y% atenção).

4. **Footer mais enxuto**:
   - Diminuir o "carimbo" circular de `100×100 → 70×70`.
   - Remover linha extra "Documento gerado em ... às ..." (manter só "Assinatura Digital Verificada").

5. **Recalcular `totalPages`**:
   ```ts
   let totalPages = 1; // Página 1: visão clínica + pais
   if (hasDetails || hasEvolution) totalPages += 1; // Página 2: detalhe + evolução
   if (detailPages.length > 1) totalPages += detailPages.length - 1; // overflow
   ```

6. **Garantia A4**: cada bloco principal recebe `pageBreakInside: 'avoid'`, e usamos `maxHeight` controlado nas seções para o html2canvas não estourar a folha.

### Fora de escopo

- Não altero o `ParametersGraphsPDFStatic.tsx` nem outros PDFs.
- Não removo dados — apenas reorganizo em layout mais denso.
- Sparkline + tendência por domínio são **mantidos** (apenas reposicionados na Página 1).

