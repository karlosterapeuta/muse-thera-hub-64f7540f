## Problema

Ao clicar em **"Exportar PDF com IA"** no Relatório MuseTera TEA, aparece um erro.

A causa é a função de IA `organize-musicoterapia-report`: ela chama o modelo **`gemini-1.5-flash`** diretamente na API do Google (`generativelanguage.googleapis.com`). Esse modelo foi descontinuado, então a chamada falha e a função retorna erro 500. Como o botão "Exportar PDF" primeiro organiza com IA e só depois gera o PDF, a falha da IA interrompe todo o processo e mostra o toast de erro — sem gerar o PDF.

Todas as outras funções de IA do projeto que funcionam (`generate-evaluation-text`, `musicotherapy-chat`) já usam o **Lovable AI Gateway** com `google/gemini-2.5-flash`. A função de musicoterapia ficou desatualizada.

## Solução

### 1. Migrar a edge function para o Lovable AI Gateway
Reescrever `supabase/functions/organize-musicoterapia-report/index.ts`:
- Usar `https://ai.gateway.lovable.dev/v1/chat/completions` com `Authorization: Bearer ${LOVABLE_API_KEY}` e modelo `google/gemini-2.5-flash` (mesmo padrão das funções que funcionam).
- Manter o prompt que preserva **todos** os campos preenchidos e melhora a redação técnica.
- Solicitar saída em JSON e extrair o conteúdo da resposta do gateway.

### 2. Tornar a função resiliente (nunca quebrar o PDF)
- Nunca retornar 500 por falha da IA. Em qualquer erro (modelo, parse, rate limit), retornar status 200 com `success: false` + `fallbackContent` contendo os campos originais.
- Tratar 429 (limite) e 402 (créditos) com mensagens claras, mas ainda devolvendo os campos originais como fallback para o PDF.

### 3. Garantir que o PDF sempre seja gerado no cliente
Em `src/pages/processes/musicoterapia/index.tsx` (`handleExportPDF`) e no hook `useMusicoterapiaReport.ts`:
- Se a IA falhar, usar os dados originais e **continuar gerando o PDF** normalmente, exibindo um aviso suave ("PDF gerado sem otimização de IA") em vez de um erro que interrompe tudo.

## Detalhes técnicos

- Arquivo principal: `supabase/functions/organize-musicoterapia-report/index.ts` (reescrita da chamada de IA).
- Hook: `src/hooks/useMusicoterapiaReport.ts` — já trata `fallbackContent`; ajustar para não mostrar toast destrutivo quando houver fallback válido.
- Página: `src/pages/processes/musicoterapia/index.tsx` — `handleExportPDF` continua o fluxo do PDF mesmo se a IA não otimizar.
- A função será re-deployada automaticamente.

## Resultado esperado
Clicar em "Exportar PDF com IA" passa a organizar o relatório com o modelo atual e gerar o PDF com todas as opções selecionadas. Se a IA estiver indisponível, o PDF ainda é gerado com os dados originais, sem erro bloqueante.