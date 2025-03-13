
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function DateField({ label, value, onChange }: DateFieldProps) {
  const date = value ? new Date(value) : undefined;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => onChange(date ? date.toISOString() : "")}
            initialFocus
            locale={ptBR}
            captionLayout="dropdown-buttons"
            fromYear={1900}
            toYear={new Date().getFullYear()}
            classNames={{
              caption_label: "hidden", // Hide the default month/year text
              dropdown_month: "w-full",
              dropdown_year: "w-full",
              caption: "flex justify-center pt-1",
              dropdown: "p-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
