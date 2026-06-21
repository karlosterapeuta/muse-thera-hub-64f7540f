import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { resolveEvaluationMeta } from "@/utils/evaluationTypes";

interface EvolutionReportPDFProps {
  patientName: string;
  patientAge?: number;
  evaluations: SavedEvaluation[]; // já ordenadas por data ascendente
  professionalName?: string;
}

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
  width = 640,
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

export const EvolutionReportPDF: React.FC<EvolutionReportPDFProps> = ({
  patientName,
  patientAge,
  evaluations,
  professionalName,
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

  const cellStyle: React.CSSProperties = {
    padding: "6px 8px",
    fontSize: 10,
    borderBottom: "1px solid #e2e8f0",
    textAlign: "center",
  };

  return (
    <div
      className="musetera-pdf-page"
      style={{
        width: 800,
        padding: 28,
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
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, color: "#6d28d9" }}>
          Relatório de Evolução do Paciente
        </div>
        <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
          {patientName}
          {patientAge ? ` • ${patientAge} anos` : ""}
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
          Comparação da Avaliação Inicial até a Avaliação Final • Gerado em{" "}
          {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}
        </div>
      </div>

      {/* Cards das avaliações */}
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

      {/* Radar comparativo */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#6d28d9", marginBottom: 8 }}>
          Comparação por Domínios
        </div>
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
        <div style={{ fontSize: 14, fontWeight: 700, color: "#047857", marginBottom: 8 }}>
          Evolução do Score Global
        </div>
        <ScoreLine points={linePoints} />
      </div>

      {/* Tabela comparativa */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1d4ed8", marginBottom: 8 }}>
          Análise Comparativa Detalhada
        </div>
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

      {/* Rodapé */}
      <div
        style={{
          marginTop: 26,
          paddingTop: 12,
          borderTop: "1px solid #e2e8f0",
          fontSize: 10,
          color: "#94a3b8",
          textAlign: "center",
        }}
      >
        {professionalName ? `${professionalName} • ` : ""}MuseTera — Escala de Avaliação Musicoterapêutica
      </div>
    </div>
  );
};
