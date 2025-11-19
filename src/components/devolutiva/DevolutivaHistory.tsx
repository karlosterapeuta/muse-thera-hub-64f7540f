import { useEffect, useState, createElement } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { DevolutivaPreviewPDF } from "./DevolutivaPreviewPDF";
import { generateReactPDF } from "@/utils/reactPDFGenerator";

interface DevolutivaRecord {
  id: string;
  created_at: string;
  content: {
    patient_name: string;
    session_date: string;
    session_number: number;
    communication?: string;
    emotional_regulation?: string;
    motor_development?: string;
    sensory_aspects?: string;
    musical_participation?: string;
    achievements?: string;
    family_guidelines?: string;
    next_steps?: string;
    general_observations?: string;
    challenges_resistance?: string;
    professional_name: string;
    professional_registry: string;
    report_subtype?: string;
  };
}

export function DevolutivaHistory() {
  const [records, setRecords] = useState<DevolutivaRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!professional) return;

      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('professional_id', professional.id)
        .eq('type', 'musicoterapia' as any)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter devolutiva_tea reports on client side
      const devolutivaRecords = (data || []).filter(
        (record: any) => record.content?.report_subtype === 'devolutiva_tea'
      );
      setRecords(devolutivaRecords as any);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de devolutivas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (record: DevolutivaRecord) => {
    try {
      toast({
        title: "Gerando PDF",
        description: "Aguarde enquanto o documento é preparado..."
      });

      // Preparar dados para o PDF
      const pdfData = {
        patient_name: record.content.patient_name,
        session_date: record.content.session_date,
        session_number: record.content.session_number,
        communication: record.content.communication || '',
        emotional_regulation: record.content.emotional_regulation || '',
        motor_development: record.content.motor_development || '',
        sensory_aspects: record.content.sensory_aspects || '',
        musical_participation: record.content.musical_participation || '',
        achievements: record.content.achievements || '',
        family_guidelines: record.content.family_guidelines || '',
        next_steps: record.content.next_steps || '',
        general_observations: record.content.general_observations || '',
        challenges_resistance: record.content.challenges_resistance || '',
        professional_name: record.content.professional_name,
        professional_registry: record.content.professional_registry
      };

      // Gerar PDF usando o componente com estilos inline
      const component = createElement(DevolutivaPreviewPDF, { data: pdfData });
      
      const success = await generateReactPDF(component, {
        filename: `Devolutiva_${record.content.patient_name}_Sessao_${record.content.session_number}.pdf`,
        format: 'a4',
        orientation: 'portrait'
      });

      if (success) {
        toast({
          title: "PDF gerado com sucesso!",
          description: "O arquivo foi baixado para seu computador."
        });
      } else {
        throw new Error('Falha na geração do PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o documento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const filteredRecords = records.filter(record =>
    record.content.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome do paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma devolutiva encontrada</p>
              {searchTerm && (
                <p className="text-sm mt-2">Tente ajustar sua busca</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-lg">{record.content.patient_name}</p>
                      <p className="text-sm font-normal text-muted-foreground">
                        Sessão #{record.content.session_number}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(record)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(record.content.session_date), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>
                      Criado em {format(new Date(record.created_at), 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
