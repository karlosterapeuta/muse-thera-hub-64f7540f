import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { ReportData } from '@/data/musicoterapiaTemplate';

interface BasicInformationSectionProps {
  reportData: Partial<ReportData>;
  onUpdateData: (updates: Partial<ReportData>) => void;
}

export function BasicInformationSection({ reportData, onUpdateData }: BasicInformationSectionProps) {
  const handleFieldChange = (field: string, value: string) => {
    if (field.startsWith('fieldValues.')) {
      const fieldId = field.replace('fieldValues.', '');
      onUpdateData({
        fieldValues: {
          ...reportData.fieldValues,
          [fieldId]: value
        }
      });
    } else {
      onUpdateData({ [field]: value });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onUpdateData({ sessionDate: date.toISOString() });
    }
  };

  const sessionDate = reportData.sessionDate ? new Date(reportData.sessionDate) : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Informações Básicas</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Dados fundamentais do paciente e da sessão
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome do Paciente */}
        <div className="space-y-2">
          <Label htmlFor="patient_name" className="text-sm font-medium">
            Nome do Paciente <span className="text-destructive">*</span>
          </Label>
          <Input
            id="patient_name"
            placeholder="Nome completo do paciente"
            value={reportData.patientName || ''}
            onChange={(e) => handleFieldChange('patientName', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Idade */}
        <div className="space-y-2">
          <Label htmlFor="patient_age" className="text-sm font-medium">
            Idade
          </Label>
          <Input
            id="patient_age"
            placeholder="Idade do paciente"
            value={reportData.patientAge || ''}
            onChange={(e) => handleFieldChange('patientAge', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Diagnóstico */}
        <div className="space-y-2">
          <Label htmlFor="patient_diagnosis" className="text-sm font-medium">
            Diagnóstico
          </Label>
          <Input
            id="patient_diagnosis"
            placeholder="Diagnóstico principal"
            value={reportData.patientDiagnosis || ''}
            onChange={(e) => handleFieldChange('patientDiagnosis', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Data da Sessão */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Data da Sessão
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !sessionDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {sessionDate ? (
                  format(sessionDate, "dd/MM/yyyy", { locale: ptBR })
                ) : (
                  "28/07/2025"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={sessionDate}
                onSelect={handleDateChange}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Nome do Profissional */}
        <div className="space-y-2">
          <Label htmlFor="professional_name" className="text-sm font-medium">
            Nome do Profissional <span className="text-destructive">*</span>
          </Label>
          <Input
            id="professional_name"
            placeholder="Seu nome completo"
            value={reportData.professionalName || ''}
            onChange={(e) => handleFieldChange('professionalName', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Registro Profissional */}
        <div className="space-y-2">
          <Label htmlFor="professional_registry" className="text-sm font-medium">
            Registro Profissional
          </Label>
          <Input
            id="professional_registry"
            placeholder="CRP, CRFa, CREFITO, etc."
            value={reportData.professionalRegistry || ''}
            onChange={(e) => handleFieldChange('professionalRegistry', e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}