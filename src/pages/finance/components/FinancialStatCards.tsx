import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, ClipboardListIcon, TrendingUpIcon } from "lucide-react";

interface FinancialStatCardsProps {
  totalEarnings: number;
  totalSessions: number;
  averagePerSession: number;
}

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export function FinancialStatCards({
  totalEarnings,
  totalSessions,
  averagePerSession,
}: FinancialStatCardsProps) {
  const cards = [
    {
      title: "Receita total",
      value: fmtBRL(totalEarnings),
      hint: "Faturamento no período",
      icon: WalletIcon,
    },
    {
      title: "Atendimentos",
      value: String(totalSessions),
      hint: "Sessões registradas",
      icon: ClipboardListIcon,
    },
    {
      title: "Ticket médio",
      value: fmtBRL(averagePerSession),
      hint: "Valor médio por atendimento",
      icon: TrendingUpIcon,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(({ title, value, hint, icon: Icon }) => (
        <Card
          key={title}
          className="relative overflow-hidden border-border/60 bg-card hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
              {value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
