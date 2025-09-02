import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Filter,
  ChevronDown,
  X,
  RotateCcw,
  Save,
  User,
  Clock,
  Target,
  Zap,
  Heart,
  Star,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface FilterOptions {
  ageGroups: string[];
  categories: string[];
  difficulties: string[];
  durations: string[];
  objectives: string[];
  tags: string[];
  preparationTime: [number, number];
  rating: [number, number];
  hasVideo: boolean;
  hasMaterials: boolean;
  isAccessible: boolean;
  isFavorite: boolean;
  isCompleted: boolean;
  isNew: boolean;
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableOptions: {
    ageGroups: Array<{ value: string; label: string; count: number }>;
    categories: Array<{ value: string; label: string; count: number }>;
    difficulties: Array<{ value: string; label: string; count: number }>;
    durations: Array<{ value: string; label: string; count: number }>;
    objectives: Array<{ value: string; label: string; count: number }>;
    tags: Array<{ value: string; label: string; count: number }>;
  };
  onSavePreset: (name: string, filters: FilterOptions) => void;
  savedPresets: Array<{ name: string; filters: FilterOptions }>;
  onLoadPreset: (filters: FilterOptions) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  availableOptions,
  onSavePreset,
  savedPresets,
  onLoadPreset
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['categories']));

  const defaultFilters: FilterOptions = {
    ageGroups: [],
    categories: [],
    difficulties: [],
    durations: [],
    objectives: [],
    tags: [],
    preparationTime: [0, 60],
    rating: [0, 5],
    hasVideo: false,
    hasMaterials: false,
    isAccessible: false,
    isFavorite: false,
    isCompleted: false,
    isNew: false
  };

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleArrayFilter = (key: keyof FilterOptions, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters({ [key]: newArray });
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const clearAllFilters = () => {
    onFiltersChange(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    count += filters.ageGroups.length;
    count += filters.categories.length;
    count += filters.difficulties.length;
    count += filters.durations.length;
    count += filters.objectives.length;
    count += filters.tags.length;
    
    if (filters.preparationTime[0] > 0 || filters.preparationTime[1] < 60) count++;
    if (filters.rating[0] > 0 || filters.rating[1] < 5) count++;
    if (filters.hasVideo) count++;
    if (filters.hasMaterials) count++;
    if (filters.isAccessible) count++;
    if (filters.isFavorite) count++;
    if (filters.isCompleted) count++;
    if (filters.isNew) count++;
    
    return count;
  };

  const renderFilterGroup = (
    title: string,
    icon: React.ReactNode,
    key: keyof FilterOptions,
    options: Array<{ value: string; label: string; count: number }>
  ) => (
    <Collapsible
      open={expandedSections.has(key)}
      onOpenChange={() => toggleSection(key)}
    >
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{title}</span>
            {(filters[key] as string[]).length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {(filters[key] as string[]).length}
              </Badge>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${
            expandedSections.has(key) ? 'rotate-180' : ''
          }`} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-6 pb-3 space-y-2">
          {options.map(option => (
            <label
              key={option.value}
              className="flex items-center justify-between cursor-pointer p-2 hover:bg-muted/30 rounded"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(filters[key] as string[]).includes(option.value)}
                  onChange={() => toggleArrayFilter(key, option.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">{option.label}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {option.count}
              </Badge>
            </label>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
            {getActiveFiltersCount() > 0 && (
              <Badge variant="default" className="text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Limpar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-4">
          {/* Saved Presets */}
          {savedPresets.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Filtros Salvos</Label>
              <div className="flex flex-wrap gap-2">
                {savedPresets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onLoadPreset(preset.filters)}
                    className="text-xs"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
              <Separator className="mt-3" />
            </div>
          )}

          {/* Filter Groups */}
          <div className="space-y-1">
            {renderFilterGroup(
              'Faixa Etária',
              <User className="h-4 w-4" />,
              'ageGroups',
              availableOptions.ageGroups
            )}

            {renderFilterGroup(
              'Categorias',
              <Target className="h-4 w-4" />,
              'categories',
              availableOptions.categories
            )}

            {renderFilterGroup(
              'Dificuldade',
              <Zap className="h-4 w-4" />,
              'difficulties',
              availableOptions.difficulties
            )}

            {renderFilterGroup(
              'Duração',
              <Clock className="h-4 w-4" />,
              'durations',
              availableOptions.durations
            )}

            {renderFilterGroup(
              'Objetivos',
              <Target className="h-4 w-4" />,
              'objectives',
              availableOptions.objectives
            )}

            {renderFilterGroup(
              'Tags',
              <Badge className="h-4 w-4" />,
              'tags',
              availableOptions.tags
            )}
          </div>

          <Separator />

          {/* Range Filters */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Tempo de Preparação: {filters.preparationTime[0]}-{filters.preparationTime[1]} min
              </Label>
              <Slider
                value={filters.preparationTime}
                onValueChange={(value) => updateFilters({ preparationTime: value as [number, number] })}
                max={60}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">
                Avaliação: {filters.rating[0]}-{filters.rating[1]} estrelas
              </Label>
              <Slider
                value={filters.rating}
                onValueChange={(value) => updateFilters({ rating: value as [number, number] })}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>

          <Separator />

          {/* Toggle Filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="has-video" className="text-sm font-medium">
                Possui vídeo demonstrativo
              </Label>
              <Switch
                id="has-video"
                checked={filters.hasVideo}
                onCheckedChange={(checked) => updateFilters({ hasVideo: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="has-materials" className="text-sm font-medium">
                Inclui lista de materiais
              </Label>
              <Switch
                id="has-materials"
                checked={filters.hasMaterials}
                onCheckedChange={(checked) => updateFilters({ hasMaterials: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is-accessible" className="text-sm font-medium">
                Adaptada para acessibilidade
              </Label>
              <Switch
                id="is-accessible"
                checked={filters.isAccessible}
                onCheckedChange={(checked) => updateFilters({ isAccessible: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="is-favorite" className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Apenas favoritas
              </Label>
              <Switch
                id="is-favorite"
                checked={filters.isFavorite}
                onCheckedChange={(checked) => updateFilters({ isFavorite: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is-completed" className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Apenas concluídas
              </Label>
              <Switch
                id="is-completed"
                checked={filters.isCompleted}
                onCheckedChange={(checked) => updateFilters({ isCompleted: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is-new" className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Apenas novidades
              </Label>
              <Switch
                id="is-new"
                checked={filters.isNew}
                onCheckedChange={(checked) => updateFilters({ isNew: checked })}
              />
            </div>
          </div>

          {/* Save Preset */}
          {getActiveFiltersCount() > 0 && (
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  const name = prompt('Nome para este conjunto de filtros:');
                  if (name) {
                    onSavePreset(name, filters);
                  }
                }}
                className="w-full gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar Filtros Atuais
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};