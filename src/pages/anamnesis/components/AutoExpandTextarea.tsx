import { useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AutoExpandTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  required?: boolean;
  minRows?: number;
  maxRows?: number;
  hint?: string;
}

export function AutoExpandTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  minRows = 3,
  maxRows = 10,
  hint,
}: AutoExpandTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate new height
    textarea.style.height = "auto";
    
    const lineHeight = 24; // approximate line height in pixels
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;
    
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [value, minRows, maxRows]);

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium text-foreground flex items-center gap-2"
      >
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 resize-none",
            "bg-card text-foreground placeholder:text-muted-foreground",
            "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
            "hover:border-primary/50",
            "outline-none"
          )}
          style={{
            minHeight: `${24 * minRows}px`,
            maxHeight: `${24 * maxRows}px`,
          }}
        />
        {value && value.length > 0 && (
          <div className="absolute bottom-2 right-3">
            <span className="text-xs text-muted-foreground">
              {value.length} caracteres
            </span>
          </div>
        )}
      </div>
      {hint && (
        <p className="text-xs text-muted-foreground italic">{hint}</p>
      )}
    </div>
  );
}

interface ModernTextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  required?: boolean;
  type?: "text" | "email" | "tel";
}

export function ModernTextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  type = "text",
}: ModernTextInputProps) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium text-foreground flex items-center gap-2"
      >
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3 rounded-xl border-2 transition-all duration-300",
          "bg-card text-foreground placeholder:text-muted-foreground",
          "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
          "hover:border-primary/50",
          "outline-none"
        )}
      />
    </div>
  );
}
