import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Award, FileText, Building } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation('profile');
  
  // Enhanced associations list including the new one
  const enhancedAssociations = [
    ...associations,
    t('associations.AMPT-PI')
  ].filter((association, index, arr) => arr.indexOf(association) === index); // Remove duplicates

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          {t('credentials.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="specialty" className="flex items-center gap-2 text-sm font-medium">
            <Award className="h-4 w-4 text-muted-foreground" />
            {t('credentials.specialty')}
          </Label>
          <Input
            id="specialty"
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            disabled={!isEditing}
            className={isEditing ? "border-purple-200 focus:border-purple-500 dark:border-purple-800 dark:focus:border-purple-400" : "bg-muted"}
            placeholder={t('credentials.placeholders.specialty')}
          />
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Building className="h-4 w-4 text-muted-foreground" />
            {t('credentials.association')}
          </Label>
          
          <Select
            disabled={!isEditing}
            value={formData.association}
            onValueChange={(value) => setFormData({ ...formData, association: value })}
          >
            <SelectTrigger className={isEditing ? "border-purple-200 focus:border-purple-500 dark:border-purple-800 dark:focus:border-purple-400" : "bg-muted"}>
              <SelectValue placeholder={t('credentials.placeholders.association')} />
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
              {t('credentials.register')}
            </Label>
            <Input
              id="register"
              value={formData.register}
              onChange={(e) => setFormData({ ...formData, register: e.target.value })}
              disabled={!isEditing}
              className={isEditing ? "border-purple-200 focus:border-purple-500 dark:border-purple-800 dark:focus:border-purple-400" : "bg-muted"}
              placeholder={t('credentials.placeholders.register')}
            />
          </div>

          {formData.association && formData.register && !isEditing && (
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                  {t('credentials.verified')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('credentials.validRegistration')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
