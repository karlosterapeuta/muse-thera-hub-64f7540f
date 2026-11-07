import { format } from "date-fns";
import { toast } from "sonner";
import { EvaluationTextPDF } from "@/components/EvaluationTextPDF";
import type { ProfessionalData } from "@/hooks/useProfessionalData";
import type { SavedEvaluation } from "@/hooks/useEvaluationStorage";
import { supabase } from "@/integrations/supabase/client";
import { calculateAgeFromBirthDate } from "@/utils/dateUtils";
import { resolveEvaluationMeta } from "@/utils/evaluationTypes";
import { imageUrlToBase64 } from "@/utils/imageToBase64";
import { savePDFToStorage } from "@/utils/pdfStorageUtils";
import { generateSectionPdf } from "@/utils/sectionPdfGenerator";
import { GraphReportPDF } from "@/components/pdf/GraphReportPDF";
import { normalizeEvaluation } from "./normalizeEvaluation";
import { summarizeEvaluation, summarizeDomain, summarizeSubdomain, levelScore } from "@/utils/museteraScoring";
import { evaluationDomains } from "./domains";

type EvaluationAnamnesisHeader = { guardianNames: string[]; cidCode: string | null };

export async function loadEvaluationAnamnesisHeader(patientId: string): Promise<EvaluationAnamnesisHeader> {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) throw new Error("Sessão não autenticada para consultar a anamnese.");
  const { data, error } = await supabase
    .from("anamnesis")
    .select("mother_name, father_name, legal_guardian, cid_code")
    .eq("patient_id", patientId)
    .eq("professional_id", auth.user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error("Não foi possível consultar a anamnese do paciente: " + error.message);
  const names = [data?.legal_guardian, data?.mother_name, data?.father_name]
    .filter((value): value is string => typeof value === "string" && Boolean(value.trim()))
    .map(value => value.trim());
  return {
    guardianNames: Array.from(new Set(names.filter((name, index) =>
      names.findIndex(other => other.toLocaleLowerCase("pt-BR") === name.toLocaleLowerCase("pt-BR")) === index
    ))),
    cidCode: typeof data?.cid_code === "string" ? data.cid_code.trim() || null : null,
  };
}

export const buildEvaluationReportContent = ({
  patientName,
  patientAge,
  evaluationDateLabel,
  achievements,
  developmentAreas,
  score,
}: {
  patientName: string;
  patientAge: number | null | undefined;
  evaluationDateLabel: string;
  achievements: any[];
  developmentAreas: any[];
  score: { percentage: number; evaluatedDomains: number; totalDomains: number; evaluatedParameters: number; totalParameters?: number; completionPercentage?: number };
}) => {
  const groupByDomain = (items: any[]) =>
    items.reduce<Record<string, any[]>>((acc, item) => {
      const domain = item.domain || 'Domínio avaliado';
      acc[domain] = [...(acc[domain] || []), item];
      return acc;
    }, {});

  const describeItems = (items: any[]) =>
    items
      .slice(0, 6)
      .map((item) => `${item.parameter} (${item.score}%)`)
      .join('; ');

  const achievementDomains = Object.entries(groupByDomain(achievements)).map(([domain, items]) => ({
    dominio: domain,
    analise: `Foram observados ${items.length} indicadores em nível funcional neste domínio, com destaque para ${describeItems(items)}. Esses achados apontam recursos terapêuticos preservados que podem ser utilizados como base para ampliar engajamento, responsividade musical, comunicação e autonomia no processo musicoterapêutico.`,
  }));

  const developmentDomains = Object.entries(groupByDomain(developmentAreas)).map(([domain, items]) => ({
    dominio: domain,
    analise: `Foram identificados ${items.length} indicadores que requerem acompanhamento sistemático neste domínio, especialmente ${describeItems(items)}. Recomenda-se intervenção gradual, com mediação musical estruturada, repetição terapêutica, adaptação de recursos e registro contínuo da resposta do paciente.`,
  }));

  const completionText = score.evaluatedParameters > 0
    ? `${score.evaluatedParameters} parâmetros foram avaliados em ${score.evaluatedDomains} de ${score.totalDomains} domínios.`
    : 'A avaliação ainda possui poucos parâmetros preenchidos.';

  return {
    sintese_geral: `A avaliação musicoterapêutica de ${patientName}${patientAge ? `, ${patientAge} anos` : ''}, realizada em ${evaluationDateLabel}, apresentou média de ${score.percentage}% somente nos indicadores pontuados. ${completionText} ${score.totalParameters != null ? `Cobertura de ${score.evaluatedParameters}/${score.totalParameters} indicadores aplicáveis (${score.completionPercentage ?? 0}%).` : 'Cobertura total não registrada neste documento histórico.'} ${score.totalParameters == null || score.evaluatedParameters < score.totalParameters || score.evaluatedDomains < score.totalDomains ? 'Resultado parcial: não usar o percentual como conclusão global.' : 'A interpretação deve considerar o contexto de aplicação e os registros clínicos.'} Esses achados são descritivos do momento avaliado.`,
    conquistas: {
      introducao: achievementDomains.length > 0
        ? 'As conquistas abaixo representam habilidades já observadas e recursos clínicos que podem sustentar o planejamento terapêutico.'
        : 'Ainda não foram identificados indicadores suficientes em nível moderado, consistente ou excepcional nesta avaliação.',
      por_dominio: achievementDomains,
    },
    areas_desenvolvimento: {
      introducao: developmentDomains.length > 0
        ? 'As áreas a desenvolver indicam prioridades para intervenção e monitoramento nas próximas sessões.'
        : 'Não foram identificadas áreas prioritárias com pontuação abaixo de 60% entre os parâmetros preenchidos.',
      por_dominio: developmentDomains,
    },
    recomendacoes: [
      'Manter registro sistemático das respostas do paciente em cada sessão, comparando os indicadores avaliados ao longo do tempo.',
      'Utilizar atividades musicais estruturadas com objetivos claros, alternando experiências receptivas, recriativas, improvisacionais e composicionais conforme a necessidade clínica.',
      'Priorizar os domínios com menor pontuação, iniciando por tarefas musicais simples, previsíveis e com progressão gradual de complexidade.',
      'Valorizar os recursos já preservados como via de acesso para comunicação, vínculo terapêutico, autorregulação e participação ativa.',
      'Reavaliar periodicamente para acompanhar evolução, ajustar objetivos terapêuticos e documentar evidências de progresso.',
    ],
    objetivos: [
      { dominio: 'Musical', objetivo: 'Ampliar a responsividade musical por meio de atividades rítmicas, vocais e instrumentais adequadas ao perfil do paciente.' },
      { dominio: 'Psicossocial', objetivo: 'Fortalecer engajamento, vínculo terapêutico e participação compartilhada em experiências musicais.' },
      { dominio: 'Cognitivo', objetivo: 'Estimular atenção, memória, antecipação e organização sequencial por meio de estruturas musicais previsíveis.' },
      { dominio: 'Sensório-Motor', objetivo: 'Favorecer integração auditivo-motora, coordenação e modulação sensorial com instrumentos e movimento corporal.' },
      { dominio: 'Comunicativo', objetivo: 'Promover intenção comunicativa, expressão vocal/corporal e turnos de interação musical.' },
    ],
  };
};

