
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
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
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

  // PDF generation function
  const generatePDF = async () => {
    try {
      setIsGeneratingPdf(true);
      toast({
        title: "Gerando PDF",
        description: "Aguarde enquanto seu PDF é criado...",
      });

      // Create a container where we'll render the PDF content
      const pdfContainer = document.createElement('div');
      pdfContainer.style.position = 'absolute';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.width = '800px'; // Fixed width for PDF
      pdfContainer.style.backgroundColor = 'white';
      pdfContainer.style.padding = '40px';
      pdfContainer.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(pdfContainer);

      // Create PDF header
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '30px';
      header.innerHTML = `
        <h1 style="color: #6D28D9; font-size: 24px; margin-bottom: 12px;">Avaliação Musicoterapêutica</h1>
        <p style="color: #64748b; font-size: 14px;">Data: ${new Date().toLocaleDateString()}</p>
      `;
      pdfContainer.appendChild(header);

      // Add domain scores section
      const scoreSection = document.createElement('div');
      scoreSection.style.marginBottom = '30px';
      scoreSection.innerHTML = `
        <h2 style="color: #334155; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
          Pontuação por Domínios
        </h2>
      `;

      // Add a table for domain scores
      const domainTable = document.createElement('table');
      domainTable.style.width = '100%';
      domainTable.style.borderCollapse = 'collapse';
      domainTable.style.marginBottom = '30px';
      
      // Add table header
      domainTable.innerHTML = `
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Domínio</th>
            <th style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0;">Pontuação Média</th>
          </tr>
        </thead>
        <tbody>
          ${domains.map(domain => {
            const domainAvg = getDomainAverages().find(d => d.name === domain.name);
            return `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${domain.name}</td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e2e8f0; font-weight: bold;">
                  ${domainAvg?.score || 0} / 5
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      `;
      
      scoreSection.appendChild(domainTable);
      pdfContainer.appendChild(scoreSection);

      // Add detailed scores for each domain
      domains.forEach(domain => {
        const domainSection = document.createElement('div');
        domainSection.style.marginBottom = '30px';
        domainSection.innerHTML = `
          <h2 style="color: #334155; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
            ${domain.name}
          </h2>
        `;

        // Add a table for subdomain scores
        const subdomainTable = document.createElement('table');
        subdomainTable.style.width = '100%';
        subdomainTable.style.borderCollapse = 'collapse';
        subdomainTable.style.marginBottom = '15px';
        
        // Add table header
        subdomainTable.innerHTML = `
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #e2e8f0;">Subdomínio</th>
              <th style="padding: 8px; text-align: center; border-bottom: 1px solid #e2e8f0;">Pontuação</th>
            </tr>
          </thead>
          <tbody>
            ${domain.subdomains.map(subdomain => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
                  <div>${subdomain.name}</div>
                  <div style="font-size: 12px; color: #64748b;">${subdomain.description}</div>
                </td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e2e8f0; font-weight: bold;">
                  ${subdomain.score || 0} / 5
                  ${subdomain.score > 0 ? `<div style="font-size: 12px; color: #64748b;">
                    ${scoreLevels.find(l => l.value === subdomain.score)?.label.split(' - ')[1] || ''}
                  </div>` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        `;
        
        domainSection.appendChild(subdomainTable);
        pdfContainer.appendChild(domainSection);
      });

      // Add footer
      const footer = document.createElement('div');
      footer.style.marginTop = '40px';
      footer.style.borderTop = '1px solid #e2e8f0';
      footer.style.paddingTop = '15px';
      footer.style.fontSize = '12px';
      footer.style.color = '#64748b';
      footer.style.textAlign = 'center';
      footer.innerHTML = `
        <p>Relatório gerado pelo Sistema MuseTera em ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}</p>
        <p>© 2025 MuseTera. Todos os direitos reservados.</p>
      `;
      pdfContainer.appendChild(footer);

      // Use html2canvas to convert the container to an image
      const canvas = await html2canvas(pdfContainer, {
        scale: 2, // Increase quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Create PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Add the captured content to PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      // If the content is longer than one page, add additional pages
      let heightLeft = pdfHeight;
      let position = 0;
      
      while (heightLeft > pdf.internal.pageSize.getHeight()) {
        position = -pdf.internal.pageSize.getHeight();
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
        position -= pdf.internal.pageSize.getHeight();
      }
      
      // Remove the temporary container
      document.body.removeChild(pdfContainer);
      
      // Save the PDF file
      pdf.save('avaliacao-musicoterapeutica.pdf');
      
      toast({
        title: "PDF Gerado",
        description: "O PDF foi gerado com sucesso.",
      });

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: "Houve um problema ao gerar o PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Avaliação Musicoterapêutica</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleSave} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> Salvar Avaliação
            </Button>
            <Button 
              onClick={generatePDF} 
              variant="outline" 
              className="w-full sm:w-auto"
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div> Gerando PDF...
                </>
              ) : (
                <>Download PDF</>
              )}
            </Button>
          </div>
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
