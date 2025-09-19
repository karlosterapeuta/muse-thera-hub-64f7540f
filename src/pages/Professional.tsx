
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { useQueryClient } from "@tanstack/react-query";
import { ProfessionalHeader } from "./Professional/components/ProfessionalHeader";
import { PersonalInfoCard } from "./Professional/components/PersonalInfoCard";
import { ProfessionalCredentialsCard } from "./Professional/components/ProfessionalCredentialsCard";
import { ActionButtons } from "./Professional/components/ActionButtons";

interface ProfessionalData {
  id?: string;
  user_id?: string;
  name: string;
  register: string;
  phone: string;
  email: string;
  specialty: string;
  association: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export default function Professional() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<ProfessionalData | null>(null);
  const [formData, setFormData] = useState<ProfessionalData>({
    name: "",
    register: "",
    phone: "",
    email: "",
    specialty: "",
    association: ""
  });
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { data: professional, isLoading, error, refetch } = useProfessionalData();

  const associations = [
    "Associação de Musicoterapia do Paraná (AMT-PR)",
    "Associação de Musicoterapia do Rio Grande do Sul (AMT-RS)",
    "Associação de Profissionais e Estudantes de Musicoterapia do Estado de São Paulo (APEMESP)",
    "Associação de Profissionais e Estudantes de Musicoterapia do Estado de Minas Gerais (APEMEMG)",
    "Associação de Musicoterapia do Estado do Rio de Janeiro (AMT-RJ)",
    "Associação de Musicoterapia da Paraíba (AMT-PB)",
    "Associação de Musicoterapia de Pernambuco (AMT-PE)",
    "Associação de Profissionais e Estudantes de Musicoterapia do Estado do Pará (APEMTEPA)",
    "Associação Baiana de Musicoterapia (ASBAMT)",
    "Associação de Musicoterapeutas do Espírito Santo (AMTES)",
    "Associação Goiana de Musicoterapia (AGMT)",
    "Associação de Musicoterapia do Distrito Federal (AMT-DF)",
    "Associação Catarinense de Musicoterapeutas (ACAMT)",
    "Associação Brasileira de Musicoterapeutas (ABMT)",
    "Associação cearense de Musicoterapia AMT -CE",
  ];

  // Initialize form data when professional data is loaded
  useEffect(() => {
    if (professional) {
      const dataToSet = {
        name: professional.name || '',
        register: professional.register || '',
        phone: professional.phone || '',
        email: professional.email || '',
        specialty: professional.specialty || '',
        association: professional.association || ''
      };
      setFormData(dataToSet);
      setOriginalData(dataToSet);
      setAvatarUrl(professional.avatar_url || null);
    }
  }, [professional]);

  // Handle error states
  useEffect(() => {
    if (error) {
      console.error('Erro ao carregar dados profissionais:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do profissional.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado.",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('professionals')
        .update({
          avatar_url: publicUrl
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      
      // Invalidate cache to refresh data
      queryClient.invalidateQueries({ queryKey: ["professional-data"] });
      
      toast({
        title: "Sucesso!",
        description: "Imagem atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a imagem.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('professionals')
        .update({
          ...formData,
          avatar_url: avatarUrl
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error saving data:', error);
        throw error;
      }

      setOriginalData(formData);
      
      // Invalidate cache to refresh data
      queryClient.invalidateQueries({ queryKey: ["professional-data"] });
      
      toast({
        title: "Sucesso!",
        description: "Dados atualizados com sucesso.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Carregando perfil profissional...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600">Erro ao carregar dados profissionais</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className={`mx-auto p-4 space-y-8 animate-fade-in ${isMobile ? 'max-w-full px-2' : 'max-w-4xl'}`}>
        <ProfessionalHeader
          avatarUrl={avatarUrl}
          isEditing={isEditing}
          name={formData.name}
          specialty={formData.specialty}
          association={formData.association}
          onAvatarChange={handleAvatarChange}
        />

        <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          <PersonalInfoCard
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
          />

          <ProfessionalCredentialsCard
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            associations={associations}
          />
        </div>

        <ActionButtons
          isEditing={isEditing}
          isLoading={isSaving}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
