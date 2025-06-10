
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ReportViewerProps {
  report: {
    id: string;
    type: string;
    date: string;
    content: Record<string, any>;
    status: string;
    patient: { name: string } | null;
    professional: { name: string } | null;
  };
}

const reportTypeLabels: Record<string, string> = {
  individual_session: "Relatório de Sessão Individual",
  group_session: "Relatório de Sessão em Grupo",
  daily_evolution: "Evolução Diária",
  monthly_evolution: "Evolução Mensal",
  semester_evolution: "Evolução Semestral",
  therapeutic_discharge: "Alta Terapêutica",
  technical_report: "Relatório Técnico",
};

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  finalized: "Finalizado",
};

export function ReportViewer({ report }: ReportViewerProps) {
  const renderContent = () => {
    if (!report.content || Object.keys(report.content).length === 0) {
      return <p className="text-muted-foreground">Nenhum conteúdo disponível.</p>;
    }

    return Object.entries(report.content).map(([key, value]) => {
      if (typeof value === 'string' && value.trim()) {
        return (
          <div key={key} className="space-y-2">
            <h4 className="font-semibold capitalize">
              {key.replace(/_/g, ' ')}
            </h4>
            <div className="whitespace-pre-wrap text-sm text-muted-foreground pl-4 border-l-2 border-muted">
              {value}
            </div>
            <Separator className="my-4" />
          </div>
        );
      }
      return null;
    }).filter(Boolean);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                {reportTypeLabels[report.type] || report.type}
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Paciente: {report.patient?.name || 'N/A'}
              </p>
              <p className="text-muted-foreground">
                Profissional: {report.professional?.name || 'N/A'}
              </p>
              <p className="text-muted-foreground">
                Data: {format(new Date(report.date), "dd/MM/yyyy")}
              </p>
            </div>
            <Badge variant={report.status === 'finalized' ? 'default' : 'secondary'}>
              {statusLabels[report.status] || report.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renderContent()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
