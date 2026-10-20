import {
  ClipboardList, HeartHandshake, Target, Music, Activity,
  Users, FileCheck2, FileDown, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export type PtiStepId =
  | "identificacao" | "contexto" | "objetivos" | "intervencoes"
  | "acompanhamento" | "familia" | "revisao" | "relatorio";

export interface PtiWizardStep {
  id: PtiStepId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const PTI_WIZARD_STEPS: PtiWizardStep[] = [
  { id: "identificacao", label: "Identificação", description: "Paciente e profissional", icon: ClipboardList },
  { id: "contexto", label: "Contexto clínico", description: "Histórico e avaliação", icon: HeartHandshake },
  { id: "objetivos", label: "Objetivos e metas", description: "Prioridades mensuráveis", icon: Target },
  { id: "intervencoes", label: "Intervenções", description: "Técnicas e recursos", icon: Music },
  { id: "acompanhamento", label: "Acompanhamento", description: "Critérios e reavaliação", icon: Activity },
  { id: "familia", label: "Família e equipe", description: "Rede de apoio", icon: Users },
  { id: "revisao", label: "Revisão técnica", description: "Fundamentação e assinatura", icon: FileCheck2 },
  { id: "relatorio", label: "Relatório", description: "Resumo e PDF", icon: FileDown },
];

interface Props {
  current: PtiStepId;
  onChange: (value: PtiStepId) => void;
  patientName?: string;
  completion: number;
  objectives: number;
  goals: number;
  status: string;
}

export function PtiWizardNavigation({
  current, onChange, patientName, completion, objectives, goals, status,
}: Props) {
  const currentIndex = PTI_WIZARD_STEPS.findIndex((step) => step.id === current);
  return (
    <section className="space-y-4" aria-label="Etapas do Plano Terapêutico Individual">
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 px-5 py-6 text-white shadow-lg sm:px-7">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl" aria-hidden="true" />
        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border border-emerald-300/30 bg-white/10 text-emerald-50 hover:bg-white/10">PTI MuseTera · Novo editor</Badge>
            <span className="rounded-full border border-white/20 px-2.5 py-1 text-xs capitalize text-emerald-100">{status}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Plano Terapêutico Individual</h2>
            <p className="mt-1 max-w-2xl text-sm text-emerald-100/90">
              Do contexto clínico às metas e intervenções musicoterapêuticas, com revisão do profissional.
            </p>
            {patientName && <p className="mt-2 text-sm font-semibold text-white">Paciente: {patientName}</p>}
          </div>
          <div className="grid grid-cols-3 gap-3 border-t border-white/20 pt-4">
            <div><p className="text-xl font-bold">{completion}%</p><p className="text-xs text-emerald-100">Preenchimento</p></div>
            <div><p className="text-xl font-bold">{objectives}</p><p className="text-xs text-emerald-100">Objetivos</p></div>
            <div><p className="text-xl font-bold">{goals}</p><p className="text-xs text-emerald-100">Metas</p></div>
          </div>
          <Progress value={completion} className="h-1.5 bg-white/20" />
          <p className="text-[11px] text-emerald-100/80">O preenchimento indica campos completados; não representa evolução clínica.</p>
        </div>
      </div>
      <nav className="grid grid-cols-2 gap-2 md:grid-cols-4" aria-label="Navegação do PTI">
        {PTI_WIZARD_STEPS.map((step, index) => {
          const selected = current === step.id;
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onChange(step.id)}
              aria-current={selected ? "step" : undefined}
              className={cn(
                "flex min-h-24 flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                selected ? "border-primary bg-primary/15 ring-1 ring-primary/50" : "border-border/70 bg-card hover:border-primary/50 hover:bg-accent/40",
              )}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <Icon className={cn("h-4 w-4", selected ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                <span className="text-[11px] font-bold tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <span className={cn("text-sm font-semibold leading-tight", selected && "text-primary")}>{step.label}</span>
              <span className="text-xs leading-tight text-muted-foreground">{step.description}</span>
            </button>
          );
        })}
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">
          Etapa {currentIndex + 1} de {PTI_WIZARD_STEPS.length}: {PTI_WIZARD_STEPS[currentIndex]?.label}
        </p>
        <span className="text-xs text-muted-foreground">Navegue entre as etapas sem perder o rascunho.</span>
      </div>
    </section>
  );
}
