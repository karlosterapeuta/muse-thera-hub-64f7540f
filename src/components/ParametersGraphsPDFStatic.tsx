import React from 'react';
import { StaticChart } from './StaticChart';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProfessionalData } from "@/hooks/useProfessionalData";

interface ParametersGraphsPDFStaticProps {
  categoryData: any[];
  pieData: any[];
  patientName?: string;
  professionalData?: ProfessionalData | null;
  radarData?: any[];
  overallScore?: {
    raw: number;
    max: number;
    percentage: number;
    completionPercentage: number;
    evaluatedDomains: number;
    totalDomains: number;
    evaluatedParameters: number;
    totalParameters: number;
  };
  evaluationDate?: Date;
}

const DOMAIN_COLORS: Record<string, string> = {
  Musical: '#6366f1',
  Psicossocial: '#10b981',
  Cognitivo: '#f59e0b',
  'Sensório-Motor': '#ef4444',
  'Comunicativo-Interativo': '#06b6d4',
};

const getDomainColor = (domain?: string) =>
  (domain && DOMAIN_COLORS[domain]) || '#64748b';

const getPerformanceLabel = (pct: number) => {
  if (pct >= 80) return { label: 'Excelente', color: '#059669' };
  if (pct >= 60) return { label: 'Satisfatório', color: '#0891b2' };
  if (pct >= 40) return { label: 'Em Desenvolvimento', color: '#d97706' };
  if (pct > 0) return { label: 'Necessita Atenção', color: '#dc2626' };
  return { label: 'Não Avaliado', color: '#6b7280' };
};

