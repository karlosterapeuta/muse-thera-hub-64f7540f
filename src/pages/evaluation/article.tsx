
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, FlaskConical, Scale, GraduationCap, Lightbulb, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EvaluationArticle() {
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Faculdade Alpha — Curso de Especialização em Musicoterapia</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mt-2 leading-tight">
                O Uso do Sistema MuseTera nas Práticas Clínicas do Musicoterapeuta
              </h1>
              <p className="text-muted-foreground text-base mt-2">
                Um Estudo de Caso sobre Implementação de Tecnologia Digital na Musicoterapia
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Autor:</strong> José Carlos Batista da Silva &nbsp;|&nbsp; <strong>Orientador:</strong> Prof. Msc. Bruno Marones
              </p>
              <p className="text-xs text-muted-foreground mt-1">Recife / 2025</p>
            </div>
            <Button variant="outline" asChild className="shrink-0">
              <Link to="/evaluation">Ir para Avaliação</Link>
            </Button>
          </div>

          {/* Resumo */}
          <Card className="border bg-card">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Resumo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="leading-relaxed text-sm">
                O artigo analisa o uso do sistema MuseTera nas práticas clínicas do musicoterapeuta José Batista da Silva Filho, destacando a aplicação de tecnologias digitais na musicoterapia. O MuseTera é uma plataforma que auxilia no gerenciamento de pacientes, agendamento de sessões, criação de planos terapêuticos e acompanhamento de resultados. O estudo, de abordagem qualitativa e caráter descritivo, baseado em entrevistas, observações e análise documental, acompanhou por seis meses o uso do sistema com 10 pacientes. Os resultados mostraram maior engajamento dos pacientes e melhor monitoramento do progresso terapêutico pelo profissional. Além de otimizar a gestão clínica e a organização dos dados, o MuseTera contribuiu para um atendimento mais eficiente e personalizado. O estudo reforça o potencial da tecnologia em aprimorar a musicoterapia sem perder o caráter humanizado do tratamento e aponta o MuseTera como modelo de inovação aplicável a outras áreas da saúde.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["MuseTera", "Musicoterapia", "Tecnologia Digital", "Inovação", "Gestão Clínica"].map(tag => (
                  <span key={tag} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">{tag}</span>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                <h4 className="font-semibold text-sm mb-2">Abstract</h4>
                <p className="leading-relaxed text-sm text-muted-foreground">
                  This article analyzes the use of the MuseTera system in the clinical practices of music therapist José Batista da Silva Filho, highlighting the integration of digital technologies in music therapy. MuseTera is a platform that facilitates patient management, session scheduling, therapeutic planning, and progress monitoring. The six-month study with ten patients showed increased engagement, therapeutic efficiency, and better clinical organization. It concludes that MuseTera enhances music therapy practice while preserving its humanized approach and serves as an innovation model for healthcare.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="introducao" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 mb-4 h-auto">
            <TabsTrigger value="introducao" className="text-xs sm:text-sm">Introdução</TabsTrigger>
            <TabsTrigger value="metodologia" className="text-xs sm:text-sm">Metodologia</TabsTrigger>
            <TabsTrigger value="referencial" className="text-xs sm:text-sm">Referencial</TabsTrigger>
            <TabsTrigger value="escala" className="text-xs sm:text-sm">Escala TEA</TabsTrigger>
            <TabsTrigger value="consideracoes" className="text-xs sm:text-sm">Considerações</TabsTrigger>
          </TabsList>

          {/* INTRODUÇÃO */}
          <TabsContent value="introducao" className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  1. Introdução
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-4 text-sm leading-relaxed">
                <p>
                  A musicoterapia é uma prática terapêutica que utiliza a música e seus componentes, como ritmo, melodia e harmonia, com o objetivo de promover o bem-estar físico, emocional e psicológico dos indivíduos. Essa abordagem tem sido amplamente reconhecida como eficaz no tratamento de uma variedade de condições de saúde, abrangendo distúrbios emocionais, psicológicos, motores e de comunicação. Segundo Bruscia (2014), a musicoterapia é definida como uma intervenção terapêutica que utiliza a música para atender às necessidades emocionais, cognitivas e sociais dos pacientes.
                </p>
                <p>
                  Nos últimos anos, a integração de tecnologias digitais na área da saúde tem proporcionado novos horizontes para a prática de diversas terapias, incluindo a musicoterapia. Aigen (2014) reforça que a flexibilidade é um aspecto essencial da musicoterapia, permitindo que o terapeuta ajuste a terapia de acordo com as respostas dos pacientes, processo que pode ser significativamente aprimorado com o uso de plataformas digitais como o MuseTera.
                </p>
                <p>
                  O <strong>MuseTera</strong> é uma plataforma digital inovadora, desenvolvida por José Carlos Batista da Silva, que visa oferecer uma solução completa para os profissionais de musicoterapia. A plataforma permite a organização de pacientes, o agendamento de sessões, a criação de planos de tratamento personalizados e o monitoramento contínuo do progresso terapêutico. O sistema também oferece funcionalidades como a <strong>Escala de Avaliação MuseTera TEA</strong>, que avalia multidimensionalmente pacientes com Transtorno do Espectro Autista (TEA).
                </p>
                <p>
                  O problema central deste estudo é investigar como a utilização do sistema MuseTera nas práticas de musicoterapia impacta os resultados terapêuticos, a gestão clínica e a personalização dos tratamentos oferecidos aos pacientes.
                </p>

                <div className="p-4 bg-muted rounded-lg border border-border">
                  <h4 className="font-semibold mb-2">Objetivos do Estudo</h4>
                  <ul className="ml-4 list-disc space-y-1 text-sm">
                    <li>Analisar a utilização das funcionalidades do MuseTera nas sessões de musicoterapia</li>
                    <li>Avaliar a percepção dos pacientes sobre a personalização do tratamento</li>
                    <li>Investigar como o MuseTera auxilia na organização clínica e gestão de pacientes</li>
                    <li>Identificar os benefícios e limitações do uso do MuseTera na prática clínica</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-base mt-6">1.1 Justificativa</h3>
                <p>
                  A musicoterapia tem se consolidado como uma abordagem terapêutica relevante no cuidado à saúde, especialmente em contextos que envolvem aspectos emocionais, cognitivos, comunicacionais e motores. No entanto, apesar dos avanços teóricos e clínicos da área, ainda se observam desafios importantes relacionados à organização da prática, ao registro sistemático dos atendimentos e ao acompanhamento longitudinal do progresso dos pacientes.
                </p>
                <p>
                  Em muitos serviços, o musicoterapeuta ainda depende de registros manuais, pouco padronizados e de difícil integração com dados clínicos mais amplos. Revisões e estudos em eHealth e engajamento do paciente indicam que plataformas digitais podem favorecer uma prática mais centrada no usuário, baseada em dados e com maior eficiência organizacional (BARELLO et al., 2016).
                </p>
                <p>
                  A escolha de investigar o uso do MuseTera nas práticas clínicas do musicoterapeuta José Batista da Silva Filho se justifica pelo fato de se tratar de um contexto em que a plataforma já está efetivamente integrada ao cotidiano terapêutico. Esse cenário real de aplicação permite observar, em profundidade, não apenas as potencialidades do sistema, mas também seus limites, implicações práticas e efeitos concretos sobre a organização da clínica, a relação terapeuta–paciente e a personalização dos tratamentos.
                </p>
                <p>
                  Do ponto de vista científico, o estudo contribui para preencher uma lacuna na literatura ao articular três dimensões ainda pouco exploradas em conjunto: <strong>musicoterapia, tecnologia digital e gestão clínica</strong>.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* METODOLOGIA */}
          <TabsContent value="metodologia" className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-primary" />
                  2. Metodologia
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-4 text-sm leading-relaxed">
                <p>
                  A metodologia deste estudo segue uma abordagem <strong>qualitativa</strong>, com o objetivo de compreender, a partir de uma perspectiva exploratória e descritiva, o impacto do uso do sistema MuseTera nas práticas clínicas. De acordo com Creswell (2013), a pesquisa qualitativa permite explorar as experiências e percepções dos participantes em profundidade, fornecendo insights valiosos sobre contextos específicos.
                </p>
                <p>
                  O estudo é conduzido por meio de um <strong>estudo de caso</strong>, uma metodologia que visa investigar um fenômeno em um contexto real e específico. Segundo Yin (2018), o estudo de caso é uma abordagem eficaz quando se deseja obter uma compreensão detalhada sobre um fenômeno específico dentro de seu contexto real.
                </p>

                <h3 className="font-semibold text-base mt-4">Amostra e Contexto</h3>
                <p>
                  A amostra foi composta por <strong>10 pacientes</strong> atendidos pelo musicoterapeuta José Batista da Silva Filho, com idades e condições clínicas variadas. A pesquisa foi realizada em um período de <strong>seis meses</strong>, durante o qual o sistema MuseTera foi integrado a todas as sessões de musicoterapia.
                </p>

                <h3 className="font-semibold text-base mt-4">Procedimentos de Coleta de Dados</h3>
                <ol className="ml-5 list-decimal space-y-3">
                  <li>
                    <strong>Observação participante:</strong> O pesquisador acompanhou as sessões de musicoterapia realizadas com o auxílio do MuseTera, observando diretamente as interações entre o terapeuta e os pacientes (MERRIAM, 2009).
                  </li>
                  <li>
                    <strong>Entrevistas semiestruturadas:</strong> Foram realizadas entrevistas com o musicoterapeuta e com os pacientes ao final de cada mês de acompanhamento (KVALE; BRINKMANN, 2009).
                  </li>
                  <li>
                    <strong>Análise de relatórios do MuseTera:</strong> Os relatórios detalhados gerados pela plataforma sobre o progresso dos pacientes foram analisados para fornecer dados objetivos.
                  </li>
                </ol>

                <h3 className="font-semibold text-base mt-4">Análise de Dados</h3>
                <p>
                  Os dados foram analisados por meio da técnica de <strong>análise de conteúdo</strong>, conforme descrita por Bardin (2011). A triangulação dos dados obtidos por meio das entrevistas, observação e relatórios permitiu uma análise mais robusta e aprofundada.
                </p>

                <div className="p-4 bg-muted rounded-lg border border-border mt-4">
                  <h4 className="font-semibold mb-2">Considerações Éticas</h4>
                  <ul className="ml-4 list-disc space-y-1 text-sm">
                    <li>Consentimento informado obtido por escrito de todos os participantes</li>
                    <li>Dados anonimizados com códigos identificadores</li>
                    <li>Direito à privacidade e possibilidade de desistência a qualquer momento</li>
                    <li>Estudo aprovado pelo Comitê de Ética em Pesquisa</li>
                    <li>Resultados compartilhados apenas em contextos acadêmicos e científicos</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REFERENCIAL TEÓRICO */}
          <TabsContent value="referencial" className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  3. Referencial Teórico
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-5 text-sm leading-relaxed">
                <p>
                  O referencial teórico deste estudo é fundamentado nas contribuições de autores renomados no campo da musicoterapia, da pesquisa qualitativa em saúde e das tecnologias digitais aplicadas ao cuidado.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <h4 className="font-semibold mb-2">Musicoterapia e Personalização do Tratamento</h4>
                    <p className="text-muted-foreground">
                      Segundo Bruscia (2014), a musicoterapia é uma intervenção clínica e baseada em evidências que utiliza a música, de forma sistemática, para atender às necessidades emocionais, cognitivas, sociais e físicas dos indivíduos. O autor enfatiza que a personalização do tratamento é um dos pilares dessa abordagem. O uso de plataformas como o MuseTera permite que o terapeuta personalize ainda mais os tratamentos, proporcionando uma experiência mais ajustada às necessidades individuais dos pacientes.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <h4 className="font-semibold mb-2">Inovação na Musicoterapia por meio da Tecnologia</h4>
                    <p className="text-muted-foreground">
                      Aigen (2014) discute a música como forma de relacionamento e experiência compartilhada, destacando que a intervenção musicoterapêutica deve ser continuamente ajustada às respostas do paciente. A plataforma MuseTera contribui para essa flexibilidade ao fornecer recursos para personalizar os tratamentos, registrar as respostas ao longo do tempo e ajustar os estímulos musicais de acordo com as necessidades emergentes.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <h4 className="font-semibold mb-2">A Tecnologia como Facilitadora</h4>
                    <p className="text-muted-foreground">
                      Barello et al. (2016) destacam o papel das plataformas digitais na personalização do cuidado e na ampliação do acesso a informações e recursos. No contexto da musicoterapia, o MuseTera, ao integrar funções de criação de planos de tratamento personalizados, monitoramento do progresso e geração de relatórios, permite ao musicoterapeuta adaptar a terapia de forma mais eficaz.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <h4 className="font-semibold mb-2">Gestão Clínica na Musicoterapia</h4>
                    <p className="text-muted-foreground">
                      Wheeler (2015) oferece uma visão abrangente sobre a organização das terapias no contexto da musicoterapia, destacando a importância da avaliação contínua do progresso do paciente e do planejamento sistemático das intervenções. A capacidade de coletar e analisar dados em tempo real, proporcionada pelo MuseTera, viabiliza um ciclo contínuo de avaliação, intervenção e reavaliação.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ESCALA TEA */}
          <TabsContent value="escala" className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Escala de Avaliação MuseTera TEA
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-4 text-sm leading-relaxed">
                <p>
                  Uma das contribuições importantes do MuseTera é a <strong>Escala de Avaliação MuseTera TEA</strong>, desenvolvida para a análise multidimensional de pacientes com Transtorno do Espectro Autista (TEA), uma das condições frequentemente atendidas em sessões de musicoterapia.
                </p>
                <p>
                  A Escala utiliza um sistema de pontuação expandido (0–5), permitindo uma análise detalhada de diferentes aspectos do desenvolvimento dos pacientes. Foi estruturada em <strong>cinco domínios principais</strong>:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
                    <h4 className="font-semibold text-violet-800 dark:text-violet-300 mb-1">1. Musical</h4>
                    <p className="text-xs text-violet-700 dark:text-violet-400">
                      Avalia a percepção, expressão e compreensão musical do paciente, refletindo a capacidade de interagir com a música em níveis cognitivos e emocionais.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">2. Psicossocial</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Analisa a interação social, a regulação emocional, a autoestima e o autoconceito do paciente.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">3. Cognitivo</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Focaliza funções executivas, processamento da informação e aprendizagem musical.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">4. Sensório-motor</h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      Examina a coordenação motora, o processamento sensorial e o desenvolvimento motor.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 md:col-span-2">
                    <h4 className="font-semibold text-rose-800 dark:text-rose-300 mb-1">5. Comunicativo-interativo</h4>
                    <p className="text-xs text-rose-700 dark:text-rose-400">
                      Avalia a comunicação verbal e não verbal, a pragmática e a interação terapêutica, importantes para o desenvolvimento das habilidades de comunicação e interação social.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg border border-border">
                  <h4 className="font-semibold mb-2">Sistema de Pontuação</h4>
                  <p className="text-muted-foreground text-xs">
                    A escala utiliza seis níveis (0–5), em que 0 indica ausência de comportamento observado e 5 representa desempenho excepcional para a faixa etária/contexto do paciente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONSIDERAÇÕES FINAIS */}
          <TabsContent value="consideracoes" className="space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  4. Considerações Finais
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-4 text-sm leading-relaxed">
                <p>
                  O estudo realizado com o sistema MuseTera nas práticas clínicas de musicoterapia demonstrou que a implementação de tecnologias digitais tem o potencial de transformar a prática terapêutica de maneira significativa. A plataforma MuseTera, ao integrar funções de gestão clínica, agendamento, personalização de planos de tratamento e monitoramento contínuo do progresso terapêutico, não só otimizou a organização da clínica, como também aprimorou a personalização das terapias oferecidas aos pacientes.
                </p>
                <p>
                  Para os pacientes, houve uma sensação de maior envolvimento nas sessões, uma vez que os tratamentos foram ajustados de acordo com suas necessidades individuais, criando uma experiência mais personalizada e potencialmente mais eficaz. A utilização de uma plataforma que possibilita a adaptação contínua da terapia se alinha com os princípios da musicoterapia (BRUSCIA, 2014).
                </p>
                <p>
                  A plataforma proporcionou uma experiência terapêutica mais eficiente, otimizando o tempo do terapeuta e permitindo que ele se concentrasse mais na interação clínica e menos em tarefas administrativas. A gestão eficiente do agendamento, o armazenamento centralizado de informações e o fornecimento de relatórios detalhados reduziram a sobrecarga administrativa e melhoraram a organização da prática clínica (BARELLO et al., 2016).
                </p>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-2 text-primary">Conclusão Principal</h4>
                  <p>
                    A pesquisa indica que a integração de ferramentas digitais, como o MuseTera, na prática da musicoterapia representa uma evolução significativa no campo, oferecendo aos profissionais uma maneira mais eficaz de personalizar e monitorar os tratamentos, melhorar a gestão clínica e otimizar o atendimento ao paciente. A tecnologia deve ser vista como uma ferramenta complementar que potencializa a eficácia da musicoterapia, sem substituir os princípios que fundamentam essa prática.
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg border border-border">
                  <h4 className="font-semibold mb-2">Limitações e Perspectivas Futuras</h4>
                  <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Amostra relativamente pequena e em um único contexto clínico</li>
                    <li>Necessidade de ampliar a amostra e incluir diferentes contextos de aplicação</li>
                    <li>Análise longitudinal para insights mais profundos sobre o impacto ao longo do tempo</li>
                    <li>Explorar o impacto em pacientes com condições específicas (transtornos graves de saúde mental, deficiência física, distúrbios de comunicação)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Referências */}
        <Card className="border">
          <CardHeader>
            <CardTitle>Referências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>AIGEN, K. <em>The study of music therapy: current issues and concepts.</em> New York: Routledge, 2014.</p>
            <p>BARDIN, L. <em>Análise de conteúdo.</em> São Paulo: Edições 70, 2011.</p>
            <p>BARELLO, S. et al. eHealth for patient engagement: a systematic review. <em>Frontiers in Psychology</em>, v. 6, art. 2013, 2016.</p>
            <p>BRUSCIA, K. E. <em>Defining music therapy.</em> 3rd ed. Gilsum: Barcelona Publishers, 2014.</p>
            <p>CRESWELL, J. W. <em>Qualitative inquiry and research design.</em> 3rd ed. Thousand Oaks: Sage, 2013.</p>
            <p>KVALE, S.; BRINKMANN, S. <em>InterViews: learning the craft of qualitative research interviewing.</em> 2nd ed. Thousand Oaks: Sage, 2009.</p>
            <p>MERRIAM, S. B. <em>Qualitative research: a guide to design and implementation.</em> San Francisco: Jossey-Bass, 2009.</p>
            <p>WHEELER, B. L. <em>Music therapy handbook.</em> New York: Guilford Press, 2015.</p>
            <p>YIN, R. K. <em>Case study research and applications.</em> 6th ed. Thousand Oaks: Sage, 2018.</p>
            
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link to="/evaluation">Experimente a Avaliação</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
