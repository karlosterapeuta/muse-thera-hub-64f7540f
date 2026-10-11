import jsPDF from 'jspdf';
import {
  getSelectedMusicoterapiaObjectives,
  musicoterapiaObjectiveCategories
} from '@/data/musicoterapiaObjectives';
import { getSelectedMusicoterapiaApproaches } from '@/data/musicoterapiaApproaches';
import {
  getObjectiveOutcomes, getPendingObjectiveInterventions, getObjectiveOutcomeLabel
} from '@/data/musicoterapiaObjectiveOutcomes';
import {
  getRecordedApproachResults, summarizeApproachResult
} from '@/data/musicoterapiaApproachResults';
import { getSelectedMusicoterapiaReferences } from '@/data/musicoterapiaReferences';
import { getMusicoterapiaFinalConsiderations } from '@/utils/musicoterapiaFinalConsiderations';
import { formatMusicoterapiaPdfDate, diagnosesHaveSameCid } from '@/utils/musicoterapiaPdfPatientContext';

type Inputs = {
  logo?: string | null;
  photo?: string | null;
  stamp?: string | null;
};
type ClinicalCount = { name: string; value: number; color: [number,number,number] };

const GREEN: [number,number,number] = [15,118,110];
const DARK: [number,number,number] = [32,51,64];
const MUTED: [number,number,number] = [86,103,116];
const PALE: [number,number,number] = [239,250,248];
const BORDER: [number,number,number] = [211,232,229];

const clean = (value: unknown): string => {
  if (value === undefined || value === null) return '';
  const str = Array.isArray(value) ? value.join('; ') : String(value);
  return str.trim().replace(/[\u2013\u2014]/g, '-').replace(/\u2022/g, '-')
    .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
};

const rgb = (pdf: jsPDF, color: [number,number,number], forFill = false) => {
  if (forFill) pdf.setFillColor(...color);
  else pdf.setTextColor(...color);
};

