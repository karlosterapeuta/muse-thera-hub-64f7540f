import { normalizeSelections } from "@/utils/museteraScoring";
import { evaluationDomains } from "./utils/domains";
import { generateEvaluationReportBlob } from "./utils/savedReport";

import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { FileDown, Info, HelpCircle, FileBarChart, FileText, CalendarIcon, Loader2, Save, User, AlertTriangle, X, Stethoscope, ChevronDown, ClipboardList, BarChart2, TrendingUp } from "lucide-react";
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
import { getEvaluationTypeMeta } from "@/utils/evaluationTypes";
import { getEvolutionStageKey, getRecordedEvaluationScore } from "@/utils/evolutionPresentation";
import { EVALUATION_ACTIVITY_PROTOCOLS } from "./utils/activityProtocols";
import { AUTISM_DOMAIN_NOTES, presentationParameterLabel } from "./utils/autismGuidance";
import { TEA_CLINICAL_REVIEWS } from "./utils/clinicalReviews";
import { ParameterRubric } from "./components/ParameterRubric";
import { isScored, levelScore, summarizeSubdomain, summarizeDomain, summarizeEvaluation, parameterKey } from "@/utils/museteraScoring";
import { Document, Packer, Paragraph, AlignmentType, ImageRun } from "docx";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface Patient {
  id: string;
  name: string;
  birth_date: string | null;
  age: number | null;
}

const EVAL_DRAFT_KEY = 'musetera-eval-draft';

// Converts every page of the exact PDF into a full-page image in a Word document.
const downloadPdfAsWordPages = async (pdfBlob: Blob, title: string, filename: string) => {
  const pdfBytes = new Uint8Array(await pdfBlob.arrayBuffer());
  const pdf = await getDocument({ data: pdfBytes }).promise;
  const children: Paragraph[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.8 });
      const canvas = window.document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Não foi possível preparar a imagem da página do PDF.");

      await page.render({ canvasContext: context, viewport }).promise;
      const dataUrl = canvas.toDataURL("image/png");
      const base64 = dataUrl.split(",")[1];
      const binary = window.atob(base64);
      const imageBytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) imageBytes[i] = binary.charCodeAt(i);

      const imageWidth = 780;
      const imageHeight = Math.round(imageWidth * viewport.height / viewport.width);
      children.push(new Paragraph({
        children: [new ImageRun({ data: imageBytes, transformation: { width: imageWidth, height: imageHeight } })],
        alignment: AlignmentType.CENTER,
        pageBreakBefore: pageNumber > 1,
        spacing: { before: 0, after: 0, line: 240 },
      }));
      page.cleanup();
    }

    const doc = new Document({
      creator: "MuseTera",
      title,
      sections: [{
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 7, right: 7, bottom: 7, left: 7, header: 0, footer: 0 },
          },
        },
        children,
      }],
    });
    const wordBlob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(wordBlob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    window.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  } finally {
    await pdf.destroy();
  }
};

const safeDocxFileName = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-zA-Z0-9_-]+/g, "_");