export const ParametersGraphsPDFStatic: React.FC<ParametersGraphsPDFStaticProps> = ({
  categoryData,
  pieData,
  patientName,
  professionalData,
  radarData,
  overallScore,
  evaluationDate,
}) => {
  const date = evaluationDate || new Date();
  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Group subdomains by domain
  const grouped = categoryData.reduce<Record<string, any[]>>((acc, item) => {
    const key = item.domain || 'Geral';
    (acc[key] = acc[key] || []).push(item);
    return acc;
  }, {});

  const baseText = { fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a' };
  const sectionTitle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: '#1e293b',
    borderBottom: '2px solid #0f172a',
    paddingBottom: 6,
    marginBottom: 14,
  };

  return (
    <div style={{ ...baseText, background: '#ffffff', width: '100%', fontSize: 11, lineHeight: 1.45 }}>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px solid #0f172a',
          paddingBottom: 12,
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png"
            alt="MuseTera"
            style={{ width: 44, height: 'auto' }}
          />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.2px' }}>
              MuseTera
            </div>
            <div style={{ fontSize: 9, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Avaliação Musicoterapêutica · TEA
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 9, color: '#475569', lineHeight: 1.5 }}>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>Relatório de Parâmetros e Gráficos</div>
          <div>Emitido em {formattedDate}</div>
        </div>
      </div>

      {/* IDENTIFICATION */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          padding: '14px 16px',
          marginBottom: 18,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          fontSize: 10,
        }}
      >
        <div>
          <div style={{ color: '#64748b', fontSize: 8, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
            Paciente
          </div>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#0f172a' }}>
            {patientName || 'Não informado'}
          </div>
        </div>
        <div>
          <div style={{ color: '#64748b', fontSize: 8, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
            Musicoterapeuta
          </div>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#0f172a' }}>
            {professionalData?.name || 'Não informado'}
          </div>
        </div>
        <div>
          <div style={{ color: '#64748b', fontSize: 8, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
            Data da Avaliação
          </div>
          <div style={{ fontWeight: 600, fontSize: 11, color: '#0f172a' }}>{formattedDate}</div>
        </div>
        <div>
          <div style={{ color: '#64748b', fontSize: 8, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
            Documento
          </div>
          <div style={{ fontWeight: 600, fontSize: 11, color: '#0f172a' }}>
            Parâmetros e Gráficos
          </div>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY */}
      {overallScore && (
        <>
          <div style={sectionTitle}>Síntese Executiva</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 22 }}>
            {[
              { label: 'Pontuação Total', value: `${overallScore.raw}/${overallScore.max}`, accent: '#0f172a' },
              { label: 'Desempenho Geral', value: `${overallScore.percentage}%`, accent: '#6366f1' },
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
                <div style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: m.accent, lineHeight: 1 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CHARTS — RADAR + PIE */}
      <div style={sectionTitle}>Visão Gráfica Consolidada</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a', marginBottom: 8, textAlign: 'center' }}>
            Perfil por Domínio
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {radarData && <StaticChart data={radarData} type="radar" width={300} height={240} colors={['#6366f1']} />}
          </div>
          <div style={{ fontSize: 8, color: '#64748b', textAlign: 'center', marginTop: 6 }}>
            Distribuição percentual por domínio clínico
          </div>
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a', marginBottom: 8, textAlign: 'center' }}>
            Desenvolvimento Geral
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <StaticChart data={pieData} type="pie" width={300} height={240} colors={['#10b981', '#f1f5f9']} />
          </div>
          <div style={{ fontSize: 8, color: '#64748b', textAlign: 'center', marginTop: 6 }}>
            Proporção de avanço sobre o potencial total
          </div>
        </div>
      </div>

      {/* BAR CHART — page break before for clarity */}
      <div style={{ pageBreakBefore: 'always' }} />
      <div style={sectionTitle}>Desempenho por Subdomínio</div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 14, marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <StaticChart
            data={categoryData}
            type="bar"
            width={720}
            height={360}
            colors={categoryData.map((d) => getDomainColor(d.domain))}
          />
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
          {Object.keys(grouped).map((dom) => (
            <div key={dom} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, color: '#334155' }}>
              <span style={{ width: 10, height: 10, background: getDomainColor(dom), borderRadius: 2, display: 'inline-block' }} />
              {dom}
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED TABLE BY DOMAIN */}
      <div style={sectionTitle}>Detalhamento por Domínio</div>
      {Object.entries(grouped).map(([domain, items]) => {
        const avg = Math.round(items.reduce((s, i) => s + (i.value || 0), 0) / items.length);
        const perf = getPerformanceLabel(avg);
        const color = getDomainColor(domain);
        return (
          <div key={domain} style={{ marginBottom: 14, breakInside: 'avoid' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: color,
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '4px 4px 0 0',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700 }}>{domain}</div>
              <div style={{ fontSize: 10, fontWeight: 600 }}>
                Média: {avg}% · {perf.label}
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9 }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                    Subdomínio
                  </th>
                  <th style={{ textAlign: 'center', padding: '6px 10px', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, width: 90 }}>
                    Desempenho
                  </th>
                  <th style={{ textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, width: 240 }}>
                    Indicador
                  </th>
                  <th style={{ textAlign: 'right', padding: '6px 10px', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, width: 110 }}>
                    Classificação
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const p = getPerformanceLabel(it.value || 0);
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 10px', color: '#0f172a', fontWeight: 500 }}>{it.name}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'center', color: color, fontWeight: 700 }}>
                        {it.value}%
                      </td>
                      <td style={{ padding: '6px 10px' }}>
                        <div style={{ background: '#e2e8f0', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${it.value}%`,
                              height: '100%',
                              background: color,
                              borderRadius: 3,
                            }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: '6px 10px', textAlign: 'right', color: p.color, fontWeight: 600 }}>
                        {p.label}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* INTERPRETATION KEY */}
      <div style={{ marginTop: 18, marginBottom: 14, breakInside: 'avoid' }}>
        <div style={sectionTitle}>Legenda de Classificação</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontSize: 9 }}>
          {[
            { range: '80% - 100%', label: 'Excelente', color: '#059669' },
            { range: '60% - 79%', label: 'Satisfatório', color: '#0891b2' },
            { range: '40% - 59%', label: 'Em Desenvolvimento', color: '#d97706' },
            { range: '1% - 39%', label: 'Necessita Atenção', color: '#dc2626' },
          ].map((l, i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderLeft: `4px solid ${l.color}`, padding: '6px 10px', borderRadius: 3 }}>
              <div style={{ fontWeight: 700, color: l.color, fontSize: 10 }}>{l.label}</div>
              <div style={{ color: '#64748b' }}>{l.range}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: 24,
          paddingTop: 12,
          borderTop: '2px solid #0f172a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: 8,
          color: '#64748b',
        }}
      >
        <div style={{ lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 10 }}>
            {professionalData?.name || 'Musicoterapeuta'}
          </div>
          {professionalData?.email && <div>{professionalData.email}</div>}
          <div style={{ marginTop: 4, fontStyle: 'italic' }}>
            Documento clínico — confidencial conforme normas profissionais vigentes.
          </div>
        </div>
        <div style={{ textAlign: 'right', lineHeight: 1.5 }}>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>MuseTera · Plataforma de Musicoterapia</div>
          <div>
            Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        </div>
      </div>
    </div>
  );
};
