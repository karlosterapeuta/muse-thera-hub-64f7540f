
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, Edit, Calendar, User } from "lucide-react";
import { 
  generateAnamnesisPortrait, 
  formatNameFromEmail, 
  ANAMNESIS_SECTIONS, 
  TEXT_FIELDS,
  type AnamnesisData,
  type ProfessionalData
} from "../utils/anamnesisAgeneration";

type AnamnesisItem = {
  id: string;
  patient_id: string;
  created_at: string;
  updated_at: string;
  patient_name?: string;
  main_clinical_demand?: string;
};

interface AnamnesisViewProps {
  anamnesis: AnamnesisItem;
  onBack: () => void;
  onEdit: (anamnesisId: string, patientId: string) => void;
}

export function AnamnesisView({ anamnesis, onBack, onEdit }: AnamnesisViewProps) {
  const [anamnesisData, setAnamnesisData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [professional, setProfessional] = useState<ProfessionalData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAnamnesisData();
    loadProfessionalData();
  }, [anamnesis.id]);

  const loadAnamnesisData = async () => {
    try {
      setIsLoading(true);
      
      console.log('Carregando dados da anamnese:', anamnesis.id);
      
      const { data, error } = await supabase
        .from("anamnesis")
        .select("*")
        .eq("id", anamnesis.id)
        .single();

      if (error) {
        console.error("Erro ao carregar dados da anamnese:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da anamnese.",
          variant: "destructive",
        });
        return;
      }

      console.log('Dados da anamnese carregados:', data);
      setAnamnesisData(data);
    } catch (error) {
      console.error("Erro ao carregar dados da anamnese:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da anamnese.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadProfessionalData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setProfessional({
        email: user.email || '',
        name: formatNameFromEmail(user.email || '')
      });
    } catch (error) {
      console.error('Erro ao carregar dados do profissional:', error);
      setProfessional({
        email: 'profissional@musetera.app',
        name: 'Profissional'
      });
    }
  };

  const generatePDF = async () => {
    if (!professional) {
      toast({
        title: "Erro",
        description: "Dados do profissional não carregados.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingPDF(true);
      console.log('Iniciando geração de PDF da anamnese');
      
      const anamnesisForPDF: AnamnesisData = {
        ...anamnesisData,
        patient_name: anamnesis.patient_name,
        id: anamnesis.id,
        created_at: anamnesis.created_at
      };
      
      const success = await generateAnamnesisPortrait(anamnesisForPDF, professional);
      
      if (success) {
        toast({
          title: "Sucesso",
          description: "PDF gerado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível gerar o PDF.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Visualizar Anamnese</h1>
            <p className="text-gray-600">Paciente: {anamnesis.patient_name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onEdit(anamnesis.id, anamnesis.patient_id)}
            className="flex items-center gap-2"
          >
            <Edit size={16} />
            Editar
          </Button>
          <Button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Gerando...
              </>
            ) : (
              <>
                <Download size={16} />
                Baixar PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data de Criação</p>
                <p className="font-semibold">{formatDate(anamnesis.created_at)}</p>
              </div>
              <Calendar className="text-blue-500" size={20} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Última Atualização</p>
                <p className="font-semibold">{formatDate(anamnesis.updated_at)}</p>
              </div>
              <Calendar className="text-green-500" size={20} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ID do Paciente</p>
                <Badge variant="secondary">{anamnesis.patient_id.slice(-8)}</Badge>
              </div>
              <User className="text-purple-500" size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Anamnese</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Dados Pessoais */}
            {TEXT_FIELDS.some(field => anamnesisData[field.key]) && (
              <div>
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TEXT_FIELDS.map((field, index) => {
                    if (!anamnesisData[field.key]) return null;
                    return (
                      <div key={index} className={field.key === 'main_clinical_demand' ? 'md:col-span-2' : ''}>
                        <p className="text-sm font-medium text-gray-700">{field.label}</p>
                        <p className="text-gray-900">{anamnesisData[field.key]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Show a summary of checked items */}
            <div>
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Aspectos Avaliados</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(anamnesisData)
                  .filter(([key, value]) => 
                    typeof value === 'boolean' && 
                    value === true &&
                    !['id', 'patient_id', 'professional_id', 'created_at', 'updated_at'].includes(key)
                  )
                  .map(([key]) => (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))
                }
              </div>
              {Object.entries(anamnesisData).filter(([key, value]) => 
                typeof value === 'boolean' && value === true
              ).length === 0 && (
                <p className="text-gray-500 italic">Nenhum aspecto específico foi marcado nesta anamnese.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
