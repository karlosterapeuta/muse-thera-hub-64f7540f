
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { PlusIcon, Eye, Edit, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ReportViewer } from "../report/components/ReportViewer";

type Report = {
  id: string;
  type: string;
  date: string;
  status: string;
  created_at: string;
  patient: {
    name: string;
  } | null;
  professional: {
    name: string;
  } | null;
  content: Record<string, any>;
};

const reportTypeLabels: Record<string, string> = {
  individual_session: "Sessão Individual",
  group_session: "Sessão em Grupo", 
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

export default function ReportsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("reports")
          .select(`
            id,
            type,
            date,
            status,
            content,
            created_at,
            patient:patients (
              name
            ),
            professional:professionals (
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
        setFilteredReports(data || []);
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

  useEffect(() => {
    if (!searchTerm) {
      setFilteredReports(reports);
      return;
    }

    const filtered = reports.filter(report => 
      report.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reportTypeLabels[report.type]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statusLabels[report.status]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [searchTerm, reports]);

  const handleView = (report: Report) => {
    setSelectedReport(report);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (report: Report) => {
    navigate(`/processes/report/${report.id}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Relatórios</CardTitle>
          <Button onClick={() => navigate("/processes/report")} size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Novo Relatório
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente, tipo ou status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando relatórios...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      {format(new Date(report.created_at), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{report.patient?.name || 'N/A'}</TableCell>
                    <TableCell>{reportTypeLabels[report.type] || report.type}</TableCell>
                    <TableCell>
                      <Badge variant={report.status === 'finalized' ? 'default' : 'secondary'}>
                        {statusLabels[report.status] || report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.professional?.name || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(report)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredReports.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      {searchTerm ? "Nenhum relatório encontrado para a busca." : "Nenhum relatório encontrado"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Relatório</DialogTitle>
          </DialogHeader>
          {selectedReport && <ReportViewer report={selectedReport} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
