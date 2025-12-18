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
  error?: string;
  hasError?: boolean;
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
  error,
  hasError = false,
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

  const showError = hasError || !!error;

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
            "hover:border-primary/50",
            "outline-none",
            showError 
              ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20 animate-shake" 
              : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
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
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-destructive"></span>
          {error}
        </p>
      )}
      {hint && !error && (
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
