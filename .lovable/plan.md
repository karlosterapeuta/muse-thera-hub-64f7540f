## Problema

Nas fotos enviadas, o PDF baixado em "Baixar Avaliação" (relatório de texto gerado por IA em `EvaluationTextPDF.tsx`) mostra:
- Texto ultrapassando a margem direita (última letra cortada).
- Palavras longas (ex.: nome do paciente, e-mail profissional) forçando overflow horizontal.
- Rodapé com foto/carimbo empurrando conteúdo para fora quando o nome/registro é longo.

## Causa

O `EvaluationTextPDF` foi desenhado com padding no container externo (14mm), mas o `generateSectionPdf` captura cada bloco `[data-pdf-section]` **individualmente** e desenha em 190mm no PDF. Como os blocos internos não respeitam esse padding interno (não têm padding próprio, e alguns usam `gridTemplateColumns: 1fr 1fr` ou larguras fixas de 280px para o carimbo), o conteúdo pode:
1. Estourar horizontalmente dentro da seção capturada (scrollWidth > largura útil).
2. Ficar colado nas bordas do PDF (o padding externo é ignorado no recorte por seção).
3. Quebrar palavras longas de forma incorreta (`wordBreak: break-word` aplicado só no container pai).

## Solução — só ajustes em `src/components/EvaluationTextPDF.tsx`

Reorganizar o componente para que **cada seção** (`[data-pdf-section]`) tenha:
- **Largura fixa própria** = 182mm (210mm − 2×14mm), evitando qualquer overflow horizontal na captura.
- `boxSizing: border-box`, `overflowWrap: anywhere` e `hyphens: auto` em todos os blocos de texto para tratar palavras/emails longos.
- Trocar os grids `1fr 1fr` do cabeçalho de dados do paciente e do rodapé por layout com `minmax(0, 1fr)` (permite encolher) ou flex responsivo, evitando estouro quando um dos lados tem conteúdo longo.
- Reduzir o carimbo (280×280 → 220×220) e o card de assinatura para caberem lado-a-lado dentro de 182mm sem transbordar.
- Padronizar `padding: 0` no container externo (o padding será interno em cada seção), garantindo que o recorte por seção mantenha respiro visual idêntico ao preview.
- Aplicar `word-break: normal` + `overflow-wrap: anywhere` + `hyphens: auto` (regras seguras) nos elementos `<p>`, `<h1..h4>`, `<li>`, `<strong>` e nos textos dentro do rodapé (nome, e-mail, telefone, registro).
- Garantir `max-width: 100%` em `<img>` (foto do profissional) para nunca puxar largura mínima do grid.

## Verificação

Após ajuste:
- Gerar o PDF de exemplo com um paciente de nome longo e um e-mail extenso e conferir visualmente (converter para imagens com pdftoppm) que:
  - Nenhum texto encosta ou passa da borda direita.
  - Todas as seções ocupam exatamente a mesma largura no PDF.
  - Cabeçalho, rodapé de assinatura e carimbo ficam alinhados dentro da caixa.

Nenhum outro arquivo precisa mudar — o gerador (`generateSectionPdf`) já pagina corretamente; o problema estava no template.