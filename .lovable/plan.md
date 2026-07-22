## Objetivo
Acelerar o download do PDF do botão "Baixar Avaliação" (função `handleGenerateEvaluationText` em `src/pages/evaluation/index.tsx`), que hoje leva vários segundos devido a etapas sequenciais e captura de imagens em alta resolução.

## Onde está o gargalo

1. **Downloads sequenciais de imagens** (assinatura, carimbo, foto): 3 fetches `imageUrlToBase64` executados um após o outro.
2. **`html2canvas` em `scale: 2`** para cada seção `[data-pdf-section]` — a maior parte do tempo é aqui.
3. **`savePDFToStorage` bloqueando o toast de sucesso** antes de o usuário perceber o download.
4. **Delays fixos e etapas encadeadas** (chamada IA → download imagens → render off-screen → captura → upload).

## O que fazer

### 1. Paralelizar as imagens do profissional
Trocar os três `await imageUrlToBase64(...)` sequenciais por um único `Promise.all([...])`. Ganho: até ~2/3 do tempo dessa etapa.

### 2. Iniciar o pré-carregamento das imagens **em paralelo com a chamada da IA**
Disparar `Promise.all` das imagens antes/junto com `supabase.functions.invoke('generate-evaluation-text', ...)` e só dar `await` depois — a rede da IA e a rede das imagens rodam simultaneamente.

### 3. Reduzir o custo de captura no `generateSectionPdf`
Chamar `generateSectionPdf(pdfContent, { filename, scale: 1.5 })` em vez de `scale: 2`. `scale: 2` gera bitmaps 4× maiores (CPU + memória + `toDataURL` mais lentos). `1.5` mantém nitidez suficiente para texto em A4 e corta ~40% do tempo de captura. (Escala do gerador continua parametrizável.)

### 4. Paralelizar as capturas de seção dentro do `generateSectionPdf`
Hoje o `for … of sections` faz `await html2canvas` uma seção por vez. Passar para `Promise.all(sections.map(sec => html2canvas(sec, ...)))` e depois iterar os canvases já prontos para montar o PDF. As seções são independentes (mesmo DOM off-screen), então podem ser capturadas em paralelo. Ganho grande em relatórios com várias seções.

### 5. Não bloquear o download no upload para o Storage
Fazer o `a.click()` primeiro (usuário já vê o arquivo baixando), fechar o toast de sucesso, e só então disparar `savePDFToStorage(...)` sem `await` (fire-and-forget com `.catch(console.warn)`). O usuário percebe o PDF pronto imediatamente.

### 6. Ajustes menores
- Remover `toast.loading` intermediário duplicado (usar um único toast atualizado por `id`).
- Não recomprimir imagens que já são pequenas: manter `image/jpeg` a `0.92` (ok).

## Arquivos a alterar

- `src/pages/evaluation/index.tsx` — refatorar `handleGenerateEvaluationText` (paralelizar imagens + IA, `scale: 1.5`, upload não-bloqueante).
- `src/utils/sectionPdfGenerator.ts` — capturar seções em paralelo com `Promise.all` e depois montar o PDF em ordem.

## Resultado esperado
Redução perceptível (estimativa: 40–60%) no tempo entre clicar em "Baixar Avaliação" e ver o PDF baixando, sem mudar visualmente o resultado final.
