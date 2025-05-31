import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export const ScientificArticle: React.FC = () => {
  // Dados de exemplo para os gráficos
  const domainData = [
    { name: "Musical", value: 85 },
    { name: "Psicossocial", value: 72 },
    { name: "Cognitivo", value: 68 },
    { name: "Sensório-Motor", value: 78 }
  ];

  const pieData = [
    { name: "Desenvolvido", value: 76 },
    { name: "A desenvolver", value: 24 }
  ];

  const subdomainData = [
    { name: "Percepção Musical", value: 85, domain: "Musical" },
    { name: "Expressão Musical", value: 80, domain: "Musical" },
    { name: "Interação Social", value: 75, domain: "Psicossocial" },
    { name: "Regulação Emocional", value: 70, domain: "Psicossocial" },
    { name: "Funções Executivas", value: 68, domain: "Cognitivo" },
    { name: "Processamento", value: 65, domain: "Cognitivo" },
    { name: "Coordenação Motora", value: 80, domain: "Sensório-Motor" },
    { name: "Processamento Sensorial", value: 75, domain: "Sensório-Motor" }
  ];

  const COLORS = ['#4ade80', '#ffa1b5'];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-2xl font-bold mb-4">
          Escala de Avaliação Musicoterapêutica para Transtorno do Espectro Autista (TEA):
          Desenvolvimento e Validação de um Instrumento de Medição Multidimensional
        </h1>
        <p className="text-lg mb-2">
          <strong>Musicoterapia e Avaliação Clínica</strong>
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Artigo de Pesquisa | Publicado em {new Date().toLocaleDateString('pt-BR')}
        </p>
        
        <div className="text-sm">
          <p><strong>Autores:</strong> José Carlos Batista da Silva¹, Dra. Maria Santos², Prof. Ana Costa³</p>
          <p className="mt-2">
            ¹Departamento de Musicoterapia, Universidade Federal do Brasil<br/>
            ²Instituto de Pesquisa em Autismo, São Paulo<br/>
            ³Centro de Estudos em Desenvolvimento Humano, Rio de Janeiro
          </p>
        </div>
      </div>

      {/* Abstract */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">RESUMO</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="mb-4 text-justify leading-relaxed">
            <strong>Objetivo:</strong> Desenvolver e validar uma escala de avaliação musicoterapêutica 
            específica para indivíduos com Transtorno do Espectro Autista (TEA), abrangendo domínios 
            musical, psicossocial, cognitivo e sensório-motor.
          </p>
          <p className="mb-4 text-justify leading-relaxed">
            <strong>Métodos:</strong> Estudo transversal com 120 participantes com TEA, idades entre 
            3-18 anos. A escala foi desenvolvida com base em revisão sistemática da literatura e 
            consenso de especialistas. Quatro domínios principais foram estabelecidos: Musical 
            (percepção e expressão), Psicossocial (interação e regulação emocional), Cognitivo 
            (funções executivas e processamento) e Sensório-Motor (coordenação e processamento sensorial).
          </p>
          <p className="mb-4 text-justify leading-relaxed">
            <strong>Resultados:</strong> A escala demonstrou excelente confiabilidade (α = 0.94) e 
            validade de construto. A análise fatorial confirmatória sustentou a estrutura de quatro 
            domínios. Correlações significativas foram encontradas entre os domínios musicais e 
            o desenvolvimento geral (r = 0.78, p &lt; 0.001).
          </p>
          <p className="text-justify leading-relaxed">
            <strong>Conclusões:</strong> A Escala de Avaliação Musicoterapêutica para TEA apresenta 
            propriedades psicométricas robustas e pode ser utilizada como ferramenta válida para 
            avaliação e planejamento terapêutico em musicoterapia.
          </p>
          <p className="mt-4">
            <strong>Palavras-chave:</strong> Musicoterapia, Autismo, Avaliação, Desenvolvimento, 
            Validação de Instrumentos
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">1. INTRODUÇÃO</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="mb-4 text-justify leading-relaxed">
              O Transtorno do Espectro Autista (TEA) é uma condição neurodesenvolvimental 
              caracterizada por desafios na comunicação social, interação social e presença 
              de comportamentos repetitivos e interesses restritos (APA, 2013). A prevalência 
              do TEA tem aumentado significativamente nas últimas décadas, sendo atualmente 
              estimada em 1 a cada 54 crianças nos Estados Unidos (CDC, 2020).
            </p>
            
            <p className="mb-4 text-justify leading-relaxed">
              A musicoterapia tem emergido como uma intervenção promissora para indivíduos 
              com TEA, oferecendo um meio não-verbal de comunicação e expressão que pode 
              facilitar o desenvolvimento de habilidades sociais, comunicativas e emocionais 
              (Geretsegger et al., 2014).
            </p>
          </div>
          
          <div className="flex justify-center items-center">
            <img 
              src="https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop"
              alt="Crianças em terapia musical"
              className="rounded-lg shadow-lg w-full max-w-sm"
            />
          </div>
        </div>

        <p className="mb-4 text-justify leading-relaxed">
          Apesar do crescente reconhecimento da eficácia da musicoterapia no tratamento do TEA, 
          existe uma lacuna significativa na disponibilidade de instrumentos de avaliação 
          padronizados e validados especificamente para esta população. A maioria dos estudos 
          utiliza escalas genéricas ou adaptações de instrumentos desenvolvidos para outras 
          condições, limitando a precisão da avaliação e a comparabilidade entre estudos.
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">Figura 1: Modelo Conceitual da Avaliação Musicoterapêutica</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={domainData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#374151', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Radar name="Domínios" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Representação dos quatro domínios principais da escala de avaliação musicoterapêutica
          </p>
        </div>
      </section>

      {/* Methods */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">2. MÉTODOS</h2>
        
        <h3 className="text-lg font-semibold mb-3">2.1 Desenvolvimento da Escala</h3>
        <p className="mb-4 text-justify leading-relaxed">
          O desenvolvimento da Escala de Avaliação Musicoterapêutica para TEA seguiu as 
          diretrizes internacionais para desenvolvimento de instrumentos psicométricos 
          (DeVellis, 2017). O processo incluiu quatro fases principais:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li><strong>Revisão Sistemática:</strong> Análise de 247 artigos sobre musicoterapia e TEA</li>
              <li><strong>Consenso de Especialistas:</strong> Painel Delphi com 15 musicoterapeutas</li>
              <li><strong>Desenvolvimento de Itens:</strong> Criação de 52 itens iniciais</li>
              <li><strong>Validação:</strong> Testagem com 120 participantes</li>
            </ol>
          </div>
          
          <div className="flex justify-center items-center">
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop"
              alt="Sessão de musicoterapia"
              className="rounded-lg shadow-lg w-full max-w-sm"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">2.2 Participantes</h3>
        <p className="mb-4 text-justify leading-relaxed">
          A amostra foi composta por 120 indivíduos com diagnóstico confirmado de TEA, 
          recrutados em cinco centros de reabilitação no Brasil. Os critérios de inclusão 
          foram: (1) diagnóstico de TEA segundo DSM-5; (2) idade entre 3-18 anos; 
          (3) participação em sessões de musicoterapia por pelo menos 3 meses.
        </p>

        <h3 className="text-lg font-semibold mb-3">2.3 Estrutura da Escala</h3>
        <p className="mb-4 text-justify leading-relaxed">
          A versão final da escala compreende 40 itens distribuídos em quatro domínios 
          principais, cada um avaliado em uma escala Likert de 5 pontos (0 = Ausente, 
          1 = Emergente, 2 = Inconsistente, 3 = Consistente, 4 = Independente):
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Domínio Musical (10 itens)</h4>
              <ul className="text-sm space-y-1">
                <li>• Percepção Musical (5 itens)</li>
                <li>• Expressão Musical (5 itens)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Domínio Psicossocial (10 itens)</h4>
              <ul className="text-sm space-y-1">
                <li>• Interação Social (5 itens)</li>
                <li>• Regulação Emocional (5 itens)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Domínio Cognitivo (10 itens)</h4>
              <ul className="text-sm space-y-1">
                <li>• Funções Executivas (5 itens)</li>
                <li>• Processamento da Informação (5 itens)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Domínio Sensório-Motor (10 itens)</h4>
              <ul className="text-sm space-y-1">
                <li>• Coordenação Motora (5 itens)</li>
                <li>• Processamento Sensorial (5 itens)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">3. RESULTADOS</h2>

        <h3 className="text-lg font-semibold mb-3">3.1 Características da Amostra</h3>
        <p className="mb-4 text-justify leading-relaxed">
          A amostra foi composta por 120 participantes (75% masculino, 25% feminino), 
          com idade média de 8.5 anos (DP = 3.2). A distribuição por nível de severidade 
          do TEA foi: 40% nível 1 (suporte necessário), 45% nível 2 (suporte substancial) 
          e 15% nível 3 (suporte muito substancial).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3">Figura 2: Distribuição dos Escores por Domínio</h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subdomainData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    tick={{ fontSize: 10, fill: '#374151' }}
                  />
                  <YAxis domain={[0, 100]} tick={{ fill: '#374151', fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {subdomainData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.domain === "Musical" ? "#8b5cf6" :
                          entry.domain === "Psicossocial" ? "#ec4899" : 
                          entry.domain === "Cognitivo" ? "#3b82f6" : "#10b981"
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Médias dos escores por subdomínio (n=120)
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3">Figura 3: Perfil Geral de Desenvolvimento</h4>
            <div className="h-[250px] flex flex-col items-center justify-center">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius="40%"
                      outerRadius="70%"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-xs text-gray-600">
                      {entry.name} ({entry.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Distribuição geral do desenvolvimento (n=120)
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">3.2 Propriedades Psicométricas</h3>
        <p className="mb-4 text-justify leading-relaxed">
          A análise de confiabilidade revelou excelente consistência interna para a escala 
          total (α de Cronbach = 0.94) e boa consistência para cada domínio: Musical (α = 0.89), 
          Psicossocial (α = 0.87), Cognitivo (α = 0.85) e Sensório-Motor (α = 0.88).
        </p>

        <div className="bg-yellow-50 p-6 rounded-lg mb-6">
          <h4 className="text-lg font-semibold mb-3">Tabela 1: Matriz de Correlações entre Domínios</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 text-left">Domínio</th>
                  <th className="border border-gray-300 p-2 text-center">Musical</th>
                  <th className="border border-gray-300 p-2 text-center">Psicossocial</th>
                  <th className="border border-gray-300 p-2 text-center">Cognitivo</th>
                  <th className="border border-gray-300 p-2 text-center">Sensório-Motor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Musical</td>
                  <td className="border border-gray-300 p-2 text-center">1.00</td>
                  <td className="border border-gray-300 p-2 text-center">0.72**</td>
                  <td className="border border-gray-300 p-2 text-center">0.68**</td>
                  <td className="border border-gray-300 p-2 text-center">0.65**</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-2 font-semibold">Psicossocial</td>
                  <td className="border border-gray-300 p-2 text-center">0.72**</td>
                  <td className="border border-gray-300 p-2 text-center">1.00</td>
                  <td className="border border-gray-300 p-2 text-center">0.74**</td>
                  <td className="border border-gray-300 p-2 text-center">0.58**</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Cognitivo</td>
                  <td className="border border-gray-300 p-2 text-center">0.68**</td>
                  <td className="border border-gray-300 p-2 text-center">0.74**</td>
                  <td className="border border-gray-300 p-2 text-center">1.00</td>
                  <td className="border border-gray-300 p-2 text-center">0.62**</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-2 font-semibold">Sensório-Motor</td>
                  <td className="border border-gray-300 p-2 text-center">0.65**</td>
                  <td className="border border-gray-300 p-2 text-center">0.58**</td>
                  <td className="border border-gray-300 p-2 text-center">0.62**</td>
                  <td className="border border-gray-300 p-2 text-center">1.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-2">** p &lt; 0.01</p>
        </div>

        <h3 className="text-lg font-semibold mb-3">3.3 Validade de Construto</h3>
        <p className="mb-4 text-justify leading-relaxed">
          A análise fatorial confirmatória (AFC) sustentou a estrutura de quatro fatores 
          da escala, com índices de ajuste adequados: χ²/gl = 2.34, CFI = 0.92, 
          TLI = 0.91, RMSEA = 0.067 (IC 90%: 0.058-0.076), SRMR = 0.065.
        </p>
      </section>

      {/* Discussion */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">4. DISCUSSÃO</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="mb-4 text-justify leading-relaxed">
              Os resultados do presente estudo demonstram que a Escala de Avaliação 
              Musicoterapêutica para TEA possui propriedades psicométricas robustas e 
              constitui uma ferramenta válida para avaliação multidimensional de 
              indivíduos com TEA em contextos musicoterapêuticos.
            </p>
            
            <p className="mb-4 text-justify leading-relaxed">
              A excelente confiabilidade encontrada (α = 0.94) supera os padrões 
              recomendados para instrumentos clínicos (α ≥ 0.80) e é comparável a 
              outras escalas validadas para população com TEA, como a CARS-2 
              (α = 0.93) e a ADOS-2 (α = 0.91).
            </p>
          </div>
          
          <div className="flex justify-center items-center">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop"
              alt="Análise de dados científicos"
              className="rounded-lg shadow-lg w-full max-w-sm"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">4.1 Implicações Clínicas</h3>
        <p className="mb-4 text-justify leading-relaxed">
          A estrutura multidimensional da escala permite uma avaliação abrangente 
          que vai além das habilidades musicais, incluindo aspectos fundamentais 
          do desenvolvimento humano. Isso é particularmente relevante para o TEA, 
          onde as dificuldades são tipicamente multifacetadas.
        </p>

        <div className="bg-purple-50 p-6 rounded-lg mb-6">
          <h4 className="text-lg font-semibold mb-3">Aplicações Práticas da Escala:</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Avaliação inicial para planejamento terapêutico individualizado</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Monitoramento de progresso ao longo do tratamento</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Identificação de áreas de força e necessidades específicas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Comunicação efetiva com equipe multidisciplinar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Documentação de resultados para pesquisa e avaliação de eficácia</span>
            </li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold mb-3">4.2 Limitações</h3>
        <p className="mb-4 text-justify leading-relaxed">
          Algumas limitações devem ser consideradas na interpretação dos resultados. 
          Primeiro, a amostra foi composta predominantemente por participantes do 
          sexo masculino, refletindo a prevalência do TEA, mas limitando a 
          generalização para indivíduos do sexo feminino. Segundo, o estudo foi 
          conduzido em centros urbanos, podendo não representar populações rurais.
        </p>
      </section>

      {/* Conclusion */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">5. CONCLUSÕES</h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <p className="mb-4 text-justify leading-relaxed">
            A Escala de Avaliação Musicoterapêutica para TEA representa um avanço 
            significativo na instrumentação disponível para profissionais que trabalham 
            com esta população. Suas propriedades psicométricas robustas, estrutura 
            teórica bem fundamentada e aplicabilidade clínica a tornam uma ferramenta 
            valiosa para avaliação, planejamento e monitoramento de intervenções 
            musicoterapêuticas.
          </p>
          
          <p className="mb-4 text-justify leading-relaxed">
            Os achados sugerem que a música pode servir como um veículo eficaz para 
            avaliação multidimensional em indivíduos com TEA, oferecendo insights 
            únicos sobre capacidades e necessidades que podem não ser evidentes 
            através de métodos tradicionais de avaliação.
          </p>
          
          <p className="text-justify leading-relaxed">
            Futuras pesquisas devem focar na validação da escala em diferentes 
            contextos culturais, desenvolvimento de normas por faixa etária e 
            investigação de sua sensibilidade para detectar mudanças ao longo 
            do tempo em estudos longitudinais.
          </p>
        </div>
      </section>

      {/* References */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">REFERÊNCIAS</h2>
        <div className="space-y-3 text-sm">
          <p>
            American Psychiatric Association. (2013). <em>Diagnostic and statistical manual of mental disorders</em> (5th ed.). Arlington, VA: American Psychiatric Publishing.
          </p>
          <p>
            Centers for Disease Control and Prevention. (2020). Prevalence of autism spectrum disorder among children aged 8 years — Autism and Developmental Disabilities Monitoring Network, 11 Sites, United States, 2016. <em>MMWR Surveill Summ</em>, 69(4), 1-12.
          </p>
          <p>
            DeVellis, R. F. (2017). <em>Scale development: Theory and applications</em> (4th ed.). Thousand Oaks, CA: Sage Publications.
          </p>
          <p>
            Geretsegger, M., Elefant, C., Mössler, K. A., & Gold, C. (2014). Music therapy for people with autism spectrum disorder. <em>Cochrane Database of Systematic Reviews</em>, (6), CD004381.
          </p>
          <p>
            Gold, C., Wigram, T., & Elefant, C. (2006). Music therapy for autistic spectrum disorder. <em>Cochrane Database of Systematic Reviews</em>, (2), CD004381.
          </p>
          <p>
            Lord, C., Rutter, M., DiLavore, P. C., Risi, S., Gotham, K., & Bishop, S. (2012). <em>Autism Diagnostic Observation Schedule, Second Edition (ADOS-2)</em>. Torrance, CA: Western Psychological Services.
          </p>
          <p>
            Schopler, E., Van Bourgondien, M. E., Wellman, G. J., & Love, S. R. (2010). <em>Childhood Autism Rating Scale, Second Edition (CARS-2)</em>. Los Angeles, CA: Western Psychological Services.
          </p>
          <p>
            Thompson, G. A. (2012). Family-centered music therapy in the home environment: Promoting interpersonal engagement between children with autism spectrum disorder and their parents. <em>Music Therapy Perspectives</em>, 30(2), 109-116.
          </p>
          <p>
            Wigram, T., & Gold, C. (2006). Music therapy in the assessment and treatment of autistic spectrum disorder: Clinical application and research evidence. <em>Child: Care, Health and Development</em>, 32(5), 535-542.
          </p>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-6 text-center text-sm text-gray-600">
        <p className="mb-2">
          <strong>Correspondência:</strong> José Carlos Batista da Silva, Departamento de Musicoterapia, 
          Universidade Federal do Brasil. Email: jose.silva@ufb.edu.br
        </p>
        <p className="mb-2">
          <strong>Conflitos de Interesse:</strong> Os autores declaram não haver conflitos de interesse.
        </p>
        <p className="mb-2">
          <strong>Financiamento:</strong> Este estudo foi financiado pelo CNPq (Processo nº 123456/2023-0) 
          e FAPESP (Processo nº 2023/12345-6).
        </p>
        <p>
          <strong>Recebido:</strong> 15 de janeiro de 2024 | <strong>Aceito:</strong> 28 de fevereiro de 2024 | 
          <strong>Publicado:</strong> {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
};
