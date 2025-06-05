
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { EyeIcon, FileTextIcon, CalendarIcon, UserIcon, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

type Anamnesis = {
  id: string;
  created_at: string;
  patient: {
    name: string;
  } | null;
  legal_guardian?: string | null;
  family_relationship?: string | null;
  referral_professional?: string | null;
  main_clinical_demand?: string | null;
  [key: string]: any;
};

const AnamnesisViewer = ({ anamnesis }: { anamnesis: Anamnesis }) => {
  const renderContent = () => {
    if (!anamnesis) return <p className="text-gray-500 italic">Conteúdo não disponível</p>;

    const sections = [
      {
        title: "Dados Pessoais",
        fields: [
          { key: "legal_guardian", label: "Responsável Legal" },
          { key: "family_relationship", label: "Parentesco" },
          { key: "referral_professional", label: "Profissional que Encaminhou" },
          { key: "main_clinical_demand", label: "Demanda Clínica Principal" }
        ]
      },
      {
        title: "Histórico Musical",
        fields: [
          { key: "musical_education", label: "Educação Musical" },
          { key: "instrumental_practice", label: "Prática Instrumental" },
          { key: "body_musical_expression", label: "Expressão Corporal Musical" },
          { key: "vocal_expression", label: "Expressão Vocal" },
          { key: "choral_activities", label: "Atividades Corais" },
          { key: "no_musical_experience", label: "Sem Experiência Musical" }
        ]
      },
      {
        title: "Comportamento Musical",
        fields: [
          { key: "active_musical_listening", label: "Escuta Musical Ativa" },
          { key: "body_expression", label: "Expressão Corporal" },
          { key: "sound_responsiveness", label: "Responsividade Sonora" },
          { key: "spontaneous_vocal", label: "Emissões Vocais Espontâneas" },
          { key: "instrumental_exploration", label: "Exploração Instrumental" },
          { key: "adverse_sound_reactivity", label: "Reatividade Sonora Adversa" }
        ]
      }
    ];

    return (
      <div className="space-y-6">
        {sections.map((section) => {
          const sectionFields = section.fields.filter(field => anamnesis[field.key]);
          if (sectionFields.length === 0) return null;

          return (
            <div key={section.title} className="border-l-4 border-primary/20 pl-4">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">
                {section.title}
              </h4>
              <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100 shadow-sm">
                {sectionFields.map((field) => (
                  <div key={field.key} className="mb-2">
                    <span className="font-medium text-gray-700">{field.label}: </span>
                    <span className="text-gray-600">
                      {typeof anamnesis[field.key] === 'boolean' 
                        ? (anamnesis[field.key] ? 'Sim' : 'Não')
                        : anamnesis[field.key]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
          <EyeIcon className="h-4 w-4 mr-1" />
          Visualizar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileTextIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">
                Anamnese Musicoterapêutica
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-base mt-2">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{anamnesis.patient?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span>{format(new Date(anamnesis.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DeleteAnamnesisDialog = ({ anamnesis, onDelete }: { anamnesis: Anamnesis; onDelete: () => void }) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("anamnesis")
        .delete()
        .eq("id", anamnesis.id);

      if (error) {
        console.error("Erro ao excluir anamnese:", error);
        throw error;
      }

      toast({
        title: "Sucesso!",
        description: "Anamnese excluída com sucesso.",
      });

      onDelete();
    } catch (error) {
      console.error("Erro ao excluir anamnese:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a anamnese.",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600 transition-colors">
          <Trash className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta anamnese? Esta ação não pode ser desfeita.
            <div className="mt-2 p-2 bg-gray-50 rounded">
              <strong>Paciente:</strong> {anamnesis.patient?.name || 'N/A'}<br />
              <strong>Data:</strong> {format(new Date(anamnesis.created_at), "dd/MM/yyyy", { locale: ptBR })}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default function SavedAnamnesisView() {
  const { toast } = useToast();
  const [anamneses, setAnamneses] = useState<Anamnesis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnamneses = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await supabase
        .from("anamnesis")
        .select(`
          id,
          created_at,
          legal_guardian,
          family_relationship,
          referral_professional,
          main_clinical_demand,
          musical_education,
          instrumental_practice,
          body_musical_expression,
          vocal_expression,
          choral_activities,
          no_musical_experience,
          active_musical_listening,
          body_expression,
          sound_responsiveness,
          spontaneous_vocal,
          instrumental_exploration,
          adverse_sound_reactivity,
          patient:patients!inner (
            name,
            professional_id
          )
        `)
        .eq('patient.professional_id', user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar anamneses:", error);
        throw error;
      }

      console.log("Anamneses carregadas:", data);
      setAnamneses(data as Anamnesis[] || []);
    } catch (error) {
      console.error("Erro ao carregar anamneses:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar anamneses",
        description: "Não foi possível carregar a lista de anamneses",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnamneses();
  }, [toast]);

  const handleDeleteAnamnesis = () => {
    loadAnamneses(); // Reload anamneses after deletion
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <span className="ml-3 text-lg text-gray-600">Carregando anamneses...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileTextIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Anamneses Salvas</CardTitle>
                <p className="text-primary-foreground/80 text-sm">
                  {anamneses.length} anamnese{anamneses.length !== 1 ? 's' : ''} encontrada{anamneses.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {anamneses.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FileTextIcon className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma anamnese encontrada</h3>
                  <p className="text-gray-600 mb-4">As anamneses criadas aparecerão aqui</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80">
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Data
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Paciente
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">Responsável Legal</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {anamneses.map((anamnesis, index) => (
                    <TableRow 
                      key={anamnesis.id} 
                      className={`hover:bg-gray-50/80 transition-colors border-b border-gray-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-gray-800">
                            {format(new Date(anamnesis.created_at), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(anamnesis.created_at), "HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-gray-800">{anamnesis.patient?.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-700">{anamnesis.legal_guardian || 'N/A'}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <AnamnesisViewer anamnesis={anamnesis} />
                          <DeleteAnamnesisDialog anamnesis={anamnesis} onDelete={handleDeleteAnamnesis} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
