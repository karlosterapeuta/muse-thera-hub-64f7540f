
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ModernTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "textarea";
  required?: boolean;
  className?: string;
}

export function ModernTextField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "textarea",
  required = false,
  className = ""
}: ModernTextFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      {type === "textarea" ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px] resize-y bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
        />
      ) : (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
        />
      )}
      
      {value.length > 0 && (
        <div className="text-xs text-muted-foreground flex justify-end">
          {value.length} caracteres
        </div>
      )}
    </div>
  );
}
