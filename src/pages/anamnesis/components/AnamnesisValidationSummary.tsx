import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ValidationError {
  field: string;
  label: string;
  section: number;
  sectionTitle: string;
}

interface AnamnesisValidationSummaryProps {
  isValid: boolean;
  errors: ValidationError[];
  onNavigateToError?: (section: number, field: string) => void;
}

export function AnamnesisValidationSummary({
  isValid,
  errors,
  onNavigateToError
}: AnamnesisValidationSummaryProps) {
  if (isValid) {
    return (
      <Alert className="border-primary/50 bg-primary/5">
        <CheckCircle2 className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-semibold">
          Formulário Completo
        </AlertTitle>
        <AlertDescription className="text-primary/80">
          Todos os campos obrigatórios foram preenchidos. Você pode salvar ou exportar a anamnese.
        </AlertDescription>
      </Alert>
    );
  }

  // Agrupar erros por seção
  const errorsBySection = errors.reduce((acc, error) => {
    if (!acc[error.section]) {
      acc[error.section] = {
        sectionTitle: error.sectionTitle,
        fields: []
      };
    }
    acc[error.section].fields.push(error);
    return acc;
  }, {} as Record<number, { sectionTitle: string; fields: ValidationError[] }>);

  return (
    <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="font-semibold">
        Campos Obrigatórios Pendentes ({errors.length})
      </AlertTitle>
      <AlertDescription className="mt-3">
        <div className="space-y-3">
          {Object.entries(errorsBySection).map(([sectionNum, { sectionTitle, fields }]) => (
            <div key={sectionNum} className="bg-background/50 rounded-lg p-3 border border-destructive/20">
              <div className="font-medium text-sm text-destructive mb-2">
                Seção {sectionNum}: {sectionTitle}
              </div>
              <ul className="space-y-1">
                {fields.map((field) => (
                  <li key={field.field} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      • {field.label}
                    </span>
                    {onNavigateToError && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onNavigateToError(parseInt(sectionNum), field.field)}
                      >
                        Ir para campo
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Por favor, preencha os campos obrigatórios antes de salvar.
        </p>
      </AlertDescription>
    </Alert>
  );
}
