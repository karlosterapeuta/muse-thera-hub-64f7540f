import { createRoot, type Root } from 'react-dom/client';
import type { ReactElement } from 'react';

/**
 * Renderiza um elemento React em um container temporário fora da tela para
 * geração de PDF (html2pdf/html2canvas). Retorna o nó DOM, uma promise
 * `ready` que resolve quando o conteúdo está realmente pintado (com fontes
 * e imagens carregadas) e uma função de cleanup que deve ser sempre chamada
 * em um bloco finally.
 *
 * Substitui o uso de ReactDOM.render (deprecated no React 18) e garante
 * limpeza do DOM mesmo se a geração do PDF lançar erro.
 *
 * IMPORTANTE: sempre `await ready` antes de chamar html2pdf/html2canvas,
 * caso contrário o capture acontece antes do React montar o DOM e o PDF
 * sai em branco.
 */
export function renderForPdf(element: ReactElement): {
  container: HTMLDivElement;
  root: HTMLDivElement;
  ready: Promise<void>;
  cleanup: () => void;
} {
  const container = document.createElement('div');
  // Renderiza fora da viewport mas mantém layout/medidas reais
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.style.width = '210mm'; // A4 width para layout estável
  container.style.background = '#ffffff';
  container.style.zIndex = '-1';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  const root = document.createElement('div');
  container.appendChild(root);

  const reactRoot: Root = createRoot(root);
  reactRoot.render(element);

  const nextFrame = () =>
    new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

  const ready = (async () => {
    // Aguarda 2 frames para garantir commit + paint do React
    await nextFrame();
    await nextFrame();

    // Aguarda fontes carregarem (Instrument Serif, Work Sans, etc.)
    try {
      // @ts-ignore
      if (document.fonts?.ready) await document.fonts.ready;
    } catch {
      // ignore
    }

    // Aguarda todas as imagens (logo, base64, etc.)
    const imgs = Array.from(root.querySelectorAll('img'));
    await Promise.all(
      imgs.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const done = () => resolve();
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
          // Fallback de timeout para não travar
          setTimeout(done, 3000);
        });
      })
    );

    // Mais um frame para garantir layout final
    await nextFrame();
  })();

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    try {
      reactRoot.unmount();
    } catch {
      // ignore
    }
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };

  return { container, root, ready, cleanup };
}
