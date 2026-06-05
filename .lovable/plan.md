Plano para corrigir o erro no PDF de “Baixar Avaliação”:

1. Substituir a geração frágil com `html2pdf` no fluxo do botão “Baixar Avaliação” por uma geração seção-a-seção usando o utilitário já existente `generateSectionPdf`, que evita páginas em branco e cortes causados por `pagebreak: avoid-all`.

2. Marcar o componente `EvaluationTextPDF` com blocos `[data-pdf-section]` em partes naturais do relatório:
   - cabeçalho + dados do paciente;
   - síntese geral;
   - conquistas por domínio;
   - áreas de desenvolvimento por domínio;
   - recomendações;
   - objetivos;
   - rodapé profissional.

3. Ajustar estilos do `EvaluationTextPDF` para PDF profissional e estável:
   - largura interna compatível com A4 sem overflow;
   - quebra segura de palavras/textos longos;
   - remover `pageBreakInside: avoid` em seções muito grandes;
   - reduzir risco de conteúdo passar da página.

4. Atualizar os dois fluxos que geram o texto de avaliação:
   - avaliação atual (`handleGenerateEvaluationText`);
   - avaliação salva/histórico (`handleGenerateTextForSavedEvaluation`).

5. Manter o download e o salvamento no storage Supabase, mas agora usando o Blob retornado pelo novo gerador.

Resultado esperado: o botão “Baixar Avaliação” volta a baixar o PDF sem erro, com menos páginas em branco e sem textos ultrapassando as margens.