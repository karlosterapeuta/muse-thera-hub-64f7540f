import { jsPDF } from "jspdf";
import { clinicalFieldLabel } from "@/pages/anamnesis/utils/clinicalRevisionPresentation";

export type NativeAnamnesisData = Record<string, unknown> & { created_at?: string };
export type NativeProfessional = {
  name?: string;
  email?: string;
  specialty?: string;
  register?: string;
  license_number?: string;
};

type FieldSection = { title: string; keys: readonly string[] };
const SECTIONS: readonly FieldSection[] = [
  { title: "01 · Identificação e encaminhamento", keys: [
    "legal_guardian","family_relationship","mother_name","father_name","referral_professional",
    "main_clinical_demand","diagnosis_details","cid_code","diagnosis_date","support_level",
  ] },
  { title: "02 · Histórico clínico e médico", keys: [
    "autism_spectrum","adhd","odd_disorder","down_syndrome","intellectual_disability","cerebral_palsy",
    "epilepsy","chronic_encephalopathy","williams_syndrome","fragile_x_syndrome","rett_syndrome",
    "angelman_syndrome","alzheimer","parkinson","depression","bipolar_disorder","anxiety_disorders",
    "other_diagnoses","clinical_details",
  ] },
  { title: "03 · Medicação em uso", keys: ["current_medication","medication_schedule","medication_effects"] },
  { title: "04 · Terapias e acompanhamentos", keys: [
    "speech_therapy","psychological_support","psychopedagogical","occupational_therapy",
    "physiotherapy","equine_therapy","aba_therapy","sensory_integration","psychomotricity",
    "nutrition","music_therapy","therapy_frequency","therapy_observations",
  ] },
  { title: "05 · Perfil musical", keys: [
    "musical_education","instrumental_practice","body_musical_expression","vocal_expression",
    "choral_activities","no_musical_experience","music_therapy_experience","instruments_played",
    "music_practice_time","patient_musical_history",
  ] },
  { title: "06 · Identidade sonora (ISO)", keys: [
    "pregnancy_sound_experiences","mother_movements_songs","childhood_sound_environment",
    "parents_sound_reactions","typical_house_sounds","night_body_sounds","family_musical_history",
  ] },
  { title: "07 · Comportamento musical observado", keys: [
    "active_musical_listening","body_expression","sound_responsiveness","spontaneous_vocal",
    "instrumental_exploration","musical_behavior_description",
  ] },
  { title: "08 · Processamento auditivo e sensorial", keys: [
    "adverse_sound_reactivity","auditory_hypersensitivity","positive_musical_response",
    "nominal_call_response","active_sound_search","specific_sound_aversion",
    "sound_source_location","discomfort_sounds","calming_sounds",
  ] },
  { title: "09 · Desenvolvimento neuropsicomotor", keys: [
    "cervical_control","crawling_pattern","fine_motor_dev","independent_sitting",
    "autonomous_walking","broad_motor_dev","babbling","simple_phrases","echolalia",
    "first_words","nonverbal_communication","verbal_language_absence",
  ] },
  { title: "10 · Aspectos comportamentais e emocionais", keys: [
    "visual_contact","shared_play","peer_interaction","social_isolation","stereotyped_behavior",
    "restricted_interests","irritability","heteroaggressive","emotional_ability","anxiety",
    "frequent_crying","low_frustration_tolerance","regulation_strategies","calming_strategies",
  ] },
  { title: "11 · Contexto social, escolar e perfil funcional", keys: [
    "school_enrollment","school_adaptation","extracurricular_activities","family_support_network",
    "tea_functional_profile",
  ] },
  { title: "12 · Objetivos terapêuticos", keys: ["therapeutic_goals","treatment_approach"] },
];
const excluded = new Set([
  "id","professional_id","patient_id","created_at","updated_at","patient_name","patient_age",
  "patient_birth_date","birth_date","patient_responsible","patient_contact","responsible","contact","age",
  "review_status","finalized_at","finalized_by","filled_by_guardian","user_id",
  "photo_url","digital_signature_url","digital_stamp_url",
]);
const referencedKeys = new Set(SECTIONS.flatMap(s => s.keys));
const isRecorded = (value: unknown): boolean =>
  value === true || (typeof value === "number" && Number.isFinite(value)) ||
  (typeof value === "string" && Boolean(value.trim())) ||
  (Array.isArray(value) && value.some(isRecorded)) ||
  (Boolean(value) && typeof value === "object" && Object.values(value as Record<string, unknown>).some(isRecorded));

