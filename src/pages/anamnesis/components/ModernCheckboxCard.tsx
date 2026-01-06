import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernCheckboxCardProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: LucideIcon;
  description?: string;
}

export function ModernCheckboxCard({
  id,
  label,
  checked,
  onChange,
  icon: Icon,
  description,
}: ModernCheckboxCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange(!checked);
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        "group relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
        "hover:shadow-md hover:border-primary/50 hover:bg-accent/30",
        checked
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card"
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onChange(value as boolean)}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "mt-0.5 h-5 w-5 rounded-md transition-all",
          "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        )}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              className={cn(
                "w-4 h-4 flex-shrink-0 transition-colors",
                checked ? "text-primary" : "text-muted-foreground"
              )}
            />
          )}
          <Label
            htmlFor={id}
            className={cn(
              "font-medium cursor-pointer text-sm transition-colors",
              checked ? "text-primary" : "text-foreground"
            )}
          >
            {label}
          </Label>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {checked && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}
    </label>
  );
}

interface ModernCheckboxGridProps {
  title: string;
  fields: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon?: LucideIcon;
    description?: string;
  }[];
  columns?: 2 | 3;
}

export function ModernCheckboxGrid({ title, fields, columns = 3 }: ModernCheckboxGridProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        {title}
      </h4>
      <div
        className={cn(
          "grid gap-3",
          columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {fields.map((field) => (
          <ModernCheckboxCard key={field.id} {...field} />
        ))}
      </div>
    </div>
  );
}
