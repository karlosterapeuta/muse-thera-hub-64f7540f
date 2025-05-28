
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
import { PlusIcon, EyeIcon, FileTextIcon, CalendarIcon, UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Report = {
  id: string;
  type: string;
  created_at: string;
  content: any;
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

const reportTypeColors: Record<string, string> = {
  individual_session: "bg-blue-100 text-blue-800 border-blue-200",
  group_session: "bg-green-100 text-green-800 border-green-200",
  daily_evolution: "bg-purple-100 text-purple-800 border-purple-200",
  monthly_evolution: "bg-orange-100 text-orange-800 border-orange-200",
  semester_evolution: "bg-indigo-100 text-indigo-800 border-indigo-200",
  therapeutic_discharge: "bg-emerald-100 text-emerald-800 border-emerald-200",
  administrative_discharge: "bg-red-100 text-red-800 border-red-200",
  tea_scale: "bg-cyan-100 text-cyan-800 border-cyan-200",
  family_report: "bg-pink-100 text-pink-800 border-pink-200",
  team_report: "bg-yellow-100 text-yellow-800 border-yellow-200",
  technical_report: "bg-slate-100 text-slate-800 border-slate-200",
};

const ReportViewer = ({ report }: { report: Report }) => {
  const renderContent = () => {
    if (!report.content) return <p className="text-gray-500 italic">Conteúdo não disponível</p>;

    return (
      <div className="space-y-6">
        {Object.entries(report.content).map(([key, value]) => (
          <div key={key} className="border-l-4 border-primary/20 pl-4">
            <h4 className="font-semibold text-lg text-gray-800 mb-2 capitalize">
              {key.replace(/_/g, ' ')}
            </h4>
            <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{String(value)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
          <EyeIcon className="h-4 w-4 mr-1" />
          Visualizar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileTextIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">
                {reportTypeLabels[report.type] || report.type}
              </div>
              <Badge 
                variant="outline" 
                className={`mt-1 ${reportTypeColors[report.type] || 'bg-gray-100 text-gray-800'}`}
              >
                {report.type.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-base mt-2">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{report.patient?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span>{format(new Date(report.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
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
        setReports(data as Report[] || []);
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
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <span className="ml-3 text-lg text-gray-600">Carregando relatórios...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-6 rounded-xl border border-primary/20">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Relatórios Salvos</h1>
        <p className="text-gray-600">Gerencie e visualize todos os relatórios dos seus pacientes</p>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileTextIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Meus Relatórios</CardTitle>
                <p className="text-primary-foreground/80 text-sm">
                  {reports.length} relatório{reports.length !== 1 ? 's' : ''} encontrado{reports.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/processes/report")} 
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Novo Relatório
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {reports.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FileTextIcon className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum relatório encontrado</h3>
                  <p className="text-gray-600 mb-4">Comece criando seu primeiro relatório</p>
                  <Button onClick={() => navigate("/processes/report")} className="shadow-lg">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Criar Primeiro Relatório
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Data
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Paciente
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report, index) => (
                    <TableRow 
                      key={report.id} 
                      className={`hover:bg-gray-50/80 transition-colors border-b border-gray-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-gray-800">
                            {format(new Date(report.created_at), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(report.created_at), "HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-gray-800">{report.patient?.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${reportTypeColors[report.type] || 'bg-gray-100 text-gray-800'} font-medium`}
                        >
                          {reportTypeLabels[report.type] || report.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ReportViewer report={report} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
