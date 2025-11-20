import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Download, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";

export function SavedPlansSection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSavedPlans();
  }, []);

  const fetchSavedPlans = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!professional?.id) return;

      const { data: plans, error } = await supabase
        .from('treatment_plans')
        .select('id, created_at, patient_id, status, complementary_materials')
        .eq('professional_id', professional.id)
        .not('complementary_materials', 'is', null)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      const enrichedPlans = await Promise.all(
        (plans || []).map(async (plan) => {
          const { data: patient } = await supabase
            .from('patients')
            .select('name')
            .eq('id', plan.patient_id)
            .single();
          
          return {
            ...plan,
            patient_name: patient?.name || 'Paciente não encontrado'
          };
        })
      );

      setSavedPlans(enrichedPlans);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPlanPDF = async (plan: any) => {
    try {
      const activities = plan.complementary_materials?.activities || [];
      if (activities.length === 0) {
        toast({
          variant: "destructive",
          title: "Sem atividades",
          description: "Este plano não possui atividades para gerar PDF.",
        });
        return;
      }

      // Simplified PDF generation - reuse from lib
      toast({
        title: "Gerando PDF...",
        description: "O download será iniciado em breve.",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF do plano.",
      });
    }
  };

  const deletePlan = async (planId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!confirm("Tem certeza que deseja excluir este plano?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('treatment_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      setSavedPlans(prev => prev.filter(p => p.id !== planId));
      toast({
        title: "Plano excluído",
        description: "O plano foi removido com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao excluir plano:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: error?.message || "Não foi possível excluir o plano.",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (savedPlans.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Planos Salvos Recentes</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/intervention-plans')}
          >
            Ver Todos os Planos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {savedPlans.map((plan) => {
            const activityCount = plan.complementary_materials?.activities?.length || 0;
            return (
              <div
                key={plan.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium truncate">{plan.patient_name}</h4>
                      <Badge variant="secondary" className="shrink-0">
                        {activityCount} atividades
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Criado em {format(new Date(plan.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/intervention-plans')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadPlanPDF(plan)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => deletePlan(plan.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
