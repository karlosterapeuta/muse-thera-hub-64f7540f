
import { useState, useEffect, useMemo } from "react";
import { calculateAgeFromBirthDate } from "@/utils/dateUtils";
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
import { FileDown, Info, HelpCircle, FileBarChart, FileText, CalendarIcon, Loader2, Save, User, AlertTriangle, X, Stethoscope, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import html2pdf from "html2pdf.js";
import { savePDFToStorage } from "@/utils/pdfStorageUtils";
import { toast } from "sonner";
import { TeaScalePDF } from "@/components/TeaScalePDF";
import { ParametersGraphsPDF } from "@/components/ParametersGraphsPDF";
import { MuseteraReportPDF } from "@/components/MuseteraReportPDF";
import { EnhancedMuseteraReportPDF } from "@/components/EnhancedMuseteraReportPDF";
import { EvaluationTextPDF } from "@/components/EvaluationTextPDF";
import { renderForPdf } from '@/utils/renderForPdf';
import { generateSectionPdf } from '@/utils/sectionPdfGenerator';
import { GraphReportPDF } from '@/components/pdf/GraphReportPDF';
import { PDFPreviewDialog } from "@/components/PDFPreviewDialog";
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
import { useEvaluationPDF } from "@/hooks/useEvaluationPDF";
import { imageUrlToBase64 } from '@/utils/imageToBase64';
import { useEvaluationStorage, SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { EvaluationHistory } from "./components/EvaluationHistory";
import { EvaluationComparison } from "./components/EvaluationComparison";
import { PatientEvaluationCards, PatientWithEvaluations } from "./components/PatientEvaluationCards";
import { EvolutionTimeline } from "./components/EvolutionTimeline";
import { AreasAnalysis } from "./components/AreasAnalysis";
import { TherapeuticSuggestions } from "./components/TherapeuticSuggestions";

interface Patient {
  id: string;
  name: string;
  birth_date: string | null;
  age: number | null;
}

const EVAL_DRAFT_KEY = 'musetera-eval-draft';

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(EVAL_DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export default function Evaluation() {
  const draft = useMemo(() => loadDraft(), []);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>(draft?.selectedPatient || "");
  const [selectedEvaluation, setSelectedEvaluation] = useState(draft?.selectedEvaluation || "1");
  const [evaluationDate, setEvaluationDate] = useState<Date>(draft?.evaluationDate ? new Date(draft.evaluationDate) : new Date());
  const [selections, setSelections] = useState<Record<string, string>>(draft?.selections || {});
  const [observations, setObservations] = useState<Record<string, string>>(draft?.observations || {});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [activeTab, setActiveTab] = useState(draft?.activeTab || "evaluation");
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [editingEvaluationId, setEditingEvaluationId] = useState<string | null>(null);
  const [evolutionPatientId, setEvolutionPatientId] = useState<string | null>(null);
  const [draftLoaded] = useState(!!draft);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfPreviewBlob, setPdfPreviewBlob] = useState<Blob | null>(null);
  const [pdfPreviewFilename, setPdfPreviewFilename] = useState<string>("documento.pdf");
  const [pdfPreviewBuilding, setPdfPreviewBuilding] = useState(false);

  // Persist draft to sessionStorage on changes
  useEffect(() => {
    const data = {
      selectedPatient,
      selectedEvaluation,
      evaluationDate: evaluationDate.toISOString(),
      selections,
      observations,
      activeTab,
    };
    sessionStorage.setItem(EVAL_DRAFT_KEY, JSON.stringify(data));
  }, [selectedPatient, selectedEvaluation, evaluationDate, selections, observations, activeTab]);

  const { generateBlankScalePDF } = useEvaluationPDF();
  
  const {
    savedEvaluations,
    allEvaluations,
    isLoading: isLoadingEvaluations,
    isLoadingAll,
    isSaving,
    saveEvaluation,
    updateEvaluation,
    deleteEvaluation,
    loadAllEvaluations,
  } = useEvaluationStorage(selectedPatient || null);

  // Load all evaluations on mount for comparison tab
  useEffect(() => {
    loadAllEvaluations();
  }, [loadAllEvaluations]);

  // Auto-carregar a avaliação mais recente quando paciente é selecionado
  const [skipAutoLoad, setSkipAutoLoad] = useState(draftLoaded);
  useEffect(() => {
    // Não auto-carregar se está editando, carregando, ou se acabou de restaurar draft
    if (editingEvaluationId || isLoadingEvaluations) {
      return;
    }
    if (skipAutoLoad) {
      setSkipAutoLoad(false);
      return;
    }
    
    if (savedEvaluations.length > 0) {
      // Carregar a avaliação mais recente do paciente selecionado
      const mostRecentEvaluation = savedEvaluations[0]; // Já ordenada por data desc
      
      if (mostRecentEvaluation && mostRecentEvaluation.content) {
        setSelections(mostRecentEvaluation.content.selections || {});
        setObservations(mostRecentEvaluation.content.observations || {});
        setEvaluationDate(new Date(mostRecentEvaluation.date));
        if (mostRecentEvaluation.content.evaluationType) {
          setSelectedEvaluation(mostRecentEvaluation.content.evaluationType);
        }
        
        toast.info(`Avaliação de ${format(new Date(mostRecentEvaluation.date), 'dd/MM/yyyy')} carregada automaticamente`);
      }
    } else if (selectedPatient) {
      // Limpar dados se paciente não tem avaliações salvas
      setSelections({});
      setObservations({});
      setEvaluationDate(new Date());
    }
  }, [savedEvaluations, selectedPatient, isLoadingEvaluations, editingEvaluationId]);

  // Agrupar avaliações por paciente (apenas pacientes COM avaliações salvas)
  const patientsWithEvaluations = useMemo<PatientWithEvaluations[]>(() => {
    const grouped = new Map<string, SavedEvaluation[]>();
    
    allEvaluations.forEach(evaluation => {
      const patientId = evaluation.patient_id;
      if (!grouped.has(patientId)) {
        grouped.set(patientId, []);
      }
      grouped.get(patientId)!.push(evaluation);
    });
    
    return Array.from(grouped.entries()).map(([patientId, evals]) => {
      const sortedEvals = [...evals].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Extrair tipos únicos de avaliação
      const uniqueTypes = [...new Set(evals.map(e => 
        e.content?.evaluationType || e.type || "Avaliação"
      ))];
      
      // Calcular score médio
      const scoresWithValue = evals.filter(e => e.content?.overallScore?.percentage);
      const avgScore = scoresWithValue.length > 0
        ? scoresWithValue.reduce((sum, e) => 
            sum + (e.content?.overallScore?.percentage || 0), 0
          ) / scoresWithValue.length
        : 0;
      
      // Buscar dados do paciente
      const patient = patients.find(p => p.id === patientId);
      
      return {
        patientId,
        patientName: patient?.name || sortedEvals[0]?.patient_name || "Paciente",
        patientAge: calculateAgeFromBirthDate(patient?.birth_date) ?? patient?.age ?? null,
        totalEvaluations: evals.length,
        evaluationTypes: uniqueTypes,
        lastEvaluationDate: sortedEvals[0].date,
        averageScore: Math.round(avgScore),
      };
    }).sort((a, b) => 
      new Date(b.lastEvaluationDate).getTime() - new Date(a.lastEvaluationDate).getTime()
    );
  }, [allEvaluations, patients]);

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
    let evaluatedParametersCount = 0;
    let totalParametersCount = 0;
    
    evaluationDomains.forEach(domain => {
      domain.subdomains.forEach(subdomain => {
        subdomain.parameters.forEach(param => {
          const score = calculateScore(domain.title, subdomain.title, param);
          totalScore += score;
          maxPossible += 100;
          totalParametersCount++;
          
          if (isParameterEvaluated(domain.title, subdomain.title, param)) {
            evaluatedParametersCount++;
          }
        });
      });
    });
    
    const completionPercentage = totalParametersCount > 0 
      ? Math.round((evaluatedParametersCount / totalParametersCount) * 100) 
      : 0;
    
    const scorePercentage = maxPossible > 0 
      ? Math.round((totalScore / maxPossible) * 100) 
      : 0;
    
    return {
      raw: totalScore,
      max: maxPossible,
      percentage: scorePercentage,
      completionPercentage: completionPercentage,
      evaluatedDomains: getEvaluatedDomainsCount(),
      totalDomains: evaluationDomains.length,
      evaluatedParameters: evaluatedParametersCount,
      totalParameters: totalParametersCount
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

  // Handler functions for evaluation storage
  const handleSaveEvaluation = async () => {
    if (!selectedPatient) {
      toast.error("Selecione um paciente primeiro");
      return;
    }
    
    const domainScoresData = evaluationDomains.map(domain => ({
      domain: domain.title,
      score: calculateDomainScore(domain).percentage,
      subdomains: domain.subdomains.map(subdomain => ({
        name: subdomain.title,
        score: calculateSubdomainScore(domain.title, subdomain.title, subdomain.parameters).percentage
      }))
    }));

    let success;
    
    if (editingEvaluationId) {
      // Atualizar avaliação existente
      success = await updateEvaluation(
        editingEvaluationId,
        evaluationDate,
        selectedEvaluation,
        selections,
        observations,
        domainScoresData,
        overallScore
      );
      if (success) {
        setEditingEvaluationId(null);
      }
    } else {
      // Criar nova avaliação
      success = await saveEvaluation(
        evaluationDate,
        selectedEvaluation,
        selections,
        observations,
        domainScoresData,
        overallScore
      );
    }
  };

  const handleLoadEvaluation = (evaluation: SavedEvaluation) => {
    if (evaluation.content) {
      setSelections(evaluation.content.selections || {});
      setObservations(evaluation.content.observations || {});
      setEvaluationDate(new Date(evaluation.date));
      if (evaluation.content.evaluationType) {
        setSelectedEvaluation(evaluation.content.evaluationType);
      }
      toast.success("Avaliação carregada com sucesso!");
    }
  };

  const handleEditEvaluation = (evaluation: SavedEvaluation) => {
    // Select the correct patient if editing from another patient's evaluation
    if (evaluation.patient_id && evaluation.patient_id !== selectedPatient) {
      setSelectedPatient(evaluation.patient_id);
    }
    
    if (evaluation.content) {
      setSelections(evaluation.content.selections || {});
      setObservations(evaluation.content.observations || {});
      setEvaluationDate(new Date(evaluation.date));
      if (evaluation.content.evaluationType) {
        setSelectedEvaluation(evaluation.content.evaluationType);
      }
    }
    setEditingEvaluationId(evaluation.id);
    setActiveTab("evaluation");
    toast.info("Modo de edição ativado. Faça as alterações e clique em 'Atualizar Avaliação'.");
  };

  const handleCancelEdit = () => {
    setEditingEvaluationId(null);
    setSelections({});
    setObservations({});
    setEvaluationDate(new Date());
    toast.info("Modo de edição cancelado");
  };

  const handleToggleComparison = (id: string) => {
    setSelectedForComparison(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const { data: professionalData } = useProfessionalData();

  const handleDownloadSavedEvaluation = async (evaluation: SavedEvaluation) => {
    const loadingToast = toast.loading("Gerando PDF da avaliação salva...");
    
    try {
      // Converter URLs para Base64
      let signatureBase64: string | null = null;
      let stampBase64: string | null = null;
      let photoBase64: string | null = null;

      if (professionalData?.digital_signature_url) {
        signatureBase64 = await imageUrlToBase64(professionalData.digital_signature_url);
      }

      if (professionalData?.digital_stamp_url) {
        stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
      }

      const photoUrl = professionalData?.stamp_photo_url || professionalData?.avatar_url;
      if (photoUrl) {
        photoBase64 = await imageUrlToBase64(photoUrl);
      }

      const savedOverallScore: any = evaluation.content?.overallScore || {};
      const fullOverallScore = {
        raw: savedOverallScore.raw || 0,
        max: savedOverallScore.max || 100,
        percentage: savedOverallScore.percentage || 0,
        completionPercentage: savedOverallScore.completionPercentage || savedOverallScore.percentage || 0,
        evaluatedDomains: savedOverallScore.evaluatedDomains || evaluation.content?.domainScores?.length || 0,
        totalDomains: savedOverallScore.totalDomains || evaluationDomains.length,
        evaluatedParameters: savedOverallScore.evaluatedParameters || 0,
        totalParameters: savedOverallScore.totalParameters || 0
      };

      const pdfContent = (
        <div id="saved-evaluation-pdf-content" style={{ display: 'block' }}>
          <EnhancedMuseteraReportPDF
            patientName={selectedPatientData?.name || 'Paciente'}
            professionalData={professionalData}
            categoryData={[]}
            pieData={[
              { name: "Desenvolvido", value: fullOverallScore.percentage },
              { name: "A desenvolver", value: 100 - fullOverallScore.percentage }
            ]}
            radarData={evaluation.content?.domainScores?.map((d: any) => ({
              name: d.domain?.replace("Domínio ", "") || "Domínio",
              value: d.score || 0,
              fullMark: 100
            })) || []}
            selectedParameters={evaluation.content?.selections || {}}
            overallScore={fullOverallScore}
            evaluationDomains={evaluationDomains}
            evaluationDate={new Date(evaluation.date)}
            digitalSignatureUrl={signatureBase64 || undefined}
            digitalStampUrl={stampBase64 || undefined}
            professionalEmail={professionalData?.email || undefined}
            professionalPhone={professionalData?.phone || undefined}
            professionalSpecialty={professionalData?.specialty || undefined}
            professionalPhotoUrl={photoBase64 || undefined}
            patientData={{
              age: calculateAgeFromBirthDate(selectedPatientData?.birth_date) ?? selectedPatientData?.age ?? undefined,
              birthDate: selectedPatientData?.birth_date || undefined
            }}
          />
        </div>
      );

      const { root, ready, cleanup } = renderForPdf(pdfContent);
      await ready;
      try {

      await new Promise(resolve => setTimeout(resolve, 2000));

      const opt = {
        margin: [8, 8],
        filename: `avaliacao-${selectedPatientData?.name || 'paciente'}-${format(new Date(evaluation.date), 'yyyy-MM-dd')}.pdf`,
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

      const pdfInst1 = html2pdf().set(opt).from(root);
      await pdfInst1.save();
      try { const blob = await pdfInst1.outputPdf('blob'); await savePDFToStorage(blob, opt.filename, "evaluation"); } catch(e) { console.warn(e); }
      
      } finally {
        cleanup();
      }
      
      toast.success("PDF da avaliação baixado com sucesso!", { id: loadingToast });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.", { id: loadingToast });
    }
  };

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleGeneratePrintableScalePDF = async () => {
    await generateBlankScalePDF({
      patientName: selectedPatientData?.name,
      professionalName:
        (professionalData as any)?.name ??
        ((professionalData as any)?.email ? formatNameFromEmail((professionalData as any).email) : undefined),
      evaluationDate,
    });
  };

  const handleGenerateParametersPDF = async () => {
    let loadingToast: string | number | undefined;
    try {
      loadingToast = toast.loading("Gerando PDF de Gráficos...");

      let professionalPhotoBase64: string | undefined;
      let digitalStampBase64: string | undefined;
      const photoUrl = professionalData?.stamp_photo_url || professionalData?.avatar_url;
      if (photoUrl) {
        try { professionalPhotoBase64 = await imageUrlToBase64(photoUrl); } catch (e) { console.warn(e); }
      }
      if (professionalData?.digital_stamp_url) {
        try { digitalStampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url); } catch (e) { console.warn(e); }
      }

      const filename = `graficos-${(selectedPatientData?.name || 'paciente').replace(/\s+/g, '_')}-${format(evaluationDate, 'yyyy-MM-dd')}.pdf`;
      const patientAge = calculateAgeFromBirthDate(selectedPatientData?.birth_date) ?? (selectedPatientData?.age ?? null);

      const blob = await generateSectionPdf(
        <GraphReportPDF
          patientName={selectedPatientData?.name}
          patientAge={patientAge}
          professionalData={professionalData}
          evaluationDate={evaluationDate}
          selections={selections}
          evaluationDomains={evaluationDomains}
          categoryData={subdomainScores}
          pieData={pieData}
          radarData={domainScores}
          overallScore={overallScore}
          professionalPhotoBase64={professionalPhotoBase64}
          digitalStampBase64={digitalStampBase64}
        />,
        { filename }
      );

      setPdfPreviewBlob(blob);
      setPdfPreviewFilename(filename);
      setPdfPreviewOpen(true);
      try { await savePDFToStorage(blob, filename, "evaluation"); } catch (e) { console.warn(e); }

      toast.success("Pré-visualização pronta. Revise e clique em Baixar PDF.", { id: loadingToast });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.", { id: loadingToast });
    }
  };

  // Função para gerar PDF de gráficos a partir de avaliação salva
  const handleGenerateParametersPDFFromSaved = async (evaluation: SavedEvaluation, _patientAllEvaluations: SavedEvaluation[] = []) => {
    let loadingToast: string | number | undefined;
    try {
      loadingToast = toast.loading("Gerando PDF de Gráficos...");

      let professionalPhotoBase64: string | undefined;
      let digitalStampBase64: string | undefined;
      const photoUrl = professionalData?.stamp_photo_url || professionalData?.avatar_url;
      if (photoUrl) {
        try { professionalPhotoBase64 = await imageUrlToBase64(photoUrl); } catch (e) { console.warn(e); }
      }
      if (professionalData?.digital_stamp_url) {
        try { digitalStampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url); } catch (e) { console.warn(e); }
      }

      const savedContent = (evaluation.content as any) || {};
      const savedSelections: Record<string, string> = savedContent.selections || {};

      const savedOverallScore = savedContent.overallScore || {
        raw: 0, max: 100, percentage: 0, completionPercentage: 0,
        evaluatedDomains: 0, totalDomains: evaluationDomains.length,
        evaluatedParameters: 0, totalParameters: 0,
      };

      const savedPieData = [
        { name: "Desenvolvido", value: savedOverallScore.percentage || 0 },
        { name: "A desenvolver", value: 100 - (savedOverallScore.percentage || 0) },
      ];

      const domainScoresArr = savedContent.domainScores || [];
      const radarData = domainScoresArr.map((d: any) => ({
        name: (d.domain || "N/A").replace("Domínio ", "").substring(0, 14),
        value: d.score || 0,
      }));
      const categoryData = domainScoresArr.flatMap((d: any) =>
        (d.subdomains || []).map((sub: any) => ({
          name: sub.name?.substring(0, 22) || "N/A",
          value: sub.score || 0,
          domain: (d.domain || "").replace("Domínio ", ""),
        }))
      );

      const patientName = evaluation.patient_name || "Paciente";
      // Usa a data escolhida pelo usuário no calendário (estado atual);
      // se não houver, cai no fallback da data salva na avaliação.
      const evalDate = evaluationDate instanceof Date && !isNaN(evaluationDate.getTime())
        ? evaluationDate
        : new Date(evaluation.date);
      const patient = patients.find(p => p.id === evaluation.patient_id);
      const patientAge = calculateAgeFromBirthDate(patient?.birth_date) ?? (patient?.age ?? null);

      const filename = `graficos-${patientName.replace(/\s+/g, '_')}-${format(evalDate, 'yyyy-MM-dd')}.pdf`;

      const blob = await generateSectionPdf(
        <GraphReportPDF
          patientName={patientName}
          patientAge={patientAge}
          professionalData={professionalData}
          evaluationDate={evalDate}
          selections={savedSelections}
          evaluationDomains={evaluationDomains}
          categoryData={categoryData}
          pieData={savedPieData}
          radarData={radarData}
          overallScore={savedOverallScore}
          professionalPhotoBase64={professionalPhotoBase64}
          digitalStampBase64={digitalStampBase64}
        />,
        { filename }
      );

      setPdfPreviewBlob(blob);
      setPdfPreviewFilename(filename);
      setPdfPreviewOpen(true);
      try { await savePDFToStorage(blob, filename, "evaluation"); } catch (e) { console.warn(e); }

      toast.success("Pré-visualização pronta. Revise as páginas e clique em Baixar PDF.", { id: loadingToast });
    } catch (error) {
      console.error("Erro ao gerar PDF de gráficos:", error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.", { id: loadingToast });
    }
  };

  const handleGenerateMuseteraPDF = async (overrideData?: any) => {
    // Verificar se há dados para gerar o PDF
    const hasData = Object.keys(selections).length > 0;
    
    if (!overrideData && !hasData) {
      toast.error("Nenhum parâmetro avaliado. Preencha a avaliação (Escala MuseTera) antes de baixar.");
      return;
    }
    
    let loadingToast: string | number | undefined;
    try {
      // Usar dados fornecidos ou os estados atuais
      const dataToUse = overrideData || {
        categoryData: subdomainScores,
        pieData: pieData,
        patientName: selectedPatientData?.name,
        professionalData: professionalData,
        radarData: domainScores,
        selectedParameters: selections,
        overallScore: overallScore,
        evaluationDomains: evaluationDomains,
        evaluationDate: evaluationDate,
        patientData: {
          age: calculateAgeFromBirthDate(selectedPatientData?.birth_date) ?? selectedPatientData?.age ?? undefined,
          birthDate: selectedPatientData?.birth_date || undefined
        }
      };

      // Converter URLs para Base64
      let signatureBase64: string | null = null;
      let stampBase64: string | null = null;
      let photoBase64: string | null = null;

      const prof = dataToUse.professionalData;
      if (prof?.digital_signature_url) {
        signatureBase64 = await imageUrlToBase64(prof.digital_signature_url);
      }

      if (prof?.digital_stamp_url) {
        stampBase64 = await imageUrlToBase64(prof.digital_stamp_url);
      }

      const photoUrl = prof?.stamp_photo_url || prof?.avatar_url;
      if (photoUrl) {
        photoBase64 = await imageUrlToBase64(photoUrl);
      }

      const pdfContent = (
        <div id="pdf-content" style={{ display: 'block' }}>
          <EnhancedMuseteraReportPDF
            categoryData={dataToUse.categoryData}
            pieData={dataToUse.pieData}
            patientName={dataToUse.patientName}
            professionalData={prof}
            radarData={dataToUse.radarData}
            selectedParameters={dataToUse.selectedParameters}
            overallScore={dataToUse.overallScore}
            evaluationDomains={dataToUse.evaluationDomains}
            evaluationDate={dataToUse.evaluationDate}
            digitalSignatureUrl={signatureBase64 || undefined}
            digitalStampUrl={stampBase64 || undefined}
            professionalEmail={prof?.email || undefined}
            professionalPhone={prof?.phone || undefined}
            professionalSpecialty={prof?.specialty || undefined}
            professionalPhotoUrl={photoBase64 || undefined}
            patientData={dataToUse.patientData}
          />
        </div>
      );

      try {
        loadingToast = toast.loading("Gerando Relatório MuseTera Aprimorado...");
        
        const filename = `relatorio-musetera-completo-${(dataToUse.patientName || 'paciente').replace(/\s+/g, '_')}.pdf`;
        
        const blob = await generateSectionPdf(
          <EnhancedMuseteraReportPDF
            categoryData={dataToUse.categoryData}
            pieData={dataToUse.pieData}
            patientName={dataToUse.patientName}
            professionalData={prof}
            radarData={dataToUse.radarData}
            selectedParameters={dataToUse.selectedParameters}
            overallScore={dataToUse.overallScore}
            evaluationDomains={dataToUse.evaluationDomains}
            evaluationDate={dataToUse.evaluationDate}
            digitalSignatureUrl={signatureBase64 || undefined}
            digitalStampUrl={stampBase64 || undefined}
            professionalEmail={prof?.email || undefined}
            professionalPhone={prof?.phone || undefined}
            professionalSpecialty={prof?.specialty || undefined}
            professionalPhotoUrl={photoBase64 || undefined}
            patientData={dataToUse.patientData}
          />,
          { filename }
        );

        const pdfUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);
        
        try { 
          await savePDFToStorage(blob, filename, "evaluation"); 
        } catch(e) { 
          console.warn("Erro ao salvar no storage:", e); 
        }
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        throw error;
      }
      
      toast.success("Relatório MuseTera Aprimorado gerado com sucesso!", { id: loadingToast });

    } catch (error: any) {
      console.error("Erro detalhado ao gerar PDF:", error);
      toast.error(`Erro ao gerar PDF: ${error.message || 'Erro desconhecido'}. Verifique se o paciente possui dados preenchidos.`, { id: loadingToast });
    }
  };

  const categorizeEvaluationData = () => {
    const achievements: any[] = [];      // score >= 60 (Moderado, Consistente, Excepcional)
    const developmentAreas: any[] = [];  // score < 60 (Não Observado, Emergente, Inconsistente)

    evaluationDomains.forEach(domain => {
      domain.subdomains.forEach(subdomain => {
        subdomain.parameters.forEach(param => {
          const key = `${domain.title}-${subdomain.title}-${param}`;
          const selection = selections[key];
          const score = calculateScore(domain.title, subdomain.title, param);
          
          if (selection && selection !== 'nao_observado') {
            const paramData = {
              domain: domain.title,
              subdomain: subdomain.title,
              parameter: param,
              score,
              level: selection
            };
            
            if (score >= 60) {
              achievements.push(paramData);
            } else {
              developmentAreas.push(paramData);
            }
          }
        });
      });
    });

    return { achievements, developmentAreas };
  };

  // Função para categorizar dados de uma avaliação SALVA
  const categorizeEvaluationDataFromSaved = (evaluation: SavedEvaluation) => {
    const achievements: any[] = [];
    const developmentAreas: any[] = [];
    
    const savedSelections = evaluation.content?.selections || {};
    
    // Função auxiliar para converter level em score
    const levelToScoreValue = (level: string): number => {
      switch(level) {
        case '0': case 'nao_observado': return 0;
        case '1': case 'emergente': return 20;
        case '2': case 'inconsistente': return 40;
        case '3': case 'moderado': return 60;
        case '4': case 'consistente': return 80;
        case '5': case 'excepcional': return 100;
        default: return 0;
      }
    };
    
    // Iterar sobre as seleções salvas
    Object.entries(savedSelections).forEach(([key, value]) => {
      const parts = key.split('-');
      if (parts.length >= 3) {
        const domain = parts[0];
        const subdomain = parts[1];
        const parameter = parts.slice(2).join('-');
        const score = levelToScoreValue(value as string);
        
        if (value && value !== 'nao_observado' && value !== '0') {
          const paramData = {
            domain,
            subdomain,
            parameter,
            score,
            level: value
          };
          
          if (score >= 60) {
            achievements.push(paramData);
          } else {
            developmentAreas.push(paramData);
          }
        }
      }
    });
    
    return { achievements, developmentAreas };
  };

  // Função para gerar texto de avaliação com IA a partir de uma avaliação SALVA
  const handleGenerateEvaluationTextFromSaved = async (evaluation: SavedEvaluation) => {
    // Buscar dados do paciente da avaliação salva
    const patient = patients.find(p => p.id === evaluation.patient_id);
    
    if (!patient) {
      toast.error("Paciente não encontrado");
      return;
    }

    // Verificar se há parâmetros avaliados
    const savedSelections = evaluation.content?.selections || {};
    const evaluatedCount = Object.values(savedSelections).filter(v => v && v !== 'nao_observado' && v !== '0').length;
    
    if (evaluatedCount === 0) {
      toast.error("Esta avaliação não possui parâmetros marcados");
      return;
    }

    setIsGeneratingText(true);
    toast.loading("Analisando avaliação e gerando texto profissional com IA...");

    try {
      // Categorizar dados da avaliação SALVA
      const { achievements, developmentAreas } = categorizeEvaluationDataFromSaved(evaluation);
      
      // Preparar overallScore da avaliação salva com todas as propriedades necessárias
      const rawOverallScore: any = evaluation.content?.overallScore || {};
      const savedOverallScore = {
        percentage: rawOverallScore.percentage || 0,
        evaluatedDomains: rawOverallScore.evaluatedDomains || evaluation.content?.domainScores?.length || 0,
        totalDomains: rawOverallScore.totalDomains || evaluationDomains.length,
        evaluatedParameters: rawOverallScore.evaluatedParameters || 0
      };
      
      // Preparar domainScores da avaliação salva
      const savedDomainScores = evaluation.content?.domainScores?.map((d: any) => ({
        name: d.domain?.replace("Domínio ", "") || "Domínio",
        value: d.score || 0,
        fullMark: 100
      })) || [];
      
      // Chamar edge function com IA
      const { data, error } = await supabase.functions.invoke('generate-evaluation-text', {
        body: {
          patientName: patient.name,
          patientAge: calculateAgeFromBirthDate(patient.birth_date) ?? patient.age,
          evaluationDate: format(new Date(evaluation.date), 'dd/MM/yyyy'),
          achievements,
          developmentAreas,
          overallScore: savedOverallScore,
          evaluatedDomains: savedDomainScores
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data || !data.content) {
        throw new Error('Resposta inválida da IA');
      }

      toast.dismiss();
      toast.loading("Gerando PDF do relatório...");

      // Converter URLs para Base64
      let signatureBase64: string | null = null;
      let stampBase64: string | null = null;
      let photoBase64: string | null = null;

      if (professionalData?.digital_signature_url) {
        signatureBase64 = await imageUrlToBase64(professionalData.digital_signature_url);
      }

      if (professionalData?.digital_stamp_url) {
        stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
      }

      if (professionalData?.stamp_photo_url) {
        photoBase64 = await imageUrlToBase64(professionalData.stamp_photo_url);
      }

      // Gerar PDF com o texto retornado
      const pdfContent = (
        <div id="evaluation-text-pdf-content" style={{ display: 'block' }}>
          <EvaluationTextPDF
            content={data.content}
            patientName={patient.name || 'Paciente'}
            patientAge={calculateAgeFromBirthDate(patient.birth_date) ?? patient.age ?? null}
            evaluationDate={format(new Date(evaluation.date), 'dd/MM/yyyy')}
            professionalName={professionalData?.name || 'Profissional'}
            professionalRegister={professionalData?.register || undefined}
            digitalSignatureUrl={signatureBase64 || undefined}
            digitalStampUrl={stampBase64 || undefined}
            professionalEmail={professionalData?.email || undefined}
            professionalPhone={professionalData?.phone || undefined}
            professionalSpecialty={professionalData?.specialty || undefined}
            professionalPhotoUrl={photoBase64 || undefined}
            overallScore={savedOverallScore}
          />
        </div>
      );

      const { root, ready, cleanup } = renderForPdf(pdfContent);
      await ready;
      try {

      await new Promise(resolve => setTimeout(resolve, 1500));

      const opt = {
        margin: [10, 10],
        filename: `texto-avaliacao-${patient.name || 'paciente'}-${format(new Date(evaluation.date), 'yyyy-MM-dd')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
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
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      const pdfInst5 = html2pdf().set(opt).from(root);
      const pdfBlob = await pdfInst5.output('blob');
      
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = opt.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);

      try { await savePDFToStorage(pdfBlob, opt.filename, "evaluation"); } catch(e) { console.warn(e); }
      
      } finally {
        cleanup();
      }
      
      toast.dismiss();
      toast.success("Texto de Avaliação gerado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao gerar texto:", error);
      toast.dismiss();
      
      if (error.message?.includes('429') || error.status === 429) {
        toast.error("Limite de requisições excedido. Aguarde alguns instantes e tente novamente.");
      } else if (error.message?.includes('402') || error.status === 402) {
        toast.error("Créditos insuficientes. Adicione créditos à sua conta Lovable AI.");
      } else {
        toast.error("Erro ao gerar texto. Tente novamente em alguns instantes.");
      }
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleGenerateEvaluationText = async () => {
    if (!selectedPatient) {
      toast.error("Selecione um paciente primeiro");
      return;
    }
    
    // Verificar se há parâmetros avaliados
    if (overallScore.evaluatedParameters === 0) {
      toast.error("Avalie pelo menos alguns parâmetros primeiro");
      return;
    }

    setIsGeneratingText(true);
    toast.loading("Analisando avaliação e gerando texto profissional com IA...");

    try {
      // Organizar dados por categoria
      const { achievements, developmentAreas } = categorizeEvaluationData();
      
      // Chamar edge function
      const { data, error } = await supabase.functions.invoke('generate-evaluation-text', {
        body: {
          patientName: selectedPatientData?.name,
          patientAge: calculateAgeFromBirthDate(selectedPatientData?.birth_date) ?? selectedPatientData?.age,
          evaluationDate: format(evaluationDate, 'dd/MM/yyyy'),
          achievements,
          developmentAreas,
          overallScore,
          evaluatedDomains: domainScores
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data || !data.content) {
        throw new Error('Resposta inválida da IA');
      }

      toast.dismiss();
      toast.loading("Gerando PDF do relatório...");

      // Converter URLs para Base64
      let signatureBase64: string | null = null;
      let stampBase64: string | null = null;
      let photoBase64: string | null = null;

      if (professionalData?.digital_signature_url) {
        signatureBase64 = await imageUrlToBase64(professionalData.digital_signature_url);
      }

      if (professionalData?.digital_stamp_url) {
        stampBase64 = await imageUrlToBase64(professionalData.digital_stamp_url);
      }

      if (professionalData?.stamp_photo_url) {
        photoBase64 = await imageUrlToBase64(professionalData.stamp_photo_url);
      }

      // Gerar PDF com o texto retornado
      const pdfContent = (
        <div id="evaluation-text-pdf-content" style={{ display: 'block' }}>
          <EvaluationTextPDF
            content={data.content}
            patientName={selectedPatientData?.name || 'Paciente'}
            patientAge={calculateAgeFromBirthDate(selectedPatientData?.birth_date) ?? selectedPatientData?.age ?? null}
            evaluationDate={format(evaluationDate, 'dd/MM/yyyy')}
            professionalName={professionalData?.name || 'Profissional'}
            professionalRegister={professionalData?.register || undefined}
            digitalSignatureUrl={signatureBase64 || undefined}
            digitalStampUrl={stampBase64 || undefined}
            professionalEmail={professionalData?.email || undefined}
            professionalPhone={professionalData?.phone || undefined}
            professionalSpecialty={professionalData?.specialty || undefined}
            professionalPhotoUrl={photoBase64 || undefined}
            overallScore={overallScore}
          />
        </div>
      );

      const { root, ready, cleanup } = renderForPdf(pdfContent);
      await ready;
      try {

      await new Promise(resolve => setTimeout(resolve, 1500));

      const opt = {
        margin: [10, 10],
        filename: `texto-avaliacao-${selectedPatientData?.name || 'paciente'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
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
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      const pdfInst6 = html2pdf().set(opt).from(root);
      const pdfBlob = await pdfInst6.output('blob');
      
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = opt.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);

      try { await savePDFToStorage(pdfBlob, opt.filename, "evaluation"); } catch(e) { console.warn(e); }
      
      } finally {
        cleanup();
      }
      
      toast.dismiss();
      toast.success("Texto de Avaliação gerado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao gerar texto:", error);
      toast.dismiss();
      
      if (error.message?.includes('429') || error.status === 429) {
        toast.error("Limite de requisições excedido. Aguarde alguns instantes e tente novamente.");
      } else if (error.message?.includes('402') || error.status === 402) {
        toast.error("Créditos insuficientes. Adicione créditos à sua conta Lovable AI.");
      } else {
        toast.error("Erro ao gerar texto. Tente novamente em alguns instantes.");
      }
    } finally {
      setIsGeneratingText(false);
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
    if (!isSelected) return "bg-background";
    
    switch(score) {
      case 0: return "bg-red-500";      // Não Observado
      case 20: return "bg-orange-400";  // Emergente
      case 40: return "bg-yellow-400";  // Inconsistente
      case 60: return "bg-blue-500";    // Moderado
      case 80: return "bg-green-500";   // Consistente
      case 100: return "bg-green-500";  // Excepcional
      default: return "bg-background";
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
    <div className="min-h-screen bg-background">
      <div className="w-full px-0 py-3 sm:py-4 space-y-3 sm:space-y-4 animate-fade-in">
        <EvaluationLevelsHero />
        
        <div className="text-center mb-8 animate-fade-in px-2 sm:px-3">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-pulse-gentle">
            Escala MuseTera
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium">
            Instrumento de Avaliação Musicoterapêutica Profissional
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <Card className="backdrop-blur-sm bg-background/80 border border-blue-200/60 dark:border-blue-800/60 shadow-2xl shadow-blue-500/10 p-6 sm:p-8 rounded-3xl animate-fade-in">
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              <div className="p-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
                <div className="bg-background rounded-xl p-4 shadow-sm">
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
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                    <span className="text-emerald-600 dark:text-emerald-400">Idade:</span> {(() => {
                      const age = calculateAgeFromBirthDate(selectedPatientData.birth_date) ?? selectedPatientData.age;
                      return age ? `${age} anos` : 'Não informada';
                    })()}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Data da Avaliação</label>
                <Popover>
                  <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[220px] justify-start text-left font-normal border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 text-foreground font-medium",
                    !evaluationDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                  {evaluationDate ? format(evaluationDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-2 border-blue-300 dark:border-blue-700 shadow-2xl" align="start">
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
                <SelectTrigger className="w-full sm:w-[200px] text-foreground font-medium border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300">
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
                      onClick={handleGenerateMuseteraPDF}
                      disabled={isGeneratingText}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingText ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileDown className="h-4 w-4" />
                      )}
                      Baixar Avaliação
                    </Button>

                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-0">
                    <p>Gera texto profissional com análise dos parâmetros marcados via IA</p>
                  </TooltipContent>
                </TooltipComponent>
              </TooltipProvider>

              <TooltipProvider>
                <TooltipComponent>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleGeneratePrintableScalePDF}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FileDown className="h-4 w-4" />
                      Avaliacao Manual
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-0">
                    <p>Baixa a escala para impressão e avaliação manual</p>
                  </TooltipContent>
                </TooltipComponent>
              </TooltipProvider>

              <TooltipProvider>
                <TooltipComponent>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        const patientEvaluations = selectedPatient 
                          ? allEvaluations.filter(e => e.patient_id === selectedPatient)
                          : savedEvaluations;
                        
                        if (patientEvaluations.length > 0) {
                          handleGenerateParametersPDFFromSaved(patientEvaluations[0], patientEvaluations);
                        } else {
                          toast.error("Nenhuma avaliação salva encontrada para este paciente. Salve a avaliação primeiro.");
                        }
                      }}
                      disabled={!selectedPatient}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
                    >
                      <FileText className="h-4 w-4" />
                      Baixar Gráfico
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-0">
                    <p>Gera relatório completo com análise e recomendações</p>
                  </TooltipContent>
                </TooltipComponent>
              </TooltipProvider>

              <TooltipProvider>
                <TooltipComponent>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSaveEvaluation}
                      disabled={isSaving || !selectedPatient}
                      className={`flex items-center gap-2 text-white border-0 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 ${
                        editingEvaluationId 
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                          : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                      }`}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isSaving 
                        ? (editingEvaluationId ? "Atualizando..." : "Salvando...") 
                        : (editingEvaluationId ? "Atualizar Avaliação" : "Salvar Avaliação")
                      }
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-0">
                    <p>{editingEvaluationId ? "Atualiza a avaliação em edição" : "Salva a avaliação atual para o paciente selecionado"}</p>
                  </TooltipContent>
                </TooltipComponent>
              </TooltipProvider>

              {editingEvaluationId && (
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                  Cancelar Edição
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 bg-background/80 backdrop-blur-sm p-1 rounded-2xl h-14 border border-blue-200/50 dark:border-blue-800/50 shadow-md">
              <TabsTrigger 
                value="evaluation" 
                className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-blue-100 dark:data-[state=active]:from-blue-900 dark:data-[state=active]:to-blue-800 data-[state=active]:border data-[state=active]:border-blue-300 dark:data-[state=active]:border-blue-700 data-[state=active]:shadow-lg data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 transition-all duration-300"
              >
                Escala MuseTera
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-blue-100 dark:data-[state=active]:from-blue-900 dark:data-[state=active]:to-blue-800 data-[state=active]:border data-[state=active]:border-blue-300 dark:data-[state=active]:border-blue-700 data-[state=active]:shadow-lg data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 transition-all duration-300"
              >
                Resultados
              </TabsTrigger>
              <TabsTrigger 
                value="comparison" 
                className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-blue-100 dark:data-[state=active]:from-blue-900 dark:data-[state=active]:to-blue-800 data-[state=active]:border data-[state=active]:border-blue-300 dark:data-[state=active]:border-blue-700 data-[state=active]:shadow-lg data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 transition-all duration-300"
              >
                Evolução do Paciente
              </TabsTrigger>
            </TabsList>

            <TabsContent value="evaluation" className="space-y-8 mt-8">
              {/* Banner de modo de edição */}
              {editingEvaluationId && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4 mb-6 animate-pulse">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Save className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-amber-800">Modo de Edição Ativado</h3>
                        <p className="text-sm text-amber-700">
                          Faça as alterações desejadas e clique em "Atualizar Avaliação" para salvar
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="text-amber-700 border-amber-300 hover:bg-amber-100"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              <Collapsible className="mb-6">
                <CollapsibleTrigger className="w-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Como usar a escala</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 border-t-0 rounded-b-lg p-4">
                  <h3 className="text-base font-semibold text-blue-800 dark:text-blue-200 mb-2">Escala MuseTera - Versão Profissional</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Sistema de pontuação (0-100): Não Observado (0), Emergente (20), Inconsistente (40), 
                    Moderado (60), Consistente (80), Excepcional (100)
                  </p>
                </CollapsibleContent>
              </Collapsible>

              {/* Estatísticas da Avaliação Parcial */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Status da Avaliação</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{getEvaluatedDomainsCount()}</p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">Domínios Avaliados</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">de {evaluationDomains.length} total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{getEvaluatedSubdomainsCount()}</p>
                    <p className="text-sm text-teal-700 dark:text-teal-300">Subdomínios Avaliados</p>
                    <p className="text-xs text-teal-600 dark:text-teal-400">
                      de {evaluationDomains.reduce((acc, domain) => acc + domain.subdomains.length, 0)} total
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {calculateOverallScore().percentage}%
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Pontuação Média</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">escala MuseTera</p>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
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
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">{domain.title}</h2>
                      
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
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/50 rounded-full">
                                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs bg-gray-900 text-white border-0">
                              <p className="text-sm">{domain.description}</p>
                            </TooltipContent>
                          </TooltipComponent>
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    {domain.subdomains.map((subdomain, subdomainIndex) => {
                      const domainColorMap: Record<string, { border: string; bg: string; headerBg: string; text: string; badgeBg: string; badgeText: string; badgeBorder: string; infoBg: string; infoText: string }> = {
                        "from-purple-500 to-pink-500": { border: "border-l-pink-500", bg: "bg-gradient-to-r from-pink-50 via-purple-50 to-fuchsia-50 dark:from-pink-950/30 dark:via-purple-950/30 dark:to-fuchsia-950/30", headerBg: "bg-gradient-to-r from-purple-600 to-pink-600", text: "text-purple-800 dark:text-purple-200", badgeBg: "bg-pink-100 dark:bg-pink-900/40", badgeText: "text-pink-700 dark:text-pink-300", badgeBorder: "border-pink-300 dark:border-pink-700", infoBg: "hover:bg-pink-100 dark:hover:bg-pink-900/30", infoText: "text-pink-600 dark:text-pink-400" },
                        "from-blue-500 to-cyan-500": { border: "border-l-cyan-500", bg: "bg-gradient-to-r from-blue-50 via-cyan-50 to-sky-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-sky-950/30", headerBg: "bg-gradient-to-r from-blue-600 to-cyan-600", text: "text-blue-800 dark:text-blue-200", badgeBg: "bg-cyan-100 dark:bg-cyan-900/40", badgeText: "text-cyan-700 dark:text-cyan-300", badgeBorder: "border-cyan-300 dark:border-cyan-700", infoBg: "hover:bg-cyan-100 dark:hover:bg-cyan-900/30", infoText: "text-cyan-600 dark:text-cyan-400" },
                        "from-emerald-500 to-teal-500": { border: "border-l-teal-500", bg: "bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-green-950/30", headerBg: "bg-gradient-to-r from-emerald-600 to-teal-600", text: "text-emerald-800 dark:text-emerald-200", badgeBg: "bg-teal-100 dark:bg-teal-900/40", badgeText: "text-teal-700 dark:text-teal-300", badgeBorder: "border-teal-300 dark:border-teal-700", infoBg: "hover:bg-teal-100 dark:hover:bg-teal-900/30", infoText: "text-teal-600 dark:text-teal-400" },
                        "from-orange-500 to-red-500": { border: "border-l-orange-500", bg: "bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30", headerBg: "bg-gradient-to-r from-orange-600 to-red-600", text: "text-orange-800 dark:text-orange-200", badgeBg: "bg-orange-100 dark:bg-orange-900/40", badgeText: "text-orange-700 dark:text-orange-300", badgeBorder: "border-orange-300 dark:border-orange-700", infoBg: "hover:bg-orange-100 dark:hover:bg-orange-900/30", infoText: "text-orange-600 dark:text-orange-400" },
                        "from-indigo-500 to-purple-500": { border: "border-l-indigo-500", bg: "bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 dark:from-indigo-950/30 dark:via-violet-950/30 dark:to-purple-950/30", headerBg: "bg-gradient-to-r from-indigo-600 to-purple-600", text: "text-indigo-800 dark:text-indigo-200", badgeBg: "bg-indigo-100 dark:bg-indigo-900/40", badgeText: "text-indigo-700 dark:text-indigo-300", badgeBorder: "border-indigo-300 dark:border-indigo-700", infoBg: "hover:bg-indigo-100 dark:hover:bg-indigo-900/30", infoText: "text-indigo-600 dark:text-indigo-400" },
                      };
                      const colors = domainColorMap[domain.color] || domainColorMap["from-purple-500 to-pink-500"];
                      
                      return (
                      <div key={subdomainIndex} className="mb-8 last:mb-0">
                        <Card className={`border-l-4 ${colors.border} ${colors.bg} backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${colors.headerBg}`} />
                              <h3 className={`text-lg sm:text-xl font-bold ${colors.text}`}>{subdomain.title}</h3>
                              <TooltipProvider>
                                <TooltipComponent>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className={`h-6 w-6 ${colors.infoBg} rounded-full`}>
                                      <Info className={`h-4 w-4 ${colors.infoText}`} />
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
                              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-300 shadow-sm">
                                ✓ Avaliado
                              </div>
                            ) : (
                              <div className={`${colors.badgeBg} ${colors.badgeText} px-3 py-1 rounded-full text-xs font-medium border ${colors.badgeBorder}`}>
                                Pendente
                              </div>
                            )}
                          </div>
                          
                          {/* Desktop Table Layout */}
                          <div className="hidden md:block overflow-x-auto rounded-xl shadow-inner">
                            <Table className="min-w-full">
                              <TableHeader>
                                <TableRow className={`${colors.headerBg}`}>
                                  <TableHead className="min-w-[200px] font-bold text-white text-base">Parâmetros Avaliados</TableHead>
                                  <TableHead className="w-16 text-center text-white">
                                    <span className="block text-sm font-semibold">Não Obs.</span>
                                    <span className="block text-xs font-medium text-white/70">(0)</span>
                                  </TableHead>
                                  <TableHead className="w-16 text-center text-white">
                                    <span className="block text-sm font-semibold">Emergente</span>
                                    <span className="block text-xs font-medium text-white/70">(1)</span>
                                  </TableHead>
                                  <TableHead className="w-16 text-center text-white">
                                    <span className="block text-sm font-semibold">Inconsist.</span>
                                    <span className="block text-xs font-medium text-white/70">(2)</span>
                                  </TableHead>
                                  <TableHead className="w-16 text-center text-white">
                                    <span className="block text-sm font-semibold">Moderado</span>
                                    <span className="block text-xs font-medium text-white/70">(3)</span>
                                  </TableHead>
                                  <TableHead className="w-16 text-center text-white">
                                    <span className="block text-sm font-semibold">Consistente</span>
                                    <span className="block text-xs font-medium text-white/70">(4)</span>
                                  </TableHead>
                                  <TableHead className="w-16 text-center text-white">
                                    <span className="block text-sm font-semibold">Excepcional</span>
                                    <span className="block text-xs font-medium text-white/70">(5)</span>
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {subdomain.parameters.map((parameter, paramIndex) => (
                                  <TableRow key={paramIndex} className="hover:bg-blue-50/50 transition-colors duration-200">
                                    <TableCell className="text-sm sm:text-base font-semibold text-white py-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-l-lg">{parameter}</TableCell>
                                    {["nao_observado", "emergente", "inconsistente", "moderado", "consistente", "excepcional"].map((level, levelIndex) => (
                                      <TableCell 
                                        key={level} 
                                        className={`text-center p-2 sm:p-4 transition-all duration-300 rounded-lg ${
                                          selections[`${domain.title}-${subdomain.title}-${parameter}`] === level
                                            ? levelIndex === 0 ? 'bg-gray-200/70 dark:bg-gray-700/50'
                                            : levelIndex === 1 ? 'bg-red-100/70 dark:bg-red-900/30'
                                            : levelIndex === 2 ? 'bg-orange-100/70 dark:bg-orange-900/30'
                                            : levelIndex === 3 ? 'bg-yellow-100/70 dark:bg-yellow-900/30'
                                            : levelIndex === 4 ? 'bg-lime-100/70 dark:bg-lime-900/30'
                                            : 'bg-green-100/70 dark:bg-green-900/30'
                                            : ''
                                        }`}
                                      >
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
                                              className="flex items-center justify-center w-10 h-10 sm:w-8 sm:h-8 cursor-pointer touch-manipulation"
                                            >
                                              <span
                                                className={`block w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-all duration-200 ${getScoreColor(levelToScore(level))} ${
                                                  selections[`${domain.title}-${subdomain.title}-${parameter}`] === level
                                                    ? `${getScoreBgColor(levelToScore(level), true)} scale-110 shadow-md`
                                                    : "bg-background hover:scale-105"
                                                }`}
                                              />
                                            </label>
                                          </div>
                                        </RadioGroup>
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Mobile Card Layout */}
                          <div className="md:hidden space-y-3">
                            {subdomain.parameters.map((parameter, paramIndex) => {
                              const selectionKey = `${domain.title}-${subdomain.title}-${parameter}`;
                              const currentSelection = selections[selectionKey];
                              const levels = [
                                { value: "nao_observado", label: "Não Obs.", score: 0, bg: "bg-gray-100 dark:bg-gray-800", bgSelected: "bg-gray-500 text-white", border: "border-gray-300 dark:border-gray-600" },
                                { value: "emergente", label: "Emerg.", score: 1, bg: "bg-red-50 dark:bg-red-950", bgSelected: "bg-red-500 text-white", border: "border-red-200 dark:border-red-800" },
                                { value: "inconsistente", label: "Incons.", score: 2, bg: "bg-orange-50 dark:bg-orange-950", bgSelected: "bg-orange-500 text-white", border: "border-orange-200 dark:border-orange-800" },
                                { value: "moderado", label: "Moder.", score: 3, bg: "bg-yellow-50 dark:bg-yellow-950", bgSelected: "bg-yellow-500 text-white", border: "border-yellow-200 dark:border-yellow-800" },
                                { value: "consistente", label: "Consist.", score: 4, bg: "bg-lime-50 dark:bg-lime-950", bgSelected: "bg-lime-600 text-white", border: "border-lime-200 dark:border-lime-800" },
                                { value: "excepcional", label: "Excep.", score: 5, bg: "bg-green-50 dark:bg-green-950", bgSelected: "bg-green-600 text-white", border: "border-green-200 dark:border-green-800" },
                              ];
                              return (
                                <div key={paramIndex} className="rounded-xl border bg-card p-4 shadow-sm">
                                  <p className="text-sm font-semibold text-foreground mb-3">{parameter}</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {levels.map((lvl) => {
                                      const isSelected = currentSelection === lvl.value;
                                      return (
                                        <button
                                          key={lvl.value}
                                          type="button"
                                          onClick={() =>
                                            setSelections(prev => ({
                                              ...prev,
                                              [selectionKey]: lvl.value
                                            }))
                                          }
                                          className={`h-11 rounded-lg text-xs font-medium border transition-all duration-200 touch-manipulation ${
                                            isSelected
                                              ? `${lvl.bgSelected} border-transparent shadow-md scale-[1.02]`
                                              : `${lvl.bg} ${lvl.border} hover:opacity-80`
                                          }`}
                                        >
                                          <span className="block leading-tight">{lvl.label}</span>
                                          <span className={`block text-[10px] ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>({lvl.score})</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Campo de observações qualitativas */}
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-foreground mb-2">
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
                      );
                    })}

                  </Card>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="results" className="space-y-8 mt-8">
              {/* Informações sobre Avaliação Parcial */}
              {getEvaluatedDomainsCount() < evaluationDomains.length && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">⚡ Avaliação Parcial Detectada</h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm mb-2">
                    Esta é uma avaliação parcial onde nem todos os domínios foram pontuados. 
                    Os resultados refletem apenas os domínios efetivamente avaliados.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center mt-3">
                    <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded">
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Avaliados</p>
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{getEvaluatedDomainsCount()}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      <p className="text-sm font-semibold text-muted-foreground">Não Avaliados</p>
                      <p className="text-lg font-bold text-muted-foreground">{evaluationDomains.length - getEvaluatedDomainsCount()}</p>
                    </div>
                  </div>
                </div>
              )}

              <Card className="border-0 shadow-2xl p-6 sm:p-8 rounded-3xl bg-background">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Resultados da Escala MuseTera
                </h2>
                {getEvaluatedDomainsCount() < evaluationDomains.length && (
                  <p className="text-center text-sm text-amber-600 dark:text-amber-400 mb-6">
                    Avaliação Parcial — {getEvaluatedDomainsCount()}/{evaluationDomains.length} domínios
                  </p>
                )}
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-8" />
                
                {/* Score Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 text-white text-center shadow-lg shadow-purple-500/20">
                    <p className="text-3xl font-black">{overallScore.percentage}%</p>
                    <p className="text-xs font-medium text-purple-100 mt-1">Pontuação Geral</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white text-center shadow-lg shadow-emerald-500/20">
                    <p className="text-3xl font-black">{getEvaluatedDomainsCount()}/{evaluationDomains.length}</p>
                    <p className="text-xs font-medium text-emerald-100 mt-1">Domínios</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white text-center shadow-lg shadow-blue-500/20">
                    <p className="text-3xl font-black">{getEvaluatedSubdomainsCount()}</p>
                    <p className="text-xs font-medium text-blue-100 mt-1">Subdomínios</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl p-4 text-white text-center shadow-lg shadow-orange-500/20">
                    <p className="text-3xl font-black">{overallScore.raw}</p>
                    <p className="text-xs font-medium text-orange-100 mt-1">Pontos / {overallScore.max}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                  {/* Radar Chart */}
                  <Card className="border border-border/50 shadow-lg p-6 rounded-2xl bg-card">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <span className="text-white text-lg">📊</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Perfil Musicoterapêutico</h3>
                        <p className="text-xs text-muted-foreground">Visão multidimensional por domínio</p>
                      </div>
                    </div>
                    <div className="h-[350px] sm:h-[400px] w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={domainScores}>
                          <defs>
                            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <PolarGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                          <PolarAngleAxis 
                            dataKey="name" 
                            tick={{ fontSize: 11, fill: 'hsl(var(--foreground))', fontWeight: 600 }} 
                          />
                          <PolarRadiusAxis 
                            angle={30} 
                            domain={[0, 100]} 
                            tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                            axisLine={false}
                          />
                          <Radar 
                            name="Perfil" 
                            dataKey="value" 
                            stroke="#8b5cf6" 
                            fill="url(#radarGradient)" 
                            strokeWidth={2.5}
                            dot={{ r: 5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))', 
                              borderRadius: '12px', 
                              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
                              padding: '12px 16px'
                            }}
                            formatter={(value: number) => [`${value}%`, 'Pontuação']}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Donut Chart */}
                  <Card className="border border-border/50 shadow-lg p-6 rounded-2xl bg-card">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                        <span className="text-white text-lg">🎯</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Desenvolvimento Global</h3>
                        <p className="text-xs text-muted-foreground">Progresso geral do paciente</p>
                      </div>
                    </div>
                    <div className="h-[350px] sm:h-[400px] w-full flex flex-col items-center justify-center">
                      <div className="h-[280px] sm:h-[320px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <defs>
                              <linearGradient id="pieGreen" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#059669" />
                              </linearGradient>
                              <linearGradient id="pieOrange" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#f97316" />
                                <stop offset="100%" stopColor="#ea580c" />
                              </linearGradient>
                            </defs>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius="55%"
                              outerRadius="85%"
                              paddingAngle={4}
                              dataKey="value"
                              strokeWidth={0}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="url(#pieGreen)" />
                              <Cell fill="url(#pieOrange)" />
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))', 
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
                                padding: '12px 16px'
                              }}
                              formatter={(value: number) => [`${value}%`, '']}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        {/* Center label */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <p className="text-4xl font-black text-foreground">{overallScore.percentage}%</p>
                            <p className="text-xs text-muted-foreground font-medium">Score</p>
                          </div>
                        </div>
                      </div>
                      {overallScore.evaluatedDomains && overallScore.totalDomains && (
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          📊 {overallScore.evaluatedDomains} de {overallScore.totalDomains} domínios · Apenas avaliados impactam o score
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
                
                {/* Bar Chart */}
                <Card className="border border-border/50 shadow-lg p-6 rounded-2xl bg-card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                      <span className="text-white text-lg">📈</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Análise por Subdomínios</h3>
                      <p className="text-xs text-muted-foreground">Desempenho detalhado em cada área</p>
                    </div>
                  </div>
                  <div className="h-[450px] sm:h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={subdomainScores}
                        margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                      >
                        <defs>
                          <linearGradient id="barMusical" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#7c3aed" />
                          </linearGradient>
                          <linearGradient id="barPsicossocial" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                          <linearGradient id="barCognitivo" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#d97706" />
                          </linearGradient>
                          <linearGradient id="barSensorio" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f87171" />
                            <stop offset="100%" stopColor="#dc2626" />
                          </linearGradient>
                          <linearGradient id="barComunicativo" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#4f46e5" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={100}
                          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                          tickLine={false}
                        />
                        <YAxis 
                          domain={[0, 100]} 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card p-4 border border-border rounded-xl shadow-xl">
                                <p className="text-sm font-bold text-foreground">{data.name}</p>
                                <p className="text-xs text-muted-foreground mb-1">Domínio: {data.domain}</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div 
                                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" 
                                      style={{ width: `${data.value}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-bold text-foreground">{data.value}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={28}>
                          {subdomainScores.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={
                                entry.domain === "Musical" ? "url(#barMusical)" :
                                entry.domain === "Psicossocial" ? "url(#barPsicossocial)" : 
                                entry.domain === "Cognitivo" ? "url(#barCognitivo)" : 
                                entry.domain === "Sensório-Motor" ? "url(#barSensorio)" :
                                entry.domain === "Comunicativo-Interativo" ? "url(#barComunicativo)" :
                                "url(#barMusical)"
                              } 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {[
                      { label: "Musical", color: "from-purple-400 to-purple-600" },
                      { label: "Psicossocial", color: "from-emerald-400 to-emerald-600" },
                      { label: "Cognitivo", color: "from-amber-400 to-amber-600" },
                      { label: "Sensório-Motor", color: "from-red-400 to-red-600" },
                      { label: "Comunicativo", color: "from-indigo-400 to-indigo-600" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.color}`} />
                        <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </Card>
            </TabsContent>
            
            <TabsContent value="comparison" className="mt-8">
              {/* Header e Grid de Cards de Pacientes */}
              <Card className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50 border-0 shadow-xl mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <FileBarChart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Evolução dos Pacientes
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {patientsWithEvaluations.length} {patientsWithEvaluations.length === 1 ? "paciente" : "pacientes"} com avaliações salvas
                    </p>
                  </div>
                </div>

                {/* Grid de Cards */}
                <PatientEvaluationCards
                  patientsWithEvaluations={patientsWithEvaluations}
                  selectedPatientId={evolutionPatientId}
                  onSelectPatient={setEvolutionPatientId}
                  isLoading={isLoadingAll}
                />
              </Card>

              {/* Conteúdo condicional - apenas se paciente selecionado */}
              {evolutionPatientId && (
                <div className="mt-6 space-y-6">
                  {/* Histórico de Avaliações do Paciente - PRIMEIRO */}
                  <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        📜 Histórico de Avaliações
                      </h3>
                      <Button
                        onClick={() => {
                          const patientEvaluations = allEvaluations.filter(e => e.patient_id === evolutionPatientId);
                          if (patientEvaluations.length > 0) {
                            // Pass the most recent evaluation AND all patient evaluations for evolution analysis
                            handleGenerateParametersPDFFromSaved(patientEvaluations[0], patientEvaluations);
                          }
                        }}
                        disabled={allEvaluations.filter(e => e.patient_id === evolutionPatientId).length === 0}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 hover:from-purple-600 hover:to-indigo-600"
                      >
                        <FileBarChart className="h-4 w-4" />
                        Baixar Gráfico
                      </Button>
                    </div>
                    <EvaluationHistory
                      evaluations={allEvaluations.filter(e => e.patient_id === evolutionPatientId)}
                      isLoading={isLoadingAll}
                      selectedForComparison={selectedForComparison}
                      onToggleComparison={handleToggleComparison}
                      onLoadEvaluation={handleLoadEvaluation}
                      onDeleteEvaluation={deleteEvaluation}
                       onDownloadEvaluation={(evaluation) => {
                         const patientName = patients.find(p => p.id === evaluation.patient_id)?.name || "Paciente";
                         const domainScores = evaluation.content?.domainScores?.map((d: any) => ({
                           name: d.domain?.replace("Domínio ", "") || "Domínio",
                           value: d.score || 0,
                           fullMark: 100
                         })) || [];
                         
                         const savedOverallScore: any = evaluation.content?.overallScore || {};
                         const fullOverallScore = {
                           raw: savedOverallScore.raw || 0,
                           max: savedOverallScore.max || 100,
                           percentage: savedOverallScore.percentage || 0,
                           completionPercentage: savedOverallScore.completionPercentage || savedOverallScore.percentage || 0,
                           evaluatedDomains: savedOverallScore.evaluatedDomains || evaluation.content?.domainScores?.length || 0,
                           totalDomains: savedOverallScore.totalDomains || evaluationDomains.length,
                           evaluatedParameters: savedOverallScore.evaluatedParameters || 0,
                           totalParameters: savedOverallScore.totalParameters || 0
                         };

                         handleGenerateMuseteraPDF({
                           categoryData: evaluation.content?.domainScores?.flatMap((d: any) => 
                             (d.subdomains || []).map((sub: any) => ({
                               name: sub.name,
                               value: sub.score,
                               domain: d.domain.replace("Domínio ", "")
                             }))
                           ) || [],
                           pieData: [
                             { name: "Desenvolvido", value: fullOverallScore.percentage },
                             { name: "A desenvolver", value: 100 - fullOverallScore.percentage }
                           ],
                           patientName: patientName,
                           professionalData: professionalData,
                           radarData: domainScores,
                           selectedParameters: evaluation.content?.selections || {},
                           overallScore: fullOverallScore,
                           evaluationDomains: evaluationDomains,
                           evaluationDate: new Date(evaluation.date)
                         });
                       }}

                      onEditEvaluation={handleEditEvaluation}
                    />
                  </Card>

                  {/* Linha do Tempo de Evolução */}
                  <EvolutionTimeline
                    evaluations={allEvaluations.filter(e => e.patient_id === evolutionPatientId)}
                    patientName={patients.find(p => p.id === evolutionPatientId)?.name || "Paciente"}
                  />

                  {/* Análise de Áreas */}
                  <AreasAnalysis
                    evaluations={allEvaluations.filter(e => e.patient_id === evolutionPatientId)}
                  />

                  {/* Sugestões Terapêuticas */}
                  <TherapeuticSuggestions
                    evaluations={allEvaluations.filter(e => e.patient_id === evolutionPatientId)}
                    patientId={evolutionPatientId}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <PDFPreviewDialog
        open={pdfPreviewOpen}
        onOpenChange={setPdfPreviewOpen}
        pdfBlob={pdfPreviewBlob}
        filename={pdfPreviewFilename}
        title="Pré-visualização — Baixar Gráfico"
        isBuilding={pdfPreviewBuilding}
      />
    </div>
  );
}
