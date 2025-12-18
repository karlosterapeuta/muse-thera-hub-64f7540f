import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Percent, User, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommissionSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const PRESET_VALUES = [10, 20, 30, 50, 70];

export function CommissionSelector({ value, onChange }: CommissionSelectorProps) {
  const isPreset = PRESET_VALUES.includes(value);
  const creatorAmount = value;
  const platformAmount = 100 - value;

  const getCommissionColor = (percentage: number) => {
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-1">
        <Percent className="h-3 w-3" /> Comissão do Criador
      </Label>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {PRESET_VALUES.map((preset) => (
          <Button
            key={preset}
            type="button"
            variant={value === preset ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(preset)}
            className="min-w-[50px]"
          >
            {preset}%
          </Button>
        ))}
        <Button
          type="button"
          variant={!isPreset ? "default" : "outline"}
          size="sm"
          onClick={() => {}}
          className="min-w-[100px]"
        >
          Personalizado
        </Button>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span className={cn("font-medium", getCommissionColor(value))}>
            {value}%
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Direct Input */}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            const newValue = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
            onChange(newValue);
          }}
          className="w-24"
        />
        <span className="text-sm text-muted-foreground">%</span>
      </div>

      {/* Preview Calculation */}
      <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          📊 Simulação para curso de R$ 100,00
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 border border-green-500/20">
            <User className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Criador recebe</p>
              <p className={cn("font-bold", getCommissionColor(creatorAmount))}>
                R$ {creatorAmount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">({creatorAmount}%)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
            <Building className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Plataforma recebe</p>
              <p className="font-bold text-blue-600">
                R$ {platformAmount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">({platformAmount}%)</p>
            </div>
          </div>
        </div>

        {/* Visual Bar */}
        <div className="h-3 rounded-full overflow-hidden bg-muted flex">
          <div 
            className="bg-green-500 transition-all duration-300" 
            style={{ width: `${creatorAmount}%` }}
          />
          <div 
            className="bg-blue-500 transition-all duration-300" 
            style={{ width: `${platformAmount}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="text-green-600">Criador: {creatorAmount}%</span>
          <span className="text-blue-600">Plataforma: {platformAmount}%</span>
        </div>
      </div>
    </div>
  );
}

export function getCommissionBadgeVariant(percentage: number): {
  className: string;
  label: string;
} {
  if (percentage >= 70) {
    return {
      className: "bg-green-500/20 text-green-700 border-green-500/30",
      label: `${percentage}% comissão`,
    };
  }
  if (percentage >= 30) {
    return {
      className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
      label: `${percentage}% comissão`,
    };
  }
  return {
    className: "bg-red-500/20 text-red-700 border-red-500/30",
    label: `${percentage}% comissão`,
  };
}
