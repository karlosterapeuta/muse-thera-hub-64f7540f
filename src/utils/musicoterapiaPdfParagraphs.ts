/**
 * Divide blocos narrativos longos em parágrafos visualmente estáveis.
 * Não reescreve informações clínicas; apenas escolhe pontos de quebra
 * preferencialmente em fim de frase, depois em separadores ou espaços.
 * Cada parágrafo curto pode ser mantido inteiro pelo exportador.
 */
export function splitMusicoterapiaPdfParagraphs(value: unknown, limit = 480): string[] {
  const text = typeof value === 'string' ? value : String(value ?? '');
  const chunks: string[] = [];
  for (const raw of text.split(/\n\s*\n/)) {
    let paragraph = raw.trim();
    while (paragraph.length > limit) {
      let at = paragraph.lastIndexOf('. ', limit);
      if (at >= Math.round(limit * 0.5)) {
        at += 1; // preservar o ponto e retirar apenas a quebra após a frase
      } else {
        at = paragraph.lastIndexOf('; ', limit);
        if (at >= Math.round(limit * 0.5)) at += 1;
        else {
          at = paragraph.lastIndexOf(' ', limit);
          if (at < Math.round(limit * 0.4)) at = limit;
        }
      }
      chunks.push(paragraph.slice(0, at).trim());
      paragraph = paragraph.slice(at).trim();
    }
    if (paragraph) chunks.push(paragraph);
  }
  return chunks;
}
