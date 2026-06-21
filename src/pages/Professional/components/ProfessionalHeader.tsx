
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Camera, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white shadow-2xl">
      {/* Decorative glows */}
      <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-pink-400/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_55%)]" />

      <div className="relative p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-white/40 to-transparent blur-md opacity-60" />
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white/40 shadow-2xl ring-4 ring-white/10">
                <AvatarImage src={avatarUrl || ""} alt="Foto do Profissional" />
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
              <div className="inline-flex items-center gap-2 mb-3 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm ring-1 ring-white/20">
                <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Musicoterapeuta Profissional
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">
                {name || "Nome do Profissional"}
              </h1>
              <p className="text-base md:text-lg text-white/85">
                {specialty || "Especialidade em Musicoterapia"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {association && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                  {association.split('(')[0].trim()}
                </Badge>
              )}
              <Badge variant="secondary" className="bg-emerald-400/25 text-white border-emerald-200/40 hover:bg-emerald-400/35 backdrop-blur-sm">
                ✓ Verificado
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                Ativo
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
