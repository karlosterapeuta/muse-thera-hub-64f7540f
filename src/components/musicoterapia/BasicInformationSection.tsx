import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, CalendarIcon, User, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { ReportData } from '@/data/musicoterapiaTemplate';
import { formatAgeString } from '@/utils/dateUtils';

type Patient = {
  id: string;
  name: string;
  birth_date?: string;
  age?: number;
};

interface BasicInformationSectionProps {
  reportData: Partial<ReportData>;
  onUpdateData: (updates: Partial<ReportData>) => void;
  professionalData?: any;
  patients?: Patient[];
  isLoadingPatients?: boolean;
}

export function BasicInformationSection({ reportData, onUpdateData, professionalData, patients = [], isLoadingPatients = false }: BasicInformationSectionProps) {
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

  const handlePatientSelect = (value: string) => {
    if (value === 'manual') {
      // Reset para entrada manual
      onUpdateData({
        selectedPatientId: '',
        patientName: '',
        patientAge: '',
        patientDiagnosis: ''
      });
    } else {
      // Selecionar paciente existente
      const selectedPatient = patients.find(p => p.id === value);
      if (selectedPatient) {
        // Calcular idade usando utilitário centralizado
        const age = formatAgeString(selectedPatient.birth_date, selectedPatient.age);

        onUpdateData({
          selectedPatientId: value,
          patientName: selectedPatient.name,
          patientAge: age,
          patientDiagnosis: 'TEA - Transtorno do Espectro Autista'
        });
      }
    }
  };

  const sessionDate = reportData.sessionDate ? new Date(reportData.sessionDate) : undefined;
  const hasPatients = Array.isArray(patients) && patients.length > 0;

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
        {/* Seleção do Paciente */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Paciente <span className="text-destructive">*</span></span>
          </Label>
          <Select 
            value={reportData.selectedPatientId || 'manual'} 
            onValueChange={handlePatientSelect}
            disabled={isLoadingPatients}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                isLoadingPatients 
                  ? "Carregando pacientes..." 
                  : hasPatients 
                    ? "Selecione um paciente" 
                    : "Nenhum paciente encontrado"
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">
                📝 Novo paciente (entrada manual)
              </SelectItem>
              {hasPatients && patients.map(patient => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nome do Paciente */}
        <div className="space-y-2">
          <Label htmlFor="patient_name" className="text-sm font-medium">
            Nome do Paciente <span className="text-destructive">*</span>
            {reportData.selectedPatientId && reportData.selectedPatientId !== 'manual' && (
              <span className="text-xs text-muted-foreground ml-2">(Preenchido automaticamente)</span>
            )}
          </Label>
          <Input
            id="patient_name"
            placeholder="Nome completo do paciente"
            value={reportData.patientName || ''}
            onChange={(e) => handleFieldChange('patientName', e.target.value)}
            className="w-full"
            readOnly={reportData.selectedPatientId && reportData.selectedPatientId !== 'manual'}
          />
        </div>

        {/* Idade */}
        <div className="space-y-2">
          <Label htmlFor="patient_age" className="text-sm font-medium">
            Idade
            {reportData.selectedPatientId && reportData.selectedPatientId !== 'manual' && (
              <span className="text-xs text-muted-foreground ml-2">(Calculada automaticamente)</span>
            )}
          </Label>
          <Input
            id="patient_age"
            placeholder="Idade do paciente"
            value={reportData.patientAge || ''}
            onChange={(e) => handleFieldChange('patientAge', e.target.value)}
            className="w-full"
            readOnly={reportData.selectedPatientId && reportData.selectedPatientId !== 'manual'}
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
            Data do Relatório
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
            <span className="text-xs text-muted-foreground ml-2">(Dados do perfil)</span>
          </Label>
          <Input
            id="professional_name"
            value={reportData.professionalName || professionalData?.name || ''}
            readOnly
            className="w-full bg-muted/50 text-muted-foreground cursor-not-allowed"
          />
        </div>

        {/* Registro Profissional */}
        <div className="space-y-2">
          <Label htmlFor="professional_registry" className="text-sm font-medium">
            Registro Profissional
            <span className="text-xs text-muted-foreground ml-2">(Dados do perfil)</span>
          </Label>
          <Input
            id="professional_registry"
            value={reportData.professionalRegistry || professionalData?.register || professionalData?.license_number || ''}
            readOnly
            className="w-full bg-muted/50 text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      {/* O motivo do encaminhamento integra a identificação, sem etapa adicional. */}
      <section aria-labelledby="referral-heading" className="rounded-xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.04] p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3">
          <ClipboardList className="h-5 w-5 text-[#c9a84c] shrink-0 mt-0.5" />
          <div>
            <h3 id="referral-heading" className="font-semibold text-foreground">Motivo do Encaminhamento</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Informe a origem e o motivo do acompanhamento musicoterapêutico, quando disponíveis.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="referral_source" className="text-sm font-medium">
            Quem encaminhou o paciente? <span className="text-xs text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="referral_source"
            placeholder="Ex.: Neuropediatra, escola, família ou equipe interdisciplinar"
            value={String(reportData.fieldValues?.referral_source ?? '')}
            onChange={(event) => handleFieldChange('fieldValues.referral_source', event.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="referral_reason" className="text-sm font-medium">
            Motivo do encaminhamento <span className="text-xs text-muted-foreground">(opcional)</span>
          </Label>
          <Textarea
            id="referral_reason"
            rows={3}
            placeholder="Ex.: Necessidade de estimular comunicação, atenção e interação social por meio de atividades musicais."
            value={String(reportData.fieldValues?.referral_reason ?? '')}
            onChange={(event) => handleFieldChange('fieldValues.referral_reason', event.target.value)}
            className="w-full resize-y"
          />
        </div>
      </section>
    </div>
  );
}