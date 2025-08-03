import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EvolutionReportData } from "@/hooks/useEvolutionReport";
import { evolutionMuseteraTemplate } from "@/data/evolutionMuseteraTemplate";

interface EvolutionPreviewProps {
  reportData: EvolutionReportData;
  patientName?: string;
}

export function EvolutionPreview({ reportData, patientName }: EvolutionPreviewProps) {
  const formatMultiSelectValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join("; ") : "Não informado";
    }
    return value || "Não informado";
  };

  const formatTextValue = (value: any) => {
    return value && value.trim() !== "" ? value : "Não informado";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Relatório de Evolução – MuseTera
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Paciente:</strong> {patientName || "Não informado"}
            </div>
            <div>
              <strong>Data:</strong> {new Date(reportData.date).toLocaleDateString('pt-BR')}
            </div>
            <div>
              <strong>Profissional:</strong> {reportData.professionalName || "Não informado"}
            </div>
            <div>
              <strong>Registro:</strong> {reportData.professionalRegister || "Não informado"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      {evolutionMuseteraTemplate.sections.map((section) => {
        const sectionHasContent = section.fields.some(field => 
          reportData.content[field.id] && 
          (Array.isArray(reportData.content[field.id]) 
            ? reportData.content[field.id].length > 0 
            : reportData.content[field.id].trim() !== "")
        );

        if (!sectionHasContent) return null;

        return (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.fields.map((field) => {
                const value = reportData.content[field.id];
                if (!value || (Array.isArray(value) && value.length === 0) || 
                    (typeof value === 'string' && value.trim() === "")) {
                  return null;
                }

                return (
                  <div key={field.id}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      {field.label}
                    </h4>
                    <div className="text-sm">
                      {field.type === "multiselect" 
                        ? formatMultiSelectValue(value)
                        : formatTextValue(value)
                      }
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {/* Footer */}
      <Card>
        <CardContent className="pt-4">
          <Separator className="mb-4" />
          <div className="text-center text-sm text-muted-foreground">
            <p>Relatório gerado em: {new Date().toLocaleString('pt-BR')}</p>
            <p className="mt-2">
              <strong>{reportData.professionalName}</strong>
              {reportData.professionalRegister && ` - ${reportData.professionalRegister}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}