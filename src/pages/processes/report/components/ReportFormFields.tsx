
import React from "react";
import { useTranslation } from 'react-i18next';
import { format } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Control } from "react-hook-form";
import { FormValues } from "../hooks/useReportForm";

type Patient = {
  id: string;
  name: string;
  birth_date?: string;
  age?: number;
};

interface ReportFormFieldsProps {
  control: Control<FormValues>;
  patients: Patient[];
  isLoadingPatients: boolean;
}

export function ReportFormFields({ control, patients, isLoadingPatients }: ReportFormFieldsProps) {
  const { t, i18n } = useTranslation(['reports', 'common']);

  const getLocale = () => {
    switch (i18n.language) {
      case 'en': return enUS;
      case 'es': return es;
      default: return ptBR;
    }
  };

  const calculateAge = (birthDate: string | null): number | null => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    
    if (isNaN(birthDateObj.getTime())) return null;
    
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatPatientDisplay = (patient: Patient): string => {
    const age = patient.age || calculateAge(patient.birth_date);
    return age !== null && age !== undefined 
      ? t('reports:form.fields.patient.ageFormat', { name: patient.name, age })
      : patient.name;
  };

  return (
    <>
      <FormField
        control={control}
        name="patient_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('reports:form.fields.patient.label')}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingPatients ? t('reports:form.fields.patient.loading') : t('reports:form.fields.patient.placeholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {formatPatientDisplay(patient)}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-patients" disabled>
                    {isLoadingPatients ? t('reports:form.fields.patient.loading') : t('reports:form.fields.patient.empty')}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('reports:form.fields.date.label')}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "P", { locale: getLocale() })
                    ) : (
                      <span>{t('reports:form.fields.date.placeholder')}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  locale={getLocale()}
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  classNames={{
                    caption_label: "hidden",
                    dropdown_month: "w-full",
                    dropdown_year: "w-full",
                    caption: "flex justify-center pt-1",
                    dropdown: "p-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  }}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('reports:form.fields.type.label')}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('reports:form.fields.type.placeholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="individual_session">
                  {t('reports:types.individual_session')}
                </SelectItem>
                <SelectItem value="group_session">
                  {t('reports:types.group_session')}
                </SelectItem>
                <SelectItem value="daily_evolution">
                  {t('reports:types.daily_evolution')}
                </SelectItem>
                <SelectItem value="monthly_evolution">
                  {t('reports:types.monthly_evolution')}
                </SelectItem>
                <SelectItem value="semester_evolution">
                  {t('reports:types.semester_evolution')}
                </SelectItem>
                <SelectItem value="therapeutic_discharge">
                  {t('reports:types.therapeutic_discharge')}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
