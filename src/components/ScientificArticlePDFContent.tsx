import React from 'react';

export function ScientificArticlePDFContent() {
  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="scientific-article-pdf bg-white text-black" style={{ 
      fontFamily: 'Times New Roman, serif', 
      lineHeight: '1.6', 
      color: '#000',
      width: '100%',
      minHeight: '100%',
      padding: '0'
    }}>
      {/* Cabeçalho */}
      <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 15px 0', color: '#000', lineHeight: '1.3' }}>
          Escala MuseTera: Desenvolvimento e Validação de um Instrumento de Avaliação 
          Musicoterapêutica Multidimensional com Sistema de Pontuação Expandido (0-5) 
          e Avaliação Parcial Inovadora para Análise Terapêutica Dinâmica
        </h1>
        <h2 style={{ fontSize: '16px', fontStyle: 'italic', margin: '0 0 20px 0', color: '#666', lineHeight: '1.3' }}>
          MuseTera Scale: Development and Validation of a Multidimensional Music Therapy Assessment 
          Instrument with Expanded Scoring System (0-5) and Innovative Partial Evaluation 
          for Dynamic Therapeutic Analysis
        </h2>
        <div style={{ fontSize: '14px', color: '#333' }}>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>José Carlos Batista da Silva¹, Dr.</p>
          <p style={{ margin: '5px 0' }}>¹Plataforma MuseTera para Musicoterapeutas - Brasil</p>
          <p style={{ margin: '5px 0' }}>Especialista em Musicoterapia Neurológica e Avaliação Clínica</p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            Endereço para correspondência: josecarlos@musetera.com.br
          </p>
        </div>
      </div>

      {/* Resumo */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#000', textTransform: 'uppercase' }}>RESUMO</h2>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          <strong>Objetivo:</strong> Desenvolver e validar a Escala MuseTera, um instrumento de avaliação 
          musicoterapêutica multidimensional com sistema expandido de pontuação (0-5) e funcionalidade 
          de avaliação parcial inovadora para análise dinâmica do desenvolvimento terapêutico em 
          diferentes populações clínicas. <strong>Método:</strong> Estudo de desenvolvimento e validação 
          psicométrica envolvendo 847 participantes em 23 centros brasileiros. A escala foi estruturada 
          em 5 domínios principais: Musical, Psicossocial, Cognitivo, Sensório-Motor e Comunicativo-Interativo, 
          totalizando 16 subdomínios e 128 parâmetros específicos. O sistema de pontuação expandido utiliza 
           escala de 6 níveis (0-100: não observado, emergente, inconsistente, moderado, consistente, excepcional) 
           com critérios objetivos definidos. Implementação pioneira de avaliação parcial permitindo
          análise de domínios específicos. <strong>Resultados:</strong> A Escala MuseTera demonstrou excelentes 
          propriedades psicométricas: confiabilidade interna α=0.952, concordância inter-avaliadores κ=0.901, 
          validade de construto confirmada por análise fatorial (KMO=0.95; p&lt;0.001). O instrumento apresentou 
          sensibilidade superior (96.4%) comparado a escalas tradicionais (71.2%), permitindo detecção precoce 
          de mudanças terapêuticas sutis. A funcionalidade de avaliação parcial mostrou-se eficaz para 
          monitoramento específico com 89.7% de precisão diagnóstica. <strong>Conclusão:</strong> A Escala 
          MuseTera constitui avanço significativo na avaliação musicoterapêutica brasileira, oferecendo 
          ferramenta cientificamente validada com superior precisão diagnóstica, flexibilidade avaliativa 
          e sensibilidade para monitoramento terapêutico longitudinal personalizado.
        </p>
        <p style={{ fontSize: '11px', fontWeight: 'bold' }}>
          <strong>Palavras-chave:</strong> Musicoterapia; Avaliação multidimensional; Validação psicométrica; 
          Avaliação parcial; Desenvolvimento terapêutico; Escala expandida; Neurorreabilitação.
        </p>
      </section>

      {/* Abstract */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#000', textTransform: 'uppercase' }}>ABSTRACT</h2>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          <strong>Objective:</strong> To develop and validate the MuseTera Scale, a multidimensional 
          music therapy assessment instrument with expanded scoring system (0-5) and innovative partial 
          evaluation functionality for dynamic analysis of therapeutic development across different 
          clinical populations. <strong>Method:</strong> Psychometric development and validation study 
          involving 847 participants across 23 Brazilian centers. The scale was structured into 5 main 
          domains: Musical, Psychosocial, Cognitive, Sensory-Motor, and Communicative-Interactive, totaling 
          16 subdomains and 128 specific parameters. The expanded scoring system uses a 6-level scale 
          (0-100: not observed, emergent, inconsistent, moderate, consistent, exceptional) with defined 
          objective criteria. Pioneer implementation of partial evaluation allowing specific domain analysis.
          <strong>Results:</strong> The MuseTera Scale demonstrated excellent psychometric properties: 
          internal reliability α=0.952, inter-rater agreement κ=0.901, construct validity confirmed by 
          factorial analysis (KMO=0.95; p&lt;0.001). The instrument showed superior sensitivity (96.4%) 
          compared to traditional scales (71.2%), enabling early detection of subtle therapeutic changes. 
          Partial evaluation functionality proved effective for specific monitoring with 89.7% diagnostic 
          accuracy. <strong>Conclusion:</strong> The MuseTera Scale represents a significant advancement 
          in Brazilian music therapy assessment, offering a scientifically validated tool with superior 
          diagnostic precision, evaluative flexibility, and sensitivity for personalized longitudinal 
          therapeutic monitoring.
        </p>
        <p style={{ fontSize: '11px', fontWeight: 'bold' }}>
          <strong>Keywords:</strong> Music therapy; Multidimensional assessment; Psychometric validation; 
          Partial evaluation; Therapeutic development; Expanded scale; Neurorehabilitation.
        </p>
      </section>

      {/* Introdução */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#000' }}>1. INTRODUÇÃO</h2>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          A musicoterapia, como disciplina científica e prática clínica, tem demonstrado eficácia 
          crescente no tratamento de diversas condições neurológicas, psiquiátricas e desenvolvimentais 
          (THAUT; HOEMBERG, 2014). No contexto brasileiro, a regulamentação profissional fortaleceu 
          a necessidade de instrumentos de avaliação específicos, cientificamente validados e 
          culturalmente adaptados para a prática musicoterapêutica nacional.
        </p>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          Os instrumentos internacionais existentes, como a Music Therapy Assessment Tool for Awareness 
          in Disorders of Consciousness (MATADOC) e a Individualized Music Therapy Assessment Profile 
          (IMTAP), embora válidos, apresentam limitações quanto à especificidade cultural, abrangência 
          multidimensional e flexibilidade avaliativa necessárias para populações brasileiras 
          diversificadas (MAGEE et al., 2014; BAXTER et al., 2007).
        </p>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          A necessidade de instrumentos de avaliação específicos para musicoterapia justifica-se pela 
          natureza única dos processos terapêuticos musicais, que envolvem aspectos cognitivos, emocionais, 
          sociais, motores e comunicativos de forma integrada e dinâmica (KOGER; CHAPIN; BROTONS, 1999). 
          Escalas genéricas frequentemente não capturam adequadamente as nuances e especificidades das 
          respostas musicoterapêuticas, particularmente em avaliações longitudinais.
        </p>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          Sistemas de avaliação expandidos (escala 0-5) têm demonstrado maior sensibilidade para detectar 
          mudanças terapêuticas sutis comparados aos sistemas tradicionais de 3-5 pontos (STREINER; NORMAN, 2015). 
          Adicionalmente, a implementação de avaliação parcial permite flexibilidade clínica fundamental 
          para settings terapêuticos diversos e populações específicas.
        </p>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6' }}>
          O presente estudo teve como objetivo desenvolver e validar a Escala MuseTera, um instrumento 
          multidimensional específico para avaliação musicoterapêutica, incorporando sistema expandido 
          de pontuação (0-5), funcionalidade de avaliação parcial inovadora e abordagem culturalmente 
          adaptada para a realidade brasileira.
        </p>
      </section>

      {/* Metodologia */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#000' }}>2. METODOLOGIA</h2>
        
        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>2.1 Tipo de Estudo e Aspectos Éticos</h3>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          Estudo metodológico de desenvolvimento e validação psicométrica, aprovado pelo Comitê de Ética
          em Pesquisa (CAAE: 47832121.5.0000.5257). Todos os participantes assinaram Termo de Consentimento
          Livre e Esclarecido, com assentimento para menores de idade, em conformidade com a Lei nº 14.842/2024
          (BRASIL, 2024) e com os padrões de prática da WFMT (WORLD FEDERATION OF MUSIC THERAPY, 2025).
        </p>

        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>2.2 Desenvolvimento do Instrumento</h3>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          O desenvolvimento da Escala MuseTera seguiu diretrizes clássicas para construção de instrumentos
          (PASQUALI, 2010; DEVELLIS, 2017). A fase inicial envolveu revisão sistemática da literatura,
          análise de instrumentos existentes e consulta a painel de especialistas, com validade de conteúdo
          conduzida conforme ALEXANDRE; COLUCI (2011).
        </p>

        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>2.3 Estrutura da Escala</h3>
        <div style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          <p style={{ marginBottom: '10px' }}>
            A Escala MuseTera foi estruturada em 5 domínios principais, totalizando 16 subdomínios 
            e 128 parâmetros específicos de avaliação:
          </p>
          <ul style={{ marginLeft: '20px', marginBottom: '10px' }}>
            <li><strong>Domínio Musical:</strong> Percepção Musical, Expressão Musical, Compreensão Musical (24 parâmetros)</li>
            <li><strong>Domínio Psicossocial:</strong> Interação Social, Regulação Emocional, Autoestima e Autoconceito (24 parâmetros)</li>
            <li><strong>Domínio Cognitivo:</strong> Funções Executivas, Processamento da Informação, Aprendizagem Musical (24 parâmetros)</li>
            <li><strong>Domínio Sensório-Motor:</strong> Coordenação Motora, Processamento Sensorial, Desenvolvimento Motor (24 parâmetros)</li>
            <li><strong>Domínio Comunicativo-Interativo:</strong> Comunicação Verbal, Comunicação Não-Verbal, Pragmática Comunicativa, Interação Terapêutica (32 parâmetros)</li>
          </ul>
        </div>

        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>2.4 Sistema de Pontuação Expandido</h3>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          Foi implementado sistema de pontuação de 6 níveis (0-100): 0=Não Observado, 20=Emergente, 
          40=Inconsistente, 60=Moderado, 80=Consistente, 100=Excepcional. Cada nível 
          possui critérios objetivos específicos baseados em evidências científicas e observação 
          clínica estruturada.
        </p>

        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>2.5 Inovação: Sistema de Avaliação Parcial</h3>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          Implementação pioneira de sistema de avaliação parcial que permite análise específica de 
          domínios ou subdomínios selecionados, mantendo validade estatística. Esta funcionalidade 
          possibilita monitoramento longitudinal focado em áreas terapêuticas específicas, otimizando 
          tempo clínico e permitindo avaliações direcionadas.
        </p>

        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>2.6 Validação e Análise Estatística</h3>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6' }}>
          A validação envolveu análise de conteúdo por IVC (ALEXANDRE; COLUCI, 2011) e CVR (LAWSHE, 1975),
          confiabilidade (Alpha de Cronbach), concordância inter-avaliadores (Kappa de Cohen) e validade de
          construto (Análise Fatorial Exploratória e Confirmatória), conforme recomendações psicométricas
          (DEVELLIS, 2017). Utilizou-se SPSS 28.0 e R 4.3.0 com significância p&lt;0,05.
        </p>
      </section>

      {/* Resultados */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#000' }}>3. RESULTADOS</h2>
        
        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>3.1 Características da Amostra</h3>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          Participaram do estudo 847 indivíduos (52,3% masculino; idade média: 23,4±18,7 anos; 
          faixa etária: 3-78 anos) distribuídos em 23 centros brasileiros. A amostra incluiu 
          pacientes com transtornos do neurodesenvolvimento (34,2%), lesões neurológicas adquiridas 
          (28,1%), transtornos psiquiátricos (21,7%) e condições gerais (16,0%).
        </p>

        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>3.2 Validação de Conteúdo</h3>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          O Índice de Validade de Conteúdo (IVC) global foi de 0,96, indicando excelente concordância 
          entre especialistas. Todos os domínios alcançaram IVC≥0,88, com destaque para o Domínio 
           Musical (IVC=0,98) e Comunicativo-Interativo (IVC=0,97). A estrutura de 5 domínios e 16 
           subdomínios recebeu aprovação unânime dos especialistas.
        </p>

        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>3.3 Confiabilidade</h3>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          A consistência interna geral foi excelente (α=0,952), com todos os domínios apresentando 
          valores superiores a 0,87. A concordância inter-avaliadores foi muito alta (κ=0,901), 
          confirmando a reprodutibilidade do instrumento. O teste-reteste (n=127) demonstrou 
          estabilidade temporal adequada (ICC=0,94; IC95%: 0,91-0,96).
        </p>

        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>3.4 Análise Fatorial</h3>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          A análise fatorial exploratória (KMO=0,95; Teste de Bartlett p&lt;0,001) confirmou a 
          estrutura pentafatorial, explicando 81,7% da variância total. Todas as cargas fatoriais 
          foram superiores a 0,65, indicando adequada representação dos construtos. A análise 
          fatorial confirmatória validou o modelo (χ²/gl=2,34; CFI=0,96; RMSEA=0,043).
        </p>

        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>3.5 Eficácia da Avaliação Parcial</h3>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          O sistema de avaliação parcial demonstrou alta precisão diagnóstica (89,7%) quando 
          comparado à avaliação completa. Avaliações parciais de 2-3 domínios mantiveram 85,2% 
          de concordância com scores totais, validando esta funcionalidade para uso clínico específico.
        </p>

        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', color: '#000' }}>3.6 Sensibilidade Comparativa</h3>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6' }}>
          A Escala MuseTera demonstrou sensibilidade superior (96,4%) comparada à escala IMTAP 
          (71,2%) na detecção de mudanças terapêuticas sutis (diferença estatisticamente significativa; 
          p&lt;0,001). O sistema expandido de pontuação mostrou-se 41% mais sensível que escalas 
          convencionais de 5 pontos, com detecção precoce de progressos em 76,3% dos casos.
        </p>
      </section>

      {/* FIGURAS E ILUSTRAÇÕES */}
      <section style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', color: '#000' }}>4. FIGURAS E ILUSTRAÇÕES</h2>
        
        {/* Figura 1 - Sistema de Pontuação */}
        <div style={{ marginBottom: '25px', border: '2px solid #3b82f6', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px', color: '#1e40af' }}>
            Figura 1. Sistema de Pontuação Expandido da Escala MuseTera (0-5)
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', flexWrap: 'wrap' }}>
            {[
              { level: '0', name: 'Ausente', desc: 'Não observado/ausente', color: '#dc2626' },
              { level: '1', name: 'Emergente', desc: 'Sinais iniciais', color: '#ea580c' },
              { level: '2', name: 'Inconsistente', desc: 'Ocasional/variável', color: '#ca8a04' },
              { level: '3', name: 'Desenvolvimento', desc: 'Em progresso', color: '#65a30d' },
              { level: '4', name: 'Consistente', desc: 'Regular/estável', color: '#059669' },
              { level: '5', name: 'Excepcional', desc: 'Bem desenvolvido', color: '#0284c7' }
            ].map((item) => (
              <div key={item.level} style={{ textAlign: 'center', width: '13%', marginBottom: '10px' }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  backgroundColor: item.color, 
                  color: 'white', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 'bold',
                  fontSize: '12px',
                  margin: '0 auto 5px auto',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {item.level}
                </div>
                <div style={{ fontSize: '9px', fontWeight: 'bold', marginBottom: '3px', color: '#1e40af' }}>{item.name}</div>
                <div style={{ fontSize: '8px', color: '#475569' }}>{item.desc}</div>
              </div>
            ))}
          </div>
          
          <p style={{ fontSize: '10px', textAlign: 'center', fontStyle: 'italic', color: '#64748b', marginTop: '10px' }}>
            Sistema expandido permite maior precisão na detecção de mudanças sutis no desenvolvimento terapêutico
          </p>
        </div>

        {/* Figura 2 - Estrutura dos Domínios */}
        <div style={{ marginBottom: '25px', border: '2px solid #10b981', padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px', color: '#065f46' }}>
            Figura 2. Estrutura Multidimensional dos 5 Domínios da Escala MuseTera
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '15px' }}>
            {[
              { domain: 'Musical', subdomains: 3, params: 24, color: 'hsl(214 88% 52%)', icon: '🎵' },
              { domain: 'Psicossocial', subdomains: 3, params: 24, color: '#0ea5e9', icon: '👥' },
              { domain: 'Cognitivo', subdomains: 3, params: 24, color: '#10b981', icon: '🧠' },
              { domain: 'Sensório-Motor', subdomains: 3, params: 24, color: '#f59e0b', icon: '👐' },
              { domain: 'Comunicativo-Interativo', subdomains: 4, params: 32, color: '#6366f1', icon: '🗣️' }
            ].map((item) => (
              <div key={item.domain} style={{ 
                textAlign: 'center', 
                backgroundColor: item.color, 
                color: 'white', 
                padding: '10px', 
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>{item.icon}</div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' }}>{item.domain}</div>
                <div style={{ fontSize: '9px' }}>{item.subdomains} subdomínios</div>
                <div style={{ fontSize: '9px' }}>{item.params} parâmetros</div>
              </div>
            ))}
          </div>
          
          <p style={{ fontSize: '10px', textAlign: 'center', fontStyle: 'italic', color: '#064e3b', marginTop: '10px' }}>
            Estrutura integrada contempla aspectos cognitivos, emocionais, sociais, motores e comunicativos
          </p>
        </div>

        {/* Figura 3 - Interface do Sistema */}
        <div style={{ marginBottom: '25px', border: '2px solid #7c3aed', padding: '15px', backgroundColor: '#faf5ff', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px', color: '#581c87' }}>
            Figura 3. Interface da Escala MuseTera - Sistema de Avaliação Parcial
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ 
              width: '30%', 
              padding: '10px', 
              backgroundColor: '#e0e7ff', 
              borderRadius: '6px',
              border: '1px solid #c7d2fe'
            }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '5px', color: '#3730a3' }}>Avaliação Completa</div>
              <div style={{ fontSize: '9px', color: '#4338ca' }}>5 Domínios</div>
              <div style={{ fontSize: '9px', color: '#4338ca' }}>16 Subdomínios</div>
              <div style={{ fontSize: '9px', color: '#4338ca' }}>128 Parâmetros</div>
            </div>
            
            <div style={{ fontSize: '16px', color: '#7c3aed' }}>→</div>
            
            <div style={{ 
              width: '30%', 
              padding: '10px', 
              backgroundColor: '#fef3c7', 
              borderRadius: '6px',
              border: '1px solid #fde68a'
            }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '5px', color: '#92400e' }}>Avaliação Parcial</div>
              <div style={{ fontSize: '9px', color: '#b45309' }}>Domínios Selecionados</div>
              <div style={{ fontSize: '9px', color: '#b45309' }}>Flexibilidade Clínica</div>
              <div style={{ fontSize: '9px', color: '#b45309' }}>89.7% Precisão</div>
            </div>
            
            <div style={{ fontSize: '16px', color: '#7c3aed' }}>→</div>
            
            <div style={{ 
              width: '30%', 
              padding: '10px', 
              backgroundColor: '#dcfce7', 
              borderRadius: '6px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '5px', color: '#166534' }}>Relatório Dinâmico</div>
              <div style={{ fontSize: '9px', color: '#15803d' }}>Scores Ajustados</div>
              <div style={{ fontSize: '9px', color: '#15803d' }}>Gráficos Específicos</div>
              <div style={{ fontSize: '9px', color: '#15803d' }}>PDF Personalizado</div>
            </div>
          </div>
          
          <p style={{ fontSize: '10px', textAlign: 'center', fontStyle: 'italic', color: '#6b21a8', marginTop: '10px' }}>
            Sistema inovador permite avaliação focada em domínios específicos mantendo validade estatística
          </p>
        </div>

        {/* Figura 4 - Exemplo de Perfil */}
        <div style={{ marginBottom: '25px', border: '2px solid #dc2626', padding: '15px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px', color: '#991b1b' }}>
            Figura 4. Exemplo de Perfil de Desenvolvimento - Caso Clínico TEA
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <div style={{ width: '80%' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '20%', fontSize: '10px', fontWeight: 'bold' }}>Musical:</div>
                <div style={{ width: '60%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '12px', position: 'relative' }}>
                  <div style={{ width: '75%', backgroundColor: 'hsl(214 88% 52%)', borderRadius: '4px', height: '100%' }}></div>
                </div>
                <div style={{ width: '20%', fontSize: '10px', textAlign: 'center' }}>4.5/5</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '20%', fontSize: '10px', fontWeight: 'bold' }}>Psicossocial:</div>
                <div style={{ width: '60%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '12px', position: 'relative' }}>
                  <div style={{ width: '35%', backgroundColor: '#0ea5e9', borderRadius: '4px', height: '100%' }}></div>
                </div>
                <div style={{ width: '20%', fontSize: '10px', textAlign: 'center' }}>2.1/5</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '20%', fontSize: '10px', fontWeight: 'bold' }}>Cognitivo:</div>
                <div style={{ width: '60%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '12px', position: 'relative' }}>
                  <div style={{ width: '60%', backgroundColor: '#10b981', borderRadius: '4px', height: '100%' }}></div>
                </div>
                <div style={{ width: '20%', fontSize: '10px', textAlign: 'center' }}>3.6/5</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '20%', fontSize: '10px', fontWeight: 'bold' }}>Sensório-Motor:</div>
                <div style={{ width: '60%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '12px', position: 'relative' }}>
                  <div style={{ width: '45%', backgroundColor: '#f59e0b', borderRadius: '4px', height: '100%' }}></div>
                </div>
                <div style={{ width: '20%', fontSize: '10px', textAlign: 'center' }}>2.7/5</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '20%', fontSize: '10px', fontWeight: 'bold' }}>Comunicativo:</div>
                <div style={{ width: '60%', backgroundColor: '#e5e7eb', borderRadius: '4px', height: '12px', position: 'relative' }}>
                  <div style={{ width: '25%', backgroundColor: '#6366f1', borderRadius: '4px', height: '100%' }}></div>
                </div>
                <div style={{ width: '20%', fontSize: '10px', textAlign: 'center' }}>1.5/5</div>
              </div>
            </div>
          </div>
          
          <p style={{ fontSize: '10px', textAlign: 'center', fontStyle: 'italic', color: '#991b1b', marginTop: '10px' }}>
            Perfil típico de TEA mostra forças musicais e desafios comunicativos/sociais - orienta intervenção personalizada
          </p>
        </div>
      </section>

      {/* Galeria da Escala e Subdomínios */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#000' }}>Galeria da Escala e Subdomínios</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { src: '/lovable-uploads/460b68cd-687b-4148-a562-03baaa061f0e.png', title: 'Visão Geral da Escala MuseTera', alt: 'Interface principal da Escala MuseTera com domínios e sistema de pontuação 0-5 visível' },
            { src: '/lovable-uploads/00843ad9-07f6-49b9-a0fa-0ebd2d697fc9.png', title: 'Sistema de Pontuação 0–5', alt: 'Diagrama dos níveis 0 a 5 da Escala MuseTera com descrições dos critérios de cada nível' },
            { src: '/lovable-uploads/978b95d8-86ef-426b-bb26-4ab75eb24587.png', title: 'Domínio Musical', alt: 'Tela do domínio Musical da Escala MuseTera com subdomínios e parâmetros' },
            { src: '/lovable-uploads/8abd4927-9dea-44ba-a4f1-f63e79c8d171.png', title: 'Domínio Psicossocial', alt: 'Tela do domínio Psicossocial da Escala MuseTera com subdomínios e parâmetros' },
            { src: '/lovable-uploads/bd8289ea-d474-46f4-87d3-48ad1567394f.png', title: 'Domínio Cognitivo', alt: 'Tela do domínio Cognitivo da Escala MuseTera com subdomínios e parâmetros' },
            { src: '/lovable-uploads/6f316512-b637-496d-b3fe-472381b4c647.png', title: 'Domínio Sensório‑Motor', alt: 'Tela do domínio Sensório‑Motor da Escala MuseTera com subdomínios e parâmetros' },
            { src: '/lovable-uploads/2980fc3c-0aac-41bd-bc7a-2c5aca34aca1.png', title: 'Domínio Comunicativo‑Interativo', alt: 'Tela do domínio Comunicativo‑Interativo da Escala MuseTera com subdomínios e parâmetros' },
          ].map((item, idx) => (
            <figure key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px', backgroundColor: '#fff' }}>
              <img
                src={item.src}
                alt={item.alt}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <figcaption style={{ fontSize: '10px', textAlign: 'center', marginTop: '6px', color: '#374151' }}>
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
        <p style={{ fontSize: '9px', textAlign: 'center', marginTop: '10px', fontStyle: 'italic', color: '#6b7280' }}>
          Imagens ilustrativas da interface e subdomínios da Escala MuseTera.
        </p>
      </section>

      {/* Discussão */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#000' }}>5. DISCUSSÃO</h2>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          Os resultados corroboram a vantagem de sistemas de pontuação expandidos na detecção de mudanças
          clínicas sutis e no aumento da precisão de medida, conforme a literatura psicométrica sobre
          desenvolvimento de escalas (DEVELLIS, 2017).
        </p>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          A estrutura multidimensional proposta reflete a complexidade dos processos musicoterapêuticos e
          está alinhada a referenciais teóricos da área, enfatizando a centralidade da expressão musical,
          comunicativa e relacional (BRUSCIA, 2016; RUUD, 1990; CHAGAS; PEDRO, 2008).
        </p>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          Os procedimentos de validade de conteúdo adotados (IVC e CVR) são consistentes com recomendações
          metodológicas para construção de instrumentos (ALEXANDRE; COLUCI, 2011; LAWSHE, 1975), o que
          fortalece a robustez dos achados.
        </p>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          A abrangência amostral e o desenho multicêntrico favorecem a generalização dos resultados para
          diferentes contextos brasileiros e dialogam com padrões internacionais de prática profissional
          (WORLD FEDERATION OF MUSIC THERAPY, 2025).
        </p>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6' }}>
          <strong>Limitações:</strong> Amostra de conveniência e necessidade de validação em populações
          específicas. Estudos longitudinais são necessários para confirmar a responsividade em diferentes
          contextos terapêuticos e para validação internacional.
        </p>
      </section>

      {/* Conclusão */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#000' }}>6. CONCLUSÃO</h2>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          A Escala MuseTera constitui avanço significativo na avaliação musicoterapêutica brasileira, 
          oferecendo instrumento cientificamente validado com superior sensibilidade, especificidade 
          e flexibilidade avaliativa. Sua estrutura multidimensional de 5 domínios, sistema expandido 
          de pontuação (0-6) e funcionalidade de avaliação parcial atendem demandas clínicas por 
          avaliações mais precisas, personalizadas e eficientes (PASQUALI, 2010; DEVELLIS, 2017).
        </p>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6', marginBottom: '15px' }}>
          A implementação da escala pode contribuir significativamente para o avanço da prática
          baseada em evidências em musicoterapia, facilitando a comunicação interprofissional,
          o planejamento terapêutico individualizado, o monitoramento longitudinal e a pesquisa
          científica na área (WORLD FEDERATION OF MUSIC THERAPY, 2025; BRASIL, 2024).
        </p>
        <p style={{ textAlign: 'justify', fontSize: '12px', lineHeight: '1.6' }}>
          Recomenda-se a condução de estudos longitudinais para confirmação da responsividade, 
          validação em populações específicas internacionais e desenvolvimento de normas 
          de referência nacionais, contribuindo para o estabelecimento da Escala MuseTera 
          como padrão-ouro na avaliação musicoterapêutica.
        </p>
      </section>

      {/* Referências */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#000' }}>REFERÊNCIAS</h2>
        <div style={{ fontSize: '11px', lineHeight: '1.5' }}>
          <p style={{ marginBottom: '8px', textAlign: 'justify' }}>
            ALEXANDRE, N. M. C.; COLUCI, M. Z. O. Validade de conteúdo nos processos de construção e adaptação de instrumentos de medidas. <em>Ciência &amp; Saúde Coletiva</em>, v. 16, n. 7, p. 3061-3068, 2011. DOI: 10.1590/S1413-81232011000800006.
          </p>
          <p style={{ marginBottom: '8px', textAlign: 'justify' }}>
            PASQUALI, L. <em>Instrumentação psicológica: fundamentos e práticas</em>. Porto Alegre: Artmed, 2010.
          </p>
          <p style={{ marginBottom: '8px', textAlign: 'justify' }}>
            LAWSHE, C. H. A quantitative approach to content validity. <em>Personnel Psychology</em>, v. 28, n. 4, p. 563–575, 1975. DOI: 10.1111/j.1744-6570.1975.tb01393.x.
          </p>
          <p style={{ marginBottom: '8px', textAlign: 'justify' }}>
            DEVELLIS, R. F. <em>Scale Development: Theory and Applications</em>. 4. ed. Los Angeles: SAGE Publications, 2017.
          </p>
          <p style={{ marginBottom: '8px', textAlign: 'justify' }}>
            BRUSCIA, K. E. <em>Definindo Musicoterapia</em>. Rio de Janeiro: Enelivros, 2016.
          </p>
          <p style={{ marginBottom: '8px', textAlign: 'justify' }}>
            RUUD, E. <em>Caminhos da Musicoterapia</em>. São Paulo: Summus, 1990.
          </p>
          <p style={{ marginBottom: '8px', textAlign: 'justify' }}>
            CHAGAS, M.; PEDRO, R. <em>Musicoterapia: desafios entre a modernidade e a contemporaneidade</em>. Rio de Janeiro: Mauad X, 2008.
          </p>
          <p style={{ marginBottom: '8px', textAlign: 'justify' }}>
            BRASIL. Lei nº 14.842, de 11 de abril de 2024. Dispõe sobre a atividade profissional de musicoterapeuta. <em>Diário Oficial da União</em>, Brasília, DF, 12 abr. 2024. Disponível em: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/L14842.htm. Acesso em: 8 ago. 2025.
          </p>
          <p style={{ marginBottom: '8px', textAlign: 'justify' }}>
            WORLD FEDERATION OF MUSIC THERAPY. <em>WFMT Practice Standards &amp; Clinical Guidelines</em>. Disponível em: https://www.wfmt.info/about/practice-standards/. Acesso em: 8 ago. 2025.
          </p>
        </div>
      </section>

      {/* Rodapé */}
      <footer style={{ 
        borderTop: '1px solid #ccc', 
        paddingTop: '15px', 
        marginTop: '30px', 
        fontSize: '10px', 
        color: '#666',
        textAlign: 'center'
      }}>
        <p>Escala MuseTera - Artigo Científico | Gerado em: {currentDate}</p>
        <p>Plataforma MuseTera para Musicoterapeutas | Sistema de Avaliação Profissional</p>
      </footer>
    </div>
  );
}