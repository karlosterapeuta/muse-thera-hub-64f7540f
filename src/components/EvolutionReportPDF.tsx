import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { resolveEvaluationMeta } from "@/utils/evaluationTypes";
import { buildEvolutionAnalysis } from "@/utils/evolutionAnalysis";
import { formatBirthDateForDisplay } from "@/utils/dateUtils";

export interface EvolutionReportProfessional {
  name?: string;
  specialty?: string;
  register?: string;
  association?: string;
  email?: string;
  phone?: string;
}

interface EvolutionReportPDFProps {
  patientName: string;
  patientAge?: number;
  patientBirthDate?: string;
  evaluations: SavedEvaluation[]; // já ordenadas por data ascendente
  professional?: EvolutionReportProfessional;
  signatureBase64?: string | null;
  stampBase64?: string | null;
  logoBase64?: string | null;
  reportCode?: string;
}

// Garante nitidez máxima das imagens (logo/assinatura/carimbo) no PDF
const crispImg: React.CSSProperties = {
  imageRendering: "auto" as React.CSSProperties["imageRendering"],
  WebkitFontSmoothing: "antialiased",
  // Renderização de alta qualidade para downscale de imagens (logo/assinatura/carimbo)
  WebkitBackfaceVisibility: "hidden" as React.CSSProperties["WebkitBackfaceVisibility"],
  transform: "translateZ(0)",
};

const SERIES_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#059669", "#d97706"];

