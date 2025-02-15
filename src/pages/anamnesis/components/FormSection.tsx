
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormSectionProps = {
  title: string;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
  }[];
};

export function FormSection({ title, fields }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold pt-4">{title}</h3>
      {fields.map((field) => (
        <div key={field.key}>
          <Label>{field.label}</Label>
          <Textarea
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={field.placeholder}
          />
        </div>
      ))}
    </div>
  );
}
