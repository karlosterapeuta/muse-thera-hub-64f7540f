
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { ProfessionalData } from "@/hooks/useProfessionalData";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";

interface ParametersGraphsPDFProps {
  categoryData: any[];
  pieData: any[];
  patientName?: string;
  professionalData?: ProfessionalData | null;
  radarData?: any[];
  overallScore?: {
    raw: number;
    max: number;
    percentage: number;
    completionPercentage?: number;
    evaluatedParameters?: number;
    totalParameters?: number;
    evaluatedDomains?: number;
    totalDomains?: number;
  };
  evaluationDate?: Date;
  allEvaluations?: SavedEvaluation[];
  professionalPhotoBase64?: string;
  digitalStampBase64?: string;
  selectedParameters?: Record<string, string>;
  evaluationDomains?: any[];
}

const DOMAIN_COLORS: Record<string, string> = {
  "Musical": "#8884d8",
  "Psicossocial": "#82ca9d",
  "Cognitivo": "#ffc658",
  "Sensório-Motor": "#ff8042",
  "Comunicativo-Interativo": "#00C49F"
};

const LEVEL_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
  "nao_observado": { label: "Não Observado", color: "#6b7280", bgColor: "#f3f4f6" },
  "emergente": { label: "Emergente", color: "#dc2626", bgColor: "#fef2f2" },
  "inconsistente": { label: "Inconsistente", color: "#f59e0b", bgColor: "#fffbeb" },
  "moderado": { label: "Moderado", color: "#2563eb", bgColor: "#eff6ff" },
  "consistente": { label: "Consistente", color: "#16a34a", bgColor: "#f0fdf4" },
  "excepcional": { label: "Excepcional", color: "#7c3aed", bgColor: "#faf5ff" },
};

const levelToScore = (level: string): number => {
  return level === "nao_observado" ? 0 : 
         level === "emergente" ? 20 : 
         level === "inconsistente" ? 40 : 
         level === "moderado" ? 60 :
         level === "consistente" ? 80 : 
         level === "excepcional" ? 100 : 0;
};

// A4 page wrapper style
const pageStyle: React.CSSProperties = {
  width: '210mm',
  minHeight: '297mm',
  padding: '12mm 14mm',
  backgroundColor: '#ffffff',
  boxSizing: 'border-box',
  pageBreakAfter: 'always',
  pageBreakInside: 'avoid',
  position: 'relative',
  margin: '0 auto',
};

const lastPageStyle: React.CSSProperties = {
  ...pageStyle,
  pageBreakAfter: 'auto',
};

const cardStyle: React.CSSProperties = {
  padding: '10px 12px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  pageBreakInside: 'avoid',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  marginBottom: '8px',
  color: '#0f172a',
  textAlign: 'center' as const,
  letterSpacing: '-0.2px',
};

