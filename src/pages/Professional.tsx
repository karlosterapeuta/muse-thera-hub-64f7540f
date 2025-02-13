
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Pen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

export default function Professional() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "JOSÉ CARLOS BATISTA",
    register: "100-90",
    phone: "(11) 99999-9999",
    email: "jose.batista@example.com",
    specialty: "MUSICOTERAPEUTA"
  });
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      // Aqui você implementará a lógica para salvar no Supabase
      toast({
        title: "Sucesso!",
        description: "Dados atualizados com sucesso.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 animate-fadeIn">
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Avatar className="w-32 h-32">
            <AvatarImage src="/lovable-uploads/2d7fe17c-c370-4c99-8211-c3e8f49ad3d1.png" alt="Foto do Profissional" />
            <AvatarFallback>MT</AvatarFallback>
          </Avatar>
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
            <Label>Nº de Registro (MT)</Label>
            <Input
              value={formData.register}
              onChange={(e) =>
                setFormData({ ...formData, register: e.target.value })
              }
              disabled={!isEditing}
            />
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
