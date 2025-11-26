interface DevolutivaPreviewPDFProps {
  data: {
    patient_name: string;
    session_date: string;
    session_number: number;
    communication: string;
    emotional_regulation: string;
    motor_development: string;
    sensory_aspects: string;
    musical_participation: string;
    achievements: string;
    family_guidelines: string;
    next_steps: string;
    general_observations: string;
    challenges_resistance: string;
    professional_name: string;
    professional_registry: string;
    digital_signature_url?: string;
    digital_stamp_url?: string;
  };
}

export function DevolutivaPreviewPDF({ data }: DevolutivaPreviewPDFProps) {
  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '32px',
    fontFamily: 'Arial, sans-serif',
    color: '#000000'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#000000'
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
    pageBreakInside: 'avoid'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const contentStyle: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#000000',
    paddingLeft: '32px'
  };

  const separatorStyle: React.CSSProperties = {
    height: '2px',
    backgroundColor: '#e5e7eb',
    margin: '24px 0',
    border: 'none'
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '32px',
    fontSize: '14px',
    color: '#000000'
  };

  const sections = [
    { title: 'Comunicação e Interação', icon: '💬', content: data.communication },
    { title: 'Regulação Emocional', icon: '❤️', content: data.emotional_regulation },
    { title: 'Desenvolvimento Motor', icon: '🤸', content: data.motor_development },
    { title: 'Aspectos Sensoriais', icon: '🎵', content: data.sensory_aspects },
    { title: 'Participação Musical', icon: '🎼', content: data.musical_participation },
    { title: 'Conquistas da Sessão', icon: '🎯', content: data.achievements },
    { title: 'Orientações para Família', icon: '👨‍👩‍👧‍👦', content: data.family_guidelines },
    { title: 'Próximos Passos', icon: '🔜', content: data.next_steps },
    { title: 'Observações Gerais', icon: '📝', content: data.general_observations },
    { title: 'Desafios e Resistências', icon: '⚠️', content: data.challenges_resistance }
  ];

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎵</div>
        <h1 style={titleStyle}>DEVOLUTIVA MUSICOTERAPIA</h1>
        <div style={{ fontSize: '14px', color: '#4b5563' }}>
          <p><strong>Paciente:</strong> {data.patient_name}</p>
          <p><strong>Data:</strong> {new Date(data.session_date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Sessão #:</strong> {data.session_number}</p>
        </div>
      </div>

      <hr style={separatorStyle} />

      {/* Sections */}
      <div>
        {sections.map((section) => (
          section.content && (
            <div key={section.title} style={sectionStyle}>
              <div style={sectionTitleStyle}>
                <span style={{ fontSize: '20px' }}>{section.icon}</span>
                <span>{section.title}</span>
              </div>
              <p style={contentStyle}>{section.content}</p>
            </div>
          )
        ))}
      </div>

      <hr style={separatorStyle} />

      {/* Footer */}
      <div style={footerStyle}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '40px',
          marginTop: '20px'
        }}>
          {/* Assinatura */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            {data.digital_signature_url ? (
              <img 
                src={data.digital_signature_url} 
                alt="Assinatura Digital" 
                style={{ 
                  maxHeight: '80px',
                  maxWidth: '200px',
                  objectFit: 'contain',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            ) : (
              <div style={{ 
                borderTop: '1px solid #000',
                paddingTop: '8px',
                marginTop: '50px'
              }}>
                <span style={{ fontSize: '11px', color: '#666' }}>
                  Assinatura
                </span>
              </div>
            )}
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                {data.professional_name}
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                {data.professional_registry}
              </div>
            </div>
          </div>

          {/* Carimbo */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            {data.digital_stamp_url ? (
              <img 
                src={data.digital_stamp_url} 
                alt="Carimbo Digital" 
                style={{ 
                  maxHeight: '120px',
                  maxWidth: '200px',
                  objectFit: 'contain',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '32px', 
        padding: '16px', 
        backgroundColor: '#dbeafe', 
        borderRadius: '8px',
        border: '2px solid #93c5fd'
      }}>
        <p style={{ fontSize: '12px', color: '#4b5563', textAlign: 'center', fontStyle: 'italic' }}>
          A música é uma ponte que conecta, desenvolve e transforma. Continuemos juntos nesta jornada! 🎵
        </p>
      </div>
    </div>
  );
}
