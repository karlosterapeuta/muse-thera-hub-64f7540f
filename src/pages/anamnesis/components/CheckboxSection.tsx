
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
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={field.checked}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor={field.id} className="text-sm">
              {field.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
