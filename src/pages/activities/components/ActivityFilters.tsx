import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import { ActivityFilter } from '../types';

interface ActivityFiltersProps {
  filters: ActivityFilter;
  onFilterChange: (filters: ActivityFilter) => void;
  categories: Array<{ id: string; label: string; color: string }>;
  availableTags: string[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  filters,
  onFilterChange,
  categories,
  availableTags,
  isExpanded,
  onToggleExpanded
}) => {
  const handleClearFilters = () => {
    onFilterChange({});
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFilterChange({ ...filters, tags: newTags });
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof ActivityFilter] !== undefined && 
    filters[key as keyof ActivityFilter] !== '' &&
    !(Array.isArray(filters[key as keyof ActivityFilter]) && (filters[key as keyof ActivityFilter] as string[]).length === 0)
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onToggleExpanded}>
              {isExpanded ? 'Recolher' : 'Expandir'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Busca por texto */}
        <div>
          <label className="text-sm font-medium mb-2 block">Buscar</label>
          <Input
            placeholder="Digite palavras-chave..."
            value={filters.searchTerm || ''}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Categoria */}
          <div>
            <label className="text-sm font-medium mb-2 block">Categoria</label>
            <Select value={filters.category || ''} onValueChange={(value) => 
              onFilterChange({ ...filters, category: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dificuldade */}
          <div>
            <label className="text-sm font-medium mb-2 block">Dificuldade</label>
            <Select value={filters.difficulty || ''} onValueChange={(value) => 
              onFilterChange({ ...filters, difficulty: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Faixa Etária */}
          {isExpanded && (
            <div>
              <label className="text-sm font-medium mb-2 block">Faixa Etária</label>
              <Select value={filters.ageGroup || ''} onValueChange={(value) => 
                onFilterChange({ ...filters, ageGroup: value })
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as idades</SelectItem>
                  <SelectItem value="3-6">3-6 anos</SelectItem>
                  <SelectItem value="6-12">6-12 anos</SelectItem>
                  <SelectItem value="12-18">12-18 anos</SelectItem>
                  <SelectItem value="adult">Adultos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Duração */}
          {isExpanded && (
            <div>
              <label className="text-sm font-medium mb-2 block">Duração</label>
              <Select value={filters.duration || ''} onValueChange={(value) => 
                onFilterChange({ ...filters, duration: value })
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Qualquer duração</SelectItem>
                  <SelectItem value="short">Curta (até 20 min)</SelectItem>
                  <SelectItem value="medium">Média (20-40 min)</SelectItem>
                  <SelectItem value="long">Longa (40+ min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Tags */}
        {isExpanded && (
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = filters.tags?.includes(tag) || false;
                return (
                  <Badge
                    key={tag}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                    {isSelected && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Resumo dos filtros ativos */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Filtros ativos: {Object.keys(filters).filter(key => 
                filters[key as keyof ActivityFilter] !== undefined && 
                filters[key as keyof ActivityFilter] !== '' &&
                !(Array.isArray(filters[key as keyof ActivityFilter]) && (filters[key as keyof ActivityFilter] as string[]).length === 0)
              ).length}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};