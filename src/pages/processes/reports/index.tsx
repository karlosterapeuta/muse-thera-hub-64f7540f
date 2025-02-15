
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Report = {
  id: string;
  type: string;
  created_at: string;
  patient: {
    name: string;
  } | null;
};

const reportTypeLabels: Record<string, string> = {
  initial_evaluation: "Avaliação Inicial",
  progress_report: "Relatório de Progresso",
  session_summary: "Resumo de Sessão",
  discharge_summary: "Resumo de Alta",
  assessment_report: "Relatório de Avaliação",
};

export default function ReportsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    async function loadReports() {
      try {
        const { data, error } = await supabase
          .from("reports")
          .select(`
            id,
            type,
            created_at,
            patient:patients (
              name
            )
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao carregar relatórios:", error);
          throw error;
        }

        console.log("Relatórios carregados:", data);
        setReports(data || []);
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar relatórios",
          description: "Não foi possível carregar a lista de relatórios",
        });
      }
    }

    loadReports();
  }, [toast]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Relatórios</CardTitle>
          <Button onClick={() => navigate("/processos/relatorio")} size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Novo Relatório
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    {format(new Date(report.created_at), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>{report.patient?.name || 'N/A'}</TableCell>
                  <TableCell>{reportTypeLabels[report.type] || report.type}</TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Nenhum relatório encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
