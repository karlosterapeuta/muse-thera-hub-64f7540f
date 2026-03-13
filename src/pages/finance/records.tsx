import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { format, parseISO, startOfWeek, endOfWeek, addDays, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PlusIcon, MoreHorizontalIcon, PencilIcon, TrashIcon, SearchIcon, ClockIcon, CalendarIcon, UserIcon, BuildingIcon, DollarSignIcon, InfoIcon, ListIcon, TableIcon, LayoutGridIcon, BarChart2Icon, Trash2Icon, PrinterIcon, PinIcon } from "lucide-react";
import { useFinancialRecords, useDeleteFinancialRecord, useClearAllFinancialRecords } from "./hooks/useFinancialData";
import { FinancialRecordForm } from "./components/FinancialRecordForm";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { PeriodFilter, FinancialRecord } from "./types";
import { useToast } from "@/hooks/use-toast";
import { ClinicForm } from "./components/ClinicForm";
import { RecurringRecordIndicator } from "./components/RecurringRecordIndicator";
import { RecurringRecordActions } from "./components/RecurringRecordActions";
import { SessionStatusBadge } from "./components/SessionStatusBadge";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

export default function FinancialRecords() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [dateFilter, setDateFilter] = useState<PeriodFilter | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [clinicFormOpen, setClinicFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | undefined>();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "fixed">("fixed");
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  const { data: records = [], isLoading, refetch } = useFinancialRecords(dateFilter);
  const { data: allRecords = [] } = useFinancialRecords(undefined);
  const deleteRecord = useDeleteFinancialRecord();
  const clearAllRecords = useClearAllFinancialRecords();
  
  const getWeekdayLabel = (description?: string) => {
    if (!description) return "";
    
    const weekdayMatch = description.match(/Dia da semana: (segunda|terca|quarta|quinta|sexta|sabado)/);
    if (!weekdayMatch) return "";
    
    const weekdayMap: Record<string, string> = {
      segunda: "Segunda-feira",
      terca: "Terça-feira",
      quarta: "Quarta-feira",
      quinta: "Quinta-feira",
      sexta: "Sexta-feira",
      sabado: "Sábado"
    };
    
    return weekdayMap[weekdayMatch[1]] || "";
  };
  
  const getWeekdayShort = (description?: string) => {
    if (!description) return "";
    
    const weekdayMatch = description.match(/Dia da semana: (segunda|terca|quarta|quinta|sexta|sabado)/);
    if (!weekdayMatch) return "";
    
    const weekdayMap: Record<string, string> = {
      segunda: "SEG",
      terca: "TER",
      quarta: "QUA",
      quinta: "QUI",
      sexta: "SEX",
      sabado: "SAB"
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
      "Sexta-feira": 5,
      "Sábado": 6
    };
    
    if (weekdayOrder[weekdayA] !== weekdayOrder[weekdayB]) {
      return (weekdayOrder[weekdayA] || 99) - (weekdayOrder[weekdayB] || 99);
    }
    
    const timeA = getAppointmentTime(a.description);
    const timeB = getAppointmentTime(b.description);
    return timeA.localeCompare(timeB);
  });
  
  // Smart weekly agenda organization - group by current week
  const organizeWeeklyAgenda = () => {
    const today = new Date();
    const startDate = startOfWeek(today, { weekStartsOn: 0 });
    const endDate = endOfWeek(today, { weekStartsOn: 0 });
    
    // Filter records for current week
    const weekRecords = filteredRecords.filter(record => {
      const recordDate = parseISO(record.session_date);
      return recordDate >= startDate && recordDate <= endDate;
    });
    
    // Create week structure
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i);
      const dayRecords = weekRecords.filter(record => 
        isSameDay(parseISO(record.session_date), date)
      ).sort((a, b) => {
        const timeA = getAppointmentTime(a.description) || "00:00";
        const timeB = getAppointmentTime(b.description) || "00:00";
        return timeA.localeCompare(timeB);
      });
      
      const dayTotal = dayRecords.reduce((sum, record) => sum + record.amount, 0);
      
      weekDays.push({
        date,
        dayName: format(date, "EEEE", { locale: ptBR }),
        dayShort: format(date, "EEE", { locale: ptBR }).toUpperCase(),
        formatted: format(date, "dd/MM", { locale: ptBR }),
        records: dayRecords,
        total: dayTotal,
        isToday: isToday(date)
      });
    }
    
    return weekDays;
  };
  
  const weeklyAgenda = organizeWeeklyAgenda();
  
  // Fixed agenda: use ALL records grouped by session_date weekday
  const fixedFilteredRecords = allRecords.filter(record => 
    record.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getRecordWeekday = (record: FinancialRecord): string => {
    // First try description pattern, then fall back to session_date
    const short = getWeekdayShort(record.description);
    if (short) return short;
    
    const date = parseISO(record.session_date);
    const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon...6=Sat
    const dayMap: Record<number, string> = { 1: "SEG", 2: "TER", 3: "QUA", 4: "QUI", 5: "SEX", 6: "SAB", 0: "DOM" };
    return dayMap[dayOfWeek] || "DOM";
  };
  
  const recordsByWeekday = {
    "SEG": fixedFilteredRecords.filter(record => getRecordWeekday(record) === "SEG"),
    "TER": fixedFilteredRecords.filter(record => getRecordWeekday(record) === "TER"),
    "QUA": fixedFilteredRecords.filter(record => getRecordWeekday(record) === "QUA"),
    "QUI": fixedFilteredRecords.filter(record => getRecordWeekday(record) === "QUI"),
    "SEX": fixedFilteredRecords.filter(record => getRecordWeekday(record) === "SEX"),
    "SAB": fixedFilteredRecords.filter(record => getRecordWeekday(record) === "SAB"),
  };
  
  // Deduplicate fixed agenda by patient+weekday+time (show unique slots only)
  Object.keys(recordsByWeekday).forEach(day => {
    const seen = new Set<string>();
    recordsByWeekday[day as keyof typeof recordsByWeekday] = 
      recordsByWeekday[day as keyof typeof recordsByWeekday]
        .sort((a, b) => {
          const timeA = getAppointmentTime(a.description) || "00:00";
          const timeB = getAppointmentTime(b.description) || "00:00";
          return timeA.localeCompare(timeB);
        })
        .filter(record => {
          const key = `${record.patient_name}-${getAppointmentTime(record.description)}-${record.clinic_name}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
  });
  
  useEffect(() => {
    if (location.state?.openForm) {
      setFormOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  const handleEditRecord = (record: FinancialRecord) => {
    setSelectedRecord({...record});
    setFormOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setRecordToDelete(id);
    setConfirmDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!recordToDelete) return;

    try {
      await deleteRecord.mutateAsync(recordToDelete);
      toast({
        title: "Registro excluído",
        description: "O registro financeiro foi excluído com sucesso.",
      });
      setConfirmDialogOpen(false);
      setRecordToDelete(null);
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o registro.",
        variant: "destructive",
      });
    }
  };
  
  const handleClearAll = () => {
    setClearAllDialogOpen(true);
  };
  
  const confirmClearAll = async () => {
    try {
      // Close dialog immediately to prevent UI freeze
      setClearAllDialogOpen(false);
      
      // Execute deletion
      await clearAllRecords.mutateAsync();
      
      toast({
        title: "Registros excluídos",
        description: "Todos os registros financeiros foram excluídos com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir os registros.",
        variant: "destructive",
      });
    }
  };
  
  const handleDateFilter = (start_date: string, end_date: string) => {
    setDateFilter({ start_date, end_date });
  };
  
  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedRecord(undefined);
    refetch();
    toast({
      title: "Registro salvo",
      description: "O registro financeiro foi salvo com sucesso.",
      variant: "default",
    });
  };
  
  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedRecord(undefined);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const weekdays = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
  
  const renderAppointmentCard = (record: FinancialRecord) => {
    const time = getAppointmentTime(record.description);
    const duration = getAppointmentDuration(record.description);
    
    const getCardStatusClasses = (status?: string) => {
      switch (status) {
        case 'completed':
          return 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600';
        case 'no_show':
          return 'bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-600';
        case 'scheduled':
        default:
          return 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600';
      }
    };
    
    return (
      <div 
        key={record.id} 
        className={`${getCardStatusClasses(record.session_status)} rounded-md p-3 shadow-sm mb-2 hover:shadow-md transition-all hover:border-opacity-50 relative group`}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <RecurringRecordActions record={record} onEdit={handleEditRecord} />
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
          <div className="ml-auto flex items-center gap-2">
            <SessionStatusBadge status={record.session_status || 'scheduled'} />
            <RecurringRecordIndicator record={record} />
          </div>
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
  
  const renderSmartAppointmentCard = (record: FinancialRecord) => {
    const time = getAppointmentTime(record.description);
    const duration = getAppointmentDuration(record.description);
    
    const getCardStatusClasses = (status?: string) => {
      switch (status) {
        case 'completed':
          return 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600';
        case 'no_show':
          return 'bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-600';
        case 'scheduled':
        default:
          return 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600';
      }
    };
    
    return (
      <div 
        key={record.id} 
        className={`${getCardStatusClasses(record.session_status)} rounded-lg p-3 shadow-sm mb-2 hover:shadow-md transition-all hover:border-opacity-50 relative group`}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <RecurringRecordActions record={record} onEdit={handleEditRecord} />
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            {time || "Sem horário"}
          </div>
          <div className="flex items-center gap-2">
            {duration && (
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {duration}
              </div>
            )}
            <SessionStatusBadge status={record.session_status || 'scheduled'} />
            <RecurringRecordIndicator record={record} />
          </div>
        </div>
        
        <div className="space-y-1 mb-3">
          <div className="font-semibold text-foreground line-clamp-1">
            {record.patient_name || 'Sem paciente'}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-1 flex items-center">
            <BuildingIcon className="h-3 w-3 mr-1" />
            {record.clinic_name}
          </div>
        </div>
        
        {getCleanDescription(record.description) && (
          <div className="text-xs text-muted-foreground mb-2 line-clamp-2 bg-muted/50 p-2 rounded-md">
            {getCleanDescription(record.description)}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Dia da semana: {getWeekdayLabel(record.description) || format(parseISO(record.session_date), "EEEE", { locale: ptBR })}
          </div>
          <div className="font-bold text-primary text-lg">
            {formatCurrency(record.amount)}
          </div>
        </div>
      </div>
    );
  };
  
  const handleClinicFormSuccess = () => {
    setClinicFormOpen(false);
    toast({
      title: "Clínica adicionada",
      description: "A clínica foi adicionada com sucesso.",
      variant: "default",
    });
  };
  
  return (
    <div className="container px-2 sm:px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Registros Financeiros</h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <Button
            onClick={() => navigate("/finance")}
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="shadow-sm hover:shadow-md transition-all"
          >
            <BarChart2Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#8B5CF6]" />
            {isMobile && <span className="ml-1 text-xs">Dashboard</span>}
            {!isMobile && <span className="inline">Dashboard</span>}
          </Button>
          <Button
            onClick={() => setClinicFormOpen(true)}
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="shadow-sm hover:shadow-md transition-all"
          >
            <BuildingIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#D946EF]" />
            {isMobile && <span className="ml-1 text-xs">Clínica</span>}
            {!isMobile && <span className="inline">Nova Clínica</span>}
          </Button>
          <Button
            onClick={() => {
              setSelectedRecord(undefined);
              setFormOpen(true);
            }}
            size={isMobile ? "sm" : "default"}
            className="shadow-sm hover:shadow-md transition-all"
          >
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            {isMobile && <span className="ml-1 text-xs">Novo</span>}
            {!isMobile && <span className="inline">Novo Registro</span>}
          </Button>
          {records.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="destructive"
              size={isMobile ? "sm" : "default"}
              className="shadow-sm hover:shadow-md transition-all"
            >
              <Trash2Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              {isMobile && <span className="ml-1 text-xs">Limpar</span>}
              {!isMobile && <span className="inline">Limpar Tudo</span>}
            </Button>
          )}
        </div>
      </div>
      
      
      <div className="md:col-span-3 bg-card/80 backdrop-blur-sm rounded-lg p-2 md:p-3 shadow-sm border border-border">
        <DateRangeFilter onFilter={handleDateFilter} />
      </div>
      <div className="flex flex-col space-y-2">
        <div className="relative bg-card/80 backdrop-blur-sm rounded-lg shadow-sm border border-border p-1.5">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Pesquisar registros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-card/80 backdrop-blur-sm rounded-lg shadow-sm border border-border p-1.5 flex justify-center">
          <Button 
            variant={viewMode === "fixed" ? "default" : "outline"} 
            size="sm" 
            className="rounded-r-none"
            onClick={() => setViewMode("fixed")}
          >
            <PinIcon className="h-4 w-4 mr-1 text-[#F97316]" />
            <span className={isMobile ? "text-xs" : "inline"}>Agenda Fixa</span>
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="sm" 
            className="rounded-l-none"
            onClick={() => setViewMode("list")}
          >
            <ListIcon className="h-4 w-4 mr-1 text-[#8B5CF6]" />
            <span className={isMobile ? "text-xs" : "inline"}>Lista</span>
          </Button>
        </div>
      </div>
      
      
      <Card className="shadow-md border-border overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSignIcon className="mr-2 h-5 w-5 text-primary" />
              {viewMode === "fixed" ? "Agenda Fixa dos Pacientes" : viewMode === "agenda" ? "Agenda Semanal Inteligente" : "Registros"} 
            </div>
            {viewMode === "agenda" && (
              <div className="text-sm text-muted-foreground">
                Semana de {format(weeklyAgenda[0]?.date, "dd/MM", { locale: ptBR })} - {format(weeklyAgenda[6]?.date, "dd/MM", { locale: ptBR })}
              </div>
            )}
            {viewMode === "fixed" && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <PinIcon className="h-3.5 w-3.5" />
                Permanente — não muda com o mês
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-4">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-muted-foreground">Carregando registros...</p>
            </div>
          ) : (sortedRecords.length > 0 || viewMode === "fixed") ? (
            <>
              {viewMode === "fixed" ? (
                <div className={`${isMobile ? 'space-y-4' : isTablet ? 'grid grid-cols-3 gap-3' : 'grid grid-cols-6 gap-3'}`}>
                  {isMobile ? (
                    <Tabs defaultValue="SEG" className="w-full">
                      <TabsList className="w-full grid grid-cols-6 text-xs">
                        {weekdays.map((day) => (
                          <TabsTrigger key={day} value={day} className="text-xs">
                            {day}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {weekdays.map((day) => {
                        const dayRecords = recordsByWeekday[day as keyof typeof recordsByWeekday] || [];
                        const dayTotal = dayRecords.reduce((sum, r) => sum + r.amount, 0);
                        const dayLabels: Record<string, string> = {
                          SEG: "Segunda-feira", TER: "Terça-feira", QUA: "Quarta-feira",
                          QUI: "Quinta-feira", SEX: "Sexta-feira", SAB: "Sábado"
                        };
                        return (
                          <TabsContent key={day} value={day} className="animate-fade-in">
                            <div className="space-y-2">
                              <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-semibold">{dayLabels[day]}</div>
                                    <div className="text-sm opacity-75 flex items-center gap-1">
                                      <PinIcon className="h-3 w-3" /> Agenda Fixa
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm">{dayRecords.length} pacientes</div>
                                    <div className="font-bold">{formatCurrency(dayTotal)}</div>
                                  </div>
                                </div>
                              </div>
                              <ScrollArea className="max-h-[400px]">
                                {dayRecords.length > 0 ? (
                                  dayRecords.map(record => renderAppointmentCard(record))
                                ) : (
                                  <div className="text-center py-8 text-muted-foreground text-sm">
                                    Nenhum paciente fixo
                                  </div>
                                )}
                              </ScrollArea>
                            </div>
                          </TabsContent>
                        );
                      })}
                    </Tabs>
                  ) : (
                    weekdays.map((day) => {
                      const dayRecords = recordsByWeekday[day as keyof typeof recordsByWeekday] || [];
                      const dayTotal = dayRecords.reduce((sum, r) => sum + r.amount, 0);
                      return (
                        <div key={day} className="animate-fade-in">
                          <div className="rounded-t-lg py-3 px-2 text-center text-white font-bold bg-gradient-to-br from-amber-500 to-orange-600">
                            <div className="text-sm">{day}</div>
                            <div className="text-[10px] opacity-80 flex items-center justify-center gap-1">
                              <PinIcon className="h-2.5 w-2.5" /> Fixo
                            </div>
                          </div>
                          <div className="bg-muted/50 border border-t-0 rounded-b-lg">
                            <div className="p-2 bg-card border-b dark:border-border flex justify-between items-center text-xs">
                              <span>{dayRecords.length} pacientes</span>
                              <span className="font-semibold text-primary">{formatCurrency(dayTotal)}</span>
                            </div>
                            <ScrollArea className="h-[400px] p-2">
                              {dayRecords.length > 0 ? (
                                dayRecords.map(record => renderAppointmentCard(record))
                              ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                  Nenhum paciente fixo
                                </div>
                              )}
                            </ScrollArea>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : viewMode === "agenda" ? (
                <div className={`${isMobile ? 'space-y-4' : isTablet ? 'grid grid-cols-3 gap-3' : 'grid grid-cols-7 gap-3'}`}>
                  {isMobile ? (
                    <Tabs defaultValue="0" className="w-full">
                      <TabsList className="w-full grid grid-cols-7 text-xs">
                        {weeklyAgenda.map((day, index) => (
                          <TabsTrigger 
                            key={index} 
                            value={index.toString()} 
                            className={`text-xs ${day.isToday ? 'bg-primary text-white' : ''}`}
                          >
                            {day.dayShort}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {weeklyAgenda.map((day, index) => (
                        <TabsContent key={index} value={index.toString()} className="animate-fade-in">
                          <div className="space-y-2">
                            <div className={`p-3 rounded-lg ${day.isToday ? 'bg-primary text-white' : 'bg-muted'}`}>
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-semibold">{day.dayName}</div>
                                  <div className="text-sm opacity-75">{day.formatted}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm">{day.records.length} sessões</div>
                                  <div className="font-bold">{formatCurrency(day.total)}</div>
                                </div>
                              </div>
                            </div>
                            <ScrollArea className="max-h-[400px]">
                              {day.records.length > 0 ? (
                                day.records.map(record => renderSmartAppointmentCard(record))
                              ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                  {day.isToday ? 'Nenhuma sessão hoje' : 'Nenhuma sessão agendada'}
                                </div>
                              )}
                            </ScrollArea>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : (
                    weeklyAgenda.map((day, index) => (
                      <div key={index} className="animate-fade-in">
                        <div className={`rounded-t-lg py-3 px-2 text-center text-white font-bold ${
                          day.isToday ? 'bg-gradient-to-r from-primary to-primary/80' : 'bg-primary/70'
                        }`}>
                          <div className="text-sm">{day.dayShort}</div>
                          <div className="text-xs opacity-90">{day.formatted}</div>
                        </div>
                        <div className="bg-muted/50 border border-t-0 rounded-b-lg">
                          <div className="p-2 bg-card border-b dark:border-border flex justify-between items-center text-xs">
                            <span>{day.records.length} sessões</span>
                            <span className="font-semibold text-primary">{formatCurrency(day.total)}</span>
                          </div>
                          <ScrollArea className="h-[400px] p-2">
                            {day.records.length > 0 ? (
                              day.records.map(record => renderSmartAppointmentCard(record))
                            ) : (
                              <div className="text-center py-8 text-muted-foreground text-sm">
                                {day.isToday ? 'Nenhuma sessão hoje' : 'Nenhuma sessão'}
                              </div>
                            )}
                          </ScrollArea>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto -mx-2 md:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="whitespace-nowrap">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-3.5 w-3.5 text-primary" />
                            Data
                          </div>
                        </TableHead>
                        {!isMobile && (
                          <TableHead className="whitespace-nowrap">Dia da Semana</TableHead>
                        )}
                        <TableHead className="whitespace-nowrap">
                          <div className="flex items-center">
                            <ClockIcon className="mr-2 h-3.5 w-3.5 text-primary" />
                            Horário
                          </div>
                        </TableHead>
                        {!isMobile && (
                          <TableHead className="whitespace-nowrap">Duração</TableHead>
                        )}
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
                        {!isMobile && (
                          <TableHead className="whitespace-nowrap">
                            <div className="flex items-center">
                              <InfoIcon className="mr-2 h-3.5 w-3.5 text-primary" />
                              Descrição
                            </div>
                          </TableHead>
                        )}
                        <TableHead className="w-[80px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedRecords.map((record) => (
                        <TableRow key={record.id} className="hover:bg-primary/5 transition-colors">
                          <TableCell className="whitespace-nowrap font-medium text-xs md:text-sm">
                            {format(parseISO(record.session_date), "dd/MM/yyyy", { locale: ptBR })}
                          </TableCell>
                          {!isMobile && (
                            <TableCell className="whitespace-nowrap text-xs md:text-sm">
                              {getWeekdayLabel(record.description) || "-"}
                            </TableCell>
                          )}
                          <TableCell className="whitespace-nowrap font-medium text-primary text-xs md:text-sm">
                            {getAppointmentTime(record.description) || "-"}
                          </TableCell>
                          {!isMobile && (
                            <TableCell className="whitespace-nowrap text-xs md:text-sm">
                              {getAppointmentDuration(record.description) || "-"}
                            </TableCell>
                          )}
                          <TableCell className="font-medium text-xs md:text-sm">
                            <div className="max-w-[100px] md:max-w-full truncate">
                              {record.clinic_name}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs md:text-sm">
                            <div className="max-w-[100px] md:max-w-full truncate">
                              {record.patient_name || '-'}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-primary text-xs md:text-sm">
                            {formatCurrency(record.amount)}
                          </TableCell>
                          {!isMobile && (
                            <TableCell className="max-w-[150px] md:max-w-[200px] truncate text-xs md:text-sm">
                              {getCleanDescription(record.description) || '-'}
                            </TableCell>
                          )}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors h-8 w-8">
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
      
      {isMobile ? (
        <Sheet open={formOpen} onOpenChange={setFormOpen}>
          <SheetContent className="w-full p-0 pt-6 overflow-y-auto">
            <SheetHeader className="px-4 mb-2">
              <SheetTitle>{selectedRecord ? "Editar Registro" : "Novo Registro"}</SheetTitle>
            </SheetHeader>
            <div className="px-0 pb-0">
              <FinancialRecordForm 
                record={selectedRecord}
                onSuccess={handleFormSuccess}
                onCancel={handleCloseForm}
              />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className={isTablet ? "sm:max-w-md" : "sm:max-w-lg"}>
            <DialogTitle className="sr-only">{selectedRecord ? "Editar Registro" : "Novo Registro"}</DialogTitle>
            <DialogDescription className="sr-only">Formulário de registro financeiro</DialogDescription>
            <FinancialRecordForm 
              record={selectedRecord}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {isMobile ? (
        <Sheet open={clinicFormOpen} onOpenChange={setClinicFormOpen}>
          <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden flex flex-col h-full">
            <SheetHeader className="px-4 py-4 shrink-0">
              <SheetTitle>Nova Clínica</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="px-0 pb-0">
                <ClinicForm 
                  onSuccess={handleClinicFormSuccess}
                />
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={clinicFormOpen} onOpenChange={setClinicFormOpen}>
          <DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
            <DialogTitle className="px-6 py-4">Nova Clínica</DialogTitle>
            <DialogDescription className="sr-only">Preencha os dados da clínica</DialogDescription>
            <ScrollArea className="flex-1 overflow-y-auto">
              <ClinicForm 
                onSuccess={handleClinicFormSuccess}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
      
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className={isMobile ? "w-[95vw] max-w-md rounded-lg" : "sm:max-w-md"}>
          <div className="space-y-4">
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>Você tem certeza que deseja excluir este registro financeiro? Esta ação não pode ser desfeita.</DialogDescription>
            <div className="flex items-center space-x-3">
              <div className="bg-destructive/10 p-2 rounded-full">
                <TrashIcon className="h-5 w-5 text-destructive" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDialogOpen(false)}
                disabled={deleteRecord.isPending}
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
      
      <Dialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
        <DialogContent className={isMobile ? "w-[95vw] max-w-md rounded-lg" : "sm:max-w-md"}>
          <div className="space-y-4">
            <DialogTitle>Confirmar exclusão total</DialogTitle>
            <DialogDescription>Você tem certeza que deseja excluir <strong>TODOS</strong> os registros financeiros? Esta ação não pode ser desfeita.</DialogDescription>
            <div className="flex items-center space-x-3">
              <div className="bg-destructive/10 p-2 rounded-full">
                <Trash2Icon className="h-5 w-5 text-destructive" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setClearAllDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmClearAll}
                disabled={clearAllRecords.isPending}
                className="shadow-sm hover:shadow-md transition-colors"
              >
                {clearAllRecords.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Excluindo...
                  </>
                ) : (
                  "Excluir Todos"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
