import { useEffect, useState, createElement } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { DevolutivaPreviewPDF } from "./DevolutivaPreviewPDF";
import { DevolutivaTextPDF } from "./DevolutivaTextPDF";
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
  const [generatingAI, setGeneratingAI] = useState<string | null>(null);
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
      setGeneratingAI(record.id);
      
      toast({
        title: "Gerando PDF Profissional",
        description: "Aguarde enquanto o texto é processado pela IA..."
      });

      // Extrair frases do record e classificar
      const extractPhrases = (text: string) => 
        text ? text.split('. ').filter(p => p.trim()) : [];
      
      const negativeKeywords = [
        'não', 'dificuldade', 'resistência', 'evitou', 'recusou', 
        'baixa', 'regressão', 'desregulação', 'hipersensibilidade',
        'ausente', 'limitado', 'inconsistente', 'pouca', 'pouco'
      ];
      
      const allPhrases = [
        ...extractPhrases(record.content.communication || ''),
        ...extractPhrases(record.content.emotional_regulation || ''),
        ...extractPhrases(record.content.motor_development || ''),
        ...extractPhrases(record.content.sensory_aspects || ''),
        ...extractPhrases(record.content.musical_participation || ''),
        ...extractPhrases(record.content.achievements || '')
      ];
      
      const challenges = extractPhrases(record.content.challenges_resistance || '');
      const positives: string[] = [];
      
      allPhrases.forEach(phrase => {
        const isNegative = negativeKeywords.some(kw => 
          phrase.toLowerCase().includes(kw)
        );
        if (isNegative) {
          challenges.push(phrase);
        } else {
          positives.push(phrase);
        }
      });
      
      // Chamar edge function para gerar texto IA
      const { data, error } = await supabase.functions.invoke('generate-devolutiva-text', {
        body: {
          patientName: record.content.patient_name,
          sessionDate: record.content.session_date,
          sessionNumber: record.content.session_number,
          positives,
          challenges,
          familyGuidelines: extractPhrases(record.content.family_guidelines || '')
        }
      });

      if (error) throw error;

      // Gerar PDF com texto IA
      const pdfData = {
        patient_name: record.content.patient_name,
        session_date: record.content.session_date,
        session_number: record.content.session_number,
        professional_name: record.content.professional_name,
        professional_registry: record.content.professional_registry,
        aiContent: data.content
      };

      const component = createElement(DevolutivaTextPDF, { data: pdfData });
      
      const success = await generateReactPDF(component, {
        filename: `Devolutiva_${record.content.patient_name}_Sessao_${record.content.session_number}.pdf`,
        format: 'a4',
        orientation: 'portrait'
      });

      if (success) {
        toast({
          title: "PDF profissional gerado!",
          description: "O relatório com linguagem técnica foi baixado."
        });
      }
    } catch (error) {
      console.error('Error generating AI PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o documento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setGeneratingAI(null);
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
                    onClick={() => handleDownload(record)}
                    disabled={generatingAI === record.id}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                  >
                    {generatingAI === record.id ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar PDF
                      </>
                    )}
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
