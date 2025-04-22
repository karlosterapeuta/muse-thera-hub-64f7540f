
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

const goalCategories = [
  "Comunicação",
  "Habilidades sociais",
  "Regulação emocional",
  "Habilidades cognitivas",
  "Habilidades motoras",
  "Percepção musical",
  "Expressão musical",
  "Bem-estar",
  "Outro"
];

interface GoalSettingFormProps {
  form: UseFormReturn<any>;
}

export function GoalSettingForm({ form }: GoalSettingFormProps) {
  const { fields: goals, append, remove } = form.control._formValues.goals || [];

  const handleAddGoal = () => {
    append({ description: "", category: "" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Objetivos Terapêuticos</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddGoal}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Objetivo
        </Button>
      </div>

      {goals && goals.length > 0 ? (
        goals.map((field: any, index: number) => (
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
              name={`goals.${index}.category`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {goalCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
              name={`goals.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descreva o objetivo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))
      ) : (
        <div className="text-center py-4 border rounded-md">
          <p className="text-muted-foreground">Nenhum objetivo adicionado</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleAddGoal}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Objetivo
          </Button>
        </div>
      )}
    </div>
  );
}
