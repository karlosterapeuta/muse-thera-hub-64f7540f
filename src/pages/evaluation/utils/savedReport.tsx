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
      const score = levelToScoreValue(value as string);

      if (value && value !== 'nao_aplicavel') {
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
export const downloadSavedEvaluation = async (evaluation: SavedEvaluation, professionalData: ProfessionalData | null | undefined) => {
  const patient = { name: evaluation.patient_name, birth_date: evaluation.patient_birth_date, age: evaluation.patient_age };
  // Verificar se há parâmetros avaliados
  const savedSelections = evaluation.content?.selections || {};
  const evaluatedCount = Object.values(savedSelections).filter(v => v && v !== 'nao_aplicavel').length;

  if (evaluatedCount === 0) {
    toast.error("Esta avaliação não possui parâmetros marcados");
    return;
  }


  const loadingId = toast.loading("Preparando avaliação para download...");

  try {
    const anamnesisHeader = await loadEvaluationAnamnesisHeader(evaluation.patient_id);
    // Categorizar dados da avaliação SALVA
    const { achievements, developmentAreas } = categorizeEvaluationDataFromSaved(evaluation);

    // Preparar overallScore da avaliação salva com todas as propriedades necessárias
    const rawOverallScore: any = evaluation.content?.overallScore || {};
    const savedOverallScore = {
      percentage: rawOverallScore.percentage || 0,
      evaluatedDomains: rawOverallScore.evaluatedDomains || evaluation.content?.domainScores?.length || 0,
      totalDomains: rawOverallScore.totalDomains || evaluationDomains.length,
      evaluatedParameters: rawOverallScore.evaluatedParameters ?? 0,
      totalParameters: rawOverallScore.totalParameters,
      completionPercentage: rawOverallScore.completionPercentage
    };

    const evaluationDateLabel = format(new Date(evaluation.date), 'dd/MM/yyyy');
    const reportContent = buildEvaluationReportContent({
      patientName: patient.name || 'Paciente',
      patientAge: calculateAgeFromBirthDate(patient.birth_date) ?? patient.age,
      evaluationDateLabel,
      achievements,
      developmentAreas,
      score: savedOverallScore,
    });

    toast.loading("Gerando PDF do relatório...", { id: loadingId });

    const [signatureBase64, stampBase64, photoBase64] = await Promise.all([
      professionalData?.digital_signature_url
        ? imageUrlToBase64(professionalData.digital_signature_url).catch(() => null)
        : Promise.resolve(null),
      professionalData?.digital_stamp_url
        ? imageUrlToBase64(professionalData.digital_stamp_url).catch(() => null)
        : Promise.resolve(null),
      professionalData?.stamp_photo_url
        ? imageUrlToBase64(professionalData.stamp_photo_url).catch(() => null)
        : Promise.resolve(null),
    ]);

    // Gerar PDF com o texto retornado
    const pdfContent = (
      <div id="evaluation-text-pdf-content" style={{ display: 'block' }}>
        <EvaluationTextPDF
          content={reportContent}
          patientName={patient.name || 'Paciente'}
          patientAge={calculateAgeFromBirthDate(patient.birth_date) ?? patient.age ?? null}
          patientBirthDate={patient.birth_date}
          guardianNames={anamnesisHeader.guardianNames}
          cidCode={anamnesisHeader.cidCode}
          evaluationDate={evaluationDateLabel}
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

    const filename = `avaliacao-${resolveEvaluationMeta(evaluation).shortLabel}-${patient.name || 'paciente'}-${format(new Date(evaluation.date), 'yyyy-MM-dd')}.pdf`;
    const blob = await generateSectionPdf(pdfContent, { filename, scale: 1.0 });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    savePDFToStorage(blob, filename, "evaluation").catch((e) => console.warn(e));

    toast.success("Avaliação baixada com sucesso!", { id: loadingId });
  } catch (error: any) {
    console.error("Erro ao gerar texto:", error);
    toast.error("Erro ao baixar a avaliação. Tente novamente.", { id: loadingId });
  }
};
