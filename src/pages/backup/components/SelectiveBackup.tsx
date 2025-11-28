import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderOpen, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { BackupStatistics } from "../hooks/useBackupData";

interface SelectiveBackupProps {
  statistics: BackupStatistics | undefined;
  onGenerate: (categories: string[]) => Promise<void>;
  isGenerating: boolean;
}

const categories = [
  { key: "patients", label: "Pacientes", description: "Dados cadastrais dos pacientes" },
  { key: "anamnesis", label: "Anamneses", description: "Históricos clínicos detalhados" },
  { key: "assessments", label: "Avaliações", description: "Avaliações musicoterapêuticas" },
  { key: "treatmentPlans", label: "Planos de Tratamento", description: "Planos terapêuticos" },
  { key: "reports", label: "Relatórios", description: "Relatórios clínicos" },
  { key: "financialRecords", label: "Registros Financeiros", description: "Sessões e pagamentos" },
  { key: "clinics", label: "Clínicas", description: "Locais de atendimento" },
  { key: "sessions", label: "Sessões", description: "Registros de sessões" },
];

export function SelectiveBackup({ statistics, onGenerate, isGenerating }: SelectiveBackupProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleToggle = (key: string) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((c) => c.key));
    }
  };

  const handleGenerate = () => {
    if (selectedCategories.length > 0) {
      onGenerate(selectedCategories);
    }
  };

  const getCount = (key: string): number => {
    if (!statistics) return 0;
    return statistics[key as keyof BackupStatistics] ?? 0;
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-secondary/50">
            <FolderOpen className="h-6 w-6 text-secondary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Backup Seletivo</h3>
            <p className="text-sm text-muted-foreground">Escolha categorias específicas</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="text-sm font-medium">Categorias</span>
            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
              {selectedCategories.length === categories.length ? "Desmarcar" : "Selecionar"} Tudo
            </Button>
          </div>

          {categories.map((category) => {
            const count = getCount(category.key);
            return (
              <label
                key={category.key}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedCategories.includes(category.key)
                    ? "bg-primary/5 border-primary/30"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedCategories.includes(category.key)}
                    onCheckedChange={() => handleToggle(category.key)}
                  />
                  <div>
                    <p className="font-medium text-sm">{category.label}</p>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-muted-foreground">{count}</span>
              </label>
            );
          })}
        </div>

        <Button
          onClick={handleGenerate}
          disabled={selectedCategories.length === 0 || isGenerating}
          className="w-full"
          variant="secondary"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Gerar Backup Seletivo ({selectedCategories.length})
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
