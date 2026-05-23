
## Objetivo

Refazer do zero o PDF do botão **"Baixar Gráfico"** para que:
1. Mostre **todos os dados avaliados** sem cortes nem páginas em branco.
2. Tenha visual **profissional, limpo e bonito** (alinhado à identidade MuseTera).
3. Reflita fielmente a estrutura da página Avaliação (5 domínios, 16 subdomínios, 128 parâmetros).

## Diagnóstico do problema atual

O fluxo atual (`html2pdf.js` renderizando um único DOM gigante) sofre de:
- Quebra de página por fatiamento de pixel → corta tabelas no meio.
- Mistura de `pagebreak: ['css']` com `height: 297mm + overflow:hidden` → páginas brancas quando o conteúdo não bate exato.
- Conteúdo longo (16 subdomínios × 8 parâmetros) excede a página e é "engolido" pelo `overflow:hidden`.

→ Conclusão: precisamos abandonar a estratégia "um DOM gigante → fatiar" e adotar **captura por seções** com `html2canvas` + `jsPDF` manual, que é o padrão recomendado para relatórios longos.

## Novo PDF — Estrutura (4–6 páginas A4 retrato)

**Página 1 — Capa / Identificação**
- Cabeçalho dourado com logo MuseTera 3D
- Bloco de identificação: Paciente · Idade · Data · Musicoterapeuta · CRM/Registro
- Cartão "Síntese Executiva": 4 KPIs (Pontuação, Desempenho %, Domínios avaliados, Parâmetros avaliados)
- Barra de progresso geral colorida por faixa de desempenho

**Página 2 — Visão Gráfica Consolidada**
- Radar por Domínio (StaticChart SVG, 5 eixos)
- Pizza Desenvolvido vs. A desenvolver
- Legenda de domínios com cores oficiais

**Página 3 — Desempenho por Subdomínio**
- Gráfico de barras horizontais (16 subdomínios), cor por domínio
- Legenda de classificação (Excelente/Satisfatório/Em Desenvolvimento/Necessita Atenção)

**Páginas 4+ — Detalhamento por Domínio (uma seção por domínio, paginada automaticamente)**
Para cada um dos 5 domínios:
- Faixa colorida com nome do domínio + média % + classificação
- Tabela de subdomínios: nome · % · barra de progresso · classificação
- Lista expandida dos parâmetros avaliados (nome + frequência marcada), exibindo **todos** os 128 itens — paginado seção-a-seção para nunca cortar uma tabela ao meio.

**Última página — Rodapé profissional**
- Carimbo digital + foto do profissional (se houver)
- Dados de contato
- Aviso de confidencialidade
- Data/hora de emissão

## Implementação técnica

### Arquivos novos
- `src/components/pdf/GraphReportPDF.tsx` — novo componente renderizado off-screen, dividido em blocos `<section data-pdf-section>` (cabeçalho, gráficos, tabela barras, e **um bloco por domínio**, com sub-blocos `data-pdf-section` por subdomínio quando o domínio for muito longo).
- `src/utils/sectionPdfGenerator.ts` — utilitário que:
  1. Renderiza o componente em container off-screen (`renderForPdf`).
  2. Itera por `[data-pdf-section]`.
  3. Para cada seção: `html2canvas(scale: 2, backgroundColor: '#fff')` → mm.
  4. Se `heightMM > espaçoRestante && currentY > margem` → `pdf.addPage()`.
  5. `pdf.addImage(..., 'JPEG', 0.92)` e atualiza `currentY += heightMM + 4`.
  6. Retorna `Blob` (para pré-visualização) e dispara `save()`.
  - Constantes: A4 210×297, margem 10 mm, gap 4 mm.

### Arquivos editados
- `src/pages/evaluation/index.tsx`:
  - Substituir corpo de `handleGenerateParametersPDF` e `handleGenerateParametersPDFFromSaved` para usar `generateSectionPdf(<GraphReportPDF .../>)`.
  - Manter o `PDFPreviewDialog` existente exibindo o Blob retornado.
- Manter `ParametersGraphsPDF.tsx` antigo intocado (não é mais usado por este botão; pode ser removido em passo futuro).

### Garantias de completude
- Cada subdomínio com seus 8 parâmetros vira `<section data-pdf-section>` independente → impossível cortar no meio.
- Sem `height: 297mm` nem `overflow: hidden` → conteúdo nunca é "escondido".
- Sem `pagebreak` do html2pdf → sem páginas brancas por dupla quebra.
- StaticChart (SVG) usado para todos os gráficos → renderização determinística no canvas.

### QA antes de entregar
- Após implementar, abrir o `PDFPreviewDialog` e validar que:
  - Não há páginas em branco.
  - Todos os 5 domínios e 16 subdomínios aparecem.
  - Tabelas não cortam linhas entre páginas.
  - Cabeçalho e rodapé presentes.

## O que NÃO muda
- Lógica de cálculo de scores, `selections`, `evaluationDomains` — usados como-está.
- Botão "Baixar Gráfico" e fluxo de pré-visualização permanecem.
- `ParametersGraphsPDFStatic` (usado por outros lugares via `useEvaluationPDF`) fica intocado.
