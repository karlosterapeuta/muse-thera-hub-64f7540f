import { Badge } from "@/components/ui/badge";
import { RepeatIcon, Calendar, Clock } from "lucide-react";
import { FinancialRecord } from "../types";

interface RecurringRecordIndicatorProps {
  record: FinancialRecord;
  showDetails?: boolean;
}

export function RecurringRecordIndicator({ record, showDetails = false }: RecurringRecordIndicatorProps) {
  if (!record.is_recurring && !record.parent_record_id) {
    return null;
  }

  const isParent = record.is_recurring && !record.parent_record_id;
  const isChild = !!record.parent_record_id;

  const getRecurrenceTypeLabel = (type?: string) => {
    switch (type) {
      case 'weekly':
        return 'Semanal';
      case 'monthly':
        return 'Mensal';
      case 'yearly':
        return 'Anual';
      default:
        return 'Recorrente';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isParent ? (
        <Badge variant="default" className="flex items-center gap-1">
          <RepeatIcon className="h-3 w-3" />
          {showDetails ? getRecurrenceTypeLabel(record.recurrence_type) : 'Série'}
        </Badge>
      ) : isChild ? (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Recorrente
        </Badge>
      ) : null}
      
      {showDetails && record.recurrence_end_date && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Até {new Date(record.recurrence_end_date).toLocaleDateString('pt-BR')}
        </Badge>
      )}
    </div>
  );
}