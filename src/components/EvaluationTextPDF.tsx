import React from 'react';

interface EvaluationTextContent {
  sintese_geral: string;
  conquistas: {
    introducao: string;
    por_dominio: Array<{
      dominio: string;
      analise: string;
    }>;
  };
  areas_desenvolvimento: {
    introducao: string;
    por_dominio: Array<{
      dominio: string;
      analise: string;
    }>;
  };
  recomendacoes: string[];
  objetivos: Array<{
    dominio: string;
    objetivo: string;
  }>;
}

interface EvaluationTextPDFProps {
  content: EvaluationTextContent;
  patientName: string;
  patientAge: number | null;
  evaluationDate: string;
  professionalName: string;
  professionalRegister?: string;
  digitalSignatureUrl?: string;
  digitalStampUrl?: string;
  professionalEmail?: string;
  professionalPhone?: string;
  professionalSpecialty?: string;
  professionalPhotoUrl?: string;
  overallScore: {
    percentage: number;
    evaluatedDomains: number;
    totalDomains: number;
    evaluatedParameters: number;
  };
}

// Largura útil = 210mm (A4) - 2 * 14mm de margem = 182mm.
// Cada [data-pdf-section] usa exatamente essa largura para evitar
// overflow horizontal ao ser capturado pelo generateSectionPdf.
const SECTION_WIDTH = '182mm';

const sectionBase: React.CSSProperties = {
  width: SECTION_WIDTH,
  maxWidth: SECTION_WIDTH,
  boxSizing: 'border-box',
  overflow: 'hidden',
  overflowWrap: 'anywhere',
  wordBreak: 'normal',
  hyphens: 'auto',
  fontFamily: 'Arial, sans-serif',
  color: '#1a1a1a',
  fontSize: '11pt',
  lineHeight: '1.6',
};

const textBlock: React.CSSProperties = {
  overflowWrap: 'anywhere',
  wordBreak: 'normal',
  hyphens: 'auto',
  maxWidth: '100%',
};

