import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const destinations = [
  ["Avaliação", "/evaluation"],
  ["Plano terapêutico (PTI)", "/pti"],
  ["Intervenção", "/intervention"],
];

export function PatientCareMenu({ patient }: { patient: { id: string; name: string } }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="min-h-11" aria-label={`Continuar atendimento de ${patient.name}`}>
          Continuar atendimento <ChevronDown aria-hidden="true" className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {destinations.map(([label, path]) => (
          <DropdownMenuItem key={path} asChild>
            <Link className="min-h-11" to={`${path}?patient_id=${encodeURIComponent(patient.id)}`}>{label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
