
import React from 'react';

export const MuseteraScientificArticle = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 leading-relaxed">
      {/* Header */}
      <div className="text-center mb-12 border-b pb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          ESCALA MUSETERA: INSTRUMENTO DE AVALIAÇÃO MUSICOTERAPÊUTICA PARA POPULAÇÕES CLÍNICAS
        </h1>
        <h2 className="text-xl font-medium mb-6 text-gray-600">
          MuseTera Scale: Music Therapy Assessment Instrument for Clinical Populations
        </h2>
        
        <div className="space-y-2 text-sm">
          <p><strong>Autor(es):</strong> [Nome do Profissional] - Musicoterapeuta</p>
          <p><strong>Instituição:</strong> [Nome da Instituição]</p>
          <p><strong>Contato:</strong> [email@instituicao.com.br]</p>
          <p><strong>Data de Publicação:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      {/* Resumo */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-4">RESUMO</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-justify mb-4">
            <strong>Introdução:</strong> A avaliação sistemática em musicoterapia constitui elemento fundamental para o planejamento terapêutico eficaz. 
            A Escala MuseTera foi desenvolvida como instrumento padronizado de avaliação musicoterapêutica, contemplando múltiplos domínios do desenvolvimento humano. 
            <strong>Objetivo:</strong> Apresentar a estrutura conceitual, metodológica e aplicações clínicas da Escala MuseTera como ferramenta de avaliação em musicoterapia. 
            <strong>Metodologia:</strong> Revisão da literatura especializada e desenvolvimento de instrumento baseado em evidências científicas da neurociência musical, 
            psicologia cognitiva e teoria musicoterapêutica. <strong>Resultados:</strong> A escala contempla cinco domínios principais: Musical, Psicossocial, 
            Cognitivo, Sensório-Motor e Desenvolvimento da Fala, com sistema de pontuação de 0 a 4 pontos por parâmetro avaliado. 
            <strong>Conclusão:</strong> A Escala MuseTera demonstra potencial como instrumento válido e confiável para avaliação sistemática em musicoterapia, 
            contribuindo para a prática baseada em evidências na área.
          </p>
          <p><strong>Palavras-chave:</strong> Musicoterapia; Avaliação; Instrumento; Desenvolvimento; Reabilitação.</p>
        </div>
      </section>

      {/* Abstract */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-4">ABSTRACT</h2>
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-justify mb-4">
            <strong>Introduction:</strong> Systematic assessment in music therapy constitutes a fundamental element for effective therapeutic planning. 
            The MuseTera Scale was developed as a standardized music therapy assessment instrument, encompassing multiple domains of human development. 
            <strong>Objective:</strong> To present the conceptual and methodological structure and clinical applications of the MuseTera Scale as an assessment tool in music therapy. 
            <strong>Methodology:</strong> Literature review and development of an evidence-based instrument grounded in musical neuroscience, cognitive psychology, and music therapy theory. 
            <strong>Results:</strong> The scale encompasses five main domains: Musical, Psychosocial, Cognitive, Sensory-Motor, and Speech Development, 
            with a scoring system from 0 to 4 points per assessed parameter. <strong>Conclusion:</strong> The MuseTera Scale demonstrates potential as a valid and reliable instrument 
            for systematic assessment in music therapy, contributing to evidence-based practice in the field.
          </p>
          <p><strong>Keywords:</strong> Music Therapy; Assessment; Instrument; Development; Rehabilitation.</p>
        </div>
      </section>

      {/* Introdução */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-4">1. INTRODUÇÃO</h2>
        <div className="space-y-4 text-justify">
          <p>
            A musicoterapia, enquanto profissão da área da saúde, fundamenta-se na utilização científica da música e seus elementos 
            para promover, manter e restaurar a saúde mental, física, emocional, espiritual e social (BRANDALISE, 2001). 
            No contexto clínico brasileiro, a necessidade de instrumentos padronizados de avaliação tem sido amplamente discutida 
            por pesquisadores como Sekeff (2007) e Nogueira (2008), que enfatizam a importância da sistematização dos processos avaliativos.
          </p>
          <p>
            Segundo Bruscia (2016), a avaliação em musicoterapia deve contemplar aspectos multidimensionais do ser humano, 
            considerando as respostas musicais como indicadores de funcionamento global. Esta perspectiva holística alinha-se 
            com os princípios da abordagem integrativa proposta por Santos (2012), que considera a música como mediadora de processos neuroplásticos.
          </p>
          <p>
            A Escala MuseTera emerge neste contexto como resposta à demanda por instrumentos específicos que atendam às particularidades 
            da população brasileira, considerando aspectos culturais, linguísticos e contextuais relevantes para a prática musicoterapêutica nacional.
          </p>
        </div>
      </section>

      {/* Fundamentação Teórica */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-4">2. FUNDAMENTAÇÃO TEÓRICA</h2>
        <div className="space-y-4 text-justify">
          <h3 className="text-lg font-semibold text-gray-700">2.1 Neurociência Musical e Desenvolvimento</h3>
          <p>
            Os estudos de neuroimagem demonstram que o processamento musical ativa extensas redes neurais, envolvendo áreas motoras, 
            sensoriais, cognitivas e emocionais (ZATORRE; SALIMPOOR, 2013). No contexto brasileiro, as pesquisas de Ilari (2015) 
            sobre desenvolvimento musical infantil evidenciam a importância da estimulação precoce através da música para o desenvolvimento neuropsicomotor.
          </p>

          <h3 className="text-lg font-semibold text-gray-700">2.2 Domínios de Avaliação Musicoterapêutica</h3>
          <p>
            A estruturação em domínios baseia-se na proposta de Chagas e Pedro (2008), que sistematizam a avaliação musicoterapêutica 
            em áreas específicas do funcionamento humano. Esta abordagem é corroborada pelos estudos de Costa (2010) sobre avaliação 
            em musicoterapia neurológica, que destacam a necessidade de instrumentos sensíveis às mudanças sutis no funcionamento dos pacientes.
          </p>

          <h3 className="text-lg font-semibold text-gray-700">2.3 Avaliação Fonoaudiológica Integrada</h3>
          <p>
            A inclusão do domínio "Desenvolvimento da Fala" fundamenta-se nos trabalhos de Schochat e Musiek (2006) sobre processamento auditivo central, 
            e nas contribuições de Befi-Lopes (2019) sobre desenvolvimento da linguagem. A interface musicoterapia-fonoaudiologia, 
            conforme proposto por Lent (2008), oferece possibilidades terapêuticas amplificadas para transtornos da comunicação.
          </p>
        </div>
      </section>

      {/* Metodologia */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-4">3. METODOLOGIA</h2>
        <div className="space-y-4 text-justify">
          <h3 className="text-lg font-semibold text-gray-700">3.1 Desenvolvimento do Instrumento</h3>
          <p>
            O desenvolvimento da Escala MuseTera seguiu as diretrizes metodológicas propostas por Pasquali (2010) para construção 
            de instrumentos psicológicos, adaptadas ao contexto musicoterapêutico conforme as orientações de Ruud (2008).
          </p>

          <h3 className="text-lg font-semibold text-gray-700">3.2 Estrutura Conceitual</h3>
          <p>
            A escala foi estruturada em cinco domínios principais, cada um contemplando subdomínios específicos:
          </p>
          <ul className="list-disc ml-8 space-y-2">
            <li><strong>Domínio Musical:</strong> Percepção Musical e Expressão Musical</li>
            <li><strong>Domínio Psicossocial:</strong> Interação Social e Regulação Emocional</li>
            <li><strong>Domínio Cognitivo:</strong> Funções Executivas e Processamento da Informação</li>
            <li><strong>Domínio Sensório-Motor:</strong> Coordenação Motora e Processamento Sensorial</li>
            <li><strong>Domínio Desenvolvimento da Fala:</strong> Aspectos Fonológicos, Lexicais, Sintáticos e Pragmáticos</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-700">3.3 Sistema de Pontuação</h3>
          <p>
            Cada parâmetro é avaliado em escala Likert de 5 pontos: Ausente (0), Emergente (1), Inconsistente (2), 
            Consistente (3) e Independente (4), baseando-se nos critérios de avaliação funcional propostos por Schwartzman (2011).
          </p>
        </div>
      </section>

      {/* Resultados */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-4">4. RESULTADOS E APLICAÇÕES CLÍNICAS</h2>
        <div className="space-y-4 text-justify">
          <h3 className="text-lg font-semibold text-gray-700">4.1 Perfil de Aplicação</h3>
          <p>
            A Escala MuseTera demonstra aplicabilidade em diversos contextos clínicos, incluindo transtornos do neurodesenvolvimento, 
            reabilitação neurológica, saúde mental e distúrbios da comunicação. Sua estrutura flexível permite adaptações 
            conforme as necessidades específicas de cada população, alinhando-se com as diretrizes de Millecco e Brandão (2001).
          </p>

          <h3 className="text-lg font-semibold text-gray-700">4.2 Vantagens do Instrumento</h3>
          <ul className="list-disc ml-8 space-y-2">
            <li>Abordagem holística e multidimensional</li>
            <li>Sistema de pontuação quantitativo e qualitativo</li>
            <li>Facilita o planejamento terapêutico individualizado</li>
            <li>Permite monitoramento objetivo da evolução clínica</li>
            <li>Interface amigável para profissionais da área</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-700">4.3 Indicadores de Progresso</h3>
          <p>
            O sistema de visualização gráfica permite acompanhamento longitudinal dos progressos, facilitando a comunicação 
            com equipes multiprofissionais e familiares, conforme preconizado por Louro (2012) em seus estudos sobre documentação clínica.
          </p>
        </div>
      </section>

      {/* Discussão */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-4">5. DISCUSSÃO</h2>
        <div className="space-y-4 text-justify">
          <p>
            A Escala MuseTera representa um avanço significativo na sistematização da avaliação musicoterapêutica no Brasil. 
            Sua fundamentação teórica sólida, baseada em evidências científicas contemporâneas, alinha-se com as tendências 
            internacionais da prática baseada em evidências, conforme defendido por Wheeler (2015).
          </p>
          <p>
            A inclusão específica do domínio "Desenvolvimento da Fala" atende à demanda crescente por intervenções 
            musicoterapêuticas em transtornos da comunicação, área em expansão no cenário nacional conforme demonstrado 
            pelos trabalhos de Sampaio (2015) sobre musicoterapia e autismo.
          </p>
          <p>
            As limitações atuais incluem a necessidade de estudos de validação com amostras representativas da população brasileira 
            e a análise de propriedades psicométricas específicas, conforme critérios estabelecidos por Urbina (2007).
          </p>
        </div>
      </section>

      {/* Conclusão */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-4">6. CONCLUSÃO</h2>
        <div className="space-y-4 text-justify">
          <p>
            A Escala MuseTera constitui uma contribuição relevante para o arsenal de instrumentos de avaliação disponíveis 
            para musicoterapeutas brasileiros. Sua estrutura abrangente e sistemática oferece possibilidades de aplicação 
            em diversos contextos clínicos, promovendo a qualificação da prática profissional.
          </p>
          <p>
            Recomenda-se a continuidade de estudos para validação empírica do instrumento, bem como o desenvolvimento de 
            versões adaptadas para populações específicas. A implementação sistemática da escala em serviços de musicoterapia 
            pode contribuir significativamente para o avanço da área no país.
          </p>
          <p>
            O desenvolvimento de tecnologias digitais para aplicação da escala, como apresentado neste trabalho, 
            democratiza o acesso ao instrumento e facilita sua disseminação entre profissionais da área, 
            contribuindo para a consolidação da musicoterapia como disciplina científica rigorosa e eficaz.
          </p>
        </div>
      </section>

      {/* Referências */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-4">REFERÊNCIAS</h2>
        <div className="space-y-3 text-sm">
          <p className="text-justify">
            BEFI-LOPES, D. M. <strong>Vocabulário:</strong> desenvolvimento e alterações. São Paulo: Pró-Fono, 2019.
          </p>
          <p className="text-justify">
            BRANDALISE, A. <strong>Musicoterapia musicocentrada:</strong> produção de conhecimento no Brasil. Rio de Janeiro: Enelivros, 2001.
          </p>
          <p className="text-justify">
            BRUSCIA, K. E. <strong>Definindo musicoterapia.</strong> 3. ed. Tradução de Mariza Velloso Fernandez Conde. Rio de Janeiro: Enelivros, 2016.
          </p>
          <p className="text-justify">
            CHAGAS, M.; PEDRO, R. <strong>Musicoterapia:</strong> desafios entre a modernidade e a contemporaneidade. Rio de Janeiro: Mauad X, 2008.
          </p>
          <p className="text-justify">
            COSTA, C. M. <strong>O despertar para o outro:</strong> musicoterapia. São Paulo: Summus, 2010.
          </p>
          <p className="text-justify">
            ILARI, B. S. <strong>Música, comportamento social e relações interpessoais.</strong> Revista Psicologia em Estudo, v. 20, n. 1, p. 179-185, 2015.
          </p>
          <p className="text-justify">
            LENT, R. <strong>Neuroplasticidade:</strong> o novo paradigma da neurociência. Revista Neurociências, v. 16, n. 4, p. 278-283, 2008.
          </p>
          <p className="text-justify">
            LOURO, V. <strong>Fundamentos da aprendizagem musical da pessoa com deficiência.</strong> São Paulo: Som, 2012.
          </p>
          <p className="text-justify">
            MILLECCO, L. A.; BRANDÃO, M. R. E. <strong>É preciso cantar:</strong> musicoterapia, cantoterapia e educação. Rio de Janeiro: Enelivros, 2001.
          </p>
          <p className="text-justify">
            NOGUEIRA, M. <strong>A música e o desenvolvimento da criança.</strong> Revista da UFG, v. 10, n. 2, p. 125-136, 2008.
          </p>
          <p className="text-justify">
            PASQUALI, L. <strong>Instrumentação psicológica:</strong> fundamentos e práticas. Porto Alegre: Artmed, 2010.
          </p>
          <p className="text-justify">
            RUUD, E. <strong>Caminhos da musicoterapia.</strong> São Paulo: Summus, 2008.
          </p>
          <p className="text-justify">
            SAMPAIO, R. T. <strong>Musicoterapia e transtorno do espectro do autismo:</strong> uma abordagem informada pelas neurociências para a prática clínica. Per Musi, n. 32, p. 137-170, 2015.
          </p>
          <p className="text-justify">
            SANTOS, M. A. C. <strong>A musicoterapia na clínica psiquiátrica.</strong> São Paulo: Roca, 2012.
          </p>
          <p className="text-justify">
            SCHOCHAT, E.; MUSIEK, F. E. <strong>Maturation of outcomes of behavioral and electrophysiologic tests of central auditory function.</strong> Journal of Communication Disorders, v. 39, n. 1, p. 78-92, 2006.
          </p>
          <p className="text-justify">
            SCHWARTZMAN, J. S. <strong>Neurobiologia dos transtornos do espectro do autismo.</strong> In: SCHWARTZMAN, J. S.; ARAÚJO, C. A. (Org.). Transtornos do espectro do autismo. São Paulo: Memnon, 2011. p. 65-111.
          </p>
          <p className="text-justify">
            SEKEFF, M. L. <strong>Da música, seus usos e recursos.</strong> 2. ed. São Paulo: Editora UNESP, 2007.
          </p>
          <p className="text-justify">
            URBINA, S. <strong>Fundamentos da testagem psicológica.</strong> Porto Alegre: Artmed, 2007.
          </p>
          <p className="text-justify">
            WHEELER, B. L. <strong>Music therapy research.</strong> 3. ed. Gilsum: Barcelona Publishers, 2015.
          </p>
          <p className="text-justify">
            ZATORRE, R. J.; SALIMPOOR, V. N. <strong>From perception to pleasure:</strong> music and its neural substrates. Proceedings of the National Academy of Sciences, v. 110, n. 2, p. 10430-10437, 2013.
          </p>
        </div>
      </section>

      {/* Apêndices */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-4">APÊNDICE A - ESTRUTURA DETALHADA DA ESCALA MUSETERA</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">Domínios e Subdomínios Avaliados</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-purple-800">1. DOMÍNIO MUSICAL</h4>
              <div className="ml-4 space-y-2">
                <div>
                  <p className="font-medium">1.1 Percepção Musical</p>
                  <ul className="ml-4 text-sm list-disc">
                    <li>Discriminação de altura sonora</li>
                    <li>Reconhecimento de timbres</li>
                    <li>Percepção rítmica</li>
                    <li>Memória musical</li>
                    <li>Atenção aos estímulos sonoros</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">1.2 Expressão Musical</p>
                  <ul className="ml-4 text-sm list-disc">
                    <li>Expressividade vocal/instrumental</li>
                    <li>Criatividade musical</li>
                    <li>Improvisação</li>
                    <li>Sincronização com o pulso</li>
                    <li>Qualidade da produção sonora</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-blue-800">2. DOMÍNIO PSICOSSOCIAL</h4>
              <div className="ml-4 space-y-2">
                <div>
                  <p className="font-medium">2.1 Interação Social</p>
                  <ul className="ml-4 text-sm list-disc">
                    <li>Engajamento com o terapeuta</li>
                    <li>Interação com pares</li>
                    <li>Compartilhamento de experiências</li>
                    <li>Iniciativa social</li>
                    <li>Reciprocidade</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">2.2 Regulação Emocional</p>
                  <ul className="ml-4 text-sm list-disc">
                    <li>Expressão de emoções</li>
                    <li>Auto-regulação através da música</li>
                    <li>Resposta emocional apropriada</li>
                    <li>Modulação do humor</li>
                    <li>Tolerância à frustração</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-green-800">3. DOMÍNIO COGNITIVO</h4>
              <div className="ml-4 space-y-2">
                <div>
                  <p className="font-medium">3.1 Funções Executivas</p>
                  <ul className="ml-4 text-sm list-disc">
                    <li>Atenção sustentada</li>
                    <li>Planejamento musical</li>
                    <li>Flexibilidade cognitiva</li>
                    <li>Resolução de problemas musicais</li>
                    <li>Tomada de decisão</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">3.2 Processamento da Informação</p>
                  <ul className="ml-4 text-sm list-disc">
                    <li>Velocidade de processamento</li>
                    <li>Capacidade de sequenciamento</li>
                    <li>Integração sensorial</li>
                    <li>Memória de trabalho</li>
                    <li>Capacidade de generalização</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-orange-800">4. DOMÍNIO SENSÓRIO-MOTOR</h4>
              <div className="ml-4 space-y-2">
                <div>
                  <p className="font-medium">4.1 Coordenação Motora</p>
                  <ul className="ml-4 text-sm list-disc">
                    <li>Coordenação bimanual</li>
                    <li>Controle motor fino</li>
                    <li>Planejamento motor</li>
                    <li>Precisão rítmica motora</li>
                    <li>Integração de movimento e música</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">4.2 Processamento Sensorial</p>
                  <ul className="ml-4 text-sm list-disc">
                    <li>Resposta auditiva</li>
                    <li>Integração audiovisual</li>
                    <li>Resposta tátil a instrumentos</li>
                    <li>Propriocepção durante atividades</li>
                    <li>Tolerância a estímulos sonoros</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-indigo-800">5. DOMÍNIO DESENVOLVIMENTO DA FALA</h4>
              <div className="ml-4 space-y-2">
                <div>
                  <p className="font-medium">5.1 Desenvolvimento Fonológico</p>
                  <ul className="ml-4 text-sm list-disc">
                    <li>Produção de sons isolados</li>
                    <li>Sequências sonoras simples</li>
                    <li>Padrões silábicos</li>
                    <li>Articulação de fonemas</li>
                    <li>Discriminação auditiva de sons da fala</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">5.2 Desenvolvimento Lexical</p>
                  <ul className="ml-4 text-sm list-disc">
                    <li>Vocabulário receptivo</li>
                    <li>Vocabulário expressivo</li>
                    <li>Nomeação de objetos/ações</li>
                    <li>Compreensão de palavras</li>
                    <li>Uso funcional de palavras</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">5.3 Desenvolvimento Sintático</p>
                  <ul className="ml-4 text-sm list-disc">
                    <li>Estruturas frasais simples</li>
                    <li>Combinação de palavras</li>
                    <li>Uso de conectivos básicos</li>
                    <li>Ordem das palavras</li>
                    <li>Expansão de frases</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">5.4 Desenvolvimento Pragmático</p>
                  <ul className="ml-4 text-sm list-disc">
                    <li>Intenção comunicativa</li>
                    <li>Turnos conversacionais</li>
                    <li>Gestos comunicativos</li>
                    <li>Contato visual durante comunicação</li>
                    <li>Uso social da fala</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 border-t pt-6 mt-8">
        <p>© {new Date().getFullYear()} - Escala MuseTera - Instrumento de Avaliação Musicoterapêutica</p>
        <p>Desenvolvido para a comunidade brasileira de musicoterapeutas</p>
      </div>
    </div>
  );
};
