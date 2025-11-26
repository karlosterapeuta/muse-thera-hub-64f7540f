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
  overallScore: {
    percentage: number;
    evaluatedDomains: number;
    totalDomains: number;
    evaluatedParameters: number;
  };
}

export const EvaluationTextPDF: React.FC<EvaluationTextPDFProps> = ({
  content,
  patientName,
  patientAge,
  evaluationDate,
  professionalName,
  professionalRegister,
  digitalSignatureUrl,
  digitalStampUrl,
  overallScore,
}) => {
  return (
    <div 
      id="evaluation-text-pdf" 
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        color: '#1a1a1a',
        fontSize: '11pt',
        lineHeight: '1.6',
      }}
    >
      {/* Cabeçalho */}
      <div style={{ 
        borderBottom: '3px solid #0f766e',
        paddingBottom: '15px',
        marginBottom: '25px',
      }}>
        <h1 style={{
          fontSize: '22pt',
          fontWeight: 'bold',
          color: '#0f766e',
          margin: '0 0 8px 0',
          textAlign: 'center',
        }}>
          RELATÓRIO DE AVALIAÇÃO MUSICOTERAPÊUTICA
        </h1>
        <h2 style={{
          fontSize: '14pt',
          color: '#64748b',
          margin: '0',
          textAlign: 'center',
          fontWeight: 'normal',
        }}>
          Escala MuseTera de Avaliação
        </h2>
      </div>

      {/* Dados do Paciente */}
      <div style={{
        backgroundColor: '#f1f5f9',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '25px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <strong style={{ color: '#0f766e' }}>Paciente:</strong> {patientName}
          </div>
          <div>
            <strong style={{ color: '#0f766e' }}>Idade:</strong> {patientAge ? `${patientAge} anos` : 'Não informada'}
          </div>
          <div>
            <strong style={{ color: '#0f766e' }}>Data da Avaliação:</strong> {evaluationDate}
          </div>
          <div>
            <strong style={{ color: '#0f766e' }}>Pontuação Global:</strong> {overallScore.percentage}%
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <strong style={{ color: '#0f766e' }}>Domínios Avaliados:</strong> {overallScore.evaluatedDomains}/{overallScore.totalDomains}
          <span style={{ marginLeft: '20px' }}>
            <strong style={{ color: '#0f766e' }}>Parâmetros Avaliados:</strong> {overallScore.evaluatedParameters}
          </span>
        </div>
      </div>

      {/* Síntese Geral */}
      <section style={{ marginBottom: '30px' }}>
        <h3 style={{
          fontSize: '14pt',
          fontWeight: 'bold',
          color: '#0f766e',
          borderBottom: '2px solid #cbd5e1',
          paddingBottom: '8px',
          marginBottom: '15px',
        }}>
          1. SÍNTESE GERAL
        </h3>
        <p style={{ 
          textAlign: 'justify',
          marginBottom: '12px',
          lineHeight: '1.8',
        }}>
          {content.sintese_geral}
        </p>
      </section>

      {/* Conquistas Identificadas */}
      {content.conquistas && content.conquistas.por_dominio && content.conquistas.por_dominio.length > 0 && (
        <section style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
          <h3 style={{
            fontSize: '14pt',
            fontWeight: 'bold',
            color: '#0f766e',
            borderBottom: '2px solid #cbd5e1',
            paddingBottom: '8px',
            marginBottom: '15px',
          }}>
            2. CONQUISTAS IDENTIFICADAS
          </h3>
          
          {content.conquistas.introducao && (
            <p style={{ 
              textAlign: 'justify',
              marginBottom: '15px',
              fontStyle: 'italic',
              color: '#475569',
            }}>
              {content.conquistas.introducao}
            </p>
          )}

          {content.conquistas.por_dominio.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '20px',
                paddingLeft: '15px',
                borderLeft: '4px solid #10b981',
              }}
            >
              <h4 style={{
                fontSize: '12pt',
                fontWeight: 'bold',
                color: '#059669',
                marginBottom: '10px',
              }}>
                {item.dominio}
              </h4>
              <p style={{ 
                textAlign: 'justify',
                marginBottom: '10px',
                lineHeight: '1.8',
              }}>
                {item.analise}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Áreas Prioritárias para Desenvolvimento */}
      {content.areas_desenvolvimento && content.areas_desenvolvimento.por_dominio && content.areas_desenvolvimento.por_dominio.length > 0 && (
        <section style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
          <h3 style={{
            fontSize: '14pt',
            fontWeight: 'bold',
            color: '#0f766e',
            borderBottom: '2px solid #cbd5e1',
            paddingBottom: '8px',
            marginBottom: '15px',
          }}>
            3. ÁREAS PRIORITÁRIAS PARA DESENVOLVIMENTO
          </h3>
          
          {content.areas_desenvolvimento.introducao && (
            <p style={{ 
              textAlign: 'justify',
              marginBottom: '15px',
              fontStyle: 'italic',
              color: '#475569',
            }}>
              {content.areas_desenvolvimento.introducao}
            </p>
          )}

          {content.areas_desenvolvimento.por_dominio.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '20px',
                paddingLeft: '15px',
                borderLeft: '4px solid #f59e0b',
              }}
            >
              <h4 style={{
                fontSize: '12pt',
                fontWeight: 'bold',
                color: '#d97706',
                marginBottom: '10px',
              }}>
                {item.dominio}
              </h4>
              <p style={{ 
                textAlign: 'justify',
                marginBottom: '10px',
                lineHeight: '1.8',
              }}>
                {item.analise}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Recomendações Terapêuticas */}
      {content.recomendacoes && content.recomendacoes.length > 0 && (
        <section style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
          <h3 style={{
            fontSize: '14pt',
            fontWeight: 'bold',
            color: '#0f766e',
            borderBottom: '2px solid #cbd5e1',
            paddingBottom: '8px',
            marginBottom: '15px',
          }}>
            4. RECOMENDAÇÕES TERAPÊUTICAS
          </h3>
          <ul style={{ 
            paddingLeft: '25px',
            marginBottom: '0',
          }}>
            {content.recomendacoes.map((rec, index) => (
              <li 
                key={index}
                style={{
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
        <section style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
          <h3 style={{
            fontSize: '14pt',
            fontWeight: 'bold',
            color: '#0f766e',
            borderBottom: '2px solid #cbd5e1',
            paddingBottom: '8px',
            marginBottom: '15px',
          }}>
            5. OBJETIVOS TERAPÊUTICOS SUGERIDOS
          </h3>
          <div style={{ paddingLeft: '15px' }}>
            {content.objetivos.map((obj, index) => (
              <div 
                key={index}
                style={{
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

      {/* Rodapé */}
      <div style={{
        marginTop: '50px',
        paddingTop: '20px',
        borderTop: '2px solid #cbd5e1',
      }}>
        {/* Seção de Assinatura e Carimbo */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 2fr 1fr', 
          gap: '20px', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          {/* Assinatura Digital */}
          <div style={{ textAlign: 'center' }}>
            {digitalSignatureUrl ? (
              <div>
                <img 
                  src={digitalSignatureUrl} 
                  alt="Assinatura Digital" 
                  style={{ 
                    maxWidth: '150px', 
                    maxHeight: '80px', 
                    margin: '0 auto',
                    display: 'block'
                  }} 
                />
                <div style={{ 
                  borderTop: '1px solid #0f766e', 
                  marginTop: '8px', 
                  paddingTop: '4px',
                  fontSize: '9pt',
                  color: '#64748b'
                }}>
                  Assinatura Digital
                </div>
              </div>
            ) : (
              <div style={{ 
                height: '80px',
                display: 'flex',
                alignItems: 'flex-end'
              }}>
                <div style={{ 
                  borderTop: '1px solid #0f766e', 
                  width: '100%',
                  paddingTop: '4px',
                  fontSize: '9pt',
                  color: '#64748b'
                }}>
                  Assinatura
                </div>
              </div>
            )}
          </div>

          {/* Informações do Profissional */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#0f766e', fontSize: '11pt' }}>{professionalName}</strong>
            </div>
            {professionalRegister && (
              <div style={{ fontSize: '10pt', color: '#64748b', marginBottom: '4px' }}>
                <strong>Registro:</strong> {professionalRegister}
              </div>
            )}
            <div style={{ fontSize: '9pt', color: '#64748b', marginTop: '8px' }}>
              Musicoterapeuta
            </div>
          </div>

          {/* Carimbo Digital */}
          <div style={{ textAlign: 'center' }}>
            {digitalStampUrl ? (
              <div>
                <img 
                  src={digitalStampUrl} 
                  alt="Carimbo Digital" 
                  style={{ 
                    maxWidth: '150px', 
                    maxHeight: '150px', 
                    margin: '0 auto',
                    display: 'block'
                  }} 
                />
              </div>
            ) : (
              <div style={{ 
                width: '120px',
                height: '120px',
                border: '2px solid #0f766e',
                borderRadius: '50%',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9pt',
                color: '#64748b'
              }}>
                Carimbo
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center', color: '#64748b', fontSize: '9pt' }}>
          <p style={{ margin: '0' }}>
            Relatório gerado pela Escala MuseTera de Avaliação Musicoterapêutica
          </p>
          <p style={{ margin: '5px 0 0 0' }}>
            Data de emissão: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
};