function loadDraft(key = EVAL_DRAFT_KEY) {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export default function Evaluation() {
  const [params] = useSearchParams();
  const requested = params.get("patient_id") || "";
  return <EvaluationForm key={requested} requested={requested} />;
}

function EvaluationForm({ requested }: { requested: string }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const draftKey = requested ? EVAL_DRAFT_KEY + ":" + requested : EVAL_DRAFT_KEY;
  const draft = useMemo(() => {
    const stored = loadDraft(draftKey) || (requested ? loadDraft() : null);
    return !requested || stored?.selectedPatient === requested ? stored : null;
  }, [draftKey, requested]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedEvaluation, setSelectedEvaluation] = useState(draft?.selectedEvaluation || "1");
  const [evaluationDate, setEvaluationDate] = useState<Date>(draft?.evaluationDate ? new Date(draft.evaluationDate) : new Date());
  const [selections, setSelections] = useState<Record<string, string>>(normalizeSelections(draft?.selections || {}));
  const [observations, setObservations] = useState<Record<string, string>>(draft?.observations || {});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    requestedTab && ["evaluation", "results", "comparison"].includes(requestedTab)
      ? requestedTab : draft?.activeTab || "evaluation"
  );
  const handleTabChange = (nextTab: string) => {
    setActiveTab(nextTab);
    const nextParams = new URLSearchParams(searchParams);
    if (nextTab === "evaluation") nextParams.delete("tab");
    else nextParams.set("tab", nextTab);
    setSearchParams(nextParams, { replace: true });
  };
  const [onlyPending, setOnlyPending] = useState(false);
  const [activeDomainFilter, setActiveDomainFilter] = useState("Domínio Musical");
  const [activeSubdomainFilter, setActiveSubdomainFilter] = useState("all");
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [editingEvaluationId, setEditingEvaluationId] = useState<string | null>(draft?.editingEvaluationId || null);
  const [draftLoaded] = useState(!!draft);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfPreviewBlob, setPdfPreviewBlob] = useState<Blob | null>(null);
  const [pdfPreviewFilename, setPdfPreviewFilename] = useState<string>("documento.pdf");
  const [pdfPreviewBuilding, setPdfPreviewBuilding] = useState(false);

  const [draftStorageFailed, setDraftStorageFailed] = useState(false);
  const [savedToHistory, setSavedToHistory] = useState(false);
  const hasDraftInput = Object.keys(selections).length > 0 ||
    Object.values(observations).some(value => Boolean(value.trim()));

  // Persist draft to sessionStorage on changes
  useEffect(() => {
    if (!selectedPatient) return;
    const data = {
      selectedPatient,
      selectedEvaluation,
      evaluationDate: evaluationDate.toISOString(),
      selections,
      observations,
      activeTab,
      editingEvaluationId,
    };
    try {
      sessionStorage.setItem(draftKey, JSON.stringify(data));
      setDraftStorageFailed(false);
    } catch {
      setDraftStorageFailed(true);
    }
  }, [selectedPatient, selectedEvaluation, evaluationDate, selections, observations, activeTab, editingEvaluationId]);

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

  // Sessões novas começam em branco. Uma avaliação anterior só é aberta
  // explicitamente por "Carregar" ou "Editar", evitando reutilizar respostas.
  const startNewEvaluation = (afterSave = false) => {
    if (!afterSave && hasDraftInput && !window.confirm(
      "Iniciar nova sessão? As respostas deste rascunho serão descartadas. Salve a avaliação para mantê-las no histórico."
    )) return;
    setSavedToHistory(afterSave);
    setEditingEvaluationId(null);
    setSelections({});
    setObservations({});
    setEvaluationDate(new Date());
    toast.info("Nova sessão iniciada. O histórico existente foi preservado.");
  };




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
      const uniqueTypes = [...new Set(evals.map(getEvolutionStageKey))];
      
      // Apenas avaliações efetivamente pontuadas participam da média descritiva.
      // Ausência de pontuação não é equivalente a uma resposta clínica 0.
      const recordedScores = evals
        .map(getRecordedEvaluationScore)
        .filter((score): score is number => score !== null);
      const avgScore = recordedScores.length > 0
        ? recordedScores.reduce((sum, score) => sum + score, 0) / recordedScores.length
        : null;
      
      // Buscar dados do paciente
      const patient = patients.find(p => p.id === patientId);
      
      return {
        patientId,
        patientName: patient?.name || sortedEvals[0]?.patient_name || "Paciente",
        patientAge: calculateAgeFromBirthDate(patient?.birth_date) ?? patient?.age ?? null,
        totalEvaluations: evals.length,
        evaluationTypes: uniqueTypes,
        lastEvaluationDate: sortedEvals[0].date,
        averageScore: avgScore === null ? null : Math.round(avgScore),
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
        const target = requested || draft?.selectedPatient;
        if (target && data?.some(p => p.id === target)) setSelectedPatient(target);
        else if (target) {
          setEditingEvaluationId(null);
          setSelections({});
          setObservations({});
          toast.error("Paciente indisponível. Selecione um paciente para continuar.");
        } else if (data?.length) setSelectedPatient(data[0].id);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPatients();
  }, []);

  const selectedPatientData = patients.find(p => p.id === selectedPatient);



  // Motor único para tela, análises e documentos.
  const isParameterEvaluated = (domain: string, subdomain: string, parameter: string): boolean =>
    isScored(selections[parameterKey(domain, subdomain, parameter)]);

  const isPendingParameter = (domain: string, subdomain: string, parameter: string) => {
    const value = selections[parameterKey(domain, subdomain, parameter)];
    return !isScored(value) && value !== "nao_aplicavel";
  };
  const visibleSubdomain = (domain: typeof evaluationDomains[number], subdomain: typeof domain.subdomains[number]) =>
    (activeSubdomainFilter === "all" || domain.title !== activeDomainFilter || subdomain.title === activeSubdomainFilter) &&
    (!onlyPending || subdomain.parameters.some(parameter => isPendingParameter(domain.title, subdomain.title, parameter)));
  const visibleDomains = evaluationDomains
    .filter(domain => activeDomainFilter === "all" || domain.title === activeDomainFilter)
    .filter(domain => domain.subdomains.some(subdomain => visibleSubdomain(domain, subdomain)));

  const isSubdomainEvaluated = (domain: string, subdomain: string, parameters: string[]): boolean =>
    summarizeSubdomain(selections, domain, subdomain, parameters).evaluatedParameters > 0;

  const isDomainEvaluated = (domain: any): boolean =>
    summarizeDomain(selections, domain).evaluatedParameters > 0;

  const getEvaluatedDomainsCount = (): number =>
    summarizeEvaluation(selections, evaluationDomains).evaluatedDomains;

  const getEvaluatedSubdomainsCount = (): number =>
    evaluationDomains.reduce((count, domain) =>
      count + domain.subdomains.filter(subdomain =>
        isSubdomainEvaluated(domain.title, subdomain.title, subdomain.parameters)
      ).length, 0);

  const calculateScore = (domain: string, subdomain: string, parameter: string): number =>
    levelScore(selections[parameterKey(domain, subdomain, parameter)]) ?? 0;

  const calculateSubdomainScore = (domain: string, subdomain: string, parameters: string[]) =>
    summarizeSubdomain(selections, domain, subdomain, parameters);

  const calculateDomainScore = (domain: any) => summarizeDomain(selections, domain);

  const calculateOverallScore = () => summarizeEvaluation(selections, evaluationDomains);

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
  const isPartialEvaluation = overallScore.pendingParameters > 0 || overallScore.evaluatedDomains < evaluationDomains.length;
  const hasScoredParameters = overallScore.evaluatedParameters > 0;
  const missingDomains = evaluationDomains.filter(domain => !isDomainEvaluated(domain)).map(domain => domain.title);

  const pieData = [
    { name: "Desenvolvido", value: overallScore.percentage },
    { name: "A desenvolver", value: 100 - overallScore.percentage },
  ];

  const COLORS = ['#0f766e', '#a6b6b1'];

  // Handler functions for evaluation storage
  const handleSaveEvaluation = async () => {
    if (!selectedPatient) {
      toast.error("Selecione um paciente primeiro");
      return;
    }
    if (overallScore.evaluatedParameters === 0) {
      toast.error("Pontue ao menos um indicador antes de salvar.");
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

    // Somente o botão explícito "Editar" permite UPDATE.
    // Avaliações novas sempre criam uma linha independente no histórico.
    const targetId = editingEvaluationId;

    if (targetId) {
      // Atualizar avaliação existente (em edição ou do mesmo período)
      success = await updateEvaluation(
        targetId,
        evaluationDate,
        selectedEvaluation,
        selections,
        observations,
        domainScoresData,
        overallScore
      );
      if (success) {
        startNewEvaluation(true);
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
      if (success) startNewEvaluation(true);
    }
  };

  const handleLoadEvaluation = (evaluation: SavedEvaluation) => {
    if (evaluation.content) {
      setSelections(normalizeSelections(evaluation.content.selections || {}));
      setObservations(evaluation.content.observations || {});
      setEvaluationDate(new Date(evaluation.date));
      if (evaluation.content.evaluationType) {
        setSelectedEvaluation(evaluation.content.evaluationType);
      }
      setEditingEvaluationId(evaluation.id);
      toast.success("Avaliação aberta para edição. Use Nova sessão para registrar outro atendimento.");
    }
  };

  const handleEditEvaluation = (evaluation: SavedEvaluation) => {
    // Select the correct patient if editing from another patient's evaluation
    if (evaluation.patient_id && evaluation.patient_id !== selectedPatient) {
      setSelectedPatient(evaluation.patient_id);
    }
    
    if (evaluation.content) {
      setSelections(normalizeSelections(evaluation.content.selections || {}));
      setObservations(evaluation.content.observations || {});
      setEvaluationDate(new Date(evaluation.date));
      if (evaluation.content.evaluationType) {
        setSelectedEvaluation(evaluation.content.evaluationType);
      }
    }
    setEditingEvaluationId(evaluation.id);
    handleTabChange("evaluation");
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

      const photoUrl = professionalData?.stamp_photo_url || professionalData?.avatar_url;
      const [professionalPhotoBase64, digitalStampBase64] = await Promise.all([
        photoUrl ? imageUrlToBase64(photoUrl).catch(() => undefined) : Promise.resolve(undefined),
        professionalData?.digital_stamp_url
          ? imageUrlToBase64(professionalData.digital_stamp_url).catch(() => undefined)
          : Promise.resolve(undefined),
      ]);

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
          evaluationType={evaluation.type || savedContent.evaluationType}
        />,
        { filename, scale: 1.05 }
      );

      // Download imediato — sem preview
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      // Upload em background (fire-and-forget)
      savePDFToStorage(blob, filename, "evaluation").catch((e) => console.warn(e));

      toast.success("Gráfico baixado com sucesso!", { id: loadingToast });
    } catch (error) {
      console.error("Erro ao gerar PDF de gráficos:", error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.", { id: loadingToast });
    }
  };

  const handleGenerateMuseteraPDF = async () => {
    // Verificar se há dados para gerar o PDF
    if (Object.keys(selections).length === 0) {
      toast.error("Nenhum parâmetro avaliado. Preencha a avaliação ou carregue uma avaliação salva.");
      return;
    }
    
    let loadingToast: string | number | undefined;
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

      if (professionalData?.stamp_photo_url) {
        photoBase64 = await imageUrlToBase64(professionalData.stamp_photo_url);
      }

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

      loadingToast = toast.loading("Gerando Relatório MuseTera Aprimorado...");

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

      const pdfInst4 = html2pdf().set(opt).from(root);
      await pdfInst4.save();
      try { const blob = await pdfInst4.outputPdf('blob'); await savePDFToStorage(blob, opt.filename, "evaluation"); } catch(e) { console.warn(e); }
      
      } finally {
        cleanup();
      }
      
      toast.success("Relatório MuseTera Aprimorado gerado com sucesso!", { id: loadingToast });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.", { id: loadingToast });
    }
  };

  const handleDownloadCombinedReport = async (formatType: "pdf" | "word") => {
    if (!selectedPatient) {
      toast.error("Selecione um paciente primeiro");
      return;
    }
    if (overallScore.evaluatedParameters === 0) {
      toast.error("Avalie pelo menos alguns parâmetros primeiro");
      return;
    }

    const isWord = formatType === "word";
    if (isWord) setIsGeneratingWord(true);
    else setIsGeneratingText(true);

    const patientName = selectedPatientData?.name || "Paciente";
    const patientAge = calculateAgeFromBirthDate(selectedPatientData?.birth_date) ?? selectedPatientData?.age ?? null;
    const dateLabel = format(evaluationDate, "dd/MM/yyyy");
    const filenameBase = `relatorio-musicoterapeutico-musetera-${safeDocxFileName(patientName)}-${format(evaluationDate, "yyyy-MM-dd")}`;
    const loadingId = toast.loading(isWord
      ? "Montando relatório completo e preparando o Word..."
      : "Montando relatório completo em PDF...");

    try {
      const pdfBlob = await generateEvaluationReportBlob({
        id: editingEvaluationId || "draft",
        patient_id: selectedPatient,
        patient_name: patientName,
        patient_age: patientAge ?? undefined,
        patient_birth_date: selectedPatientData?.birth_date || undefined,
        date: evaluationDate.toISOString(),
        created_at: evaluationDate.toISOString(),
        type: selectedEvaluation,
        content: { selections, observations, overallScore, domainScores: [], evaluationType: selectedEvaluation },
      }, professionalData, `${filenameBase}.pdf`);

      if (isWord) {
        await downloadPdfAsWordPages(
          pdfBlob,
          `Relatório completo de avaliação musicoterapêutica - ${patientName}`,
          `${filenameBase}.docx`,
        );
      } else {
        const url = URL.createObjectURL(pdfBlob);
        const anchor = window.document.createElement("a");
        anchor.href = url;
        anchor.download = `${filenameBase}.pdf`;
        window.document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1500);
        savePDFToStorage(pdfBlob, `${filenameBase}.pdf`, "evaluation").catch((error) => console.warn(error));
      }

      toast.success(isWord
        ? "Relatório completo exportado para Word."
        : "Relatório completo exportado para PDF.", { id: loadingId });
    } catch (error) {
      console.error("Erro ao gerar relatório musicoterapêutico completo:", error);
      toast.error(isWord
        ? "Não foi possível gerar o Word. Tente novamente."
        : "Não foi possível gerar o PDF. Tente novamente.", { id: loadingId });
    } finally {
      if (isWord) setIsGeneratingWord(false);
      else setIsGeneratingText(false);
    }
  };

  const handleGenerateEvaluationText = async () => handleDownloadCombinedReport("pdf");


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


  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-background">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6">
        <header className="relative overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-br from-white via-emerald-50/70 to-teal-50 px-5 py-7 shadow-sm dark:border-teal-900 dark:from-teal-950/60 dark:via-background dark:to-background sm:px-8 sm:py-9">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-800 dark:text-teal-300">Avaliação clínica · Musicoterapia</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-teal-950 dark:text-teal-100 mb-2">
            Escala MuseTera
          </h1>
          <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-200">
            Avaliação musicoterapêutica funcional com atividades adaptáveis ao perfil autista
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-teal-900 dark:text-teal-100">
            <span className="rounded-full border border-teal-200 bg-white/85 px-3 py-1.5 dark:border-teal-800 dark:bg-teal-950/70">128 indicadores observáveis</span>
            <span className="rounded-full border border-teal-200 bg-white/85 px-3 py-1.5 dark:border-teal-800 dark:bg-teal-950/70">Registro por sessão</span>
            <span className="rounded-full border border-teal-200 bg-white/85 px-3 py-1.5 dark:border-teal-800 dark:bg-teal-950/70">Comparação longitudinal</span>
          </div>
        </header>
        
        <Card className="bg-card border border-teal-700/15 dark:border-teal-500/20 shadow-sm p-4 sm:p-6 lg:p-8 rounded-2xl">
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch lg:items-center">
              <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-2 dark:border-teal-800 dark:bg-teal-950/30">
                <div className="rounded-lg bg-card p-3 shadow-sm">
                  <PatientSelect
                    patients={patients}
                    selectedPatient={selectedPatient}
                    onSelect={(patientId) => {
                      if (patientId !== selectedPatient) {
                        if (requested) {
                          navigate(`/evaluation?patient_id=${encodeURIComponent(patientId)}`);
                          return;
                        }
                        setSelectedPatient(patientId);
                        setEditingEvaluationId(null);
                        setSelections({});
                        setObservations({});
                        setEvaluationDate(new Date());
                      }
                    }}
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
                  <Button asChild variant="link" className="min-h-11 px-0">
                    <Link to={`/pti?patient_id=${encodeURIComponent(selectedPatient)}`}>Abrir PTI deste paciente</Link>
                  </Button>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Data da Avaliação</label>
                <Popover>
                  <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[220px] justify-start text-left font-normal border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all duration-300 text-foreground font-medium",
                    !evaluationDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-teal-600" />
                  {evaluationDate ? format(evaluationDate, "dd/MM/yyyy") : <span>Selecionar data</span>}
                </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-2 border-teal-300 dark:border-teal-700 shadow-2xl" align="start">
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
            
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <Select
                value={selectedEvaluation}
                onValueChange={setSelectedEvaluation}
              >
                <SelectTrigger className="w-full sm:w-[200px] text-foreground font-medium border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all duration-300">
                  <SelectValue placeholder="Selecione a avaliação" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl">
                  {["1", "2", "3", "4"].map((v) => {
                    const meta = getEvaluationTypeMeta(v);
                    return (
                      <SelectItem key={v} value={v}>
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: meta.color }}
                          />
                          {meta.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>

              </Select>
              <div className="w-full min-w-0 space-y-3 rounded-xl border border-border bg-muted/30 p-4 sm:p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Relatório completo de avaliação</h3>
                    <p className="text-sm leading-relaxed text-foreground/85">
                      Texto clínico, parâmetros, gráficos e identificação profissional em um único documento.
                    </p>
                  </div>
                  <span className="text-sm text-foreground/80">Escolha o formato de saída</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button
                    onClick={handleGenerateEvaluationText}
                    disabled={isGeneratingText || isGeneratingWord || !selectedPatient || overallScore.evaluatedParameters === 0}
                    className="w-full justify-center gap-2 bg-teal-600 text-white hover:bg-teal-700"
                  >
                    {isGeneratingText ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                    Baixar relatório em PDF
                  </Button>
                  <Button
                    onClick={() => handleDownloadCombinedReport("word")}
                    disabled={isGeneratingWord || isGeneratingText || !selectedPatient || overallScore.evaluatedParameters === 0}
                    variant="outline"
                    className="w-full justify-center gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
                  >
                    {isGeneratingWord ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                    Baixar relatório em Word
                  </Button>
                </div>
              </div>

              <p role="status" aria-live="polite" className="text-sm font-medium text-foreground">
                {draftStorageFailed
                  ? "Não foi possível guardar o rascunho nesta aba. Salve a avaliação antes de sair."
                  : hasDraftInput
                    ? "Rascunho nesta aba · Salve a avaliação para incluí-la no histórico."
                    : savedToHistory
                      ? "Avaliação salva no histórico · Nova sessão em branco."
                      : "Nova sessão em branco"}
              </p>
              <Button type="button" variant="outline" onClick={() => startNewEvaluation()} disabled={!selectedPatient || isSaving} className="min-h-11 w-full sm:w-auto border-teal-700 text-teal-800 dark:text-teal-200 focus-visible:ring-2 focus-visible:ring-teal-600">
                Nova sessão (preservar histórico)
              </Button>
              <TooltipProvider>
                <TooltipComponent>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSaveEvaluation}
                      disabled={isSaving || !selectedPatient}
                      className="min-h-11 w-full sm:w-auto justify-center flex items-center gap-2 bg-teal-800 text-white border-0 shadow-sm transition-colors hover:bg-teal-900 focus-visible:ring-2 focus-visible:ring-teal-500 disabled:opacity-50"
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
                  className="w-full sm:w-auto justify-center flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                  Cancelar Edição
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList aria-label="Etapas da avaliação" className="grid w-full grid-cols-3 bg-muted/60 p-1 sm:p-1.5 rounded-xl h-auto min-h-[4rem] border border-border shadow-sm">
              <TabsTrigger 
                value="evaluation" 
                className="min-h-12 rounded-lg flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm md:text-base font-semibold px-1.5 sm:px-3 py-2 gap-1 sm:gap-2 leading-tight text-center data-[state=active]:bg-teal-800 data-[state=active]:text-white data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-teal-600 transition-colors hover:bg-muted/80"
              >
                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span>Escala MuseTera</span>
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="min-h-12 rounded-lg flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm md:text-base font-semibold px-1.5 sm:px-3 py-2 gap-1 sm:gap-2 leading-tight text-center data-[state=active]:bg-teal-800 data-[state=active]:text-white data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-teal-600 transition-colors hover:bg-muted/80"
              >
                <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span>Resultados</span>
              </TabsTrigger>
              <TabsTrigger 
                value="comparison" 
                className="min-h-12 rounded-lg flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm md:text-base font-semibold px-1.5 sm:px-3 py-2 gap-1 sm:gap-2 leading-tight text-center data-[state=active]:bg-teal-800 data-[state=active]:text-white data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-teal-600 transition-colors hover:bg-muted/80"
              >
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span>Evolução do Paciente</span>
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
                <CollapsibleTrigger className="w-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-lg p-3 flex items-center justify-between hover:bg-teal-100 dark:hover:bg-teal-950/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-semibold text-teal-800 dark:text-teal-200">Como usar a escala</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-teal-600 dark:text-teal-400 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 border-t-0 rounded-b-lg p-4">
                  <h3 className="text-base font-semibold text-teal-800 dark:text-teal-200 mb-2">Escala MuseTera - Versão Profissional</h3>
                  <p className="text-teal-700 dark:text-teal-300 text-sm">
                    Sistema de pontuação (0-100): Não Observado (0), Emergente (20), Inconsistente (40), 
                    Moderado (60), Consistente (80), Excepcional (100)
                  </p>
                </CollapsibleContent>
              </Collapsible>

              <p className="mb-5 rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-3 text-sm leading-relaxed text-teal-900 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-100">Aplique a escala com 16 protocolos por subdomínio e 128 tarefas observáveis. Abra o guia da atividade para consultar materiais e passos, registre o desempenho nas observações e selecione o nível correspondente. Parâmetros não testados ficam fora da média, enquanto Não observado (0) é uma resposta efetivamente avaliada.</p>

              <div className="mb-5 space-y-2 rounded-xl border border-teal-300 bg-card p-4 text-sm leading-relaxed text-foreground dark:border-teal-700">
                <p className="font-semibold text-teal-900 dark:text-teal-100">Orientações para avaliação de pacientes autistas</p>
                <p>Permita escolha de repertório e instrumento, uso de comunicação alternativa, respostas por gesto ou movimento, pausas e adaptações sensoriais. Não exija contato ocular, fala, toque físico ou exposição musical involuntária. Observe a funcionalidade no contexto do paciente.</p>
                <p className="text-muted-foreground">Esta escala descreve respostas musicoterapêuticas observadas. Não estabelece diagnóstico de autismo, nível de suporte nem comparação normativa entre pacientes. Registre apoios e adaptações para interpretar mudanças entre sessões.</p>
              </div>

              {/* Estatísticas da Avaliação Parcial */}
              <section aria-labelledby="evaluation-progress-heading" className="mb-6 rounded-2xl border border-teal-200 bg-card p-4 shadow-sm dark:border-teal-800 sm:p-6">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h3 id="evaluation-progress-heading" className="text-lg font-bold text-teal-950 dark:text-teal-100">Progresso da avaliação</h3>
                    <p className="text-sm text-muted-foreground">Os indicadores não aplicados não entram na média.</p>
                  </div>
                  <span className="text-lg font-bold tabular-nums text-teal-900 dark:text-teal-100">{overallScore.completionPercentage}% preenchido</span>
                </div>
                <div role="progressbar" aria-label="Indicadores preenchidos" aria-valuemin={0} aria-valuemax={100} aria-valuenow={overallScore.completionPercentage} className="mb-5 h-2.5 overflow-hidden rounded-full bg-teal-100 dark:bg-teal-950">
                  <div className="h-full rounded-full bg-teal-700 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${overallScore.completionPercentage}%` }} />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border bg-muted/30 p-3 sm:p-4">
                    <p className="text-2xl font-bold tabular-nums text-teal-900 dark:text-teal-100">{getEvaluatedDomainsCount()}<span className="ml-1 text-sm font-normal text-muted-foreground">/ {evaluationDomains.length}</span></p>
                    <p className="text-sm font-medium text-foreground">Domínios avaliados</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3 sm:p-4">
                    <p className="text-2xl font-bold tabular-nums text-teal-900 dark:text-teal-100">{getEvaluatedSubdomainsCount()}<span className="ml-1 text-sm font-normal text-muted-foreground">/ {evaluationDomains.reduce((acc, domain) => acc + domain.subdomains.length, 0)}</span></p>
                    <p className="text-sm font-medium text-foreground">Subdomínios avaliados</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3 sm:p-4">
                    <p className="text-2xl font-bold tabular-nums text-teal-900 dark:text-teal-100">
                      {calculateOverallScore().percentage}%
                    </p>
                    <p className="text-sm font-medium text-foreground">Média dos itens pontuados</p>
                  </div>
                </div>
              </section>

              <nav aria-label="Navegação por domínios da avaliação" className="mb-5 rounded-2xl border border-teal-200 bg-card p-4 shadow-sm dark:border-teal-800 sm:p-5">
                <h3 className="mb-2 text-base font-bold text-foreground">Escolha o que deseja avaliar</h3>
                <p className="mb-3 text-sm text-foreground/85">Selecione o domínio e, se desejar, um subdomínio. As respostas permanecem no rascunho.</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label htmlFor="eval-domain-filter" className="text-sm font-semibold text-foreground">Domínio</label>
                    <select id="eval-domain-filter" className="min-h-12 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600" value={activeDomainFilter} onChange={event => { setActiveDomainFilter(event.target.value); setActiveSubdomainFilter("all"); }}>
                      <option value="all">Todos os domínios</option>
                      {evaluationDomains.map(domain => <option key={domain.title} value={domain.title}>{domain.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="eval-subdomain-filter" className="text-sm font-semibold text-foreground">Subdomínio</label>
                    <select id="eval-subdomain-filter" disabled={activeDomainFilter === "all"} className="min-h-12 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600" value={activeSubdomainFilter} onChange={event => setActiveSubdomainFilter(event.target.value)}>
                      <option value="all">Todos os subdomínios</option>
                      {evaluationDomains.find(domain => domain.title === activeDomainFilter)?.subdomains.map(subdomain => <option key={subdomain.title} value={subdomain.title}>{subdomain.title}</option>)}
                    </select>
                  </div>
                </div>
                <Button type="button" variant={onlyPending ? "default" : "outline"} className="mt-3 min-h-12 w-full sm:w-auto"
                  aria-pressed={onlyPending} onClick={() => setOnlyPending(value => !value)}>
                  Somente indicadores pendentes
                </Button>
                <p aria-live="polite" className="mt-3 text-sm font-medium text-teal-900 dark:text-teal-100">Progresso geral: {overallScore.evaluatedParameters} de {overallScore.totalParameters} indicadores aplicáveis pontuados · {overallScore.completionPercentage}% preenchido</p>
              </nav>

              {onlyPending && visibleDomains.length === 0 && (
                <p role="status" className="rounded-xl border border-border bg-card p-4 text-foreground">
                  Nenhum indicador pendente nos filtros selecionados. Desative o filtro para revisar as respostas.
                </p>
              )}
              {visibleDomains.map((domain) => (
                <div key={domain.title} className="group">
                  <Card className="border border-teal-700/15 dark:border-teal-500/20 shadow-sm p-4 sm:p-6 rounded-2xl bg-card">
                    <div className="flex flex-wrap items-center mb-5 gap-3">
                      <div className={`text-3xl p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40`}>
                        {domain.icon}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">{domain.title}</h2>
                      
                      {/* Badge indicador de status do domínio */}
                      <div className="ml-auto flex items-center gap-2">
                        {isDomainEvaluated(domain) ? (
                          <div className="bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-300 dark:border-emerald-800">
                            Avaliado
                          </div>
                        ) : (
                          <div className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 px-3 py-1 rounded-full text-sm font-medium border border-slate-300 dark:border-slate-700">
                            Não Avaliado
                          </div>
                        )}
                        
                        <TooltipProvider>
                          <TooltipComponent>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label={`Informações sobre ${domain.title}`} className="h-11 w-11 hover:bg-background/50 rounded-full focus-visible:ring-2 focus-visible:ring-teal-600">
                                <HelpCircle aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs bg-gray-900 text-white border-0">
                              <p className="text-sm">{domain.description}</p>
                            </TooltipContent>
                          </TooltipComponent>
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    <p className="mb-5 rounded-lg border border-teal-200 bg-teal-50/70 px-4 py-3 text-sm leading-relaxed text-teal-950 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-100">
                      <strong>Aplicação no TEA:</strong> {AUTISM_DOMAIN_NOTES[domain.title]}
                    </p>

                    {domain.subdomains.filter(subdomain => visibleSubdomain(domain, subdomain)).map((subdomain, subdomainIndex) => {
                      const domainColorMap: Record<string, { border: string; bg: string; headerBg: string; text: string; badgeBg: string; badgeText: string; badgeBorder: string; infoBg: string; infoText: string }> = {
                        "from-teal-700 to-emerald-700": { border: "border-l-teal-600", bg: "bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-emerald-950/30", headerBg: "bg-gradient-to-r from-teal-600 to-emerald-600", text: "text-teal-800 dark:text-teal-200", badgeBg: "bg-emerald-100 dark:bg-emerald-900/40", badgeText: "text-emerald-700 dark:text-emerald-300", badgeBorder: "border-emerald-300 dark:border-emerald-700", infoBg: "hover:bg-emerald-100 dark:hover:bg-emerald-900/30", infoText: "text-emerald-600 dark:text-emerald-400" },
                        "from-teal-700 to-teal-800": { border: "border-l-emerald-600", bg: "bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 dark:from-teal-950/30 dark:via-emerald-950/30 dark:to-teal-950/30", headerBg: "bg-gradient-to-r from-teal-600 to-emerald-600", text: "text-teal-800 dark:text-teal-200", badgeBg: "bg-emerald-100 dark:bg-emerald-900/40", badgeText: "text-emerald-700 dark:text-emerald-300", badgeBorder: "border-emerald-300 dark:border-emerald-700", infoBg: "hover:bg-emerald-100 dark:hover:bg-emerald-900/30", infoText: "text-emerald-600 dark:text-emerald-400" },
                        "from-emerald-700 to-teal-800": { border: "border-l-teal-500", bg: "bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-green-950/30", headerBg: "bg-gradient-to-r from-emerald-600 to-teal-600", text: "text-emerald-800 dark:text-emerald-200", badgeBg: "bg-teal-100 dark:bg-teal-900/40", badgeText: "text-teal-700 dark:text-teal-300", badgeBorder: "border-teal-300 dark:border-teal-700", infoBg: "hover:bg-teal-100 dark:hover:bg-teal-900/30", infoText: "text-teal-600 dark:text-teal-400" },
                        "from-teal-600 to-teal-800": { border: "border-l-teal-700", bg: "bg-gradient-to-r from-teal-50 via-teal-50 to-emerald-50 dark:from-teal-950/30 dark:via-teal-950/30 dark:to-emerald-950/30", headerBg: "bg-gradient-to-r from-teal-700 to-emerald-700", text: "text-teal-800 dark:text-teal-200", badgeBg: "bg-teal-100 dark:bg-teal-900/40", badgeText: "text-teal-700 dark:text-teal-300", badgeBorder: "border-teal-300 dark:border-teal-700", infoBg: "hover:bg-teal-100 dark:hover:bg-teal-900/30", infoText: "text-teal-600 dark:text-teal-400" },
                      };
                      const colors = domainColorMap[domain.color] || domainColorMap["from-teal-700 to-emerald-700"];
                      
                      return (
                      <div key={subdomainIndex} className="mb-4 last:mb-0">
                        <Card className={`border-l-4 ${colors.border} ${colors.bg} p-3 sm:p-5 rounded-xl shadow-none`}>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${colors.headerBg}`} />
                              <h3 className={`text-base sm:text-lg font-bold ${colors.text}`}>{subdomain.title}</h3>
                              <TooltipProvider>
                                <TooltipComponent>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className={`h-9 w-9 ${colors.infoBg} rounded-full`}>
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
                              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-300">
                                ✓ Avaliado
                              </div>
                            ) : (
                              <div className={`${colors.badgeBg} ${colors.badgeText} px-3 py-1 rounded-full text-sm font-medium border ${colors.badgeBorder}`}>
                                Pendente
                              </div>
                            )}
                          </div>
                          
                          <Collapsible className="w-full">
                            <CollapsibleTrigger className="mb-3 flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-teal-300 bg-card px-4 py-3 text-left text-sm font-semibold text-teal-900 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-teal-700 dark:text-teal-100 dark:hover:bg-teal-950/50">
                              <span>Aplicar atividades · {subdomain.parameters.filter(param => isParameterEvaluated(domain.title, subdomain.title, param)).length}/{subdomain.parameters.length} indicadores pontuados</span>
                              <ChevronDown className="h-5 w-5 shrink-0" aria-hidden="true" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-1">
                          {EVALUATION_ACTIVITY_PROTOCOLS[subdomain.title] && (
                            <Collapsible className="mb-4 rounded-xl border border-teal-200 bg-card dark:border-teal-800">
                              <CollapsibleTrigger className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-teal-800 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-teal-200 dark:hover:bg-teal-950/40">
                                <span className="flex items-center gap-2"><ClipboardList className="h-4 w-4 shrink-0" /> Atividade avaliativa · {EVALUATION_ACTIVITY_PROTOCOLS[subdomain.title].title}</span>
                                <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="space-y-3 border-t border-teal-200 px-4 py-4 text-sm leading-relaxed text-foreground dark:border-teal-800">
                                <p><strong>Materiais:</strong> {EVALUATION_ACTIVITY_PROTOCOLS[subdomain.title].materials}</p>
                                <p><strong>Aplicação:</strong> {EVALUATION_ACTIVITY_PROTOCOLS[subdomain.title].procedure}</p>
                                <p><strong>O que registrar:</strong> {EVALUATION_ACTIVITY_PROTOCOLS[subdomain.title].evidence}</p>
                                <p className="rounded-lg bg-teal-50 p-3 text-sm text-teal-950 dark:bg-teal-950/40 dark:text-teal-100">Protocolo clínico proposto, ainda não validado cientificamente. Adapte com justificativa à idade, comunicação, acessibilidade e condições sensoriais; documente pistas e apoios.</p>
                              </CollapsibleContent>
                            </Collapsible>
                          )}

                          {/* Unified Button Grid Layout — desktop & mobile */}
                          <div className="space-y-3">
                            {subdomain.parameters.map((parameter, paramIndex) => {
                              if (onlyPending && !isPendingParameter(domain.title, subdomain.title, parameter)) return null;
                              const selectionKey = `${domain.title}-${subdomain.title}-${parameter}`;
                              const currentSelection = selections[selectionKey];
                              const levels = [
                                { value: "nao_observado", label: "Não Obs.", score: 0, bg: "bg-gray-100 dark:bg-gray-800", bgSelected: "bg-slate-700 text-white", border: "border-gray-300 dark:border-gray-600" },
                                { value: "emergente", label: "Emerg.", score: 1, bg: "bg-red-50 dark:bg-red-950", bgSelected: "bg-red-800 text-white", border: "border-red-200 dark:border-red-800" },
                                { value: "inconsistente", label: "Incons.", score: 2, bg: "bg-orange-50 dark:bg-orange-950", bgSelected: "bg-orange-800 text-white", border: "border-orange-200 dark:border-orange-800" },
                                { value: "moderado", label: "Moder.", score: 3, bg: "bg-yellow-50 dark:bg-yellow-950", bgSelected: "bg-amber-800 text-white", border: "border-yellow-200 dark:border-yellow-800" },
                                { value: "consistente", label: "Consist.", score: 4, bg: "bg-lime-50 dark:bg-lime-950", bgSelected: "bg-lime-800 text-white", border: "border-lime-200 dark:border-lime-800" },
                                { value: "excepcional", label: "Excep.", score: 5, bg: "bg-green-50 dark:bg-green-950", bgSelected: "bg-green-800 text-white", border: "border-green-200 dark:border-green-800" },
                              ];
                              return (
                                <div key={paramIndex} className={`min-w-0 rounded-2xl border p-3 shadow-sm transition-colors sm:p-4 ${currentSelection ? "border-teal-400 bg-teal-50/40 dark:border-teal-700 dark:bg-teal-950/20" : "border-border bg-card"}`}>
                                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-teal-800 dark:text-teal-200">Indicador {paramIndex + 1}</p>
                                      <h4 className="break-words text-base font-bold leading-snug text-foreground sm:text-lg">{presentationParameterLabel(parameter)}</h4>
                                    </div>
                                    {currentSelection && (
                                      <span className="shrink-0 rounded-full border border-teal-300 bg-teal-100 px-2.5 py-1 text-xs font-bold text-teal-950 dark:border-teal-700 dark:bg-teal-900 dark:text-teal-50">
                                        Pontuado
                                      </span>
                                    )}
                                  </div>
                                  <div className="mb-4 min-w-0 rounded-r-xl rounded-l-sm border border-teal-200 border-l-4 border-l-teal-700 bg-[#F0FDFA] p-3 shadow-sm sm:p-4 dark:border-teal-800 dark:border-l-teal-400 dark:bg-teal-950/50">
                                    <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#115E59] dark:text-teal-200">
                                      <ClipboardList className="h-4 w-4 shrink-0" aria-hidden="true" />
                                      Atividade proposta · tarefa observável
                                    </div>
                                    <p className="break-words text-[17px] font-semibold leading-relaxed text-[#134E4A] dark:text-teal-50">
                                      {EVALUATION_ACTIVITY_PROTOCOLS[subdomain.title]?.prompts[paramIndex] || "Observar este indicador durante tarefa musical pertinente e registrar a resposta."}
                                    </p>
                                  </div>
                                  {TEA_CLINICAL_REVIEWS[parameter] && (
                                    <div className="mb-3 rounded-lg border border-teal-300 bg-card px-3 py-3 text-sm leading-relaxed text-foreground dark:border-teal-700">
                                      <p className="font-semibold text-teal-900 dark:text-teal-100">Orientação clínica TEA · revisão do indicador</p>
                                      <p className="mt-1">{TEA_CLINICAL_REVIEWS[parameter].guidance}</p>
                                    </div>
                                  )}
                                  <p className="mb-2 text-sm font-semibold text-foreground">Nível observado</p>
                                  <div className="grid grid-cols-2 min-[380px]:grid-cols-3 sm:grid-cols-6 gap-2" role="group" aria-label={`Pontuação do indicador: ${presentationParameterLabel(parameter)}`}>
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
                                          aria-pressed={isSelected}
                                           aria-label={`${presentationParameterLabel(parameter)}: ${lvl.label}, nível ${lvl.score}`}
                                           className={`min-h-12 rounded-lg text-sm font-semibold border transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 ${
                                            isSelected
                                              ? `${lvl.bgSelected} border-transparent shadow-md scale-[1.02]`
                                              : `${lvl.bg} ${lvl.border} hover:opacity-80`
                                          }`}
                                        >
                                          <span className="block leading-tight">{lvl.label}</span>
                                          <span className={`block text-xs sm:text-sm ${isSelected ? 'text-white' : 'text-muted-foreground'}`}>({lvl.score})</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <ParameterRubric
                                    parameterKey={selectionKey}
                                    parameterLabel={presentationParameterLabel(parameter)}
                                    selection={currentSelection}
                                    observations={observations}
                                    onEvidenceChange={(key, value) => setObservations(prev => ({ ...prev, [key]: value }))}
                                    onSelectionChange={(value) => setSelections(prev => ({ ...prev, [selectionKey]: value }))}
                                  />
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
                            </CollapsibleContent>
                          </Collapsible>
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
              {isPartialEvaluation && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">⚡ Avaliação Parcial Detectada</h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm mb-2">
                    Esta avaliação está incompleta: a média representa somente os indicadores pontuados e não deve ser interpretada como desempenho global conclusivo.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mt-3">
                  <div className="bg-white dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Cobertura aplicável</p>
                    <p className="text-xl font-bold text-amber-900 dark:text-amber-100">{overallScore.completionPercentage}%</p>
                    <p className="text-xs text-amber-800 dark:text-amber-200">{overallScore.evaluatedParameters}/{overallScore.totalParameters} indicadores</p>
                  </div>
                  <div className="bg-white dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Pendentes / N/A</p>
                    <p className="text-xl font-bold text-amber-900 dark:text-amber-100">{overallScore.pendingParameters} / {overallScore.notApplicableParameters}</p>
                  </div>
                    <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded">
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Avaliados</p>
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{getEvaluatedDomainsCount()}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      <p className="text-sm font-semibold text-muted-foreground">Não Avaliados</p>
                      <p className="text-lg font-bold text-muted-foreground">{evaluationDomains.length - getEvaluatedDomainsCount()}</p>
                    </div>
                  </div>
                  {missingDomains.length > 0 && (
                    <p className="mt-3 text-sm font-medium text-amber-950 dark:text-amber-100">Domínios sem dados: {missingDomains.join("; ")}. Eles não representam pontuação zero.</p>
                  )}
                </div>
              )}

              <Card className="border-0 shadow-2xl p-4 sm:p-8 rounded-3xl bg-background">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center bg-gradient-to-r from-teal-600 to-teal-600 bg-clip-text text-transparent">
                  Resultados da Escala MuseTera
                </h2>
                {isPartialEvaluation && (
                  <p className="text-center text-sm text-teal-600 dark:text-teal-400 mb-6">
                    Avaliação parcial — {overallScore.evaluatedParameters}/{overallScore.totalParameters} indicadores pontuados ({overallScore.completionPercentage}% de cobertura)
                  </p>
                )}
                <div className="w-16 h-1 bg-gradient-to-r from-teal-700 to-emerald-600 mx-auto rounded-full mb-8" />
                
                {/* Score Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-4 text-white text-center shadow-lg shadow-teal-500/20">
                    <p className="text-3xl font-black">{hasScoredParameters ? `${overallScore.percentage}%` : "—"}</p>
                    <p className="text-sm font-semibold text-white mt-1">Média dos itens pontuados</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white text-center shadow-lg shadow-emerald-500/20">
                    <p className="text-3xl font-black">{getEvaluatedDomainsCount()}/{evaluationDomains.length}</p>
                    <p className="text-sm font-semibold text-white mt-1">Domínios com dados</p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-4 text-white text-center shadow-lg shadow-teal-500/20">
                    <p className="text-3xl font-black">{getEvaluatedSubdomainsCount()}</p>
                    <p className="text-sm font-semibold text-white mt-1">Subdomínios com dados</p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-4 text-white text-center shadow-lg shadow-teal-500/20">
                    <p className="text-3xl font-black">{overallScore.raw}</p>
                    <p className="text-sm font-semibold text-white mt-1">Pontos / {overallScore.max}</p>
                  </div>
                </div>

                <div className="mb-6 rounded-xl border border-teal-300 dark:border-teal-700 bg-card px-4 py-4 text-sm text-foreground">
                  <p className="font-semibold text-base">Interpretação do resultado</p>
                  {hasScoredParameters ? (
                    <p className="mt-2">Desempenho observado: <strong>{overallScore.percentage}%</strong> nos {overallScore.evaluatedParameters} indicadores pontuados. Cobertura: <strong>{overallScore.completionPercentage}%</strong> dos {overallScore.totalParameters} indicadores aplicáveis. {isPartialEvaluation ? "Resultado parcial, sem conclusão global. Compare apenas condições de aplicação e cobertura semelhantes." : "Todos os domínios possuem dados e não há indicadores pendentes; interpretar segundo registros clínicos e adaptações."}</p>
                  ) : (
                    <p className="mt-2">Não há pontuação registrada. Os resultados permanecem não avaliados, e nenhum percentual representa desempenho do paciente.</p>
                  )}
                  <p className="mt-2 text-foreground/85">Não aplicáveis ({overallScore.notApplicableParameters}) são excluídos do denominador; itens ainda pendentes ({overallScore.pendingParameters}) também não recebem zero automaticamente.</p>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                  {/* Radar Chart */}
                  <Card className="border border-border/50 shadow-lg p-3 sm:p-6 rounded-2xl bg-card">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md">
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
                              <stop offset="0%" stopColor="#0f766e" stopOpacity={0.4} />
                              <stop offset="100%" stopColor="#0d9488" stopOpacity={0.1} />
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
                            stroke="#0f766e" 
                            fill="url(#radarGradient)" 
                            strokeWidth={2.5}
                            dot={{ r: 5, fill: '#0f766e', stroke: '#fff', strokeWidth: 2 }}
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
                  <Card className="border border-border/50 shadow-lg p-3 sm:p-6 rounded-2xl bg-card">
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
                              <linearGradient id="pieRemaining" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#a6b6b1" />
                                <stop offset="100%" stopColor="#d5e1dc" />
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
                              <Cell fill="url(#pieRemaining)" />
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
                <Card className="border border-border/50 shadow-lg p-3 sm:p-6 rounded-2xl bg-card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md">
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
                                      className="h-2 rounded-full bg-gradient-to-r from-teal-700 to-emerald-600" 
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
                      { label: "Musical", color: "from-teal-400 to-teal-600" },
                      { label: "Psicossocial", color: "from-emerald-400 to-emerald-600" },
                      { label: "Cognitivo", color: "from-teal-400 to-teal-600" },
                      { label: "Sensório-Motor", color: "from-red-400 to-red-600" },
                      { label: "Comunicativo", color: "from-teal-400 to-teal-600" },
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
              <Card className="mb-6 border-border bg-card p-4 shadow-sm sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileBarChart className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Evolução dos Pacientes
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {patientsWithEvaluations.length} {patientsWithEvaluations.length === 1 ? "paciente" : "pacientes"} com avaliações salvas
                    </p>
                  </div>
                </div>

                {/* Grid de Cards - clicar abre a página de evolução do paciente */}
                <PatientEvaluationCards
                  patientsWithEvaluations={patientsWithEvaluations}
                  onDeletePatient={async (patientId) => {
                    const toDelete = allEvaluations.filter((e) => e.patient_id === patientId);
                    for (const ev of toDelete) {
                      await deleteEvaluation(ev.id);
                    }
                    await loadAllEvaluations();
                    toast.success("Avaliações excluídas. Você pode iniciar uma nova avaliação.");
                  }}
                  isLoading={isLoadingAll}
                />
              </Card>

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
