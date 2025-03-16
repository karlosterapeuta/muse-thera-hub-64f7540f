import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PlusIcon, MoreHorizontalIcon, PencilIcon, TrashIcon, SearchIcon } from "lucide-react";
import { useFinancialRecords, useDeleteFinancialRecord } from "./hooks/useFinancialData";
import { FinancialRecordForm } from "./components/FinancialRecordForm";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { PeriodFilter, FinancialRecord } from "./types";
import { useToast } from "@/hooks/use-toast";

export default function FinancialRecords() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [dateFilter, setDateFilter] = useState<PeriodFilter | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | undefined>();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  
  const { data: records = [], isLoading, refetch } = useFinancialRecords(dateFilter);
  const deleteRecord = useDeleteFinancialRecord();
  
  const getWeekdayLabel = (description?: string) => {
    if (!description) return "";
    
    const weekdayMatch = description.match(/Dia da semana: (segunda|terca|quarta|quinta|sexta)/);
    if (!weekdayMatch) return "";
    
    const weekdayMap: Record<string, string> = {
      segunda: "Segunda-feira",
      terca: "Terça-feira",
      quarta: "Quarta-feira",
      quinta: "Quinta-feira",
      sexta: "Sexta-feira"
    };
    
    return weekdayMap[weekdayMatch[1]] || "";
  };
  
  const getCleanDescription = (description?: string) => {
    if (!description) return "";
    
    const parts = description.split(" | ");
    return parts.length > 1 ? parts.slice(1).join(" | ") : "";
  };
  
  const filteredRecords = records.filter(record => 
    record.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    if (location.state?.openForm) {
      setFormOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  const handleEditRecord = (record: FinancialRecord) => {
    setSelectedRecord(record);
    setFormOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setRecordToDelete(id);
    setConfirmDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (recordToDelete) {
      deleteRecord.mutate(recordToDelete, {
        onSuccess: () => {
          setConfirmDialogOpen(false);
          setRecordToDelete(null);
        }
      });
    }
  };
  
  const handleDateFilter = (start_date: string, end_date: string) => {
    setDateFilter({ start_date, end_date });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Registros Financeiros</h1>
        <Button
          onClick={() => {
            setSelectedRecord(undefined);
            setFormOpen(true);
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo Registro
        </Button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <div className="md:col-span-3">
          <DateRangeFilter onFilter={handleDateFilter} />
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Pesquisar registros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Registros</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-muted-foreground">Carregando registros...</p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Dia da Semana</TableHead>
                    <TableHead>Clínica</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {format(parseISO(record.session_date), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {getWeekdayLabel(record.description) || "-"}
                      </TableCell>
                      <TableCell>{record.clinic_name}</TableCell>
                      <TableCell>{record.patient_name || '-'}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(record.amount)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {getCleanDescription(record.description) || '-'}
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
                            <DropdownMenuItem onClick={() => handleEditRecord(record)}>
                              <PencilIcon className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteClick(record.id)}
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
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">Nenhum registro encontrado.</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => {
                  setSelectedRecord(undefined);
                  setFormOpen(true);
                }}
              >
                Adicionar registro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <FinancialRecordForm 
            record={selectedRecord}
            onSuccess={() => {
              setFormOpen(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Confirmar exclusão</h2>
            <p>Você tem certeza que deseja excluir este registro financeiro? Esta ação não pode ser desfeita.</p>
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
                disabled={deleteRecord.isPending}
              >
                {deleteRecord.isPending ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
