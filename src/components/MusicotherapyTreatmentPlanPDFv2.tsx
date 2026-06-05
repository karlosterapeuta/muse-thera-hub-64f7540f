import React from 'react';
import { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';
import { formatBirthDateForDisplay } from '@/utils/dateUtils';

interface Props {
  planData: MusicotherapyTreatmentPlan;
  therapistName?: string;
  digitalSignatureUrl?: string;
  digitalStampUrl?: string;
  professionalPhotoUrl?: string;
  professionalEmail?: string;
  professionalPhone?: string;
  professionalSpecialty?: string;
  professionalRegistry?: string;
  planNumber?: string | number;
}

// MuseTera palette
const GOLD = '#C9A24A';
const GOLD_DARK = '#9A7A30';
const GOLD_LIGHT = '#E8D49A';
const INK = '#1A1A2E';
const INK_SOFT = '#3A3A52';
const PAPER = '#FBF8F1';
const MUTED = '#6B6B7A';
const LINE = '#E6DFC9';

const A4_WIDTH = 793; // 210mm at ~96dpi (safer margin)
const A4_HEIGHT = 1120; // 297mm at ~96dpi (safer margin)

const baseFont = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const serifFont = "'Lora', 'Georgia', serif";

const wrapText: React.CSSProperties = {
  display: 'block',
  minWidth: 0,
  maxWidth: '100%',
  boxSizing: 'border-box',
  whiteSpace: 'pre-wrap', 
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  lineHeight: 1.6,
};

const strictNameWrap: React.CSSProperties = {
  ...wrapText,
  whiteSpace: 'normal',
};

// Insere pontos de quebra invisíveis APENAS dentro de palavras muito longas
// (nomes, e-mails, registros) sem afetar espaços de frases normais.
// Evita o bug do html2canvas que "engole" espaços ao quebrar a linha.
const makeTextBreakable = (value?: React.ReactNode): React.ReactNode => {
  if (typeof value === 'string') {
    // Quebra palavras com mais de 16 caracteres a cada 10 caracteres
    return value.replace(/\S{16,}/g, (m) => m.replace(/(.{10})/g, '$1\u200B'));
  }
  if (typeof value === 'number') return value;
  return value;
};

const safeGrid: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
};

const flexText: React.CSSProperties = {
  ...strictNameWrap,
  flex: 1,
  minWidth: 0,
};

const Page: React.FC<{ children: React.ReactNode; bg?: string; pad?: number; footer?: React.ReactNode; className?: string }> = ({ children, bg = '#ffffff', pad = 48, footer, className }) => (
  <div className={`musetera-pdf-page${className ? ` ${className}` : ''}`} style={{
    width: `${A4_WIDTH}px`,
    maxWidth: `${A4_WIDTH}px`,
    minHeight: `${A4_HEIGHT}px`,
    maxHeight: 'none',
    backgroundColor: bg,
    padding: `${pad}px ${pad}px ${pad + 20}px`,
    boxSizing: 'border-box',
    fontFamily: baseFont,
    color: INK,
    pageBreakAfter: 'auto',
    breakAfter: 'auto',
    pageBreakInside: 'avoid',
    breakInside: 'avoid',
    marginBottom: 0, 
    marginTop: 0,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'visible',
    zIndex: 1,
  }}>
    {children}
    {footer}
  </div>
);

const PageFooter: React.FC<{ page: number; total: number; patient?: string }> = ({ page, total, patient }) => (
  <div style={{
    position: 'absolute', left: 56, right: 56, bottom: 24,
    display: 'flex', justifyContent: 'space-between', gap: 12,
    alignItems: 'flex-start', fontSize: 9.5, color: MUTED, letterSpacing: 0.5,
    borderTop: `1px solid ${LINE}`, paddingTop: 8, boxSizing: 'border-box',
  }}>
    <span style={{ ...strictNameWrap, flex: 1 }}>Plano Musicoterapêutico{makeTextBreakable(patient ? ` · ${patient}` : '')}</span>
    <span style={{ color: GOLD_DARK, fontWeight: 600, whiteSpace: 'nowrap', flex: '0 0 auto' }}>Página {page} de {total}</span>
  </div>
);

