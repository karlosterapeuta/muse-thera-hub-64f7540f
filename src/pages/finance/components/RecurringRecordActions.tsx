import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontalIcon, PencilIcon, TrashIcon, RefreshCwIcon, StopCircleIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react";
import { FinancialRecord, SessionStatus } from "../types";
import { useDeleteRecurringSeries, useUpdateRecurringSeries } from "../hooks/useRecurringFinancialRecords";
import { useUpdateSessionStatus } from "../hooks/useUpdateSessionStatus";
import { toast } from "sonner";

interface RecurringRecordActionsProps {
  record: FinancialRecord;
  onEdit?: (record: FinancialRecord) => void;
  onEditSeries?: (record: FinancialRecord) => void;
}

export function RecurringRecordActions({ record, onEdit, onEditSeries }: RecurringRecordActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'single' | 'all'>('single');
  const deleteRecurringSeries = useDeleteRecurringSeries();
  const updateSessionStatus = useUpdateSessionStatus();

  const isParent = record.is_recurring && !record.parent_record_id;
  const isChild = !!record.parent_record_id;
  const isRecurring = isParent || isChild;

  const handleDeleteClick = (type: 'single' | 'all') => {
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const handleStatusChange = (status: SessionStatus) => {
    updateSessionStatus.mutate({ recordId: record.id, status });
  };

  const confirmDelete = () => {
    deleteRecurringSeries.mutate(
      {
        recordId: record.id,
        deleteAll: deleteType === 'all'
      },
      {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          toast.success(
            deleteType === 'all' 
              ? "Série recorrente excluída com sucesso!" 
              : "Registro excluído com sucesso!"
          );
        },
        onError: () => {
          toast.error("Erro ao excluir registro");
        }
      }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 bg-primary/10 hover:bg-primary hover:text-primary-foreground border-primary/30 hover:border-primary shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <MoreHorizontalIcon className="h-5 w-5 font-bold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Status da Sessão</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="flex items-center cursor-pointer"
            onClick={() => handleStatusChange('scheduled')}
            disabled={record.session_status === 'scheduled'}
          >
            <ClockIcon className="mr-2 h-4 w-4 text-blue-500" />
            Marcar como Agendada
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="flex items-center cursor-pointer"
            onClick={() => handleStatusChange('completed')}
            disabled={record.session_status === 'completed'}
          >
            <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
            Marcar como Concluída
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="flex items-center cursor-pointer"
            onClick={() => handleStatusChange('no_show')}
            disabled={record.session_status === 'no_show'}
          >
            <XCircleIcon className="mr-2 h-4 w-4 text-red-500" />
            Marcar como Falta
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Regular edit option */}
          <DropdownMenuItem 
            className="flex items-center cursor-pointer"
            onClick={() => onEdit?.(record)}
          >
            <PencilIcon className="mr-2 h-4 w-4 text-primary" />
            Editar
          </DropdownMenuItem>

          {/* Recurring-specific actions */}
          {isRecurring && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Ações Recorrentes
              </DropdownMenuLabel>
              
              {isParent && (
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer text-blue-600"
                  onClick={() => toast.info("Funcionalidade em desenvolvimento")}
                >
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Editar Série
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem 
                className="flex items-center cursor-pointer text-orange-600"
                onClick={() => handleDeleteClick('single')}
              >
                <StopCircleIcon className="mr-2 h-4 w-4" />
                Excluir Apenas Este
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="flex items-center cursor-pointer text-destructive"
                onClick={() => handleDeleteClick('all')}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Excluir Série Completa
              </DropdownMenuItem>
            </>
          )}
          
          {/* Regular delete for non-recurring records */}
          {!isRecurring && (
            <DropdownMenuItem 
              className="flex items-center text-destructive focus:text-destructive cursor-pointer"
              onClick={() => handleDeleteClick('single')}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteType === 'all' ? 'Excluir Série Recorrente' : 'Excluir Registro'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === 'all' 
                ? 'Esta ação excluirá TODOS os registros desta série recorrente (passados e futuros). Esta ação não pode ser desfeita.'
                : 'Esta ação excluirá apenas este registro específico. Os outros registros da série permanecerão inalterados.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className={deleteType === 'all' ? 'bg-destructive hover:bg-destructive/90' : ''}
              disabled={deleteRecurringSeries.isPending}
            >
              {deleteRecurringSeries.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}