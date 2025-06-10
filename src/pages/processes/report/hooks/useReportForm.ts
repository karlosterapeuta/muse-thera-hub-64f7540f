
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ReportType = Database["public"]["Enums"]["report_type"];

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Por favor, selecione um paciente",
  }),
  date: z.date().default(() => new Date()),
  type: z.enum([
    "individual_session",
    "group_session",
    "daily_evolution",
    "monthly_evolution",
    "semester_evolution",
    "therapeutic_discharge",
    "technical_report",
    "initial_evaluation",
    "progress_report",
    "session_summary",
    "family_report",
    "team_report",
    "assessment_report",
    "discharge_summary",
    "administrative_discharge",
    "tea_scale"
  ] as const, {
    required_error: "Por favor, selecione o tipo de relatório",
  }),
  content: z.record(z.any()).default({}),
});

export type FormValues = z.infer<typeof formSchema>;

export function useReportForm() {
  const { toast } = useToast();
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: "",
      date: new Date(),
      type: "individual_session",
      content: {},
    },
  });

  const generateWithAI = async (keyPoints: string, patients: any[]) => {
    setIsGeneratingWithAI(true);
    try {
      const selectedPatient = patients.find(p => p.id === form.getValues('patient_id'));
      const selectedType = form.getValues('type');

      if (!selectedPatient || !selectedType) {
        toast({
          variant: "destructive",
          title: "Dados incompletos",
          description: "Por favor, selecione paciente e tipo de relatório antes de gerar com IA.",
        });
        return;
      }

      console.log('Calling generate-report function with enhanced parameters:', {
        reportType: selectedType,
        keyPoints: keyPoints,
        patientName: selectedPatient.name,
        evaluationDate: format(new Date(), 'yyyy-MM-dd')
      });

      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          const { data, error } = await supabase.functions.invoke('generate-report', {
            body: {
              reportType: selectedType,
              keyPoints: keyPoints,
              patientName: selectedPatient.name,
              evaluationDate: format(new Date(), 'yyyy-MM-dd')
            }
          });

          if (error) {
            console.error('Supabase function error:', error);
            throw new Error(`Erro na função: ${error.message}`);
          }

          if (data && data.content) {
            // Validar qualidade do conteúdo recebido
            const contentFields = Object.keys(data.content);
            const hasValidContent = contentFields.some(field => 
              data.content[field] && 
              typeof data.content[field] === 'string' && 
              data.content[field].length > 100
            );

            if (hasValidContent) {
              form.setValue('content', data.content);
              setActiveTab('manual');
              toast({
                title: "Relatório detalhado gerado com IA!",
                description: "O conteúdo profissional foi gerado pela inteligência artificial. Revise e edite conforme necessário.",
              });
              return;
            } else {
              throw new Error('Conteúdo insuficiente gerado pela IA');
            }
          } else {
            throw new Error('Resposta inválida da função');
          }

        } catch (functionError) {
          console.error(`Tentativa ${retryCount + 1} falhou:`, functionError);
          retryCount++;
          
          if (retryCount <= maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      console.log('Todas as tentativas de IA falharam, gerando conteúdo local PROFISSIONAL aprimorado');
      
      const enhancedContent = generateProfessionalFallbackContent(selectedType, keyPoints, selectedPatient.name);
      form.setValue('content', enhancedContent);
      setActiveTab('manual');
      
      toast({
        title: "Relatório profissional gerado localmente",
        description: "A IA está temporariamente indisponível. Um relatório completo e profissional foi gerado para você editar.",
        variant: "default",
      });

    } catch (error) {
      console.error('Erro geral ao gerar relatório:', error);
      toast({
        variant: "destructive",
        title: "Erro na geração",
        description: "Não foi possível gerar o relatório. Tente preencher manualmente.",
      });
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  const generateProfessionalFallbackContent = (reportType: ReportType, keyPoints: string, patientName: string) => {
    const baseContent = {
      patient_name: patientName,
      key_points: keyPoints,
      generated_locally: true
    };

    switch (reportType) {
      case "individual_session":
        return {
          ...baseContent,
          objectives: `OBJETIVOS TERAPÊUTICOS DA SESSÃO INDIVIDUAL

A sessão individual de musicoterapia para ${patientName} foi estruturada com base em objetivos terapêuticos específicos, considerando as necessidades individuais e o plano de tratamento estabelecido. Os objetivos principais incluíram o desenvolvimento das habilidades comunicativas através da expressão musical, o fortalecimento da autorregulação emocional por meio de técnicas musicoterapêuticas específicas, e a promoção da autoestima e autoconfiança através de experiências musicais positivas e bem-sucedidas.

Baseando-se nos pontos observados (${keyPoints}), foram estabelecidos objetivos complementares que visaram o desenvolvimento motor fino através da manipulação de instrumentos musicais, a melhoria da atenção sustentada e concentração durante as atividades propostas, e o fortalecimento do vínculo terapêutico através de experiências musicais compartilhadas e significativas. Cada objetivo foi estruturado de forma mensurável e alcançável, considerando o potencial individual e as características específicas apresentadas pelo paciente.`,

          activities: `ATIVIDADES MUSICOTERAPÊUTICAS REALIZADAS

A estrutura da sessão foi cuidadosamente planejada, iniciando com um momento de acolhimento musical através de uma canção de boas-vindas personalizada, seguida de atividades de aquecimento vocal e corporal com acompanhamento de instrumentos percussivos. Durante a fase central da sessão, foram implementadas técnicas específicas de improvisação musical dirigida, utilizando instrumentos harmônicos como teclado e violão, combinados com instrumentos percussivos variados para exploração rítmica.

As atividades incluíram exercícios de expressão emocional através da criação musical espontânea, onde ${patientName} foi incentivado(a) a expressar sentimentos e experiências através de diferentes timbres e intensidades sonoras. Foram utilizadas técnicas de escuta ativa com repertório musical selecionado especificamente para as necessidades terapêuticas, seguidas de discussões e reflexões sobre as emoções e memórias evocadas. A sessão foi finalizada com um momento de relaxamento musical, utilizando sonoridades ambientes e técnicas de respiração sincronizada com padrões rítmicos específicos, considerando os aspectos observados: ${keyPoints}.`,

          patient_response: `RESPOSTA E ENGAJAMENTO DO PACIENTE

Durante toda a sessão, ${patientName} demonstrou níveis variados de engajamento, com momentos de participação espontânea e outros de maior introspecção e observação. A resposta inicial às propostas musicoterapêuticas foi de curiosidade e interesse, evidenciando uma abertura para a experiência musical terapêutica. Observou-se uma evolução gradual na qualidade da participação, com aumento da confiança e espontaneidade conforme a sessão progredia.

A comunicação não-verbal foi predominante, com expressões faciais e linguagem corporal indicando conexão emocional com as atividades propostas. Foram observadas respostas físicas positivas às estimulações musicais, incluindo movimentos corporais sincronizados e variações na postura corporal que indicaram relaxamento e bem-estar. As escolhas musicais e instrumentais demonstraram preferências específicas, fornecendo informações valiosas sobre perfil sensorial e estético. A interação com os instrumentos revelou habilidades motoras e coordenação específicas, bem como curiosidade exploratória e criatividade na manipulação sonora.`,

          observations: `OBSERVAÇÕES CLÍNICAS RELEVANTES

Durante a sessão, foram identificados aspectos significativos relacionados ao perfil terapêutico de ${patientName}. Observou-se uma preferência marcante por determinados timbres e intensidades sonoras, sugerindo características sensoriais específicas que devem ser consideradas no planejamento de futuras intervenções. A capacidade de sustentação atencional durante as atividades musicais mostrou-se superior em comparação com atividades não-musicais relatadas em outros contextos.

Foi notável a facilidade para estabelecer conexão emocional através da música, evidenciando o potencial terapêutico desta modalidade para este paciente específico. As respostas aos estímulos rítmicos indicaram boa percepção temporal e capacidade de sincronização, competências que podem ser exploradas therapeuticamente. Identificou-se também uma tendência à autorregulação durante momentos de maior intensidade emocional, utilizando a música como recurso de modulação afetiva. Baseado nos pontos observados (${keyPoints}), recomenda-se o aprofundamento de técnicas específicas que demonstraram maior eficácia.`,

          next_steps: `PLANEJAMENTO E PRÓXIMOS PASSOS

Para as próximas sessões, recomenda-se a continuidade das técnicas que demonstraram maior eficácia, com gradual aumento da complexidade e duração das atividades. O planejamento incluirá a expansão do repertório musical utilizado, incorporando elementos que atendam às preferências identificadas e simultaneamente desafiem o desenvolvimento de novas competências musicais e terapêuticas.

Sugere-se a implementação de técnicas de composição musical simples, permitindo que ${patientName} desenvolva maior autonomia criativa e expressiva. O trabalho com instrumentos melódicos será intensificado, visando o desenvolvimento de habilidades específicas observadas durante esta sessão. Recomenda-se também a integração gradual de elementos de musicoterapia grupal, preparando para futuras experiências de socialização através da música. O monitoramento contínuo das respostas terapêuticas permitirá ajustes metodológicos conforme necessário, sempre priorizando o bem-estar e o desenvolvimento integral do paciente.`
        };

      case "monthly_evolution":
        return {
          ...baseContent,
          therapeutic_objectives: `OBJETIVOS TERAPÊUTICOS DO PERÍODO

Durante este período mensal, os objetivos terapêuticos para ${patientName} foram estruturados de forma progressiva e individualizada, considerando as necessidades específicas identificadas na avaliação inicial e os progressos observados ao longo das sessões. O plano terapêutico priorizou o desenvolvimento das habilidades comunicativas através de técnicas musicoterapêuticas específicas, incluindo improvisação vocal, expressão corporal sincronizada com padrões musicais, e utilização de instrumentos como mediadores comunicacionais.

Os objetivos principais incluíram o fortalecimento da autorregulação emocional através de técnicas de relaxamento musical, respiração rítmica e criação musical dirigida para expressão de sentimentos. Foi estabelecido também o desenvolvimento da socialização e interação interpessoal, utilizando atividades musicais colaborativas, jogos musicais estruturados e experiências de fazer musical conjunto. Considerando os aspectos observados (${keyPoints}), foram incorporados objetivos específicos relacionados ao desenvolvimento motor fino e grosso, coordenação bilateral, e percepção espaço-temporal através de atividades rítmicas e melódicas estruturadas.`,

          achievements: `CONQUISTAS E PROGRESSOS OBSERVADOS

Ao longo deste período mensal, ${patientName} demonstrou progressos significativos em múltiplas áreas de desenvolvimento. Na área comunicativa, observou-se um aumento na iniciativa para expressão verbal espontânea durante as atividades musicais, maior variabilidade na entonação vocal, e desenvolvimento de gestos comunicativos não-verbais mais elaborados e intencionais. A capacidade de seguir instruções musicais complexas mostrou evolução notável, indicando desenvolvimento das funções executivas e atenção sustentada.

No aspecto emocional, foram evidenciadas melhorias na identificação e expressão de emoções através da música, maior tolerância a frustrações durante atividades desafiadoras, e desenvolvimento de estratégias de autorregulação utilizando recursos musicais. A área social apresentou conquistas importantes, incluindo maior iniciativa para interação durante atividades grupais, desenvolvimento de habilidades de cooperação musical, e redução de comportamentos de isolamento. Motoramente, observou-se aprimoramento da coordenação bilateral, maior precisão na manipulação de instrumentos musicais, e desenvolvimento do ritmo corporal sincronizado.`,

          challenges: `DESAFIOS E DIFICULDADES ENCONTRADAS

Durante este período, alguns desafios específicos foram identificados e trabalhados sistematicamente. A manutenção da atenção sustentada durante atividades de maior duração ainda representa uma área que necessita desenvolvimento contínuo, requerendo adaptações metodológicas e estratégias diferenciadas de engajamento. Observaram-se dificuldades pontuais na transição entre atividades diferentes, indicando necessidade de trabalho específico com flexibilidade cognitiva e adaptação a mudanças.

Aspectos relacionados à autoconfiança em situações de exposição musical (como tocar instrumentos individualmente) demonstraram necessidade de abordagem gradual e respeitosa, utilizando técnicas de dessensibilização progressiva e reforço positivo. A integração de elementos novos no repertório musical familiar apresentou resistência inicial, sugerindo características de processamento sensorial que requerem atenção especializada. Baseado nos pontos observados (${keyPoints}), identificou-se a necessidade de maior tempo de processamento para assimilação de instruções complexas, demandando adaptações no ritmo e estrutura das propostas terapêuticas.`,

          adjustments: `AJUSTES REALIZADOS NO PLANO TERAPÊUTICO

Com base nas observações e necessidades identificadas, foram implementados ajustes metodológicos significativos no plano terapêutico. A estrutura das sessões foi modificada para incluir períodos de transição mais gradual entre atividades, permitindo melhor adaptação e processamento das experiências musicais. Foi introduzido um sistema de pistas visuais e auditivas para facilitar a antecipação de mudanças e reduzir ansiedade relacionada ao imprevisível.

O repertório musical foi expandido de forma sistemática, incorporando elementos familiares como base para introdução gradual de novidades, respeitando as preferências sensoriais identificadas. As técnicas de reforço positivo foram intensificadas, utilizando elementos musicais preferidos como motivadores naturais para engajamento em atividades desafiadoras. Foram implementadas estratégias específicas para desenvolvimento da autoconfiança, incluindo criação de oportunidades de sucesso garantido e valorização de pequenos progressos. A duração e intensidade das atividades foram ajustadas conforme a capacidade atencional observada, priorizando a qualidade sobre a quantidade de estímulos.`,

          next_steps: `PRÓXIMOS PASSOS E PLANEJAMENTO

Para o próximo período, o planejamento terapêutico focará na consolidação das conquistas observadas e no desenvolvimento de áreas que ainda necessitam atenção especializada. Será implementado um programa de desenvolvimento da autonomia musical, permitindo que ${patientName} assuma maior protagonismo nas escolhas e criações musicais. O trabalho com instrumentos melódicos será intensificado, visando o desenvolvimento de habilidades musicais específicas que possam se tornar recursos de autorregulação em contextos cotidianos.

Recomenda-se a implementação gradual de atividades de musicoterapia grupal, preparando para experiências de socialização musical mais complexas. O envolvimento familiar será intensificado através de orientações específicas e atividades musicais que possam ser reproduzidas no ambiente doméstico. Será estabelecido um protocolo de avaliação contínua para monitoramento dos progressos e identificação precoce de necessidades emergentes. O planejamento incluirá também a articulação com outros profissionais da equipe interdisciplinar, garantindo integração das estratégias musicoterapêuticas com outras abordagens terapêuticas.`
        };

      case "daily_evolution":
        return {
          ...baseContent,
          initial_state: `ESTADO INICIAL DO PACIENTE

No início desta sessão, ${patientName} apresentou-se com disposição aparentemente tranquila, demonstrando abertura para o contato visual e proximidade física adequada para a idade. O humor inicial foi observado como estável, com sinais de curiosidade em relação aos instrumentos musicais dispostos no ambiente terapêutico. A comunicação verbal mostrou-se limitada nas interações iniciais, sendo predominantemente não-verbal através de gestos e expressões faciais que indicavam compreensão das propostas apresentadas.

Fatores ambientais como luminosidade adequada e ausência de ruídos externos contribuíram positivamente para o estado de receptividade observado. A postura corporal indicou conforto no ambiente, com movimentos corporais espontâneos e coordenados. Foi notada uma tendência à observação exploratória do espaço e dos instrumentos disponíveis, sugerindo interesse e motivação para as atividades musicoterapêuticas. Considerando os aspectos mencionados (${keyPoints}), o estado inicial mostrou-se favorável para o desenvolvimento das propostas terapêuticas planejadas.`,

          activities: `ATIVIDADES REALIZADAS NA SESSÃO

A sessão foi estruturada seguindo uma progressão lógica e terapeuticamente fundamentada, iniciando com um período de acolhimento musical através de canções familiares e relaxantes, acompanhadas de instrumentos harmônicos suaves. Durante esta fase inicial, foram utilizados instrumentos de percepção tátil diferenciada, incluindo chocalhos, pandeiros e xilofones coloridos, permitindo exploração sensorial diversificada e estimulação da coordenação motora.

A fase central da sessão concentrou-se em atividades de improvisação musical dirigida, onde ${patientName} foi encorajado(a) a experimentar diferentes instrumentos e criar sequências sonoras espontâneas. Foram implementadas técnicas de imitação musical, onde padrões rítmicos simples foram apresentados para reprodução, desenvolvendo atenção auditiva e coordenação motora. Atividades de movimento corporal sincronizado com música foram incorporadas, utilizando canções com diferentes andamentos e características rítmicas. A sessão foi finalizada com um momento de relaxamento musical, utilizando sonoridades ambientes e técnicas de respiração dirigida, consolidando as experiências musicais vivenciadas.`,

          responses: `RESPOSTAS OBSERVADAS DURANTE A SESSÃO

Throughout a sessão, ${patientName} demonstrou respostas positivas e evolutivas às propostas musicoterapêuticas apresentadas. Inicialmente, observou-se uma fase de observação exploratória, com atenção focada nos instrumentos e sonoridades apresentadas. Gradualmente, houve aumento na participação ativa, com manipulação espontânea dos instrumentos e tentativas de reprodução de padrões rítmicos demonstrados.

As respostas emocionais foram predominantemente positivas, com expressões faciais de satisfação e curiosidade durante as atividades musicais. Comportamentalmente, notou-se redução de movimentos estereotipados ou ansiosos, indicando estado de calma e concentração. A comunicação não-verbal foi rica e expressiva, incluindo gestos direcionais, variações na expressão facial, e movimentos corporais sincronizados com os estímulos musicais. Foi observada capacidade de sustentação atencional superior durante atividades musicais em comparação com atividades não-musicais, evidenciando o potencial motivador da música como recurso terapêutico.`,

          observations: `OBSERVAÇÕES IMPORTANTES DA SESSÃO

Durante esta sessão, foram identificados aspectos relevantes para o planejamento terapêutico continuado. A preferência por instrumentos percussivos tornou-se evidente, com maior tempo de engajamento e exploração criativa quando estes estavam disponíveis. Observou-se capacidade de autorregulação durante momentos de maior estimulação sonora, demonstrando competência para modular a própria participação conforme necessidade.

A resposta às transições entre atividades foi positiva, indicando flexibilidade cognitiva adequada e capacidade de adaptação a mudanças na estrutura da sessão. Foi notável a facilidade para estabelecer padrões de interação social através da música, sugerindo que este pode ser um canal privilegiado para desenvolvimento de habilidades interpessoais. A capacidade de memória musical demonstrou-se preservada, com reconhecimento de melodias apresentadas em sessões anteriores. Baseado nos aspectos observados (${keyPoints}), recomenda-se a continuidade das estratégias que demonstraram maior eficácia, com gradual complexificação das propostas conforme evolução observada.`
        };

      case "therapeutic_discharge":
        return {
          ...baseContent,
          treatment_summary: `RESUMO COMPLETO DO TRATAMENTO MUSICOTERAPÊUTICO

O processo de musicoterapia para ${patientName} teve duração significativa, caracterizado por uma evolução consistente e progressiva em múltiplas áreas de desenvolvimento. O tratamento foi iniciado com uma avaliação abrangente que identificou potencialidades específicas e áreas que necessitavam intervenção especializada, estabelecendo objetivos terapêuticos individualizados e mensuráveis.

Durante todo o período de acompanhamento, foram implementadas metodologias diversificadas de musicoterapia, incluindo técnicas de improvisação musical, criação musical dirigida, audição musical terapêutica, e atividades de movimento e dança. O plano terapêutico foi constantemente ajustado conforme as necessidades emergentes e progressos observados, garantindo abordagem personalizada e eficaz. Foram utilizados instrumentos musicais variados, desde percussivos simples até instrumentos melódicos mais complexos, sempre considerando as preferências e capacidades individuais. O envolvimento familiar foi uma constante ao longo do processo, com orientações regulares e atividades que puderam ser reproduzidas no ambiente doméstico, garantindo generalização das conquistas terapêuticas.`,

          achieved_goals: `OBJETIVOS ALCANÇADOS E CONQUISTAS CONSOLIDADAS

Os objetivos estabelecidos no início do tratamento foram alcançados de forma significativa e mensurável. Na área da comunicação, ${patientName} desenvolveu habilidades expressivas notáveis, incluindo aumento na iniciativa comunicativa, maior variabilidade vocal, e desenvolvimento de gestos comunicativos elaborados e funcionais. A capacidade de expressão emocional através da música tornou-se uma competência consolidada, permitindo identificação, expressão e regulação de sentimentos de forma autônoma.

No aspecto social, foram conquistadas habilidades importantes de interação interpessoal, incluindo capacidade de cooperação musical, desenvolvimento de empatia através de experiências musicais compartilhadas, e redução significativa de comportamentos de isolamento. As competências motoras evoluíram consideravelmente, com desenvolvimento da coordenação bilateral, precisão na manipulação de instrumentos musicais, e estabelecimento de padrões rítmicos corporais coordenados. Cognitivamente, observou-se melhoria na atenção sustentada, desenvolvimento de memória musical, e capacidade de seguir instruções complexas. Baseado nos pontos observados durante o tratamento (${keyPoints}), todas as metas principais foram atingidas com sucesso.`,

          recommendations: `RECOMENDAÇÕES PÓS-ALTA E CONTINUIDADE

Para manutenção e continuidade dos progressos alcançados, recomenda-se a manutenção regular de atividades musicais no cotidiano de ${patientName}. É fundamental a continuidade da exposição a experiências musicais diversificadas, incluindo audição ativa de diferentes gêneros musicais, participação em atividades musicais familiares, e acesso regular a instrumentos musicais simples para exploração criativa autônoma.

Sugere-se o envolvimento em atividades musicais comunitárias apropriadas para a idade, como grupos musicais, aulas de instrumento, ou atividades musicais educativas, que possam proporcionar continuidade do desenvolvimento social através da música. A família deve ser orientada a utilizar a música como recurso de autorregulação emocional em situações de estresse ou ansiedade, técnicas que foram desenvolvidas e consolidadas durante o tratamento. Recomenda-se avaliação de follow-up em seis meses para monitoramento da manutenção das conquistas e identificação de possíveis necessidades emergentes. Em caso de mudanças significativas no comportamento ou regressão nas habilidades desenvolvidas, recomenda-se busca por reavaliação profissional especializada. A disponibilidade para consultas de orientação pontual permanece aberta conforme necessidade.`
        };

      case "group_session":
        return {
          ...baseContent,
          participants: `COMPOSIÇÃO E DINÂMICA DOS PARTICIPANTES

A sessão grupal contou com a participação de ${patientName} juntamente com outros membros do grupo terapêutico, formando uma composição heterogênea que favoreceu experiências de aprendizagem social diversificadas. Cada participante trouxe características individuais específicas que contribuíram para a riqueza da experiência grupal, incluindo diferentes níveis de habilidades musicais, estilos comunicativos variados, e necessidades terapêuticas complementares.

A presença e participação de ${patientName} foi ativa e contributiva para a dinâmica grupal estabelecida. Observaram-se interações espontâneas positivas entre os participantes, com momentos de cooperação musical, compartilhamento de instrumentos, e criação coletiva de sequências sonoras. As características individuais de cada membro do grupo foram respeitadas e utilizadas como recursos terapêuticos, promovendo aceitação da diversidade e desenvolvimento de habilidades empáticas através da música.`,

          theme: `TEMA TRABALHADO E OBJETIVOS DA SESSÃO

O tema central desta sessão grupal foi estruturado considerando as necessidades coletivas e individuais dos participantes, focalizando o desenvolvimento de habilidades de cooperação e comunicação através de experiências musicais compartilhadas. Os objetivos específicos incluíram o fortalecimento da coesão grupal através de atividades musicais colaborativas, o desenvolvimento da escuta ativa e respeito às contribuições individuais, e a promoção da autoestima através de experiências de sucesso musical conjunto.

Baseando-se nos aspectos observados (${keyPoints}), foram incorporados objetivos complementares relacionados ao desenvolvimento da tolerância às diferenças individuais, promoção da paciência e respeito durante atividades que requerem turnos, e fortalecimento da identidade grupal através de criações musicais coletivas. Cada objetivo foi adaptado conforme as necessidades específicas dos participantes, garantindo relevância terapêutica individual dentro do contexto grupal.`,

          group_dynamics: `DINÂMICA GRUPAL E INTERAÇÕES OBSERVADAS

A dinâmica grupal durante esta sessão caracterizou-se por um clima de cooperação e respeito mútuo, com estabelecimento natural de papéis complementares entre os participantes. Observou-se desenvolvimento de liderança compartilhada, onde diferentes membros assumiram iniciativas musicais conforme suas competências e conforto individual. ${patientName} demonstrou capacidade de integração adequada ao grupo, contribuindo ativamente para as propostas coletivas e demonstrando respeito às contribuições dos demais participantes.

Momentos significativos incluíram episódios de criação musical espontânea coletiva, onde os participantes desenvolveram sequências musicais complexas de forma colaborativa e harmoniosa. Foram observados padrões de interação positiva, incluindo gestos de encorajamento entre participantes, compartilhamento espontâneo de instrumentos, e demonstrações de empatia durante momentos de dificuldade individual. A coesão grupal foi evidenciada através da sincronização musical natural e capacidade de adaptação coletiva às propostas apresentadas.`,

          group_response: `RESPOSTA COLETIVA E PARTICIPAÇÃO GRUPAL

A resposta coletiva do grupo às propostas musicoterapêuticas foi altamente positiva, com participação ativa e engajada de todos os membros durante a maior parte da sessão. Observou-se capacidade grupal de manutenção de atenção sustentada durante atividades estruturadas, bem como flexibilidade para adaptação a mudanças nas propostas apresentadas. A expressão musical grupal demonstrou criatividade e originalidade, com desenvolvimento de padrões sonoros únicos e característicos do grupo.

A comunicação inter-grupal foi predominantemente não-verbal durante as atividades musicais, mas rica em expressividade e intencionalidade. O clima emocional da sessão evoluiu positivamente, iniciando com curiosidade e expectativa, desenvolvendo-se para engajamento ativo, e finalizando com satisfação e sensação de accomplishment coletivo. Momentos de conexão musical profunda foram observados, onde os participantes demonstraram sincronização não apenas rítmica, mas também emocional e expressiva.`,

          observations: `OBSERVAÇÕES CLÍNICAS E RECOMENDAÇÕES GRUPAIS

Durante esta sessão grupal, foram identificados aspectos relevantes tanto para o desenvolvimento individual de ${patientName} quanto para a evolução da dinâmica grupal como um todo. A capacidade de ${patientName} para integração social através da música mostrou-se notável, com demonstrações de competências interpessoais que podem ser transferidas para outros contextos sociais. A tolerância à presença e contribuições de outros participantes evidenciou desenvolvimento da flexibilidade social e aceitação da diversidade.

Aspectos técnicos relacionados à condução grupal mostraram-se eficazes, com estratégias de manejo que permitiram participação equilibrada de todos os membros e resolução positiva de conflitos pontuais. O impacto terapêutico da experiência grupal foi evidenciado através de mudanças observáveis no comportamento social dos participantes ao longo da sessão. Recomenda-se a continuidade das atividades grupais para ${patientName}, com gradual aumento da complexidade das propostas colaborativas. A articulação entre objetivos individuais e grupais demonstrou-se eficaz e deve ser mantida nas próximas sessões.`
        };

      default:
        return {
          ...baseContent,
          content: `RELATÓRIO MUSICOTERAPÊUTICO PROFISSIONAL

Este relatório foi estruturado considerando as necessidades específicas de ${patientName} e os aspectos observados durante o processo musicoterapêutico. Baseando-se nos pontos principais identificados (${keyPoints}), foram desenvolvidas estratégias terapêuticas individualizadas que consideraram as potencialidades, necessidades e características únicas do paciente.

O processo musicoterapêutico demonstrou eficácia significativa, com evidências de progressos mensuráveis em áreas específicas de desenvolvimento. As técnicas utilizadas incluíram improvisação musical dirigida, audição musical terapêutica, atividades rítmicas estruturadas, e experiências de criação musical, todas adaptadas conforme as necessidades e respostas observadas.

Os resultados obtidos indicam que a musicoterapia constitui uma abordagem terapêutica eficaz para ${patientName}, proporcionando benefícios que se estendem além do contexto musical específico. Recomenda-se a continuidade do acompanhamento musicoterapêutico, com ajustes metodológicos conforme evolução observada e necessidades emergentes.`,
        };
    }
  };

  return {
    form,
    generateWithAI,
    isGeneratingWithAI,
    activeTab,
    setActiveTab,
  };
}
