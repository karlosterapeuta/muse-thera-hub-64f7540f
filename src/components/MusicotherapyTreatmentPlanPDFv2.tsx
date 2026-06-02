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

const A4_WIDTH = 794; // ~210mm at 96dpi

const baseFont = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const serifFont = "'Lora', 'Georgia', serif";

const wrapText: React.CSSProperties = {
  minWidth: 0,
  maxWidth: '100%',
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
};

const strictNameWrap: React.CSSProperties = {
  ...wrapText,
  wordBreak: 'break-all',
};

const Page: React.FC<{ children: React.ReactNode; bg?: string; pad?: number; footer?: React.ReactNode }> = ({ children, bg = '#ffffff', pad = 56, footer }) => (
  <div style={{
    width: `${A4_WIDTH}px`,
    minHeight: '1123px',
    background: bg,
    padding: `${pad}px`,
    boxSizing: 'border-box',
    fontFamily: baseFont,
    color: INK,
    pageBreakAfter: 'always',
    position: 'relative',
  }}>
    {children}
    {footer}
  </div>
);

const PageFooter: React.FC<{ page: number; total: number; patient?: string }> = ({ page, total, patient }) => (
  <div style={{
    position: 'absolute', left: 56, right: 56, bottom: 24,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: 9.5, color: MUTED, letterSpacing: 0.5,
    borderTop: `1px solid ${LINE}`, paddingTop: 8,
  }}>
    <span style={{ ...strictNameWrap, flex: '1 1 auto', paddingRight: 16 }}>Plano Musicoterapêutico{patient ? ` · ${patient}` : ''}</span>
    <span style={{ color: GOLD_DARK, fontWeight: 600, flex: '0 0 auto' }}>Página {page} de {total}</span>
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
      width: 36, height: 36, borderRadius: '50%',
      background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})`,
      color: INK, fontFamily: serifFont, fontWeight: 700, fontSize: 16,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15)',
    }}>{n}</div>
    <div style={{ fontFamily: serifFont, fontSize: 18, fontWeight: 600, letterSpacing: 0.3 }}>{title}</div>
  </div>
);

const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div style={{ marginBottom: 10, ...wrapText }}>
    <div style={{ fontSize: 10.5, fontWeight: 600, color: GOLD_DARK, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 13, color: INK, lineHeight: 1.55, ...strictNameWrap }}>{value || <span style={{ color: MUTED, fontStyle: 'italic' }}>Não informado</span>}</div>
  </div>
);

const BulletList: React.FC<{ items?: string[]; empty?: string }> = ({ items, empty = 'Não especificado' }) => {
  if (!items || items.length === 0) return <div style={{ color: MUTED, fontStyle: 'italic', fontSize: 13 }}>{empty}</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.5 }}>
          <span style={{ color: GOLD, fontWeight: 700, marginTop: 1 }}>◆</span>
              <span style={{ color: INK, ...wrapText }}>{item}</span>
        </div>
      ))}
    </div>
  );
};

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    background: '#fff',
    border: `1px solid ${LINE}`,
    borderRadius: 10,
    padding: 18,
    marginBottom: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
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
  planData, therapistName, digitalStampUrl, professionalPhotoUrl,
  professionalEmail, professionalPhone, professionalSpecialty, professionalRegistry,
  planNumber,
}) => {
  const today = new Date().toLocaleDateString('pt-BR');

  return (
    <div style={{ background: '#fff', fontFamily: baseFont, color: INK }}>
      {/* ============ COVER ============ */}
      <Page bg={INK} pad={0}>
        <div style={{ position: 'relative', width: '100%', height: '1123px', overflow: 'hidden' }}>
          {/* Gold corner accents */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 8, background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})` }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 8, background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})` }} />

          {/* Subtle gold rings */}
          <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', border: `1px solid ${GOLD}`, opacity: 0.15 }} />
          <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, borderRadius: '50%', border: `1px solid ${GOLD}`, opacity: 0.1 }} />
          <div style={{ position: 'absolute', bottom: -180, left: -180, width: 500, height: 500, borderRadius: '50%', border: `1px solid ${GOLD}`, opacity: 0.12 }} />

          <div style={{ position: 'absolute', inset: 0, padding: 70, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
            {/* Top brand */}
            <div>
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
            <div>
              <div style={{ fontSize: 12, color: GOLD, letterSpacing: 6, textTransform: 'uppercase', marginBottom: 14 }}>Documento Clínico</div>
              <div style={{ fontFamily: serifFont, fontSize: 52, fontWeight: 600, lineHeight: 1.1, marginBottom: 18 }}>
                Plano de<br />Tratamento<br /><span style={{ color: GOLD_LIGHT, fontStyle: 'italic' }}>Musicoterapêutico</span>
              </div>
              <div style={{ width: 80, height: 3, background: `linear-gradient(90deg, ${GOLD}, transparent)`, marginBottom: 26 }} />
              <div style={{ fontSize: 14, color: '#D8D8E0', lineHeight: 1.8, maxWidth: 480 }}>
                Documento profissional estruturado para acompanhamento clínico, contendo avaliação, objetivos, recursos musicais e critérios de evolução do paciente.
              </div>
            </div>

            {/* Bottom info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24, paddingTop: 24, borderTop: `1px solid ${GOLD}`, ...wrapText }}>
              <div style={wrapText}>
                <div style={{ fontSize: 10, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Paciente</div>
                <div style={{ fontFamily: serifFont, fontSize: 19, fontWeight: 500, lineHeight: 1.2, ...strictNameWrap }}>{planData.patient_full_name || '—'}</div>
                <div style={{ fontSize: 12, color: '#B0B0BE', marginTop: 4, ...strictNameWrap }}>
                  {planData.clinical_diagnosis ? `Diagnóstico: ${planData.clinical_diagnosis}` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right', ...wrapText }}>
                <div style={{ fontSize: 10, color: GOLD, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Profissional</div>
                <div style={{ fontFamily: serifFont, fontSize: 15, fontWeight: 500, lineHeight: 1.25, ...strictNameWrap }}>{therapistName || 'Musicoterapeuta'}</div>
                <div style={{ fontSize: 11, color: '#B0B0BE', marginTop: 4, ...strictNameWrap }}>{professionalRegistry || ''}</div>
                <div style={{ fontSize: 11, color: '#B0B0BE', marginTop: 12 }}>Emitido em {today}</div>
                {planNumber && <div style={{ fontSize: 11, color: GOLD_LIGHT, marginTop: 2, ...strictNameWrap }}>Plano nº {planNumber}</div>}
              </div>
            </div>
          </div>
        </div>
      </Page>

      {/* ============ SUMMARY / INDEX ============ */}
      <Page bg={PAPER} footer={<PageFooter page={2} total={5} patient={planData.patient_full_name} />}>
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
      <Page footer={<PageFooter page={3} total={5} patient={planData.patient_full_name} />}>
        <SectionHeader n={1} title="Identificação do Paciente" />
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '0 24px' }}>
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
          <Field label="Histórico clínico e familiar" value={planData.clinical_family_history} />
          <Field label="Condições físicas, cognitivas, emocionais e sociais" value={planData.physical_cognitive_conditions} />
          <Field label="Nível de interação e comunicação" value={planData.interaction_communication_level} />
          <Field label="Interesses musicais" value={planData.musical_interests} />
          <Field label="Comportamentos observados" value={planData.observed_behaviors} />
        </Card>

        <SectionHeader n={3} title="Objetivos Gerais" />
        <Card><BulletList items={planData.general_objectives} empty="Nenhum objetivo geral definido" /></Card>

        <SectionHeader n={4} title="Objetivos Específicos" />
        <Card><BulletList items={planData.specific_objectives} empty="Nenhum objetivo específico definido" /></Card>
      </Page>

      <Page footer={<PageFooter page={4} total={5} patient={planData.patient_full_name} />}>
        <SectionHeader n={5} title="Recursos Musicoterapêuticos" />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
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
          <Field label="Improvisação musical" value={planData.musical_improvisation} />
          <Field label="Recriação musical" value={planData.musical_recreation} />
          <Field label="Composição" value={planData.musical_composition} />
          <Field label="Escuta receptiva" value={planData.receptive_listening} />
          <Field label="Dinâmicas rítmicas" value={planData.rhythmic_dynamics} />
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

      <Page footer={<PageFooter page={5} total={5} patient={planData.patient_full_name} />}>
        <SectionHeader n={8} title="Critérios de Avaliação" />
        <Card><BulletList items={planData.evaluation_criteria_list} empty="Nenhum critério definido" /></Card>

        <SectionHeader n={9} title="Plano Terapêutico em Ação" />
        <Card>
          <Field label="Estrutura das sessões" value={planData.session_structure} />
          <Field label="Sequência das atividades" value={planData.activity_sequence} />
          <Field label="Flexibilidade para ajustes" value={planData.flexibility_adjustments} />
        </Card>

        <SectionHeader n={10} title="Reavaliação e Evolução" />
        <Card>
          <Field label="Frequência da reavaliação" value={planData.reevaluation_frequency} />
          <Field label="Registro da evolução" value={planData.evolution_recording} />
          <Field label="Ajustes necessários" value={planData.necessary_adjustments} />
        </Card>

        {/* ===== Signature / Stamp ===== */}
        <div style={{
          marginTop: 40,
          border: `2px solid ${GOLD}`,
          borderRadius: 14,
          background: '#fff',
          overflow: 'hidden',
        }}>
          <div style={{ height: 6, background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})` }} />
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24, alignItems: 'center' }}>
            <div style={wrapText}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                {professionalPhotoUrl && (
                  <img src={professionalPhotoUrl} alt="" crossOrigin="anonymous" style={{
                    width: 70, height: 70, borderRadius: '50%', objectFit: 'cover',
                    border: `3px solid ${GOLD}`,
                  }} />
                )}
                <div style={wrapText}>
                  <div style={{ fontFamily: serifFont, fontSize: 15, fontWeight: 600, color: INK, lineHeight: 1.25, ...strictNameWrap }}>{therapistName || 'Musicoterapeuta'}</div>
                  <div style={{ fontSize: 11, color: GOLD_DARK, marginTop: 2, ...strictNameWrap }}>{professionalSpecialty || 'Musicoterapeuta'}</div>
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: INK_SOFT, lineHeight: 1.7, ...strictNameWrap }}>
                {professionalRegistry && <div style={strictNameWrap}><strong style={{ color: GOLD_DARK }}>Registro:</strong> {professionalRegistry}</div>}
                {professionalEmail && <div style={strictNameWrap}><strong style={{ color: GOLD_DARK }}>E-mail:</strong> {professionalEmail}</div>}
                {professionalPhone && <div style={strictNameWrap}><strong style={{ color: GOLD_DARK }}>Telefone:</strong> {professionalPhone}</div>}
              </div>
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px dashed ${LINE}`, fontSize: 10.5, color: MUTED, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: GOLD, display: 'inline-block' }} />
                ASSINATURA DIGITAL VERIFICADA · MUSETERA
              </div>

            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {digitalStampUrl ? (
                <img src={digitalStampUrl} alt="" crossOrigin="anonymous" style={{ width: 200, height: 200, objectFit: 'contain' }} />
              ) : (
                <div style={{
                  width: 200, height: 200, borderRadius: '50%',
                  border: `3px dashed ${GOLD}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: GOLD_DARK, fontFamily: serifFont, fontSize: 13, textAlign: 'center', padding: 12,
                }}>Carimbo Digital<br />MuseTera</div>
              )}
            </div>
          </div>
          <div style={{ background: PAPER, padding: '10px 24px', fontSize: 10, color: MUTED, textAlign: 'center', letterSpacing: 1 }}>
            Documento gerado por MUSETERA · {today}
          </div>
        </div>
      </Page>
    </div>
  );
};

export default MusicotherapyTreatmentPlanPDFv2;
