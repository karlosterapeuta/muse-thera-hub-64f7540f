import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { PlusIcon, MoreHorizontalIcon, PencilIcon, TrashIcon, SearchIcon, ClockIcon, CalendarIcon, UserIcon, BuildingIcon, DollarSignIcon, InfoIcon, ListIcon, TableIcon, LayoutGridIcon, BarChart2Icon } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<"list" | "agenda">("agenda");
  
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
  
  const getWeekdayShort = (description?: string) => {
    if (!description) return "";
    
    const weekdayMatch = description.match(/Dia da semana: (segunda|terca|quarta|quinta|sexta)/);
    if (!weekdayMatch) return "";
    
    const weekdayMap: Record<string, string> = {
      segunda: "SEG",
      terca: "TER",
      quarta: "QUA",
      quinta: "QUI",
      sexta: "SEX"
    };
    
    return weekdayMap[weekdayMatch[1]] || "";
  };
  
  const getAppointmentTime = (description?: string) => {
    if (!description) return "";
    
    const timeMatch = description.match(/Horário: (\d{2}:\d{2})/);
    return timeMatch ? timeMatch[1] : "";
  };
  
  const getAppointmentDuration = (description?: string) => {
    if (!description) return "";
    
    const durationMatch = description.match(/Duração: (\d+) minutos/);
    return durationMatch ? `${durationMatch[1]} min` : "";
  };
  
  const getCleanDescription = (description?: string) => {
    if (!description) return "";
    
    return description.replace(/Dia da semana: [a-z]+\s*\|\s*Horário: \d{2}:\d{2}\s*\|\s*Duração: \d+ minutos\s*\|\s*/, "");
  };
  
  const filteredRecords = records.filter(record => 
    record.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const weekdayA = getWeekdayLabel(a.description);
    const weekdayB = getWeekdayLabel(b.description);
    
    const weekdayOrder: Record<string, number> = {
      "Segunda-feira": 1,
      "Terça-feira": 2, 
      "Quarta-feira": 3,
      "Quinta-feira": 4,
      "Sexta-feira": 5
    };
    
    if (weekdayOrder[weekdayA] !== weekdayOrder[weekdayB]) {
      return (weekdayOrder[weekdayA] || 99) - (weekdayOrder[weekdayB] || 99);
    }
    
    const timeA = getAppointmentTime(a.description);
    const timeB = getAppointmentTime(b.description);
    return timeA.localeCompare(timeB);
  });
  
  const recordsByWeekday = {
    "SEG": sortedRecords.filter(record => getWeekdayShort(record.description) === "SEG"),
    "TER": sortedRecords.filter(record => getWeekdayShort(record.description) === "TER"),
    "QUA": sortedRecords.filter(record => getWeekdayShort(record.description) === "QUA"),
    "QUI": sortedRecords.filter(record => getWeekdayShort(record.description) === "QUI"),
    "SEX": sortedRecords.filter(record => getWeekdayShort(record.description) === "SEX"),
    "OUTROS": sortedRecords.filter(record => !getWeekdayShort(record.description))
  };
  
  Object.keys(recordsByWeekday).forEach(day => {
    recordsByWeekday[day as keyof typeof recordsByWeekday].sort((a, b) => {
      const timeA = getAppointmentTime(a.description) || "00:00";
      const timeB = getAppointmentTime(b.description) || "00:00";
      return timeA.localeCompare(timeB);
    });
  });
  
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
          toast({
            title: "Registro excluído",
            description: "O registro financeiro foi excluído com sucesso.",
            variant: "default",
          });
        }
      });
    }
  };
  
  const handleDateFilter = (start_date: string, end_date: string) => {
    setDateFilter({ start_date, end_date });
  };
  
  const handleCloseForm = () => {
    setFormOpen(false);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const weekdays = ["SEG", "TER", "QUA", "QUI", "SEX"];
  
  const renderAppointmentCard = (record: FinancialRecord) => {
    const time = getAppointmentTime(record.description);
    const duration = getAppointmentDuration(record.description);
    
    return (
      <div 
        key={record.id} 
        className="bg-white border border-primary/10 rounded-md p-3 shadow-sm mb-2 hover:shadow-md transition-all hover:border-primary/30 relative group"
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center cursor-pointer"
                onClick={() => handleEditRecord(record)}
              >
                <PencilIcon className="mr-2 h-4 w-4 text-primary" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center text-destructive focus:text-destructive cursor-pointer"
                onClick={() => handleDeleteClick(record.id)}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center bg-primary/10 px-2 py-1 rounded-md text-primary font-medium">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            {time}
          </div>
          {duration && (
            <div className="text-xs text-muted-foreground ml-2 px-2 py-1 bg-muted rounded-md">
              {duration}
            </div>
          )}
        </div>
        
        <div className="mt-1">
          <div className="font-medium line-clamp-1">{record.patient_name || 'Sem paciente'}</div>
          <div className="text-xs text-muted-foreground line-clamp-1">{record.clinic_name}</div>
        </div>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-primary/10">
          <div className="text-xs text-muted-foreground line-clamp-1">{getCleanDescription(record.description) || 'Sem descrição'}</div>
          <div className="font-bold text-primary">{formatCurrency(record.amount)}</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Registros Financeiros</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate("/finance")}
            variant="outline"
            className="shadow-sm hover:shadow-md transition-all"
          >
            <BarChart2Icon className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            onClick={() => {
              setSelectedRecord(undefined);
              setFormOpen(true);
            }}
            className="shadow-sm hover:shadow-md transition-all"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <div className="md:col-span-3 bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-100">
          <DateRangeFilter onFilter={handleDateFilter} />
        </div>
        <div className="flex flex-col space-y-2">
          <div className="relative bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 p-1.5">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Pesquisar registros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 p-1.5 flex justify-center">
            <Button 
              variant={viewMode === "agenda" ? "default" : "outline"} 
              size="sm" 
              className="rounded-r-none"
              onClick={() => setViewMode("agenda")}
            >
              <LayoutGridIcon className="h-4 w-4 mr-1" />
              Agenda
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "outline"} 
              size="sm" 
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="h-4 w-4 mr-1" />
              Lista
            </Button>
          </div>
        </div>
      </div>
      
      <Card className="shadow-md border-gray-100 overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="flex items-center">
            <DollarSignIcon className="mr-2 h-5 w-5 text-primary" />
            {viewMode === "agenda" ? "Agenda Semanal" : "Registros"} 
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-muted-foreground">Carregando registros...</p>
            </div>
          ) : sortedRecords.length > 0 ? (
            <>
              {viewMode === "agenda" ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weekdays.map((day) => (
                    <div key={day} className="animate-fade-in">
                      <div className="bg-primary rounded-t-md py-2 text-center text-white font-bold">
                        {day}
                      </div>
                      <div className="bg-muted/20 p-2 rounded-b-md min-h-64 max-h-[500px] overflow-y-auto">
                        {recordsByWeekday[day as keyof typeof recordsByWeekday].length > 0 ? (
                          recordsByWeekday[day as keyof typeof recordsByWeekday].map(record => 
                            renderAppointmentCard(record)
                          )
                        ) : (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            Nenhum registro para este dia
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="whitespace-nowrap">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-3.5 w-3.5 text-primary" />
                            Data
                          </div>
                        </TableHead>
                        <TableHead className="whitespace-nowrap">Dia da Semana</TableHead>
                        <TableHead className="whitespace-nowrap">
                          <div className="flex items-center">
                            <ClockIcon className="mr-2 h-3.5 w-3.5 text-primary" />
                            Horário
                          </div>
                        </TableHead>
                        <TableHead className="whitespace-nowrap">Duração</TableHead>
                        <TableHead className="whitespace-nowrap">
                          <div className="flex items-center">
                            <BuildingIcon className="mr-2 h-3.5 w-3.5 text-primary" />
                            Clínica
                          </div>
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          <div className="flex items-center">
                            <UserIcon className="mr-2 h-3.5 w-3.5 text-primary" />
                            Paciente
                          </div>
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          <div className="flex items-center">
                            <DollarSignIcon className="mr-2 h-3.5 w-3.5 text-primary" />
                            Valor
                          </div>
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                          <div className="flex items-center">
                            <InfoIcon className="mr-2 h-3.5 w-3.5 text-primary" />
                            Descrição
                          </div>
                        </TableHead>
                        <TableHead className="w-[80px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedRecords.map((record) => (
                        <TableRow key={record.id} className="hover:bg-primary/5 transition-colors">
                          <TableCell className="whitespace-nowrap font-medium">
                            {format(parseISO(record.session_date), "dd/MM/yyyy", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {getWeekdayLabel(record.description) || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-medium text-primary">
                            {getAppointmentTime(record.description) || "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {getAppointmentDuration(record.description) || "-"}
                          </TableCell>
                          <TableCell className="font-medium">{record.clinic_name}</TableCell>
                          <TableCell>{record.patient_name || '-'}</TableCell>
                          <TableCell className="font-bold text-primary">
                            {formatCurrency(record.amount)}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {getCleanDescription(record.description) || '-'}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
                                  <MoreHorizontalIcon className="h-4 w-4" />
                                  <span className="sr-only">Abrir menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="flex items-center cursor-pointer"
                                  onClick={() => handleEditRecord(record)}
                                >
                                  <PencilIcon className="mr-2 h-4 w-4 text-primary" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="flex items-center text-destructive focus:text-destructive cursor-pointer"
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
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <div className="rounded-full bg-primary/10 p-4 inline-block mb-3">
                <DollarSignIcon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground">Nenhum registro encontrado.</p>
              <Button 
                variant="link" 
                className="mt-2 text-primary"
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
              toast({
                title: selectedRecord ? "Registro atualizado" : "Registro criado",
                description: selectedRecord 
                  ? "O registro financeiro foi atualizado com sucesso." 
                  : "O registro financeiro foi criado com sucesso.",
                variant: "default",
              });
            }}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-destructive/10 p-2 rounded-full">
                <TrashIcon className="h-5 w-5 text-destructive" />
              </div>
              <h2 className="text-xl font-bold">Confirmar exclusão</h2>
            </div>
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
                className="shadow-sm hover:shadow-md transition-colors"
              >
                {deleteRecord.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Excluindo...
                  </>
                ) : (
                  "Excluir"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
