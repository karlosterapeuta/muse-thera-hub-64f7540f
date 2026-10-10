import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StaticChart } from '@/components/StaticChart';
import type { ProfessionalData } from '@/hooks/useProfessionalData';
import { getEvaluationTypeMeta } from '@/utils/evaluationTypes';

interface EvaluationDomain {
  title: string;
  description?: string;
  subdomains: {
    title: string;
    description?: string;
    parameters: string[];
  }[];
}

interface GraphReportPDFProps {
  patientName?: string;
  patientAge?: number | null;
  professionalData?: ProfessionalData | null;
  evaluationDate: Date;
  selections: Record<string, string>;
  evaluationDomains: EvaluationDomain[];
  categoryData: { name: string; value: number; domain?: string }[];
  pieData: { name: string; value: number }[];
  radarData: { name: string; value: number }[];
  overallScore: {
    raw: number;
    max: number;
    percentage: number;
    completionPercentage: number;
    evaluatedDomains: number;
    totalDomains: number;
    evaluatedParameters: number;
    totalParameters: number;
  };
  professionalPhotoBase64?: string;
  digitalStampBase64?: string;
  /** período/tipo da avaliação (chave, valor do seletor ou label) */
  evaluationType?: string;
  /** Oculta a identificação inicial quando incorporado ao relatório unificado. */
  suppressDocumentHeader?: boolean;
  /** Evita duplicar assinatura/carimbo quando o relatório textual já inclui o rodapé profissional. */
  suppressProfessionalFooter?: boolean;
}

const DOMAIN_COLORS: Record<string, string> = {
  'Domínio Musical': '#6366f1',
  'Domínio Psicossocial': '#10b981',
  'Domínio Cognitivo': '#f59e0b',
  'Domínio Sensório-Motor': '#ef4444',
  'Domínio Comunicativo-Interativo': '#06b6d4',
};
const getDomainColor = (d?: string) => (d && DOMAIN_COLORS[d]) || '#64748b';

const FREQ_LABEL: Record<string, { label: string; score: number; color: string }> = {
  nao_observado: { label: 'Não Observado', score: 0, color: '#94a3b8' },
  emergente: { label: 'Emergente', score: 20, color: '#f97316' },
  inconsistente: { label: 'Inconsistente', score: 40, color: '#f59e0b' },
  moderado: { label: 'Moderado', score: 60, color: '#0891b2' },
  consistente: { label: 'Consistente', score: 80, color: '#059669' },
  excepcional: { label: 'Excepcional', score: 100, color: '#0f766e' },
};

const getPerfLabel = (pct: number) => {
  if (pct >= 80) return { label: 'Excelente', color: '#059669' };
  if (pct >= 60) return { label: 'Satisfatório', color: '#0891b2' };
  if (pct >= 40) return { label: 'Em Desenvolvimento', color: '#d97706' };
  if (pct > 0) return { label: 'Necessita Atenção', color: '#dc2626' };
  return { label: 'Não Avaliado', color: '#6b7280' };
};

const baseFont = 'Inter, system-ui, -apple-system, sans-serif';
const sectionWrap: React.CSSProperties = {
  width: '190mm',
  background: '#ffffff',
  color: '#0f172a',
  fontFamily: baseFont,
  fontSize: 10,
  lineHeight: 1.45,
  boxSizing: 'border-box',
  padding: '4mm 0',
};

const titleBar: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  color: '#0f172a',
  borderBottom: '2px solid #0f172a',
  paddingBottom: 4,
  marginBottom: 10,
};

