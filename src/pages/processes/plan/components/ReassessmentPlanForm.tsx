
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";

interface ReassessmentPlanFormProps {
  form: UseFormReturn<any>;
}

export function ReassessmentPlanForm({ form }: ReassessmentPlanFormProps) {
  const { fields: reassessments, append, remove } = form.control._formValues.reassessments || [];

  const handleAddReassessment = () => {
    append({ date: new Date(), methods: "" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Plano de Reavaliação</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddReassessment}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Reavaliação
        </Button>
      </div>

      {reassessments && reassessments.length > 0 ? (
        reassessments.map((field: any, index: number) => (
          <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => remove(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
            
            <FormField
              control={form.control}
              name={`reassessments.${index}.date`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data Prevista</FormLabel>
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
                        fromYear={new Date().getFullYear()}
                        toYear={new Date().getFullYear() + 5}
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
              control={form.control}
              name={`reassessments.${index}.methods`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Métodos de Reavaliação</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva os métodos de reavaliação..." 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))
      ) : (
        <div className="text-center py-4 border rounded-md">
          <p className="text-muted-foreground">Nenhuma reavaliação adicionada</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleAddReassessment}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Reavaliação
          </Button>
        </div>
      )}
    </div>
  );
}
