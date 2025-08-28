import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type ScaleFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
};

export function ScaleField({ 
  label, 
  value, 
  onChange, 
  min = 1, 
  max = 10, 
  step = 1,
  description 
}: ScaleFieldProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Label>
        <span className="text-lg font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
          {value}
        </span>
      </div>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {description}
        </p>
      )}
      <div className="px-3">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          max={max}
          min={min}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Baixo ({min})</span>
          <span>Alto ({max})</span>
        </div>
      </div>
    </div>
  );
}