export const EvaluationTextPDF: React.FC<EvaluationTextPDFProps> = ({
  content,
  patientName,
  patientAge,
  evaluationDate,
  professionalName,
  professionalRegister,
  digitalSignatureUrl,
  digitalStampUrl,
  professionalEmail,
  professionalPhone,
  professionalSpecialty,
  professionalPhotoUrl,
  overallScore,
}) => {
  return (
    <div
      id="evaluation-text-pdf"
      style={{
        width: '210mm',
        padding: '0',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10mm',
        paddingTop: '10mm',
        paddingBottom: '10mm',
        fontFamily: 'Arial, sans-serif',
        color: '#1a1a1a',
      }}
    >
      {/* Cabeçalho */}
      <div
        data-pdf-section
        style={{
          ...sectionBase,
          borderBottom: '3px solid #0f766e',
          paddingBottom: '15px',
        }}
      >
        <h1
          style={{
            ...textBlock,
            fontSize: '20pt',
            fontWeight: 'bold',
            color: '#0f766e',
            margin: '0 0 8px 0',
            textAlign: 'center',
          }}
        >
          RELATÓRIO DE AVALIAÇÃO MUSICOTERAPÊUTICA
        </h1>
        <h2
          style={{
            ...textBlock,
            fontSize: '13pt',
            color: '#64748b',
            margin: '0',
            textAlign: 'center',
            fontWeight: 'normal',
          }}
        >
          Escala MuseTera de Avaliação
        </h2>
      </div>

      {/* Dados do Paciente */}
      <div
        data-pdf-section
        style={{
          ...sectionBase,
          backgroundColor: '#f1f5f9',
          padding: '15px',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: '10px',
          }}
        >
          <div style={textBlock}>
            <strong style={{ color: '#0f766e' }}>Paciente:</strong> {patientName}
          </div>
          <div style={textBlock}>
            <strong style={{ color: '#0f766e' }}>Idade:</strong>{' '}
            {patientAge ? `${patientAge} anos` : 'Não informada'}
          </div>
          <div style={textBlock}>
            <strong style={{ color: '#0f766e' }}>Data da Avaliação:</strong> {evaluationDate}
          </div>
          <div style={textBlock}>
            <strong style={{ color: '#0f766e' }}>Pontuação Global:</strong>{' '}
            {overallScore.percentage}%
          </div>
        </div>
        <div style={{ ...textBlock, marginTop: '10px' }}>
          <strong style={{ color: '#0f766e' }}>Domínios Avaliados:</strong>{' '}
          {overallScore.evaluatedDomains}/{overallScore.totalDomains}
          <span style={{ marginLeft: '20px' }}>
            <strong style={{ color: '#0f766e' }}>Parâmetros Avaliados:</strong>{' '}
            {overallScore.evaluatedParameters}
          </span>
        </div>
      </div>

      {/* Síntese Geral */}
      <section data-pdf-section style={sectionBase}>
        <h3
          style={{
            ...textBlock,
            fontSize: '14pt',
            fontWeight: 'bold',
            color: '#0f766e',
            borderBottom: '2px solid #cbd5e1',
            paddingBottom: '8px',
            marginBottom: '15px',
          }}
        >
          1. SÍNTESE GERAL
        </h3>
        <p
          style={{
            ...textBlock,
            textAlign: 'justify',
            marginBottom: '12px',
            lineHeight: '1.8',
          }}
        >
          {content.sintese_geral}
        </p>
      </section>

      {/* Conquistas Identificadas */}
      {content.conquistas && content.conquistas.por_dominio && content.conquistas.por_dominio.length > 0 && (
        <section data-pdf-section style={sectionBase}>
          <h3
            style={{
              ...textBlock,
              fontSize: '14pt',
              fontWeight: 'bold',
              color: '#0f766e',
              borderBottom: '2px solid #cbd5e1',
              paddingBottom: '8px',
              marginBottom: '15px',
            }}
          >
            2. CONQUISTAS IDENTIFICADAS
          </h3>

          {content.conquistas.introducao && (
            <p
              style={{
                ...textBlock,
                textAlign: 'justify',
                marginBottom: '15px',
                fontStyle: 'italic',
                color: '#475569',
              }}
            >
              {content.conquistas.introducao}
            </p>
          )}

          {content.conquistas.por_dominio.map((item, index) => (
            <div
              key={index}
              style={{
                ...textBlock,
                marginBottom: '20px',
                paddingLeft: '15px',
                borderLeft: '4px solid #10b981',
              }}
            >
              <h4
                style={{
                  ...textBlock,
                  fontSize: '12pt',
                  fontWeight: 'bold',
                  color: '#059669',
                  marginBottom: '10px',
                }}
              >
                {item.dominio}
              </h4>
              <p
                style={{
                  ...textBlock,
                  textAlign: 'justify',
                  marginBottom: '10px',
                  lineHeight: '1.8',
                }}
              >
                {item.analise}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Áreas Prioritárias para Desenvolvimento */}
      {content.areas_desenvolvimento && content.areas_desenvolvimento.por_dominio && content.areas_desenvolvimento.por_dominio.length > 0 && (
        <section data-pdf-section style={sectionBase}>
          <h3
            style={{
              ...textBlock,
              fontSize: '14pt',
              fontWeight: 'bold',
              color: '#0f766e',
              borderBottom: '2px solid #cbd5e1',
              paddingBottom: '8px',
              marginBottom: '15px',
            }}
          >
            3. ÁREAS PRIORITÁRIAS PARA DESENVOLVIMENTO
          </h3>

          {content.areas_desenvolvimento.introducao && (
            <p
              style={{
                ...textBlock,
                textAlign: 'justify',
                marginBottom: '15px',
                fontStyle: 'italic',
                color: '#475569',
              }}
            >
              {content.areas_desenvolvimento.introducao}
            </p>
          )}

          {content.areas_desenvolvimento.por_dominio.map((item, index) => (
            <div
              key={index}
              style={{
                ...textBlock,
                marginBottom: '20px',
                paddingLeft: '15px',
                borderLeft: '4px solid #f59e0b',
              }}
            >
              <h4
                style={{
                  ...textBlock,
                  fontSize: '12pt',
                  fontWeight: 'bold',
                  color: '#d97706',
                  marginBottom: '10px',
                }}
              >
                {item.dominio}
              </h4>
              <p
                style={{
                  ...textBlock,
                  textAlign: 'justify',
                  marginBottom: '10px',
                  lineHeight: '1.8',
                }}
              >
                {item.analise}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Recomendações Terapêuticas */}
      {content.recomendacoes && content.recomendacoes.length > 0 && (
        <section data-pdf-section style={sectionBase}>
          <h3
            style={{
              ...textBlock,
              fontSize: '14pt',
              fontWeight: 'bold',
              color: '#0f766e',
              borderBottom: '2px solid #cbd5e1',
              paddingBottom: '8px',
              marginBottom: '15px',
            }}
          >
            4. RECOMENDAÇÕES TERAPÊUTICAS
          </h3>
          <ul
            style={{
              paddingLeft: '25px',
              marginBottom: '0',
            }}
          >
            {content.recomendacoes.map((rec, index) => (
              <li
                key={index}
                style={{
                  ...textBlock,
                  marginBottom: '10px',
                  textAlign: 'justify',
                  lineHeight: '1.8',
                }}
              >
                {rec}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Objetivos Terapêuticos Sugeridos */}
      {content.objetivos && content.objetivos.length > 0 && (
        <section data-pdf-section style={sectionBase}>
          <h3
            style={{
              ...textBlock,
              fontSize: '14pt',
              fontWeight: 'bold',
              color: '#0f766e',
              borderBottom: '2px solid #cbd5e1',
              paddingBottom: '8px',
              marginBottom: '15px',
            }}
          >
            5. OBJETIVOS TERAPÊUTICOS SUGERIDOS
          </h3>
          <div style={{ paddingLeft: '15px' }}>
            {content.objetivos.map((obj, index) => (
              <div
                key={index}
                style={{
                  ...textBlock,
                  marginBottom: '12px',
                  paddingLeft: '10px',
                }}
              >
                <strong style={{ color: '#0f766e' }}>{obj.dominio}:</strong>{' '}
                <span style={{ textAlign: 'justify' }}>{obj.objetivo}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rodapé Profissional */}
      <div
        data-pdf-section
        style={{
          ...sectionBase,
          marginTop: '10px',
          border: '2px solid #14b8a6',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 8px 24px rgba(13, 148, 136, 0.15)',
        }}
      >
        <div
          style={{
            height: '8px',
            background: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)',
          }}
        />

        <div style={{ padding: '20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              gap: '20px',
              alignItems: 'start',
            }}
          >
            {/* Signature Card (Left) */}
            <div
              style={{
                ...textBlock,
                background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)',
                border: '2px solid #14b8a6',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(20,184,166,0.15)',
              }}
            >
              <div
                style={{
                  height: '6px',
                  background: 'linear-gradient(to right, #0d9488, #14b8a6, #06b6d4)',
                }}
              />

              <div style={{ padding: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  {professionalPhotoUrl && (
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        flexShrink: 0,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid #14b8a6',
                      }}
                    >
                      <img
                        src={professionalPhotoUrl}
                        alt="Professional"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          maxWidth: '100%',
                          display: 'block',
                        }}
                      />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        ...textBlock,
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#0f766e',
                        marginBottom: '6px',
                        lineHeight: '1.3',
                      }}
                    >
                      {professionalName}
                    </div>

                    <div
                      style={{
                        backgroundColor: '#ccfbf1',
                        border: '1px solid #99f6e4',
                        borderRadius: '20px',
                        padding: '3px 10px',
                        display: 'inline-block',
                      }}
                    >
                      <span style={{ fontSize: '10px', color: '#0f766e', fontWeight: 600 }}>
                        {professionalSpecialty || 'Musicoterapeuta'}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    ...textBlock,
                    fontSize: '11px',
                    color: '#374151',
                    lineHeight: '1.6',
                  }}
                >
                  {professionalRegister && (
                    <div style={{ ...textBlock, marginBottom: '3px' }}>
                      {professionalRegister}
                    </div>
                  )}
                  {professionalEmail && (
                    <div style={{ ...textBlock, marginBottom: '3px' }}>
                      {professionalEmail}
                    </div>
                  )}
                  {professionalPhone && <div style={textBlock}>{professionalPhone}</div>}
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid #99f6e4',
                  background: 'linear-gradient(to right, #f0fdfa, #ecfeff, #f0fdfa)',
                  padding: '10px 12px',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    ...textBlock,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#0f766e',
                  }}
                >
                  Assinatura Digital Verificada — MuseTera
                </span>
              </div>
            </div>

            {/* Stamp (Right) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 0,
              }}
            >
              {digitalStampUrl ? (
                <>
                  <div
                    style={{
                      width: '200px',
                      maxWidth: '100%',
                      height: '200px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)',
                      border: '4px solid #14b8a6',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '14px',
                      boxSizing: 'border-box',
                      boxShadow:
                        '0 8px 24px rgba(20,184,166,0.2), inset 0 2px 8px rgba(20,184,166,0.1)',
                    }}
                  >
                    {professionalPhotoUrl && (
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: '3px solid #14b8a6',
                          marginBottom: '8px',
                        }}
                      >
                        <img
                          src={professionalPhotoUrl}
                          alt="Professional"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            maxWidth: '100%',
                            display: 'block',
                          }}
                        />
                      </div>
                    )}

                    <div
                      style={{
                        ...textBlock,
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#0f766e',
                        textAlign: 'center',
                        marginBottom: '6px',
                        lineHeight: '1.2',
                      }}
                    >
                      {professionalName}
                    </div>

                    <div
                      style={{
                        width: '60px',
                        height: '2px',
                        background:
                          'linear-gradient(to right, transparent, #14b8a6, transparent)',
                        marginBottom: '6px',
                      }}
                    />

                    <div
                      style={{
                        backgroundColor: '#ccfbf1',
                        border: '1px solid #99f6e4',
                        borderRadius: '14px',
                        padding: '3px 10px',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontSize: '9px', color: '#0f766e', fontWeight: 600 }}>
                        {professionalSpecialty || 'Musicoterapeuta'}
                      </span>
                    </div>

                    {professionalRegister && (
                      <div
                        style={{
                          ...textBlock,
                          fontSize: '10px',
                          color: '#374151',
                          fontWeight: 600,
                          textAlign: 'center',
                        }}
                      >
                        {professionalRegister}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: '12px',
                      background: 'linear-gradient(135deg, #0d9488, #0891b2)',
                      color: '#ffffff',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}
                  >
                    MuseTera Verified
                  </div>
                </>
              ) : (
                <div
                  style={{
                    width: '200px',
                    maxWidth: '100%',
                    height: '200px',
                    border: '3px dashed #14b8a6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    color: '#6b7280',
                    backgroundColor: '#f0fdfa',
                    boxSizing: 'border-box',
                  }}
                >
                  Carimbo Digital
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
