import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

export interface VagasFilterState {
  search: string;
  uf: string;
  modalidade: string;
  contrato: string;
  area: string;
}

export const EMPTY_FILTERS: VagasFilterState = {
  search: "",
  uf: "all",
  modalidade: "all",
  contrato: "all",
  area: "all",
};

const UF_LIST = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
];

const MODALIDADES = ["Remoto", "Híbrido", "Presencial"];
const CONTRATOS = ["CLT", "PJ", "Autônomo", "Estágio", "Concurso"];
const AREAS = ["TEA", "Hospitalar", "Escolar", "Clínica", "Reabilitação", "Saúde Mental"];

interface Props {
  filters: VagasFilterState;
  onChange: (next: VagasFilterState) => void;
  availableUfs: string[];
}

export function VagasFilters({ filters, onChange, availableUfs }: Props) {
  const set = (key: keyof VagasFilterState, value: string) =>
    onChange({ ...filters, [key]: value });

  const hasActive =
    filters.search ||
    filters.uf !== "all" ||
    filters.modalidade !== "all" ||
    filters.contrato !== "all" ||
    filters.area !== "all";

  const ufs = UF_LIST.filter((uf) => availableUfs.includes(uf));

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Buscar por cargo, empresa, palavra-chave..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={filters.uf} onValueChange={(v) => set("uf", v)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estados</SelectItem>
            {ufs.map((uf) => (
              <SelectItem key={uf} value={uf}>
                {uf}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.modalidade} onValueChange={(v) => set("modalidade", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toda modalidade</SelectItem>
            {MODALIDADES.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.contrato} onValueChange={(v) => set("contrato", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Contratação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toda contratação</SelectItem>
            {CONTRATOS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.area} onValueChange={(v) => set("area", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toda área</SelectItem>
            {AREAS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActive && (
          <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
            <X className="h-4 w-4" /> Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
