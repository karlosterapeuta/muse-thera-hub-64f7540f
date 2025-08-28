
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium text-gray-700">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200">
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent className="max-h-60 z-[9999] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="py-3 cursor-pointer hover:bg-primary/5 text-gray-900 dark:text-gray-100"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
