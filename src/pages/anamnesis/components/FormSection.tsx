
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
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 pt-4 border-b-2 border-primary/30 pb-2 mb-4">{title}</h3>
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label 
            htmlFor={field.key}
            className="text-gray-800 dark:text-gray-200 font-semibold text-sm"
          >
            {field.label}
          </Label>
          {field.type === "text" ? (
            <Input
              id={field.key}
              type="text"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          ) : (
            <Textarea
              id={field.key}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[100px]"
            />
          )}
        </div>
      ))}
    </div>
  );
}