// Função para categorizar dados de uma avaliação SALVA
const categorizeEvaluationDataFromSaved = (evaluation: SavedEvaluation) => {
  const achievements: any[] = [];
  const developmentAreas: any[] = [];

  const savedSelections = evaluation.content?.selections || {};

  // Iterar sobre as seleções salvas
  Object.entries(savedSelections).forEach(([key, value]) => {
    // Names such as "Domínio Sensório-Motor" contain hyphens;
    // match the original full prefix instead of splitting on "-".
    const match = evaluationDomains.flatMap(domain =>
      domain.subdomains.map(subdomain => ({
        domain: domain.title,
        subdomain: subdomain.title,
        prefix: `${domain.title}-${subdomain.title}-`
      }))
    ).find(item => key.startsWith(item.prefix));
    if (match) {
      const { domain, subdomain } = match;
      const parameter = key.slice(match.prefix.length);
      const score = levelScore(value);

      if (score !== null) {
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

const evidenceLabels: Record<string, string> = {
  attempts: "Tentativas", successes: "Respostas funcionais", support: "Apoio", note: "Evidências e adaptações",
};
const supportLabels: Record<string, string> = {
  independente: "Sem ajuda", pista_visual: "Pista visual ou gestual", pista_verbal: "Pista verbal",
  modelo: "Modelo ou demonstração", ajuda_intensa: "Ajuda intensa", nao_registrado: "Não registrado",
};

function observationText(key: string, value: string): string {
  if (!key.startsWith("__musetera_evidence__:")) return value;
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return value;
    return Object.entries(parsed)
      .filter(([, entry]) => typeof entry === "string" && entry.trim())
      .map(([field, entry]) => `${evidenceLabels[field] || field}: ${field === "support" ? supportLabels[String(entry)] || entry : entry}`)
      .join("\n");
  } catch {
    return value;
  }
}

function EvaluationObservations({ observations }: { observations: Record<string, string> }) {
  return <>{Object.entries(observations).flatMap(([key, value]) => {
    const text = observationText(key, value);
    if (!text.trim()) return [];
    // Small sections keep long clinical notes legible during PDF pagination.
    const chunks = text.match(/[\s\S]{1,850}(?:\s|$)|[\s\S]{1,850}/g) || [];
    return chunks.map((chunk, index) => (
      <section key={key + index} data-pdf-section style={{ width: "182mm", padding: "4mm", boxSizing: "border-box", color: "#172b4d", background: "#fff", font: "11pt Arial", lineHeight: 1.6, overflowWrap: "anywhere" }}>
        <h2 style={{ fontSize: "13pt", color: "#0f766e" }}>Observações do terapeuta{index ? " · continuação" : ""}</h2>
        <h3 style={{ fontSize: "11pt" }}>{key.replace("__musetera_evidence__:", "")}</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{chunk}</p>
      </section>
    ));
  })}</>;
}

export async function generateEvaluationReportBlob(
  source: SavedEvaluation,
  professionalData: ProfessionalData | null | undefined,
  filename: string,
): Promise<Blob> {
  const evaluation = normalizeEvaluation(source);
  const selections = evaluation.content?.selections || {};
  const score = summarizeEvaluation(selections, evaluationDomains);
  if (!score.evaluatedParameters) throw new Error("Esta avaliação não possui indicadores pontuados.");
  const patientName = evaluation.patient_name || "Paciente";
  const patientAge = calculateAgeFromBirthDate(evaluation.patient_birth_date) ?? evaluation.patient_age ?? null;
  const date = new Date(evaluation.date);
  const dateLabel = format(date, "dd/MM/yyyy");
  const header = await loadEvaluationAnamnesisHeader(evaluation.patient_id);
  const { achievements, developmentAreas } = categorizeEvaluationDataFromSaved(evaluation);
  const reportContent = buildEvaluationReportContent({
    patientName, patientAge, evaluationDateLabel: dateLabel, achievements, developmentAreas, score,
  });
  const [signature, stamp, photo] = await Promise.all([
    professionalData?.digital_signature_url,
    professionalData?.digital_stamp_url,
    professionalData?.stamp_photo_url || professionalData?.avatar_url,
  ].map(url => url ? imageUrlToBase64(url).catch(() => undefined) : Promise.resolve(undefined)));
  const evaluatedDomains = evaluationDomains.filter(domain => summarizeDomain(selections, domain).evaluatedParameters > 0);
  const radarData = evaluatedDomains.map(domain => ({
    name: domain.title.replace("Domínio ", ""),
    value: summarizeDomain(selections, domain).percentage,
  }));
  const categoryData = evaluatedDomains.flatMap(domain => domain.subdomains
    .filter(sub => summarizeSubdomain(selections, domain.title, sub.title, sub.parameters).evaluatedParameters > 0)
    .map(sub => ({
      name: sub.title, domain: domain.title.replace("Domínio ", ""),
      value: summarizeSubdomain(selections, domain.title, sub.title, sub.parameters).percentage,
    })));
  return generateSectionPdf(
    <div style={{ background: "#fff" }}>
      <EvaluationTextPDF content={reportContent} patientName={patientName} patientAge={patientAge}
        patientBirthDate={evaluation.patient_birth_date} guardianNames={header.guardianNames} cidCode={header.cidCode}
        evaluationDate={dateLabel} professionalName={professionalData?.name || "Profissional"}
        professionalRegister={professionalData?.register || undefined} overallScore={score} suppressProfessionalFooter />
      <EvaluationObservations observations={evaluation.content?.observations || {}} />
      <GraphReportPDF patientName={patientName} patientAge={patientAge} professionalData={professionalData}
        evaluationDate={date} selections={selections} evaluationDomains={evaluationDomains} overallScore={score}
        categoryData={categoryData} radarData={radarData}
        pieData={[{ name: "Desenvolvido", value: score.percentage }, { name: "A desenvolver", value: 100 - score.percentage }]}
        digitalSignatureBase64={signature || undefined} digitalStampBase64={stamp || undefined}
        professionalPhotoBase64={photo || undefined} evaluationType={resolveEvaluationMeta(evaluation).key}
        suppressDocumentHeader />
    </div>,
    { filename, scale: 2 },
  );
}

export const downloadSavedEvaluation = async (evaluation: SavedEvaluation, professionalData: ProfessionalData | null | undefined) => {
  const loadingId = toast.loading("Preparando relatório completo da avaliação...");
  try {
    const filename = `avaliacao-${resolveEvaluationMeta(evaluation).shortLabel}-${evaluation.patient_name || "paciente"}-${format(new Date(evaluation.date), "yyyy-MM-dd")}.pdf`;
    const blob = await generateEvaluationReportBlob(evaluation, professionalData, filename);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    savePDFToStorage(blob, filename, "evaluation").catch(console.warn);
    toast.success("Relatório completo baixado.", { id: loadingId });
  } catch (error) {
    console.error(error);
    toast.error("Não foi possível baixar a avaliação. Tente novamente.", { id: loadingId });
  }
};
