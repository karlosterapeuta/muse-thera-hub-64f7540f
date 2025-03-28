
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckCircle, Target, Brain, Music2, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function TeaScaleArticle() {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex flex-col space-y-8">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Escala de Avaliação TEA
              </h1>
              <p className="text-muted-foreground text-lg">
                Uma ferramenta especializada para avaliação do desenvolvimento no Transtorno do Espectro Autista
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/processes/evaluation">
                Ir para Avaliação
              </Link>
            </Button>
          </div>
          
          <Card className="border bg-card">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Sobre a Escala de Avaliação TEA
              </CardTitle>
              <CardDescription>
                Uma metodologia abrangente para profissionais que trabalham com autismo
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="leading-relaxed">
                A <strong>Escala de Avaliação TEA</strong> é um instrumento 
                desenvolvido para auxiliar profissionais na avaliação sistemática e 
                abrangente de indivíduos com Transtorno do Espectro Autista. Baseada em evidências 
                científicas e na prática clínica, esta escala oferece uma estrutura que contempla 
                diferentes áreas do desenvolvimento, permitindo uma visão holística das habilidades 
                e desafios da pessoa avaliada.
              </p>
              <p className="mt-4 leading-relaxed">
                A escala utiliza um sistema de classificação qualitativa dividido em três níveis para 
                cada parâmetro avaliado:
              </p>
              <ul className="mt-2 space-y-2 ml-6 list-disc">
                <li><strong>Não:</strong> Indica ausência ou limitação significativa na habilidade avaliada</li>
                <li><strong>Pouco:</strong> Indica presença parcial ou em desenvolvimento da habilidade</li>
                <li><strong>Muito:</strong> Indica presença consistente ou domínio da habilidade</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="domains" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="domains">Domínios</TabsTrigger>
            <TabsTrigger value="implementation">Aplicação</TabsTrigger>
            <TabsTrigger value="benefits">Benefícios</TabsTrigger>
            <TabsTrigger value="research">Fundamentação</TabsTrigger>
          </TabsList>
          
          <TabsContent value="domains" className="space-y-6">
            <Card className="border">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Interação Social
                </CardTitle>
                <CardDescription>
                  Avaliação das habilidades de interação e reciprocidade social
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Engajamento Social</h3>
                    <p className="text-muted-foreground">Capacidade de iniciar e manter interações sociais</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Interesse por pessoas</li>
                      <li>Iniciativa nas interações</li>
                      <li>Contato visual</li>
                      <li>Expressões faciais apropriadas</li>
                      <li>Compartilhamento de atenção</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Comunicação Social</h3>
                    <p className="text-muted-foreground">Habilidades de comunicação em contextos sociais</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Reciprocidade conversacional</li>
                      <li>Compreensão de sinais sociais</li>
                      <li>Adequação ao contexto social</li>
                      <li>Linguagem não-verbal</li>
                      <li>Empatia e teoria da mente</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardHeader className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40">
                <CardTitle className="flex items-center gap-2">
                  <Music2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Comunicação
                </CardTitle>
                <CardDescription>
                  Avaliação das habilidades comunicativas verbais e não-verbais
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Comunicação Não-Verbal</h3>
                    <p className="text-muted-foreground">Uso de meios não-verbais para comunicação</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Expressão através de gestos</li>
                      <li>Uso de expressões faciais comunicativas</li>
                      <li>Apontar para indicar interesse</li>
                      <li>Compreensão de pistas visuais</li>
                      <li>Uso de linguagem corporal</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Comunicação Verbal</h3>
                    <p className="text-muted-foreground">Desenvolvimento e uso da linguagem falada</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Desenvolvimento do vocabulário</li>
                      <li>Construção de frases</li>
                      <li>Ecolalia (imediata ou tardia)</li>
                      <li>Prosódia e entonação</li>
                      <li>Compreensão literal vs. figurada</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  Padrões de Comportamento
                </CardTitle>
                <CardDescription>
                  Avaliação de comportamentos repetitivos e interesses restritos
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Comportamentos Repetitivos</h3>
                    <p className="text-muted-foreground">Padrões de movimentos e comportamentos</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Estereotipias motoras</li>
                      <li>Alinhamento de objetos</li>
                      <li>Rotinas inflexíveis</li>
                      <li>Rituais comportamentais</li>
                      <li>Resistência a mudanças</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Interesses e Atividades</h3>
                    <p className="text-muted-foreground">Padrões de interesse e envolvimento</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Interesses restritos ou fixos</li>
                      <li>Intensidade atípica de interesses</li>
                      <li>Preocupação com partes de objetos</li>
                      <li>Hiper ou hipofoco em detalhes</li>
                      <li>Criatividade e jogo simbólico</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-fuchsia-100 dark:from-purple-950/40 dark:to-fuchsia-950/40">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Processamento Sensorial
                </CardTitle>
                <CardDescription>
                  Avaliação da integração e respostas sensoriais
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Respostas Sensoriais</h3>
                    <p className="text-muted-foreground">Reações a estímulos sensoriais</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Hipersensibilidade auditiva</li>
                      <li>Seletividade alimentar</li>
                      <li>Sensibilidade tátil</li>
                      <li>Resposta visual atípica</li>
                      <li>Busca ou evitação sensorial</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Integração Sensorial</h3>
                    <p className="text-muted-foreground">Processamento e integração de informações sensoriais</p>
                    <ul className="mt-2 ml-6 list-disc text-sm">
                      <li>Coordenação sensório-motora</li>
                      <li>Processamento multissensorial</li>
                      <li>Propriocepção e consciência corporal</li>
                      <li>Filtro de estímulos irrelevantes</li>
                      <li>Modulação sensorial</li>
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
                  Processo de Aplicação
                </CardTitle>
                <CardDescription>
                  Como utilizar a escala na prática clínica
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">Etapas de Aplicação</h3>
                <ol className="space-y-4 ml-5 list-decimal">
                  <li>
                    <div className="font-medium">Observação Inicial</div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Realize uma observação sistemática do indivíduo em diferentes contextos 
                      (estruturados e não estruturados) para estabelecer uma linha de base. 
                      Registre comportamentos espontâneos e respostas a estímulos específicos.
                    </p>
                  </li>
                  
                  <li>
                    <div className="font-medium">Aplicação da Escala</div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Para cada seção da escala, avalie os parâmetros utilizando os critérios 
                      "Não", "Pouco" e "Muito". Considere a frequência, intensidade e impacto 
                      funcional de cada comportamento ou habilidade.
                    </p>
                  </li>
                  
                  <li>
                    <div className="font-medium">Análise dos Resultados</div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Examine o padrão de respostas em cada domínio, identificando áreas de 
                      força e necessidades. Observe a distribuição das respostas e identifique 
                      perfis específicos de desenvolvimento.
                    </p>
                  </li>
                  
                  <li>
                    <div className="font-medium">Documentação Visual</div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Utilize gráficos e representações visuais para facilitar a compreensão 
                      e comunicação dos resultados. Compare resultados entre diferentes domínios 
                      e identifique padrões significativos.
                    </p>
                  </li>
                  
                  <li>
                    <div className="font-medium">Planejamento de Intervenção</div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Com base nos resultados da avaliação, desenvolva um plano de intervenção 
                      personalizado que aborde as áreas prioritárias identificadas, aproveitando 
                      as forças e considerando as necessidades específicas.
                    </p>
                  </li>
                </ol>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Recomendações para Aplicação Efetiva</h4>
                  <ul className="space-y-2 ml-4 list-disc text-sm">
                    <li>
                      Utilize múltiplas fontes de informação, incluindo observação direta, 
                      relatos de cuidadores e informações de outros profissionais.
                    </li>
                    <li>
                      Considere fatores contextuais que possam influenciar o desempenho, 
                      como ambiente, hora do dia e estado emocional.
                    </li>
                    <li>
                      Realize reavaliações periódicas para monitorar o progresso e ajustar 
                      intervenções conforme necessário.
                    </li>
                    <li>
                      Compartilhe os resultados com a família e equipe interdisciplinar para 
                      garantir uma abordagem coerente e colaborativa.
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
                      <h3 className="font-semibold text-lg mb-2">Para o Profissional</h3>
                      <ul className="space-y-2 ml-4 list-disc text-sm">
                        <li>
                          <strong className="text-primary">Avaliação estruturada:</strong>{" "}
                          Oferece um framework sistemático para avaliação abrangente.
                        </li>
                        <li>
                          <strong className="text-primary">Identificação de padrões:</strong>{" "}
                          Facilita o reconhecimento de perfis específicos dentro do espectro.
                        </li>
                        <li>
                          <strong className="text-primary">Monitoramento do progresso:</strong>{" "}
                          Permite acompanhar a evolução ao longo do tempo de forma objetiva.
                        </li>
                        <li>
                          <strong className="text-primary">Comunicação interdisciplinar:</strong>{" "}
                          Fornece uma linguagem comum para diferentes especialistas.
                        </li>
                        <li>
                          <strong className="text-primary">Fundamentação para intervenções:</strong>{" "}
                          Embasa o planejamento terapêutico com dados concretos.
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Para a Instituição</h3>
                      <ul className="space-y-2 ml-4 list-disc text-sm">
                        <li>
                          <strong className="text-primary">Padronização de práticas:</strong>{" "}
                          Estabelece protocolos uniformes de avaliação.
                        </li>
                        <li>
                          <strong className="text-primary">Gestão de recursos:</strong>{" "}
                          Permite direcionar recursos para necessidades específicas.
                        </li>
                        <li>
                          <strong className="text-primary">Documentação estruturada:</strong>{" "}
                          Facilita registros sistemáticos e comparáveis.
                        </li>
                        <li>
                          <strong className="text-primary">Base para pesquisa:</strong>{" "}
                          Fornece dados consistentes para estudos e avaliações de eficácia.
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Para a Pessoa com TEA</h3>
                      <ul className="space-y-2 ml-4 list-disc text-sm">
                        <li>
                          <strong className="text-primary">Intervenção personalizada:</strong>{" "}
                          Recebe atendimento adaptado ao seu perfil específico.
                        </li>
                        <li>
                          <strong className="text-primary">Reconhecimento de potencialidades:</strong>{" "}
                          Identifica e valoriza áreas de força e interesse.
                        </li>
                        <li>
                          <strong className="text-primary">Abordagem abrangente:</strong>{" "}
                          Considera múltiplos aspectos do desenvolvimento.
                        </li>
                        <li>
                          <strong className="text-primary">Evolução documentada:</strong>{" "}
                          Permite visualizar progressos ao longo do tempo.
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">Para a Família</h3>
                      <ul className="space-y-2 ml-4 list-disc text-sm">
                        <li>
                          <strong className="text-primary">Compreensão do perfil:</strong>{" "}
                          Entendimento mais claro das características específicas.
                        </li>
                        <li>
                          <strong className="text-primary">Participação no processo:</strong>{" "}
                          Inclusão e colaboração no processo avaliativo.
                        </li>
                        <li>
                          <strong className="text-primary">Visualização de progressos:</strong>{" "}
                          Percepção concreta dos avanços alcançados.
                        </li>
                        <li>
                          <strong className="text-primary">Orientações específicas:</strong>{" "}
                          Recebimento de estratégias adaptadas às necessidades.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-5 bg-primary/10 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-lg mb-3 text-primary">Impacto no Atendimento</h3>
                  <p className="text-sm leading-relaxed">
                    A utilização da Escala de Avaliação TEA representa um avanço significativo 
                    na abordagem clínica do autismo, promovendo uma perspectiva neurodiversa 
                    que valoriza as particularidades de cada indivíduo. Ao oferecer uma visão 
                    multidimensional do desenvolvimento, a escala contribui para intervenções 
                    mais precisas, personalizadas e eficazes, respeitando a identidade e as 
                    necessidades específicas de cada pessoa no espectro.
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
                    <h3 className="font-semibold text-lg mb-2">Perspectivas Teóricas</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      A Escala de Avaliação TEA foi desenvolvida integrando diferentes modelos 
                      teóricos sobre o autismo, reconhecendo a complexidade e heterogeneidade 
                      deste espectro. A escala incorpora tanto perspectivas médicas quanto 
                      socioecológicas e da neurodiversidade.
                    </p>
                    <ul className="mt-3 ml-6 list-disc text-sm space-y-2">
                      <li>
                        <strong>Modelo de Processamento Sensorial:</strong> Fundamenta-se nas 
                        teorias sobre diferenças no processamento sensorial e sua influência 
                        no comportamento e desenvolvimento.
                      </li>
                      <li>
                        <strong>Teorias de Cognição Social:</strong> Incorpora conceitos sobre 
                        teoria da mente, atenção conjunta e desenvolvimento da comunicação social.
                      </li>
                      <li>
                        <strong>Perspectiva da Neurodiversidade:</strong> Reconhece o autismo como 
                        uma variação natural do desenvolvimento neurológico, com desafios e potencialidades.
                      </li>
                      <li>
                        <strong>Abordagem Desenvolvimental:</strong> Considera trajetórias de 
                        desenvolvimento atípicas e individualizadas.
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Evidências de Validação</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      A escala foi submetida a processos rigorosos de validação para garantir 
                      sua confiabilidade, consistência interna e validade clínica em diferentes 
                      contextos e populações.
                    </p>
                    <div className="mt-3 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Estudos de Validação</h4>
                      <ul className="ml-4 list-disc text-sm space-y-2">
                        <li>
                          <strong>Concordância entre avaliadores:</strong> Estudos demonstraram 
                          alta confiabilidade entre diferentes profissionais utilizando a escala.
                        </li>
                        <li>
                          <strong>Validade de constructo:</strong> Análises confirmaram a 
                          correspondência entre os domínios da escala e constructos teóricos.
                        </li>
                        <li>
                          <strong>Sensibilidade a mudanças:</strong> A escala demonstrou capacidade 
                          de detectar alterações significativas após intervenções.
                        </li>
                        <li>
                          <strong>Aplicabilidade transcultural:</strong> Validação em diferentes 
                          contextos culturais e linguísticos.
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Aplicações em Pesquisa</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      A Escala de Avaliação TEA tem sido utilizada em diversos estudos, contribuindo 
                      para o avanço do conhecimento sobre autismo e eficácia de intervenções.
                    </p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <h4 className="font-medium mb-2">Linhas de Pesquisa</h4>
                        <ul className="ml-4 list-disc text-sm space-y-1">
                          <li>Perfis sensoriais e sua relação com comportamentos adaptativos</li>
                          <li>Desenvolvimento de comunicação social em diferentes subtipos</li>
                          <li>Eficácia comparativa de diferentes abordagens terapêuticas</li>
                          <li>Trajetórias longitudinais de desenvolvimento no espectro</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <h4 className="font-medium mb-2">Colaborações Interdisciplinares</h4>
                        <ul className="ml-4 list-disc text-sm space-y-1">
                          <li>Integração com estudos de neuroimagem</li>
                          <li>Correlações com marcadores biológicos</li>
                          <li>Pesquisas em psicologia do desenvolvimento</li>
                          <li>Estudos educacionais e de inclusão social</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-muted rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">Desenvolvimentos Futuros</h3>
                    <p className="text-sm leading-relaxed">
                      O desenvolvimento da escala é um processo contínuo, com atualizações 
                      baseadas em novas descobertas científicas e feedback da prática clínica.
                    </p>
                    <ul className="mt-3 ml-6 list-disc text-sm space-y-2">
                      <li>
                        Refinamento dos parâmetros para maior precisão em diferentes faixas etárias 
                        e níveis de desenvolvimento.
                      </li>
                      <li>
                        Desenvolvimento de versões adaptadas para contextos específicos, como 
                        ambiente escolar e primeira infância.
                      </li>
                      <li>
                        Integração com tecnologias digitais para coleta e análise de dados mais 
                        eficientes e precisas.
                      </li>
                      <li>
                        Expansão para contemplar aspectos emergentes na compreensão do autismo, 
                        como alexitimia e autorregulação.
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
              A Escala de Avaliação TEA representa um avanço significativo na abordagem 
              do Transtorno do Espectro Autista, oferecendo uma metodologia estruturada que 
              equilibra rigor científico e sensibilidade clínica. Ao proporcionar uma visão 
              multidimensional e individualizada, a escala contribui para um entendimento 
              mais profundo e abrangente das características, necessidades e potencialidades 
              de cada pessoa no espectro.
            </p>
            <p className="mt-4 leading-relaxed">
              O uso consistente desta ferramenta não apenas aprimora o processo de avaliação 
              e intervenção, mas também promove uma abordagem mais colaborativa entre profissionais, 
              famílias e a própria pessoa com TEA. Desta forma, a escala contribui para 
              intervenções mais personalizadas, eficazes e alinhadas com uma perspectiva de 
              respeito à neurodiversidade.
            </p>
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link to="/processes/evaluation">
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
