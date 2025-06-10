
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Por favor, selecione um paciente",
  }),
  date: z.date({
    required_error: "Por favor, selecione uma data",
  }),
  type: z.string({
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
      type: "",
      content: {},
    } satisfies FormValues,
  });

  const generateWithAI = async (keyPoints: string, patients: any[]) => {
    setIsGeneratingWithAI(true);
    try {
      const selectedPatient = patients.find(p => p.id === form.getValues('patient_id'));
      const selectedType = form.getValues('type');
      const selectedDate = form.getValues('date');

      if (!selectedPatient || !selectedType || !selectedDate) {
        toast({
          variant: "destructive",
          title: "Dados incompletos",
          description: "Por favor, selecione paciente, data e tipo de relatório antes de gerar com IA.",
        });
        return;
      }

      console.log('Calling generate-report function with:', {
        reportType: selectedType,
        keyPoints: keyPoints,
        patientName: selectedPatient.name,
        evaluationDate: format(selectedDate, 'yyyy-MM-dd')
      });

      // Tentar chamar a função edge do Supabase com retry
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          const { data, error } = await supabase.functions.invoke('generate-report', {
            body: {
              reportType: selectedType,
              keyPoints: keyPoints,
              patientName: selectedPatient.name,
              evaluationDate: format(selectedDate, 'yyyy-MM-dd')
            }
          });

          if (error) {
            console.error('Supabase function error:', error);
            throw new Error(`Erro na função: ${error.message}`);
          }

          if (data && data.content) {
            form.setValue('content', data.content);
            setActiveTab('manual');
            toast({
              title: "Relatório gerado com IA!",
              description: "O conteúdo foi gerado pela inteligência artificial. Revise e edite conforme necessário.",
            });
            return;
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

      // Se chegou aqui, todas as tentativas falharam, usar fallback
      console.log('Todas as tentativas de IA falharam, gerando conteúdo local aprimorado');
      
      const enhancedContent = generateEnhancedFallbackContent(selectedType, keyPoints, selectedPatient.name, selectedDate);
      form.setValue('content', enhancedContent);
      setActiveTab('manual');
      
      toast({
        title: "Relatório gerado localmente",
        description: "A IA está temporariamente indisponível. Um relatório estruturado foi gerado para você editar.",
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

  const generateEnhancedFallbackContent = (reportType: string, keyPoints: string, patientName: string, date: Date) => {
    const formattedDate = format(date, 'dd/MM/yyyy');
    const baseContent = {
      patient_name: patientName,
      evaluation_date: formattedDate,
      key_points: keyPoints,
      generated_locally: true
    };

    switch (reportType) {
      case "individual_session":
        return {
          ...baseContent,
          objectives: `Objetivos Terapêuticos da Sessão Individual - ${patientName} (${formattedDate})
          
• Estimular a comunicação verbal e não-verbal através de atividades musicais
• Desenvolver habilidades motoras finas e grossas com instrumentos musicais
• Promover a autorregulação emocional através da expressão musical
• Fortalecer o vínculo terapêutico e a confiança
• Trabalhar aspectos específicos baseados nos pontos observados: ${keyPoints}`,

          activities: `Atividades Musicoterapêuticas Realizadas:

1. AQUECIMENTO E ACOLHIMENTO
• Música de boas-vindas personalizada
• Exercícios de respiração com sons vocais
• Reconhecimento do espaço terapêutico

2. ATIVIDADES PRINCIPAIS
• Exploração livre de instrumentos (xilofone, tambores, chocalhos)
• Improvisação musical dirigida
• Canto terapêutico com repertório conhecido
• Jogos musicais interativos

3. TÉCNICAS APLICADAS
• Método receptivo: audição musical ativa
• Método ativo: criação e execução musical
• Técnicas de espelhamento musical
• Sincronização rítmica terapêutica`,

          patient_response: `Resposta e Engajamento do Paciente:

ASPECTOS POSITIVOS OBSERVADOS:
• Demonstrou interesse pelos instrumentos apresentados
• Manteve atenção sustentada durante as atividades propostas
• Apresentou tentativas de comunicação através da música
• Mostrou sinais de relaxamento durante as intervenções

DESAFIOS IDENTIFICADOS:
• Necessidade de maior tempo de adaptação às mudanças de atividade
• Dificuldades pontuais de coordenação motora
• Momentos de autorregulação que requerem suporte adicional

PROGRESSOS OBSERVADOS:
Com base nos pontos principais relatados (${keyPoints}), foi possível observar evolução significativa na participação e interesse pelas atividades propostas.`,

          observations: `Observações Clínicas e Técnicas:

ANÁLISE MUSICOTERAPÊUTICA:
• Preferências sonoro-musicais: [instrumentos de percussão/melódicos/vocais]
• Padrões rítmicos demonstrados: [regular/irregular/em desenvolvimento]
• Capacidade de improvisação: [livre/dirigida/em construção]
• Resposta à estrutura musical: [positiva/gradual/necessita adaptação]

ASPECTOS RELACIONAIS:
• Vínculo terapêutico: fortalecimento progressivo observado
• Comunicação não-verbal: expressiva através da música
• Iniciativa musical: [espontânea/encorajada/em desenvolvimento]

PONTOS DE ATENÇÃO TÉCNICA:
• Necessidade de continuidade nas intervenções específicas
• Atenção aos sinais de fadiga ou sobrecarga sensorial
• Adaptação do setting conforme responsividade apresentada`,

          next_steps: `Planejamento e Próximos Passos:

OBJETIVOS PARA PRÓXIMAS SESSÕES:
• Aprofundar as técnicas que demonstraram maior efetividade
• Expandir o repertório musical conforme interesses manifestados
• Trabalhar aspectos específicos identificados nesta sessão
• Continuar fortalecimento do vínculo terapêutico

ESTRATÉGIAS RECOMENDADAS:
• Manter estrutura consistente das sessões
• Introduzir gradualmente novos desafios musicais
• Documentar preferências e aversões sonoras
• Considerar envolvimento familiar nas atividades domiciliares

ENCAMINHAMENTOS:
• Continuidade do processo musicoterapêutico semanal
• Avaliação contínua da evolução apresentada
• Possível interconsulta com outros profissionais se necessário`
        };

      case "monthly_evolution":
        return {
          ...baseContent,
          therapeutic_objectives: `Objetivos Terapêuticos Trabalhados no Período (Análise Mensal):

OBJETIVOS GERAIS ESTABELECIDOS:
• Desenvolvimento da comunicação expressiva através da música
• Estimulação de habilidades socioemocionais e cognitivas
• Promoção da autorregulação e bem-estar emocional
• Fortalecimento de vínculos e interação social

OBJETIVOS ESPECÍFICOS BASEADOS NO CONTEXTO:
Com base nas observações registradas (${keyPoints}), foram priorizados durante este período:
• Trabalho específico de expressão emocional através de improvisação musical
• Desenvolvimento de coordenação motora com instrumentos variados
• Estimulação da atenção sustentada através de atividades estruturadas
• Promoção da confiança e autoestima através de conquistas musicais progressivas`,

          achievements: `Conquistas e Progressos Observados no Período Mensal:

DESENVOLVIMENTO MUSICAL SIGNIFICATIVO:
• Maior familiaridade e exploração espontânea dos instrumentos musicais
• Desenvolvimento de padrões rítmicos mais organizados e intencionais
• Ampliação considerável do repertório vocal e instrumental
• Melhora notável na capacidade de imitação e criação musical

ASPECTOS SOCIOEMOCIONAIS EVOLUTIVOS:
• Fortalecimento significativo do vínculo terapêutico estabelecido
• Maior iniciativa e protagonismo na participação das atividades propostas
• Demonstração regular de prazer, satisfação e alegria durante as sessões
• Redução progressiva de comportamentos de resistência ou evitação

HABILIDADES COMUNICATIVAS AMPLIADAS:
• Aumento substancial de tentativas comunicativas espontâneas
• Uso preferencial da música como canal principal de expressão
• Melhora na compreensão e seguimento de comandos e instruções musicais
• Desenvolvimento de comunicação não-verbal mais rica e expressiva`,

          challenges: `Desafios e Dificuldades Encontradas Durante o Período:

ASPECTOS TÉCNICOS IDENTIFICADOS:
• Necessidade de adaptação constante das estratégias terapêuticas conforme estado emocional
• Variabilidade significativa no estado e disposição entre as diferentes sessões
• Processo gradual de construção da confiança, respeitando o tempo individual
• Necessidade de tempo adicional para consolidação de algumas conquistas específicas

FATORES EXTERNOS INFLUENCIADORES:
• Influência direta de mudanças na rotina familiar, escolar ou social
• Importância do maior envolvimento e participação ativa de cuidadores
• Necessidade de adaptação a diferentes contextos e ambientes terapêuticos
• Coordenação cuidadosa com outros tratamentos e terapias simultâneas

ÁREAS QUE DEMANDAM DESENVOLVIMENTO CONTÍNUO:
• Autorregulação emocional em momentos de frustração ou desafio
• Ampliação progressiva do tempo de atenção sustentada nas atividades
• Generalização das conquistas terapêuticas para outros contextos de vida`,

          adjustments: `Ajustes e Modificações Realizadas no Plano Terapêutico:

AJUSTES METODOLÓGICOS IMPLEMENTADOS:
• Adaptação cuidadosa do tempo de duração das atividades conforme responsividade
• Modificação estratégica na sequência e estrutura das sessões
• Introdução planejada de novos instrumentos e técnicas musicoterapêuticas
• Personalização contínua das intervenções conforme padrões de resposta observados

ADEQUAÇÕES AMBIENTAIS REALIZADAS:
• Otimização do setting terapêutico para maior conforto e segurança
• Reorganização espacial dos instrumentos para facilitar acesso e exploração
• Controle cuidadoso de estímulos sensoriais do ambiente (luz, som, temperatura)
• Criação de rotinas previsíveis e reconfortantes para maior estabilidade emocional

MODIFICAÇÕES RELACIONAIS E VINCULARES:
• Fortalecimento contínuo de estratégias de estabelecimento de vínculo
• Adequação da postura e abordagem terapêutica conforme necessidades individuais
• Envolvimento gradual e respeitoso da família no processo terapêutico`,

          next_steps: `Planejamento Estratégico para o Próximo Período Mensal:

CONTINUIDADE E CONSOLIDAÇÃO TERAPÊUTICA:
• Manutenção da frequência semanal das sessões para garantir consistência
• Aprofundamento sistemático das técnicas que demonstraram maior eficácia clínica
• Expansão gradual e cuidadosa dos desafios musicais propostos
• Documentação sistemática e detalhada da evolução para acompanhamento preciso

METAS ESPECÍFICAS PARA OS PRÓXIMOS 30 DIAS:
• Consolidação e fortalecimento das conquistas já alcançadas
• Trabalho focado e intensivo nas áreas que ainda apresentam desafios significativos
• Introdução cautelosa de atividades de maior complexidade musical e relacional
• Preparação gradual para possível ampliação do setting (atividades grupais ou familiares)

ARTICULAÇÃO INTERDISCIPLINAR PLANEJADA:
• Comunicação regular e estruturada com outros profissionais da equipe multidisciplinar
• Compartilhamento sistemático de estratégias eficazes e resultados obtidos
• Alinhamento contínuo de objetivos terapêuticos gerais com a equipe
• Avaliação periódica da necessidade de ajustes no plano global de tratamento`
        };

      default:
        return {
          ...baseContent,
          content: `Relatório Musicoterapêutico Estruturado para ${patientName}

Data da Avaliação: ${formattedDate}

RESUMO EXECUTIVO:
Este relatório apresenta a análise detalhada do processo musicoterapêutico de ${patientName}, considerando os aspectos observados durante o período avaliado.

PONTOS PRINCIPAIS IDENTIFICADOS:
${keyPoints}

ANÁLISE TÉCNICA:
Com base nas observações realizadas, foi possível identificar aspectos significativos do desenvolvimento do paciente através das intervenções musicoterapêuticas implementadas.

RECOMENDAÇÕES:
• Continuidade do processo terapêutico
• Manutenção das estratégias eficazes
• Adaptações conforme evolução apresentada
• Envolvimento familiar no processo

CONSIDERAÇÕES FINAIS:
O processo musicoterapêutico demonstra resultados positivos e perspectivas favoráveis para continuidade do tratamento.`
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
