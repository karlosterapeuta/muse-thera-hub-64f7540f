import { createRoot, type Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import type { ReactElement } from 'react';

/**
 * Renderiza um elemento React em um container fora da tela para geração
 * de PDF (html2pdf/html2canvas). Retorna o nó DOM, uma promise `ready` que
 * resolve quando o conteúdo está realmente pintado (fontes + imagens) e
 * uma função de cleanup que deve ser SEMPRE chamada em um bloco finally.
 *
 * IMPORTANTE: sempre `await ready` antes de chamar html2pdf/html2canvas.
 *
 * Estratégia para evitar PDF em branco:
 *  - `position: absolute` (não fixed) + offscreen via `left: -9999px`
 *    funciona melhor com html2pdf.js do que `position: fixed`.
 *  - Largura explícita 210mm (A4) garante layout estável e evita que o
 *    elemento clonado pelo html2pdf colapse para 0px.
 *  - `flushSync` garante commit síncrono do React 18 antes do await.
 *  - Aguarda fontes (Instrument Serif, Work Sans, etc.) e todas as imagens.
 */
export function renderForPdf(element: ReactElement): {
  container: HTMLDivElement;
  root: HTMLDivElement;
  ready: Promise<void>;
  cleanup: () => void;
} {
  const container = document.createElement('div');
  container.setAttribute('data-pdf-render', 'true');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '210mm';
  container.style.minHeight = '297mm';
  container.style.background = '#ffffff';
  container.style.color = '#000000';
  container.style.zIndex = '-1';
  container.style.pointerEvents = 'none';
  container.style.visibility = 'visible';
  container.style.opacity = '1';
  document.body.appendChild(container);

  const root = document.createElement('div');
  root.style.width = '100%';
  root.style.minHeight = '100%';
  root.style.background = '#ffffff';
  root.style.color = '#000000';
  container.appendChild(root);

  const reactRoot: Root = createRoot(root);
  // Commit síncrono para garantir DOM populado antes do await ready
  flushSync(() => {
    reactRoot.render(element);
  });

  const nextFrame = () =>
    new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

  const ready = (async () => {
    // 2 frames para garantir commit + paint do React
    await nextFrame();
    await nextFrame();

    // Aguarda fontes carregarem
    try {
      // @ts-ignore
      if (document.fonts?.ready) await document.fonts.ready;
    } catch {
      // ignore
    }

    // Aguarda todas as imagens (logo, base64, signatures)
    const imgs = Array.from(root.querySelectorAll('img'));
    await Promise.all(
      imgs.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const done = () => resolve();
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
          // Timeout de segurança para não travar
          setTimeout(done, 4000);
        });
      })
    );

    // Frame final + pequeno delay para estabilizar layout (Recharts/SVG)
    await nextFrame();
    await new Promise((r) => setTimeout(r, 250));
    await nextFrame();

    // Verificação defensiva: se o root estiver vazio, lança erro claro
    // (evita PDF em branco silencioso).
    if (root.innerHTML.trim().length < 50) {
      throw new Error(
        '[renderForPdf] Conteúdo renderizado vazio — verifique o componente.'
      );
    }
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
