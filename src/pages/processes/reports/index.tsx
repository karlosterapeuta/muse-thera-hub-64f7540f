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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { 
  PlusIcon, 
  Eye, 
  Edit, 
  Search, 
  Trash2, 
  FileText, 
  TrendingUp, 
  Calendar,
  Users,
  Filter,
  Grid3X3,
  List,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ReportViewer } from "../report/components/ReportViewer";
import { DeleteReportDialog } from "./components/DeleteReportDialog";

type DatabaseReport = {
  id: string;
  type: string;
  created_at: string;
  updated_at: string;
  content: any;
  patient: {
    name: string;
  } | null;
  professional: {
    name: string;
  } | null;
};

type Report = {
  id: string;
  type: string;
  created_at: string;
  updated_at: string;
  content: Record<string, any>;
  patient: {
    name: string;
  } | null;
  professional: {
    name: string;
  } | null;
};

type ReportViewerData = {
  id: string;
  type: string;
  date: string;
  content: Record<string, any>;
  status: string;
  patient: { name: string } | null;
  professional: { name: string } | null;
};

const reportTypeLabels: Record<string, string> = {
  individual_session: "Sessão Individual",
  group_session: "Sessão em Grupo", 
  daily_evolution: "Evolução Diária",
  monthly_evolution: "Evolução Mensal",
  semester_evolution: "Evolução Semestral",
  therapeutic_discharge: "Alta Terapêutica",
  technical_report: "Relatório Técnico",
  initial_evaluation: "Avaliação Inicial",
  progress_report: "Relatório de Progresso",
  session_summary: "Resumo de Sessão",
  family_report: "Relatório Familiar",
  team_report: "Relatório de Equipe",
  assessment_report: "Relatório de Avaliação",
  discharge_summary: "Resumo de Alta",
  administrative_discharge: "Alta Administrativa",
  tea_scale: "Escala TEA",
  musicoterapia: "Relatório TEA - Musicoterapia",
};

const reportTypeColors: Record<string, string> = {
  individual_session: "bg-blue-500",
  group_session: "bg-purple-500",
  daily_evolution: "bg-green-500",
  monthly_evolution: "bg-orange-500",
  semester_evolution: "bg-red-500",
  therapeutic_discharge: "bg-gray-500",
  technical_report: "bg-indigo-500",
  initial_evaluation: "bg-pink-500",
  progress_report: "bg-yellow-500",
  session_summary: "bg-cyan-500",
  family_report: "bg-emerald-500",
  team_report: "bg-violet-500",
  assessment_report: "bg-rose-500",
  discharge_summary: "bg-amber-500",
  administrative_discharge: "bg-slate-500",
  tea_scale: "bg-teal-500",
  musicoterapia: "bg-purple-600",
};

