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

// Identidade visual MuseTera por domínio
const DOMAIN_COLORS: Record<string, string> = {
  Musical: '#7c3aed',        // roxo
  Psicossocial: '#10b981',   // verde
  Cognitivo: '#f59e0b',      // âmbar
  'Sensório-Motor': '#ef4444', // vermelho
  'Comunicativo-Interativo': '#0ea5e9', // azul
};

const getDomainColor = (domain?: string) => {
  if (!domain) return '#6366f1';
  return DOMAIN_COLORS[domain] || '#6366f1';
};

const getClassification = (pct: number) => {
  if (pct >= 80) return { label: 'Desenvolvimento Excepcional', color: '#15803d', bg: '#dcfce7' };
  if (pct >= 60) return { label: 'Desenvolvimento Consistente', color: '#15803d', bg: '#d1fae5' };
  if (pct >= 40) return { label: 'Desenvolvimento Moderado', color: '#1d4ed8', bg: '#dbeafe' };
  if (pct >= 20) return { label: 'Desenvolvimento Inconsistente', color: '#a16207', bg: '#fef3c7' };
  if (pct > 0) return { label: 'Habilidades Emergentes', color: '#c2410c', bg: '#ffedd5' };
  return { label: 'Não Observado', color: '#b91c1c', bg: '#fee2e2' };
};

