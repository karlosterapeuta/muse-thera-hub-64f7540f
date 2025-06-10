
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  generateAnamnesisPortrait, 
  formatNameFromEmail, 
  ANAMNESIS_SECTIONS, 
  TEXT_FIELDS,
  type AnamnesisData,
  type ProfessionalData
} from "@/pages/anamnesis/utils/anamnesisAgeneration";

type Patient = {
  id: string;
  name: string;
};

type Anamnesis = {
  id: string;
  created_at: string;
  updated_at: string;
  professional_id: string;
  patient_id: string;
  legal_guardian?: string | null;
  family_relationship?: string | null;
  referral_professional?: string | null;
  main_clinical_demand?: string | null;
  therapeutic_goals?: string | null;
  treatment_approach?: string | null;
  current_medication?: string | null;
  school_enrollment?: string | null;
  school_adaptation?: string | null;
  extracurricular_activities?: string | null;
  [key: string]: any;
};

interface ViewAnamnesisDialogProps {
  patient: Patient;
  closeModal: () => void;
  onEdit?: (anamnesis: Anamnesis) => void;
}

export function ViewAnamnesisDialog({ patient, closeModal, onEdit }: ViewAnamnesisDialogProps) {
  const [anamnesis, setAnamnesis] = useState<Anamnesis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [professional, setProfessional] = useState<ProfessionalData | null>(null);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  useEffect(() => {
    const loadAnamnesis = async () => {
      try {
        setIsLoading(true);
        
        console.log('Carregando anamnese para paciente:', patient.id);
        
        const { data, error } = await supabase
          .from("anamnesis")
          .select("*")
          .eq("patient_id", patient.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error("Erro ao carregar anamnese:", error);
          throw error;
        }

        if (data) {
          console.log('Anamnese carregada:', data);
          setAnamnesis(data);
          
          // Load professional data
          try {
            const { data: authData } = await supabase.auth.getUser();
            
            if (authData.user) {
              setProfessional({
                email: authData.user.email || '',
                name: formatNameFromEmail(authData.user.email || '')
              });
            } else {
              setProfessional({
                email: 'profissional@musetera.app',
                name: 'Profissional'
              });
            }
          } catch (userError) {
            console.error("Error fetching user data:", userError);
            setProfessional({
              email: 'profissional@musetera.app',
              name: 'Profissional'
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar anamnese:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da anamnese.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAnamnesis();
  }, [patient.id, toast]);

  const renderCheckboxSections = () => {
    if (!anamnesis) return null;

    return ANAMNESIS_SECTIONS.map((section, index) => {
      const selectedFields = section.fields.filter(field => anamnesis[field.id] === true);
      
      if (selectedFields.length === 0) return null;
      
      return (
        <div key={index} className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">{section.title}</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            {selectedFields.map((field, idx) => (
              <span key={idx} className="inline-flex items-center mr-2 mb-2 px-2 py-1 bg-white border border-gray-200 rounded-md text-sm">
                {field.label}
              </span>
            ))}
          </div>
        </div>
      );
    });
  };

  const renderTextFields = () => {
    if (!anamnesis) return null;

    return TEXT_FIELDS.map((field, index) => {
      if (!anamnesis[field.key]) return null;
      
      return (
        <div key={index} className="mb-4">
          <h3 className="text-md font-semibold text-gray-700 mb-1">{field.label}</h3>
          <div className="bg-gray-50 p-3 rounded-md text-sm">{anamnesis[field.key]}</div>
        </div>
      );
    });
  };

  const generatePDF = async () => {
    if (!anamnesis || !professional) {
      toast({
        title: "Erro",
        description: "Dados insuficientes para gerar o PDF.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGeneratingPDF(true);
      console.log('Iniciando geração de PDF com dados:', { anamnesis, professional });
      
      const anamnesisData: AnamnesisData = {
        ...anamnesis,
        patient_name: patient.name
      };
      
      const success = await generateAnamnesisPortrait(anamnesisData, professional);
      
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!anamnesis) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma anamnese encontrada para este paciente.</p>
        <Button 
          onClick={closeModal} 
          className="mt-4"
        >
          Fechar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto p-1">
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b">
          <div>
            <h3 className="font-medium text-gray-700">
              Data do registro: {formatDate(anamnesis.created_at)}
            </h3>
          </div>
        </div>
        
        {renderTextFields()}
        {renderCheckboxSections()}
        
        <div className="pt-4 flex justify-end space-x-4 border-t mt-4">
          <Button variant="outline" onClick={closeModal}>
            Fechar
          </Button>
          {onEdit && (
            <Button 
              onClick={() => onEdit(anamnesis)} 
              variant="outline" 
              className="hover:text-primary"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          <Button 
            onClick={generatePDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
