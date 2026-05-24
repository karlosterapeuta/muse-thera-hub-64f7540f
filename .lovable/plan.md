Vou corrigir o PDF exportado da página Avaliação no componente `GraphReportPDF`, especificamente a tabela de parâmetros onde aparece a coluna “Frequência”.

Plano:
1. Ajustar a largura da coluna “Frequência” para comportar o maior texto, como “Inconsistente” e “Não Observado”.
2. Trocar o badge atual de `inline-block` por uma estrutura PDF-safe com largura fixa, altura mínima, alinhamento central e `boxSizing: border-box`.
3. Remover o risco de corte vertical do texto aumentando `lineHeight`, padding/altura da célula e evitando que o conteúdo ultrapasse o container.
4. Manter as cores e a aparência profissional do relatório, apenas garantindo que o texto fique totalmente dentro da caixa no PDF gerado.
5. Revisar também o PDF antigo `TeaScalePDF`, caso ele ainda seja usado por algum botão de exportação da avaliação, aplicando o mesmo padrão seguro nos badges de pontuação.