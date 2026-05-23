import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Info } from 'lucide-react';

interface PatientEvolutionFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function PatientEvolutionField({ value = [], onChange }: PatientEvolutionFieldProps) {
  const text = value.join('\n');

  const handleChange = (raw: string) => {
    const lines = raw.split('\n').map(l => l.replace(/^\s+/, ''));
    // preserve empty lines while typing; filter only on save elsewhere
    onChange(lines.filter((l, i, arr) => !(l === '' && i === arr.length - 1 && arr.length === 1) ? true : false).length === 0 && raw === ''
      ? []
      : lines);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl border border-[#c9a84c]/30 bg-[#0d0d0d]/40 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex-shrink-0">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-[#c9a84c]" />
          </div>
          <div className="min-w-1">
            <p className="font-medium text-sm sm:text-base text-[#c9a84c]">Evolução do paciente</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Descreva livremente os progressos, estagnações e desafios observados. Cada linha representa uma evolução.
            </p>
          </div>
        </div>
      </div>

      <Textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Descreva as evoluções observadas..."
        className="min-h-[220px] sm:min-h-[280px] bg-[#0d0d0d]/40 border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/40 text-xs sm:text-sm leading-relaxed resize-y"
      />
    </div>
  );
}
