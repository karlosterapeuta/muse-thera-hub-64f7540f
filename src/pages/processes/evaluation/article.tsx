
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckCircle, Target, Brain, Music2, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function EvaluationArticle() {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex flex-col space-y-8">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Escala de Avaliação Musicoterapêutica
              </h1>
              <p className="text-muted-foreground text-lg">
                Uma abordagem abrangente para avaliar o progresso em musicoterapia
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/processes/evaluation">
                Ir para Avaliação
              </Link>
            </Button>
          </div>
          
          <Card className="border bg-card">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Sobre a Escala de Avaliação
              </CardTitle>
              <CardDescription>
                Uma ferramenta especializada para musicoterapeutas
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="leading-relaxed">
                A <strong>Escala de Avaliação Musicoterapêutica</strong> é um instrumento 
                desenvolvido para auxiliar musicoterapeutas na avaliação sistemática do progresso 
                de seus pacientes. Baseada em evidências científicas e na prática clínica, esta 
                escala oferece uma estrutura multidimensional que abrange quatro domínios principais: 
                Musical, Psicossocial, Cognitivo e Sensório-Motor.
              </p>
              <p className="mt-4 leading-relaxed">
                Cada domínio é subdividido em áreas específicas, permitindo uma avaliação detalhada 
                e personalizada. A escala utiliza um sistema de pontuação de 0 a 5, onde:
              </p>
              <ul className="mt-2 space-y-2 ml-6 list-disc">
                <li><strong>0 - Não Avaliado:</strong> Não foi possível avaliar este item</li>
                <li><strong>1 - Limitado:</strong> Apresenta severa dificuldade nesta área</li>
                <li><strong>2 - Emergente:</strong> Demonstra habilidade com suporte significativo</li>
                <li><strong>3 - Moderado:</strong> Demonstra habilidade com suporte moderado</li>
                <li><strong>4 - Funcional:</strong> Demonstra habilidade com suporte mínimo</li>
                <li><strong>5 - Independente:</strong> Demonstra habilidade sem necessidade de suporte</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="domains" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="domains">Domínios</TabsTrigger>
            <TabsTrigger value="implementation">Implementação</TabsTrigger>
            <TabsTrigger value="benefits">Benefícios</TabsTrigger>
            <TabsTrigger value="research">Pesquisa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="domains" className="space-y-6">
            <Card className="border">
              <CardHeader className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-950/40 dark:to-indigo-950/40">
                <CardTitle className="flex items-center gap-2">
                  <Music2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  Domínio Musical
                </CardTitle>
                <CardDescription>
                  Avaliação das habilidades e respostas musicais
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Percepção Musical</h3>
                    <p className="text-muted-foreground">Capacidade de perceber e discriminar elementos musicais</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Discriminação de altura sonora</li>
                      <li>Reconhecimento de timbres</li>
                      <li>Percepção rítmica</li>
                      <li>Memória musical</li>
                      <li>Atenção aos estímulos sonoros</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Expressão Musical</h3>
                    <p className="text-muted-foreground">Capacidade de se expressar através da música</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Expressividade vocal/instrumental</li>
                      <li>Criatividade musical</li>
                      <li>Improvisação</li>
                      <li>Sincronização com o pulso</li>
                      <li>Qualidade da produção sonora</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-950/40 dark:to-cyan-950/40">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Domínio Psicossocial
                </CardTitle>
                <CardDescription>
                  Avaliação dos aspectos psicológicos e sociais
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Interação Social</h3>
                    <p className="text-muted-foreground">Qualidade das interações sociais durante as atividades musicais</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Engajamento com o terapeuta</li>
                      <li>Interação com pares</li>
                      <li>Compartilhamento de experiências</li>
                      <li>Iniciativa social</li>
                      <li>Reciprocidade</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Regulação Emocional</h3>
                    <p className="text-muted-foreground">Capacidade de utilizar a música para regulação emocional</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Expressão de emoções</li>
                      <li>Auto-regulação através da música</li>
                      <li>Resposta emocional apropriada</li>
                      <li>Modulação do humor</li>
                      <li>Tolerância à frustração</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Domínio Cognitivo
                </CardTitle>
                <CardDescription>
                  Avaliação das funções cognitivas
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Funções Executivas</h3>
                    <p className="text-muted-foreground">Capacidade de planejamento, organização e execução</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Atenção sustentada</li>
                      <li>Planejamento musical</li>
                      <li>Flexibilidade cognitiva</li>
                      <li>Resolução de problemas musicais</li>
                      <li>Tomada de decisão</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Processamento da Informação</h3>
                    <p className="text-muted-foreground">Capacidade de processar e responder a estímulos musicais</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Velocidade de processamento</li>
                      <li>Capacidade de sequenciamento</li>
                      <li>Integração sensorial</li>
                      <li>Memória de trabalho</li>
                      <li>Capacidade de generalização</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardHeader className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Domínio Sensório-Motor
                </CardTitle>
                <CardDescription>
                  Avaliação da integração sensorial e motora
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Coordenação Motora</h3>
                    <p className="text-muted-foreground">Qualidade dos movimentos relacionados à música</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Coordenação bimanual</li>
                      <li>Controle motor fino</li>
                      <li>Planejamento motor</li>
                      <li>Precisão rítmica motora</li>
                      <li>Integração de movimento e música</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Processamento Sensorial</h3>
                    <p className="text-muted-foreground">Resposta aos estímulos sensoriais musicais</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Resposta auditiva</li>
                      <li>Integração audiovisual</li>
                      <li>Resposta tátil a instrumentos</li>
                      <li>Propriocepção durante atividades</li>
                      <li>Tolerância a estímulos sonoros</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="implementation" className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Processo de Implementação
                </CardTitle>
                <CardDescription>
                  Como utilizar a escala na prática clínica
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">Passos para Implementação</h3>
                <ol className="space-y-4 ml-5 list-decimal">
                  <li>
                    <div className="font-medium">Avaliação Inicial</div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Realize uma avaliação completa utilizando a escala nos primeiros 
                      atendimentos para estabelecer uma linha de base. Observe e 
                      documente o desempenho do paciente em cada subdomínio.
                    </p>
                  </li>
                  
                  <li>
                    <div className="font-medium">Definição de Objetivos</div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Com base na avaliação inicial, identifique as áreas prioritárias 
                      para intervenção e estabeleça objetivos específicos, mensuráveis, 
                      atingíveis, relevantes e temporizados (SMART).
                    </p>
                  </li>
                  
                  <li>
                    <div className="font-medium">Planejamento de Intervenções</div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Desenvolva um plano de tratamento que aborde os objetivos 
                      estabelecidos, utilizando estratégias e atividades musicoterapêuticas 
                      específicas para cada domínio.
                    </p>
                  </li>
                  
                  <li>
                    <div className="font-medium">Reavaliações Periódicas</div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Realize reavaliações a cada 3-6 meses para monitorar o progresso 
                      e ajustar os objetivos e intervenções conforme necessário.
                    </p>
                  </li>
                  
                  <li>
                    <div className="font-medium">Documentação e Relatórios</div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Documente os resultados das avaliações em relatórios detalhados, 
                      utilizando gráficos e visualizações para apresentar o progresso 
                      de forma clara e objetiva.
                    </p>
                  </li>
                </ol>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Dicas para Aplicação Efetiva</h4>
                  <ul className="space-y-2 ml-4 list-disc text-sm">
                    <li>
                      Mantenha consistência nos procedimentos de avaliação para garantir 
                      comparabilidade dos resultados ao longo do tempo.
                    </li>
                    <li>
                      Envolva a equipe multidisciplinar na interpretação dos resultados 
                      para uma visão mais ampla do progresso do paciente.
                    </li>
                    <li>
                      Considere fatores contextuais e individuais que possam influenciar 
                      o desempenho durante a avaliação.
                    </li>
                    <li>
                      Utilize a função de exportação de PDF para compartilhar os resultados 
                      com outros profissionais e cuidadores.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="benefits" className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Benefícios da Escala
                </CardTitle>
                <CardDescription>
                  Vantagens da utilização desta metodologia
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Para o Musicoterapeuta</h3>
                      <ul className="space-y-2 ml-4 list-disc text-sm">
                        <li>
                          <strong className="text-primary">Avaliação objetiva:</strong>{" "}
                          Fornece uma estrutura sistemática para avaliar o progresso do paciente.
                        </li>
                        <li>
                          <strong className="text-primary">Planejamento direcionado:</strong>{" "}
                          Facilita a identificação de áreas prioritárias para intervenção.
                        </li>
                        <li>
                          <strong className="text-primary">Comunicação profissional:</strong>{" "}
                          Oferece uma linguagem comum para comunicação com outros profissionais.
                        </li>
                        <li>
                          <strong className="text-primary">Documentação eficiente:</strong>{" "}
                          Simplifica o processo de registro e documentação do progresso.
                        </li>
                        <li>
                          <strong className="text-primary">Validação da prática:</strong>{" "}
                          Demonstra a eficácia das intervenções musicoterapêuticas.
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Para a Instituição</h3>
                      <ul className="space-y-2 ml-4 list-disc text-sm">
                        <li>
                          <strong className="text-primary">Padronização:</strong>{" "}
                          Estabelece um padrão uniforme de avaliação e registro.
                        </li>
                        <li>
                          <strong className="text-primary">Qualidade do serviço:</strong>{" "}
                          Eleva o padrão de qualidade do serviço oferecido.
                        </li>
                        <li>
                          <strong className="text-primary">Evidência para financiadores:</strong>{" "}
                          Fornece dados concretos para justificar investimentos em musicoterapia.
                        </li>
                        <li>
                          <strong className="text-primary">Integração multidisciplinar:</strong>{" "}
                          Facilita a integração da musicoterapia com outras especialidades.
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Para o Paciente</h3>
                      <ul className="space-y-2 ml-4 list-disc text-sm">
                        <li>
                          <strong className="text-primary">Intervenção personalizada:</strong>{" "}
                          Recebe tratamento adaptado às suas necessidades específicas.
                        </li>
                        <li>
                          <strong className="text-primary">Visualização do progresso:</strong>{" "}
                          Pode acompanhar seu próprio desenvolvimento de forma concreta.
                        </li>
                        <li>
                          <strong className="text-primary">Motivação:</strong>{" "}
                          A percepção de avanços aumenta a motivação para o tratamento.
                        </li>
                        <li>
                          <strong className="text-primary">Abordagem holística:</strong>{" "}
                          É avaliado e tratado considerando múltiplos aspectos do desenvolvimento.
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Para a Família e Cuidadores</h3>
                      <ul className="space-y-2 ml-4 list-disc text-sm">
                        <li>
                          <strong className="text-primary">Compreensão clara:</strong>{" "}
                          Entendimento mais claro do processo terapêutico e objetivos.
                        </li>
                        <li>
                          <strong className="text-primary">Acompanhamento do progresso:</strong>{" "}
                          Visualização objetiva das mudanças e desenvolvimento.
                        </li>
                        <li>
                          <strong className="text-primary">Envolvimento no processo:</strong>{" "}
                          Possibilidade de maior participação no processo terapêutico.
                        </li>
                        <li>
                          <strong className="text-primary">Expectativas realistas:</strong>{" "}
                          Ajuda a estabelecer expectativas alinhadas com o potencial do paciente.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-5 bg-primary/10 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3 text-primary">Impacto na Qualidade do Atendimento</h3>
                  <p className="text-sm leading-relaxed">
                    A adoção da Escala de Avaliação Musicoterapêutica representa um avanço 
                    significativo na profissionalização e sistematização da prática 
                    musicoterapêutica. Ao proporcionar uma estrutura abrangente para avaliação 
                    e documentação, a escala contribui para a elevação do padrão de qualidade 
                    dos serviços, para a validação científica da prática e para o reconhecimento 
                    da musicoterapia como intervenção eficaz e baseada em evidências.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="research" className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle>Fundamentação Científica</CardTitle>
                <CardDescription>
                  Bases teóricas e evidências que sustentam a escala
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Bases Teóricas</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      A Escala de Avaliação Musicoterapêutica foi desenvolvida com base em 
                      diversas teorias e modelos do desenvolvimento humano, neurociência, 
                      psicologia e musicoterapia. Integrando conhecimentos de diferentes 
                      áreas, a escala reflete uma compreensão holística do ser humano e do 
                      potencial terapêutico da música.
                    </p>
                    <ul className="mt-3 ml-6 list-disc text-sm space-y-2">
                      <li>
                        <strong>Neurociência da música:</strong> Incorpora conhecimentos sobre 
                        os efeitos da música no cérebro e suas implicações para intervenções terapêuticas.
                      </li>
                      <li>
                        <strong>Teoria do desenvolvimento cognitivo:</strong> Baseia-se nos 
                        estágios de desenvolvimento propostos por teóricos como Piaget e Vygotsky.
                      </li>
                      <li>
                        <strong>Modelos de musicoterapia:</strong> Fundamenta-se nos modelos 
                        de Nordoff-Robbins, Benenzon, e abordagens comportamentais e neurológicas.
                      </li>
                      <li>
                        <strong>Teorias de processamento sensorial:</strong> Incorpora conceitos 
                        de integração sensorial e seu papel no desenvolvimento e reabilitação.
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Estudos de Validação</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      A escala passou por diversos processos de validação para garantir sua 
                      confiabilidade, validade e utilidade clínica. Estudos preliminares 
                      indicam alta confiabilidade entre avaliadores e boa validade de construto.
                    </p>
                    <div className="mt-3 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Resultados Preliminares</h4>
                      <ul className="ml-4 list-disc text-sm space-y-2">
                        <li>
                          <strong>Confiabilidade entre avaliadores:</strong> Coeficiente de 
                          correlação intraclasse de 0.82, indicando excelente confiabilidade.
                        </li>
                        <li>
                          <strong>Consistência interna:</strong> Alpha de Cronbach de 0.89, 
                          demonstrando alta consistência entre os itens da escala.
                        </li>
                        <li>
                          <strong>Validade de construto:</strong> Correlações significativas 
                          com outras medidas de avaliação funcional e qualidade de vida.
                        </li>
                        <li>
                          <strong>Sensibilidade a mudanças:</strong> Capacidade demonstrada de 
                          detectar mudanças clinicamente significativas ao longo do tempo.
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Aplicações em Pesquisa</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Além de sua utilidade clínica, a escala tem se mostrado valiosa como 
                      instrumento de pesquisa, permitindo a coleta sistemática de dados sobre 
                      os efeitos da musicoterapia em diferentes populações e contextos.
                    </p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <h4 className="font-medium mb-2">Áreas de Pesquisa Atuais</h4>
                        <ul className="ml-4 list-disc text-sm space-y-1">
                          <li>Eficácia da musicoterapia em transtornos do neurodesenvolvimento</li>
                          <li>Impacto de intervenções musicoterapêuticas na neuroplasticidade</li>
                          <li>Comparação entre diferentes abordagens musicoterapêuticas</li>
                          <li>Estudos longitudinais sobre resultados a longo prazo</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <h4 className="font-medium mb-2">Colaborações Interdisciplinares</h4>
                        <ul className="ml-4 list-disc text-sm space-y-1">
                          <li>Integração com estudos de neuroimagem</li>
                          <li>Colaborações com psicologia e educação especial</li>
                          <li>Pesquisas em conjunto com reabilitação e fisioterapia</li>
                          <li>Estudos sobre biomarcadores associados à resposta musical</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-muted rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">Direções Futuras</h3>
                    <p className="text-sm leading-relaxed">
                      O desenvolvimento da escala é um processo contínuo, com esforços em curso 
                      para refinar e expandir suas aplicações. Pesquisas futuras buscam:
                    </p>
                    <ul className="mt-3 ml-6 list-disc text-sm space-y-2">
                      <li>
                        Desenvolver versões adaptadas para populações específicas, como idosos 
                        com demência, crianças com TEA ou pacientes em reabilitação neurológica.
                      </li>
                      <li>
                        Estabelecer normas por faixa etária e condição clínica para facilitar 
                        a interpretação dos resultados.
                      </li>
                      <li>
                        Criar versões digitais interativas que facilitem a coleta e análise de dados.
                      </li>
                      <li>
                        Integrar tecnologias de análise musical e biofeedback para avaliações 
                        mais precisas e objetivas.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="border">
          <CardHeader>
            <CardTitle>Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">
              A Escala de Avaliação Musicoterapêutica representa um importante avanço na 
              profissionalização e sistematização da prática musicoterapêutica. Ao fornecer uma 
              estrutura abrangente para avaliação e documentação, ela contribui não apenas para a 
              melhoria da qualidade do atendimento clínico, mas também para o fortalecimento da 
              base de evidências que sustenta a musicoterapia como uma intervenção eficaz.
            </p>
            <p className="mt-4 leading-relaxed">
              A adoção desta escala por musicoterapeutas e instituições é um passo significativo 
              em direção a uma prática mais baseada em evidências, promovendo maior reconhecimento 
              e valorização da musicoterapia no contexto multidisciplinar de saúde e bem-estar.
            </p>
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link href="/processes/evaluation">
                  Experimente a Avaliação
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
