
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
  // Validate date - only create Date object if value is valid
  let date: Date | undefined = undefined;
  if (value && value.trim()) {
    const tempDate = new Date(value + 'T12:00:00');
    // Check if date is valid (not NaN)
    if (!isNaN(tempDate.getTime())) {
      date = tempDate;
    }
  }

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
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
            {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white shadow-md border border-gray-100 rounded-lg" align="start" side="bottom" sideOffset={4} avoidCollisions={true}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => onChange(date ? date.toISOString().split('T')[0] : "")}
            initialFocus
            locale={ptBR}
            captionLayout="dropdown-buttons"
            fromYear={1900}
            toYear={new Date().getFullYear()}
            formatters={{
              formatMonthCaption: (date) => format(date, "MMMM yyyy", { locale: ptBR }),
            }}
            classNames={{
              caption_label: "hidden", // Hide the default month/year text
              dropdown_month: "w-full",
              dropdown_year: "w-full",
              caption: "flex justify-center pt-1",
              dropdown: "p-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 transition-opacity"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] uppercase",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                "h-9 w-9 p-0 font-normal text-gray-700 aria-selected:opacity-100 hover:bg-gray-100 transition-colors"
              ),
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground border border-gray-200",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-gray-400 opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
              root: "bg-white",
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
