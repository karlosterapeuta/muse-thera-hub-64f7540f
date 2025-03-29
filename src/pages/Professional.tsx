
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Pen, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define a type for the professional data to ensure TypeScript recognizes all fields
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
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfessionalData>({
    name: "",
    register: "",
    phone: "",
    email: "",
    specialty: "",
    association: ""
  });
  const { toast } = useToast();

  // List of Brazilian music therapy associations
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
  ];

  useEffect(() => {
    loadProfessionalData();
  }, []);

  const loadProfessionalData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado.",
          variant: "destructive",
        });
        return;
      }

      // Primeiro tenta encontrar o registro existente
      let { data: existingProfile, error: fetchError } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Erro ao buscar dados:', fetchError);
        throw fetchError;
      }

      let finalData: ProfessionalData | null = null;

      // Se não existir perfil, cria um novo
      if (!existingProfile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('professionals')
          .upsert({
            user_id: user.id,
            name: '',
            register: '',
            phone: '',
            email: user.email || '',
            specialty: '',
            association: ''
          })
          .select()
          .single();

        if (insertError) {
          console.error('Erro ao criar perfil:', insertError);
          throw insertError;
        }

        finalData = newProfile as ProfessionalData;
      } else {
        // Ensure association exists in the existing profile data
        finalData = {
          ...existingProfile,
          association: existingProfile.association || ''
        };
      }

      if (finalData) {
        setFormData({
          name: finalData.name || '',
          register: finalData.register || '',
          phone: finalData.phone || '',
          email: finalData.email || '',
          specialty: finalData.specialty || '',
          association: finalData.association || ''
        });
        setAvatarUrl(finalData.avatar_url);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do profissional.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

      // Upload image
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update professional record
      const { error: updateError } = await supabase
        .from('professionals')
        .update({
          avatar_url: publicUrl
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
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

      if (error) throw error;

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
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 animate-fadeIn">
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={avatarUrl || ""} alt="Foto do Profissional" />
              <AvatarFallback>MT</AvatarFallback>
            </Avatar>
            {isEditing && (
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100"
              >
                <Camera className="h-5 w-5 text-gray-600" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            )}
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Musicoterapeuta</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              className="text-green-600 hover:text-green-700"
            >
              <Pen className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label>Associações</Label>
            <div className="space-y-4">
              <Select
                disabled={!isEditing}
                value={formData.association}
                onValueChange={(value) => setFormData({ ...formData, association: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma associação" />
                </SelectTrigger>
                <SelectContent>
                  {associations.map((association) => (
                    <SelectItem key={association} value={association}>
                      {association}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div>
                <Label htmlFor="register">Nº de Registro</Label>
                <Input
                  id="register"
                  value={formData.register}
                  onChange={(e) => setFormData({ ...formData, register: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Informe seu número de registro"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Especialidade</Label>
            <Input
              value={formData.specialty}
              onChange={(e) =>
                setFormData({ ...formData, specialty: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={!isEditing}
              type="email"
            />
          </div>

          {isEditing && (
            <Button
              className="w-full"
              onClick={handleSave}
            >
              Salvar Alterações
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
