
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface InterventionPlanFormProps {
  form: UseFormReturn<any>;
}

export function InterventionPlanForm({ form }: InterventionPlanFormProps) {
  const { fields: interventions, append, remove } = form.control._formValues.interventions || [];

  const handleAddIntervention = () => {
    append({ description: "", justification: "" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Plano de Intervenção</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddIntervention}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Intervenção
        </Button>
      </div>

      {interventions && interventions.length > 0 ? (
        interventions.map((field: any, index: number) => (
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
              name={`interventions.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descreva a intervenção..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`interventions.${index}.justification`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Justificativa</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Justifique a intervenção..." 
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
          <p className="text-muted-foreground">Nenhuma intervenção adicionada</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleAddIntervention}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Intervenção
          </Button>
        </div>
      )}
    </div>
  );
}
