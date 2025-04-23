
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn, useFieldArray } from "react-hook-form";

interface ReassessmentPlanFormProps {
  form: UseFormReturn<any>;
}

export function ReassessmentPlanForm({ form }: ReassessmentPlanFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "reassessments"
  });

  const reassessmentTypes = [
    "Mensal",
    "Trimestral",
    "Semestral",
    "Anual",
    "Personalizado"
  ];

  const handleAddReassessment = () => {
    append({ type: "", date: "", description: "" });
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

      {fields && fields.length > 0 ? (
        fields.map((field, index) => (
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
              name={`reassessments.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de reavaliação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reassessmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`reassessments.${index}.date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Prevista</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`reassessments.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a metodologia de reavaliação..." 
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
