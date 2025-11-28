import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Trash2, Database, FileCheck } from "lucide-react";
import { BackupHistoryItem, getBackupHistory, clearBackupHistory } from "../utils/backupGenerator";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function BackupHistory() {
  const [history, setHistory] = useState<BackupHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getBackupHistory());
  }, []);

  const handleClearHistory = () => {
    clearBackupHistory();
    setHistory([]);
    toast.success("Histórico limpo com sucesso");
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Backups
          </h3>
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum backup realizado ainda</p>
            <p className="text-sm">Seus backups aparecerão aqui</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Backups
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearHistory}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>
        
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card/50 gap-2"
            >
              <div className="flex items-center gap-3">
                <FileCheck className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">
                    {format(new Date(item.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.totalRecords} registros • {item.fileSize}
                  </p>
                </div>
              </div>
              <Badge variant={item.type === "complete" ? "default" : "secondary"}>
                {item.type === "complete" ? "Completo" : "Seletivo"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
