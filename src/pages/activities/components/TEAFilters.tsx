import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X, Filter } from 'lucide-react';
import { supportLevels, teaCategories } from '../data/tea-specific-activities';

interface TEAFilters {
  supportLevels: number[];
  communicationStyle: string[];
  auditoryIntensity: string[];
  visualStimuli: string[];
  movementRequired: string[];
  attentionSpan: [number, number];
  predictabilityLevel: string[];
  hasTactileElements: boolean | null;
  teaCategories: string[];
  sensoryFriendly: boolean;
}

interface TEAFiltersProps {
  filters: TEAFilters;
  onFilterChange: (filters: TEAFilters) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  className?: string;
}

export function TEAFilters({ 
  filters, 
  onFilterChange, 
  isExpanded, 
  onToggleExpanded,
  className 
}: TEAFiltersProps) {
  const updateFilter = (key: keyof TEAFilters, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = (key: keyof TEAFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const toggleNumberArrayFilter = (key: keyof TEAFilters, value: number) => {
    const currentArray = filters[key] as number[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFilterChange({
      supportLevels: [],
      communicationStyle: [],
      auditoryIntensity: [],
      visualStimuli: [],
      movementRequired: [],
      attentionSpan: [5, 60],
      predictabilityLevel: [],
      hasTactileElements: null,
      teaCategories: [],
      sensoryFriendly: false
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.supportLevels.length > 0) count++;
    if (filters.communicationStyle.length > 0) count++;
    if (filters.auditoryIntensity.length > 0) count++;
    if (filters.visualStimuli.length > 0) count++;
    if (filters.movementRequired.length > 0) count++;
    if (filters.predictabilityLevel.length > 0) count++;
    if (filters.hasTactileElements !== null) count++;
    if (filters.teaCategories.length > 0) count++;
    if (filters.sensoryFriendly) count++;
    if (filters.attentionSpan[0] > 5 || filters.attentionSpan[1] < 60) count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Filtros TEA</CardTitle>
            {activeCount > 0 && (
              <Badge variant="secondary">{activeCount} ativo{activeCount !== 1 ? 's' : ''}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpanded}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Níveis de Suporte */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Nível de Suporte</Label>
          <div className="flex flex-wrap gap-2">
            {supportLevels.map(level => (
              <Badge
                key={level.level}
                variant={filters.supportLevels.includes(level.level) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleNumberArrayFilter('supportLevels', level.level)}
              >
                Nível {level.level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Categorias TEA */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Áreas TEA</Label>
          <div className="flex flex-wrap gap-2">
            {teaCategories.map(category => (
              <Badge
                key={category.id}
                variant={filters.teaCategories.includes(category.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleArrayFilter('teaCategories', category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {isExpanded && (
          <>
            <Separator />
            
            {/* Comunicação */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Estilo de Comunicação</Label>
              <div className="flex flex-wrap gap-2">
                {['verbal', 'non-verbal', 'mixed'].map(style => (
                  <Badge
                    key={style}
                    variant={filters.communicationStyle.includes(style) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleArrayFilter('communicationStyle', style)}
                  >
                    {style === 'verbal' ? 'Verbal' : 
                     style === 'non-verbal' ? 'Não-verbal' : 'Misto'}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Perfil Sensorial */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Perfil Sensorial</Label>
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Intensidade Auditiva</Label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map(intensity => (
                    <Badge
                      key={intensity}
                      variant={filters.auditoryIntensity.includes(intensity) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleArrayFilter('auditoryIntensity', intensity)}
                    >
                      {intensity === 'low' ? 'Baixa' : 
                       intensity === 'medium' ? 'Média' : 'Alta'}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Estímulos Visuais</Label>
                <div className="flex gap-2">
                  {['minimal', 'moderate', 'rich'].map(visual => (
                    <Badge
                      key={visual}
                      variant={filters.visualStimuli.includes(visual) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleArrayFilter('visualStimuli', visual)}
                    >
                      {visual === 'minimal' ? 'Mínimo' : 
                       visual === 'moderate' ? 'Moderado' : 'Rico'}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Movimento Necessário</Label>
                <div className="flex gap-2">
                  {['none', 'minimal', 'moderate', 'high'].map(movement => (
                    <Badge
                      key={movement}
                      variant={filters.movementRequired.includes(movement) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleArrayFilter('movementRequired', movement)}
                    >
                      {movement === 'none' ? 'Nenhum' : 
                       movement === 'minimal' ? 'Mínimo' : 
                       movement === 'moderate' ? 'Moderado' : 'Alto'}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Tempo de Atenção */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Tempo de Atenção: {filters.attentionSpan[0]}-{filters.attentionSpan[1]} min
              </Label>
              <Slider
                value={filters.attentionSpan}
                onValueChange={(value) => updateFilter('attentionSpan', value as [number, number])}
                max={60}
                min={5}
                step={5}
                className="w-full"
              />
            </div>

            {/* Previsibilidade */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nível de Estrutura</Label>
              <div className="flex gap-2">
                {['high', 'medium', 'low'].map(level => (
                  <Badge
                    key={level}
                    variant={filters.predictabilityLevel.includes(level) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleArrayFilter('predictabilityLevel', level)}
                  >
                    {level === 'high' ? 'Alta' : 
                     level === 'medium' ? 'Média' : 'Baixa'}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Elementos Táteis */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Elementos Táteis</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={filters.hasTactileElements === true}
                    onCheckedChange={(checked) => 
                      updateFilter('hasTactileElements', checked ? true : null)
                    }
                  />
                  <Label className="text-xs">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={filters.hasTactileElements === false}
                    onCheckedChange={(checked) => 
                      updateFilter('hasTactileElements', checked ? false : null)
                    }
                  />
                  <Label className="text-xs">Não</Label>
                </div>
              </div>
            </div>

            {/* Amigável Sensorialmente */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Apenas Atividades Amigáveis Sensorialmente</Label>
              <Switch
                checked={filters.sensoryFriendly}
                onCheckedChange={(checked) => updateFilter('sensoryFriendly', checked)}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}