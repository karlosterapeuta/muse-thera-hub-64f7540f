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
  border: '2px solid #D1D5DB',
  borderRadius: '4px',
  margin: '0 auto',
} as const;

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  tableLayout: 'fixed' as const,
};

const thtdCommon: React.CSSProperties = {
  border: '1px solid #E5E7EB',
  padding: '3mm 4mm',
};

const headerCell: React.CSSProperties = {
  ...thtdCommon,
  fontWeight: 600,
  textAlign: 'center',
  backgroundColor: '#F3F4F6',
};

function Lines({ count = 4 }: { count?: number }) {
  return (
    <div style={{ marginTop: '6mm' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ borderBottom: '2px solid #667eea', height: '8mm', marginBottom: '3mm' }} />
      ))}
    </div>
  );
}

function DomainSection({ title, subdomains, pageBreakBefore = false }: { title: string; subdomains: { title: string; rows: number }[]; pageBreakBefore?: boolean }) {
  return (
    <section
      className={pageBreakBefore ? 'page-break-before' : ''}
      style={{ 
        marginTop: '24px',
        padding: '20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        ...(pageBreakBefore ? { pageBreakBefore: 'always' as any } : {}) 
      }}
    >
      {/* Section Header com gradiente */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '6px',
        marginBottom: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ 
          fontSize: '16px', 
          margin: 0, 
          fontWeight: '600',
          letterSpacing: '-0.3px'
        }}>
          {title}
        </h2>
      </div>
      
      <p style={{ 
        margin: '0 0 16px 0',
        fontSize: '12px',
        color: '#6B7280',
        fontStyle: 'italic'
      }}>
        💡 Marque um nível (0–5) para cada parâmetro e registre suas observações
      </p>

      {subdomains.map((s, sIdx) => (
        <article key={s.title} style={{ marginTop: sIdx === 0 ? '0' : '20px' }}>
          <h3 style={{ 
            fontSize: '14px', 
            margin: '0 0 12px 0',
            color: '#374151',
            fontWeight: '600',
            paddingBottom: '8px',
            borderBottom: '2px solid #E5E7EB'
          }}>
            {s.title}
          </h3>
          
          <table style={{
            ...tableStyle,
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ background: 'linear-gradient(to right, #F9FAFB, #F3F4F6)' }}>
                <th style={{ 
                  ...headerCell, 
                  textAlign: 'left',
                  color: '#374151',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Parâmetro / Observação
                </th>
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} style={{
                    ...headerCell,
                    backgroundColor: i === 0 ? '#FEE2E2' : 
                                    i === 1 ? '#FED7AA' : 
                                    i === 2 ? '#FEF3C7' : 
                                    i === 3 ? '#DBEAFE' : 
                                    i === 4 ? '#D1FAE5' : '#A7F3D0',
                    color: '#1F2937',
                    fontWeight: '700',
                    fontSize: '13px'
                  }}>
                    {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: s.rows }).map((_, r) => (
                <tr key={r} style={{ 
                  backgroundColor: r % 2 === 0 ? '#FFFFFF' : '#F9FAFB'
                }}>
                  <td style={{ 
                    ...thtdCommon, 
                    height: '36px',
                    fontSize: '12px',
                    color: '#6B7280'
                  }}>
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

      <div style={{ 
        marginTop: '16px',
        padding: '16px',
        backgroundColor: '#F9FAFB',
        borderRadius: '6px',
        border: '1px solid #E5E7EB'
      }}>
        <strong style={{ 
          fontSize: '13px',
          color: '#374151',
          display: 'block',
          marginBottom: '8px'
        }}>
          📝 Observações Gerais do Domínio
        </strong>
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
    <div style={{ 
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      lineHeight: '1.6',
      color: '#1F2937',
      backgroundColor: '#F3F4F6',
      padding: '24px',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px 30px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ 
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <img
          src="/lovable-uploads/e2913969-bc69-4ab0-b094-391957877d51.png"
          alt="Logo MuseTera"
          style={{ 
            width: '60px', 
            height: '60px', 
            objectFit: 'contain', 
            display: 'block', 
            margin: '0 auto 16px',
            filter: 'brightness(0) invert(1)',
            position: 'relative',
            zIndex: 1
          }}
        />
        
        <h1 style={{ 
          fontSize: '28px', 
          margin: '0 0 8px 0',
          fontWeight: '700',
          letterSpacing: '-0.5px',
          position: 'relative',
          zIndex: 1
        }}>
          Escala MuseTera – Versão Profissional
        </h1>
        
        <p style={{ 
          margin: '0',
          fontSize: '14px',
          opacity: '0.9',
          position: 'relative',
          zIndex: 1
        }}>
          Formulário de Avaliação Manual | Preencha durante a avaliação do paciente
        </p>
      </header>

      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px', 
        marginBottom: '24px',
        padding: '24px',
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        border: '1px solid #E5E7EB'
      }}>
        <div>
          <strong style={{ 
            fontSize: '12px', 
            color: '#6B7280', 
            display: 'block', 
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Paciente
          </strong>
          <div style={{ 
            borderBottom: '2px solid #667eea', 
            height: '32px',
            fontSize: '14px',
            paddingTop: '4px',
            fontWeight: '500'
          }}>
            {patientName || ''}
          </div>
        </div>
        
        <div>
          <strong style={{ 
            fontSize: '12px', 
            color: '#6B7280', 
            display: 'block', 
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Data da Avaliação
          </strong>
          <div style={{ 
            borderBottom: '2px solid #667eea', 
            height: '32px',
            fontSize: '14px',
            paddingTop: '4px',
            fontWeight: '500'
          }}>
            {formatDate(evaluationDate)}
          </div>
        </div>
        
        <div style={{ gridColumn: '1 / -1' }}>
          <strong style={{ 
            fontSize: '12px', 
            color: '#6B7280', 
            display: 'block', 
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Profissional Responsável
          </strong>
          <div style={{ 
            borderBottom: '2px solid #667eea', 
            height: '32px',
            fontSize: '14px',
            paddingTop: '4px',
            fontWeight: '500'
          }}>
            {professionalName || ''}
          </div>
        </div>
      </section>

      <section style={{ 
        marginBottom: '24px',
        padding: '20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <strong style={{ 
          fontSize: '14px',
          color: '#1F2937',
          display: 'block',
          marginBottom: '12px',
          fontWeight: '600'
        }}>
          📊 Legenda de Pontuação (0–5)
        </strong>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(6, 1fr)', 
          gap: '8px'
        }}>
          {[
            { label: '0 — Ausente', color: '#EF4444' },
            { label: '1 — Muito baixo', color: '#F97316' },
            { label: '2 — Baixo', color: '#F59E0B' },
            { label: '3 — Moderado', color: '#3B82F6' },
            { label: '4 — Bom', color: '#10B981' },
            { label: '5 — Excepcional', color: '#059669' },
          ].map((item, idx) => (
            <div 
              key={idx} 
              style={{ 
                border: `2px solid ${item.color}`,
                backgroundColor: `${item.color}15`,
                padding: '12px 8px',
                textAlign: 'center',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '500',
                color: '#1F2937',
                transition: 'transform 0.2s'
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </section>

      {domains.map((d, idx) => (
        <DomainSection key={d.title} title={d.title} subdomains={d.subdomains} pageBreakBefore={idx > 0} />
      ))}

      <section 
        className="page-break-before" 
        style={{ 
          marginTop: '24px',
          padding: '24px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          pageBreakBefore: 'always' as any 
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '16px', 
            margin: 0,
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📊</span>
            Resumo de Pontuações por Domínio
          </h2>
        </div>
        
        <table style={{ 
          ...tableStyle,
          border: '1px solid #E5E7EB',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}>
              <th style={{ 
                ...headerCell, 
                textAlign: 'left',
                color: 'white',
                backgroundColor: 'transparent',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                Domínio
              </th>
              <th style={{ 
                ...headerCell,
                color: 'white',
                backgroundColor: 'transparent',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                Pontuação Total
              </th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d, idx) => (
              <tr key={d.title} style={{ 
                backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB'
              }}>
                <td style={{ 
                  ...thtdCommon, 
                  height: '40px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {d.title}
                </td>
                <td style={{ ...thtdCommon, textAlign: 'center' }}>
                  <div style={{ 
                    display: 'inline-block', 
                    width: '120px',
                    padding: '8px',
                    borderBottom: '2px solid #667eea',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '4px'
                  }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ 
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          border: '1px solid #E5E7EB'
        }}>
          <strong style={{ 
            fontSize: '14px',
            color: '#374151',
            display: 'block',
            marginBottom: '12px',
            fontWeight: '600'
          }}>
            🎯 Conclusões e Recomendações Terapêuticas
          </strong>
          <Lines count={8} />
        </div>
      </section>

      <section style={{ 
        marginTop: '32px',
        padding: '24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '24px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ 
              borderBottom: '2px solid #667eea', 
              height: '40px',
              backgroundColor: '#F9FAFB',
              borderRadius: '4px 4px 0 0'
            }} />
            <div style={{ 
              marginTop: '8px', 
              fontSize: '12px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#374151'
            }}>
              ✍️ Assinatura do Profissional
            </div>
          </div>
          
          <div>
            <div style={{ 
              borderBottom: '2px solid #667eea', 
              height: '40px',
              backgroundColor: '#F9FAFB',
              borderRadius: '4px 4px 0 0'
            }} />
            <div style={{ 
              marginTop: '8px', 
              fontSize: '12px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#374151'
            }}>
              ✍️ Assinatura do Responsável/Paciente
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '24px'
        }}>
          <div>
            <div style={{ 
              borderBottom: '2px solid #667eea', 
              height: '40px',
              backgroundColor: '#F9FAFB',
              borderRadius: '4px 4px 0 0'
            }} />
            <div style={{ 
              marginTop: '8px', 
              fontSize: '12px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#374151'
            }}>
              🏥 Carimbo/Registro Profissional
            </div>
          </div>
          
          <div>
            <div style={{ 
              borderBottom: '2px solid #667eea', 
              height: '40px',
              backgroundColor: '#F9FAFB',
              borderRadius: '4px 4px 0 0'
            }} />
            <div style={{ 
              marginTop: '8px', 
              fontSize: '12px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#374151'
            }}>
              📍 Local e Data
            </div>
          </div>
        </div>
      </section>

      {/* Footer do documento */}
      <footer style={{ 
        marginTop: '32px',
        padding: '20px',
        textAlign: 'center',
        borderTop: '2px solid #E5E7EB',
        backgroundColor: '#F9FAFB',
        borderRadius: '0 0 8px 8px'
      }}>
        <p style={{ 
          margin: '0 0 4px 0',
          fontSize: '11px',
          color: '#6B7280',
          fontWeight: '500'
        }}>
          📄 Documento gerado pela plataforma MuseTera
        </p>
        <p style={{ 
          margin: '0',
          fontSize: '10px',
          color: '#9CA3AF'
        }}>
          Escala desenvolvida para avaliação musicoterapêutica profissional
        </p>
      </footer>
    </div>
  );
};

export default PrintableMuseTeraScalePDF;
