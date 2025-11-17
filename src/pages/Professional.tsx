
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation('profile');

  const associations = [
    t('associations.AMT-PR'),
    t('associations.AMT-RS'),
    t('associations.APEMESP'),
    t('associations.APEMEMG'),
    t('associations.AMT-RJ'),
    t('associations.AMT-PB'),
    t('associations.AMT-PE'),
    t('associations.APEMTEPA'),
    t('associations.ASBAMT'),
    t('associations.AMTES'),
    t('associations.AGMT'),
    t('associations.AMT-DF'),
    t('associations.ACAMT'),
    t('associations.ABMT'),
    t('associations.AMT-CE'),
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
        title: t('common:messages.error'),
        description: t('error.loadData'),
        variant: "destructive",
      });
    }
  }, [error, toast, t]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: t('common:messages.error'),
          description: t('error.unauthenticated'),
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
        title: t('success.title'),
        description: t('success.avatarUpdated'),
      });
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
      toast({
        title: t('common:messages.error'),
        description: t('error.updateAvatar'),
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
          title: t('common:messages.error'),
          description: t('error.unauthenticated'),
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
        title: t('success.title'),
        description: t('success.dataUpdated'),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: t('common:messages.error'),
        description: t('error.saveChanges'),
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
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600">{t('error.loadingError')}</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {t('actions.tryAgain')}
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
