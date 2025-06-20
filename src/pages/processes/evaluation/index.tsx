
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileDown, Info, HelpCircle } from "lucide-react";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";
import { TeaScalePDF } from "@/components/TeaScalePDF";
import ReactDOM from 'react-dom';
import { PatientSelect } from "../../anamnesis/components/PatientSelect";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";

interface Patient {
  id: string;
  name: string;
  birth_date: string | null;
  age: number | null;
}

export default function Evaluation() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedEvaluation, setSelectedEvaluation] = useState("1");
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("evaluation");
  const [selectedPatientData, setSelectedPatientData] = useState<Patient | null>(null);

  useEffect(() => {
    async function fetchPatients() {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('Usuário não autenticado');
          return;
        }
        
        const { data, error } = await supabase
          .from('patients')
          .select('id, name, birth_date, age')
          .eq('professional_id', user.id)
          .order('name');
        
        if (error) {
          console.error('Erro ao carregar pacientes:', error);
          return;
        }
        
        console.log('Pacientes carregados:', data);
        setPatients(data || []);
        if (data && data.length > 0) {
          setSelectedPatient(data[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPatients();
  }, []);

  // Update selectedPatientData when selectedPatient changes
  useEffect(() => {
    const patient = patients.find(p => p.id === selectedPatient);
    setSelectedPatientData(patient || null);
  }, [selectedPatient, patients]);

  const evaluationDomains = [
    {
      title: "Domínio Musical",
      description: "Avaliação das habilidades e respostas musicais do paciente",
      icon: "🎵",
      subdomains: [
        {
          title: "Percepção Musical",
          description: "Capacidade de perceber e discriminar elementos musicais",
          parameters: [
            "Discriminação de altura sonora (grave/agudo)",
            "Reconhecimento de timbres instrumentais",
            "Percepção rítmica e pulsação",
            "Memória musical a curto prazo",
            "Memória musical a longo prazo",
            "Atenção sustentada aos estímulos sonoros",
            "Discriminação de intensidade (forte/fraco)",
            "Reconhecimento de padrões melódicos"
          ]
        },
        {
          title: "Expressão Musical",
          description: "Capacidade de se expressar através da música",
          parameters: [
            "Expressividade vocal espontânea",
            "Expressividade instrumental",
            "Criatividade musical livre",
            "Improvisação vocal",
            "Improvisação instrumental",
            "Sincronização com o pulso musical",
            "Qualidade da produção sonora",
            "Iniciativa para criação musical"
          ]
        },
        {
          title: "Compreensão Musical",
          description: "Entendimento de estruturas e conceitos musicais",
          parameters: [
            "Compreensão de início e fim musical",
            "Reconhecimento de diferentes estilos",
            "Identificação de instrumentos familiares",
            "Compreensão de dinâmicas musicais",
            "Associação música-emoção",
            "Seguimento de comandos musicais",
            "Antecipação de eventos musicais",
            "Compreensão de estruturas simples"
          ]
        }
      ]
    },
    {
      title: "Domínio Psicossocial",
      description: "Avaliação dos aspectos psicológicos, emocionais e sociais",
      icon: "👥",
      subdomains: [
        {
          title: "Interação Social",
          description: "Qualidade das interações sociais durante as atividades musicais",
          parameters: [
            "Engajamento com o musicoterapeuta",
            "Interação com pares no grupo",
            "Compartilhamento de instrumentos",
            "Iniciativa para interação social",
            "Reciprocidade nas trocas musicais",
            "Espera de turno em atividades",
            "Aceitação de liderança musical",
            "Cooperação em atividades conjunto"
          ]
        },
        {
          title: "Regulação Emocional",
          description: "Capacidade de utilizar a música para regulação emocional",
          parameters: [
            "Expressão adequada de emoções",
            "Auto-regulação através da música",
            "Resposta emocional apropriada",
            "Modulação do humor pela música",
            "Tolerância à frustração musical",
            "Controle de impulsos durante atividades",
            "Adaptação a mudanças no repertório",
            "Estabilidade emocional na sessão"
          ]
        },
        {
          title: "Autoestima e Autoconceito",
          description: "Percepção de si mesmo em contextos musicais",
          parameters: [
            "Confiança para experimentar sons",
            "Aceitação de suas produções musicais",
            "Disposição para se expor musicalmente",
            "Orgulho de suas criações",
            "Persistência diante de desafios",
            "Autonomia nas escolhas musicais",
            "Senso de competência musical",
            "Valorização de seu potencial"
          ]
        }
      ]
    },
    {
      title: "Domínio Cognitivo",
      description: "Avaliação das funções cognitivas estimuladas pela música",
      icon: "🧠",
      subdomains: [
        {
          title: "Funções Executivas",
          description: "Capacidades de planejamento, organização e execução",
          parameters: [
            "Atenção sustentada em atividades",
            "Planejamento de sequências musicais",
            "Flexibilidade cognitiva musical",
            "Resolução de problemas musicais",
            "Tomada de decisão musical",
            "Controle inibitório de respostas",
            "Organização temporal de ações",
            "Monitoramento de desempenho"
          ]
        },
        {
          title: "Processamento da Informação",
          description: "Capacidade de processar e responder a estímulos musicais",
          parameters: [
            "Velocidade de processamento auditivo",
            "Capacidade de sequenciamento temporal",
            "Integração sensorial multimodal",
            "Memória de trabalho auditiva",
            "Capacidade de generalização musical",
            "Transferência de aprendizagem",
            "Categorização de estímulos sonoros",
            "Abstração de padrões musicais"
          ]
        },
        {
          title: "Aprendizagem Musical",
          description: "Capacidade de adquirir e reter conhecimentos musicais",
          parameters: [
            "Aquisição de novas habilidades",
            "Retenção de informações musicais",
            "Aplicação de conhecimentos prévios",
            "Adaptação a novos repertórios",
            "Consolidação de aprendizagens",
            "Transferência entre modalidades",
            "Insight musical",
            "Metacognição musical"
          ]
        }
      ]
    },
    {
      title: "Domínio Sensório-Motor",
      description: "Avaliação da integração sensorial e capacidades motoras",
      icon: "👐",
      subdomains: [
        {
          title: "Coordenação Motora",
          description: "Qualidade dos movimentos relacionados à música",
          parameters: [
            "Coordenação bimanual em instrumentos",
            "Controle motor fino para detalhes",
            "Planejamento motor de sequências",
            "Precisão rítmica motora",
            "Integração movimento-música",
            "Coordenação motora global",
            "Dissociação de movimentos",
            "Fluidez de gestos musicais"
          ]
        },
        {
          title: "Processamento Sensorial",
          description: "Resposta e integração de estímulos sensoriais musicais",
          parameters: [
            "Resposta auditiva adequada",
            "Integração audiovisual",
            "Resposta tátil a instrumentos",
            "Propriocepção durante atividades",
            "Tolerância a estímulos sonoros",
            "Modulação sensorial",
            "Discriminação sensorial fina",
            "Integração vestibular-auditiva"
          ]
        },
        {
          title: "Desenvolvimento Motor",
          description: "Evolução das habilidades motoras através da música",
          parameters: [
            "Desenvolvimento da motricidade fina",
            "Evolução da coordenação global",
            "Aperfeiçoamento gestual",
            "Refinamento de movimentos",
            "Economia de movimento",
            "Precisão crescente",
            "Automatização de padrões",
            "Criatividade motora"
          ]
        }
      ]
    },
    {
      title: "Domínio Comunicativo-Interativo",
      description: "Avaliação das habilidades de comunicação e interação através da música",
      icon: "🗣️",
      subdomains: [
        {
          title: "Comunicação Verbal",
          description: "Uso da linguagem verbal em contextos musicais",
          parameters: [
            "Produção vocal intencional",
            "Articulação de palavras cantadas",
            "Vocabulário musical expressivo",
            "Narrativas através de canções",
            "Comentários sobre experiências musicais",
            "Solicitações verbais relacionadas à música",
            "Descrição de sensações musicais",
            "Expressão de preferências verbalmente"
          ]
        },
        {
          title: "Comunicação Não-Verbal",
          description: "Expressão através de gestos, expressões e movimentos",
          parameters: [
            "Gestos comunicativos musicais",
            "Expressões faciais adequadas",
            "Postura corporal expressiva",
            "Contato visual durante atividades",
            "Movimentos corporais intencionais",
            "Mímica e imitação musical",
            "Apontamento e indicação",
            "Proximidade física apropriada"
          ]
        },
        {
          title: "Pragmática Comunicativa",
          description: "Uso social e funcional da comunicação musical",
          parameters: [
            "Intenção comunicativa clara",
            "Turnos conversacionais musicais",
            "Iniciativa comunicativa",
            "Resposta a iniciativas de outros",
            "Manutenção de tópicos musicais",
            "Uso de música para necessidades",
            "Reparação comunicativa",
            "Adequação contextual"
          ]
        },
        {
          title: "Interação Terapêutica",
          description: "Qualidade da relação estabelecida no setting musicoterapêutico",
          parameters: [
            "Vínculo com o musicoterapeuta",
            "Confiança no setting terapêutico",
            "Colaboração nas atividades",
            "Aceita sugestões e orientações",
            "Manifesta necessidades claramente",
            "Participa do processo terapêutico",
            "Demonstra progressos conquistados",
            "Transfere aprendizagens para outros contextos"
          ]
        }
      ]
    },
    {
      title: "Domínio Neurofisiológico",
      description: "Avaliação das respostas neurológicas e fisiológicas à música",
      icon: "🧬",
      subdomains: [
        {
          title: "Respostas Neurológicas",
          description: "Indicadores de funcionamento neurológico através da música",
          parameters: [
            "Sincronização neural com ritmos",
            "Ativação de redes neurais musicais",
            "Plasticidade neural evidenciada",
            "Integração hemisférica cerebral",
            "Processamento temporal neural",
            "Conectividade funcional",
            "Neuroplasticidade induzida",
            "Reorganização cortical"
          ]
        },
        {
          title: "Respostas Fisiológicas",
          description: "Mudanças corporais em resposta à música",
          parameters: [
            "Alterações na frequência cardíaca",
            "Modificações respiratórias",
            "Tensão e relaxamento muscular",
            "Resposta de orientação auditiva",
            "Reflexos acústicos preservados",
            "Regulação do tônus muscular",
            "Sincronização fisiológica",
            "Homeostase corporal"
          ]
        },
        {
          title: "Arousal e Alerta",
          description: "Níveis de ativação e vigilância durante atividades musicais",
          parameters: [
            "Nível de alerta apropriado",
            "Modulação do arousal pela música",
            "Sustentação da vigilância",
            "Transições adequadas de estado",
            "Responsividade a estímulos",
            "Regulação da ativação",
            "Flexibilidade do arousal",
            "Estabilidade atencional"
          ]
        }
      ]
    },
    {
      title: "Domínio Executivo-Adaptativo",
      description: "Avaliação das capacidades executivas e adaptativas em contextos musicais",
      icon: "⚙️",
      subdomains: [
        {
          title: "Funções Executivas Complexas",
          description: "Habilidades executivas de alta ordem aplicadas à música",
          parameters: [
            "Planejamento estratégico musical",
            "Execução de planos complexos",
            "Monitoramento de resultados",
            "Correção de erros musicais",
            "Gestão de múltiplas tarefas",
            "Priorização de objetivos",
            "Flexibilidade estratégica",
            "Avaliação de desempenho"
          ]
        },
        {
          title: "Adaptação e Generalização",
          description: "Capacidade de adaptar e generalizar aprendizagens musicais",
          parameters: [
            "Adaptação a novos contextos",
            "Generalização de habilidades",
            "Transferência entre domínios",
            "Flexibilidade comportamental",
            "Ajuste a demandas variáveis",
            "Resposta a feedback",
            "Modificação de estratégias",
            "Aplicação criativa de conhecimentos"
          ]
        },
        {
          title: "Autonomia e Independência",
          description: "Desenvolvimento da autonomia através de experiências musicais",
          parameters: [
            "Iniciativa para atividades musicais",
            "Independência na execução",
            "Autogerenciamento de atividades",
            "Tomada de decisões autônomas",
            "Autorregulação comportamental",
            "Autodirecionamento musical",
            "Responsabilidade por instrumentos",
            "Autoavaliação de progressos"
          ]
        }
      ]
    }
  ];

  const calculateScore = (domain: string, subdomain: string, parameter: string) => {
    const key = `${domain}-${subdomain}-${parameter}`;
    const value = selections[key];
    
    if (!value) return 0;
    
    return value === "nao_observado" ? 0 : 
           value === "emergente" ? 1 : 
           value === "inconsistente" ? 2 : 
           value === "moderado" ? 3 :
           value === "consistente" ? 4 : 
           value === "avancado" ? 5 : 6;
  };

  const calculateSubdomainScore = (domain: string, subdomain: string, parameters: string[]) => {
    const maxPossible = parameters.length * 6;
    
    const totalScore = parameters.reduce((acc, param) => {
      return acc + calculateScore(domain, subdomain, param);
    }, 0);
    
    return {
      raw: totalScore,
      percentage: Math.round((totalScore / maxPossible) * 100)
    };
  };

  const calculateDomainScore = (domain: any) => {
    let totalScore = 0;
    let maxPossible = 0;
    
    domain.subdomains.forEach((subdomain: any) => {
      const score = calculateSubdomainScore(domain.title, subdomain.title, subdomain.parameters);
      totalScore += score.raw;
      maxPossible += subdomain.parameters.length * 6;
    });
    
    return {
      raw: totalScore,
      percentage: Math.round((totalScore / maxPossible) * 100)
    };
  };

  const calculateOverallScore = () => {
    let totalScore = 0;
    let maxPossible = 0;
    
    evaluationDomains.forEach(domain => {
      domain.subdomains.forEach(subdomain => {
        subdomain.parameters.forEach(param => {
          const score = calculateScore(domain.title, subdomain.title, param);
          totalScore += score;
          maxPossible += 6;
        });
      });
    });
    
    return {
      raw: totalScore,
      max: maxPossible,
      percentage: Math.round((totalScore / maxPossible) * 100)
    };
  };

  const getDomainAverages = () => {
    const averages = evaluationDomains.map(domain => {
      const score = calculateDomainScore(domain);
      return {
        name: domain.title.replace("Domínio ", ""),
        value: score.percentage,
        fullMark: 100
      };
    });
    return averages;
  };

  const getSubdomainData = () => {
    const subdomainScores = evaluationDomains.flatMap(domain => 
      domain.subdomains.map(subdomain => ({
        name: subdomain.title,
        value: calculateSubdomainScore(domain.title, subdomain.title, subdomain.parameters).percentage,
        domain: domain.title.replace("Domínio ", "")
      }))
    );
    return subdomainScores;
  };

  const domainScores = getDomainAverages();
  const subdomainScores = getSubdomainData();
  const overallScore = calculateOverallScore();
  const pieData = [
    { name: "Desenvolvido", value: overallScore.percentage },
    { name: "A desenvolver", value: 100 - overallScore.percentage },
  ];

  const COLORS = ['#4ade80', '#ffa1b5'];

  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
        setUserName(formatNameFromEmail(user.email || ""));
      }
    };

    fetchUserData();
  }, []);

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleGeneratePDF = async () => {
    try {
      const pdfContent = (
        <div id="pdf-content" style={{ display: 'block' }}>
          <TeaScalePDF
            categoryData={subdomainScores}
            pieData={pieData}
            patientName={selectedPatientData?.name}
            evaluatorName={userName}
            evaluatorEmail={userEmail}
            radarData={domainScores}
          />
        </div>
      );

      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      const root = document.createElement('div');
      container.appendChild(root);

      ReactDOM.render(pdfContent, root);

      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.loading("Gerando PDF...");

      const opt = {
        margin: [10, 10],
        filename: `escala-musetera-${selectedPatientData?.name || 'paciente'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };

      await html2pdf().set(opt).from(root).save();
      
      document.body.removeChild(container);
      
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
    }
  };

  const getScoreLabel = (score: number) => {
    switch(score) {
      case 0: return "Não Observado";
      case 1: return "Emergente";
      case 2: return "Inconsistente";
      case 3: return "Moderado";
      case 4: return "Consistente";
      case 5: return "Avançado";
      case 6: return "Excepcional";
      default: return "Não Observado";
    }
  };

  const getScoreColor = (score: number) => {
    switch(score) {
      case 0: return "border-gray-400";
      case 1: return "border-red-500";
      case 2: return "border-orange-400";
      case 3: return "border-yellow-400";
      case 4: return "border-blue-500";
      case 5: return "border-green-500";
      case 6: return "border-purple-500";
      default: return "border-gray-400";
    }
  };

  const getScoreBgColor = (score: number, isSelected: boolean) => {
    if (!isSelected) return "bg-white";
    
    switch(score) {
      case 0: return "bg-gray-400";
      case 1: return "bg-red-500";
      case 2: return "bg-orange-400";
      case 3: return "bg-yellow-400";
      case 4: return "bg-blue-500";
      case 5: return "bg-green-500";
      case 6: return "bg-purple-500";
      default: return "bg-white";
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <Card className="p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <PatientSelect
              patients={patients}
              selectedPatient={selectedPatient}
              onSelect={setSelectedPatient}
              isLoading={isLoading}
              emptyMessage="Nenhum paciente cadastrado por você"
            />
            {selectedPatientData && (
              <div>
                <p className="text-sm sm:text-base text-gray-600">
                  Idade: {selectedPatientData.age ? `${selectedPatientData.age} anos` : 'Não informada'}
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Select
              value={selectedEvaluation}
              onValueChange={setSelectedEvaluation}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione a avaliação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Avaliação Inicial</SelectItem>
                <SelectItem value="2">Avaliação de Progresso</SelectItem>
                <SelectItem value="3">Avaliação Periódica</SelectItem>
                <SelectItem value="4">Avaliação Final</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGeneratePDF}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Gerar PDF
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="evaluation">Escala MuseTera</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="comparison">Comparação</TabsTrigger>
          </TabsList>

          <TabsContent value="evaluation" className="space-y-8 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Escala MuseTera - Versão Profissional</h3>
              <p className="text-blue-700 text-sm">
                Sistema de pontuação expandido (0-6): Não Observado (0), Emergente (1), Inconsistente (2), 
                Moderado (3), Consistente (4), Avançado (5), Excepcional (6)
              </p>
            </div>

            {evaluationDomains.map((domain, domainIndex) => (
              <div key={domainIndex} className="border rounded-md p-4 sm:p-6 bg-card">
                <div className="flex items-center mb-4 gap-2">
                  <div className="text-2xl">{domain.icon}</div>
                  <h2 className="text-lg sm:text-xl font-semibold">{domain.title}</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-sm">{domain.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {domain.subdomains.map((subdomain, subdomainIndex) => (
                  <div key={subdomainIndex} className="mb-6 border-l-2 pl-4 ml-2">
                    <div className="flex items-center mb-3">
                      <h3 className="text-base sm:text-lg font-medium">{subdomain.title}</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                              <Info className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">{subdomain.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[200px]">Parâmetros Avaliados</TableHead>
                            <TableHead className="w-16 text-center">
                              <span className="block text-xs font-normal">Não Obs.</span>
                              <span className="block text-xs font-normal">(0)</span>
                            </TableHead>
                            <TableHead className="w-16 text-center">
                              <span className="block text-xs font-normal">Emergente</span>
                              <span className="block text-xs font-normal">(1)</span>
                            </TableHead>
                            <TableHead className="w-16 text-center">
                              <span className="block text-xs font-normal">Inconsist.</span>
                              <span className="block text-xs font-normal">(2)</span>
                            </TableHead>
                            <TableHead className="w-16 text-center">
                              <span className="block text-xs font-normal">Moderado</span>
                              <span className="block text-xs font-normal">(3)</span>
                            </TableHead>
                            <TableHead className="w-16 text-center">
                              <span className="block text-xs font-normal">Consistente</span>
                              <span className="block text-xs font-normal">(4)</span>
                            </TableHead>
                            <TableHead className="w-16 text-center">
                              <span className="block text-xs font-normal">Avançado</span>
                              <span className="block text-xs font-normal">(5)</span>
                            </TableHead>
                            <TableHead className="w-16 text-center">
                              <span className="block text-xs font-normal">Excepcional</span>
                              <span className="block text-xs font-normal">(6)</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subdomain.parameters.map((parameter, paramIndex) => (
                            <TableRow key={paramIndex}>
                              <TableCell className="text-sm sm:text-base">{parameter}</TableCell>
                              {["nao_observado", "emergente", "inconsistente", "moderado", "consistente", "avancado", "excepcional"].map((level, levelIndex) => (
                                <TableCell key={level} className="text-center p-2 sm:p-4">
                                  <RadioGroup
                                    value={selections[`${domain.title}-${subdomain.title}-${parameter}`]}
                                    onValueChange={(value) => 
                                      setSelections(prev => ({
                                        ...prev,
                                        [`${domain.title}-${subdomain.title}-${parameter}`]: value
                                      }))
                                    }
                                    className="flex justify-center"
                                  >
                                    <div className="relative">
                                      <RadioGroupItem
                                        value={level}
                                        id={`${domain.title}-${subdomain.title}-${parameter}-${level}`}
                                        className="sr-only"
                                      />
                                      <label
                                        htmlFor={`${domain.title}-${subdomain.title}-${parameter}-${level}`}
                                        className={`block w-3 h-3 sm:w-4 sm:h-4 rounded-full cursor-pointer border-2 ${getScoreColor(levelIndex)} ${
                                          selections[`${domain.title}-${subdomain.title}-${parameter}`] === level
                                            ? getScoreBgColor(levelIndex, true)
                                            : "bg-white"
                                        }`}
                                      />
                                    </div>
                                  </RadioGroup>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Campo de observações qualitativas */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observações Qualitativas - {subdomain.title}
                      </label>
                      <Textarea
                        placeholder={`Registre observações específicas sobre ${subdomain.title.toLowerCase()}, comportamentos significativos, progressos notados e recomendações...`}
                        value={observations[`${domain.title}-${subdomain.title}`] || ""}
                        onChange={(e) => setObservations(prev => ({
                          ...prev,
                          [`${domain.title}-${subdomain.title}`]: e.target.value
                        }))}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="results" className="space-y-6 mt-6">
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
                Resultados da Escala MuseTera
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <Card className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
                    Perfil Musicoterapêutico
                  </h3>
                  <div className="h-[300px] sm:h-[350px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={domainScores}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Perfil" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
                    Desenvolvimento Global
                  </h3>
                  <div className="h-[300px] sm:h-[350px] w-full flex flex-col items-center justify-center">
                    <div className="h-[200px] sm:h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="80%"
                            paddingAngle={5}
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-lg font-medium">Pontuação Total: {overallScore.raw}/{overallScore.max}</p>
                      <p className="text-sm text-gray-600">Percentil de desenvolvimento: {overallScore.percentage}%</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="mt-8">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
                  Análise Detalhada por Subdomínios
                </h3>
                <div className="h-[400px] sm:h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={subdomainScores}
                      margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={100}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded shadow-md">
                              <p className="text-sm font-medium">{data.name}</p>
                              <p className="text-sm">Domínio: {data.domain}</p>
                              <p className="text-sm text-blue-600">Pontuação: {data.value}%</p>
                            </div>
                          );
                        }
                        return null;
                      }} />
                      <Bar dataKey="value" fill="#6D28D9">
                        {subdomainScores.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={
                              entry.domain === "Musical" ? "#8884d8" :
                              entry.domain === "Psicossocial" ? "#82ca9d" : 
                              entry.domain === "Cognitivo" ? "#ffc658" : 
                              entry.domain === "Sensório-Motor" ? "#ff8042" :
                              entry.domain === "Comunicativo-Interativo" ? "#8dd1e1" :
                              entry.domain === "Neurofisiológico" ? "#d084d0" : "#ffb347"
                            } 
                          />
                        ))}
                      </Bar>
                      <Legend />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-6">
            <Card className="p-6">
              <div className="flex justify-center items-center h-[300px]">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4">Comparação Evolutiva</h3>
                  <p className="text-gray-600">
                    Realize múltiplas avaliações para visualizar a evolução do paciente ao longo do tempo.
                  </p>
                  <Button variant="outline" className="mt-4" disabled>
                    Carregar Avaliações Anteriores
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
