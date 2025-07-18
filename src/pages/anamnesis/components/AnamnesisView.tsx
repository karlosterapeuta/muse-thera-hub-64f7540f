import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, Edit, Calendar, User } from "lucide-react";
import { generateProfessionalAnamnesePDF } from "@/utils/anamnesisePDFGenerator";

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
  const { toast } = useToast();

  useEffect(() => {
    loadAnamnesisData();
  }, [anamnesis.id]);

  const loadAnamnesisData = async () => {
    try {
      setIsLoading(true);
      
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

      setAnamnesisData(data);
      
      // Debug logs para verificar os dados da História Sonora e Musical
      console.log("🔍 Dados carregados da anamnese:", data);
      console.log("🎵 História Sonora - pregnancy_sound_experiences:", data.pregnancy_sound_experiences);
      console.log("🎵 História Sonora - mother_movements_songs:", data.mother_movements_songs);
      console.log("🎵 História Sonora - childhood_sound_environment:", data.childhood_sound_environment);
      console.log("🎵 História Sonora - parents_sound_reactions:", data.parents_sound_reactions);
      console.log("🎵 História Sonora - typical_house_sounds:", data.typical_house_sounds);
      console.log("🎵 História Sonora - night_body_sounds:", data.night_body_sounds);
      console.log("🎵 História Sonora - family_musical_history:", data.family_musical_history);
      console.log("🎵 História Sonora - patient_musical_history:", data.patient_musical_history);
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

  const generatePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Get complete professional data from the professionals table
      const { data: { user } } = await supabase.auth.getUser();
      let professionalData = {
        name: 'Profissional',
        email: 'profissional@musetera.app',
        specialty: '',
        phone: '',
        register: '',
        license_number: '',
        association: ''
      };

      if (user) {
        // Try to fetch professional data from the professionals table
        const { data: professional, error } = await supabase
          .from('professionals')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (professional && !error) {
          professionalData = {
            name: professional.name || formatNameFromEmail(user.email || ''),
            email: professional.email || user.email || 'profissional@musetera.app',
            specialty: professional.specialty || '',
            phone: professional.phone || '',
            register: professional.register || '',
            license_number: professional.license_number || '',
            association: professional.association || ''
          };
        } else {
          // Fallback to user data if professional not found
          professionalData.name = formatNameFromEmail(user.email || '');
          professionalData.email = user.email || 'profissional@musetera.app';
        }
      }

      // Ensure we have the required created_at field and structure the data properly
      const formattedAnamnesisData = {
        ...anamnesisData,
        created_at: anamnesisData.created_at || anamnesis.created_at,
        patient_name: anamnesis.patient_name
      };

      const success = await generateProfessionalAnamnesePDF(
        formattedAnamnesisData,
        professionalData,
        anamnesis.patient_name || 'Paciente'
      );

      if (success) {
        toast({
          title: "Sucesso",
          description: "PDF profissional gerado com sucesso!",
        });
      } else {
        throw new Error("Falha na geração do PDF");
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const formatNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGeneratingPDF ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Gerando PDF...
              </>
            ) : (
              <>
                <Download size={16} />
                Baixar PDF Profissional
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
            {(anamnesisData.legal_guardian || anamnesisData.family_relationship || 
              anamnesisData.referral_professional || anamnesisData.main_clinical_demand) && (
              <div>
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anamnesisData.legal_guardian && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Responsável Legal</p>
                      <p className="text-gray-900">{anamnesisData.legal_guardian}</p>
                    </div>
                  )}
                  {anamnesisData.family_relationship && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Parentesco</p>
                      <p className="text-gray-900">{anamnesisData.family_relationship}</p>
                    </div>
                  )}
                  {anamnesisData.referral_professional && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Profissional que Encaminhou</p>
                      <p className="text-gray-900">{anamnesisData.referral_professional}</p>
                    </div>
                  )}
                  {anamnesisData.main_clinical_demand && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700">Demanda Clínica Principal</p>
                      <p className="text-gray-900">{anamnesisData.main_clinical_demand}</p>
                    </div>
                  )}
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
