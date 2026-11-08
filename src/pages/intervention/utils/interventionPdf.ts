import { jsPDF } from 'jspdf';
import type { TherapyActivity } from '@/types/therapy-activity';

type ProfessionalIdentification = {
  name: string;
  specialty?: string | null;
  registration?: string | null;
  email?: string | null;
  phone?: string | null;
  signatureDataUrl?: string | null;
  stampDataUrl?: string | null;
  photoDataUrl?: string | null;
};

export type InterventionPdfInput = {
  patientName: string;
  planDate: Date;
  activities: TherapyActivity[];
  professional: ProfessionalIdentification;
};

const GREEN: [number, number, number] = [35, 91, 65];
const DARK: [number, number, number] = [27, 42, 33];
const MUTED: [number, number, number] = [73, 89, 77];
const PALE: [number, number, number] = [242, 247, 243];
const RULE: [number, number, number] = [211, 225, 216];

/** Texto real no PDF: permite pesquisar, selecionar e copiar conteúdo clínico. */
export function buildInterventionPdf(input: InterventionPdfInput): jsPDF {
  if (!input.activities.length) throw new Error('Nenhuma atividade disponível para exportação.');

  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const pageWidth = 210;
  const left = 18;
  const right = 18;
  const contentWidth = pageWidth - left - right;
  const bottom = 270;
  let y = 18;
  let currentActivityLabel = '';

  // O modelo de origem permite que atividades tragam linhas múltiplas.
  const safeText = (value: unknown): string => String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .split('').filter(character => {
      const code = character.charCodeAt(0);
      return code === 10 || code === 9 || (code >= 32 && code !== 127);
    }).join('')
    .trim();
  const date = Number.isNaN(input.planDate.getTime())
    ? 'Data não informada'
    : input.planDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  doc.setProperties({
    title: 'Plano de Intervenção Musicoterapêutica',
    subject: 'Sugestões de atividades para revisão profissional',
    creator: 'MuseTera',
    author: input.professional.name || 'Musicoterapeuta',
  });

  const setText = (size: number, weight: 'normal' | 'bold' = 'normal', color = DARK) => {
    doc.setFont('helvetica', weight);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const nextPage = () => {
    doc.addPage();
    y = 18;
    setText(8, 'bold', GREEN);
    doc.text('MUSETERA  /  INTERVENÇÃO MUSICOTERAPÊUTICA', left, y);
    y += 4;
    doc.setDrawColor(...RULE);
    doc.line(left, y, pageWidth - right, y);
    y += 8;
    if (currentActivityLabel) {
      setText(8.4, 'bold', MUTED);
      doc.text(`CONTINUAÇÃO  /  ${currentActivityLabel}`, left, y);
      y += 7;
    }
  };

  const ensureSpace = (height: number) => {
    if (y + height > bottom) nextPage();
  };

  const linesFor = (value: unknown, width: number): string[] => {
    const text = safeText(value);
    if (!text) return [];
    return text.split('\n').flatMap(line => line
      ? doc.splitTextToSize(line, width) as string[]
      : ['']);
  };

  const drawLines = (lines: string[], x: number, lineHeight = 4.55) => {
    for (const line of lines) {
      ensureSpace(lineHeight + 0.5);
      doc.text(line || ' ', x, y);
      y += lineHeight;
    }
  };

  const drawField = (label: string, value: unknown) => {
    const text = safeText(value);
    if (!text) return;
    setText(9.3);
    const lines = linesFor(text, contentWidth - 2);
    ensureSpace(5.5 + Math.min(lines.length, 2) * 4.55);
    setText(9.1, 'bold', GREEN);
    doc.text(label, left, y);
    y += 4.7;
    setText(9.3, 'normal', DARK);
    drawLines(lines, left + 1);
    y += 2.2;
  };

  const drawList = (label: string, values: unknown) => {
    if (!Array.isArray(values) || !values.length) return;
    setText(9.2);
    const allLines = values.map(value => linesFor('- ' + safeText(value), contentWidth - 3)).filter(lines => lines.length);
    const entireListHeight = 4.7 + allLines.reduce((sum, lines) => sum + lines.length * 4.4, 0) + 2.2;
    // Evita deixar uma única linha de materiais/critério solta em outra página.
    ensureSpace(Math.min(entireListHeight, bottom - 18));
    setText(9.1, 'bold', GREEN);
    doc.text(label, left, y);
    y += 4.7;
    setText(9.2, 'normal', DARK);
    for (const lines of allLines) {
      ensureSpace(Math.min(2, lines.length) * 4.4);
      drawLines(lines, left + 2, 4.4);
    }
    y += 2.2;
  };

  // Cabeçalho enxuto: nenhum conteúdo é forçado para uma folha seguinte.
  setText(8.5, 'bold', GREEN);
  doc.text('MUSETERA  /  PLANEJAMENTO CLÍNICO', left, y);
  y += 8;
  setText(17, 'bold', GREEN);
  doc.text('Plano de Intervenção', left, y);
  y += 6;
  setText(11.5, 'normal', MUTED);
  doc.text('Musicoterapia', left, y);
  y += 8;
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.55);
  doc.line(left, y, pageWidth - right, y);
  y += 5;

  const patientLines = linesFor(input.patientName || 'Não informado', contentWidth - 12);
  const boxHeight = 14 + patientLines.length * 5;
  doc.setFillColor(...PALE);
  doc.roundedRect(left, y, contentWidth, boxHeight, 2, 2, 'F');
  y += 6;
  setText(7.7, 'bold', MUTED);
  doc.text('PACIENTE', left + 5, y);
  y += 5;
  setText(10.3, 'bold', DARK);
  for (const line of patientLines) {
    doc.text(line, left + 5, y);
    y += 5;
  }
  y += 4;
  setText(8.6, 'normal', MUTED);
  doc.text(`Data do plano: ${date}  |  ${input.activities.length} atividades`, left, y);
  y += 6;
  setText(8.4, 'normal', MUTED);
  const notice = linesFor('Atividades sugeridas com apoio de IA. A indicação, adaptação e aplicação dependem da avaliação e revisão do musicoterapeuta.', contentWidth);
  drawLines(notice, left, 4.4);
  y += 6;

  input.activities.forEach((activity, index) => {
    ensureSpace(25);
    currentActivityLabel = `ATIVIDADE ${String(index + 1).padStart(2, '0')}  |  ${safeText(activity.disorder)}`;
    doc.setFillColor(...GREEN);
    doc.roundedRect(left, y - 4, contentWidth, 8.5, 1.6, 1.6, 'F');
    setText(9.5, 'bold', [255, 255, 255]);
    doc.text(`ATIVIDADE ${String(index + 1).padStart(2, '0')}  |  ${safeText(activity.disorder)}`, left + 4, y + 1.4);
    y += 10;

    drawField('Demanda trabalhada', activity.demand);
    if (activity.specialty) drawField('Área de atuação', activity.specialty);
    drawField('Objetivo terapêutico geral', activity.generalObjective);
    drawField('Objetivo específico', activity.specificObjective);
    drawField('Procedimento / descrição da atividade', activity.activityDescription);
    drawList('Materiais necessários', activity.materials);
    const meta = [activity.estimatedTime && `Tempo estimado: ${safeText(activity.estimatedTime)}`,
      activity.complexityLevel && `Complexidade: ${safeText(activity.complexityLevel)}`]
      .filter(Boolean).join('  |  ');
    drawField('Planejamento', meta);
    drawList('Critérios de acompanhamento', activity.evaluationCriteria);
    y += 2;
    ensureSpace(3);
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.22);
    doc.line(left, y, pageWidth - right, y);
    y += 8;
    currentActivityLabel = '';
  });

  // Fecho técnico, sem selos de validação inventados ou molduras decorativas.
  ensureSpace(38);
  setText(10, 'bold', GREEN);
  doc.text('RESPONSÁVEL PROFISSIONAL', left, y);
  y += 6;
  setText(10, 'bold', DARK);
  drawLines(linesFor(input.professional.name || 'Profissional não identificado', contentWidth), left, 5);
  setText(8.8, 'normal', MUTED);
  if (input.professional.specialty) drawLines(linesFor(input.professional.specialty, contentWidth), left, 4.5);
  if (input.professional.registration) drawLines(linesFor(`Registro / identificação: ${input.professional.registration}`, contentWidth), left, 4.5);
  if (input.professional.email) drawLines(linesFor(`Contato: ${input.professional.email}`, contentWidth), left, 4.5);
  if (input.professional.phone) drawLines(linesFor(`Telefone: ${input.professional.phone}`, contentWidth), left, 4.5);
  y += 4;

  const drawImage = (dataUrl: string, x: number, maxW: number, maxH: number) => {
    const image = doc.getImageProperties(dataUrl);
    const ratio = Math.min(maxW / image.width, maxH / image.height);
    const width = image.width * ratio;
    const height = image.height * ratio;
    doc.addImage(dataUrl, image.fileType, x, y, width, height, undefined, 'FAST');
    return height;
  };
  if (input.professional.signatureDataUrl || input.professional.stampDataUrl || input.professional.photoDataUrl) {
    ensureSpace(30);
    const imageTop = y;
    const signatureHeight = input.professional.signatureDataUrl
      ? drawImage(input.professional.signatureDataUrl, left + 4, 48, 20) : 0;
    y = imageTop;
    const stampHeight = input.professional.stampDataUrl
      ? drawImage(input.professional.stampDataUrl, left + 75, 44, 23) : 0;
    y = imageTop;
    const photoHeight = input.professional.photoDataUrl
      ? drawImage(input.professional.photoDataUrl, left + 145, 20, 23) : 0;
    y = imageTop + Math.max(signatureHeight, stampHeight, photoHeight) + 4;
    setText(7.5, 'normal', MUTED);
    if (input.professional.signatureDataUrl) doc.text('Assinatura cadastrada', left + 4, y);
    if (input.professional.stampDataUrl) doc.text('Carimbo cadastrado', left + 75, y);
    if (input.professional.photoDataUrl) doc.text('Foto cadastrada', left + 145, y);
    y += 6;
  }

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.2);
    doc.line(left, 281, pageWidth - right, 281);
    setText(7.5, 'normal', MUTED);
    doc.text('MuseTera  |  Documento clínico de uso profissional', left, 286);
    doc.text(`Página ${page} de ${pages}`, pageWidth - right, 286, { align: 'right' });
  }

  return doc;
}
