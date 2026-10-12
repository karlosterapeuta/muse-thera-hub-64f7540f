
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Award, FileText, Building } from "lucide-react";

interface ProfessionalCredentialsCardProps {
  formData: {
    specialty: string;
    association: string;
    register: string;
  };
  setFormData: (data: any) => void;
  isEditing: boolean;
  associations: string[];
}

export function ProfessionalCredentialsCard({ 
  formData, 
  setFormData, 
  isEditing, 
  associations 
}: ProfessionalCredentialsCardProps) {
  // Enhanced associations list including the new one
  const enhancedAssociations = [
    ...associations,
    "Associação de Musicoterapia do Piauí (AMPT-PI)"
  ].filter((association, index, arr) => arr.indexOf(association) === index); // Remove duplicates

  return (
    <Card className="group overflow-hidden rounded-2xl border border-white/10 bg-card/70 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="pb-4 bg-gradient-to-r from-teal500/10 via-teal500/5 to-transparent border-b border-white/10">
        <CardTitle className="flex items-center gap-3 text-lg">
          <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-teal500/15 text-teal600 dark:text-teal300 ring-1 ring-teal400/30">
            <Award className="h-5 w-5" />
          </span>
          Credenciais Profissionais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">

        <div className="space-y-2">
          <Label htmlFor="specialty" className="flex items-center gap-2 text-sm font-medium">
            <Award className="h-4 w-4 text-muted-foreground" />
            Especialidade
          </Label>
          <Input
            id="specialty"
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            disabled={!isEditing}
            className={isEditing ? "border-teal200 focus:border-teal500 dark:border-teal800 dark:focus:border-teal400" : "bg-muted"}
            placeholder="Ex: Musicoterapia Neurológica"
          />
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Building className="h-4 w-4 text-muted-foreground" />
            Associação Profissional
          </Label>
          
          <Select
            disabled={!isEditing}
            value={formData.association}
            onValueChange={(value) => setFormData({ ...formData, association: value })}
          >
            <SelectTrigger className={isEditing ? "border-teal200 focus:border-teal500 dark:border-teal800 dark:focus:border-teal400" : "bg-muted"}>
              <SelectValue placeholder="Selecione uma associação" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {enhancedAssociations.map((association) => (
                <SelectItem key={association} value={association}>
                  {association}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <Label htmlFor="register" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Número de Registro
            </Label>
            <Input
              id="register"
              value={formData.register}
              onChange={(e) => setFormData({ ...formData, register: e.target.value })}
              disabled={!isEditing}
              className={isEditing ? "border-teal200 focus:border-teal500 dark:border-teal800 dark:focus:border-teal400" : "bg-muted"}
              placeholder="Informe seu número de registro"
            />
          </div>

          {formData.association && formData.register && !isEditing && (
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-300">Credenciais Verificadas</span>
              </div>
              <div className="space-y-1">
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-600">
                  {formData.association.split('(')[0].trim()}
                </Badge>
                <p className="text-xs text-green-700 dark:text-green-400">Registro: {formData.register}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
