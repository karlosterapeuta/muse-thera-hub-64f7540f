
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function FiguresSection() {
  return (
    <section className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">FIGURAS</h2>
      
      {/* Figura 1 - Interface da Escala */}
      <div className="space-y-4">
        <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
          <CardContent className="p-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">
                Interface da Escala MuseTera
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded text-sm">
                  <strong>Domínio Cognitivo</strong>
                  <div className="flex justify-between mt-2">
                    <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Domínio Motor</strong>
                  <div className="flex justify-between mt-2">
                    <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-purple-50 p-2 rounded">
                  <strong>Comunicativo</strong>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div className="bg-purple-600 h-1 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <strong>Social</strong>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div className="bg-yellow-600 h-1 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <strong>Emocional</strong>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div className="bg-red-600 h-1 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="text-sm text-gray-600 text-center">
          <strong>Figura 1.</strong> Interface da Escala MuseTera demonstrando o sistema de pontuação 
          expandido (0-6) para os 7 domínios de desenvolvimento. Cada domínio apresenta escala visual 
          com indicadores de progressão terapêutica.
        </p>
      </div>

      {/* Figura 2 - Domínios da Escala */}
      <div className="space-y-4">
        <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold mb-4 text-center text-green-700">
              Estrutura Multidimensional da Escala MuseTera
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  C
                </div>
                <h4 className="font-semibold text-sm">COGNITIVO</h4>
                <p className="text-xs mt-1">Atenção, Memória, Funções Executivas</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  M
                </div>
                <h4 className="font-semibold text-sm">MOTOR</h4>
                <p className="text-xs mt-1">Coordenação, Equilíbrio, Controle</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  Co
                </div>
                <h4 className="font-semibold text-sm">COMUNICATIVO</h4>
                <p className="text-xs mt-1">Linguagem, Expressão, Compreensão</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  S
                </div>
                <h4 className="font-semibold text-sm">SOCIAL</h4>
                <p className="text-xs mt-1">Interação, Cooperação, Comportamento</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  E
                </div>
                <h4 className="font-semibold text-sm">EMOCIONAL</h4>
                <p className="text-xs mt-1">Regulação, Expressão Afetiva</p>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-indigo-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  Se
                </div>
                <h4 className="font-semibold text-sm">SENSORIAL</h4>
                <p className="text-xs mt-1">Processamento Auditivo, Tátil, Visual</p>
              </div>
              <div className="bg-pink-100 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  Cr
                </div>
                <h4 className="font-semibold text-sm">CRIATIVO</h4>
                <p className="text-xs mt-1">Expressão Artística, Improvisação</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center border-2 border-gray-300">
                <div className="w-12 h-12 bg-gray-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs">
                  0-6
                </div>
                <h4 className="font-semibold text-sm">PONTUAÇÃO</h4>
                <p className="text-xs mt-1">Sistema Expandido 7 Níveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="text-sm text-gray-600 text-center">
          <strong>Figura 2.</strong> Representação esquemática dos 7 domínios da Escala MuseTera 
          com sistema de pontuação expandido (0-6), demonstrando a abordagem multidimensional 
          para avaliação musicoterapêutica.
        </p>
      </div>

      {/* Figura 3 - Resultados de Validação */}
      <div className="space-y-4">
        <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold mb-4 text-center text-purple-700">
              Resultados de Validação da Escala MuseTera
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-center mb-3 text-blue-600">Validade de Conteúdo</h4>
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray="89, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">0.89</span>
                  </div>
                </div>
                <p className="text-xs text-center mt-2">IVC Global</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-center mb-3 text-green-600">Confiabilidade</h4>
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="92, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-green-600">0.92</span>
                  </div>
                </div>
                <p className="text-xs text-center mt-2">Alpha de Cronbach</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-center mb-3 text-purple-600">Sensibilidade</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">+32%</div>
                  <div className="text-sm text-gray-600 mb-2">vs. Escalas Tradicionais</div>
                  <div className="text-xs bg-purple-100 p-2 rounded">
                    <div>Comunicativo: +38%</div>
                    <div>Criativo: +45%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-center mb-3">Estrutura Fatorial</h4>
              <div className="flex justify-center items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg">7</div>
                  <div className="text-gray-600">Fatores</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">78.3%</div>
                  <div className="text-gray-600">Variância</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">0.91</div>
                  <div className="text-gray-600">KMO</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">p&lt;0.001</div>
                  <div className="text-gray-600">Bartlett</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="text-sm text-gray-600 text-center">
          <strong>Figura 3.</strong> Resultados da validação psicométrica da Escala MuseTera, 
          demonstrando excelente validade de conteúdo (IVC=0,89), alta confiabilidade (α=0,92) 
          e superior sensibilidade comparada a instrumentos tradicionais.
        </p>
      </div>

      {/* Figura 4 - Exemplo de Aplicação */}
      <div className="space-y-4">
        <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold mb-4 text-center text-orange-700">
              Exemplo de Aplicação Clínica da Escala MuseTera
            </h3>
            <div className="bg-white p-6 rounded-lg">
              <div className="mb-4 text-sm">
                <strong>Paciente:</strong> Criança, 8 anos, TEA | <strong>Sessão:</strong> 12ª avaliação | <strong>Data:</strong> Dezembro 2024
              </div>
              
              <div className="space-y-3">
                {[
                  { domain: 'Cognitivo', score: 4, color: 'blue', description: 'Atenção sustentada por 15 min durante atividade musical' },
                  { domain: 'Motor', score: 3, color: 'green', description: 'Coordenação bimanual com instrumentos simples' },
                  { domain: 'Comunicativo', score: 5, color: 'purple', description: 'Vocalização melódica espontânea e imitação vocal' },
                  { domain: 'Social', score: 2, color: 'yellow', description: 'Tolerância à proximidade do terapeuta durante 5 min' },
                  { domain: 'Emocional', score: 4, color: 'red', description: 'Autorregulação através de música calma' },
                  { domain: 'Sensorial', score: 3, color: 'indigo', description: 'Processamento auditivo de texturas sonoras' },
                  { domain: 'Criativo', score: 2, color: 'pink', description: 'Exploração tímbrica emergente com objetos sonoros' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-24 text-sm font-medium">{item.domain}:</div>
                    <div className="flex space-x-1">
                      {[0, 1, 2, 3, 4, 5, 6].map((score) => (
                        <div
                          key={score}
                          className={`w-6 h-6 rounded border text-xs flex items-center justify-center font-bold ${
                            score <= item.score
                              ? `bg-${item.color}-500 text-white border-${item.color}-600`
                              : 'bg-gray-200 text-gray-500 border-gray-300'
                          }`}
                        >
                          {score}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 text-xs text-gray-600 ml-4">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                <strong>Observações Clínicas:</strong> Evolução significativa no domínio comunicativo 
                (de 2 para 5 em 3 meses). Manutenção de ganhos nos domínios cognitivo e emocional. 
                Próximos objetivos: desenvolvimento social e criativo.
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="text-sm text-gray-600 text-center">
          <strong>Figura 4.</strong> Exemplo de aplicação da Escala MuseTera em criança com TEA, 
          demonstrando a capacidade do instrumento em capturar mudanças específicas em cada 
          domínio e orientar o planejamento terapêutico individualizado.
        </p>
      </div>
    </section>
  );
}