export const ParametersGraphsPDF: React.FC<ParametersGraphsPDFProps> = ({
  categoryData,
  pieData,
  patientName,
  professionalData,
  radarData,
  overallScore,
  evaluationDate,
  allEvaluations = [],
  professionalPhotoBase64,
  digitalStampBase64,
  selectedParameters = {},
  evaluationDomains = [],
}) => {
  const COLORS = ['#4ade80', '#ffa1b5'];

  // Build evaluated parameters detail
  const evaluatedDetails: {
    domain: string;
    subdomain: string;
    parameter: string;
    level: string;
    score: number;
  }[] = [];

  evaluationDomains.forEach((domain: any) => {
    domain.subdomains?.forEach((subdomain: any) => {
      subdomain.parameters?.forEach((param: string) => {
        const key = `${domain.title}-${subdomain.title}-${param}`;
        const value = selectedParameters[key];
        if (value && value !== "nao_observado") {
          evaluatedDetails.push({
            domain: domain.title,
            subdomain: subdomain.title,
            parameter: param,
            level: value,
            score: levelToScore(value),
          });
        }
      });
    });
  });

  // Group by domain > subdomain
  const groupedByDomain: Record<string, Record<string, typeof evaluatedDetails>> = {};
  evaluatedDetails.forEach(item => {
    if (!groupedByDomain[item.domain]) groupedByDomain[item.domain] = {};
    if (!groupedByDomain[item.domain][item.subdomain]) groupedByDomain[item.domain][item.subdomain] = [];
    groupedByDomain[item.domain][item.subdomain].push(item);
  });

  const evaluatedCategoryData = categoryData.filter(item => item.value > 0);
  const evaluatedRadarData = radarData?.filter(item => item.value > 0) || [];

  // Split domain groups into chunks that fit pages (~18 params per page)
  const domainEntries = Object.entries(groupedByDomain);
  const detailPages: { domainName: string; subdomains: Record<string, typeof evaluatedDetails> }[][] = [];
  let currentPageItems: typeof detailPages[0] = [];
  let currentParamCount = 0;
  const MAX_PARAMS_PER_PAGE = 28;

  domainEntries.forEach(([domainName, subdomains]) => {
    const totalParams = Object.values(subdomains).reduce((sum, p) => sum + p.length, 0);
    if (currentParamCount + totalParams > MAX_PARAMS_PER_PAGE && currentPageItems.length > 0) {
      detailPages.push(currentPageItems);
      currentPageItems = [];
      currentParamCount = 0;
    }
    currentPageItems.push({ domainName, subdomains });
    currentParamCount += totalParams;
  });
  if (currentPageItems.length > 0) {
    detailPages.push(currentPageItems);
  }

  // Header component reused
  const HeaderSection = () => (
    <div style={{ marginBottom: '20px', borderBottom: '3px solid #2563eb', paddingBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" alt="Logo" style={{ width: '36px', height: 'auto' }} />
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1e3a5f', margin: 0, letterSpacing: '-0.3px' }}>
              Relatório de Avaliação
            </h1>
            <p style={{ fontSize: '11px', color: '#64748b', margin: 0, marginTop: '1px' }}>
              Escala MuseTera - Parâmetros e Gráficos
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Data da Avaliação</p>
          <p style={{ fontSize: '14px', color: '#1e3a5f', margin: 0, fontWeight: 700 }}>
            {evaluationDate ? format(evaluationDate, 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy')}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px 16px', border: '1px solid #e2e8f0' }}>
        <div>
          <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Paciente</p>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{patientName || 'Não informado'}</p>
        </div>
        {overallScore && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Score</p>
              <p style={{ fontSize: '22px', fontWeight: 800, color: '#2563eb', margin: 0 }}>{overallScore.percentage}%</p>
            </div>
            {overallScore.evaluatedParameters != null && overallScore.totalParameters != null && (
              <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '14px', textAlign: 'center' }}>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Cobertura</p>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {overallScore.evaluatedParameters}/{overallScore.totalParameters}
                </p>
                <p style={{ fontSize: '9px', color: '#64748b', margin: 0 }}>parâmetros</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Footer component
  const FooterSection = ({ compact = false }: { compact?: boolean }) => (
    <div style={{
      marginTop: compact ? '16px' : '24px',
      border: '2px solid #0d9488',
      borderRadius: '10px',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      pageBreakInside: 'avoid',
    }}>
      <div style={{ height: '4px', background: 'linear-gradient(to right, #0d9488, #14b8a6, #06b6d4)' }}></div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        gap: '16px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 50%, #ecfeff 100%)'
      }}>
        {/* Left - Professional Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: '-2px', borderRadius: '50%', background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', opacity: 0.6 }}></div>
            <div style={{
              position: 'relative', width: '48px', height: '48px', borderRadius: '50%',
              border: '2px solid #ffffff', overflow: 'hidden', backgroundColor: '#ccfbf1',
              boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
            }}>
              {professionalPhotoBase64 ? (
                <img src={professionalPhotoBase64} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: '#0d9488' }}>
                  {professionalData?.name?.charAt(0) || 'M'}
                </div>
              )}
            </div>
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#0d9488', marginBottom: '2px' }}>
              {professionalData?.name || 'Musicoterapeuta'}
            </p>
            {professionalData?.specialty && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '10px', padding: '2px 6px', marginBottom: '3px' }}>
                <span style={{ fontSize: '8px' }}>♪</span>
                <span style={{ fontSize: '9px', color: '#0d9488', fontWeight: 600 }}>{professionalData.specialty}</span>
              </div>
            )}
            <div style={{ marginTop: '2px' }}>
              {professionalData?.register && (
                <p style={{ fontSize: '8px', color: '#6b7280', marginBottom: '1px' }}>📋 {professionalData.register}</p>
              )}
              {professionalData?.email && (
                <p style={{ fontSize: '8px', color: '#6b7280', marginBottom: '1px' }}>✉ {professionalData.email}</p>
              )}
              {professionalData?.phone && (
                <p style={{ fontSize: '8px', color: '#6b7280' }}>☎ {professionalData.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right - Stamp */}
        <div style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: '0', borderRadius: '50%', border: '2px dashed #99f6e4', opacity: 0.5 }}></div>
          <div style={{ position: 'absolute', inset: '3px', borderRadius: '50%', border: '1px solid #5eead4', opacity: 0.7 }}></div>
          <div style={{
            position: 'absolute', inset: '5px', borderRadius: '50%', border: '2px solid #0d9488',
            backgroundColor: '#f0fdfa', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '3px',
            boxShadow: '0 2px 6px rgba(13, 148, 136, 0.2)'
          }}>
            <p style={{ fontSize: '6px', fontWeight: 700, color: '#0d9488', textAlign: 'center', lineHeight: 1.1, maxWidth: '52px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0, marginBottom: '2px' }}>
              {professionalData?.name || 'Musicoterapeuta'}
            </p>
            <div style={{ width: '20px', height: '1px', background: 'linear-gradient(to right, transparent, #14b8a6, transparent)', marginBottom: '2px' }}></div>
            {professionalData?.register && (
              <p style={{ fontSize: '5px', color: '#6b7280', textAlign: 'center', margin: 0, marginBottom: '2px' }}>{professionalData.register}</p>
            )}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', background: 'linear-gradient(135deg, #0d9488, #06b6d4)', borderRadius: '5px', padding: '1px 3px' }}>
              <span style={{ fontSize: '4px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.3px' }}>MuseTera ✔</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #99f6e4', background: 'linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa)', padding: '3px 10px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{ fontSize: '8px', color: '#0d9488' }}>✔</span>
          <span style={{ fontSize: '8px', fontWeight: 600, color: '#0d9488' }}>Assinatura Digital Verificada · Sistema MuseTera</span>
        </div>
      </div>
    </div>
  );

  // Page number
  const PageNumber = ({ num, total }: { num: number; total: number }) => (
    <div style={{ position: 'absolute', bottom: '10mm', right: '22mm', fontSize: '9px', color: '#94a3b8' }}>
      Página {num} de {total}
    </div>
  );

  // ===== Análise voltada aos pais =====
  const FRIENDLY_DOMAIN: Record<string, string> = {
    "Domínio Musical": "Música e expressão sonora",
    "Domínio Psicossocial": "Relações e emoções",
    "Domínio Cognitivo": "Atenção, memória e raciocínio",
    "Domínio Sensório-Motor": "Corpo, movimento e sentidos",
    "Domínio Comunicativo-Interativo": "Comunicação e interação",
  };

  const friendlyDomainName = (raw: string) => FRIENDLY_DOMAIN[raw] || raw.replace("Domínio ", "");

  const LEVEL_FRIENDLY: Record<string, string> = {
    nao_observado: "Ainda não observado neste momento",
    emergente: "Começando a aparecer",
    inconsistente: "Aparece de vez em quando",
    moderado: "Em desenvolvimento, presente em vários momentos",
    consistente: "Bem desenvolvido e frequente",
    excepcional: "Habilidade muito desenvolvida e regular",
  };

  // Histórico por domínio (até 6 últimas avaliações ordenadas por data ascendente)
  const sortedEvalsAsc = [...allEvaluations].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const lastEvals = sortedEvalsAsc.slice(-6);
  const domainHistory: Record<string, number[]> = {};
  lastEvals.forEach((evaluation) => {
    const ds = evaluation.content?.domainScores || [];
    ds.forEach((entry: any) => {
      const key = (entry.domain || "").replace("Domínio ", "").trim();
      if (!key) return;
      if (!domainHistory[key]) domainHistory[key] = [];
      const pct = typeof entry.score === "number" ? entry.score : 0;
      domainHistory[key].push(Math.max(0, Math.min(100, Math.round(pct))));
    });
  });

  // Cálculo de tendência
  type TrendStatus = "improved" | "stable" | "oscillated" | "first";
  const computeTrend = (scores: number[]): {
    status: TrendStatus;
    delta: number;
    last: number;
    color: string;
    bg: string;
    border: string;
    label: string;
    icon: string;
    count: number;
  } => {
    if (!scores || scores.length === 0) {
      return { status: "first", delta: 0, last: 0, color: "#475569", bg: "#f1f5f9", border: "#cbd5e1", label: "Sem dados", icon: "—", count: 0 };
    }
    if (scores.length === 1) {
      return { status: "first", delta: 0, last: scores[0], color: "#475569", bg: "#f1f5f9", border: "#cbd5e1", label: "Primeira avaliação", icon: "●", count: 1 };
    }
    const first = scores[0];
    const last = scores[scores.length - 1];
    const delta = last - first;
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / scores.length;
    const stdev = Math.sqrt(variance);

    // Detectar oscilação: alternância de sinais entre passos consecutivos
    let signChanges = 0;
    for (let i = 2; i < scores.length; i++) {
      const d1 = scores[i - 1] - scores[i - 2];
      const d2 = scores[i] - scores[i - 1];
      if (d1 !== 0 && d2 !== 0 && Math.sign(d1) !== Math.sign(d2)) signChanges++;
    }
    const isOscillating = signChanges >= 2 || (stdev > 12 && Math.abs(delta) < 10);

    if (isOscillating) {
      return { status: "oscillated", delta, last, color: "#b45309", bg: "#fffbeb", border: "#fde68a", label: "Oscilou", icon: "▼▲", count: scores.length };
    }
    if (delta >= 5) {
      return { status: "improved", delta, last, color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", label: "Melhorou", icon: "▲", count: scores.length };
    }
    if (delta <= -5) {
      return { status: "oscillated", delta, last, color: "#b45309", bg: "#fffbeb", border: "#fde68a", label: "Oscilou", icon: "▼", count: scores.length };
    }
    return { status: "stable", delta, last, color: "#475569", bg: "#f1f5f9", border: "#cbd5e1", label: "Manteve", icon: "●", count: scores.length };
  };

  // Sparkline SVG inline (compatível com html2canvas)
  const Sparkline: React.FC<{ scores: number[]; color: string }> = ({ scores, color }) => {
    if (!scores || scores.length < 2) return null;
    const W = 90, H = 28, PAD = 2;
    const len = scores.length;
    const points = scores.map((v, i) => {
      const x = PAD + (i * (W - PAD * 2)) / (len - 1);
      const y = H - PAD - ((Math.max(0, Math.min(100, v)) * (H - PAD * 2)) / 100);
      return { x, y };
    });
    const polyline = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const areaPath = `M ${points[0].x.toFixed(1)},${(H - PAD).toFixed(1)} L ` +
      points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ") +
      ` L ${points[points.length - 1].x.toFixed(1)},${(H - PAD).toFixed(1)} Z`;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <path d={areaPath} fill={color} fillOpacity={0.15} stroke="none" />
        <polyline points={polyline} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={points[0].x} cy={points[0].y} r={1.8} fill={color} />
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={2.4} fill={color} stroke="#ffffff" strokeWidth={0.8} />
      </svg>
    );
  };

  // Domínios consolidados (média) para apresentação aos pais
  const parentsDomainSummary = (radarData || []).map((d: any) => {
    const value = d.value ?? 0;
    let label = "Habilidade emergente";
    let color = "#dc2626";
    let bg = "#fef2f2";
    if (value >= 80) { label = "Habilidade muito desenvolvida"; color = "#15803d"; bg = "#dcfce7"; }
    else if (value >= 60) { label = "Habilidade bem presente"; color = "#15803d"; bg = "#f0fdf4"; }
    else if (value >= 40) { label = "Habilidade em desenvolvimento"; color = "#1d4ed8"; bg = "#eff6ff"; }
    else if (value >= 20) { label = "Habilidade aparecendo aos poucos"; color = "#a16207"; bg = "#fef3c7"; }
    const history = domainHistory[d.name] || [];
    const trend = computeTrend(history);
    return { name: d.name, value, label, color, bg, history, trend };
  });

  // Top destaques e prioridades
  const sortedForParents = [...evaluatedDetails].sort((a, b) => b.score - a.score);
  const topStrengths = sortedForParents.filter(d => d.score >= 60).slice(0, 6);
  const topPriorities = [...evaluatedDetails]
    .filter(d => d.score > 0 && d.score < 60)
    .sort((a, b) => a.score - b.score)
    .slice(0, 6);

  const hasParentsView = (radarData?.length || 0) > 0 || evaluatedDetails.length > 0;

  // Calculate total pages
  const hasEvolution = allEvaluations.length >= 1;
  const hasDetails = detailPages.length > 0;
  // Page 1 always (clinical + parents). Page 2 = details + evolution merged. Overflow only if many details.
  let totalPages = 1;
  if (hasDetails || hasEvolution) totalPages += 1;
  if (detailPages.length > 1) totalPages += detailPages.length - 1;
  let pageNum = 0;

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      
      {/* ==================== PAGE 1: Visão Clínica + Apresentação aos Pais ==================== */}
      <div style={(hasDetails || hasEvolution) ? pageStyle : lastPageStyle}>
        {(() => { pageNum = 1; return null; })()}
        <HeaderSection />

        {/* Radar + Pie side by side (compactos) */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', pageBreakInside: 'avoid' }}>
          <div style={{ ...cardStyle, flex: 1 }}>
            <h3 style={sectionTitleStyle}>Perfil por Domínio</h3>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px' }}>
              {evaluatedRadarData.length > 0 && (
                <RadarChart width={220} height={160} data={evaluatedRadarData}>
                  <PolarGrid strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 8 }} />
                  <Radar name="Perfil" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              )}
            </div>
          </div>
          <div style={{ ...cardStyle, flex: 1 }}>
            <h3 style={sectionTitleStyle}>Desenvolvimento Geral</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart width={200} height={140}>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={56} paddingAngle={4} dataKey="value">
                    {pieData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '2px' }}>
                {pieData.map((entry: any, index: number) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: COLORS[index] }} />
                    <span style={{ fontSize: '9.5px', color: '#4b5563' }}>{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resumo dos Subdomínios em chips de 3 colunas */}
        {evaluatedCategoryData.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: '12px', pageBreakInside: 'avoid' }}>
            <h3 style={{ ...sectionTitleStyle, textAlign: 'left', marginBottom: '6px' }}>Subdomínios Avaliados</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {evaluatedCategoryData.map((item, index) => {
                const scoreColor = item.value >= 80 ? '#16a34a' : item.value >= 60 ? '#2563eb' : item.value >= 40 ? '#f59e0b' : '#dc2626';
                const scoreBg = item.value >= 80 ? '#f0fdf4' : item.value >= 60 ? '#eff6ff' : item.value >= 40 ? '#fffbeb' : '#fef2f2';
                return (
                  <div key={index} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '4px 8px', backgroundColor: scoreBg, borderRadius: '5px',
                    border: `1px solid ${scoreColor}22`, width: 'calc(33.333% - 4px)', boxSizing: 'border-box'
                  }}>
                    <span style={{ fontSize: '9.5px', fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{item.name}</span>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, color: scoreColor,
                      backgroundColor: `${scoreColor}15`, padding: '1px 6px', borderRadius: '8px', marginLeft: '4px'
                    }}>{item.value}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Visão geral por área avaliada (Apresentação aos Pais com sparklines) */}
        {hasParentsView && (
          <div style={{ ...cardStyle, marginBottom: '10px', pageBreakInside: 'avoid' }}>
            <h3 style={{ ...sectionTitleStyle, textAlign: 'left', marginBottom: '8px' }}>
              Visão geral por área — Apresentação aos pais
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {parentsDomainSummary.map((d, idx) => (
                <div key={idx} style={{
                  display: 'flex', flexDirection: 'column', gap: '4px',
                  padding: '6px 10px', backgroundColor: '#f8fafc',
                  borderLeft: `3px solid ${d.color}`, borderRadius: '5px',
                  pageBreakInside: 'avoid'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>
                        {friendlyDomainName(d.name)}
                      </div>
                      <div style={{ fontSize: '9px', color: '#475569' }}>{d.label}</div>
                    </div>
                    {d.history.length >= 2 && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Sparkline scores={d.history} color={d.trend.color} />
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px', minWidth: '102px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '3px',
                        fontSize: '9px', fontWeight: 700,
                        color: d.trend.color, backgroundColor: d.trend.bg,
                        border: `1px solid ${d.trend.border}`,
                        padding: '1px 6px', borderRadius: '999px', lineHeight: 1.2
                      }}>
                        <span style={{ fontSize: '8px' }}>{d.trend.icon}</span>
                        {d.trend.label}
                      </span>
                      {d.history.length >= 2 ? (
                        <span style={{ fontSize: '7.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {d.trend.last}% · {d.trend.delta >= 0 ? '+' : ''}{d.trend.delta}% · {d.trend.count} aval.
                        </span>
                      ) : (
                        <span style={{ fontSize: '7.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {d.history.length === 1 ? '1 aval.' : 'sem histórico'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${d.value}%`, height: '100%', backgroundColor: d.color }} />
                    </div>
                    <div style={{ minWidth: '38px', textAlign: 'right', fontSize: '11px', fontWeight: 800, color: d.color }}>
                      {d.value}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem aos pais compacta */}
        {hasParentsView && (
          <div style={{
            background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%)',
            border: '1px solid #99f6e4', borderRadius: '8px',
            padding: '8px 12px', marginBottom: '6px', pageBreakInside: 'avoid'
          }}>
            <p style={{ fontSize: '9.5px', color: '#0f172a', lineHeight: 1.45, margin: 0 }}>
              <strong style={{ color: '#0d9488' }}>Mensagem aos pais:</strong> cada paciente tem seu próprio ritmo. Os resultados refletem o momento atual e guiam o planejamento terapêutico. A participação da família — cantando, brincando e ouvindo música em casa — é parte importante desse processo.
            </p>
          </div>
        )}

        {/* Legenda de níveis em 1 linha minúscula */}
        <div style={{ fontSize: '7.5px', color: '#64748b', textAlign: 'center', marginTop: '4px' }}>
          Níveis: Não Observado · Emergente · Inconsistente · Moderado · Consistente · Excepcional
        </div>

        {!hasDetails && !hasEvolution && <FooterSection compact />}
        <PageNumber num={1} total={totalPages} />
      </div>


      {/* ==================== DETAIL PAGES (compactas, 2 colunas) ==================== */}
      {detailPages.map((pageItems, pageIndex) => {
        pageNum = 2 + pageIndex;
        // Última página de detalhe leva também a evolução (se houver) e o footer
        const isLastDetailPage = pageIndex === detailPages.length - 1;
        const isLastPage = isLastDetailPage && !hasEvolution;
        return (
          <div key={`detail-page-${pageIndex}`} style={isLastPage ? lastPageStyle : pageStyle}>
            {/* Mini header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '6px', borderBottom: '2px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" alt="Logo" style={{ width: '20px', height: 'auto' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a5f' }}>Detalhamento da Avaliação</span>
              </div>
              <span style={{ fontSize: '10px', color: '#64748b' }}>{patientName || 'Paciente'} · {evaluatedDetails.length} parâmetros</span>
            </div>

            {/* Layout em 2 colunas paralelas para densidade */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              {[0, 1].map((colIdx) => (
                <div key={colIdx} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {pageItems
                    .filter((_, i) => i % 2 === colIdx)
                    .map(({ domainName, subdomains }) => {
                      const domainColor = DOMAIN_COLORS[domainName.replace('Domínio ', '')] || '#3b82f6';
                      return (
                        <div key={domainName} style={{ pageBreakInside: 'avoid' }}>
                          <div style={{
                            backgroundColor: domainColor, color: '#ffffff', padding: '4px 8px',
                            borderRadius: '5px 5px 0 0', fontSize: '10.5px', fontWeight: 700
                          }}>
                            {domainName}
                          </div>
                          <div style={{ border: `1px solid ${domainColor}40`, borderTop: 'none', borderRadius: '0 0 5px 5px', overflow: 'hidden' }}>
                            {Object.entries(subdomains).map(([subName, params]) => (
                              <div key={subName} style={{ borderBottom: `1px solid ${domainColor}20` }}>
                                <div style={{
                                  backgroundColor: `${domainColor}10`, padding: '3px 8px',
                                  fontSize: '9.5px', fontWeight: 600, color: '#374151',
                                }}>
                                  {subName}
                                </div>
                                {params.map((param, idx) => {
                                  const levelInfo = LEVEL_LABELS[param.level] || { label: param.level, color: '#6b7280', bgColor: '#f3f4f6' };
                                  return (
                                    <div key={idx} style={{
                                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                      padding: '3px 8px', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                                      gap: '6px'
                                    }}>
                                      <span style={{ fontSize: '9px', color: '#374151', flex: 1, lineHeight: 1.25, wordBreak: 'break-word' }}>
                                        {param.parameter}
                                      </span>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                        <span title={levelInfo.label} style={{
                                          width: '14px', height: '14px', borderRadius: '50%',
                                          backgroundColor: levelInfo.color, color: '#fff',
                                          fontSize: '8px', fontWeight: 700,
                                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                          {levelInfo.label.charAt(0)}
                                        </span>
                                        <div style={{ width: '28px', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                                          <div style={{ width: `${param.score}%`, height: '100%', backgroundColor: levelInfo.color }}></div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>

            {/* Bloco de Evolução compacto na última página de detalhe */}
            {isLastDetailPage && hasEvolution && (() => {
              const sortedEvals = [...allEvaluations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              const hasMulti = sortedEvals.length > 1;
              const firstScore = sortedEvals[0]?.content?.overallScore?.percentage || 0;
              const lastScore = sortedEvals[sortedEvals.length - 1]?.content?.overallScore?.percentage || 0;
              const variation = lastScore - firstScore;
              let improved = 0, attention = 0;
              if (hasMulti) {
                const firstDomains = sortedEvals[0].content?.domainScores || [];
                const lastDomains = sortedEvals[sortedEvals.length - 1].content?.domainScores || [];
                lastDomains.forEach((ld: any) => {
                  const fd = firstDomains.find((d: any) => d.domain === ld.domain);
                  if (fd) {
                    const dv = (ld.score || 0) - (fd.score || 0);
                    if (dv > 5) improved++; else attention++;
                  }
                });
              }
              const chartData = sortedEvals.map((evaluation) => ({
                date: format(new Date(evaluation.date), 'dd/MM/yy'),
                "Score Global": evaluation.content?.overallScore?.percentage || 0,
              }));
              return (
                <div style={{ ...cardStyle, marginTop: '10px', pageBreakInside: 'avoid' }}>
                  <h3 style={{ ...sectionTitleStyle, textAlign: 'left', marginBottom: '6px' }}>
                    Evolução {hasMulti ? `· ${sortedEvals.length} avaliações` : '· primeira avaliação'}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: hasMulti ? '8px' : 0 }}>
                    <div style={{ flex: 1, padding: '6px 8px', backgroundColor: '#f8fafc', borderRadius: '5px', textAlign: 'center' }}>
                      <p style={{ fontSize: '8px', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>Primeira</p>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#374151', margin: 0 }}>{firstScore}%</p>
                    </div>
                    <div style={{ flex: 1, padding: '6px 8px', backgroundColor: '#f8fafc', borderRadius: '5px', textAlign: 'center' }}>
                      <p style={{ fontSize: '8px', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>Última</p>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#374151', margin: 0 }}>{lastScore}%</p>
                    </div>
                    <div style={{ flex: 1, padding: '6px 8px', backgroundColor: variation > 0 ? '#f0fdf4' : variation < 0 ? '#fef2f2' : '#f8fafc', borderRadius: '5px', textAlign: 'center' }}>
                      <p style={{ fontSize: '8px', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>Variação</p>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: variation > 0 ? '#10b981' : variation < 0 ? '#ef4444' : '#6b7280', margin: 0 }}>
                        {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  {hasMulti && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <LineChart width={600} height={140} data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#6b7280' }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#6b7280' }} />
                          <Line type="monotone" dataKey="Score Global" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 3 }} />
                        </LineChart>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#15803d', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '999px' }}>
                          ✔ {improved} áreas melhoraram
                        </span>
                        <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#92400e', backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '999px' }}>
                          ⚠ {attention} áreas em atenção
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            {(isLastDetailPage) && <FooterSection compact />}
            <PageNumber num={pageNum} total={totalPages} />
          </div>
        );
      })}

      {/* ==================== EVOLUTION PAGE (apenas quando não há detalhes mas há evolução) ==================== */}
      {hasEvolution && !hasDetails && (() => {
        pageNum = 2;
        const hasMultipleEvaluations = allEvaluations.length > 1;

        if (hasMultipleEvaluations) {
          const sortedEvals = [...allEvaluations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const chartData = sortedEvals.map(evaluation => {
            const domainScores = evaluation.content?.domainScores || [];
            const dataPoint: Record<string, any> = { date: format(new Date(evaluation.date), 'dd/MM/yy'), "Score Global": evaluation.content?.overallScore?.percentage || 0 };
            domainScores.forEach((d: any) => { dataPoint[d.domain] = d.score || 0; });
            return dataPoint;
          });
          const firstScore = sortedEvals[0]?.content?.overallScore?.percentage || 0;
          const lastScore = sortedEvals[sortedEvals.length - 1]?.content?.overallScore?.percentage || 0;
          const variation = lastScore - firstScore;
          const availableDomains = sortedEvals[0]?.content?.domainScores?.map((d: any) => d.domain) || [];

          const areasAnalysis: { improved: any[], attention: any[] } = { improved: [], attention: [] };
          if (sortedEvals.length >= 2) {
            const firstDomains = sortedEvals[0].content?.domainScores || [];
            const lastDomains = sortedEvals[sortedEvals.length - 1].content?.domainScores || [];
            lastDomains.forEach((lastDomain: any) => {
              const firstDomain = firstDomains.find((d: any) => d.domain === lastDomain.domain);
              if (firstDomain) {
                const dv = (lastDomain.score || 0) - (firstDomain.score || 0);
                (dv > 5 ? areasAnalysis.improved : areasAnalysis.attention).push({
                  domain: lastDomain.domain, firstScore: firstDomain.score || 0, lastScore: lastDomain.score || 0, variation: dv
                });
              }
            });
          }

          return (
            <div style={lastPageStyle}>
              {/* Mini header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '2px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" alt="Logo" style={{ width: '24px', height: 'auto' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a5f' }}>Evolução do Paciente</span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{patientName || 'Paciente'}</span>
              </div>

              {/* Evolution Timeline */}
              <div style={{ ...cardStyle, marginBottom: '16px', pageBreakInside: 'avoid' }}>
                <h3 style={sectionTitleStyle}>Linha do Tempo de Evolução</h3>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px', textAlign: 'center' }}>
                  Progresso ao longo de {sortedEvals.length} avaliações
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Primeira Avaliação</p>
                    <p style={{ fontSize: '18px', fontWeight: 700, color: '#374151', margin: 0 }}>{firstScore}%</p>
                    <p style={{ fontSize: '9px', color: '#9ca3af', margin: 0 }}>{format(new Date(sortedEvals[0].date), 'dd/MM/yyyy')}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Última Avaliação</p>
                    <p style={{ fontSize: '18px', fontWeight: 700, color: '#374151', margin: 0 }}>{lastScore}%</p>
                    <p style={{ fontSize: '9px', color: '#9ca3af', margin: 0 }}>{format(new Date(sortedEvals[sortedEvals.length - 1].date), 'dd/MM/yyyy')}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Variação Total</p>
                    <p style={{ fontSize: '18px', fontWeight: 700, color: variation > 0 ? '#10b981' : variation < 0 ? '#ef4444' : '#6b7280', margin: 0 }}>
                      {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
                    </p>
                    <p style={{ fontSize: '9px', color: '#9ca3af', margin: 0 }}>{variation > 0 ? 'Melhora' : variation < 0 ? 'Declínio' : 'Estável'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <LineChart width={660} height={200} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="Score Global" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} />
                    {availableDomains.map((domain: string) => (
                      <Line key={domain} type="monotone" dataKey={domain} stroke={DOMAIN_COLORS[domain] || '#888'} strokeWidth={1.5} strokeDasharray="5 5" dot={{ fill: DOMAIN_COLORS[domain] || '#888', r: 3 }} />
                    ))}
                  </LineChart>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '16px', height: '3px', backgroundColor: '#3b82f6' }}></div>
                    <span style={{ fontSize: '10px', color: '#374151' }}>Score Global</span>
                  </div>
                  {availableDomains.map((domain: string) => (
                    <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '16px', height: '2px', borderTop: `2px dashed ${DOMAIN_COLORS[domain] || '#888'}` }}></div>
                      <span style={{ fontSize: '10px', color: '#374151' }}>{domain}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas Analysis */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', pageBreakInside: 'avoid' }}>
                <div style={{ ...cardStyle, flex: 1, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#166534', marginBottom: '10px' }}>&#x2714; Áreas que Melhoraram</h4>
                  {areasAnalysis.improved.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {areasAnalysis.improved.map((area, idx) => (
                        <div key={idx} style={{ padding: '8px', backgroundColor: '#dcfce7', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#166534' }}>{area.domain}</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', backgroundColor: '#bbf7d0', padding: '2px 6px', borderRadius: '10px' }}>+{area.variation.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Nenhuma área com melhora significativa (&gt;5%)</p>
                  )}
                </div>
                <div style={{ ...cardStyle, flex: 1, backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#92400e', marginBottom: '10px' }}>&#x26A0; Áreas que Precisam Atenção</h4>
                  {areasAnalysis.attention.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {areasAnalysis.attention.map((area, idx) => (
                        <div key={idx} style={{ padding: '8px', backgroundColor: (area.variation < 0 ? '#fef2f2' : '#fef3c7'), borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: area.variation < 0 ? '#991b1b' : '#92400e' }}>{area.domain}</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: area.variation < 0 ? '#dc2626' : '#d97706', backgroundColor: area.variation < 0 ? '#fecaca' : '#fde68a', padding: '2px 6px', borderRadius: '10px' }}>
                            {area.variation > 0 ? '+' : ''}{area.variation.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Todas as áreas apresentaram melhora significativa</p>
                  )}
                </div>
              </div>

              <FooterSection compact />
              <PageNumber num={pageNum} total={totalPages} />
            </div>
          );
        } else {
          // Single evaluation
          const singleEval = allEvaluations[0];
          const domainScores: any[] = singleEval?.content?.domainScores || [];
          const currentScore = singleEval?.content?.overallScore?.percentage || 0;
          const strongAreas = domainScores.filter((d: any) => (d.score || 0) >= 60).sort((a, b) => (b.score || 0) - (a.score || 0));
          const priorityAreas = domainScores.filter((d: any) => (d.score || 0) < 60).sort((a, b) => (a.score || 0) - (b.score || 0));

          return (
            <div style={lastPageStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '2px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" alt="Logo" style={{ width: '24px', height: 'auto' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a5f' }}>Perfil de Desempenho</span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{patientName || 'Paciente'}</span>
              </div>

              <div style={{ ...cardStyle, marginBottom: '16px', pageBreakInside: 'avoid' }}>
                <h3 style={sectionTitleStyle}>Perfil de Desempenho Atual</h3>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px', textAlign: 'center' }}>
                  Primeira avaliação - Score Global: <strong>{currentScore}%</strong>
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <BarChart layout="vertical" width={660} height={160} data={domainScores} margin={{ top: 5, right: 20, left: 90, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(v) => `${v}%`} />
                    <YAxis dataKey="domain" type="category" tick={{ fontSize: 11, fill: '#374151' }} width={85} />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Score']} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '11px' }} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {domainScores.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={DOMAIN_COLORS[entry.domain] || '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </div>
                <p style={{ marginTop: '12px', fontSize: '11px', color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '8px', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
                  A evolução temporal estará disponível após a próxima avaliação.
                </p>
              </div>

              {/* Areas */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', pageBreakInside: 'avoid' }}>
                <div style={{ ...cardStyle, flex: 1, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#166534', marginBottom: '8px' }}>&#x2B50; Áreas de Destaque</h4>
                  <p style={{ fontSize: '10px', color: '#6b7280', marginBottom: '8px' }}>Domínios com score ≥60%</p>
                  {strongAreas.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {strongAreas.map((area: any, idx: number) => (
                        <div key={idx} style={{ padding: '8px', backgroundColor: '#dcfce7', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#166534' }}>{area.domain}</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803d', backgroundColor: '#bbf7d0', padding: '3px 8px', borderRadius: '10px' }}>{area.score}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Nenhum domínio com score ≥60%</p>
                  )}
                </div>
                <div style={{ ...cardStyle, flex: 1, backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#92400e', marginBottom: '8px' }}>&#x1F3AF; Áreas Prioritárias</h4>
                  <p style={{ fontSize: '10px', color: '#6b7280', marginBottom: '8px' }}>Domínios com score &lt;60%</p>
                  {priorityAreas.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {priorityAreas.map((area: any, idx: number) => (
                        <div key={idx} style={{ padding: '8px', backgroundColor: (area.score || 0) < 40 ? '#fef2f2' : '#fef3c7', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: (area.score || 0) < 40 ? '#991b1b' : '#92400e' }}>{area.domain}</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: (area.score || 0) < 40 ? '#dc2626' : '#d97706', backgroundColor: (area.score || 0) < 40 ? '#fecaca' : '#fde68a', padding: '3px 8px', borderRadius: '10px' }}>{area.score}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>Todos os domínios estão acima de 60%</p>
                  )}
                </div>
              </div>

              <div style={{ ...cardStyle, marginBottom: '16px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', textAlign: 'center', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: '12px', color: '#0369a1', margin: 0 }}>
                  <strong>Nota:</strong> Este é o primeiro registro de avaliação. As seções de evolução estarão disponíveis após a segunda avaliação.
                </p>
              </div>

              <FooterSection compact />
              <PageNumber num={pageNum} total={totalPages} />
            </div>
          );
        }
      })()}
    </div>
  );
};
