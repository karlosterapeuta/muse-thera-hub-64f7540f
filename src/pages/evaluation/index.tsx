
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
import { FileDown, Info, HelpCircle, Brain, Heart, Music, Hand, Sparkles } from "lucide-react";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";
import { PatientSelect } from "../anamnesis/components/PatientSelect";
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
      description: "Avaliação das habilidades e respostas musicais",
      icon: Music,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      subdomains: [
        {
          title: "Percepção Musical",
          description: "Capacidade de perceber e discriminar elementos musicais",
          parameters: [
            "Discriminação de altura sonora",
            "Reconhecimento de timbres",
            "Percepção rítmica",
            "Memória musical",
            "Atenção aos estímulos sonoros"
          ]
        },
        {
          title: "Expressão Musical",
          description: "Capacidade de se expressar através da música",
          parameters: [
            "Expressividade vocal/instrumental",
            "Criatividade musical",
            "Improvisação",
            "Sincronização com o pulso",
            "Qualidade da produção sonora"
          ]
        }
      ]
    },
    {
      title: "Domínio Psicossocial",
      description: "Avaliação dos aspectos psicológicos e sociais",
      icon: Heart,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      subdomains: [
        {
          title: "Interação Social",
          description: "Qualidade das interações sociais durante as atividades musicais",
          parameters: [
            "Engajamento com o terapeuta",
            "Interação com pares",
            "Compartilhamento de experiências",
            "Iniciativa social",
            "Reciprocidade"
          ]
        },
        {
          title: "Regulação Emocional",
          description: "Capacidade de utilizar a música para regulação emocional",
          parameters: [
            "Expressão de emoções",
            "Auto-regulação através da música",
            "Resposta emocional apropriada",
            "Modulação do humor",
            "Tolerância à frustração"
          ]
        }
      ]
    },
    {
      title: "Domínio Cognitivo",
      description: "Avaliação das funções cognitivas",
      icon: Brain,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      subdomains: [
        {
          title: "Funções Executivas",
          description: "Capacidade de planejamento, organização e execução",
          parameters: [
            "Atenção sustentada",
            "Planejamento musical",
            "Flexibilidade cognitiva",
            "Resolução de problemas musicais",
            "Tomada de decisão"
          ]
        },
        {
          title: "Processamento da Informação",
          description: "Capacidade de processar e responder a estímulos musicais",
          parameters: [
            "Velocidade de processamento",
            "Capacidade de sequenciamento",
            "Integração sensorial",
            "Memória de trabalho",
            "Capacidade de generalização"
          ]
        }
      ]
    },
    {
      title: "Domínio Sensório-Motor",
      description: "Avaliação da integração sensorial e motora",
      icon: Hand,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      subdomains: [
        {
          title: "Coordenação Motora",
          description: "Qualidade dos movimentos relacionados à música",
          parameters: [
            "Coordenação bimanual",
            "Controle motor fino",
            "Planejamento motor",
            "Precisão rítmica motora",
            "Integração de movimento e música"
          ]
        },
        {
          title: "Processamento Sensorial",
          description: "Resposta aos estímulos sensoriais musicais",
          parameters: [
            "Resposta auditiva",
            "Integração audiovisual",
            "Resposta tátil a instrumentos",
            "Propriocepção durante atividades",
            "Tolerância a estímulos sonoros"
          ]
        }
      ]
    }
  ];

  const calculateScore = (domain: string, subdomain: string, parameter: string) => {
    const key = `${domain}-${subdomain}-${parameter}`;
    const value = selections[key];
    
    if (!value) return 0;
    
    return value === "ausente" ? 0 : 
           value === "emergente" ? 1 : 
           value === "inconsistente" ? 2 : 
           value === "consistente" ? 3 : 4;
  };

  const calculateSubdomainScore = (domain: string, subdomain: string, parameters: string[]) => {
    const maxPossible = parameters.length * 4;
    
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
      maxPossible += subdomain.parameters.length * 4;
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
          maxPossible += 4;
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
      console.log("Iniciando geração de PDF...");
      
      if (!selectedPatientData) {
        toast.error("Selecione um paciente antes de gerar o PDF");
        return;
      }

      toast.loading("Gerando PDF...");

      // Criar elemento temporário para o PDF
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);

      // Calcular dados necessários
      const overallScore = calculateOverallScore();

      // Renderizar o conteúdo do PDF diretamente em HTML
      tempDiv.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
            <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 10px;">Resultados da Avaliação Musicoterapêutica</h1>
            <h2 style="color: #374151; font-size: 18px; margin-bottom: 10px;">Paciente: ${selectedPatientData.name}</h2>
            <p style="color: #6b7280; font-size: 14px;">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 15px;">
              <p style="color: #1e40af; font-size: 16px; font-weight: bold; margin: 0;">
                Pontuação Total: ${overallScore.raw}/${overallScore.max} (${overallScore.percentage}%)
              </p>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #374151; font-size: 18px; margin-bottom: 15px;">Pontuações por Domínio</h3>
            ${evaluationDomains.map(domain => {
              const domainScore = calculateDomainScore(domain);
              return `
                <div style="margin-bottom: 15px; padding: 12px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 600; color: #374151;">${domain.title}</span>
                    <span style="color: #3b82f6; font-weight: bold;">${domainScore.percentage}%</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #374151; font-size: 18px; margin-bottom: 15px;">Detalhamento dos Parâmetros Avaliados</h3>
            ${evaluationDomains.map(domain => `
              <div style="margin-bottom: 25px;">
                <h4 style="color: #2563eb; font-size: 16px; margin-bottom: 15px;">
                  ${domain.title}
                </h4>
                ${domain.subdomains.map(subdomain => `
                  <div style="margin-bottom: 20px; margin-left: 15px;">
                    <h5 style="color: #374151; font-size: 14px; font-weight: bold; margin-bottom: 10px; border-left: 4px solid #93c5fd; padding-left: 10px;">
                      ${subdomain.title}
                    </h5>
                    <div style="display: grid; gap: 8px;">
                      ${subdomain.parameters.map(parameter => {
                        const key = `${domain.title}-${subdomain.title}-${parameter}`;
                        const selectedValue = selections[key];
                        const score = selectedValue === "ausente" ? 0 : 
                                    selectedValue === "emergente" ? 1 : 
                                    selectedValue === "inconsistente" ? 2 : 
                                    selectedValue === "consistente" ? 3 : 
                                    selectedValue === "independente" ? 4 : null;
                        
                        const getScoreLabel = (score: number | null) => {
                          if (score === 0) return "Ausente (0)";
                          if (score === 1) return "Emergente (1)";
                          if (score === 2) return "Inconsistente (2)";
                          if (score === 3) return "Consistente (3)";
                          if (score === 4) return "Independente (4)";
                          return "Não avaliado";
                        };

                        const getScoreColor = (score: number | null) => {
                          if (score === 0) return "#ef4444";
                          if (score === 1) return "#f97316";
                          if (score === 2) return "#eab308";
                          if (score === 3) return "#3b82f6";
                          if (score === 4) return "#22c55e";
                          return "#6b7280";
                        };

                        return `
                          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #f9fafb; border-radius: 4px; font-size: 12px;">
                            <span style="flex: 1; color: #374151;">${parameter}</span>
                            <span style="color: ${score !== null ? getScoreColor(score) : '#6b7280'}; font-weight: bold;">
                              ${score !== null ? getScoreLabel(score) : 'Não avaliado'}
                            </span>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 5px;">
              Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 5px;">
              Musetera - Sistema de Gestão para Musicoterapia
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 5px;">
              Musicoterapeuta: ${userName}
            </p>
            <p style="color: #6b7280; font-size: 12px;">
              Email: ${userEmail}
            </p>
          </div>
        </div>
      `;

      // Aguardar renderização
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = tempDiv;
      
      const opt = {
        margin: [10, 10],
        filename: `avaliacao-musicoterapeutica-${selectedPatientData.name.replace(/\s+/g, '_')}.pdf`,
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
          orientation: 'portrait'
        }
      };

      await html2pdf().set(opt).from(element).save();
      
      // Limpar elemento temporário
      document.body.removeChild(tempDiv);
      
      toast.success("PDF gerado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Verifique se há dados suficientes preenchidos.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Header Card with Gradient */}
        <Card className="p-6 sm:p-8 shadow-xl bg-gradient-to-r from-white via-blue-50 to-purple-50 border-0 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Avaliação Musicoterapêutica
                  </h1>
                  <p className="text-gray-600 mt-1">Sistema integrado de avaliação para TEA</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <PatientSelect
                  patients={patients}
                  selectedPatient={selectedPatient}
                  onSelect={setSelectedPatient}
                  isLoading={isLoading}
                  emptyMessage="Nenhum paciente cadastrado por você"
                />
                {selectedPatientData && (
                  <div className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-700">
                      Idade: <span className="text-blue-600">{selectedPatientData.age ? `${selectedPatientData.age} anos` : 'Não informada'}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={selectedEvaluation}
                onValueChange={setSelectedEvaluation}
              >
                <SelectTrigger className="w-full sm:w-[200px] h-11 bg-white/90 backdrop-blur-sm border-gray-200 shadow-sm">
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
                className="h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Gerar PDF
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm p-1 rounded-xl shadow-sm">
              <TabsTrigger 
                value="evaluation" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                Avaliação
              </TabsTrigger>
              <TabsTrigger 
                value="results"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                Resultados
              </TabsTrigger>
              <TabsTrigger 
                value="comparison"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                Comparação
              </TabsTrigger>
            </TabsList>

            <TabsContent value="evaluation" className="space-y-8 mt-8">
              {evaluationDomains.map((domain, domainIndex) => (
                <Card key={domainIndex} className={`p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-0 ${domain.bgColor} backdrop-blur-sm`}>
                  <div className="flex items-center mb-6 gap-3">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${domain.color} text-white shadow-lg`}>
                      <domain.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{domain.title}</h2>
                      <TooltipProvider>
                        <TooltipComponent>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-auto p-1 text-gray-500 hover:text-gray-700">
                              <HelpCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Mais informações</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">{domain.description}</p>
                          </TooltipContent>
                        </TooltipComponent>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  {domain.subdomains.map((subdomain, subdomainIndex) => (
                    <div key={subdomainIndex} className="mb-8 last:mb-0">
                      <div className="flex items-center mb-4 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-white/40">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex-1">{subdomain.title}</h3>
                        <TooltipProvider>
                          <TooltipComponent>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-sm">{subdomain.description}</p>
                            </TooltipContent>
                          </TooltipComponent>
                        </TooltipProvider>
                      </div>
                      
                      <div className="overflow-x-auto rounded-lg bg-white/80 backdrop-blur-sm shadow-sm">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50/80">
                              <TableHead className="min-w-[200px] font-semibold text-gray-700">Habilidades</TableHead>
                              <TableHead className="w-24 text-center font-semibold text-red-600">
                                <div className="flex flex-col items-center">
                                  <span className="text-xs">Ausente</span>
                                  <span className="text-xs font-normal">(0)</span>
                                </div>
                              </TableHead>
                              <TableHead className="w-24 text-center font-semibold text-orange-600">
                                <div className="flex flex-col items-center">
                                  <span className="text-xs">Emergente</span>
                                  <span className="text-xs font-normal">(1)</span>
                                </div>
                              </TableHead>
                              <TableHead className="w-24 text-center font-semibold text-yellow-600">
                                <div className="flex flex-col items-center">
                                  <span className="text-xs">Inconsistente</span>
                                  <span className="text-xs font-normal">(2)</span>
                                </div>
                              </TableHead>
                              <TableHead className="w-24 text-center font-semibold text-blue-600">
                                <div className="flex flex-col items-center">
                                  <span className="text-xs">Consistente</span>
                                  <span className="text-xs font-normal">(3)</span>
                                </div>
                              </TableHead>
                              <TableHead className="w-24 text-center font-semibold text-green-600">
                                <div className="flex flex-col items-center">
                                  <span className="text-xs">Independente</span>
                                  <span className="text-xs font-normal">(4)</span>
                                </div>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {subdomain.parameters.map((parameter, paramIndex) => (
                              <TableRow key={paramIndex} className="hover:bg-white/40 transition-colors">
                                <TableCell className="text-sm sm:text-base font-medium text-gray-700">{parameter}</TableCell>
                                {["ausente", "emergente", "inconsistente", "consistente", "independente"].map((level) => (
                                  <TableCell key={level} className="text-center p-3 sm:p-4">
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
                                          className={`block w-5 h-5 sm:w-6 sm:h-6 rounded-full cursor-pointer border-2 transition-all duration-200 hover:scale-110 ${
                                            level === "ausente" ? "border-red-400 hover:border-red-500" :
                                            level === "emergente" ? "border-orange-400 hover:border-orange-500" :
                                            level === "inconsistente" ? "border-yellow-400 hover:border-yellow-500" :
                                            level === "consistente" ? "border-blue-400 hover:border-blue-500" : "border-green-400 hover:border-green-500"
                                          } ${
                                            selections[`${domain.title}-${subdomain.title}-${parameter}`] === level
                                              ? level === "ausente" ? "bg-red-500 shadow-lg shadow-red-200" :
                                                level === "emergente" ? "bg-orange-500 shadow-lg shadow-orange-200" :
                                                level === "inconsistente" ? "bg-yellow-500 shadow-lg shadow-yellow-200" :
                                                level === "consistente" ? "bg-blue-500 shadow-lg shadow-blue-200" : "bg-green-500 shadow-lg shadow-green-200"
                                              : "bg-white hover:bg-gray-50"
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
                    </div>
                  ))}
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="results" className="space-y-6 mt-8">
              <Card className="p-6 sm:p-8 shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 border-0">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Resultados da Avaliação Musicoterapêutica
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                  <Card className="p-6 sm:p-8 shadow-lg bg-white/80 backdrop-blur-sm border border-white/40">
                    <h3 className="text-lg sm:text-xl font-semibold mb-6 text-center text-gray-800">
                      Perfil de Habilidades
                    </h3>
                    <div className="h-[300px] sm:h-[350px] w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={domainScores}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="name" tick={{ fill: '#374151', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                          <Radar name="Perfil" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-6 sm:p-8 shadow-lg bg-white/80 backdrop-blur-sm border border-white/40">
                    <h3 className="text-lg sm:text-xl font-semibold mb-6 text-center text-gray-800">
                      Pontuação Global
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
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-center mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                        <p className="text-lg font-semibold text-gray-800">Pontuação Total: {overallScore.raw}/{overallScore.max}</p>
                        <p className="text-sm text-gray-600 mt-1">Percentil de desenvolvimento: <span className="font-medium text-purple-600">{overallScore.percentage}%</span></p>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="mt-10">
                  <h3 className="text-lg sm:text-xl font-semibold mb-6 text-center text-gray-800">
                    Desempenho por Subdomínios
                  </h3>
                  <Card className="p-6 shadow-lg bg-white/80 backdrop-blur-sm border border-white/40">
                    <div className="h-[400px] sm:h-[450px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={subdomainScores}
                          margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={100}
                            tick={{ fontSize: 12, fill: '#374151' }}
                          />
                          <YAxis domain={[0, 100]} tick={{ fill: '#374151' }} />
                          <Tooltip content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-lg shadow-lg">
                                  <p className="text-sm font-semibold text-gray-800">{data.name}</p>
                                  <p className="text-sm text-gray-600">Domínio: {data.domain}</p>
                                  <p className="text-sm text-purple-600 font-medium">Pontuação: {data.value}%</p>
                                </div>
                              );
                            }
                            return null;
                          }} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {subdomainScores.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={
                                  entry.domain === "Musical" ? "#8b5cf6" :
                                  entry.domain === "Psicossocial" ? "#ec4899" : 
                                  entry.domain === "Cognitivo" ? "#3b82f6" : "#10b981"
                                } 
                              />
                            ))}
                          </Bar>
                          <Legend />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="comparison" className="mt-8">
              <Card className="p-8 shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 border-0">
                <div className="flex justify-center items-center h-[400px]">
                  <div className="text-center max-w-md">
                    <div className="p-6 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="h-10 w-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Comparação entre Avaliações</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Selecione ao menos duas avaliações para visualizar a comparação de progresso ao longo do tempo.
                    </p>
                    <Button 
                      variant="outline" 
                      className="bg-white/80 backdrop-blur-sm border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200" 
                      disabled
                    >
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
