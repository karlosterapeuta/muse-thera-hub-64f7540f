
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type CheckboxSectionProps = {
  title: string;
  fields: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }[];
};

export function CheckboxSection({ title, fields }: CheckboxSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 border-b-2 border-primary/30 pb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => (
          <div key={field.id} className="flex items-center space-x-2 p-3 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-primary/50 transition-colors">
            <Checkbox
              id={field.id}
              checked={field.checked}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label 
              htmlFor={field.id} 
              className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              {field.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
