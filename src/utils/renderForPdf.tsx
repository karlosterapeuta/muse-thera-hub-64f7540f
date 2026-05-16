import { createRoot, type Root } from 'react-dom/client';
import type { ReactElement } from 'react';

/**
 * Renderiza um elemento React em um container temporário fora da tela para
 * geração de PDF (html2pdf/html2canvas). Retorna o nó DOM e uma função de
 * cleanup que deve ser sempre chamada em um bloco finally.
 *
 * Substitui o uso de ReactDOM.render (deprecated no React 18) e garante
 * limpeza do DOM mesmo se a geração do PDF lançar erro.
 */
export function renderForPdf(element: ReactElement): {
  container: HTMLDivElement;
  root: HTMLDivElement;
  cleanup: () => void;
} {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.zIndex = '-1';
  document.body.appendChild(container);

  const root = document.createElement('div');
  container.appendChild(root);

  const reactRoot: Root = createRoot(root);
  reactRoot.render(element);

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

  return { container, root, cleanup };
}
