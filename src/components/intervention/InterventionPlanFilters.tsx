import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export interface FilterOptions {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface InterventionPlanFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
}

export function InterventionPlanFilters({ filters, onFilterChange, onClearFilters }: InterventionPlanFiltersProps) {
  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.sortBy !== 'date';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome do paciente..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange({ status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="completed">Concluídos</SelectItem>
            <SelectItem value="draft">Rascunhos</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By */}
        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-');
            onFilterChange({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Mais Recente</SelectItem>
            <SelectItem value="date-asc">Mais Antigo</SelectItem>
            <SelectItem value="patient-asc">Nome (A-Z)</SelectItem>
            <SelectItem value="patient-desc">Nome (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}
