
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
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        {title}
      </h3>
      
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-3`}>
        {fields.map((field) => (
          <Card 
            key={field.id} 
            className={`p-4 border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
              field.checked 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => field.onChange(!field.checked)}
          >
            <div className="flex items-center space-x-3">
              <Checkbox
                id={field.id}
                checked={field.checked}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label 
                htmlFor={field.id} 
                className="text-sm font-medium cursor-pointer flex-1 leading-5"
              >
                {field.label}
              </Label>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
