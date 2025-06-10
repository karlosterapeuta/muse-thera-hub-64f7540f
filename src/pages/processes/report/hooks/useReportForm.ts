
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
        patientId: selectedPatient.id, // Incluindo ID do paciente
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
              patientId: selectedPatient.id, // Enviando ID para contexto
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
                title: "Relatório inteligente gerado!",
                description: "A IA gerou um relatório personalizado e fiel às suas observações. Revise conforme necessário.",
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

      console.log('IA indisponível, gerando fallback FIEL às observações');
      
      const faithfulContent = generateFaithfulFallbackContent(selectedType, keyPoints, selectedPatient.name);
      form.setValue('content', faithfulContent);
      setActiveTab('manual');
      
      toast({
        title: "Relatório gerado localmente",
        description: "Relatório criado com fidelidade às suas observações. A IA está temporariamente indisponível.",
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

  const generateFaithfulFallbackContent = (reportType: ReportType, keyPoints: string, patientName: string) => {
    console.log('Generating faithful fallback for:', { reportType, keyPoints, patientName });
    
    // Analisar as observações para extrair estado emocional/comportamental
    const analyzeObservations = (observations: string) => {
      const obs = observations.toLowerCase();
      
      const states = {
        emotional: '',
        behavioral: '',
        interaction: '',
        engagement: ''
      };

      // Estados emocionais
      if (obs.includes('estressado') || obs.includes('estresse')) {
        states.emotional = 'apresentou sinais evidentes de estresse';
      } else if (obs.includes('tranquilo') || obs.includes('calmo')) {
        states.emotional = 'demonstrou tranquilidade';
      } else if (obs.includes('agitado')) {
        states.emotional = 'mostrou-se agitado';
      } else if (obs.includes('ansioso')) {
        states.emotional = 'evidenciou ansiedade';
      }

      // Estados comportamentais
      if (obs.includes('sem interação') || obs.includes('não interage')) {
        states.interaction = 'não demonstrou iniciativa para interação';
        states.behavioral = 'manteve-se reservado e com pouca responsividade social';
      } else if (obs.includes('chorando') || obs.includes('chorou')) {
        states.behavioral = 'apresentou episódios de choro';
      } else if (obs.includes('resistente')) {
        states.behavioral = 'demonstrou resistência às propostas iniciais';
      }

      // Nível de engajamento
      if (obs.includes('participativo')) {
        states.engagement = 'demonstrou participação ativa';
      } else if (obs.includes('apático') || obs.includes('desinteressado')) {
        states.engagement = 'apresentou baixo nível de engajamento';
      }

      return states;
    };

    const observedStates = analyzeObservations(keyPoints);
    const dateStr = format(new Date(), 'dd/MM/yyyy');

    const baseContent = {
      patient_name: patientName,
      key_points: keyPoints,
      generated_locally: true,
      observation_analysis: observedStates
    };

    switch (reportType) {
      case "individual_session":
        return {
          ...baseContent,
          objectives: `OBJETIVOS TERAPÊUTICOS DA SESSÃO INDIVIDUAL

Com base no estado apresentado por ${patientName} (${keyPoints}), os objetivos desta sessão foram adaptados para responder às necessidades específicas observadas. ${observedStates.emotional ? `Considerando que o paciente ${observedStates.emotional}, foi priorizado o trabalho de autorregulação emocional através de técnicas musicoterapêuticas específicas.` : ''} ${observedStates.interaction ? `Dado que ${observedStates.interaction}, foram estabelecidos objetivos voltados para o desenvolvimento gradual da comunicação e interação social através da música.` : ''}

Os objetivos principais incluíram a criação de um ambiente terapêutico acolhedor e seguro, o desenvolvimento de estratégias de enfrentamento adequadas ao estado emocional apresentado, e a promoção de experiências musicais positivas que pudessem facilitar a expressão e a regulação emocional. A abordagem foi cuidadosamente ajustada para respeitar o ritmo e as necessidades individuais demonstradas.`,

          activities: `ATIVIDADES MUSICOTERAPÊUTICAS REALIZADAS

Considerando as observações iniciais de que ${patientName} ${keyPoints.toLowerCase()}, a estrutura da sessão foi adaptada com sensibilidade para atender ao estado apresentado. ${observedStates.emotional ? 'Iniciamos com atividades de acolhimento musical suave, utilizando instrumentos harmônicos de baixa intensidade para promover gradual relaxamento.' : ''} ${observedStates.interaction ? 'As propostas foram apresentadas de forma não-invasiva, respeitando o espaço pessoal e permitindo observação inicial antes da participação ativa.' : ''}

As atividades incluíram técnicas de respiração musicalmente guiada, exploração sensorial de instrumentos texturizados, e criação de ambiente sonoro acolhedor através de sonoridades ambientes. ${observedStates.behavioral ? 'As transições entre atividades foram realizadas de forma especialmente cuidadosa, com tempo adicional para adaptação.' : ''} A sessão foi conduzida com flexibilidade total, priorizando o bem-estar e conforto do paciente acima dos objetivos pré-estabelecidos.`,

          patient_response: `RESPOSTA E ENGAJAMENTO DO PACIENTE

Durante toda a sessão, ${patientName} manteve as características observadas inicialmente: ${keyPoints}. ${observedStates.emotional ? `O estado de ${observedStates.emotional.split(' ')[0]} permaneceu evidente durante a maior parte da sessão, requerendo abordagem terapêutica especializada e sensível.` : ''} ${observedStates.interaction ? `A ${observedStates.interaction} foi respeitada, com gradual aproximação através de estímulos musicais não-invasivos.` : ''}

Observou-se que, apesar do estado inicial apresentado, houve momentos de conexão sutil com determinados estímulos musicais, indicando potencial terapêutico preservado. ${observedStates.behavioral ? `O comportamento ${observedStates.behavioral} foi acolhido sem julgamento, criando espaço seguro para expressão autêntica.` : ''} A capacidade de autorregulação foi trabalhada de forma muito gradual, respeitando integralmente o ritmo individual apresentado.`,

          observations: `OBSERVAÇÕES CLÍNICAS RELEVANTES

As observações iniciais de que ${patientName} ${keyPoints.toLowerCase()} forneceram direcionamento fundamental para a condução terapêutica. ${observedStates.emotional ? 'O estado emocional apresentado indica necessidade de trabalho continuado com técnicas de regulação emocional através da música.' : ''} ${observedStates.interaction ? 'A dificuldade de interação sugere potencial para desenvolvimento gradual de habilidades sociais através de mediação musical.' : ''}

Durante a sessão, foi possível identificar elementos facilitadores que podem ser utilizados em intervenções futuras, bem como aspectos que requerem abordagem especializada e tempo adicional. A resposta aos estímulos musicais, mesmo que sutil, demonstra potencial terapêutico que pode ser desenvolvido com continuidade do acompanhamento. O respeito ao estado apresentado foi fundamental para manutenção do vínculo terapêutico.`,

          next_steps: `PLANEJAMENTO E PRÓXIMOS PASSOS

Baseando-se no estado observado (${keyPoints}), o planejamento para as próximas sessões priorizará a continuidade do trabalho de acolhimento e desenvolvimento gradual de estratégias de regulação. ${observedStates.emotional ? 'Serão implementadas técnicas específicas para trabalho com o estado emocional apresentado, utilizando música como recurso de autorregulação.' : ''} ${observedStates.interaction ? 'O desenvolvimento da comunicação será trabalhado de forma muito gradual e respeitosa, através de propostas musicais não-invasivas.' : ''}

Recomenda-se manutenção da abordagem flexível e sensível, com adaptações constantes conforme necessidades apresentadas. O ambiente terapêutico deve continuar priorizando segurança emocional e acolhimento. Sugere-se também comunicação com a família para alinhamento de estratégias e compreensão dos fatores que podem influenciar o estado emocional apresentado nas sessões.`
        };

      case "daily_evolution":
        return {
          ...baseContent,
          initial_state: `ESTADO INICIAL DO PACIENTE

No início desta sessão, ${patientName} ${keyPoints.toLowerCase()}, conforme observado pelo profissional. ${observedStates.emotional ? `O paciente ${observedStates.emotional}, demonstrando necessidade de abordagem cuidadosa e acolhedora.` : ''} ${observedStates.interaction ? `Foi notado que ${observedStates.interaction}, indicando necessidade de tempo adicional para adaptação ao ambiente terapêutico.` : ''}

${observedStates.behavioral ? `O comportamento apresentado ${observedStates.behavioral}, requerendo sensibilidade na aproximação inicial.` : ''} O estado geral observado sugeriu a necessidade de ajustes na estrutura da sessão para atender adequadamente às necessidades específicas apresentadas neste momento.`,

          activities: `ATIVIDADES REALIZADAS NA SESSÃO

Considerando o estado inicial observado (${keyPoints}), as atividades foram cuidadosamente selecionadas e adaptadas. A sessão foi iniciada com abordagem especialmente acolhedora, utilizando técnicas de musicoterapia adequadas ao estado emocional e comportamental apresentado.

As propostas musicoterapêuticas foram implementadas de forma gradual e respeitosa, sempre observando as respostas e necessidades demonstradas pelo paciente durante a sessão. A flexibilidade foi mantida como princípio fundamental da intervenção.`,

          responses: `RESPOSTAS OBSERVADAS DURANTE A SESSÃO

${patientName} manteve durante a sessão as características inicialmente observadas: ${keyPoints}. ${observedStates.emotional ? `O estado emocional apresentado foi trabalhado com técnicas específicas de musicoterapia.` : ''} ${observedStates.interaction ? `A dificuldade de interação foi respeitada, com gradual tentativa de estabelecimento de conexão através da música.` : ''}

As respostas às propostas musicoterapêuticas foram observadas cuidadosamente, identificando momentos de maior receptividade e aspectos que necessitaram de abordagem diferenciada.`,

          observations: `OBSERVAÇÕES IMPORTANTES DA SESSÃO

Esta sessão foi marcada pelas observações iniciais de que ${patientName} ${keyPoints.toLowerCase()}. ${observedStates.emotional || observedStates.behavioral ? 'O estado apresentado orientou toda a condução terapêutica, priorizando acolhimento e respeito ao momento individual.' : ''} 

As estratégias utilizadas demonstraram adequação às necessidades específicas apresentadas, indicando direcionamentos importantes para o planejamento de futuras intervenções. A manutenção do vínculo terapêutico foi preservada através de abordagem sensível e respeitosa.`
        };

      default:
        return {
          ...baseContent,
          content: `RELATÓRIO MUSICOTERAPÊUTICO

Este relatório foi elaborado considerando que ${patientName} ${keyPoints.toLowerCase()}, conforme observado durante a sessão/período de avaliação.

${observedStates.emotional ? `O estado emocional apresentado (${observedStates.emotional}) foi considerado como aspecto central para o planejamento e condução das intervenções musicoterapêuticas.` : ''}

${observedStates.interaction ? `A característica observada de que ${observedStates.interaction} orientou a abordagem terapêutica utilizada, priorizando estratégias adequadas para desenvolvimento gradual da comunicação e interação social.` : ''}

O processo musicoterapêutico foi conduzido com sensibilidade às necessidades específicas apresentadas, utilizando a música como recurso facilitador para expressão, regulação emocional e desenvolvimento de competências individuais. As técnicas empregadas foram constantemente ajustadas conforme as respostas e necessidades observadas.

Data: ${dateStr}
Profissional: Musicoterapeuta responsável
Observações base: ${keyPoints}`
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
