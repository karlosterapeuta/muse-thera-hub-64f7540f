import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

interface DiagnosisSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const commonDiagnoses = [
  "TEA (Transtorno do Espectro Autista)",
  "TDAH (Transtorno do Déficit de Atenção)",
  "Síndrome de Down",
  "Deficiência Intelectual",
  "Paralisia Cerebral",
  "Atraso no Desenvolvimento",
  "Transtorno de Ansiedade",
  "Depressão",
  "Esquizofrenia",
  "Transtorno Bipolar",
  "Demência",
  "Alzheimer"
];

export function DiagnosisSelector({ value, onChange }: DiagnosisSelectorProps) {
  const handleDiagnosisSelect = (diagnosis: string) => {
    if (value.trim()) {
      // If there's already text, add as a secondary diagnosis
      onChange(`${value}, ${diagnosis}`);
    } else {
      onChange(diagnosis);
    }
  };

  return (
    <div className="space-y-3">
      <Label>Diagnóstico clínico</Label>
      
      <div className="space-y-3">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Digite o diagnóstico ou selecione abaixo"
        />
        
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Diagnósticos Comuns
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {commonDiagnoses.map((diagnosis) => (
                <Badge
                  key={diagnosis}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border-blue-300 dark:border-blue-600 text-blue-700 dark:text-white"
                  onClick={() => handleDiagnosisSelect(diagnosis)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {diagnosis}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}