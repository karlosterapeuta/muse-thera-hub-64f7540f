
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Domain {
  id: string;
  name: string;
  subdomains: Subdomain[];
}

interface Subdomain {
  id: string;
  name: string;
  description: string;
  score: number;
}

export default function Evaluation() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("domain-scoring");
  const [selectedDomain, setSelectedDomain] = useState<string | undefined>("musical");
  
  // Domain data with subdomains
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: "musical",
      name: "Domínio Musical",
      subdomains: [
        { id: "rhythm", name: "Ritmo", description: "Capacidade de acompanhar e reproduzir padrões rítmicos", score: 0 },
        { id: "melody", name: "Melodia", description: "Percepção e reprodução melódica", score: 0 },
        { id: "instrument", name: "Instrumentação", description: "Habilidade com instrumentos musicais", score: 0 },
        { id: "voice", name: "Voz e Canto", description: "Expressão vocal e afinação", score: 0 },
        { id: "creativity", name: "Criatividade Musical", description: "Capacidade de improvisação e criação", score: 0 },
      ],
    },
    {
      id: "psychosocial",
      name: "Domínio Psicossocial",
      subdomains: [
        { id: "emotion", name: "Expressão Emocional", description: "Capacidade de expressar emoções através da música", score: 0 },
        { id: "social", name: "Interação Social", description: "Participação e interação em atividades em grupo", score: 0 },
        { id: "communication", name: "Comunicação", description: "Comunicação verbal e não verbal", score: 0 },
        { id: "motivation", name: "Motivação", description: "Interesse e engajamento nas atividades", score: 0 },
        { id: "regulation", name: "Autorregulação", description: "Capacidade de controle emocional", score: 0 },
      ],
    },
    {
      id: "cognitive",
      name: "Domínio Cognitivo",
      subdomains: [
        { id: "attention", name: "Atenção", description: "Capacidade de manter o foco nas atividades", score: 0 },
        { id: "memory", name: "Memória", description: "Retenção e recuperação de informações musicais", score: 0 },
        { id: "comprehension", name: "Compreensão", description: "Entendimento de instruções e conceitos", score: 0 },
        { id: "decisionMaking", name: "Tomada de Decisão", description: "Capacidade de fazer escolhas durante atividades musicais", score: 0 },
        { id: "planning", name: "Planejamento", description: "Organização e sequenciamento de ações", score: 0 },
      ],
    },
    {
      id: "sensorymotor",
      name: "Domínio Sensório-Motor",
      subdomains: [
        { id: "coordination", name: "Coordenação", description: "Coordenação motora fina e grossa", score: 0 },
        { id: "balance", name: "Equilíbrio", description: "Estabilidade corporal durante atividades", score: 0 },
        { id: "laterality", name: "Lateralidade", description: "Consciência e uso dos lados do corpo", score: 0 },
        { id: "sensoryIntegration", name: "Integração Sensorial", description: "Processamento e resposta a estímulos sensoriais", score: 0 },
        { id: "motorPlanning", name: "Planejamento Motor", description: "Capacidade de planejar e executar movimentos", score: 0 },
      ],
    },
  ]);

  // Score levels descriptions
  const scoreLevels = [
    { value: 0, label: "0 - Não Avaliado", description: "Não foi possível avaliar este item" },
    { value: 1, label: "1 - Limitado", description: "Apresenta severa dificuldade nesta área" },
    { value: 2, label: "2 - Emergente", description: "Demonstra habilidade com suporte significativo" },
    { value: 3, label: "3 - Moderado", description: "Demonstra habilidade com suporte moderado" },
    { value: 4, label: "4 - Funcional", description: "Demonstra habilidade com suporte mínimo" },
    { value: 5, label: "5 - Independente", description: "Demonstra habilidade sem necessidade de suporte" },
  ];

  // Handle score change for a specific subdomain
  const handleScoreChange = (domainId: string, subdomainId: string, score: number) => {
    setDomains(
      domains.map((domain) => {
        if (domain.id === domainId) {
          return {
            ...domain,
            subdomains: domain.subdomains.map((subdomain) => {
              if (subdomain.id === subdomainId) {
                return { ...subdomain, score };
              }
              return subdomain;
            }),
          };
        }
        return domain;
      })
    );
  };

  // Get the average score for each domain
  const getDomainAverages = () => {
    return domains.map((domain) => {
      const scores = domain.subdomains.map((s) => s.score).filter((s) => s > 0);
      const average = scores.length > 0 
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 
        : 0;
        
      return {
        name: domain.name,
        score: average,
        fullMark: 5,
      };
    });
  };

  // Get data for the subdomain bar chart
  const getSubdomainData = () => {
    const domain = domains.find((d) => d.id === selectedDomain);
    if (!domain) return [];
    
    return domain.subdomains.map((s) => ({
      name: s.name,
      score: s.score,
    }));
  };

  // Handle save
  const handleSave = () => {
    // Implementation would connect to backend
    toast({
      title: "Avaliação salva",
      description: "Os dados da avaliação foram salvos com sucesso.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Avaliação Musicoterapêutica</h1>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" /> Salvar Avaliação
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="domain-scoring">Pontuação</TabsTrigger>
            <TabsTrigger value="visualization">Visualização</TabsTrigger>
          </TabsList>
          
          <TabsContent value="domain-scoring" className="space-y-4">
            {domains.map((domain) => (
              <Card key={domain.id} className="p-4">
                <h2 className="text-xl font-semibold text-primary mb-4">{domain.name}</h2>
                <div className="space-y-4">
                  {domain.subdomains.map((subdomain) => (
                    <div key={subdomain.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b pb-3">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">{subdomain.name}</span>
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                  <HelpCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{subdomain.description}</p>
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <div className="w-full sm:w-48">
                        <Select
                          value={subdomain.score.toString()}
                          onValueChange={(value) => 
                            handleScoreChange(domain.id, subdomain.id, parseInt(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma pontuação" />
                          </SelectTrigger>
                          <SelectContent>
                            {scoreLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value.toString()}>
                                <div>
                                  <div>{level.label}</div>
                                  <div className="text-xs text-gray-500">{level.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="visualization" className="space-y-6">
            <Card className="p-4">
              <h2 className="text-xl font-semibold text-primary mb-4">Visão Geral dos Domínios</h2>
              <div className="w-full h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="80%" data={getDomainAverages()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: '#888' }} />
                    <Radar
                      name="Pontuação"
                      dataKey="score"
                      stroke="#6D28D9"
                      fill="#6D28D9"
                      fillOpacity={0.6}
                    />
                    <Tooltip formatter={(value) => [`${value}`, "Pontuação"]} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold text-primary">Detalhamento por Domínio</h2>
                <Select
                  value={selectedDomain}
                  onValueChange={setSelectedDomain}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Selecione um domínio" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((domain) => (
                      <SelectItem key={domain.id} value={domain.id}>
                        {domain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getSubdomainData()}
                    margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
                  >
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#888' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#6D28D9" name="Pontuação" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
