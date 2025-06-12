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
      icon: "🎵",
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
      icon: "👥",
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
      icon: "🧠",
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
      icon: "👐",
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

  const handleGenerateParametersPDF = async () => {
    try {
      const pdfContent = (
        <div id="pdf-content" style={{ display: 'block' }}>
          <ParametersGraphsPDF
            categoryData={subdomainScores}
            pieData={pieData}
            patientName={selectedPatientData?.name}
            evaluatorName={userName}
            evaluatorEmail={userEmail}
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
            evaluatorName={userName}
            evaluatorEmail={userEmail}
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

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <EvaluationLevelsHero />
      
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
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Data da Avaliação</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !evaluationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {evaluationDate ? format(evaluationDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={evaluationDate}
                    onSelect={(date) => date && setEvaluationDate(date)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
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
            
            <TooltipProvider>
              <TooltipComponent>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleGenerateParametersPDF}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FileBarChart className="h-4 w-4" />
                    Parâmetros e Gráficos
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Gera PDF com gráficos e dados quantitativos</p>
                </TooltipContent>
              </TooltipComponent>
            </TooltipProvider>

            <TooltipProvider>
              <TooltipComponent>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleGenerateMuseteraPDF}
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Relatório MuseTera
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Gera relatório completo com análise e recomendações</p>
                </TooltipContent>
              </TooltipComponent>
            </TooltipProvider>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="evaluation">Avaliação</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="comparison">Comparação</TabsTrigger>
          </TabsList>

          <TabsContent value="evaluation" className="space-y-8 mt-6">
            {evaluationDomains.map((domain, domainIndex) => (
              <div key={domainIndex} className="border rounded-md p-4 sm:p-6 bg-card">
                <div className="flex items-center mb-4 gap-2">
                  <div className="text-2xl">{domain.icon}</div>
                  <h2 className="text-lg sm:text-xl font-semibold">{domain.title}</h2>
                  <TooltipProvider>
                    <TooltipComponent>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-sm">{domain.description}</p>
                      </TooltipContent>
                    </TooltipComponent>
                  </TooltipProvider>
                </div>
                
                {domain.subdomains.map((subdomain, subdomainIndex) => (
                  <div key={subdomainIndex} className="mb-6 border-l-2 pl-4 ml-2">
                    <div className="flex items-center mb-3">
                      <h3 className="text-base sm:text-lg font-medium">{subdomain.title}</h3>
                      <TooltipProvider>
                        <TooltipComponent>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                              <Info className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">{subdomain.description}</p>
                          </TooltipContent>
                        </TooltipComponent>
                      </TooltipProvider>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[150px]">Habilidades</TableHead>
                            <TableHead className="w-20 text-center">
                              <span className="block text-xs font-normal">Ausente</span>
                              <span className="block text-xs font-normal">(0)</span>
                            </TableHead>
                            <TableHead className="w-20 text-center">
                              <span className="block text-xs font-normal">Emergente</span>
                              <span className="block text-xs font-normal">(1)</span>
                            </TableHead>
                            <TableHead className="w-20 text-center">
                              <span className="block text-xs font-normal">Inconsistente</span>
                              <span className="block text-xs font-normal">(2)</span>
                            </TableHead>
                            <TableHead className="w-20 text-center">
                              <span className="block text-xs font-normal">Consistente</span>
                              <span className="block text-xs font-normal">(3)</span>
                            </TableHead>
                            <TableHead className="w-20 text-center">
                              <span className="block text-xs font-normal">Independente</span>
                              <span className="block text-xs font-normal">(4)</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subdomain.parameters.map((parameter, paramIndex) => (
                            <TableRow key={paramIndex}>
                              <TableCell className="text-sm sm:text-base">{parameter}</TableCell>
                              {["ausente", "emergente", "inconsistente", "consistente", "independente"].map((level) => (
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
                                        className={`block w-3 h-3 sm:w-4 sm:h-4 rounded-full cursor-pointer border-2 ${
                                          level === "ausente" ? "border-red-500" :
                                          level === "emergente" ? "border-orange-400" :
                                          level === "inconsistente" ? "border-yellow-400" :
                                          level === "consistente" ? "border-blue-500" : "border-green-500"
                                        } ${
                                          selections[`${domain.title}-${subdomain.title}-${parameter}`] === level
                                            ? level === "ausente" ? "bg-red-500" :
                                              level === "emergente" ? "bg-orange-400" :
                                              level === "inconsistente" ? "bg-yellow-400" :
                                              level === "consistente" ? "bg-blue-500" : "bg-green-500"
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
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="results" className="space-y-6 mt-6">
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
                Resultados da Avaliação Musicoterapêutica
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <Card className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
                    Perfil de Habilidades
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
                    <div className="text-center mt-4">
                      <p className="text-lg font-medium">Pontuação Total: {overallScore.raw}/{overallScore.max}</p>
                      <p className="text-sm text-gray-600">Percentil de desenvolvimento: {overallScore.percentage}%</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="mt-8">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
                  Desempenho por Subdomínios
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
                      <Tooltip content={({ active, payload }) => {
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
                              entry.domain === "Cognitivo" ? "#ffc658" : "#ff8042"
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
                  <h3 className="text-lg font-medium mb-4">Comparação entre Avaliações</h3>
                  <p className="text-gray-600">
                    Selecione ao menos duas avaliações para visualizar a comparação de progresso ao longo do tempo.
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