export default function ReportsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportViewerData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    reportId: string;
    reportType: string;
    patientName: string;
  }>({
    isOpen: false,
    reportId: "",
    reportType: "",
    patientName: "",
  });

  const convertDatabaseReport = (dbReport: DatabaseReport): Report => {
    let content: Record<string, any> = {};
    
    if (dbReport.content) {
      if (typeof dbReport.content === 'object') {
        content = dbReport.content as Record<string, any>;
      } else if (typeof dbReport.content === 'string') {
        try {
          content = JSON.parse(dbReport.content);
        } catch {
          content = { raw_content: dbReport.content };
        }
      }
    }

    return {
      id: dbReport.id,
      type: dbReport.type,
      created_at: dbReport.created_at,
      updated_at: dbReport.updated_at,
      content,
      patient: dbReport.patient,
      professional: dbReport.professional,
    };
  };

  const getCurrentProfessionalId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { data: professional, error } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar professional:", error);
        throw error;
      }

      if (!professional) {
        return null;
      }

      return professional.id;
    } catch (error) {
      console.error("Erro ao obter professional_id:", error);
      return null;
    }
  };

  useEffect(() => {
    async function loadReports() {
      try {
        setIsLoading(true);
        
        const currentProfessionalId = await getCurrentProfessionalId();
        setProfessionalId(currentProfessionalId);

        if (!currentProfessionalId) {
          setReports([]);
          setFilteredReports([]);
          toast({
            title: "Aviso",
            description: "Você ainda não possui um registro de profissional. Crie um relatório primeiro.",
          });
          return;
        }

        const { data, error } = await supabase
          .from("reports")
          .select(`
            id,
            type,
            content,
            created_at,
            updated_at,
            patient:patients (
              name
            ),
            professional:professionals (
              name
            )
          `)
          .eq('professional_id', currentProfessionalId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao carregar relatórios:", error);
          throw error;
        }
        
        const convertedReports = (data || []).map(convertDatabaseReport);
        setReports(convertedReports);
        setFilteredReports(convertedReports);
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
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reportTypeLabels[report.type]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTypeFilter !== 'all') {
      filtered = filtered.filter(report => report.type === selectedTypeFilter);
    }

    setFilteredReports(filtered);
  }, [searchTerm, reports, selectedTypeFilter]);

  const handleView = (report: Report) => {
    const transformedReport: ReportViewerData = {
      id: report.id,
      type: report.type,
      date: report.created_at,
      content: report.content,
      status: 'finalized',
      patient: report.patient,
      professional: report.professional,
    };
    setSelectedReport(transformedReport);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (report: Report) => {
    navigate(`/processes/report/${report.id}`);
  };

  const handleDeleteClick = (report: Report) => {
    setDeleteDialog({
      isOpen: true,
      reportId: report.id,
      reportType: reportTypeLabels[report.type] || report.type,
      patientName: report.patient?.name || 'N/A',
    });
  };

  const handleDeleteSuccess = () => {
    const loadReports = async () => {
      try {
        if (!professionalId) return;

        const { data, error } = await supabase
          .from("reports")
          .select(`
            id,
            type,
            content,
            created_at,
            updated_at,
            patient:patients (
              name
            ),
            professional:professionals (
              name
            )
          `)
          .eq('professional_id', professionalId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const convertedReports = (data || []).map(convertDatabaseReport);
        setReports(convertedReports);
        setFilteredReports(convertedReports);
      } catch (error) {
        console.error("Erro ao recarregar relatórios:", error);
      }
    };

    loadReports();
  };

  const getStats = () => {
    const totalReports = reports.length;
    const thisMonth = reports.filter(r => {
      const reportDate = new Date(r.created_at);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
    }).length;
    const uniquePatients = new Set(reports.map(r => r.patient?.name).filter(Boolean)).size;
    
    return { totalReports, thisMonth, uniquePatients };
  };

  const uniqueTypes = Array.from(new Set(reports.map(r => r.type)));
  const stats = getStats();

  const ReportCard = ({ report }: { report: Report }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${reportTypeColors[report.type] || 'bg-gray-400'}`}></div>
            <div>
              <CardTitle className="text-sm font-semibold text-gray-900">
                {report.patient?.name || 'N/A'}
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(report.created_at), "dd/MM/yyyy")} • {format(new Date(report.created_at), "HH:mm")}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            {reportTypeLabels[report.type] || report.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">
            <span className="font-medium">Por:</span> {report.professional?.name || 'N/A'}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleView(report)}
              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(report)}
              className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteClick(report)}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Meus Relatórios</h1>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Total de Relatórios</p>
                      <p className="text-2xl font-bold">{stats.totalReports}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Este Mês</p>
                      <p className="text-2xl font-bold">{stats.thisMonth}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Pacientes Únicos</p>
                      <p className="text-2xl font-bold">{stats.uniquePatients}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => navigate("/processes/report")} 
              className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Criar Novo Relatório
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Filters and Search */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por paciente ou tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 bg-white"
                  />
                </div>
                
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">Todos os tipos</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>
                      {reportTypeLabels[type] || type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {isLoading ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-gray-500 mt-4">Carregando relatórios...</p>
            </CardContent>
          </Card>
        ) : !professionalId ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Bem-vindo ao sistema!
              </h3>
              <p className="text-gray-500 mb-6">
                Você ainda não possui um registro de profissional. Crie seu primeiro relatório para começar.
              </p>
              <Button onClick={() => navigate("/processes/report")}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Criar Primeiro Relatório
              </Button>
            </CardContent>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm || selectedTypeFilter !== 'all' ? 'Nenhum resultado encontrado' : 'Nenhum relatório criado'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedTypeFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece criando seu primeiro relatório.'}
              </p>
              {!searchTerm && selectedTypeFilter === 'all' && (
                <Button onClick={() => navigate("/processes/report")}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Criar Relatório
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Data</TableHead>
                    <TableHead className="font-semibold">Paciente</TableHead>
                    <TableHead className="font-semibold">Tipo</TableHead>
                    <TableHead className="font-semibold">Profissional</TableHead>
                    <TableHead className="text-right font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium">
                        {format(new Date(report.created_at), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>{report.patient?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {reportTypeLabels[report.type] || report.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.professional?.name || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(report)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(report)}
                            className="hover:bg-green-50 hover:text-green-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(report)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Relatório</DialogTitle>
          </DialogHeader>
          {selectedReport && <ReportViewer report={selectedReport} />}
        </DialogContent>
      </Dialog>

      <DeleteReportDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        reportId={deleteDialog.reportId}
        reportType={deleteDialog.reportType}
        patientName={deleteDialog.patientName}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
