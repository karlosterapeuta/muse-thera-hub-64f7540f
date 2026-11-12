import { Input } from "@/components/ui/input";
import { calculateAgeFromBirthDate, formatBirthDateForDisplay } from "@/utils/dateUtils";
import { PatientPhotoAvatar } from "../../components/patients/PatientPhotoAvatar";
import type { RegisteredPatient } from "../utils/patientPrefill";

type Props = {
  patient: RegisteredPatient;
  legalGuardian: string;
  onLegalGuardianChange: (value: string) => void;
};

export function PatientIdentitySummary({ patient, legalGuardian, onLegalGuardianChange }: Props) {
  const age = calculateAgeFromBirthDate(patient.birth_date);
  return (
    <section aria-label="Dados cadastrados do paciente" className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center font-semibold text-primary">
          <PatientPhotoAvatar value={patient.photo_url} name={patient.name} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Identificação carregada do cadastro</p>
          <h2 className="break-words text-lg font-bold text-foreground">{patient.name}</h2>
          <p className="text-xs text-muted-foreground">Confira as informações antes de registrar a anamnese. Dados clínicos não são preenchidos por suposição.</p>
        </div>
      </div>
      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <div><dt className="font-semibold text-foreground">Nascimento</dt><dd className="text-muted-foreground">{patient.birth_date ? formatBirthDateForDisplay(patient.birth_date) : "Não informado"}{age !== null ? ` · ${age} anos` : ""}</dd></div>
        <div><dt className="font-semibold text-foreground">Responsável cadastrado</dt><dd className="break-words text-muted-foreground">{patient.responsible?.trim() || "Não informado"}</dd></div>
        <div><dt className="font-semibold text-foreground">Contato</dt><dd className="break-words text-muted-foreground">{patient.contact?.trim() || "Não informado"}</dd></div>
      </dl>
      <div className="space-y-1.5 border-t border-primary/15 pt-3">
        <label htmlFor="anamnesis-legal-guardian" className="text-sm font-semibold text-foreground">
          Responsável legal informado na anamnese (quando aplicável)
        </label>
        <Input
          id="anamnesis-legal-guardian"
          autoComplete="off"
          className="min-h-11 bg-background"
          value={legalGuardian}
          onChange={event => onLegalGuardianChange(event.target.value)}
          placeholder="Confirme ou informe o responsável legal"
        />
        <p className="text-xs text-muted-foreground">Sugerido a partir do cadastro apenas se este campo estava vazio. Pode ser corrigido sem alterar o cadastro do paciente.</p>
      </div>
    </section>
  );
}
