import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { renderForPdf } from './renderForPdf';
import type { ReactElement } from 'react';

const A4_W_MM = 210;
const A4_H_MM = 297;
const MARGIN_MM = 10;
const GAP_MM = 4;
const CONTENT_W_MM = A4_W_MM - MARGIN_MM * 2; // 190mm

interface SectionPdfOptions {
  filename: string;
  scale?: number;
}

/**
 * Renderiza um componente React off-screen, captura cada bloco
 * `[data-pdf-section]` como imagem e monta um PDF A4 paginando por seção.
 *
 * Garantias:
 *  - Nunca corta uma seção no meio: se não couber, nova página.
 *  - Sem páginas em branco: só adiciona página quando há conteúdo.
 *  - Sem dependência de pagebreak CSS frágil do html2pdf.
 *
 * Retorna o Blob do PDF — o caller decide se faz preview e/ou save.
 */
export async function generateSectionPdf(
  element: ReactElement,
  options: SectionPdfOptions
): Promise<Blob> {
  const { filename, scale = 2 } = options;
  const { root, ready, cleanup } = renderForPdf(element);
  try {
    await ready;
  } catch (err: any) {
    console.error("Erro no ready do PDF:", err);
    cleanup();
    throw err;
  }
  try {
    const sections = Array.from(
      root.querySelectorAll('[data-pdf-section]')
    ) as HTMLElement[];

    if (sections.length === 0) {
      throw new Error('Nenhuma seção [data-pdf-section] encontrada.');
    }

    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    });

    let currentY = MARGIN_MM;
    let isFirstOnPage = true;

    for (const sec of sections) {
      const canvas = await html2canvas(sec, {
        scale,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: true, // Habilitar para ver erros internos do canvas
        windowWidth: 794, // 210mm em pixels (96 DPI)
        onclone: (clonedDoc) => {
          // Garante que o elemento clonado esteja visível
          const el = clonedDoc.querySelector(`[data-pdf-section]`) as HTMLElement;
          if (el) el.style.visibility = 'visible';
        }
      });

      const heightMM = (canvas.height * CONTENT_W_MM) / canvas.width;
      const spaceLeft = A4_H_MM - MARGIN_MM - currentY;

      // Se não couber e já tem algo na página, abre nova página
      if (!isFirstOnPage && heightMM > spaceLeft) {
        pdf.addPage();
        currentY = MARGIN_MM;
        isFirstOnPage = true;
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      // Caso extremo: a seção sozinha é maior que a página inteira
      // → escala para caber em uma página
      const maxHeight = A4_H_MM - MARGIN_MM * 2;
      let drawW = CONTENT_W_MM;
      let drawH = heightMM;
      if (drawH > maxHeight) {
        const ratio = maxHeight / drawH;
        drawH = maxHeight;
        drawW = CONTENT_W_MM * ratio;
      }

      pdf.addImage(imgData, 'JPEG', MARGIN_MM, currentY, drawW, drawH);
      currentY += drawH + GAP_MM;
      isFirstOnPage = false;
    }

    const blob = pdf.output('blob') as Blob;
    return blob;
  } finally {
    cleanup();
  }
}

export const SECTION_PDF_FILENAME_SAFE = (s: string) =>
  s.replace(/[^a-zA-Z0-9-_]+/g, '_').replace(/^_+|_+$/g, '');
