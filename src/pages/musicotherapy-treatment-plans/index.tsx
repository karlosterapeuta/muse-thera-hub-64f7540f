import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Search, Filter, Calendar, User, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMusicotherapyTreatmentPlans, MusicotherapyTreatmentPlanSummary } from '@/hooks/useMusicotherapyTreatmentPlans';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast as sonnerToast } from 'sonner';
import { TreatmentPlanViewModal } from './components/TreatmentPlanViewModal';
import { MusicotherapyTreatmentPlanPDF } from '@/components/MusicotherapyTreatmentPlanPDF';
import { generateStaticPDF } from '@/utils/staticPDFGenerator';
import { useProfessionalData } from '@/hooks/useProfessionalData';
import { imageUrlToBase64 } from '@/utils/imageToBase64';

export default function MusicotherapyTreatmentPlans() {
  const navigate = useNavigate();
  const { data: plans, isLoading } = useMusicotherapyTreatmentPlans();
  const { data: professionalData } = useProfessionalData();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updated_at');
  const [viewingPlanId, setViewingPlanId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'ativo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
      case 'concluído':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
      case 'rascunho':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
      case 'arquivado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Ativo';
      case 'completed':
        return 'Concluído';
      case 'draft':
        return 'Rascunho';
      case 'archived':
        return 'Arquivado';
      default:
        return status || 'Sem status';
    }
  };

  const filteredPlans = plans?.filter(plan => {
    const matchesSearch = plan.patient_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.clinical_diagnosis?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const sortedPlans = [...filteredPlans].sort((a, b) => {
    switch (sortBy) {
      case 'patient_name':
        return (a.patient_full_name || '').localeCompare(b.patient_full_name || '');
      case 'status':
        return (a.status || '').localeCompare(b.status || '');
      case 'created_at':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'updated_at':
      default:
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });

  const handleDelete = async (planId: string) => {
    try {
      const { error } = await supabase
        .from('treatment_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: 'Plano excluído',
        description: 'O plano musicoterapêutico foi excluído com sucesso.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['musicotherapy-treatment-plans'] });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o plano. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadPDF = async (planId: string) => {
    setIsDownloading(planId);
    let loadingToast: string | number | undefined;
    
    try {
      loadingToast = sonnerToast.loading("Gerando PDF do plano...");

      // Fetch complete plan data
      const { data: planData, error: planError } = await supabase
        .from('treatment_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (planError || !planData) {
        throw new Error('Plano não encontrado');
      }

      // Parse JSON fields
      const parseJsonField = (field: any): string[] => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') {
          try {
            const parsed = JSON.parse(field);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      };

      const parsedPlanData = {
        ...planData,
        general_objectives: parseJsonField(planData.general_objectives),
        specific_objectives: parseJsonField(planData.specific_objectives),
        musical_instruments: parseJsonField(planData.musical_instruments),
        technological_resources: parseJsonField(planData.technological_resources),
        voice_body_resources: parseJsonField(planData.voice_body_resources),
        complementary_materials: parseJsonField(planData.complementary_materials),
        evaluation_criteria_list: parseJsonField(planData.evaluation_criteria_list),
      };

      // Convert professional images to Base64
      const photoUrl = professionalData?.stamp_photo_url || professionalData?.avatar_url;
      const professionalPhotoBase64 = photoUrl ? await imageUrlToBase64(photoUrl) : null;
      const digitalStampBase64 = professionalData?.digital_stamp_url 
        ? await imageUrlToBase64(professionalData.digital_stamp_url) 
        : null;

      // Generate PDF
      const success = await generateStaticPDF(
        <MusicotherapyTreatmentPlanPDF
          planData={parsedPlanData}
          therapistName={professionalData?.name}
          professionalPhotoUrl={professionalPhotoBase64 || undefined}
          digitalStampUrl={digitalStampBase64 || undefined}
          professionalEmail={professionalData?.email || undefined}
          professionalPhone={professionalData?.phone || undefined}
          professionalSpecialty={professionalData?.specialty || undefined}
          professionalRegistry={professionalData?.register || undefined}
        />,
        {
          filename: `Plano_Musicoterapeutico_${planData.patient_full_name?.replace(/\s+/g, '_') || 'paciente'}.pdf`,
          waitTime: 2000,
        }
      );

      if (success) {
        sonnerToast.success("PDF gerado com sucesso!", { id: loadingToast });
      } else {
        throw new Error('Falha ao gerar PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      sonnerToast.error("Erro ao gerar PDF. Tente novamente.", { id: loadingToast });
    } finally {
      setIsDownloading(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planos Musicoterapêuticos</h1>
          <p className="text-muted-foreground">Gerencie seus planos de tratamento salvos</p>
        </div>
        <Button onClick={() => navigate('/musicotherapy-treatment-plan')} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente ou diagnóstico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_at">Última atualização</SelectItem>
                <SelectItem value="created_at">Data de criação</SelectItem>
                <SelectItem value="patient_name">Nome do paciente</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Plans List */}
      {sortedPlans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nenhum plano encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca.' 
                    : 'Comece criando seu primeiro plano musicoterapêutico.'
                  }
                </p>
              </div>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => navigate('/musicotherapy-treatment-plan')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Plano
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {sortedPlans.length} plano{sortedPlans.length !== 1 ? 's' : ''} encontrado{sortedPlans.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última atualização</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{plan.patient_full_name || 'Nome não informado'}</div>
                            {plan.patient_age && (
                              <div className="text-sm text-muted-foreground">{plan.patient_age}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={plan.clinical_diagnosis}>
                          {plan.clinical_diagnosis || 'Não informado'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(plan.status || 'draft')}>
                          {getStatusLabel(plan.status || 'draft')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(plan.updated_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingPlanId(plan.id)}
                            className="gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Ver
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPDF(plan.id)}
                            disabled={isDownloading === plan.id}
                            className="gap-1"
                          >
                            <Download className="h-4 w-4" />
                            {isDownloading === plan.id ? '...' : 'PDF'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/musicotherapy-treatment-plan/${plan.id}`)}
                            className="gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir plano musicoterapêutico</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o plano de <strong>{plan.patient_full_name}</strong>? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(plan.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Modal */}
      <TreatmentPlanViewModal
        planId={viewingPlanId}
        open={!!viewingPlanId}
        onClose={() => setViewingPlanId(null)}
        onDownloadPDF={handleDownloadPDF}
        isDownloading={isDownloading === viewingPlanId}
      />
    </div>
  );
}