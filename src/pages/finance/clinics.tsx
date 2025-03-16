
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PlusIcon, MoreHorizontalIcon, PencilIcon, TrashIcon, SearchIcon, CalendarIcon, UsersIcon } from "lucide-react";
import { useClinics, useDeleteClinic } from "./hooks/useClinics";
import { ClinicForm } from "./components/ClinicForm";
import { Clinic } from "./types";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const WEEKDAY_LABELS = {
  domingo: "Domingo",
  segunda: "Segunda",
  terca: "Terça",
  quarta: "Quarta",
  quinta: "Quinta",
  sexta: "Sexta",
  sabado: "Sábado"
};

export default function ClinicsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | undefined>();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [clinicToDelete, setClinicToDelete] = useState<string | null>(null);
  const [patientsMap, setPatientsMap] = useState<Record<string, string>>({});
  
  const { data: clinics = [], isLoading, refetch } = useClinics();
  const deleteClinic = useDeleteClinic();
  
  // Buscar dados dos pacientes quando necessário
  const fetchPatientNames = async (patientIds: string[]) => {
    if (!patientIds?.length) return;
    
    // Filtrar apenas IDs que ainda não temos no mapa
    const missingIds = patientIds.filter(id => !patientsMap[id]);
    if (!missingIds.length) return;
    
    const { data } = await supabase
      .from("patients")
      .select("id, name")
      .in("id", missingIds);
      
    if (data?.length) {
      const newMap = { ...patientsMap };
      data.forEach(patient => {
        newMap[patient.id] = patient.name;
      });
      setPatientsMap(newMap);
    }
  };
  
  // Carregar nomes de pacientes para todas as clínicas
  React.useEffect(() => {
    const allPatientIds = clinics
      .flatMap(clinic => clinic.patient_ids || [])
      .filter(Boolean);
      
    if (allPatientIds.length) {
      fetchPatientNames(allPatientIds);
    }
  }, [clinics]);
  
  // Filter clinics based on search term
  const filteredClinics = clinics.filter(clinic => 
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (clinic.address && clinic.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleEditClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setFormOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setClinicToDelete(id);
    setConfirmDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (clinicToDelete) {
      deleteClinic.mutate(clinicToDelete, {
        onSuccess: () => {
          setConfirmDialogOpen(false);
          setClinicToDelete(null);
        }
      });
    }
  };
  
  const formatServiceDays = (days?: string[]) => {
    if (!days?.length) return "Não definido";
    return days.map(day => WEEKDAY_LABELS[day as keyof typeof WEEKDAY_LABELS]).join(", ");
  };
  
  const getPatientCount = (patientIds?: string[]) => {
    if (!patientIds?.length) return 0;
    return patientIds.length;
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Clínicas</h1>
        <Button
          onClick={() => {
            setSelectedClinic(undefined);
            setFormOpen(true);
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Nova Clínica
        </Button>
      </div>
      
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9 max-w-md"
          placeholder="Pesquisar clínicas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Clínicas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-muted-foreground">Carregando clínicas...</p>
            </div>
          ) : filteredClinics.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Dias de Atendimento</TableHead>
                  <TableHead>Pacientes</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClinics.map((clinic) => (
                  <TableRow key={clinic.id}>
                    <TableCell className="font-medium">{clinic.name}</TableCell>
                    <TableCell>{clinic.address || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatServiceDays(clinic.service_days)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Badge variant="outline">
                          {getPatientCount(clinic.patient_ids)} paciente(s)
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {clinic.created_at ? 
                        format(new Date(clinic.created_at), "dd/MM/yyyy", { locale: ptBR }) : 
                        '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditClinic(clinic)}>
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(clinic.id)}
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">Nenhuma clínica encontrada.</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => {
                  setSelectedClinic(undefined);
                  setFormOpen(true);
                }}
              >
                Adicionar clínica
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Form dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <ClinicForm 
            clinic={selectedClinic}
            onSuccess={() => {
              setFormOpen(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Confirm delete dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Confirmar exclusão</h2>
            <p>Você tem certeza que deseja excluir esta clínica? Esta ação não pode ser desfeita e pode afetar registros financeiros associados.</p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteClinic.isPending}
              >
                {deleteClinic.isPending ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