export async function exportMusicoterapiaNativePdf(
  report: any,
  professional: any,
  images: Inputs,
  filename: string,
  narrative?: { title: string; content: string }[] | null
): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true
  });
  pdf.setProperties({
    title: 'Relatório de Musicoterapia - MuseTera',
    subject: 'Documentação musicoterapêutica individualizada',
    creator: 'MuseTera',
    keywords: 'musicoterapia, relatório clínico'
  });

  const fields: Record<string, any> = report.fieldValues || {};
  const margin = 14;
  const right = 196;
  const usable = right - margin;
  const lastY = 276;
  let y = 18;

  const newPage = () => { pdf.addPage(); y = 17; };
  const ensure = (mm: number) => { if (y + mm > lastY) newPage(); };
  const setFace = (size: number, bold = false, color: [number,number,number] = DARK) => {
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    pdf.setFontSize(size);
    rgb(pdf, color);
  };
  const textHeight = (size: number, lines = 1) => Math.max(4, size * 0.3528 * 1.55) * lines;
  const write = (
    value: unknown,
    x = margin,
    width = usable,
    size = 10,
    color: [number,number,number] = DARK,
    bold = false,
    gapAfter = 2
  ) => {
    const str = clean(value);
    if (!str) return;
    setFace(size, bold, color);
    const lineHeight = textHeight(size);
    for (const paragraph of str.split(/\n/)) {
      const lines: string[] = pdf.splitTextToSize(paragraph || ' ', width);
      // Keep short paragraphs together; longer paragraphs may flow by line,
      // never by cropping pixels or clipping the glyphs themselves.
      const paragraphHeight = lines.length * lineHeight + gapAfter;
      if (paragraphHeight < 110) ensure(paragraphHeight);
      for (const line of lines) {
        ensure(lineHeight);
        setFace(size, bold, color);
        pdf.text(line, x, y + size * 0.36);
        y += lineHeight;
      }
    }
    y += gapAfter;
  };
  const header = (title: string, minContent = 25) => {
    // O título e o início da seção devem caber na mesma página.
    ensure(15 + Math.max(25, minContent));
    pdf.setFillColor(...GREEN);
    pdf.roundedRect(margin, y, 3, 7, 1, 1, 'F');
    setFace(12.1, true, GREEN);
    pdf.text(clean(title), margin + 7, y + 5.2);
    y += 9;
    pdf.setDrawColor(...BORDER);
    pdf.setLineWidth(0.25);
    pdf.line(margin, y, right, y);
    y += 5.5;
  };
  const item = (lead: string, explanation = '') => {
    const content = explanation ? lead + ': ' + explanation : lead;
    const str = clean(content);
    const wrapped: string[] = pdf.splitTextToSize(str, usable - 9);
    const lineH = textHeight(10);
    ensure(wrapped.length * lineH + 3);
    pdf.setFillColor(...GREEN);
    pdf.circle(margin + 1.8, y + 2.8, 0.8, 'F');
    write(content, margin + 5.5, usable - 9, 9.75, DARK, false, 2.5);
  };
  const keyValue = (label: string, value: unknown) => {
    const str = clean(value);
    if (!str) return;
    const labelText = clean(label) + ':';
    setFace(9, true, GREEN);
    const labelWidth = pdf.getTextWidth(labelText);
    const maxLabel = Math.min(64, labelWidth + 4);
    const wrap: string[] = pdf.splitTextToSize(str, usable - maxLabel);
    const rowHeight = Math.max(5.5, wrap.length * textHeight(9.2)) + 1.5;
    ensure(rowHeight);
    setFace(9.1, true, GREEN);
    pdf.text(labelText, margin, y + 3.4);
    setFace(9.2, false, DARK);
    pdf.text(wrap, margin + maxLabel, y + 3.4);
    y += rowHeight;
  };
  const addImage = (source: string | null | undefined, x: number, top: number, maxW: number, maxH: number) => {
    if (!source) return;
    try {
      const props = pdf.getImageProperties(source);
      const ratio = props.width / props.height;
      let width = maxW;
      let height = width / ratio;
      if (height > maxH) { height = maxH; width = height * ratio; }
      pdf.addImage(source, props.fileType || 'PNG', x + (maxW - width) / 2, top + (maxH - height) / 2, width, height, undefined, 'FAST');
    } catch {
      // A imagem não deve impedir o download do conteúdo clínico textual.
    }
  };

  // Identidade visual do documento. Não é necessária imagem de banco de imagens.
  ensure(30);
  pdf.setFillColor(...PALE);
  pdf.roundedRect(margin, y, usable, 28, 3, 3, 'F');
  pdf.setFillColor(...GREEN);
  pdf.rect(margin, y, 2.8, 28, 'F');
  const headingX = images.logo ? 50 : margin + 9;
  if (images.logo) addImage(images.logo, margin + 7, y + 5, 28, 17);
  setFace(8, true, GREEN);
  pdf.text('MUSETERA  /  DOCUMENTACAO CLINICA', headingX, y + 8);
  setFace(17.5, true, [19,78,74]);
  pdf.text('Relatório de Musicoterapia', headingX, y + 17);
  setFace(9, false, MUTED);
  pdf.text('Acompanhamento musicoterapêutico individualizado', headingX, y + 22.5);
  // Motivo visual vetorial, desenhado no PDF como linhas e círculos.
  pdf.setDrawColor(20, 184, 166);
  pdf.setLineWidth(0.55);
  const waveX = 165;
  for (let i = 0; i < 7; i++) {
    const x1 = waveX + i * 3.6;
    const h = i % 2 ? 4.5 : -4.5;
    pdf.line(x1, y + 15, x1 + 1.8, y + 15 + h);
    pdf.line(x1 + 1.8, y + 15 + h, x1 + 3.6, y + 15);
  }
  y += 34;

  header('Identificação do paciente', 30);
  keyValue('Paciente', report.patientName);
  keyValue('Data de nascimento', formatMusicoterapiaPdfDate(report.patientBirthDate));
  keyValue('Idade', report.patientAge);
  const cidValue = fields.cid_code || report.patientDiagnosis;
  keyValue('Diagnóstico / CID informado', cidValue);
  if (fields.cid_code && report.patientDiagnosis &&
      !diagnosesHaveSameCid(fields.cid_code, report.patientDiagnosis) &&
      clean(fields.cid_code) !== clean(report.patientDiagnosis)) {
    keyValue('Diagnóstico adicional informado', report.patientDiagnosis);
  }
  keyValue('Responsável', report.patientGuardian);
  keyValue('Musicoterapeuta', report.professionalName || professional?.name);
  keyValue('Registro informado', report.professionalRegistry || professional?.register);
  keyValue('Data do relatório', formatMusicoterapiaPdfDate(report.sessionDate) || new Date().toLocaleDateString('pt-BR'));

  const context: Array<[string,unknown]> = [
    ['Nível de suporte informado', fields.support_level],
    ['Medicação relatada', fields.current_medications],
    ['Período avaliado', fields.evaluation_period],
    ['Frequência dos atendimentos', fields.session_frequency]
  ];
  if (context.some(([,value])=>Boolean(clean(value)))) {
    header('Contexto clínico', 12);
    for (const [label,value] of context) keyValue(label,value);
  }
  if (clean(fields.referral_source) || clean(fields.referral_reason)) {
    header('Motivo do encaminhamento', 12);
    keyValue('Origem do encaminhamento', fields.referral_source);
    write(fields.referral_reason, margin, usable, 9.7, DARK, false, 2);
  }

  const objectives = getSelectedMusicoterapiaObjectives(fields.therapeutic_objective_ids);
  if (objectives.length) {
    header('Objetivos terapêuticos', 12);
    for (const category of musicoterapiaObjectiveCategories) {
      const chosen = objectives.filter(x => x.category === category.id);
      if (!chosen.length) continue;
      setFace(9.5, true, GREEN);
      const firstGoal = chosen[0];
      const firstGoalText = clean(firstGoal.title + ': ' + firstGoal.objective);
      const firstGoalLines: string[] = pdf.splitTextToSize(firstGoalText, usable - 9);
      // Impede que o título da categoria fique isolado da primeira meta.
      ensure(8 + Math.min(80, firstGoalLines.length * textHeight(9.75) + 3));
      pdf.text(clean(category.title), margin + 1, y + 3.4);
      y += 7;
      for (const objective of chosen) item(objective.title, objective.objective);
    }
  }

  const approaches = getSelectedMusicoterapiaApproaches(fields.musicoterapia_approach_ids);
  if (approaches.length) {
    header('Abordagem musicoterapêutica', 32);
    for (const approach of approaches) {
      item(approach.title, approach.description);
    }
  }

  const outcomes = getObjectiveOutcomes(fields.therapeutic_objective_ids, fields.objective_outcomes);
  const recorded = getRecordedApproachResults(fields.musicoterapia_approach_ids, fields.approach_results);
  const needs = getPendingObjectiveInterventions(fields.therapeutic_objective_ids, fields.objective_outcomes);

  const drawCountChart = (
    x: number, top: number, width: number, title: string,
    statuses: ClinicalCount[], total: number
  ) => {
    pdf.setFillColor(250,252,252);
    pdf.setDrawColor(211,232,229);
    pdf.roundedRect(x,top,width,55,2,2,'FD');
    setFace(9.5,true,GREEN);
    pdf.text(title,x+4,top+7);
    const shown = statuses.filter(status=>status.value>0);
    if (!shown.length) {
      setFace(8.5,false,MUTED);
      pdf.text('Sem dados registrados',x+4,top+17);
      return;
    }
    const barWidth = width * 0.32;
    const rowH = Math.min(8.1, 39 / shown.length);
    shown.forEach((status,i)=>{
      const base = top + 12 + i * rowH;
      setFace(8,false,DARK);
      const labels: string[] = pdf.splitTextToSize(status.name,width * 0.46);
      pdf.text(labels[0] || '',x+4,base+2.4);
      pdf.setFillColor(230,238,238);
      pdf.roundedRect(x+width*0.5,base+0.3,barWidth,3.2,1.1,1.1,'F');
      pdf.setFillColor(...status.color);
      pdf.roundedRect(x+width*0.5,base+0.3,Math.max(1.2,barWidth*(status.value/Math.max(total,1))),3.2,1.1,1.1,'F');
      setFace(8.5,true,DARK);
      pdf.text(String(status.value),x+width-5,base+3,{align:'right'});
    });
  };

  if (outcomes.length || recorded.length) {
    header('Painel de resultados observados', 84);
    ensure(68);
    const done = outcomes.filter(x=>x.status !== 'not_assessed').length;
    const cards = [
      [String(done) + '/' + String(objectives.length),'Objetivos avaliados'],
      [String(needs.length),'Demandas em continuidade'],
      [String(recorded.length) + '/' + String(approaches.length),'Abordagens registradas']
    ];
    const cardW=(usable-10)/3;
    cards.forEach(([value,label],i)=>{
      const x=margin+i*(cardW+5);
      pdf.setFillColor(...PALE);
      pdf.roundedRect(x,y,cardW,14,2,2,'F');
      setFace(12,true,GREEN);
      pdf.text(value,x+4,y+6);
      setFace(7.5,false,MUTED);
      pdf.text(label,x+4,y+11);
    });
    y += 18;
    const halfW=(usable-5)/2;
    const objectiveBars: ClinicalCount[] = [
      {name:'Alcançados',value:outcomes.filter(x=>x.status==='achieved').length,color:[15,118,110]},
      {name:'Em evolução',value:outcomes.filter(x=>x.status==='progressing').length,color:[8,145,178]},
      {name:'Sem avanço',value:outcomes.filter(x=>x.status==='no_progress').length,color:[217,119,6]},
      {name:'Com dificuldade',value:outcomes.filter(x=>x.status==='difficulty').length,color:[180,83,9]},
      {name:'Não avaliados',value:outcomes.filter(x=>x.status==='not_assessed').length,color:[148,163,184]}
    ];
    const methodBars: ClinicalCount[] = [
      {name:'Progresso relatado',value:recorded.filter(x=>x.result.status==='progress').length,color:[8,145,178]},
      {name:'Espontânea',value:recorded.filter(x=>x.result.status==='independent').length,color:[15,118,110]},
      {name:'Com apoio',value:recorded.filter(x=>x.result.status==='with_support').length,color:[100,116,139]},
      {name:'Variáveis',value:recorded.filter(x=>x.result.status==='variable').length,color:[161,98,7]},
      {name:'Dificuldades',value:recorded.filter(x=>x.result.status==='difficulties').length,color:[180,83,9]},
      {name:'Em observação',value:recorded.filter(x=>x.result.status==='insufficient_data').length,color:[124,141,165]},
      {name:'Não aplicadas',value:recorded.filter(x=>x.result.status==='not_applied').length,color:[148,163,184]}
    ];
    drawCountChart(margin,y,halfW,'Situação dos objetivos',objectiveBars,outcomes.length);
    drawCountChart(margin+halfW+5,y,halfW,'Respostas às abordagens',methodBars,recorded.length);
    y += 59;
    write('Distribuição dos registros do profissional; não é escala clínica nem prova de eficácia ou causalidade.',margin,usable,8.25,MUTED,false,0);
  }

  if (recorded.length) {
    header('Resultados por abordagem', 12);
    for (const {approach,result} of recorded) item(approach.title,summarizeApproachResult(result));
  }
  if (outcomes.length) {
    header('Resultados por objetivo', 12);
    for (const {objective,status} of outcomes) item(objective.title,getObjectiveOutcomeLabel(status));
  }
  if (needs.length) {
    header('Aspectos que continuam em intervenção', 12);
    for (const {objective,status} of needs) item(objective.title,getObjectiveOutcomeLabel(status));
  }

  // Narrativa integrada ao exportador nativo do relatório estruturado.
  // Conteúdo longo flui pelas páginas através de write(), preservando gráficos.
  const rawNarrative = (narrative || [])
    .filter(section => section && typeof section.content === 'string')
    .flatMap(section => section.content.split(/\n\s*\n/).map(p => clean(p)).filter(Boolean));
  // Regra de seguranca: rejeitar narrativa claramente extrapolada.
  // A classificação do objetivo nao basta para afirmar habilidade alcançada.
  const unsupportedCertainty = /progresso not[aá]vel|evolu[cç][aã]o consistente|progn[oó]stico favor[aá]vel|garantir[aã]o? (?:a )?otimiza[cç][aã]o|melhora significativa|tem demonstrado progresso|melhora na (?:sua )?capacidade|tem evolu[ií]do na capacidade/i;
  const narrativeParagraphs = rawNarrative.some(p => unsupportedCertainty.test(p))
    ? []
    : rawNarrative;
  const fallbackParts: string[] = [];
  if (!narrativeParagraphs.length) {
    if (recorded.length) {
      fallbackParts.push('Nas experiências musicoterapêuticas registradas, ' +
        recorded.map(({approach,result}) => clean(approach.title) + ': ' + clean(summarizeApproachResult(result))).join('; ') + '.');
    }
    if (outcomes.length) {
      fallbackParts.push('A avaliação dos objetivos terapêuticos documentou ' +
        outcomes.map(({objective,status}) => clean(objective.title) + ': ' + clean(getObjectiveOutcomeLabel(status))).join('; ') +
        '. Essas classificações refletem os registros profissionais e não constituem, isoladamente, medida de eficácia clínica.');
    }
    if (!fallbackParts.length) fallbackParts.push('Os registros disponíveis são insuficientes para uma análise dissertativa individualizada. O profissional deverá complementar observações clínicas e respostas sonoro-musicais.');
  }
  header('Análise Clínica Musicoterapêutica', 12);
  for (const paragraph of (narrativeParagraphs.length ? narrativeParagraphs : fallbackParts)) {
    write(paragraph, margin, usable, 9.8, DARK, false, 3);
  }

  const recommendation = clean(fields.recommendations);
  if (recommendation) {
    header('Recomendações', 12);
    write(recommendation,margin,usable,9.8,DARK,false,2.5);
  }

  // As demandas já foram apresentadas na seção anterior; não repeti-las na conclusão.
  const conclusion = getMusicoterapiaFinalConsiderations(fields, { includePending: false });
  if (conclusion.paragraphs.length) {
    header('Considerações finais', 12);
    for (const paragraph of conclusion.paragraphs) write(paragraph,margin,usable,9.8,DARK,false,2.5);
  }

  const refs = getSelectedMusicoterapiaReferences(fields.musicoterapia_reference_ids);
  if (refs.length) {
    header('Referências bibliográficas', 12);
    refs.forEach((r,i)=>write(String(i+1)+'. '+r.bibliography,margin+2,usable-2,9.15,DARK,false,3));
  }

  // Bloco de identificação: foto e carimbo verdadeiros, todos os rótulos
  // legíveis e sem truncamento de telefone ou e-mail; não isolar o aviso final.
  const detailsX = images.photo ? margin + 30 : margin + 5;
  const availableTextWidth = images.stamp ? right - 42 - detailsX : right - detailsX - 7;
  const reportDate = formatMusicoterapiaPdfDate(report.sessionDate) || new Date().toLocaleDateString('pt-BR');
  const signatureRows: Array<[string, unknown]> = [
    ['Profissional', report.professionalName || professional?.name],
    ['Especialidade', report.professionalSpecialty || professional?.specialty || 'Musicoterapia'],
    ['Registro informado', report.professionalRegistry || professional?.register],
    ['E-mail', professional?.email],
    ['Telefone', professional?.phone],
    ['Emissão', reportDate]
  ].filter(([, value]) => Boolean(clean(value)));
  setFace(8.1, false, DARK);
  const wrappedDetails: string[] = [];
  for (const [label, value] of signatureRows) {
    wrappedDetails.push(...(pdf.splitTextToSize(clean(label) + ': ' + clean(value), availableTextWidth) as string[]));
  }
  const signatureHeight = Math.max(
    (images.photo || images.stamp) ? 48 : 37,
    24 + wrappedDetails.length * 4.3
  );
  ensure(signatureHeight + 6);
  y += 3;
  pdf.setFillColor(248,252,251);
  pdf.setDrawColor(...BORDER);
  pdf.roundedRect(margin, y, usable, signatureHeight, 2, 2, 'FD');
  setFace(10,true,GREEN);
  pdf.text('Identificação do profissional responsável', margin+5, y+7);
  const photoTop=y+12;
  if (images.photo) addImage(images.photo, margin+5, photoTop, 21,22);
  if (images.stamp) addImage(images.stamp, right-37, photoTop, 29,25);
  let lineY=photoTop+3;
  for (const line of wrappedDetails) {
    setFace(8.1,false,DARK);
    pdf.text(line, detailsX, lineY);
    lineY += 4.3;
  }
  setFace(7.1,false,MUTED);
  pdf.text('Carimbo cadastrado, quando presente, não substitui a verificação da assinatura.',margin+5,y+signatureHeight-5);
  y += signatureHeight+1;

  const totalPages=pdf.internal.getNumberOfPages();
  for(let page=1;page<=totalPages;page++){
    pdf.setPage(page);
    pdf.setDrawColor(197,216,214);
    pdf.setLineWidth(0.22);
    pdf.line(margin,283,right,283);
    setFace(7.7,false,MUTED);
    pdf.text('MUSETERA  |  Relatório de Musicoterapia  |  Documento confidencial',margin,289);
    pdf.text('Página '+page+' de '+totalPages,right,289,{align:'right'});
  }
  const blob=pdf.output('blob') as Blob;
  pdf.save(filename);
  return blob;
}
