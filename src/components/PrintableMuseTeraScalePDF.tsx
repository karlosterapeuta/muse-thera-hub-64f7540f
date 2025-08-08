import React from 'react';
import { museteraStructure } from "@/data/museteraStructure";

interface PrintableMuseTeraScalePDFProps {
  patientName?: string;
  professionalName?: string;
  evaluationDate?: Date;
}

const cellBox = {
  width: '6mm',
  height: '6mm',
  border: '1px solid #000',
  margin: '0 auto',
} as const;

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  tableLayout: 'fixed' as const,
};

const thtdCommon: React.CSSProperties = {
  border: '1px solid #000',
  padding: '3mm 4mm',
};

const headerCell: React.CSSProperties = {
  ...thtdCommon,
  fontWeight: 700,
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
};

function Lines({ count = 4 }: { count?: number }) {
  return (
    <div style={{ marginTop: '6mm' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ borderBottom: '1px solid #000', height: '8mm', marginBottom: '3mm' }} />
      ))}
    </div>
  );
}

function DomainSection({ title, subdomains, pageBreakBefore = false }: { title: string; subdomains: { title: string; rows: number }[]; pageBreakBefore?: boolean }) {
  return (
    <section
      className={pageBreakBefore ? 'page-break-before' : ''}
      style={{ marginTop: '10mm', ...(pageBreakBefore ? { pageBreakBefore: 'always' as any } : {}) }}>
      <h2 style={{ fontSize: '16px', margin: 0, padding: 0 }}>{title}</h2>
      <p style={{ margin: '2mm 0 4mm 0' }}>Marque um nível (0–5) e registre observações no campo à esquerda.</p>

      {subdomains.map((s, sIdx) => (
        <article key={s.title} style={{ marginTop: sIdx === 0 ? '4mm' : '8mm' }}>
          <h3 style={{ fontSize: '14px', margin: 0, padding: 0 }}>{s.title}</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...headerCell, textAlign: 'left' }}>Parâmetro / Observação</th>
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} style={headerCell}>{i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: s.rows }).map((_, r) => (
                <tr key={r}>
                  <td style={{ ...thtdCommon, height: '10mm' }}>
                    ____________________________________________
                  </td>
                  {Array.from({ length: 6 }).map((_, c) => (
                    <td key={c} style={{ ...thtdCommon, textAlign: 'center' }}>
                      <div style={cellBox} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      ))}

      <div style={{ marginTop: '5mm' }}>
        <strong>Observações do domínio</strong>
        <Lines count={5} />
      </div>
    </section>
  );
}

export const PrintableMuseTeraScalePDF: React.FC<PrintableMuseTeraScalePDFProps> = ({
  patientName,
  professionalName,
  evaluationDate,
}) => {
  const formatDate = (d?: Date) => {
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const domains = museteraStructure;

  return (
    <div style={{ width: '100%' }}>
      <header style={{ textAlign: 'center', marginBottom: '6mm' }}>
        <img
          src="/lovable-uploads/e2913969-bc69-4ab0-b094-391957877d51.png"
          alt="Logo MuseTera"
          style={{ width: '24mm', height: '24mm', objectFit: 'contain', display: 'block', margin: '0 auto 3mm' }}
        />
        <h1 style={{ fontSize: '20px', margin: 0 }}>Escala MuseTera – Formulário de Avaliação Manual</h1>
        <p style={{ margin: '3mm 0 0 0' }}>Preencha manualmente durante a avaliação do paciente.</p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm', marginBottom: '6mm' }}>
        <div>
          <strong>Paciente:</strong>
          <div style={{ borderBottom: '1px solid #000', height: '8mm' }}>{patientName || ''}</div>
        </div>
        <div>
          <strong>Data:</strong>
          <div style={{ borderBottom: '1px solid #000', height: '8mm' }}>{formatDate(evaluationDate)}</div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <strong>Profissional:</strong>
          <div style={{ borderBottom: '1px solid #000', height: '8mm' }}>{professionalName || ''}</div>
        </div>
      </section>

      <section style={{ marginBottom: '6mm' }}>
        <strong>Legenda de Pontuação (0–5):</strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '3mm', marginTop: '3mm' }}>
          {[
            '0 — Ausente',
            '1 — Muito baixo',
            '2 — Baixo',
            '3 — Moderado',
            '4 — Bom',
            '5 — Excepcional',
          ].map((item, idx) => (
            <div key={idx} style={{ border: '1px solid #000', padding: '3mm', textAlign: 'center' }}>{item}</div>
          ))}
        </div>
      </section>

      {domains.map((d, idx) => (
        <DomainSection key={d.title} title={d.title} subdomains={d.subdomains} pageBreakBefore={idx > 0} />
      ))}

      <section className="page-break-before" style={{ marginTop: '8mm', pageBreakBefore: 'always' as any }}>
        <h2 style={{ fontSize: '16px', margin: 0, padding: 0 }}>Resumo de Pontuações por Domínio</h2>
        <table style={{ ...tableStyle, marginTop: '4mm' }}>
          <thead>
            <tr>
              <th style={{ ...headerCell, textAlign: 'left' }}>Domínio</th>
              <th style={headerCell}>Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d) => (
              <tr key={d.title}>
                <td style={{ ...thtdCommon, height: '10mm' }}>{d.title}</td>
                <td style={{ ...thtdCommon, textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', width: '28mm', borderBottom: '1px solid #000' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '6mm' }}>
          <strong>Conclusões e Recomendações</strong>
          <Lines count={8} />
        </div>
      </section>

      <section style={{ marginTop: '10mm' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10mm' }}>
          <div>
            <div style={{ borderBottom: '1px solid #000', height: '8mm' }} />
            <div style={{ marginTop: '2mm', fontSize: '12px' }}><strong>Assinatura do Profissional</strong></div>
          </div>
          <div>
            <div style={{ borderBottom: '1px solid #000', height: '8mm' }} />
            <div style={{ marginTop: '2mm', fontSize: '12px' }}><strong>Assinatura do Responsável/Paciente</strong></div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10mm', marginTop: '8mm' }}>
          <div>
            <div style={{ borderBottom: '1px solid #000', height: '8mm' }} />
            <div style={{ marginTop: '2mm', fontSize: '12px' }}><strong>Carimbo/Registro</strong></div>
          </div>
          <div>
            <div style={{ borderBottom: '1px solid #000', height: '8mm' }} />
            <div style={{ marginTop: '2mm', fontSize: '12px' }}><strong>Local e Data</strong></div>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '8mm', fontSize: '11px', color: '#444' }}>
        <p style={{ margin: 0 }}>
          Observação: Este formulário é destinado ao registro manual da Escala MuseTera e deve ser utilizado por
          profissionais capacitados. Os dados aqui coletados servem como suporte ao acompanhamento terapêutico.
        </p>
      </footer>
    </div>
  );
};

export default PrintableMuseTeraScalePDF;
