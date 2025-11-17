import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Patient = {
  id: string;
  name: string;
  age: number | null;
  responsible: string | null;
  contact: string | null;
  has_anamnesis?: boolean;
};

interface PatientCardProps {
  patient: Patient;
  onEdit: () => void;
  onDelete: () => void;
  onViewAnamnesis: () => void;
  onEditAnamnesis?: () => void;
}

export function PatientCard({ patient, onEdit, onDelete, onViewAnamnesis, onEditAnamnesis }: PatientCardProps) {
  const { t } = useTranslation(['patients', 'common']);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold truncate">{patient.name}</h3>
            <div className="space-y-1 mt-2 text-sm text-muted-foreground">
              <p>{t('patients:form.age')}: {patient.age !== null ? `${patient.age} ${t('common:years')}` : "N/A"}</p>
              <p className="truncate">{t('patients:form.responsible')}: {patient.responsible || "N/A"}</p>
              <p className="truncate">{t('patients:form.contact')}: {patient.contact || "N/A"}</p>
            </div>
          </div>
          <div className="ml-2">
            {patient.has_anamnesis ? (
              <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 border-green-200 dark:border-green-700 text-xs whitespace-nowrap">
                {t('patients:table.hasAnamnesis')}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted text-muted-foreground hover:bg-muted/80 border-border text-xs whitespace-nowrap">
                {t('patients:table.noAnamnesis')}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-1 bg-muted/30 p-2">
        <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2">
          <Pencil className="h-3.5 w-3.5" />
          <span className="ml-1 text-xs">{t('patients:buttons.edit')}</span>
        </Button>
        
        {patient.has_anamnesis && (
          <>
            <Button variant="ghost" size="sm" onClick={onViewAnamnesis} className="h-8 px-2">
              <FileText className="h-3.5 w-3.5" />
              <span className="ml-1 text-xs">{t('common:view')}</span>
            </Button>
            
            {onEditAnamnesis && (
              <Button variant="ghost" size="sm" onClick={onEditAnamnesis} className="h-8 px-2">
                <Pencil className="h-3.5 w-3.5" />
                <span className="ml-1 text-xs">{t('patients:buttons.editAnamnesis')}</span>
              </Button>
            )}
          </>
        )}
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:text-destructive h-8 px-2">
              <Trash2 className="h-3.5 w-3.5" />
              <span className="ml-1 text-xs">{t('patients:buttons.delete')}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>{t('patients:dialog.deleteOne.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('patients:dialog.deleteOne.description').replace('{name}', patient.name)}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('patients:dialog.deleteOne.cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('patients:dialog.deleteOne.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