// Agrupa subdomínios por domínio para o sumário
const groupByDomain = (data: any[]) => {
  const map = new Map<string, any[]>();
  data.forEach((item) => {
    const d = item.domain || 'Outros';
    if (!map.has(d)) map.set(d, []);
    map.get(d)!.push(item);
  });
  return Array.from(map.entries());
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
  const dateStr = evaluationDate
    ? format(evaluationDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const overallClass = overallScore ? getClassification(overallScore.percentage) : null;
  const grouped = groupByDomain(categoryData);

  // Estilos base para garantir compatibilidade com html2canvas
  const pageStyle: React.CSSProperties = {
    width: '210mm',
    minHeight: '297mm',
    margin: '0 auto',
    padding: '15mm 14mm',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica, Arial, sans-serif',
    color: '#0f172a',
    boxSizing: 'border-box',
    position: 'relative',
  };

  const cardStyle: React.CSSProperties = {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '14px',
    backgroundColor: '#ffffff',
    pageBreakInside: 'avoid',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '10px',
    paddingBottom: '6px',
    borderBottom: '2px solid #6366f1',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  };

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* ============ PÁGINA 1 — Capa, Identificação e Visão Geral ============ */}
      <div style={pageStyle}>
        {/* Cabeçalho institucional */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            borderBottom: '3px solid #6366f1',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png"
              alt="MuseTera"
              style={{ width: '38px', height: 'auto' }}
            />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>MuseTera</div>
              <div style={{ fontSize: '9px', color: '#64748b' }}>
                Sistema de Gestão para Musicoterapia
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '9px', color: '#64748b' }}>
            <div>Documento Clínico</div>
            <div>{format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</div>
          </div>
        </div>

        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: '#eef2ff',
              color: '#4338ca',
              fontSize: '10px',
              fontWeight: 600,
              borderRadius: '999px',
              marginBottom: '8px',
              letterSpacing: '0.5px',
            }}
          >
            RELATÓRIO DE PARÂMETROS E GRÁFICOS
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
            Avaliação MuseTera TEA
          </h1>
          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
            Análise visual dos domínios e subdomínios avaliados
          </p>
        </div>

        {/* Identificação */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ ...cardStyle, flex: 1, backgroundColor: '#f8fafc' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              Paciente
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              {patientName || 'Não informado'}
            </div>
            <div style={{ fontSize: '10px', color: '#475569' }}>
              <strong>Data da avaliação:</strong> {dateStr}
            </div>
          </div>
          <div style={{ ...cardStyle, flex: 1, backgroundColor: '#f8fafc' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              Profissional Responsável
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              {professionalData?.name || 'Não informado'}
            </div>
            <div style={{ fontSize: '10px', color: '#475569' }}>
              {professionalData?.register && <div>{professionalData.register}</div>}
              {professionalData?.email && <div>{professionalData.email}</div>}
            </div>
          </div>
        </div>

        {/* Pontuação geral em destaque */}
        {overallScore && overallClass && (
          <div
            style={{
              ...cardStyle,
              background: 'linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%)',
              border: '1px solid #c7d2fe',
              marginBottom: '16px',
            }}
          >
            <div style={sectionTitle}>Pontuação Geral</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'center', minWidth: '110px' }}>
                <div style={{ fontSize: '34px', fontWeight: 800, color: '#4338ca', lineHeight: 1 }}>
                  {overallScore.percentage}%
                </div>
                <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                  {overallScore.raw} de {overallScore.max} pontos
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: overallClass.color,
                    backgroundColor: overallClass.bg,
                    borderRadius: '4px',
                    marginBottom: '8px',
                  }}
                >
                  {overallClass.label}
                </div>
                <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${overallScore.percentage}%`,
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '14px', fontSize: '10px', color: '#475569' }}>
                  <div>
                    <strong>Domínios:</strong> {overallScore.evaluatedDomains}/{overallScore.totalDomains}
                  </div>
                  <div>
                    <strong>Parâmetros:</strong> {overallScore.evaluatedParameters}/{overallScore.totalParameters}
                  </div>
                  <div>
                    <strong>Completude:</strong> {overallScore.completionPercentage}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gráficos lado a lado */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
          <div style={{ ...cardStyle, flex: 1 }}>
            <div style={sectionTitle}>Perfil por Domínio</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {radarData && (
                <StaticChart
                  data={radarData}
                  type="radar"
                  width={300}
                  height={240}
                  colors={['#6366f1']}
                />
              )}
            </div>
          </div>
          <div style={{ ...cardStyle, flex: 1 }}>
            <div style={sectionTitle}>Desenvolvimento Geral</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StaticChart
                data={pieData}
                type="pie"
                width={300}
                height={240}
                colors={['#10b981', '#f87171']}
              />
            </div>
          </div>
        </div>

        {/* Rodapé página 1 */}
        <div style={{ position: 'absolute', bottom: '10mm', left: '14mm', right: '14mm' }}>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#94a3b8' }}>
            <span>MuseTera • Avaliação TEA</span>
            <span>Página 1 de 3</span>
          </div>
        </div>
      </div>

      {/* ============ PÁGINA 2 — Gráfico de Barras detalhado ============ */}
      <div style={pageStyle}>
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
            Desempenho por Subdomínios
          </h2>
          <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>
            Distribuição comparativa do desempenho em cada subdomínio avaliado, agrupado por cor de domínio.
          </p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <StaticChart
              data={categoryData}
              type="bar"
              width={720}
              height={520}
              colors={['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9']}
            />
          </div>
        </div>

        {/* Legenda de domínios */}
        <div style={{ ...cardStyle, marginTop: '14px' }}>
          <div style={sectionTitle}>Legenda dos Domínios</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.entries(DOMAIN_COLORS).map(([domain, color]) => (
              <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: color }} />
                <span style={{ fontSize: '10px', color: '#334155' }}>{domain}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '10mm', left: '14mm', right: '14mm' }}>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#94a3b8' }}>
            <span>MuseTera • Avaliação TEA</span>
            <span>Página 2 de 3</span>
          </div>
        </div>
      </div>

      {/* ============ PÁGINA 3 — Sumário detalhado por domínio ============ */}
      <div style={pageStyle}>
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
            Resumo Interpretativo dos Subdomínios
          </h2>
          <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>
            Pontuação percentual e classificação clínica de cada subdomínio.
          </p>
        </div>

        {grouped.map(([domain, items]) => {
          const color = getDomainColor(domain);
          const avg = Math.round(items.reduce((s, i) => s + (i.value || 0), 0) / items.length);
          return (
            <div key={domain} style={{ ...cardStyle, marginBottom: '12px', borderLeft: `4px solid ${color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Domínio {domain}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color }}>
                  Média: {avg}%
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {items.map((item, idx) => {
                  const cls = getClassification(item.value || 0);
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '6px 10px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '4px',
                      }}
                    >
                      <div style={{ flex: 1, fontSize: '10px', color: '#0f172a', fontWeight: 600 }}>
                        {item.name}
                      </div>
                      <div style={{ width: '120px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.value || 0}%`, height: '100%', backgroundColor: color }} />
                      </div>
                      <div style={{ width: '40px', textAlign: 'right', fontSize: '10px', fontWeight: 700, color: '#0f172a' }}>
                        {item.value || 0}%
                      </div>
                      <div
                        style={{
                          minWidth: '110px',
                          textAlign: 'center',
                          fontSize: '8px',
                          fontWeight: 700,
                          color: cls.color,
                          backgroundColor: cls.bg,
                          padding: '3px 6px',
                          borderRadius: '3px',
                        }}
                      >
                        {cls.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Legenda das classificações */}
        <div style={{ ...cardStyle, marginTop: '8px', backgroundColor: '#f8fafc' }}>
          <div style={sectionTitle}>Legenda das Classificações</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', fontSize: '9px' }}>
            {[0, 20, 40, 60, 80, 100].map((v) => {
              const c = getClassification(v);
              return (
                <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: c.color }} />
                  <span style={{ color: '#334155' }}>
                    {v}% — {c.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assinatura */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div style={{ width: '60%', margin: '0 auto', borderTop: '1px solid #334155', paddingTop: '4px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>
              {professionalData?.name || 'Musicoterapeuta Responsável'}
            </div>
            {professionalData?.register && (
              <div style={{ fontSize: '9px', color: '#475569' }}>{professionalData.register}</div>
            )}
          </div>
        </div>

        {/* Rodapé final */}
        <div style={{ position: 'absolute', bottom: '10mm', left: '14mm', right: '14mm' }}>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#94a3b8' }}>
            <span>
              MuseTera • Documento gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}
            </span>
            <span>Página 3 de 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
