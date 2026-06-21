
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone } from "lucide-react";

interface PersonalInfoCardProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  setFormData: (data: any) => void;
  isEditing: boolean;
}

export function PersonalInfoCard({ formData, setFormData, isEditing }: PersonalInfoCardProps) {
  return (
    <Card className="group overflow-hidden border-border/60 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-500/10 to-transparent border-b border-border/40">
        <CardTitle className="flex items-center gap-3 text-lg">
          <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
            <User className="h-5 w-5" />
          </span>
          Informações Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">

        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-muted-foreground" />
            Nome Completo
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!isEditing}
            className={isEditing ? "border-blue-200 focus:border-blue-500 dark:border-blue-800 dark:focus:border-blue-400" : "bg-muted"}
            placeholder="Digite seu nome completo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={!isEditing}
            className={isEditing ? "border-blue-200 focus:border-blue-500 dark:border-blue-800 dark:focus:border-blue-400" : "bg-muted"}
            placeholder="seu.email@exemplo.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4 text-muted-foreground" />
            Telefone
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!isEditing}
            className={isEditing ? "border-blue-200 focus:border-blue-500 dark:border-blue-800 dark:focus:border-blue-400" : "bg-muted"}
            placeholder="(11) 99999-9999"
          />
        </div>
      </CardContent>
    </Card>
  );
}
