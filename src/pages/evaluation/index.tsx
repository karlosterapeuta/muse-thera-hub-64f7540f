
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
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileDown, Info, HelpCircle, FileBarChart, FileText, CalendarIcon } from "lucide-react";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";
import { TeaScalePDF } from "@/components/TeaScalePDF";
import { ParametersGraphsPDF } from "@/components/ParametersGraphsPDF";
import { MuseteraReportPDF } from "@/components/MuseteraReportPDF";
import { EnhancedMuseteraReportPDF } from "@/components/EnhancedMuseteraReportPDF";
import ReactDOM from 'react-dom';
import { PatientSelect } from "../anamnesis/components/PatientSelect";
import { EvaluationLevelsHero } from "@/components/EvaluationLevelsHero";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useProfessionalData } from "@/hooks/useProfessionalData";

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
  const [evaluationDate, setEvaluationDate] = useState<Date>(new Date());
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("evaluation");

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

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  const evaluationDomains = [
    {
      title: "Domínio Musical",
      description: "Avaliação das habilidades e respostas musicais do paciente",
      icon: "🎵",
      color: "from-purple-500 to-pink-500",
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
      color: "from-blue-500 to-cyan-500",
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
      color: "from-emerald-500 to-teal-500",
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
      color: "from-orange-500 to-red-500",
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
      color: "from-indigo-500 to-purple-500",
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
    }
  ];

  // Helper functions for partial evaluation
  const isParameterEvaluated = (domain: string, subdomain: string, parameter: string): boolean => {
    const key = `${domain}-${subdomain}-${parameter}`;
    return selections[key] && selections[key] !== 'nao_observado';
  };

  const isSubdomainEvaluated = (domain: string, subdomain: string, parameters: string[]): boolean => {
    return parameters.some(param => isParameterEvaluated(domain, subdomain, param));
  };

  const isDomainEvaluated = (domain: any): boolean => {
    return domain.subdomains.some((subdomain: any) => 
      isSubdomainEvaluated(domain.title, subdomain.title, subdomain.parameters)
    );
  };

  const getEvaluatedDomainsCount = (): number => {
    return evaluationDomains.filter(domain => isDomainEvaluated(domain)).length;
  };

  const getEvaluatedSubdomainsCount = (): number => {
    let count = 0;
    evaluationDomains.forEach(domain => {
      domain.subdomains.forEach((subdomain: any) => {
        if (isSubdomainEvaluated(domain.title, subdomain.title, subdomain.parameters)) {
          count++;
        }
      });
    });
    return count;
  };

  const calculateScore = (domain: string, subdomain: string, parameter: string) => {
    const key = `${domain}-${subdomain}-${parameter}`;
    const value = selections[key];
    
    if (!value) return 0;
    
    return value === "nao_observado" ? 0 : 
           value === "emergente" ? 20 : 
           value === "inconsistente" ? 40 : 
           value === "moderado" ? 60 :
           value === "consistente" ? 80 : 
           value === "excepcional" ? 100 : 0;
  };

  const calculateSubdomainScore = (domain: string, subdomain: string, parameters: string[]) => {
    const maxPossible = parameters.length * 100;
    
    const totalScore = parameters.reduce((acc, param) => {
      const score = calculateScore(domain, subdomain, param);
      return acc + score;
    }, 0);
    
    const percentage = Math.round((totalScore / maxPossible) * 100);
    
    return {
      raw: totalScore,
      percentage: percentage
    };
  };

  const calculateDomainScore = (domain: any) => {
    let totalScore = 0;
    let maxPossible = 0;
    
    domain.subdomains.forEach((subdomain: any) => {
      const score = calculateSubdomainScore(domain.title, subdomain.title, subdomain.parameters);
      totalScore += score.raw;
      maxPossible += subdomain.parameters.length * 100;
    });
    
    return {
      raw: totalScore,
      percentage: Math.round((totalScore / maxPossible) * 100)
    };
  };

  const calculateOverallScore = () => {
    let totalScore = 0;
    let maxPossible = 0;
    let evaluatedDomainsCount = 0;
    
    evaluationDomains.forEach(domain => {
      if (isDomainEvaluated(domain)) {
        domain.subdomains.forEach(subdomain => {
          subdomain.parameters.forEach(param => {
            const score = calculateScore(domain.title, subdomain.title, param);
            totalScore += score;
            maxPossible += 100;
          });
        });
        evaluatedDomainsCount++;
      }
    });
    
    return {
      raw: totalScore,
      max: maxPossible,
      percentage: Math.round((totalScore / maxPossible) * 100),
      evaluatedDomains: evaluatedDomainsCount,
      totalDomains: evaluationDomains.length
    };
  };

  const getDomainAverages = () => {
    const averages = evaluationDomains
      .filter(domain => isDomainEvaluated(domain))
      .map(domain => {
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
    const subdomainScores = evaluationDomains
      .filter(domain => isDomainEvaluated(domain))
      .flatMap(domain => 
        domain.subdomains
          .filter(subdomain => isSubdomainEvaluated(domain.title, subdomain.title, subdomain.parameters))
          .map(subdomain => ({
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

  const COLORS = ['#10b981', '#f97316'];

  const { data: professionalData } = useProfessionalData();

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleGenerateParametersPDF = async () => {
    try {
      const pdfContent = (
        <div id="pdf-content" style={{ display: 'block' }}>
          <ParametersGraphsPDF
            categoryData={subdomainScores}
            pieData={pieData}
            patientName={selectedPatientData?.name}
            professionalData={professionalData}
            radarData={domainScores}
            overallScore={overallScore}
            evaluationDate={evaluationDate}
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

      toast.loading("Gerando PDF de Parâmetros e Gráficos...");

      const opt = {
        margin: [10, 10],
        filename: `parametros-graficos-${selectedPatientData?.name || 'paciente'}.pdf`,
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
      
      toast.success("PDF de Parâmetros e Gráficos gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
    }
  };

  const handleGenerateMuseteraPDF = async () => {
    try {
      const pdfContent = (
        <div id="pdf-content" style={{ display: 'block' }}>
          <EnhancedMuseteraReportPDF
            categoryData={subdomainScores}
            pieData={pieData}
            patientName={selectedPatientData?.name}
            professionalData={professionalData}
            radarData={domainScores}
            selectedParameters={selections}
            overallScore={overallScore}
            evaluationDomains={evaluationDomains}
            evaluationDate={evaluationDate}
            patientData={{
              age: selectedPatientData?.age || undefined,
              birthDate: selectedPatientData?.birth_date || undefined
            }}
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

      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.loading("Gerando Relatório MuseTera Aprimorado...");

      const opt = {
        margin: [8, 8],
        filename: `relatorio-musetera-completo-${selectedPatientData?.name || 'paciente'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1.8,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          letterRendering: true
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
      
      toast.success("Relatório MuseTera Aprimorado gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
    }
  };

  const getScoreLabel = (score: number) => {
    // Mapeia diretamente os valores corretos
    switch(score) {
      case 0: return "Não Observado: 0 pontos (0%)";
      case 20: return "Emergente: 20 pontos (20%)";
      case 40: return "Inconsistente: 40 pontos (40%)";
      case 60: return "Moderado: 60 pontos (60%)";
      case 80: return "Consistente: 80 pontos (80%)";
      case 100: return "Excepcional: 100 pontos (100%)";
      default: return "Não Observado: 0 pontos (0%)";
    }
  };

  const getScoreColor = (score: number) => {
    switch(score) {
      case 0: return "border-red-500";      // Não Observado
      case 20: return "border-orange-400";  // Emergente
      case 40: return "border-yellow-400";  // Inconsistente
      case 60: return "border-blue-500";    // Moderado
      case 80: return "border-green-500";   // Consistente
      case 100: return "border-green-500";  // Excepcional
      default: return "border-red-500";
    }
  };

  const getScoreBgColor = (score: number, isSelected: boolean) => {
    if (!isSelected) return "bg-white";
    
    switch(score) {
      case 0: return "bg-red-500";      // Não Observado
      case 20: return "bg-orange-400";  // Emergente
      case 40: return "bg-yellow-400";  // Inconsistente
      case 60: return "bg-blue-500";    // Moderado
      case 80: return "bg-green-500";   // Consistente
      case 100: return "bg-green-500";  // Excepcional
      default: return "bg-white";
    }
  };

  const levelToScore = (level: string): number => {
    switch(level) {
      case '0': return 0;   // Não Observado
      case '1': return 20;  // Emergente
      case '2': return 40;  // Inconsistente
      case '3': return 60;  // Moderado
      case '4': return 80;  // Consistente
      case '5': return 100; // Excepcional
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8 animate-fade-in">
        <EvaluationLevelsHero />
        
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-pulse-gentle">
            Escala MuseTera
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">
            Instrumento de Avaliação Musicoterapêutica Profissional
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl shadow-blue-500/10 p-6 sm:p-8 rounded-3xl animate-fade-in">
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              <div className="p-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
                <div className="bg-white rounded-xl p-4">
                  <PatientSelect
                    patients={patients}
                    selectedPatient={selectedPatient}
                    onSelect={setSelectedPatient}
                    isLoading={isLoading}
                    emptyMessage="Nenhum paciente cadastrado por você"
                  />
                </div>
              </div>
              
              {selectedPatientData && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-800">
                    <span className="text-emerald-600">Idade:</span> {selectedPatientData.age ? `${selectedPatientData.age} anos` : 'Não informada'}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Data da Avaliação</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[220px] justify-start text-left font-normal bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300",
                        !evaluationDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                      {evaluationDate ? format(evaluationDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-0 shadow-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={evaluationDate}
                      onSelect={(date) => date && setEvaluationDate(date)}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className="pointer-events-auto rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={selectedEvaluation}
                onValueChange={setSelectedEvaluation}
              >
                <SelectTrigger className="w-full sm:w-[200px] bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:from-gray-100 hover:to-slate-100 transition-all duration-300">
                  <SelectValue placeholder="Selecione a avaliação" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl">
                  <SelectItem value="1">Avaliação Inicial</SelectItem>
                  <SelectItem value="2">Avaliação de Progresso</SelectItem>
                  <SelectItem value="3">Avaliação Periódica</SelectItem>
                  <SelectItem value="4">Avaliação Final</SelectItem>
                </SelectContent>
              </Select>
              
              <TooltipProvider>
                <TooltipComponent>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleGenerateParametersPDF}
                      variant="outline"
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FileBarChart className="h-4 w-4" />
                      Parâmetros
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-0">
                    <p>Gera PDF com gráficos e dados quantitativos</p>
                  </TooltipContent>
                </TooltipComponent>
              </TooltipProvider>

              <TooltipProvider>
                <TooltipComponent>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleGenerateMuseteraPDF}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FileText className="h-4 w-4" />
                      Relatório MuseTera
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-0">
                    <p>Gera relatório completo com análise e recomendações</p>
                  </TooltipContent>
                </TooltipComponent>
              </TooltipProvider>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-100 to-slate-100 p-1 rounded-2xl h-14">
              <TabsTrigger 
                value="evaluation" 
                className="rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-purple-600 transition-all duration-300"
              >
                Escala MuseTera
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 transition-all duration-300"
              >
                Resultados
              </TabsTrigger>
              <TabsTrigger 
                value="comparison" 
                className="rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 transition-all duration-300"
              >
                Comparação
              </TabsTrigger>
            </TabsList>

            <TabsContent value="evaluation" className="space-y-8 mt-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Escala MuseTera - Versão Profissional</h3>
                <p className="text-blue-700 text-sm">
                  Sistema de pontuação (0-100): Não Observado (0), Emergente (20), Inconsistente (40), 
                  Moderado (60), Consistente (80), Excepcional (100)
                </p>
              </div>

              {/* Estatísticas da Avaliação Parcial */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Status da Avaliação</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{getEvaluatedDomainsCount()}</p>
                    <p className="text-sm text-emerald-700">Domínios Avaliados</p>
                    <p className="text-xs text-emerald-600">de {evaluationDomains.length} total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-600">{getEvaluatedSubdomainsCount()}</p>
                    <p className="text-sm text-teal-700">Subdomínios Avaliados</p>
                    <p className="text-xs text-teal-600">
                      de {evaluationDomains.reduce((acc, domain) => acc + domain.subdomains.length, 0)} total
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round((getEvaluatedDomainsCount() / evaluationDomains.length) * 100)}%
                    </p>
                    <p className="text-sm text-blue-700">Completude</p>
                    <p className="text-xs text-blue-600">da avaliação</p>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm text-emerald-700">
                    💡 Apenas domínios avaliados impactam na pontuação final
                  </p>
                </div>
              </div>

              {evaluationDomains.map((domain, domainIndex) => (
                <div key={domainIndex} className="group animate-fade-in" style={{animationDelay: `${domainIndex * 0.1}s`}}>
                  <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${domain.color} bg-opacity-5 group-hover:bg-opacity-10`}>
                    <div className="flex items-center mb-6 gap-3">
                      <div className={`text-3xl p-3 rounded-2xl bg-gradient-to-r ${domain.color} bg-opacity-20`}>
                        {domain.icon}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{domain.title}</h2>
                      
                      {/* Badge indicador de status do domínio */}
                      <div className="ml-auto flex items-center gap-2">
                        {isDomainEvaluated(domain) ? (
                          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
                            ✓ Avaliado
                          </div>
                        ) : (
                          <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                            Não Avaliado
                          </div>
                        )}
                        
                        <TooltipProvider>
                          <TooltipComponent>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/50 rounded-full">
                                <HelpCircle className="h-5 w-5 text-gray-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs bg-gray-900 text-white border-0">
                              <p className="text-sm">{domain.description}</p>
                            </TooltipContent>
                          </TooltipComponent>
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    {domain.subdomains.map((subdomain, subdomainIndex) => (
                      <div key={subdomainIndex} className="mb-8 last:mb-0">
                        <Card className="border-l-4 border-l-purple-400 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{subdomain.title}</h3>
                              <TooltipProvider>
                                <TooltipComponent>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 hover:bg-purple-100 rounded-full">
                                      <Info className="h-4 w-4 text-purple-600" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs bg-gray-900 text-white border-0">
                                    <p className="text-sm">{subdomain.description}</p>
                                  </TooltipContent>
                                </TooltipComponent>
                              </TooltipProvider>
                            </div>
                            
                            {/* Badge indicador de status do subdomínio */}
                            {isSubdomainEvaluated(domain.title, subdomain.title, subdomain.parameters) ? (
                              <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-xs font-medium border border-emerald-200">
                                ✓ Avaliado
                              </div>
                            ) : (
                              <div className="bg-gray-50 text-gray-500 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">
                                Pendente
                              </div>
                            )}
                          </div>
                          
                          <div className="overflow-x-auto rounded-xl shadow-inner">
                            <Table className="min-w-full">
                              <TableHeader>
                                <TableRow className="bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100">
                                  <TableHead className="min-w-[200px] font-semibold text-gray-800 text-base">Parâmetros Avaliados</TableHead>
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
                                    <span className="block text-xs font-normal">Excepcional</span>
                                    <span className="block text-xs font-normal">(5)</span>
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {subdomain.parameters.map((parameter, paramIndex) => (
                                  <TableRow key={paramIndex} className="hover:bg-blue-50/50 transition-colors duration-200">
                                    <TableCell className="text-sm sm:text-base font-medium text-gray-800 py-4">{parameter}</TableCell>
                                    {["nao_observado", "emergente", "inconsistente", "moderado", "consistente", "excepcional"].map((level, levelIndex) => (
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
                                               className={`block w-3 h-3 sm:w-4 sm:h-4 rounded-full cursor-pointer border-2 ${getScoreColor(levelToScore(level))} ${
                                                 selections[`${domain.title}-${subdomain.title}-${parameter}`] === level
                                                   ? getScoreBgColor(levelToScore(level), true)
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
                        </Card>
                      </div>
                    ))}
                  </Card>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="results" className="space-y-8 mt-8">
              {/* Informações sobre Avaliação Parcial */}
              {getEvaluatedDomainsCount() < evaluationDomains.length && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">⚡ Avaliação Parcial Detectada</h3>
                  <p className="text-amber-700 text-sm mb-2">
                    Esta é uma avaliação parcial onde nem todos os domínios foram pontuados. 
                    Os resultados refletem apenas os domínios efetivamente avaliados.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center mt-3">
                    <div className="bg-amber-100 p-2 rounded">
                      <p className="text-sm font-semibold text-amber-800">Avaliados</p>
                      <p className="text-lg font-bold text-amber-700">{getEvaluatedDomainsCount()}</p>
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                      <p className="text-sm font-semibold text-gray-600">Não Avaliados</p>
                      <p className="text-lg font-bold text-gray-500">{evaluationDomains.length - getEvaluatedDomainsCount()}</p>
                    </div>
                  </div>
                </div>
              )}

              <Card className="border-0 shadow-2xl p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-blue-50 to-indigo-50">
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Resultados da Escala MuseTera
                  {getEvaluatedDomainsCount() < evaluationDomains.length && (
                    <span className="block text-sm font-normal text-amber-600 mt-1">
                      (Avaliação Parcial - {getEvaluatedDomainsCount()}/{evaluationDomains.length} domínios)
                    </span>
                  )}
                </h2>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                  <Card className="border-0 shadow-xl p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50">
                    <h3 className="text-lg sm:text-xl font-bold mb-6 text-center text-purple-800">
                      Perfil Musicoterapêutico
                    </h3>
                    <div className="h-[350px] sm:h-[400px] w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={domainScores}>
                          <PolarGrid stroke="#e0e7ff" />
                          <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: '#6366f1' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#6366f1' }} />
                          <Radar name="Perfil" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={3} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="border-0 shadow-xl p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50">
                    <h3 className="text-lg sm:text-xl font-bold mb-6 text-center text-emerald-800">
                      Desenvolvimento Global
                    </h3>
                    <div className="h-[350px] sm:h-[400px] w-full flex flex-col items-center justify-center">
                      <div className="h-[250px] sm:h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius="60%"
                              outerRadius="90%"
                              paddingAngle={5}
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                       <div className="text-center mt-4 p-4 bg-white rounded-xl shadow-inner">
                         <p className="text-lg font-bold text-gray-800">Pontuação Total: {overallScore.raw}/{overallScore.max}</p>
                         <p className="text-sm text-emerald-600 font-semibold">Percentil de desenvolvimento: {overallScore.percentage}%</p>
                         {overallScore.evaluatedDomains && overallScore.totalDomains && (
                           <div className="mt-3 pt-3 border-t border-gray-200">
                             <p className="text-xs text-gray-600">
                               📊 Avaliação Parcial: {overallScore.evaluatedDomains} de {overallScore.totalDomains} domínios avaliados
                             </p>
                             <p className="text-xs text-blue-600 font-medium">
                               * Apenas domínios avaliados impactam na pontuação final
                             </p>
                           </div>
                         )}
                       </div>
                    </div>
                  </Card>
                </div>
                
                <Card className="border-0 shadow-xl p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50">
                  <h3 className="text-lg sm:text-xl font-bold mb-6 text-center text-blue-800">
                    Análise Detalhada por Subdomínios
                  </h3>
                  <div className="h-[450px] sm:h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subdomainScores}
                        margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={100}
                          tick={{ fontSize: 11, fill: '#0369a1' }}
                        />
                        <YAxis domain={[0, 100]} tick={{ fill: '#0369a1' }} />
                        <Tooltip content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-4 border-0 rounded-xl shadow-xl">
                                <p className="text-sm font-semibold text-gray-800">{data.name}</p>
                                <p className="text-sm text-blue-600">Domínio: {data.domain}</p>
                                <p className="text-sm font-bold text-green-600">Pontuação: {data.value}%</p>
                              </div>
                            );
                          }
                          return null;
                        }} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {subdomainScores.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={
                                entry.domain === "Musical" ? "#8b5cf6" :
                                entry.domain === "Psicossocial" ? "#10b981" : 
                                entry.domain === "Cognitivo" ? "#f59e0b" : 
                                entry.domain === "Sensório-Motor" ? "#ef4444" :
                                entry.domain === "Comunicativo-Interativo" ? "#6366f1" :
                                entry.domain === "Neurofisiológico" ? "#14b8a6" : "#ec4899"
                              } 
                            />
                          ))}
                        </Bar>
                        <Legend />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Card>
            </TabsContent>
            
            <TabsContent value="comparison" className="mt-8">
              <Card className="border-0 shadow-2xl p-8 rounded-3xl bg-gradient-to-br from-white via-gray-50 to-slate-50">
                <div className="flex justify-center items-center h-[400px]">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileBarChart className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Comparação Evolutiva</h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Realize múltiplas avaliações para visualizar a evolução do paciente ao longo do tempo.
                    </p>
                    <Button variant="outline" className="bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 border-gray-300" disabled>
                      Carregar Avaliações Anteriores
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