const format = (value: unknown): string => {
  if (value === true) return "Marcado na anamnese";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(format).filter(Boolean).join("; ");
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, nested]) => isRecorded(nested))
      .map(([key, nested]) => `${clinicalFieldLabel(key)}: ${format(nested)}`).join("\n");
  }
  return "";
};
const tidy = (value: unknown): string => {
  const raw = String(value ?? "").trim();
  return raw.length ? raw : "Não informado";
};
const normalizeFilename = (name: string): string =>
  name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]+/g,"_").slice(0,60) || "Paciente";

export function createAnamnesisNativePdf(
  data: NativeAnamnesisData,
  professional: NativeProfessional,
  patientName: string,
  images: { photo?: string | null; stamp?: string | null; signature?: string | null } = {},
): jsPDF {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const W = 210, H = 297, left = 17, right = 193, textWidth = right-left;
  const green: [number,number,number] = [18,105,74];
  const dark: [number,number,number] = [34,47,40];
  const grey: [number,number,number] = [82,99,90];
  let y = 22;
  let pageNo = 1;
  const header = () => {
    pdf.setDrawColor(...green);
    pdf.setLineWidth(.55);
    pdf.line(left, 13, right, 13);
    if (pageNo > 1) {
      pdf.setTextColor(...green); pdf.setFont("helvetica","bold"); pdf.setFontSize(9);
      pdf.text("MUSETERA  |  ANAMNESE MUSICOTERAPÊUTICA", left, 19);
      y = 26;
    }
  };
  const newPage = () => { pdf.addPage(); pageNo++; y=20; header(); };
  const space = (height: number) => { if (y + height > H - 22) newPage(); };
  const line = (text: string, size=10, color=dark, font: "normal"|"bold"="normal", lineHeight=5.3) => {
    const safe = text.replace(/[\u0000-\u001f]+/g, " ").trim();
    if (!safe) return;
    pdf.setFont("helvetica",font); pdf.setFontSize(size); pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(safe, textWidth) as string[];
    for (const segment of lines) {
      space(lineHeight + 1);
      pdf.text(segment, left, y);
      y += lineHeight;
    }
  };
  const title = (value: string) => {
    space(16);
    y+=4; pdf.setFillColor(235,246,240); pdf.roundedRect(left,y-5,textWidth,10,1.5,1.5,"F");
    pdf.setTextColor(...green); pdf.setFont("helvetica","bold"); pdf.setFontSize(10.5);
    pdf.text(value, left+3, y+1);
    y+=11;
  };
  const field = (label:string,value:string) => {
    const paragraphs=value.split(/\r?\n/).filter(Boolean);
    const lines=paragraphs.flatMap(part => pdf.splitTextToSize(part, textWidth) as string[]);
    const firstHeight = 8 + Math.min(3,lines.length)*5;
    space(firstHeight);
    pdf.setTextColor(...green); pdf.setFont("helvetica","bold"); pdf.setFontSize(9);
    pdf.text(label, left, y); y+=5;
    pdf.setTextColor(...dark); pdf.setFont("helvetica","normal"); pdf.setFontSize(9.5);
    if (!lines.length) { line("Não informado",9.5,grey); }
    else lines.forEach((part,index) => {
      if (y + 5 > H - 22) {
        newPage();
        pdf.setTextColor(...green); pdf.setFont("helvetica","bold"); pdf.setFontSize(8);
        pdf.text(`${label} (continuação)`, left, y); y+=6;
        pdf.setFont("helvetica","normal"); pdf.setFontSize(9.5); pdf.setTextColor(...dark);
      }
      pdf.text(part,left,y); y+=5;
    });
    y+=3;
  };
  header();
  // Foto do perfil profissional é opcional; sua ausência não altera
  // a integridade dos registros clínicos ou das imagens obrigatórias.
  if (images.photo) {
    try {
      const props = pdf.getImageProperties(images.photo);
      const ratio = Math.min(22 / props.width, 22 / props.height);
      pdf.addImage(images.photo, props.fileType, right - 22, 19, props.width * ratio, props.height * ratio);
    } catch {
      // O PDF continua utilizável caso a foto opcional não carregue.
    }
  }
  pdf.setTextColor(...green); pdf.setFont("helvetica","bold"); pdf.setFontSize(11);
  pdf.text("MUSETERA  |  DOCUMENTAÇÃO CLÍNICA",left,y); y+=10;
  pdf.setTextColor(...dark); pdf.setFontSize(18);
  pdf.text("Anamnese musicoterapêutica",left,y); y+=7;
  pdf.setFont("helvetica","normal"); pdf.setFontSize(9); pdf.setTextColor(...grey);
  pdf.text("Registro clínico de informações relatadas e observadas — uso profissional.",left,y); y+=10;
  title("IDENTIFICAÇÃO DO PACIENTE");
  field("Nome do paciente",tidy(data.patient_name || patientName));
  const dob = String(data.patient_birth_date || data.birth_date || "");
  const dobFormat = /^\d{4}-\d{2}-\d{2}/.test(dob) ? dob.slice(8,10)+"/"+dob.slice(5,7)+"/"+dob.slice(0,4) : tidy(dob);
  field("Data de nascimento",dobFormat);
  if (data.patient_age !== undefined && data.patient_age !== null) field("Idade informada",String(data.patient_age)+" anos");
  field("Responsável cadastrado",tidy(data.patient_responsible || data.responsible));
  field("Contato cadastrado",tidy(data.patient_contact || data.contact));
  field("Situação do documento",data.review_status === "finalized" ? "Finalizada" : "Rascunho / não finalizada");

  for (const section of SECTIONS) {
    title(section.title);
    const recorded = section.keys.filter(key => isRecorded(data[key]));
    if (!recorded.length) { line("Nenhuma informação registrada nesta seção.",9,grey); y+=4; continue; }
    for (const key of recorded) field(clinicalFieldLabel(key),format(data[key]));
  }
  const extra = Object.entries(data).filter(([key,value]) =>
    !excluded.has(key) && !referencedKeys.has(key) && !key.startsWith("_") && isRecorded(value));
  if (extra.length) {
    title("INFORMAÇÕES COMPLEMENTARES REGISTRADAS");
    for (const [key,value] of extra) field(clinicalFieldLabel(key),format(value));
  }

  // Keep the complete professional identification and its images together.
  // Starting a new page here is preferable to splitting the signature block.
  space(120);
  title("RESPONSÁVEL PELO DOCUMENTO");
  field("Profissional",tidy(professional.name || professional.email));
  if (professional.specialty) field("Área",professional.specialty);
  if (professional.register || professional.license_number) field("Registro informado",String(professional.register || professional.license_number));
  space(47);
  const addImage = (src: string, x:number,maxW:number,maxH:number) => {
    const props=pdf.getImageProperties(src);
    const scale=Math.min(maxW/props.width,maxH/props.height);
    pdf.addImage(src,props.fileType,x,y,props.width*scale,props.height*scale);
  };
  const imagesTop = y;
  if (images.signature) addImage(images.signature,left,78,28);
  if (images.stamp) addImage(images.stamp,left+96,78,28);
  y=imagesTop+30;
  pdf.setFont("helvetica","normal");pdf.setFontSize(8);pdf.setTextColor(...grey);
  pdf.text("Assinatura cadastrada",left,y);
  pdf.text("Carimbo cadastrado",left+96,y); y+=7;
  line("As imagens são reproduções do cadastro profissional. Este documento não constitui assinatura digital criptográfica certificada.",8,grey, "normal",4);

  const total = pdf.getNumberOfPages();
  for (let i=1;i<=total;i++) {
    pdf.setPage(i); pdf.setDrawColor(205,222,210); pdf.setLineWidth(.25); pdf.line(left,282,right,282);
    pdf.setFont("helvetica","normal");pdf.setTextColor(...grey);pdf.setFontSize(8);
    pdf.text("MuseTera · Anamnese musicoterapêutica · Documento confidencial",left,289);
    pdf.text(`Página ${i} de ${total}`,right,289,{align:"right"});
  }
  pdf.setProperties({
    title: "Anamnese Musicoterapêutica - MuseTera",
    subject: "Documento clínico sigiloso",
    author: professional.name || "MuseTera",
  });
  return pdf;
}

export async function saveAnamnesisNativePdf(
  data: NativeAnamnesisData,
  professional: NativeProfessional,
  patientName: string,
  images: { photo?: string | null; stamp?: string | null; signature?: string | null },
): Promise<boolean> {
  if (!images.signature || !images.stamp) throw new Error("A assinatura e o carimbo cadastrados são obrigatórios para exportar.");
  const pdf=createAnamnesisNativePdf(data,professional,patientName,images);
  const date=new Date();const issue=[date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-");
  await pdf.save(`Anamnese_Musicoterapeutica_${normalizeFilename(patientName)}_${issue}.pdf`,{returnPromise:true});
  return true;
}
