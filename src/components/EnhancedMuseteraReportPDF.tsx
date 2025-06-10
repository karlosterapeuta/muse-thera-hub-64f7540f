
import React from 'react';
import { Card } from "@/components/ui/card";
import { StaticChart } from './StaticChart';
import { format } from 'date-fns';

interface EnhancedMuseteraReportPDFProps {
  categoryData: any[];
  pieData: any[];
  patientName?: string;
  evaluatorName?: string;
  evaluatorEmail?: string;
  radarData?: any[];
  selectedParameters?: any;
  overallScore?: {
    raw: number;
    max: number;
    percentage: number;
  };
  evaluationDomains?: any[];
  evaluationDate?: Date;
  patientData?: {
    age?: number;
    birthDate?: string;
    diagnosis?: string;
    medications?: string;
    musicalPreferences?: string;
    previousTherapies?: string;
    familyHistory?: string;
    developmentConcerns?: string;
  };
}

export const EnhancedMuseteraReportPDF: React.FC<EnhancedMuseteraReportPDFProps> = ({
  categoryData,
  pieData,
  patientName,
  evaluatorName,
  evaluatorEmail,
  radarData,
  selectedParameters,
  overallScore,
  evaluationDomains,
  evaluationDate,
  patientData
}) => {
  const COLORS = ['#4ade80', '#ffa1b5'];

  const getInterpretation = (percentage: number) => {
    if (percentage >= 85) return {
      level: "EXCELENTE",
      description: "Desenvolvimento excepcional com habilidades bem estabelecidas",
      prognosis: "Excelente prognóstico com manutenção das conquistas",
      color: "#22c55e"
    };
    if (percentage >= 70) return {
      level: "BOM",
      description: "Desenvolvimento adequado com algumas áreas para aprimoramento",
      prognosis: "Bom prognóstico com intervenção direcionada",
      color: "#3b82f6"
    };
    if (percentage >= 50) return {
      level: "MODERADO",
      description: "Desenvolvimento em processo com necessidade de suporte",
      prognosis: "Prognóstico favorável com intervenção sistemática",
      color: "#eab308"
    };
    if (percentage >= 30) return {
      level: "INICIAL",
      description: "Desenvolvimento emergente requerendo suporte intensivo",
      prognosis: "Prognóstico reservado, necessita acompanhamento especializado",
      color: "#f97316"
    };
    return {
      level: "CRÍTICO",
      description: "Desenvolvimento significativamente comprometido",
      prognosis: "Prognóstico cauteloso, intervenção multidisciplinar essencial",
      color: "#ef4444"
    };
  };

  const getDomainRecommendations = (domain: any, score: number) => {
    const domainName = domain.title.replace("Domínio ", "");
    
    const recommendations = {
      "Musical": {
        high: "Promover atividades de composição e improvisação musical avançada",
        medium: "Desenvolver habilidades de percepção rítmica e melódica estruturada",
        low: "Iniciar com estímulos musicais simples e familiares, progressão gradual"
      },
      "Psicossocial": {
        high: "Facilitar liderança em atividades musicais grupais e mentoria",
        medium: "Trabalhar interações sociais através de atividades musicais colaborativas",
        low: "Começar com atividades musicais individuais, transição gradual para duplas"
      },
      "Cognitivo": {
        high: "Introduzir desafios cognitivos complexos através da teoria musical",
        medium: "Trabalhar memória, atenção e sequenciamento através de padrões musicais",
        low: "Focar em atividades musicais de estimulação cognitiva básica e repetição"
      },
      "Sensório-Motor": {
        high: "Desenvolver coordenação fina através de instrumentos complexos",
        medium: "Trabalhar coordenação motora através de atividades rítmicas variadas",
        low: "Iniciar com movimentos corporais amplos ao som da música"
      }
    };

    const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
    return recommendations[domainName as keyof typeof recommendations]?.[level] || "Acompanhamento regular recomendado";
  };

  const currentInterpretation = overallScore ? getInterpretation(overallScore.percentage) : null;

  return (
    <div className="bg-white">
      {/* Página 1 - Capa e Resumo Executivo */}
      <div className="p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/86b61f63-0028-428c-90d1-44c71413e24a.png" 
              alt="Logo MuseTera" 
              style={{ width: '60px', height: 'auto' }} 
            />
          </div>
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            RELATÓRIO DE AVALIAÇÃO MUSICOTERAPÊUTICA
          </h1>
          <div className="text-lg text-gray-600 mb-8">Sistema MuseTera - Versão Profissional</div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-8">
            <h2 className="text-xl font-bold text-blue-800 mb-4">DADOS DO PACIENTE</h2>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div><strong>Nome:</strong> {patientName || 'Não informado'}</div>
              <div><strong>Idade:</strong> {patientData?.age || 'Não informado'} anos</div>
              <div><strong>Data de Nascimento:</strong> {patientData?.birthDate || 'Não informado'}</div>
              <div><strong>Data da Avaliação:</strong> {evaluationDate ? format(evaluationDate, 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy')}</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-bold text-green-800 mb-4">RESUMO EXECUTIVO</h2>
            {overallScore && currentInterpretation && (
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: currentInterpretation.color }}>
                  {overallScore.percentage}%
                </div>
                <div className="text-lg font-semibold mb-2" style={{ color: currentInterpretation.color }}>
                  NÍVEL {currentInterpretation.level}
                </div>
                <div className="text-sm text-gray-700 mb-4">
                  Pontuação: {overallScore.raw}/{overallScore.max}
                </div>
                <div className="text-sm text-gray-600 italic">
                  {currentInterpretation.description}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">Página 1/6</div>
      </div>

      {/* Página 2 - Perfil Clínico */}
      <div className="p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b-2 border-blue-200 pb-3">
          PERFIL CLÍNICO E ANAMNESE
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 text-blue-700 flex items-center">
              🏥 Informações Clínicas
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">Diagnóstico:</span>
                <span className="text-gray-600">{patientData?.diagnosis || 'Não informado'}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">Medicações:</span>
                <span className="text-gray-600">{patientData?.medications || 'Nenhuma relatada'}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">Histórico Familiar:</span>
                <span className="text-gray-600">{patientData?.familyHistory || 'Não relatado'}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 text-purple-700 flex items-center">
              🎵 Perfil Musical
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex">
                <span className="font-medium text-gray-700 w-40">Preferências Musicais:</span>
                <span className="text-gray-600">{patientData?.musicalPreferences || 'A investigar'}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-40">Terapias Anteriores:</span>
                <span className="text-gray-600">{patientData?.previousTherapies || 'Primeira avaliação'}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 text-orange-700 flex items-center">
              ⚠️ Preocupações de Desenvolvimento
            </h3>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {patientData?.developmentConcerns || 'Nenhuma preocupação específica relatada pelos responsáveis.'}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 text-green-700 flex items-center">
              📊 Panorama Geral dos Resultados
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Perfil de Habilidades</h4>
                <div className="h-[180px] flex justify-center">
                  {radarData && (
                    <StaticChart 
                      data={radarData} 
                      type="radar" 
                      width={250} 
                      height={180}
                      colors={['#8884d8']} 
                    />
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Desenvolvimento Geral</h4>
                <div className="h-[180px] flex justify-center">
                  <StaticChart 
                    data={pieData} 
                    type="pie" 
                    width={250} 
                    height={180}
                    colors={['#4ade80', '#ffa1b5']} 
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">Página 2/6</div>
      </div>

      {/* Página 3 - Análise Detalhada por Domínios */}
      <div className="p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b-2 border-blue-200 pb-3">
          ANÁLISE CLÍNICA POR DOMÍNIOS
        </h2>

        {evaluationDomains && evaluationDomains.map((domain, index) => {
          const domainScore = categoryData.find(item => item.domain === domain.title.replace("Domínio ", ""));
          const score = domainScore?.value || 0;
          const interpretation = getInterpretation(score);
          
          return (
            <Card key={index} className="p-6 mb-6 border-l-4" style={{ borderLeftColor: interpretation.color }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{domain.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{domain.title}</h3>
                    <p className="text-sm text-gray-600">{domain.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: interpretation.color }}>
                    {score}%
                  </div>
                  <div className="text-sm font-medium" style={{ color: interpretation.color }}>
                    {interpretation.level}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">📋 Interpretação Clínica:</h4>
                  <p className="text-sm text-blue-700">{interpretation.description}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">🎯 Recomendações Terapêuticas:</h4>
                  <p className="text-sm text-green-700">{getDomainRecommendations(domain, score)}</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-800 mb-2">🔮 Prognóstico:</h4>
                  <p className="text-sm text-yellow-700">{interpretation.prognosis}</p>
                </div>
              </div>
            </Card>
          );
        })}

        <div className="text-center text-sm text-gray-500 mt-8">Página 3/6</div>
      </div>

      {/* Página 4 - Gráficos Comparativos */}
      <div className="p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b-2 border-blue-200 pb-3">
          ANÁLISE GRÁFICA COMPARATIVA
        </h2>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Desempenho por Subdomínios</h3>
          <div className="flex justify-center">
            <StaticChart 
              data={categoryData} 
              type="bar" 
              width={720} 
              height={400}
              colors={['#8884d8', '#82ca9d', '#ffc658', '#ff8042']} 
            />
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Escala de Interpretação</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-100 rounded">
                <span className="font-medium">85-100%</span>
                <span className="bg-green-500 text-white px-3 py-1 rounded text-sm">EXCELENTE</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-100 rounded">
                <span className="font-medium">70-84%</span>
                <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm">BOM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-100 rounded">
                <span className="font-medium">50-69%</span>
                <span className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">MODERADO</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-100 rounded">
                <span className="font-medium">30-49%</span>
                <span className="bg-orange-500 text-white px-3 py-1 rounded text-sm">INICIAL</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-100 rounded">
                <span className="font-medium">0-29%</span>
                <span className="bg-red-500 text-white px-3 py-1 rounded text-sm">CRÍTICO</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Resumo Quantitativo</h3>
            <div className="space-y-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ 
                        backgroundColor: item.domain === "Musical" ? "#8884d8" :
                          item.domain === "Psicossocial" ? "#82ca9d" :
                          item.domain === "Cognitivo" ? "#ffc658" : "#ff8042"
                      }}
                    />
                    <span className="font-bold text-gray-800">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">Página 4/6</div>
      </div>

      {/* Página 5 - Plano Terapêutico */}
      <div className="p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b-2 border-blue-200 pb-3">
          PLANO TERAPÊUTICO PERSONALIZADO
        </h2>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 text-blue-700">🎯 Objetivos Terapêuticos SMART</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded">
              <h4 className="font-bold text-blue-800 mb-2">Curto Prazo (1-3 meses):</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Estabelecer rapport terapêutico através de atividades musicais preferidas</li>
                <li>• Aumentar tolerância a estímulos sonoros em 25%</li>
                <li>• Participar ativamente de 80% das atividades musicais propostas</li>
                <li>• Demonstrar resposta corporal rítmica em 3 de 5 tentativas</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded">
              <h4 className="font-bold text-green-800 mb-2">Médio Prazo (3-6 meses):</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Ampliar repertório de respostas musicais em 50%</li>
                <li>• Desenvolver interação social em atividades musicais em grupo</li>
                <li>• Utilizar a música como ferramenta de autorregulação emocional</li>
                <li>• Demonstrar coordenação motora em instrumentos simples</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded">
              <h4 className="font-bold text-purple-800 mb-2">Longo Prazo (6+ meses):</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Alcançar independência em atividades musicais estruturadas</li>
                <li>• Generalizar habilidades musicais para outros contextos</li>
                <li>• Manter engajamento musical como recurso de bem-estar</li>
                <li>• Desenvolver preferências musicais próprias e expressá-las</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 text-orange-700">⚠️ Contraindicações e Cuidados</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                <strong>Sensibilidade Auditiva:</strong> Monitorar volume e intensidade dos estímulos
              </div>
              <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                <strong>Fadiga:</strong> Observar sinais de cansaço e ajustar duração das sessões
              </div>
              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                <strong>Medicações:</strong> Considerar efeitos na atenção e coordenação
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 text-green-700">🛠️ Recursos Recomendados</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Instrumentos de percussão variados</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Sistema de som com controle de volume</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Repertório musical familiar e preferido</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Ambiente acusticamente controlado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Apoios visuais para atividades estruturadas</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 mt-6">
          <h3 className="text-lg font-bold mb-4 text-purple-700">📅 Cronograma de Reavaliação</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded">
              <div className="font-bold text-blue-800">1 mês</div>
              <div className="text-sm text-blue-600">Ajustes iniciais</div>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <div className="font-bold text-green-800">3 meses</div>
              <div className="text-sm text-green-600">Reavaliação parcial</div>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <div className="font-bold text-purple-800">6 meses</div>
              <div className="text-sm text-purple-600">Reavaliação completa</div>
            </div>
          </div>
        </Card>

        <div className="text-center text-sm text-gray-500 mt-8">Página 5/6</div>
      </div>

      {/* Página 6 - Considerações Finais e Referencias */}
      <div className="p-8" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', minHeight: '1050px' }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b-2 border-blue-200 pb-3">
          CONSIDERAÇÕES FINAIS E REFERÊNCIAS
        </h2>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">💡 Observações Clínicas Adicionais</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Aspectos Positivos Observados:</h4>
              <p className="text-sm text-blue-700">
                Durante a avaliação, foi possível observar interesse genuíno por estímulos musicais, 
                capacidade de atenção sustentada durante atividades preferenciais e potencial para 
                desenvolvimento de habilidades musicoterapêuticas.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Áreas de Atenção:</h4>
              <p className="text-sm text-yellow-700">
                Monitorar possível sensibilidade a determinados timbres e volumes, observar padrões 
                de fadiga durante sessões e ajustar estratégias conforme resposta individual.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 text-green-700">👨‍👩‍👧‍👦 Orientações para a Família</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">🎵</span>
              <span className="text-sm">Incorporar música no cotidiano familiar de forma natural e prazerosa</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">⏰</span>
              <span className="text-sm">Estabelecer rotinas musicais que promovam regulação emocional</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">🤝</span>
              <span className="text-sm">Participar ativamente do processo terapêutico quando apropriado</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-1">📝</span>
              <span className="text-sm">Manter registro de observações e progressos no ambiente domiciliar</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 text-purple-700">📚 Metodologia e Instrumentos Utilizados</h3>
          <div className="text-sm space-y-2">
            <p><strong>Instrumento de Avaliação:</strong> Escala TEA adaptada para Musicoterapia</p>
            <p><strong>Domínios Avaliados:</strong> Musical, Psicossocial, Cognitivo e Sensório-Motor</p>
            <p><strong>Método de Pontuação:</strong> Escala Likert de 0-4 pontos</p>
            <p><strong>Tempo de Avaliação:</strong> Aproximadamente 45-60 minutos</p>
            <p><strong>Ambiente:</strong> Sala de musicoterapia com controle acústico</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-700">📖 Referências Científicas</h3>
          <div className="text-xs space-y-2 text-gray-600">
            <p>• Bruscia, K. E. (2014). Defining music therapy. Barcelona Publishers.</p>
            <p>• Wheeler, B. L. (2015). Music therapy handbook. Guilford Publications.</p>
            <p>• Thaut, M. H. (2013). Rhythm, music, and the brain. Routledge.</p>
            <p>• Wigram, T., Pedersen, I. N., & Bonde, L. O. (2002). A comprehensive guide to music therapy. Jessica Kingsley Publishers.</p>
            <p>• American Music Therapy Association (2020). Standards of clinical practice.</p>
          </div>
        </Card>

        <div className="border-t-2 border-gray-200 pt-6 mt-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {evaluatorName || 'Musicoterapeuta Responsável'}
            </p>
            <p className="text-xs text-gray-500">
              {evaluatorEmail || 'email@profissional.com'}
            </p>
            <p className="text-xs text-gray-500">
              Documento gerado pelo Sistema MuseTera em {format(new Date(), 'dd/MM/yyyy')} às {new Date().toLocaleTimeString('pt-BR')}
            </p>
            <p className="text-xs text-gray-400">
              Este relatório é confidencial e destinado exclusivamente ao uso clínico
            </p>
            <div className="text-center text-sm text-gray-500 mt-4">Página 6/6</div>
          </div>
        </div>
      </div>
    </div>
  );
};
