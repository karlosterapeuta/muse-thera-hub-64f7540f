
import { useState } from "react";
import { Camera, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfessionalData } from "@/hooks/useProfessionalData";
import { useQueryClient } from "@tanstack/react-query";

interface ProfessionalAvatarProps {
  size?: "sm" | "md" | "lg";
  editable?: boolean;
}

export function ProfessionalAvatar({ size = "md", editable = false }: ProfessionalAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { data: professional } = useProfessionalData();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20"
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 2MB.",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Create file path with user ID
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('professional-avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('professional-avatars')
        .getPublicUrl(fileName);

      // Update professional record
      const { error: updateError } = await supabase
        .from('professionals')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh professional data
      queryClient.invalidateQueries({ queryKey: ["professional-data"] });

      toast({
        title: "Sucesso!",
        description: "Foto atualizada com sucesso.",
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a foto.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = () => {
    if (!professional?.name) return "MT";
    return professional.name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative group">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage 
          src={professional?.avatar_url || ""} 
          alt={professional?.name || "Profissional"} 
        />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      {editable && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              disabled={isUploading}
              asChild
            >
              <div>
                {isUploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </div>
            </Button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
