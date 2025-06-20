
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function FiguresSection() {
  return (
    <section className="my-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">FIGURAS E ILUSTRAÇÕES</h2>
      
      {/* Figura 1 - Interface da Escala */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-200">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Escala MuseTera - Interface de Avaliação</h3>
              <p className="text-sm text-gray-600">Sistema expandido de pontuação (0-6) para avaliação musicoterapêutica</p>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {[
                { level: 0, name: "Não Observado", color: "bg-gray-500" },
                { level: 1, name: "Emergente", color: "bg-red-500" },
                { level: 2, name: "Inconsistente", color: "bg-orange-400" },
                { level: 3, name: "Moderado", color: "bg-yellow-400" },
                { level: 4, name: "Consistente", color: "bg-blue-500" },
                { level: 5, name: "Avançado", color: "bg-green-500" },
                { level: 6, name: "Excepcional", color: "bg-purple-500" }
              ].map((level) => (
                <div key={level.level} className="text-center">
                  <div className={`w-8 h-8 ${level.color} rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold text-sm`}>
                    {level.level}
                  </div>
                  <p className="text-xs font-medium text-gray-700">{level.name}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4 font-medium">
            <strong>Figura 1.</strong> Interface da Escala MuseTera mostrando o sistema expandido de pontuação de 7 níveis (0-6)
          </p>
        </CardContent>
      </Card>

      {/* Figura 2 - Estrutura Multidimensional */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg border border-green-200">
            <div className="text-center mb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Estrutura Multidimensional da Escala MuseTera</h3>
              <p className="text-sm text-gray-600">7 Domínios de Desenvolvimento Avaliados</p>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { domain: "Cognitivo", icon: "🧠", color: "bg-blue-100 border-blue-300" },
                { domain: "Motor", icon: "🏃", color: "bg-green-100 border-green-300" },
                { domain: "Comunicativo", icon: "💬", color: "bg-yellow-100 border-yellow-300" },
                { domain: "Social", icon: "👥", color: "bg-purple-100 border-purple-300" },
                { domain: "Emocional", icon: "😊", color: "bg-pink-100 border-pink-300" },
                { domain: "Sensorial", icon: "👂", color: "bg-orange-100 border-orange-300" },
                { domain: "Criativo", icon: "🎨", color: "bg-red-100 border-red-300" }
              ].map((domain) => (
                <div key={domain.domain} className={`${domain.color} p-4 rounded-lg border-2 text-center`}>
                  <div className="text-2xl mb-2">{domain.icon}</div>
                  <p className="font-semibold text-sm text-gray-800">{domain.domain}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4 font-medium">
            <strong>Figura 2.</strong> Estrutura multidimensional da Escala MuseTera contemplando 7 domínios do desenvolvimento
          </p>
        </CardContent>
      </Card>

      {/* Figura 3 - Resultados de Validação */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-8 rounded-lg border border-indigo-200">
            <div className="text-center mb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Resultados de Validação Psicométrica</h3>
              <p className="text-sm text-gray-600">Indicadores de Confiabilidade e Validade (n=120)</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">0,89</div>
                <p className="text-xs text-gray-600">IVC Global</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">0,92</div>
                <p className="text-xs text-gray-600">Alpha Cronbach</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">0,88</div>
                <p className="text-xs text-gray-600">Teste-Reteste</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">32%</div>
                <p className="text-xs text-gray-600">+ Sensibilidade</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-center mb-3 text-gray-800">Análise Fatorial Exploratória</h4>
              <div className="flex justify-center space-x-8 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg text-indigo-600">0,91</div>
                  <p className="text-gray-600">KMO</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-indigo-600">78,3%</div>
                  <p className="text-gray-600">Variância</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-indigo-600">7</div>
                  <p className="text-gray-600">Fatores</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4 font-medium">
            <strong>Figura 3.</strong> Principais resultados da validação psicométrica da Escala MuseTera
          </p>
        </CardContent>
      </Card>

      {/* Figura 4 - Exemplo de Aplicação Clínica */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-8 rounded-lg border border-teal-200">
            <div className="text-center mb-6">
              <h3 className="font-bold text-lg text-gray-800 mb-2">Exemplo de Aplicação Clínica</h3>
              <p className="text-sm text-gray-600">Perfil de desenvolvimento - Paciente com TEA (8 anos)</p>
            </div>
            
            <div className="space-y-3">
              {[
                { domain: "Cognitivo", score: 3, description: "Atenção sustentada em atividades musicais estruturadas" },
                { domain: "Motor", score: 4, description: "Coordenação rítmica consistente com instrumentos percussivos" },
                { domain: "Comunicativo", score: 2, description: "Expressão vocal emergente durante improvisações" },
                { domain: "Social", score: 3, description: "Interação com terapeuta em atividades dirigidas" },
                { domain: "Emocional", score: 4, description: "Autorregulação através de músicas conhecidas" },
                { domain: "Sensorial", score: 5, description: "Processamento auditivo refinado e discriminação tonal" },
                { domain: "Criativo", score: 2, description: "Exploração instrumental com padrões repetitivos" }
              ].map((item) => (
                <div key={item.domain} className="bg-white p-3 rounded-lg border flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">{item.domain}</div>
                    <div className="text-xs text-gray-600">{item.description}</div>
                  </div>
                  <div className="ml-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      item.score === 0 ? 'bg-gray-500' :
                      item.score === 1 ? 'bg-red-500' :
                      item.score === 2 ? 'bg-orange-400' :
                      item.score === 3 ? 'bg-yellow-400' :
                      item.score === 4 ? 'bg-blue-500' :
                      item.score === 5 ? 'bg-green-500' : 'bg-purple-500'
                    }`}>
                      {item.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4 font-medium">
            <strong>Figura 4.</strong> Exemplo de perfil de desenvolvimento usando a Escala MuseTera em paciente com TEA
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
