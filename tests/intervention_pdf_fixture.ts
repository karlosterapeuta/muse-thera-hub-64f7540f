/** Documento estritamente fictício para regressão do PDF de intervenção. */
import { writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import { buildInterventionPdf } from '../src/pages/intervention/utils/interventionPdf';
import type { TherapyActivity } from '../src/types/therapy-activity';

const materials = ['Teclado colorido', 'Pandeiro', 'Cartões visuais de comunicação'];
const activities: TherapyActivity[] = Array.from({ length: 10 }, (_, index) => ({
  id: `synthetic-${index + 1}`,
  disorder: index % 2 ? 'TDAH' : 'TEA',
  demand: 'Atenção compartilhada e comunicação funcional',
  specialty: 'Musicoterapia',
  generalObjective: 'Estimular iniciativa comunicativa, regulação emocional e turnos musicais durante a sessão.',
  specificObjective: 'Participar de três trocas sonoras com ajuda graduada, respeitando pausas sensoriais.',
  activityDescription: 'Em ambiente previsível e seguro, o terapeuta apresenta o teclado e convida a pessoa a produzir um som. Após uma pausa, o terapeuta responde musicalmente, oferece uma escolha de instrumentos e aguarda nova iniciativa. Ajustar intensidade, duração e número de tentativas conforme a observação clínica. Este roteiro é fictício para testar a quebra automática de linhas.',
  materials,
  estimatedTime: '15 a 20 minutos',
  complexityLevel: 'Moderado',
  evaluationCriteria: ['Quantidade de turnos iniciados', 'Tolerância às pausas musicais', 'Necessidade de apoio durante a atividade'],
}));

const placeholder = new PNG({ width: 50, height: 18 });
for (let i = 0; i < placeholder.data.length; i += 4) {
  placeholder.data[i] = 35;
  placeholder.data[i + 1] = 91;
  placeholder.data[i + 2] = 65;
  placeholder.data[i + 3] = 255;
}
const tinyPng = `data:image/png;base64,${PNG.sync.write(placeholder).toString('base64')}`;
const doc = buildInterventionPdf({
  patientName: 'Paciente Fictício de Teste',
  planDate: new Date(2026, 10, 8),
  activities,
  professional: {
    name: 'Musicoterapeuta Teste',
    specialty: 'Musicoterapia',
    registration: 'CBO 2263-05 (dados fictícios)',
    email: 'teste@exemplo.invalid',
    signatureDataUrl: tinyPng,
    stampDataUrl: tinyPng,
    photoDataUrl: tinyPng,
  },
});

writeFileSync(process.argv[2] || 'artifacts/intervention/intervencao-ficticia.pdf', Buffer.from(doc.output('arraybuffer')));
