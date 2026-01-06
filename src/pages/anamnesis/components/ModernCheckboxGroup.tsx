
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface CheckboxField {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface ModernCheckboxGroupProps {
  title: string;
  fields: CheckboxField[];
  columns?: number;
}

export function ModernCheckboxGroup({ 
  title, 
  fields, 
  columns = 3 
}: ModernCheckboxGroupProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        {title}
      </h3>
      
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-3`}>
        {fields.map((field) => (
          <label
            key={field.id}
            htmlFor={field.id}
            className={`p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer flex items-center space-x-3 ${
              field.checked 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border hover:border-muted-foreground bg-card'
            }`}
          >
            <Checkbox
              id={field.id}
              checked={field.checked}
              onCheckedChange={(value) => field.onChange(value as boolean)}
              onClick={(e) => e.stopPropagation()}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-sm font-medium flex-1 leading-5">
              {field.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
