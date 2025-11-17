import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Search, Filter, Calendar, User } from 'lucide-react';
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
import { ptBR, enUS, es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function MusicotherapyTreatmentPlans() {
  const navigate = useNavigate();
  const { data: plans, isLoading } = useMusicotherapyTreatmentPlans();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation('musicotherapy');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updated_at');

  const getDateFnsLocale = () => {
    switch (i18n.language) {
      case 'en':
        return enUS;
      case 'es':
        return es;
      default:
        return ptBR;
    }
  };

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
        return t('plans.status.active');
      case 'completed':
        return t('plans.status.completed');
      case 'draft':
        return t('plans.status.draft');
      case 'archived':
        return t('plans.status.archived');
      default:
        return status || t('plans.status.none');
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
        title: t('plans.toast.deleted'),
        description: t('plans.toast.deletedSuccess'),
      });
      
      queryClient.invalidateQueries({ queryKey: ['musicotherapy-treatment-plans'] });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: t('plans.toast.deleteError'),
        description: t('plans.toast.deleteErrorMessage'),
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: getDateFnsLocale() });
    } catch {
      return t('plans.invalidDate');
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
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative">
        <div className="absolute top-0 right-0 md:right-4">
          <LanguageSelector />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('plans.title')}</h1>
          <p className="text-muted-foreground">{t('plans.description')}</p>
        </div>
        <Button onClick={() => navigate('/musicotherapy-treatment-plan')} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('plans.newPlan')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('plans.filters.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder={t('plans.filters.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('plans.filters.allStatus')}</SelectItem>
                <SelectItem value="active">{t('plans.status.active')}</SelectItem>
                <SelectItem value="draft">{t('plans.status.draft')}</SelectItem>
                <SelectItem value="completed">{t('plans.status.completed')}</SelectItem>
                <SelectItem value="archived">{t('plans.status.archived')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('plans.filters.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_at">{t('plans.filters.lastUpdate')}</SelectItem>
                <SelectItem value="created_at">{t('plans.filters.createdDate')}</SelectItem>
                <SelectItem value="patient_name">{t('plans.filters.patientName')}</SelectItem>
                <SelectItem value="status">{t('plans.filters.status')}</SelectItem>
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
                <h3 className="text-lg font-semibold">{t('plans.empty.title')}</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? t('plans.empty.adjustFilters')
                    : t('plans.empty.createFirst')
                  }
                </p>
              </div>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => navigate('/musicotherapy-treatment-plan')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('plans.empty.createButton')}
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
              {t('plans.table.plansFound', { count: sortedPlans.length })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('plans.table.headers.patient')}</TableHead>
                    <TableHead>{t('plans.table.headers.diagnosis')}</TableHead>
                    <TableHead>{t('plans.table.headers.status')}</TableHead>
                    <TableHead>{t('plans.table.headers.lastUpdate')}</TableHead>
                    <TableHead className="text-right">{t('plans.table.headers.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{plan.patient_full_name || t('plans.table.nameNotInformed')}</div>
                            {plan.patient_age && (
                              <div className="text-sm text-muted-foreground">{plan.patient_age}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={plan.clinical_diagnosis}>
                          {plan.clinical_diagnosis || t('plans.table.notInformed')}
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
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              console.log('Navigating to edit plan:', plan.id);
                              navigate(`/musicotherapy-treatment-plan/${plan.id}`);
                            }}
                            className="gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            {t('plans.table.edit')}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                {t('plans.table.delete')}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('plans.deleteDialog.title')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('plans.deleteDialog.description', { name: plan.patient_full_name || t('plans.table.nameNotInformed') })}
                                  <br />
                                  <span className="font-semibold text-destructive">{t('plans.deleteDialog.warning')}</span>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('plans.deleteDialog.cancel')}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(plan.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {t('plans.deleteDialog.confirm')}
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
    </div>
  );
}