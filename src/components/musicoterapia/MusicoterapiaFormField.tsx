import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ReportField } from '@/data/musicoterapiaTemplate';
import { TherapeuticObjectivesField } from './TherapeuticObjectivesField';
import { SessionActivitiesField } from './SessionActivitiesField';

interface MusicoterapiaFormFieldProps {
  field: ReportField;
  value: any;
  onChange: (value: any) => void;
  onFocus?: () => void;
}

export function MusicoterapiaFormField({
  field,
  value,
  onChange,
  onFocus
}: MusicoterapiaFormFieldProps) {
  const handleMultiselectChange = (option: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (checked) {
      onChange([...currentValues, option]);
    } else {
      onChange(currentValues.filter(v => v !== option));
    }
  };

  const removeMultiselectValue = (option: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    onChange(currentValues.filter(v => v !== option));
  };

  const renderField = () => {
    // Campo especializado para objetivos terapêuticos
    if (field.id === 'therapeutic_objectives') {
      return (
        <TherapeuticObjectivesField
          value={(value as string[]) || []}
          onChange={onChange}
        />
      );
    }

    // Campo especializado para atividades das sessões
    if (field.id === 'session_activities') {
      return (
        <SessionActivitiesField
          value={(value as string[]) || []}
          onChange={onChange}
        />
      );
    }

    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            rows={4}
            className="resize-none"
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger onFocus={onFocus}>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-3">
            {/* Selected values */}
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((option) => (
                  <Badge
                    key={option}
                    variant="secondary"
                    className="text-sm py-1 px-2"
                  >
                    {option}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                      onClick={() => removeMultiselectValue(option)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {field.options?.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.id}-${option}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        handleMultiselectChange(option, checked as boolean)
                      }
                      onFocus={onFocus}
                    />
                    <Label
                      htmlFor={`${field.id}-${option}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'scale':
        const scaleValue = typeof value === 'number' ? [value] : [1];
        return (
          <div className="space-y-4">
            <div className="px-2">
              <Slider
                value={scaleValue}
                onValueChange={([val]) => onChange(val)}
                onFocus={onFocus}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
              <span>1 (Mínimo)</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-lg text-primary">
                  {scaleValue[0]}
                </span>
                <span>/10</span>
              </div>
              <span>10 (Máximo)</span>
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={!!value}
              onCheckedChange={onChange}
              onFocus={onFocus}
            />
            <Label htmlFor={field.id} className="cursor-pointer">
              {field.placeholder || 'Marcar se aplicável'}
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label
          htmlFor={field.id}
          className={`text-sm font-medium ${field.required ? 'after:content-["*"] after:text-destructive after:ml-1' : ''}`}
        >
          {field.label}
        </Label>
        
        {field.description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-80">
                <p className="text-sm">{field.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {renderField()}

      {field.description && field.type === 'textarea' && (
        <p className="text-xs text-muted-foreground">
          {field.description}
        </p>
      )}
    </div>
  );
}