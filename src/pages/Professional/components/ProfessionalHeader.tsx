import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Camera, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ProfessionalHeaderProps {
  avatarUrl: string | null;
  isEditing: boolean;
  name: string;
  specialty: string;
  association: string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfessionalHeader({ 
  avatarUrl, 
  isEditing, 
  name, 
  specialty, 
  association,
  onAvatarChange 
}: ProfessionalHeaderProps) {
  const { t } = useTranslation('profile');

  const getInitials = () => {
    if (!name) return "MT";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white/30 shadow-2xl">
                <AvatarImage src={avatarUrl || ""} alt={t('header.avatarAlt')} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 text-white hover:bg-white/20 rounded-full"
                      asChild
                    >
                      <div>
                        <Camera className="h-6 w-6" />
                      </div>
                    </Button>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onAvatarChange}
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2">
              <div className="bg-green-500 p-2 rounded-full border-2 border-white shadow-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                  {t('header.professionalTitle')}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {name || t('header.defaultName')}
              </h1>
              <p className="text-lg opacity-90 mb-4">
                {specialty || t('header.defaultSpecialty')}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {association && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {association.split('(')[0].trim()}
                </Badge>
              )}
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                {t('header.verified')}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                {t('header.active')}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
