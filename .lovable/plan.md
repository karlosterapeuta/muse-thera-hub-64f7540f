

## Plano: Organizar PDF do Relatório de Musicoterapia no formato A4

### Problema Atual
A função `generatePDFContent` em `src/pages/processes/musicoterapia/index.tsx` (linhas 93-278) gera HTML sem controle de quebra de página, usa `display: grid` (incompatível com html2canvas), e aplica `filter: blur()` no footer (causa `InvalidStateError`). O resultado é um PDF com conteúdo cortado entre páginas e layout desorganizado.

### Alterações em `src/pages/processes/musicoterapia/index.tsx`

**1. Reestruturar o container principal para A4**
- Definir `width: 210mm`, `min-height: 297mm`, `padding: 20mm` no wrapper
- Usar `font-family: Arial, sans-serif` com `font-size: 12px`, `line-height: 1.6`

**2. Controle de quebra de página em cada seção**
- Adicionar `page-break-inside: avoid` em todos os blocos de seção (Objetivos, Técnicas, Instrumentos, Atividades, Evolução, Recomendações, Conclusão)
- Adicionar `page-break-before: auto` para permitir que seções grandes fluam para a próxima página sem cortar

**3. Substituir `display: grid` por `display: flex`**
- O bloco de Dados do Paciente/Profissional (linha 112) usa `grid-template-columns: 1fr 1fr` -- trocar para `display: flex; gap: 20px` com filhos em `flex: 1`
- O footer (linha 196) também usa grid -- trocar para flex

**4. Remover `filter: blur()` do footer**
- Linhas 206, 248: remover efeito blur das sombras decorativas (causa InvalidStateError no html2canvas)
- Substituir por `box-shadow` simples ou bordas sólidas

**5. Ajustar margens do html2pdf**
- Alterar margem de `[20, 20, 20, 20]` para `[10, 10]` (conforme padrão A4 do projeto, pois o padding já está no HTML)

**6. Adicionar `pagebreak` config no opt do html2pdf**
- Adicionar `pagebreak: { mode: ['css', 'legacy'], avoid: '.section-block' }` nas opções

**7. Tratar campos como texto corrido**
- Quando o campo é string (não array), renderizar como `<p>` em vez de `<ul><li>`
- Garantir `white-space: pre-wrap` para preservar quebras de linha do usuário

### Arquivos Afetados
- `src/pages/processes/musicoterapia/index.tsx` -- função `generatePDFContent` (linhas 93-278) e configurações de `handleExportPDF` (linhas 456-463) e `handleDownloadReportPDF` (linhas 606-612)

