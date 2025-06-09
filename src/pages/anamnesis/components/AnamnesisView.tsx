
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, Edit, Calendar, User } from "lucide-react";
import html2pdf from "html2pdf.js";

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
      
      const element = document.createElement('div');
      
      const generateContentHTML = (content: Record<string, any>) => {
        const renderSection = (title: string, items: { id: string, label: string }[]) => {
          const checkedItems = items
            .filter(item => content[item.id])
            .map(item => item.label)
            .join(", ");
          
          return checkedItems ? `
            <div style="margin-bottom: 8px;">
              <div style="font-weight: 600; font-size: 13px; margin-bottom: 3px; color: #374151;">
                ${title}
              </div>
              <div style="background-color: #F9FAFB; padding: 6px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 12px; line-height: 1.3; color: #1F2937;">
                ${checkedItems}
              </div>
            </div>
          ` : '';
        };

        const sections = [
          {
            title: "Dados Pessoais",
            textFields: [
              { key: "legal_guardian", label: "Responsável Legal" },
              { key: "family_relationship", label: "Parentesco" },
              { key: "referral_professional", label: "Profissional que Encaminhou" },
              { key: "main_clinical_demand", label: "Demanda Clínica Principal" }
            ]
          },
          {
            title: "Histórico Musical",
            checkboxes: [
              { id: "musical_education", label: "Educação Musical" },
              { id: "instrumental_practice", label: "Prática Instrumental" },
              { id: "body_musical_expression", label: "Expressão Corporal Musical" },
              { id: "vocal_expression", label: "Expressão Vocal" },
              { id: "choral_activities", label: "Atividades Corais" },
              { id: "no_musical_experience", label: "Sem Experiência Musical" }
            ]
          }
          // Add more sections as needed
        ];

        return sections.map(section => {
          let sectionContent = '';
          
          if (section.textFields) {
            sectionContent = section.textFields
              .filter(field => content[field.key])
              .map(field => `
                <div style="margin-bottom: 8px;">
                  <div style="font-weight: 600; font-size: 13px; margin-bottom: 3px; color: #374151;">
                    ${field.label}
                  </div>
                  <div style="background-color: #F9FAFB; padding: 6px; border-radius: 4px; border: 1px solid #E5E7EB; font-size: 12px; line-height: 1.3; color: #1F2937;">
                    ${content[field.key]}
                  </div>
                </div>
              `).join('');
          }

          if (section.checkboxes) {
            sectionContent = renderSection(section.title, section.checkboxes);
          }

          if (sectionContent) {
            return `
              <div style="margin-bottom: 16px;">
                <h2 style="color: #1F2937; font-size: 15px; font-weight: 600; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 2px solid #E5E7EB;">
                  ${section.title}
                </h2>
                ${sectionContent}
              </div>
            `;
          }
          return '';
        }).join('');
      };

      element.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #E5E7EB;">
            <h1 style="color: #2563EB; font-size: 24px; font-weight: bold; margin-bottom: 12px;">
              Anamnese Musicoterapêutica
            </h1>
            <h2 style="color: #1F2937; font-size: 18px; margin-bottom: 6px;">
              Paciente: ${anamnesis.patient_name}
            </h2>
            <p style="color: #6B7280; font-size: 13px;">
              Data da Avaliação: ${new Date(anamnesis.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div style="margin-bottom: 24px;">
            ${generateContentHTML(anamnesisData)}
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #E5E7EB; text-align: center;">
            <p style="color: #6B7280; font-size: 11px; margin-bottom: 4px;">
              Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
            </p>
            <p style="color: #6B7280; font-size: 11px;">
              Musetera - Sistema de Gestão para Musicoterapia
            </p>
          </div>
        </div>
      `;

      const opt = {
        margin: [20, 20, 20, 20],
        filename: `Anamnese - ${anamnesis.patient_name}.pdf`,
        pagebreak: { mode: 'avoid-all' },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff',
        },
      };

      await html2pdf().from(element).set(opt).save();
      
      toast({
        title: "Sucesso",
        description: "PDF gerado com sucesso!",
      });
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