export const GraphReportPDF: React.FC<GraphReportPDFProps> = ({
  patientName,
  patientAge,
  professionalData,
  evaluationDate,
  selections,
  evaluationDomains,
  categoryData,
  pieData,
  radarData,
  overallScore,
  professionalPhotoBase64,
  digitalStampBase64,
  evaluationType,
  suppressDocumentHeader = false,
  suppressProfessionalFooter = false,
}) => {
  const typeMeta = getEvaluationTypeMeta(evaluationType);
  const formattedDate = format(evaluationDate, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
  const issuedAt = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  const overallPerf = getPerfLabel(overallScore.percentage);

  // Para tabela de subdomínios por domínio (usa selections para calcular real)
  const calcSubdomainPct = (
    domainTitle: string,
    subdomainTitle: string,
    parameters: string[]
  ) => {
    let total = 0;
    parameters.forEach((p) => {
      const key = `${domainTitle}-${subdomainTitle}-${p}`;
      const v = selections[key];
      total += v && FREQ_LABEL[v] ? FREQ_LABEL[v].score : 0;
    });
    return Math.round((total / (parameters.length * 100)) * 100);
  };

  const calcDomainPct = (domain: EvaluationDomain) => {
    let total = 0;
    let max = 0;
    domain.subdomains.forEach((s) => {
      s.parameters.forEach((p) => {
        const key = `${domain.title}-${s.title}-${p}`;
        const v = selections[key];
        total += v && FREQ_LABEL[v] ? FREQ_LABEL[v].score : 0;
        max += 100;
      });
    });
    return max > 0 ? Math.round((total / max) * 100) : 0;
  };

  return (
    <div
      style={{
        width: '190mm',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: baseFont,
      }}
    >
      {/* ============= SEÇÃO 1: CAPA + IDENTIFICAÇÃO + SÍNTESE ============= */}
      <section data-pdf-section style={sectionWrap}>
        {!suppressDocumentHeader && (
          <>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid #0f172a',
            paddingBottom: 10,
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/lovable-uploads/musetera-logo-new.png"
              alt="MuseTera"
              style={{ width: 46, height: 'auto' }}
              crossOrigin="anonymous"
            />
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.3px',
                }}
              >
                MuseTera
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: '#64748b',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                }}
              >
                Relatório de Parâmetros e Gráficos
              </div>
            </div>
          </div>
          <div
            style={{
              textAlign: 'right',
              fontSize: 9,
              color: '#475569',
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 700, color: '#0f172a' }}>
              Avaliação Musicoterapêutica
            </div>
            <div
              style={{
                display: 'inline-block',
                marginTop: 4,
                padding: '3px 10px',
                borderRadius: 999,
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                color: typeMeta.color,
                background: typeMeta.bgColor,
                border: `1.5px solid ${typeMeta.color}`,
              }}
            >
              {typeMeta.label}
            </div>
            <div style={{ marginTop: 4 }}>Emitido em {issuedAt}</div>
          </div>
        </div>


        {/* Identificação */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            padding: '12px 14px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginBottom: 14,
          }}
        >
          {[
            { label: 'Paciente', value: patientName || 'Não informado' },
            {
              label: 'Idade',
              value:
                patientAge != null ? `${patientAge} ${patientAge === 1 ? 'ano' : 'anos'}` : '—',
            },
            { label: 'Data da Avaliação', value: formattedDate },
            { label: 'Tipo de Avaliação', value: typeMeta.label },
            {
              label: 'Musicoterapeuta',
              value: professionalData?.name || 'Não informado',
            },
          ].map((it, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: 8,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: 3,
                }}
              >
                {it.label}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                {it.value}
              </div>
            </div>
          ))}
        </div>

          </>
        )}

        {/* Síntese executiva */}
        <div style={titleBar}>Síntese Executiva</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
            marginBottom: 12,
          }}
        >
          {[
            {
              label: 'Pontuação Total',
              value: `${overallScore.raw}/${overallScore.max}`,
              accent: '#0f172a',
            },
            {
              label: 'Desempenho Geral',
              value: `${overallScore.percentage}%`,
              accent: overallPerf.color,
            },
            {
              label: 'Domínios Avaliados',
              value: `${overallScore.evaluatedDomains}/${overallScore.totalDomains}`,
              accent: '#10b981',
            },
            {
              label: 'Parâmetros Avaliados',
              value: `${overallScore.evaluatedParameters}/${overallScore.totalParameters}`,
              accent: '#f59e0b',
            },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                border: '1px solid #e2e8f0',
                borderTop: `3px solid ${m.accent}`,
                borderRadius: 4,
                padding: '10px 12px',
                background: '#fff',
              }}
            >
              <div
                style={{
                  fontSize: 8,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: 4,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: m.accent,
                  lineHeight: 1.1,
                }}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Barra de desempenho geral */}
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            padding: '10px 14px',
            background: '#fff',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
              fontSize: 10,
            }}
          >
            <span style={{ fontWeight: 700, color: '#0f172a' }}>
              Desempenho Global
            </span>
            <span style={{ fontWeight: 700, color: overallPerf.color }}>
              {overallScore.percentage}% · {overallPerf.label}
            </span>
          </div>
          <div
            style={{
              background: '#e2e8f0',
              borderRadius: 4,
              height: 10,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${overallScore.percentage}%`,
                height: '100%',
                background: overallPerf.color,
              }}
            />
          </div>
        </div>
      </section>

      {/* ============= SEÇÃO 2: GRÁFICOS (Radar + Pizza) ============= */}
      <section data-pdf-section style={sectionWrap}>
        <div style={titleBar}>Visão Gráfica Consolidada</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              padding: 10,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: 6,
                color: '#0f172a',
              }}
            >
              Perfil por Domínio
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {radarData && radarData.length > 0 ? (
                <StaticChart
                  data={radarData}
                  type="radar"
                  width={320}
                  height={260}
                  colors={['#6366f1']}
                />
              ) : (
                <div style={{ color: '#94a3b8', fontSize: 10, padding: 20 }}>
                  Sem dados suficientes para o radar
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: 8,
                color: '#64748b',
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              Distribuição percentual por domínio clínico
            </div>
          </div>

          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              padding: 10,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: 6,
                color: '#0f172a',
              }}
            >
              Desenvolvimento Geral
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StaticChart
                data={pieData}
                type="pie"
                width={320}
                height={260}
                colors={['#10b981', '#f1f5f9']}
              />
            </div>
            <div
              style={{
                fontSize: 8,
                color: '#64748b',
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              Proporção de avanço sobre o potencial total
            </div>
          </div>
        </div>
      </section>

      {/* ============= SEÇÃO 3: BARRA POR SUBDOMÍNIO ============= */}
      {categoryData && categoryData.length > 0 && (
        <section data-pdf-section style={sectionWrap}>
          <div style={titleBar}>Desempenho por Subdomínio</div>
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              padding: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StaticChart
                data={categoryData}
                type="bar"
                width={660}
                height={340}
                colors={categoryData.map((d) => getDomainColor('Domínio ' + (d.domain || '')))}
              />
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: 10,
              }}
            >
              {Array.from(new Set(categoryData.map((d) => d.domain).filter(Boolean))).map(
                (dom) => (
                  <div
                    key={dom}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 9,
                      color: '#334155',
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        background: getDomainColor('Domínio ' + dom),
                        borderRadius: 2,
                      }}
                    />
                    {dom}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Legenda de classificação */}
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 8,
                fontSize: 9,
              }}
            >
              {[
                { range: '80 – 100%', label: 'Excelente', color: '#059669' },
                { range: '60 – 79%', label: 'Satisfatório', color: '#0891b2' },
                { range: '40 – 59%', label: 'Em Desenvolvimento', color: '#d97706' },
                { range: '1 – 39%', label: 'Necessita Atenção', color: '#dc2626' },
              ].map((l, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderLeft: `4px solid ${l.color}`,
                    padding: '6px 10px',
                    borderRadius: 3,
                  }}
                >
                  <div style={{ fontWeight: 700, color: l.color, fontSize: 10 }}>
                    {l.label}
                  </div>
                  <div style={{ color: '#64748b' }}>{l.range}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============= SEÇÕES DE DETALHAMENTO POR DOMÍNIO ============= */}
      {evaluationDomains.map((domain) => {
        const color = getDomainColor(domain.title);
        const domainPct = calcDomainPct(domain);
        const domainPerf = getPerfLabel(domainPct);
        const hasAny = domain.subdomains.some((s) =>
          s.parameters.some((p) => {
            const v = selections[`${domain.title}-${s.title}-${p}`];
            return v && v !== 'nao_observado';
          })
        );
        if (!hasAny) return null;

        return (
          <React.Fragment key={domain.title}>
            {/* Header do domínio + tabela de subdomínios */}
            <section data-pdf-section style={sectionWrap}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: color,
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '6px 6px 0 0',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.3px' }}>
                  {domain.title}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700 }}>
                  Média: {domainPct}% · {domainPerf.label}
                </div>
              </div>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 10,
                  border: '1px solid #e2e8f0',
                  borderTop: 'none',
                }}
              >
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '6px 10px',
                        color: '#475569',
                        fontWeight: 700,
                      }}
                    >
                      Subdomínio
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '6px 10px',
                        color: '#475569',
                        fontWeight: 700,
                        width: 70,
                      }}
                    >
                      %
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '6px 10px',
                        color: '#475569',
                        fontWeight: 700,
                        width: 220,
                      }}
                    >
                      Indicador
                    </th>
                    <th
                      style={{
                        textAlign: 'right',
                        padding: '6px 10px',
                        color: '#475569',
                        fontWeight: 700,
                        width: 130,
                      }}
                    >
                      Classificação
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {domain.subdomains.map((sub) => {
                    const pct = calcSubdomainPct(domain.title, sub.title, sub.parameters);
                    const perf = getPerfLabel(pct);
                    return (
                      <tr
                        key={sub.title}
                        style={{ borderTop: '1px solid #f1f5f9' }}
                      >
                        <td
                          style={{
                            padding: '6px 10px',
                            color: '#0f172a',
                            fontWeight: 600,
                          }}
                        >
                          {sub.title}
                        </td>
                        <td
                          style={{
                            padding: '6px 10px',
                            textAlign: 'center',
                            color,
                            fontWeight: 800,
                          }}
                        >
                          {pct}%
                        </td>
                        <td style={{ padding: '6px 10px' }}>
                          <div
                            style={{
                              background: '#e2e8f0',
                              height: 6,
                              borderRadius: 3,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                background: color,
                              }}
                            />
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '6px 10px',
                            textAlign: 'right',
                            color: perf.color,
                            fontWeight: 700,
                          }}
                        >
                          {perf.label}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>

            {/* Uma seção por subdomínio com os parâmetros */}
            {domain.subdomains.map((sub) => {
              const rows = sub.parameters.map((p) => {
                const key = `${domain.title}-${sub.title}-${p}`;
                const v = selections[key];
                const freq = (v && FREQ_LABEL[v]) || FREQ_LABEL['nao_observado'];
                return { param: p, value: v, freq };
              });
              const evaluatedRows = rows.filter(
                (r) => r.value && r.value !== 'nao_observado'
              );
              if (evaluatedRows.length === 0) return null;

              return (
                <section
                  key={`${domain.title}-${sub.title}`}
                  data-pdf-section
                  style={sectionWrap}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 12px',
                      background: '#f8fafc',
                      borderLeft: `4px solid ${color}`,
                      borderRadius: 3,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      {domain.title.replace('Domínio ', '')}
                    </div>
                    <div style={{ color: '#cbd5e1' }}>·</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                      {sub.title}
                    </div>
                  </div>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: 9.5,
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <thead>
                      <tr style={{ background: '#f1f5f9' }}>
                        <th
                          style={{
                            textAlign: 'left',
                            padding: '5px 10px',
                            color: '#475569',
                            fontWeight: 700,
                          }}
                        >
                          Parâmetro
                        </th>
                        <th
                          style={{
                            textAlign: 'center',
                            padding: '5px 10px',
                            color: '#475569',
                            fontWeight: 700,
                            width: 150,
                          }}
                        >
                          Frequência
                        </th>
                        <th
                          style={{
                            textAlign: 'center',
                            padding: '5px 10px',
                            color: '#475569',
                            fontWeight: 700,
                            width: 60,
                          }}
                        >
                          Pontos
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => {
                        const isEval = r.value && r.value !== 'nao_observado';
                        return (
                          <tr
                            key={i}
                            style={{
                              borderTop: '1px solid #f1f5f9',
                              background: isEval ? '#ffffff' : '#fafafa',
                            }}
                          >
                            <td
                              style={{
                                padding: '5px 10px',
                                color: isEval ? '#0f172a' : '#94a3b8',
                              }}
                            >
                              {r.param}
                            </td>
                            <td
                              style={{
                                padding: '6px 8px',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                              }}
                            >
                              <div
                                style={{
                                  display: 'block',
                                  width: '134px',
                                  margin: '0 auto',
                                  padding: '5px 8px',
                                  borderRadius: 999,
                                  background: r.freq.color,
                                  color: '#ffffff',
                                  fontSize: 8.5,
                                  fontWeight: 700,
                                  letterSpacing: '0.2px',
                                  lineHeight: 1.4,
                                  textAlign: 'center',
                                  boxSizing: 'border-box',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {r.freq.label}
                              </div>
                            </td>
                            <td
                              style={{
                                padding: '5px 10px',
                                textAlign: 'center',
                                color: r.freq.color,
                                fontWeight: 800,
                              }}
                            >
                              {r.freq.score}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </section>
              );
            })}
          </React.Fragment>
        );
      })}

      {!suppressProfessionalFooter && (
        <section data-pdf-section style={sectionWrap}>
          <div
            style={{
              borderTop: '2px solid #0f172a',
              paddingTop: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              {professionalPhotoBase64 && (
                <img
                  src={professionalPhotoBase64}
                  alt="Profissional"
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #e2e8f0',
                  }}
                />
              )}
              <div style={{ fontSize: 9, color: '#475569', lineHeight: 1.55 }}>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 11 }}>
                  {professionalData?.name || 'Musicoterapeuta'}
                </div>
                {professionalData?.email && <div>{professionalData.email}</div>}
                <div style={{ marginTop: 4, fontStyle: 'italic', color: '#64748b' }}>
                  Documento clínico — confidencial conforme normas profissionais
                  vigentes.
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 9, color: '#64748b' }}>
              {digitalStampBase64 && (
                <img
                  src={digitalStampBase64}
                  alt="Carimbo digital"
                  style={{ maxWidth: 140, maxHeight: 70, marginBottom: 6 }}
                />
              )}
              <img src="/lovable-uploads/musetera-logo-new.png" alt="MuseTera" crossOrigin="anonymous" style={{ display: 'block', width: 86, maxHeight: 48, objectFit: 'contain', margin: '0 auto 5px auto' }} />
              <div style={{ fontWeight: 700, color: '#0f172a' }}>
                MuseTera · Plataforma de Musicoterapia
              </div>
              <div>Gerado em {issuedAt}</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
