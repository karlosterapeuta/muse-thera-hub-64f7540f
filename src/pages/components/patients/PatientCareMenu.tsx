import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export function PatientCareMenu({ patient }: { patient: { id: string; name: string } }) {
  const id = encodeURIComponent(patient.id);
  const destinations = [
    { label: "Ficha e histórico clínico", path: '/patient-history?patient_id=' + id },
    { label: "Anamnese", path: '/anamnesis?patient_id=' + id },
    { label: "Avaliação MuseTera", path: '/evaluation?patient_id=' + id },
    { label: "Evolução do paciente", path: '/evaluation/paciente/' + id },
    { label: "Plano Terapêutico (PTI)", path: '/pti?patient_id=' + id },
    { label: "Intervenção", path: '/intervention?patient_id=' + id },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="min-h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90" aria-label={"Continuar atendimento de " + patient.name}>
          Continuar atendimento <ChevronDown aria-hidden="true" className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[240px]">
        {destinations.map(({ label, path }, index) => (
          <div key={path}>
            {index === 1 && <DropdownMenuSeparator />}
            <DropdownMenuItem asChild>
              <Link className="min-h-11 text-sm" to={path}>{label}</Link>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
