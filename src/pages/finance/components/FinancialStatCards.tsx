
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BanknoteIcon, CalendarIcon, TrendingUpIcon } from "lucide-react";

interface FinancialStatCardsProps {
  totalEarnings: number;
  totalSessions: number;
  averagePerSession: number;
}

export function FinancialStatCards({ 
  totalEarnings, 
  totalSessions, 
  averagePerSession 
}: FinancialStatCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {totalEarnings.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            Receita acumulada no período
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSessions}</div>
          <p className="text-xs text-muted-foreground">
            Total de atendimentos registrados
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Média por Atendimento</CardTitle>
          <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {averagePerSession.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            Valor médio por atendimento
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
