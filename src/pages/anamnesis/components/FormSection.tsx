
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type FormSectionProps = {
  title: string;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: "text";
  }[];
};

export function FormSection({ title, fields }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground pt-4">{title}</h3>
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key}>{field.label}</Label>
          {field.type === "text" ? (
            <Input
              id={field.key}
              type="text"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
            />
          ) : (
            <Textarea
              id={field.key}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}
    </div>
  );
}
