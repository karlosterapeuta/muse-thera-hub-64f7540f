import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { EvolutionReportField } from "@/data/evolutionMuseteraTemplate";

interface EvolutionFormFieldProps {
  field: EvolutionReportField;
  control: any;
  value: any;
  onChange: (value: any) => void;
}

export function EvolutionFormField({ field, control, value, onChange }: EvolutionFormFieldProps) {
  const handleMultiSelectChange = (option: string, checked: boolean) => {
    const currentValue = Array.isArray(value) ? value : [];
    if (checked) {
      onChange([...currentValue, option]);
    } else {
      onChange(currentValue.filter((item: string) => item !== option));
    }
  };

  if (field.type === "multiselect" && field.options) {
    return (
      <Card>
        <CardContent className="pt-4">
          <FormLabel className="text-base font-medium text-foreground mb-4 block">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          
          <div className="space-y-3">
            {field.options.map((option) => (
              <div key={option} className="flex items-center space-x-3">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={Array.isArray(value) && value.includes(option)}
                  onCheckedChange={(checked) => 
                    handleMultiSelectChange(option, checked as boolean)
                  }
                />
                <label
                  htmlFor={`${field.id}-${option}`}
                  className="text-sm text-muted-foreground cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
          
          {field.required && (!value || (Array.isArray(value) && value.length === 0)) && (
            <p className="text-sm text-destructive mt-2">Este campo é obrigatório</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (field.type === "textarea") {
    return (
      <FormField
        control={control}
        name={field.id}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <Textarea
                {...formField}
                placeholder={field.placeholder}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-[100px] resize-y"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={control}
      name={field.id}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              {...formField}
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}