const SectionHeader: React.FC<{ n: number; title: string }> = ({ n, title }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: `linear-gradient(135deg, ${INK} 0%, ${INK_SOFT} 100%)`,
    color: '#fff',
    padding: '14px 18px',
    borderRadius: 10,
    borderLeft: `5px solid ${GOLD}`,
    marginBottom: 16,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: '50%', flex: '0 0 auto',
      background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})`,
      color: INK, fontFamily: serifFont, fontWeight: 700, fontSize: 16,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15)',
    }}>{n}</div>
    <div style={{ fontFamily: serifFont, fontSize: 18, fontWeight: 600, letterSpacing: 0.3, ...flexText }}>{makeTextBreakable(title)}</div>
  </div>
);

const Field: React.FC<{ label: string; value?: React.ReactNode; fullWidth?: boolean }> = ({ label, value, fullWidth }) => (
  <div style={{ marginBottom: 14, ...wrapText, width: fullWidth ? '100%' : 'calc(50% - 12px)', flex: fullWidth ? '0 0 100%' : '0 0 calc(50% - 12px)' }}>
    <div style={{ fontSize: 10, fontWeight: 700, color: GOLD_DARK, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4, ...wrapText }}>{label}</div>
    <div style={{ fontSize: 13, color: INK, lineHeight: 1.5, ...strictNameWrap, paddingBottom: 2 }}>{makeTextBreakable(value) || <span style={{ color: MUTED, fontStyle: 'italic' }}>Não informado</span>}</div>
  </div>
);

const BulletList: React.FC<{ items?: string[]; empty?: string }> = ({ items, empty = 'Não especificado' }) => {
  if (!items || items.length === 0) return <div style={{ color: MUTED, fontStyle: 'italic', fontSize: 13 }}>{empty}</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.5 }}>
          <span style={{ color: GOLD, fontWeight: 700, marginTop: 1 }}>◆</span>
              <span style={{ color: INK, ...wrapText }}>{makeTextBreakable(item)}</span>
        </div>
      ))}
    </div>
  );
};

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="musetera-card" style={{
    ...wrapText,
    background: '#fff',
    border: `1px solid ${LINE}`,
    borderRadius: 10,
    padding: 18,
    marginBottom: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  }}>{children}</div>
);

const SECTIONS = [
  '1. Identificação do Paciente',
  '2. Avaliação Inicial',
  '3. Objetivos Gerais',
  '4. Objetivos Específicos',
  '5. Recursos Musicoterapêuticos',
  '6. Estratégias e Técnicas',
  '7. Frequência e Duração',
  '8. Critérios de Avaliação',
  '9. Plano Terapêutico em Ação',
  '10. Reavaliação e Evolução',
];

export const MusicotherapyTreatmentPlanPDFv2: React.FC<Props> = ({
  planData, therapistName, digitalSignatureUrl, digitalStampUrl, professionalPhotoUrl,
  professionalEmail, professionalPhone, professionalSpecialty, professionalRegistry,
  planNumber,
}) => {
  const today = new Date().toLocaleDateString('pt-BR');

  // Fallback para evitar PDF em branco se os dados estiverem corrompidos
  if (!planData) {
    return (
      <div style={{ padding: 40, fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1>Erro: Dados do plano não encontrados</h1>
        <p>Por favor, tente novamente ou entre em contato com o suporte.</p>
      </div>
    );
  }

  return (
    <div 
      data-musetera-pdf="true" 
      id="musetera-pdf-content"
      style={{ 
        width: `${A4_WIDTH}px`, 
        maxWidth: `${A4_WIDTH}px`, 
        overflow: 'hidden', 
        background: '#ffffff', 
        fontFamily: baseFont, 
        color: INK, 
        boxSizing: 'border-box' 
      }}
    >
      <style>{`
        #musetera-pdf-content, #musetera-pdf-content * {
          box-sizing: border-box !important;
          max-width: 100% !important;
          overflow-wrap: break-word !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
        }
        #musetera-pdf-content img { max-width: 100% !important; display: block; }
        .musetera-pdf-page {
          page-break-after: avoid !important;
          break-after: avoid !important;
          background: #ffffff !important;
          -webkit-print-color-adjust: exact;
        }
      `}</style>
      {/* ============ COVER ============ */}
      <Page bg={INK} pad={0} className="musetera-cover-page">
        <div style={{ position: 'relative', width: '100%', maxWidth: `${A4_WIDTH}px`, minHeight: `${A4_HEIGHT}px`, height: '100%', overflow: 'hidden', boxSizing: 'border-box', backgroundColor: INK }}>
          {/* Gold corner accents */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 8, background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})` }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 8, background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})` }} />

          {/* Subtle gold rings */}
          <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', border: `1px solid ${GOLD}`, opacity: 0.15 }} />
          <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, borderRadius: '50%', border: `1px solid ${GOLD}`, opacity: 0.1 }} />
          <div style={{ position: 'absolute', bottom: -180, left: -180, width: 500, height: 500, borderRadius: '50%', border: `1px solid ${GOLD}`, opacity: 0.12 }} />

          <div style={{ position: 'absolute', inset: 0, padding: '54px 70px 86px', display: 'flex', flexDirection: 'column', gap: 22, color: '#fff', boxSizing: 'border-box', overflow: 'hidden' }}>
            {/* Top brand */}
            <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 6, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: serifFont, fontWeight: 700, fontSize: 28, color: INK,
                  boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.25)',
                }}>M</div>
                <div>
                  <div style={{ fontFamily: serifFont, fontSize: 22, fontWeight: 600, letterSpacing: 2 }}>MUSETERA</div>
                  <div style={{ fontSize: 10.5, color: GOLD_LIGHT, letterSpacing: 3, textTransform: 'uppercase' }}>Sistema Clínico de Musicoterapia</div>
                </div>
              </div>
            </div>

            {/* Center title */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
              <div style={{ fontSize: 12, color: GOLD, letterSpacing: 6, textTransform: 'uppercase', marginBottom: 14 }}>Documento Clínico</div>
              <div style={{ fontFamily: serifFont, fontSize: 40, fontWeight: 600, lineHeight: 1.15, marginBottom: 14, ...wrapText }}>
                Plano de<br />Tratamento<br /><span style={{ color: GOLD_LIGHT, fontStyle: 'italic' }}>{makeTextBreakable('Musicoterapêutico')}</span>
              </div>
              <div style={{ width: 80, height: 3, background: `linear-gradient(90deg, ${GOLD}, transparent)`, marginBottom: 26 }} />
              <div style={{ fontSize: 14, color: '#D8D8E0', lineHeight: 1.6, maxWidth: 480, ...wrapText }}>
                Documento profissional estruturado para acompanhamento clínico, contendo avaliação, objetivos, recursos musicais e critérios de evolução do paciente.
              </div>
            </div>

            {/* Bottom info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: '100%', minHeight: 0, paddingTop: 20, borderTop: `1px solid ${GOLD}`, boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, width: '100%' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Paciente</div>
                  <div style={{ fontFamily: serifFont, fontSize: 15, fontWeight: 500, lineHeight: 1.3, ...strictNameWrap }}>{makeTextBreakable(planData.patient_full_name) || '—'}</div>
                  <div style={{ fontSize: 11, color: '#B0B0BE', marginTop: 4, lineHeight: 1.4, ...strictNameWrap }}>
                    {makeTextBreakable(planData.clinical_diagnosis ? `Diagnóstico: ${planData.clinical_diagnosis}` : '')}
                  </div>
                </div>
                <div style={{ flex: '0 0 auto', textAlign: 'right', minWidth: 0, maxWidth: '40%' }}>
                  <div style={{ fontSize: 10, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Profissional</div>
                  <div style={{ fontFamily: serifFont, fontSize: 13.5, fontWeight: 500, lineHeight: 1.3, ...strictNameWrap }}>{makeTextBreakable(therapistName) || 'Musicoterapeuta'}</div>
                  <div style={{ fontSize: 11, color: '#B0B0BE', marginTop: 4, lineHeight: 1.4, ...strictNameWrap }}>{makeTextBreakable(professionalRegistry) || ''}</div>
                  <div style={{ fontSize: 11, color: '#B0B0BE', marginTop: 8 }}>Emitido em {today}</div>
                  {planNumber && <div style={{ fontSize: 10.5, color: GOLD_LIGHT, marginTop: 2, ...strictNameWrap }}>Plano nº {makeTextBreakable(planNumber)}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page>

      {/* ============ SUMMARY / INDEX ============ */}
      <Page className="musetera-page-2" bg={PAPER} footer={<PageFooter page={2} total={5} patient={planData.patient_full_name} />}>
        <div style={{ marginBottom: 30 }}>
          <div style={{ fontSize: 11, color: GOLD_DARK, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Sumário</div>
          <div style={{ fontFamily: serifFont, fontSize: 32, fontWeight: 600, color: INK }}>Conteúdo do Documento</div>
          <div style={{ width: 60, height: 3, background: GOLD, marginTop: 12 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SECTIONS.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: '#fff', border: `1px solid ${LINE}`, borderRadius: 8,
              padding: '12px 16px',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                color: INK, fontFamily: serifFont, fontWeight: 700, fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{i + 1}</div>
              <div style={{ fontSize: 14, color: INK, fontFamily: serifFont, fontWeight: 500, flex: 1 }}>
                {s.replace(/^\d+\.\s*/, '')}
              </div>
              <div style={{ flex: 1, borderBottom: `1px dotted ${LINE}`, margin: '0 8px' }} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: 18, background: '#fff', borderLeft: `4px solid ${GOLD}`, borderRadius: 6 }}>
          <div style={{ fontSize: 11, color: GOLD_DARK, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Nota Clínica</div>
          <div style={{ fontSize: 12.5, color: INK_SOFT, lineHeight: 1.6 }}>
            Este plano de tratamento foi elaborado de forma individualizada com base na avaliação musicoterapêutica do paciente. As metas e recursos descritos podem ser ajustados ao longo do processo terapêutico conforme a evolução observada.
          </div>
        </div>
      </Page>

      {/* ============ CONTENT ============ */}
      <Page className="musetera-page-3" footer={<PageFooter page={3} total={5} patient={planData.patient_full_name} />}>
        <SectionHeader n={1} title="Identificação do Paciente" />
        <Card>
          <div style={{ ...safeGrid, gap: '0 24px' }}>
            <Field label="Nome completo" value={planData.patient_full_name} />
            <Field label="Data de nascimento" value={formatBirthDateForDisplay(planData.patient_birth_date)} />
            <Field label="Idade" value={planData.patient_age} />
            <Field label="Diagnóstico clínico" value={planData.clinical_diagnosis} />
            <Field label="Responsável" value={planData.responsible_person} />
            <Field label="Início do plano" value={formatBirthDateForDisplay(planData.plan_start_date)} />
          </div>
        </Card>

        <SectionHeader n={2} title="Avaliação Inicial" />
        <Card>
          <Field label="Histórico clínico e familiar" value={planData.clinical_family_history} fullWidth />
          <Field label="Condições físicas, cognitivas, emocionais e sociais" value={planData.physical_cognitive_conditions} fullWidth />
          <Field label="Nível de interação e comunicação" value={planData.interaction_communication_level} fullWidth />
          <Field label="Interesses musicais" value={planData.musical_interests} fullWidth />
          <Field label="Comportamentos observados" value={planData.observed_behaviors} fullWidth />
        </Card>

        <SectionHeader n={3} title="Objetivos Gerais" />
        <Card><BulletList items={planData.general_objectives} empty="Nenhum objetivo geral definido" /></Card>

        <SectionHeader n={4} title="Objetivos Específicos" />
        <Card><BulletList items={planData.specific_objectives} empty="Nenhum objetivo específico definido" /></Card>
      </Page>

      <Page className="musetera-page-4" footer={<PageFooter page={4} total={5} patient={planData.patient_full_name} />}>
        <SectionHeader n={5} title="Recursos Musicoterapêuticos" />
        <div style={{ ...safeGrid, gap: 16 }}>
          <Card>
            <div style={{ fontFamily: serifFont, fontSize: 14, fontWeight: 600, color: GOLD_DARK, marginBottom: 10 }}>Instrumentos musicais</div>
            <BulletList items={planData.musical_instruments} />
          </Card>
          <Card>
            <div style={{ fontFamily: serifFont, fontSize: 14, fontWeight: 600, color: GOLD_DARK, marginBottom: 10 }}>Recursos tecnológicos</div>
            <BulletList items={planData.technological_resources} />
          </Card>
          <Card>
            <div style={{ fontFamily: serifFont, fontSize: 14, fontWeight: 600, color: GOLD_DARK, marginBottom: 10 }}>Voz e corpo</div>
            <BulletList items={planData.voice_body_resources} />
          </Card>
          <Card>
            <div style={{ fontFamily: serifFont, fontSize: 14, fontWeight: 600, color: GOLD_DARK, marginBottom: 10 }}>Materiais complementares</div>
            <BulletList items={planData.complementary_materials} />
          </Card>
        </div>

        <SectionHeader n={6} title="Estratégias e Técnicas" />
        <Card>
          <Field label="Improvisação musical" value={planData.musical_improvisation} fullWidth />
          <Field label="Recriação musical" value={planData.musical_recreation} fullWidth />
          <Field label="Composição" value={planData.musical_composition} fullWidth />
          <Field label="Escuta receptiva" value={planData.receptive_listening} fullWidth />
          <Field label="Dinâmicas rítmicas" value={planData.rhythmic_dynamics} fullWidth />
        </Card>

        <SectionHeader n={7} title="Frequência e Duração" />
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { l: 'Sessões semanais', v: `${planData.weekly_sessions || 0}x` },
              { l: 'Duração da sessão', v: `${planData.session_duration_minutes || 0} min` },
              { l: 'Período estimado', v: `${planData.estimated_period_months || 0} meses` },
            ].map((it, i) => (
              <div key={i} style={{
                background: `linear-gradient(135deg, ${PAPER}, #fff)`,
                border: `1px solid ${LINE}`, borderRadius: 10, padding: 16, textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, color: GOLD_DARK, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{it.l}</div>
                <div style={{ fontFamily: serifFont, fontSize: 24, fontWeight: 600, color: INK }}>{it.v}</div>
              </div>
            ))}
          </div>
        </Card>
      </Page>

      <Page className="musetera-page-5" footer={<PageFooter page={5} total={5} patient={planData.patient_full_name} />}>
        <SectionHeader n={8} title="Critérios de Avaliação" />
        <Card><BulletList items={planData.evaluation_criteria_list} empty="Nenhum critério definido" /></Card>

        <SectionHeader n={9} title="Plano Terapêutico em Ação" />
        <Card>
          <Field label="Estrutura das sessões" value={planData.session_structure} fullWidth />
          <Field label="Sequência das atividades" value={planData.activity_sequence} fullWidth />
          <Field label="Flexibilidade para ajustes" value={planData.flexibility_adjustments} fullWidth />
        </Card>

        <SectionHeader n={10} title="Reavaliação e Evolução" />
        <Card>
          <Field label="Frequência da reavaliação" value={planData.reevaluation_frequency} fullWidth />
          <Field label="Registro da evolução" value={planData.evolution_recording} fullWidth />
          <Field label="Ajustes necessários" value={planData.necessary_adjustments} fullWidth />
        </Card>

        {/* ===== Signature / Stamp ===== */}
        <div style={{
          marginTop: 16,
          marginBottom: 24,
          border: `2px solid ${GOLD}`,
          borderRadius: 14,
          background: '#fff',
          overflow: 'hidden',
          pageBreakInside: 'avoid',
        }}>
          <div style={{ height: 6, background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})` }} />
          <div style={{ padding: 18, display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                {professionalPhotoUrl && (
                  <img src={professionalPhotoUrl} alt="" crossOrigin="anonymous" style={{
                    width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flex: '0 0 auto',
                    border: `2px solid ${GOLD}`,
                  }} />
                )}
                <div style={{ ...wrapText, flex: 1 }}>
                  <div style={{ fontFamily: serifFont, fontSize: 16, fontWeight: 600, color: INK, lineHeight: 1.4, ...strictNameWrap }}>{makeTextBreakable(therapistName) || 'Musicoterapeuta'}</div>
                  <div style={{ fontSize: 12, color: GOLD_DARK, marginTop: 2, ...strictNameWrap }}>{makeTextBreakable(professionalSpecialty) || 'Musicoterapeuta'}</div>
                </div>
              </div>

              {digitalSignatureUrl && (
                <div style={{ marginBottom: 16 }}>
                  <img src={digitalSignatureUrl} alt="Assinatura" crossOrigin="anonymous" style={{ maxHeight: 60, maxWidth: 200, objectFit: 'contain', filter: 'contrast(1.2)' }} />
                  <div style={{ width: 180, height: 1, background: LINE, marginTop: 4 }} />
                </div>
              )}

              <div style={{ fontSize: 12, color: INK_SOFT, lineHeight: 1.7, ...strictNameWrap }}>
                {professionalRegistry && <div style={{ ...strictNameWrap, marginBottom: 4 }}><strong style={{ color: GOLD_DARK }}>Registro:</strong> {makeTextBreakable(professionalRegistry)}</div>}
                {professionalEmail && <div style={{ ...strictNameWrap, marginBottom: 4 }}><strong style={{ color: GOLD_DARK }}>E-mail:</strong> {makeTextBreakable(professionalEmail)}</div>}
                {professionalPhone && <div style={strictNameWrap}><strong style={{ color: GOLD_DARK }}>Telefone:</strong> {makeTextBreakable(professionalPhone)}</div>}
              </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px dashed ${LINE}`, fontSize: 10, color: MUTED, letterSpacing: 0.8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD, display: 'inline-block', flex: '0 0 auto' }} />
                <span style={wrapText}>DOCUMENTO AUTENTICADO DIGITALMENTE · MUSETERA</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
              {digitalStampUrl ? (
                <img src={digitalStampUrl} alt="Carimbo" crossOrigin="anonymous" style={{ width: 130, height: 130, objectFit: 'contain' }} />
              ) : (
                <div style={{
                  width: 120, height: 120, borderRadius: '50%',
                  border: `3px dashed ${GOLD}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: GOLD_DARK, fontFamily: serifFont, fontSize: 12, textAlign: 'center', padding: 10,
                }}>Carimbo Profissional<br />Padrão MuseTera</div>
              )}
            </div>
          </div>
          <div style={{ background: PAPER, padding: '8px 18px', fontSize: 9.5, color: MUTED, textAlign: 'center', letterSpacing: 0.8 }}>
            Documento gerado por MUSETERA · {today}
          </div>
        </div>
      </Page>
    </div>
  );
};

export default MusicotherapyTreatmentPlanPDFv2;
