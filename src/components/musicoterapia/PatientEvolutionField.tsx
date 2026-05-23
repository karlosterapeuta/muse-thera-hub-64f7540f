import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Info, X, TrendingUp, Plus } from 'lucide-react';

interface PatientEvolutionFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function PatientEvolutionField({ value = [], onChange }: PatientEvolutionFieldProps) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      setNewItem('');
      return;
    }
    onChange([...value, trimmed]);
    setNewItem('');
  };

  const removeItem = (item: string) => {
    onChange(value.filter(v => v !== item));
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
              Documente progressos, estagnações e desafios observados através da música. Digite livremente cada evolução.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#0d0d0d]/30 p-4 sm:p-5 space-y-3">
        <p className="text-xs sm:text-sm font-medium text-[#c9a84c]">Adicionar evolução</p>
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem();
              }
            }}
            placeholder="Descreva uma evolução observada..."
            className="flex-1 bg-[#0d0d0d]/40 border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/40 text-xs sm:text-sm"
          />
          <Button
            type="button"
            onClick={addItem}
            className="bg-[#c9a84c] hover:bg-[#b8973d] text-black flex-shrink-0 px-3 sm:px-4"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {value.length > 0 && (
        <div className="rounded-2xl border border-[#c9a84c]/40 bg-gradient-to-br from-[#c9a84c]/10 to-transparent p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-[#c9a84c]" />
            <h4 className="text-sm sm:text-base font-semibold text-[#c9a84c]">Evoluções selecionadas</h4>
            <Badge className="bg-[#c9a84c] text-black hover:bg-[#c9a84c] text-[10px] sm:text-xs">{value.length}</Badge>
          </div>
          <div className="space-y-2">
            {value.map((item, i) => (
              <div key={i} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-[#0d0d0d]/40 border border-[#c9a84c]/20">
                <span className="text-[#c9a84c] text-xs mt-1 flex-shrink-0">●</span>
                <p className="flex-1 text-xs sm:text-sm leading-relaxed text-foreground">{item}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item)}
                  className="h-7 w-7 p-0 flex-shrink-0 hover:bg-[#c9a84c]/20 text-[#c9a84c]"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
