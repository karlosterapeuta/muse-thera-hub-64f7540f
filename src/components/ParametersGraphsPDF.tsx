
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
  padding: '20mm 22mm',
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
  padding: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  pageBreakInside: 'avoid',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  marginBottom: '12px',
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
  const MAX_PARAMS_PER_PAGE = 16;

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
        <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
          <div style={{ position: 'absolute', inset: '0', borderRadius: '50%', border: '2px dashed #99f6e4', opacity: 0.5 }}></div>
          <div style={{ position: 'absolute', inset: '4px', borderRadius: '50%', border: '1px solid #5eead4', opacity: 0.7 }}></div>
          <div style={{
            position: 'absolute', inset: '6px', borderRadius: '50%', border: '3px solid #0d9488',
            backgroundColor: '#f0fdfa', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '6px',
            boxShadow: '0 2px 10px rgba(13, 148, 136, 0.25)'
          }}>
            <div style={{ position: 'relative', marginBottom: '4px' }}>
              <div style={{ position: 'absolute', inset: '-2px', borderRadius: '50%', background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', opacity: 0.7 }}></div>
              <div style={{ position: 'relative', width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #fff', overflow: 'hidden', backgroundColor: '#ccfbf1' }}>
                {professionalPhotoBase64 ? (
                  <img src={professionalPhotoBase64} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#0d9488' }}>
                    {professionalData?.name?.charAt(0) || 'M'}
                  </div>
                )}
              </div>
            </div>
            <p style={{ fontSize: '7px', fontWeight: 700, color: '#0d9488', textAlign: 'center', lineHeight: 1.2, maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '2px' }}>
              {professionalData?.name || 'Musicoterapeuta'}
            </p>
            <div style={{ width: '24px', height: '1px', background: 'linear-gradient(to right, transparent, #14b8a6, transparent)', marginBottom: '3px' }}></div>
            {professionalData?.register && (
              <p style={{ fontSize: '6px', color: '#6b7280', textAlign: 'center', marginBottom: '3px' }}>{professionalData.register}</p>
            )}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', background: 'linear-gradient(135deg, #0d9488, #06b6d4)', borderRadius: '6px', padding: '1px 4px' }}>
              <span style={{ fontSize: '5px', color: '#fff' }}>✔</span>
              <span style={{ fontSize: '4px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.3px' }}>MuseTera Verified</span>
              <span style={{ fontSize: '5px', color: '#fff' }}>♪</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #99f6e4', background: 'linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa)', padding: '4px 10px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{ fontSize: '9px', color: '#0d9488' }}>✔</span>
          <span style={{ fontSize: '8px', fontWeight: 600, color: '#0d9488' }}>Assinatura Digital Verificada</span>
          <span style={{ fontSize: '8px', color: '#6b7280' }}>Sistema MuseTera</span>
        </div>
        <p style={{ fontSize: '7px', color: '#6b7280', marginTop: '1px' }}>
          Documento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
        </p>
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
    return { name: d.name, value, label, color, bg };
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
  let totalPages = 1; // page 1: header + charts
  if (hasParentsView) totalPages += 1;
  if (hasDetails) totalPages += detailPages.length;
  if (hasEvolution) totalPages += 1;
  let pageNum = 0;

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      
      {/* ==================== PAGE 1: Header + Charts ==================== */}
      <div style={(hasParentsView || hasDetails || hasEvolution) ? pageStyle : lastPageStyle}>
        {(() => { pageNum = 1; return null; })()}
        <HeaderSection />

        {/* Radar + Pie side by side */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', pageBreakInside: 'avoid' }}>
          <div style={{ ...cardStyle, flex: 1 }}>
            <h3 style={sectionTitleStyle}>Perfil por Domínio</h3>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '220px' }}>
              {evaluatedRadarData.length > 0 && (
                <RadarChart width={260} height={220} data={evaluatedRadarData}>
                  <PolarGrid strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 9 }} />
                  <Radar name="Perfil" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              )}
            </div>
          </div>
          <div style={{ ...cardStyle, flex: 1 }}>
            <h3 style={sectionTitleStyle}>Desenvolvimento Geral</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart width={260} height={200}>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={5} dataKey="value">
                    {pieData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '4px' }}>
                {pieData.map((entry: any, index: number) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index] }} />
                    <span style={{ fontSize: '11px', color: '#4b5563' }}>{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ ...cardStyle, marginBottom: '16px', pageBreakInside: 'avoid' }}>
          <h3 style={{ ...sectionTitleStyle, fontSize: '16px' }}>
            Desempenho por Subdomínios {evaluatedCategoryData.length < categoryData.length ? '(Avaliados)' : ''}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BarChart width={680} height={320} data={evaluatedCategoryData} margin={{ top: 10, right: 20, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fill: '#4B5563', fontSize: 9 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#4B5563', fontSize: 10 }} />
              <Bar dataKey="value" fill="#3b82f6">
                {evaluatedCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.domain === "Musical" ? "#8884d8" :
                    entry.domain === "Psicossocial" ? "#82ca9d" :
                    entry.domain === "Cognitivo" ? "#ffc658" :
                    entry.domain === "Sensório-Motor" ? "#ff8042" : "#00C49F"
                  } />
                ))}
              </Bar>
            </BarChart>
          </div>
        </div>

        {/* Summary Table */}
        <div style={{ ...cardStyle, pageBreakInside: 'avoid' }}>
          <h3 style={sectionTitleStyle}>Resumo dos Subdomínios Avaliados</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {evaluatedCategoryData.map((item, index) => {
              const scoreColor = item.value >= 80 ? '#16a34a' : item.value >= 60 ? '#2563eb' : item.value >= 40 ? '#f59e0b' : '#dc2626';
              const scoreBg = item.value >= 80 ? '#f0fdf4' : item.value >= 60 ? '#eff6ff' : item.value >= 40 ? '#fffbeb' : '#fef2f2';
              return (
                <div key={index} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 12px', backgroundColor: scoreBg, borderRadius: '6px',
                  border: `1px solid ${scoreColor}22`, width: 'calc(50% - 4px)', boxSizing: 'border-box'
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#374151' }}>{item.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      backgroundColor: item.domain === "Musical" ? "#8884d8" :
                        item.domain === "Psicossocial" ? "#82ca9d" :
                        item.domain === "Cognitivo" ? "#ffc658" :
                        item.domain === "Sensório-Motor" ? "#ff8042" : "#00C49F"
                    }} />
                    <span style={{
                      fontSize: '12px', fontWeight: 700, color: scoreColor,
                      backgroundColor: `${scoreColor}15`, padding: '1px 8px', borderRadius: '10px'
                    }}>{item.value}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!hasParentsView && !hasDetails && !hasEvolution && <FooterSection />}
        <PageNumber num={1} total={totalPages} />
      </div>

      {/* ==================== PAGE 2: Apresentação para os Pais ==================== */}
      {hasParentsView && (() => {
        pageNum = 2;
        const isLastPage = !hasDetails && !hasEvolution;
        return (
          <div key="parents-view" style={isLastPage ? lastPageStyle : pageStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '2px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" alt="Logo" style={{ width: '24px', height: 'auto' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a5f' }}>Apresentação dos Resultados</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>{patientName || 'Paciente'}</span>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)',
              border: '1px solid #bae6fd', borderRadius: '10px',
              padding: '14px 18px', marginBottom: '14px', pageBreakInside: 'avoid'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0c4a6e', margin: 0, marginBottom: '6px' }}>
                Como {patientName || 'seu(a) filho(a)'} está se desenvolvendo
              </h2>
              <p style={{ fontSize: '11.5px', color: '#1e3a5f', lineHeight: 1.55, margin: 0 }}>
                Esta página apresenta os resultados de forma clara e acessível. A musicoterapia avalia diferentes
                áreas do desenvolvimento por meio da música, da escuta, do corpo e da interação. Abaixo você encontra
                um resumo do que está bem desenvolvido, o que está em construção e o que merece atenção neste momento.
              </p>
            </div>

            <div style={{ ...cardStyle, marginBottom: '12px', pageBreakInside: 'avoid' }}>
              <h3 style={{ ...sectionTitleStyle, textAlign: 'left', marginBottom: '10px' }}>
                Visão geral por área avaliada
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {parentsDomainSummary.map((d, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 12px', backgroundColor: '#f8fafc',
                    borderLeft: `4px solid ${d.color}`, borderRadius: '6px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                        {friendlyDomainName(d.name)}
                      </div>
                      <div style={{ fontSize: '10px', color: '#475569' }}>{d.label}</div>
                    </div>
                    <div style={{ width: '140px', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${d.value}%`, height: '100%', backgroundColor: d.color }} />
                    </div>
                    <div style={{ minWidth: '46px', textAlign: 'right', fontSize: '13px', fontWeight: 800, color: d.color }}>
                      {d.value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', pageBreakInside: 'avoid' }}>
              <div style={{ ...cardStyle, flex: 1, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#166534', margin: 0, marginBottom: '8px' }}>
                  ★ Pontos fortes observados
                </h4>
                {topStrengths.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {topStrengths.map((s, i) => (
                      <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid #dcfce7', borderRadius: '6px', padding: '6px 8px' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#0f172a', lineHeight: 1.35 }}>
                          {s.parameter}
                        </div>
                        <div style={{ fontSize: '9px', color: '#475569', marginTop: '2px' }}>
                          {friendlyDomainName(s.domain)} · {LEVEL_FRIENDLY[s.level] || s.level}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '10.5px', color: '#475569', fontStyle: 'italic', margin: 0 }}>
                    As habilidades estão começando a se desenvolver. A musicoterapia ajudará a fortalecê-las.
                  </p>
                )}
              </div>
              <div style={{ ...cardStyle, flex: 1, backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#92400e', margin: 0, marginBottom: '8px' }}>
                  ◎ Áreas a estimular nas próximas sessões
                </h4>
                {topPriorities.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {topPriorities.map((s, i) => (
                      <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid #fde68a', borderRadius: '6px', padding: '6px 8px' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#0f172a', lineHeight: 1.35 }}>
                          {s.parameter}
                        </div>
                        <div style={{ fontSize: '9px', color: '#475569', marginTop: '2px' }}>
                          {friendlyDomainName(s.domain)} · {LEVEL_FRIENDLY[s.level] || s.level}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '10.5px', color: '#475569', fontStyle: 'italic', margin: 0 }}>
                    Não há áreas críticas neste momento. Seguiremos fortalecendo o que já está bem desenvolvido.
                  </p>
                )}
              </div>
            </div>

            <div style={{ ...cardStyle, marginBottom: '12px', pageBreakInside: 'avoid' }}>
              <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: '8px' }}>
                Como ler os níveis usados na avaliação
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Object.entries(LEVEL_LABELS).map(([key, info]) => (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 8px', backgroundColor: info.bgColor,
                    border: `1px solid ${info.color}33`, borderRadius: '6px',
                    width: 'calc(50% - 3px)', boxSizing: 'border-box'
                  }}>
                    <span style={{
                      fontSize: '9.5px', fontWeight: 700, color: info.color,
                      backgroundColor: '#ffffff', padding: '1px 6px', borderRadius: '10px',
                      border: `1px solid ${info.color}40`, whiteSpace: 'nowrap'
                    }}>
                      {info.label}
                    </span>
                    <span style={{ fontSize: '9.5px', color: '#374151', lineHeight: 1.3 }}>
                      {LEVEL_FRIENDLY[key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%)',
              border: '1px solid #99f6e4', borderRadius: '10px',
              padding: '12px 16px', pageBreakInside: 'avoid'
            }}>
              <p style={{ fontSize: '10.5px', color: '#0f172a', lineHeight: 1.55, margin: 0 }}>
                <strong style={{ color: '#0d9488' }}>Mensagem aos pais:</strong> cada criança tem seu próprio ritmo
                de desenvolvimento. Os resultados acima refletem o momento atual e servem de guia para o nosso
                planejamento terapêutico. Continuaremos estimulando os pontos fortes e construindo passo a passo
                as habilidades em desenvolvimento. A participação da família — cantando, brincando e ouvindo
                música em casa — é parte importante desse processo.
              </p>
            </div>

            {isLastPage && <FooterSection compact />}
            <PageNumber num={pageNum} total={totalPages} />
          </div>
        );
      })()}

      {/* ==================== DETAIL PAGES ==================== */}
      {detailPages.map((pageItems, pageIndex) => {
        pageNum = 3 + pageIndex;
        const isLastPage = !hasEvolution && pageIndex === detailPages.length - 1;
        return (
          <div key={`detail-page-${pageIndex}`} style={isLastPage ? lastPageStyle : pageStyle}>
            {/* Mini header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '2px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" alt="Logo" style={{ width: '24px', height: 'auto' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a5f' }}>Detalhamento da Avaliação</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>{patientName || 'Paciente'}</span>
            </div>

            {pageIndex === 0 && (
              <div style={{
                backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px',
                padding: '10px 16px', marginBottom: '16px', textAlign: 'center', pageBreakInside: 'avoid'
              }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0c4a6e', margin: 0 }}>
                  {evaluatedDetails.length} parâmetros avaliados - Apenas itens efetivamente pontuados
                </p>
              </div>
            )}

            {pageItems.map(({ domainName, subdomains }) => {
              const domainColor = DOMAIN_COLORS[domainName.replace('Domínio ', '')] || '#3b82f6';
              return (
                <div key={domainName} style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
                  <div style={{
                    backgroundColor: domainColor, color: '#ffffff', padding: '8px 14px',
                    borderRadius: '8px 8px 0 0', fontSize: '14px', fontWeight: 700
                  }}>
                    {domainName}
                  </div>
                  <div style={{ border: `1px solid ${domainColor}40`, borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                    {Object.entries(subdomains).map(([subName, params]) => (
                      <div key={subName} style={{ borderBottom: `1px solid ${domainColor}20`, pageBreakInside: 'avoid' }}>
                        <div style={{
                          backgroundColor: `${domainColor}10`, padding: '6px 14px',
                          fontSize: '12px', fontWeight: 600, color: '#374151',
                          borderBottom: `1px solid ${domainColor}15`
                        }}>
                          {subName}
                        </div>
                        {params.map((param, idx) => {
                          const levelInfo = LEVEL_LABELS[param.level] || { label: param.level, color: '#6b7280', bgColor: '#f3f4f6' };
                          return (
                            <div key={idx} style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: '6px 14px', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                              borderBottom: idx < params.length - 1 ? '1px solid #f3f4f6' : 'none'
                            }}>
                              <span style={{ fontSize: '11px', color: '#374151', flex: 1, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                {param.parameter}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '10px' }}>
                                <span style={{
                                  fontSize: '10px', fontWeight: 600, color: levelInfo.color,
                                  backgroundColor: levelInfo.bgColor, padding: '2px 8px',
                                  borderRadius: '10px', border: `1px solid ${levelInfo.color}30`, whiteSpace: 'nowrap'
                                }}>
                                  {levelInfo.label}
                                </span>
                                <div style={{ width: '32px', height: '5px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: `${param.score}%`, height: '100%', backgroundColor: levelInfo.color, borderRadius: '3px' }}></div>
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

            {isLastPage && <FooterSection compact />}
            <PageNumber num={pageNum} total={totalPages} />
          </div>
        );
      })}

      {/* ==================== EVOLUTION PAGE ==================== */}
      {hasEvolution && (() => {
        pageNum = 2 + detailPages.length;
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
