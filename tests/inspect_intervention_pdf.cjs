/** Inspeciona texto e paginação sem utilitários externos (dados do teste são fictícios). */
const fs = require('node:fs');

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const document = await pdfjs.getDocument({
    data: new Uint8Array(fs.readFileSync(process.argv[2])),
    useSystemFonts: true,
    disableFontFace: true,
    verbosity: 0,
  }).promise;
  const pageTexts = [];
  for (let page = 1; page <= document.numPages; page += 1) {
    const current = await document.getPage(page);
    const content = await current.getTextContent();
    pageTexts.push(content.items.map(item => item.str || '').join(' '));
  }
  process.stdout.write(JSON.stringify({ pages: document.numPages, text: pageTexts.join('\n') }));
  await document.destroy();
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