// ---- Radar multi-séries (SVG) ----
function MultiRadar({
  domains,
  series,
  size = 360,
}: {
  domains: string[];
  series: { name: string; color: string; values: number[] }[];
  size?: number;
}) {
  const center = size / 2;
  const radius = size / 2 - 60;
  const step = (2 * Math.PI) / Math.max(domains.length, 1);
  const pointFor = (value: number, index: number) => {
    const angle = index * step - Math.PI / 2;
    const dist = (value / 100) * radius;
    return {
      x: center + dist * Math.cos(angle),
      y: center + dist * Math.sin(angle),
    };
  };

  return (
    <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      {[20, 40, 60, 80, 100].map((level) => (
        <circle
          key={level}
          cx={center}
          cy={center}
          r={(level / 100) * radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={1}
        />
      ))}
      {domains.map((_, i) => {
        const angle = i * step - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        );
      })}
      {series.map((s) => {
        const points = s.values
          .map((v, i) => {
            const p = pointFor(v, i);
            return `${p.x},${p.y}`;
          })
          .join(" ");
        return (
          <polygon
            key={s.name}
            points={points}
            fill={s.color}
            fillOpacity={0.12}
            stroke={s.color}
            strokeWidth={2}
          />
        );
      })}
      {domains.map((d, i) => {
        const angle = i * step - Math.PI / 2;
        const lr = radius + 24;
        const x = center + lr * Math.cos(angle);
        const y = center + lr * Math.sin(angle);
        const label = d.length > 14 ? d.substring(0, 13) + "…" : d;
        return (
          <text
            key={i}
            x={x}
            y={y}
            fontSize={9}
            fontWeight="600"
            textAnchor="middle"
            fill="#334155"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// ---- Linha de evolução do score global (SVG) ----
function ScoreLine({
  points,
  width = 700,
  height = 220,
}: {
  points: { label: string; value: number }[];
  width?: number;
  height?: number;
}) {
  const padL = 36;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const n = Math.max(points.length - 1, 1);
  const coords = points.map((p, i) => ({
    x: padL + (plotW * i) / n,
    y: padT + plotH - (p.value / 100) * plotH,
    ...p,
  }));
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {[0, 25, 50, 75, 100].map((tick) => {
        const y = padT + plotH - (tick / 100) * plotH;
        return (
          <g key={tick}>
            <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#e2e8f0" strokeWidth={1} />
            <text x={padL - 6} y={y + 3} fontSize={9} textAnchor="end" fill="#94a3b8">
              {tick}
            </text>
          </g>
        );
      })}
      <path d={path} fill="none" stroke="#059669" strokeWidth={3} />
      {coords.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={5} fill="#059669" />
          <text x={c.x} y={c.y - 10} fontSize={10} fontWeight="700" textAnchor="middle" fill="#047857">
            {c.value}%
          </text>
          <text x={c.x} y={height - 12} fontSize={9} textAnchor="middle" fill="#64748b">
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ---- Barras de variação por domínio (Inicial vs Final) ----
function DomainVariationBars({
  rows,
  width = 700,
  rowHeight = 30,
}: {
  rows: { domain: string; initial: number; final: number; variation: number }[];
  width?: number;
  rowHeight?: number;
}) {
  if (!rows.length) return null;
  const labelW = 150;
  const valW = 110;
  const barAreaW = width - labelW - valW;
  const maxAbs = Math.max(10, ...rows.map((r) => Math.abs(r.variation)));
  const zeroX = labelW + barAreaW / 2;
  const half = barAreaW / 2;
  const height = rows.length * rowHeight + 20;
  const color = (v: number) => (v > 5 ? "#059669" : v < -5 ? "#dc2626" : "#94a3b8");

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {/* eixo zero */}
      <line x1={zeroX} y1={6} x2={zeroX} y2={height - 14} stroke="#cbd5e1" strokeWidth={1} />
      <text x={zeroX} y={height - 2} fontSize={8} textAnchor="middle" fill="#94a3b8">
        0
      </text>
      {rows.map((r, i) => {
        const cy = 10 + i * rowHeight + rowHeight / 2;
        const len = (Math.abs(r.variation) / maxAbs) * half;
        const barX = r.variation >= 0 ? zeroX : zeroX - len;
        return (
          <g key={r.domain}>
            <text x={labelW - 8} y={cy + 3} fontSize={9} textAnchor="end" fill="#334155" fontWeight="600">
              {r.domain.length > 22 ? r.domain.substring(0, 21) + "…" : r.domain}
            </text>
            <rect
              x={barX}
              y={cy - 8}
              width={Math.max(len, 1)}
              height={16}
              rx={3}
              fill={color(r.variation)}
              fillOpacity={0.85}
            />
            <text
              x={width - 8}
              y={cy + 3}
              fontSize={9}
              textAnchor="end"
              fill={color(r.variation)}
              fontWeight="700"
            >
              {r.initial}% → {r.final}% ({r.variation > 0 ? "+" : ""}{r.variation}%)
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ---- Bloco rótulo + valor para tabelas de identificação ----
const InfoRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div style={{ display: "flex", gap: 6, fontSize: 11, lineHeight: 1.5 }}>
    <span style={{ color: "#64748b", fontWeight: 600, minWidth: 92 }}>{label}:</span>
    <span style={{ color: "#0f172a", fontWeight: 500 }}>{value || "—"}</span>
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = "#6d28d9",
}) => (
  <div
    style={{
      fontSize: 13,
      fontWeight: 800,
      color,
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      borderLeft: `4px solid ${color}`,
      paddingLeft: 8,
    }}
  >
    {children}
  </div>
);

export const EvolutionReportPDF: React.FC<EvolutionReportPDFProps> = ({
  patientName,
  patientAge,
  patientBirthDate,
  evaluations,
  professional,
  signatureBase64,
  stampBase64,
  logoBase64,
  reportCode,
}) => {
  const domains =
    evaluations[0]?.content?.domainScores?.map((d) => d.domain.replace("Domínio ", "")) || [];

  const series = evaluations.map((e, i) => ({
    name: format(new Date(e.date), "dd/MM/yyyy", { locale: ptBR }),
    color: SERIES_COLORS[i % SERIES_COLORS.length],
    meta: resolveEvaluationMeta(e),
    values: (evaluations[0]?.content?.domainScores || []).map((d) => {
      const ds = e.content?.domainScores?.find((x) => x.domain === d.domain);
      return ds?.score || 0;
    }),
  }));

  const linePoints = evaluations.map((e) => ({
    label: format(new Date(e.date), "dd/MM/yy", { locale: ptBR }),
    value: e.content?.overallScore?.percentage || 0,
  }));

  const firstScore = evaluations[0]?.content?.overallScore?.percentage || 0;
  const lastScore = evaluations[evaluations.length - 1]?.content?.overallScore?.percentage || 0;
  const globalVariation = lastScore - firstScore;

  const firstDate = evaluations[0] ? new Date(evaluations[0].date) : null;
  const lastDate = evaluations[evaluations.length - 1]
    ? new Date(evaluations[evaluations.length - 1].date)
    : null;
  const periodMonths =
    firstDate && lastDate
      ? Math.max(
          0,
          Math.round(
            (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
          )
        )
      : 0;

  const tableRows = (evaluations[0]?.content?.domainScores || []).map((d) => {
    const scores = evaluations.map(
      (e) => e.content?.domainScores?.find((x) => x.domain === d.domain)?.score || 0
    );
    return {
      domain: d.domain.replace("Domínio ", ""),
      scores,
      variation: scores[scores.length - 1] - scores[0],
    };
  });

  const varColor = (v: number) => (v > 5 ? "#059669" : v < -5 ? "#dc2626" : "#64748b");
  const varText = (v: number) => (v > 0 ? `+${v}%` : `${v}%`);

  // Análise detalhada centralizada (transições, indicadores, consistência)
  const analysis = buildEvolutionAnalysis(evaluations);

  // Domínios com maior e menor evolução para a narrativa
  const sortedByVar = [...tableRows].sort((a, b) => b.variation - a.variation);
  const topGains = sortedByVar.filter((r) => r.variation > 0).slice(0, 3);
  const declines = sortedByVar.filter((r) => r.variation < 0).slice(-3).reverse();

  const trendText =
    globalVariation > 5
      ? "evolução clínica positiva"
      : globalVariation < -5
      ? "necessidade de revisão do plano terapêutico"
      : "estabilidade do quadro";

  // Veredito objetivo: houve evolução ou não entre as escalas?
  const hasEvolution = globalVariation > 5;
  const hasRegression = globalVariation < -5;
  const improvedDomains = tableRows.filter((r) => r.variation > 5).length;
  const declinedDomains = tableRows.filter((r) => r.variation < -5).length;
  const stableCount = tableRows.length - improvedDomains - declinedDomains;
  const verdict = hasEvolution
    ? {
        title: "HOUVE EVOLUÇÃO",
        color: "#059669",
        bg: "#ecfdf5",
        border: "#a7f3d0",
        text: `Comparando a avaliação inicial (${firstScore}%) com a final (${lastScore}%), houve evolução clínica positiva de ${varText(globalVariation)}.`,
      }
    : hasRegression
    ? {
        title: "NÃO HOUVE EVOLUÇÃO",
        color: "#dc2626",
        bg: "#fef2f2",
        border: "#fecaca",
        text: `Comparando a avaliação inicial (${firstScore}%) com a final (${lastScore}%), observou-se redução de ${varText(globalVariation)}, sem evolução no período.`,
      }
    : {
        title: "QUADRO ESTÁVEL",
        color: "#d97706",
        bg: "#fffbeb",
        border: "#fde68a",
        text: `Comparando a avaliação inicial (${firstScore}%) com a final (${lastScore}%), o quadro manteve-se estável (${varText(globalVariation)}), sem evolução ou redução significativa.`,
      };

  // Linhas de variação por domínio (Inicial vs Final) para o gráfico de barras
  const variationRows = tableRows
    .map((r) => ({
      domain: r.domain,
      initial: r.scores[0] ?? 0,
      final: r.scores[r.scores.length - 1] ?? 0,
      variation: r.variation,
    }))
    .sort((a, b) => b.variation - a.variation);


  const cellStyle: React.CSSProperties = {
    padding: "6px 8px",
    fontSize: 10,
    borderBottom: "1px solid #e2e8f0",
    textAlign: "center",
  };

  const professionalName = professional?.name;

  return (
    <div
      className="musetera-pdf-page"
      style={{
        width: 800,
        padding: 32,
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        fontFamily: "Helvetica, Arial, sans-serif",
        color: "#1e293b",
      }}
    >
      {/* Cabeçalho */}
      <div
        style={{
          borderBottom: "3px solid #7c3aed",
          paddingBottom: 14,
          marginBottom: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {logoBase64 ? (
            <img
              src={logoBase64}
              alt="MuseTera"
              style={{ height: 56, width: "auto", objectFit: "contain", ...crispImg }}
            />
          ) : null}
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#6d28d9" }}>
              Relatório de Evolução do Paciente
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              Escala de Avaliação Musicoterapêutica MuseTera
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 10, color: "#94a3b8" }}>
          <div>Emitido em {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}</div>
          {reportCode ? <div>Documento nº {reportCode}</div> : null}
        </div>
      </div>

      {/* Identificação: Paciente + Profissional */}
      <div style={{ display: "flex", gap: 16, marginBottom: 22 }}>
        <div
          style={{
            flex: 1,
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: "12px 14px",
            backgroundColor: "#f8fafc",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: "#6d28d9", marginBottom: 8 }}>
            DADOS DO PACIENTE
          </div>
          <InfoRow label="Nome" value={patientName} />
          <InfoRow
            label="Idade"
            value={patientAge != null ? `${patientAge} anos` : undefined}
          />
          <InfoRow
            label="Nascimento"
            value={patientBirthDate ? formatBirthDateForDisplay(patientBirthDate) : undefined}
          />
          <InfoRow label="Avaliações" value={`${evaluations.length} registros`} />
          <InfoRow
            label="Período"
            value={
              firstDate && lastDate
                ? `${format(firstDate, "dd/MM/yyyy", { locale: ptBR })} a ${format(
                    lastDate,
                    "dd/MM/yyyy",
                    { locale: ptBR }
                  )}${periodMonths ? ` (${periodMonths} ${periodMonths === 1 ? "mês" : "meses"})` : ""}`
                : undefined
            }
          />
        </div>
        <div
          style={{
            flex: 1,
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: "12px 14px",
            backgroundColor: "#f8fafc",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: "#6d28d9", marginBottom: 8 }}>
            PROFISSIONAL RESPONSÁVEL
          </div>
          <InfoRow label="Nome" value={professionalName} />
          <InfoRow label="Especialidade" value={professional?.specialty} />
          <InfoRow label="Registro" value={professional?.register} />
          <InfoRow label="Associação" value={professional?.association} />
          <InfoRow label="Contato" value={professional?.phone || professional?.email} />
        </div>
      </div>

      {/* Cards das avaliações */}
      <SectionTitle>Resultados por Avaliação</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
        {series.map((s, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 140px",
              border: `1px solid ${s.meta.color}`,
              borderLeft: `5px solid ${s.meta.color}`,
              borderRadius: 8,
              padding: "8px 12px",
              backgroundColor: s.meta.bgColor,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: s.meta.color }}>
              {s.meta.label}
            </div>
            <div style={{ fontSize: 9, color: "#64748b" }}>{s.name}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
              {evaluations[i]?.content?.overallScore?.percentage || 0}%
            </div>
          </div>
        ))}
      </div>

      {/* Score global e variação */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f5f3ff",
          border: "1px solid #ddd6fe",
          borderRadius: 10,
          padding: "12px 18px",
          marginBottom: 22,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700 }}>SCORE GLOBAL</div>
          <div style={{ fontSize: 12, color: "#475569" }}>
            Inicial {firstScore}% → Final {lastScore}%
          </div>
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: varColor(globalVariation),
          }}
        >
          {varText(globalVariation)}
        </div>
      </div>

      {/* Veredito de evolução: houve ou não evolução entre as escalas? */}
      <SectionTitle color={verdict.color}>Veredito da Evolução</SectionTitle>
      <div
        style={{
          backgroundColor: verdict.bg,
          border: `1px solid ${verdict.border}`,
          borderLeft: `6px solid ${verdict.color}`,
          borderRadius: 10,
          padding: "14px 18px",
          marginBottom: 22,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: verdict.color, marginBottom: 6 }}>
          {verdict.title}
        </div>
        <div style={{ fontSize: 11, lineHeight: 1.6, color: "#334155", marginBottom: 10 }}>
          {verdict.text} Dos {tableRows.length} domínios avaliados,{" "}
          <strong style={{ color: "#059669" }}>{improvedDomains} evoluíram</strong>,{" "}
          <strong style={{ color: "#dc2626" }}>{declinedDomains} regrediram</strong> e{" "}
          <strong style={{ color: "#64748b" }}>{stableCount} permaneceram estáveis</strong>.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "Domínios em evolução", value: improvedDomains, color: "#059669" },
            { label: "Domínios em queda", value: declinedDomains, color: "#dc2626" },
            { label: "Domínios estáveis", value: stableCount, color: "#64748b" },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: "#ffffff",
                border: `1px solid ${c.color}33`,
                borderRadius: 8,
                padding: "8px 10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: c.color }}>{c.value}</div>
              <div style={{ fontSize: 8, color: "#64748b" }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      <SectionTitle color="#4338ca">Levantamento de Dados</SectionTitle>
      <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
        {[
          { label: "Score Médio", value: `${analysis.averageScore}%`, sub: `${analysis.stages.length} avaliações`, color: "#4338ca" },
          { label: "Pico", value: `${analysis.peakScore}%`, sub: analysis.peakStage?.meta.shortLabel || "—", color: "#059669" },
          { label: "Evolução Total", value: varText(globalVariation), sub: `${analysis.globalPercentChange > 0 ? "+" : ""}${analysis.globalPercentChange}% relativo`, color: varColor(globalVariation) },
          { label: "Período", value: `${analysis.periodMonths} ${analysis.periodMonths === 1 ? "mês" : "meses"}`, sub: `${analysis.periodDays} dias`, color: "#d97706" },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              border: "1px solid #e2e8f0",
              borderTop: `3px solid ${card.color}`,
              borderRadius: 8,
              padding: "10px 12px",
              backgroundColor: "#f8fafc",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 700, color: card.color, textTransform: "uppercase", letterSpacing: 0.3 }}>
              {card.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>{card.value}</div>
            <div style={{ fontSize: 8, color: "#94a3b8" }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Comparação detalhada entre etapas */}
      {analysis.transitions.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <SectionTitle color="#0891b2">Comparação entre Etapas (Inicial → Final)</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e2e8f0" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th style={{ ...cellStyle, textAlign: "left", fontWeight: 700 }}>Transição</th>
                <th style={{ ...cellStyle, fontWeight: 700 }}>De</th>
                <th style={{ ...cellStyle, fontWeight: 700 }}>Para</th>
                <th style={{ ...cellStyle, fontWeight: 700 }}>Intervalo</th>
                <th style={{ ...cellStyle, fontWeight: 700 }}>Variação</th>
                <th style={{ ...cellStyle, fontWeight: 700 }}>Relativa</th>
              </tr>
            </thead>
            <tbody>
              {analysis.transitions.map((t, i) => (
                <tr key={i}>
                  <td style={{ ...cellStyle, textAlign: "left", fontWeight: 600 }}>
                    {t.from.meta.shortLabel} → {t.to.meta.shortLabel}
                  </td>
                  <td style={cellStyle}>{t.from.score}%</td>
                  <td style={cellStyle}>{t.to.score}%</td>
                  <td style={cellStyle}>{t.daysBetween} dias</td>
                  <td style={{ ...cellStyle, fontWeight: 700, color: varColor(t.variation) }}>
                    {varText(t.variation)}
                  </td>
                  <td style={{ ...cellStyle, color: varColor(t.variation) }}>
                    {t.percentChange > 0 ? "+" : ""}{t.percentChange}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      <div style={{ marginBottom: 8 }}>
        <SectionTitle>Comparação por Domínios</SectionTitle>
        <MultiRadar domains={domains} series={series} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 6 }}>
          {series.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10 }}>
              <span style={{ width: 12, height: 12, backgroundColor: s.color, borderRadius: 2, display: "inline-block" }} />
              <span style={{ color: "#475569" }}>
                {s.meta.shortLabel} ({s.name})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Evolução temporal */}
      <div style={{ marginTop: 22, marginBottom: 8 }}>
        <SectionTitle color="#047857">Evolução do Score Global</SectionTitle>
        <ScoreLine points={linePoints} />
      </div>

      {/* Gráfico de evolução por domínio (Inicial vs Final) */}
      <div style={{ marginTop: 22, marginBottom: 8 }}>
        <SectionTitle color="#7c3aed">Evolução por Domínio (Inicial → Final)</SectionTitle>
        <DomainVariationBars rows={variationRows} />
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 4, fontSize: 9, color: "#64748b" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, backgroundColor: "#059669", borderRadius: 2 }} /> Evolução
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, backgroundColor: "#dc2626", borderRadius: 2 }} /> Redução
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, backgroundColor: "#94a3b8", borderRadius: 2 }} /> Estável
          </span>
        </div>
      </div>


      <div style={{ marginTop: 22 }}>
        <SectionTitle color="#1d4ed8">Análise Comparativa Detalhada</SectionTitle>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e2e8f0" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc" }}>
              <th style={{ ...cellStyle, textAlign: "left", fontWeight: 700 }}>Domínio</th>
              {series.map((s, i) => (
                <th key={i} style={{ ...cellStyle, fontWeight: 700 }}>
                  {s.meta.shortLabel}
                </th>
              ))}
              <th style={{ ...cellStyle, fontWeight: 700 }}>Variação</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.domain}>
                <td style={{ ...cellStyle, textAlign: "left", fontWeight: 600 }}>{row.domain}</td>
                {row.scores.map((sc, i) => (
                  <td key={i} style={cellStyle}>
                    {sc}%
                  </td>
                ))}
                <td style={{ ...cellStyle, fontWeight: 700, color: varColor(row.variation) }}>
                  {varText(row.variation)}
                </td>
              </tr>
            ))}
            <tr style={{ backgroundColor: "#f5f3ff" }}>
              <td style={{ ...cellStyle, textAlign: "left", fontWeight: 800, color: "#6d28d9" }}>
                SCORE GLOBAL
              </td>
              {series.map((s, i) => (
                <td key={i} style={{ ...cellStyle, fontWeight: 800, color: "#6d28d9" }}>
                  {evaluations[i]?.content?.overallScore?.percentage || 0}%
                </td>
              ))}
              <td style={{ ...cellStyle, fontWeight: 800, color: varColor(globalVariation) }}>
                {varText(globalVariation)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Síntese clínica */}
      <div style={{ marginTop: 22 }}>
        <SectionTitle color="#9333ea">Síntese Clínica</SectionTitle>
        <div
          style={{
            fontSize: 11,
            lineHeight: 1.7,
            color: "#334155",
            backgroundColor: "#faf5ff",
            border: "1px solid #f0e7ff",
            borderRadius: 10,
            padding: "12px 16px",
            textAlign: "justify",
          }}
        >
          O paciente <strong>{patientName}</strong> foi acompanhado por meio de{" "}
          {evaluations.length} avaliações pela Escala MuseTera
          {periodMonths
            ? `, ao longo de aproximadamente ${periodMonths} ${
                periodMonths === 1 ? "mês" : "meses"
              }`
            : ""}
          . O score global evoluiu de <strong>{firstScore}%</strong> na avaliação inicial para{" "}
          <strong>{lastScore}%</strong> na avaliação final, representando uma variação de{" "}
          <strong style={{ color: varColor(globalVariation) }}>{varText(globalVariation)}</strong>,
          o que indica <strong>{trendText}</strong>.
          {topGains.length > 0 && (
            <>
              {" "}
              Os domínios com maior progresso foram{" "}
              <strong>
                {topGains
                  .map((d) => `${d.domain} (${varText(d.variation)})`)
                  .join(", ")}
              </strong>
              .
            </>
          )}
          {declines.length > 0 && (
            <>
              {" "}
              Recomenda-se atenção aos domínios{" "}
              <strong>
                {declines
                  .map((d) => `${d.domain} (${varText(d.variation)})`)
                  .join(", ")}
              </strong>
              , que apresentaram redução no período avaliado.
            </>
          )}
        </div>
      </div>

      {/* Assinatura / Carimbo */}
      <div
        style={{
          marginTop: 36,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 48,
        }}
      >
        <div style={{ textAlign: "center", minWidth: 260 }}>
          {signatureBase64 ? (
            <img
              src={signatureBase64}
              alt="Assinatura"
              style={{ maxHeight: 110, maxWidth: 300, objectFit: "contain", margin: "0 auto", ...crispImg }}
            />
          ) : (
            <div style={{ height: 110 }} />
          )}
          <div style={{ borderTop: "1px solid #475569", paddingTop: 4, marginTop: 2 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>
              {professionalName || "Profissional Responsável"}
            </div>
            <div style={{ fontSize: 9, color: "#64748b" }}>
              {[professional?.specialty, professional?.register].filter(Boolean).join(" • ")}
            </div>
          </div>
        </div>
        {stampBase64 ? (
          <img
            src={stampBase64}
            alt="Carimbo"
            style={{ maxHeight: 160, maxWidth: 240, objectFit: "contain", ...crispImg }}
          />
        ) : null}
      </div>

      {/* Rodapé */}
      <div
        style={{
          marginTop: 26,
          paddingTop: 12,
          borderTop: "1px solid #e2e8f0",
          fontSize: 9,
          color: "#94a3b8",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Documento gerado eletronicamente pela plataforma MuseTera —
        Escala de Avaliação Musicoterapêutica.
        <br />
        Este relatório reflete os dados registrados pelo profissional responsável e tem caráter
        de acompanhamento clínico.
      </div>
    </div>
  );
};
