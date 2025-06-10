
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
};

interface ReportFormFieldsProps {
  control: Control<FormValues>;
  patients: Patient[];
  isLoadingPatients: boolean;
}

export function ReportFormFields({ control, patients, isLoadingPatients }: ReportFormFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="patient_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Paciente</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingPatients ? "Carregando pacientes..." : "Selecione um paciente"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-patients" disabled>
                    {isLoadingPatients ? "Carregando pacientes..." : "Nenhum paciente encontrado"}
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
            <FormLabel>Data do Relatório</FormLabel>
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
                      format(field.value, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
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
                  locale={ptBR}
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
            <FormLabel>Tipo de Relatório</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="individual_session">
                  Sessão Individual
                </SelectItem>
                <SelectItem value="group_session">
                  Sessão em Grupo
                </SelectItem>
                <SelectItem value="daily_evolution">
                  Evolução Diária
                </SelectItem>
                <SelectItem value="monthly_evolution">
                  Evolução Mensal
                </SelectItem>
                <SelectItem value="semester_evolution">
                  Evolução Semestral
                </SelectItem>
                <SelectItem value="therapeutic_discharge">
                  Alta Terapêutica
                </SelectItem>
                <SelectItem value="technical_report">
                  Relatório Técnico
                </SelectItem>
                <SelectItem value="assessment_report">
                  Relatório Avaliação
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
