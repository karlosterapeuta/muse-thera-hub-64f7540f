
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
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { PlusIcon, EyeIcon, FileTextIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Report = {
  id: string;
  type: string;
  created_at: string;
  content: Record<string, any>;
  patient: {
    name: string;
  } | null;
};

const reportTypeLabels: Record<string, string> = {
  individual_session: "Relatório de Sessão Individual",
  group_session: "Relatório de Sessão em Grupo",
  daily_evolution: "Evolução Diária",
  monthly_evolution: "Evolução Mensal",
  semester_evolution: "Evolução Semestral",
  therapeutic_discharge: "Alta Terapêutica",
  administrative_discharge: "Alta Administrativa",
  tea_scale: "Escala TEA",
  family_report: "Relatório para Família",
  team_report: "Relatório para Equipe",
  technical_report: "Relatório Técnico",
};

const ReportViewer = ({ report }: { report: Report }) => {
  const renderContent = () => {
    if (!report.content) return <p>Conteúdo não disponível</p>;

    return (
      <div className="space-y-4">
        {Object.entries(report.content).map(([key, value]) => (
          <div key={key}>
            <h4 className="font-semibold text-sm text-gray-700 mb-1 capitalize">
              {key.replace(/_/g, ' ')}
            </h4>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm whitespace-pre-wrap">{String(value)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <EyeIcon className="h-4 w-4 mr-1" />
          Ver
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            {reportTypeLabels[report.type] || report.type}
          </DialogTitle>
          <DialogDescription>
            Paciente: {report.patient?.name || 'N/A'} • 
            Data: {format(new Date(report.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function ReportsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Usuário não autenticado");
        }

        const { data, error } = await supabase
          .from("reports")
          .select(`
            id,
            type,
            created_at,
            content,
            patient:patients!inner (
              name,
              professional_id
            )
          `)
          .eq('patient.professional_id', user.id)
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
      } finally {
        setIsLoading(false);
      }
    }

    loadReports();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Carregando relatórios...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Relatórios Salvos</CardTitle>
          <Button onClick={() => navigate("/processes/report")} size="sm">
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    {format(new Date(report.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{report.patient?.name || 'N/A'}</TableCell>
                  <TableCell>{reportTypeLabels[report.type] || report.type}</TableCell>
                  <TableCell className="text-right">
                    <ReportViewer report={report} />
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileTextIcon className="h-8 w-8 text-gray-400" />
                      <p>Nenhum relatório encontrado</p>
                      <p className="text-sm">Crie seu primeiro relatório clicando no botão acima</p>
                    </div>
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
