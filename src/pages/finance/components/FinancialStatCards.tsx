import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, ClipboardListIcon, TrendingUpIcon, CheckCircle2Icon, ClockIcon } from "lucide-react";

interface FinancialStatCardsProps {
  totalEarnings: number;
  totalSessions: number;
  averagePerSession: number;
  receivedAmount?: number;
  pendingAmount?: number;
}

const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export function FinancialStatCards({
  totalEarnings,
  totalSessions,
  averagePerSession,
  receivedAmount,
  pendingAmount,
}: FinancialStatCardsProps) {
  const showReceivables = receivedAmount !== undefined && pendingAmount !== undefined;

  const cards = [
    {
      title: "Faturado no período",
      value: fmtBRL(totalEarnings),
      hint: "Soma dos lançamentos",
      icon: WalletIcon,
      accent: "text-primary bg-primary/10",
    },
    ...(showReceivables
      ? [
          {
            title: "Recebido",
            value: fmtBRL(receivedAmount!),
            hint: "Pagamentos confirmados",
            icon: CheckCircle2Icon,
            accent: "text-green-600 bg-green-500/10",
          },
          {
            title: "A receber",
            value: fmtBRL(pendingAmount!),
            hint: "Pagamentos pendentes",
            icon: ClockIcon,
            accent: "text-amber-600 bg-amber-500/10",
          },
        ]
      : []),
    {
      title: "Atendimentos",
      value: String(totalSessions),
      hint: "Sessões registradas",
      icon: ClipboardListIcon,
      accent: "text-primary bg-primary/10",
    },
    {
      title: "Ticket médio",
      value: fmtBRL(averagePerSession),
      hint: "Valor médio por atendimento",
      icon: TrendingUpIcon,
      accent: "text-primary bg-primary/10",
    },
  ];

  return (
    <div className={`grid gap-4 ${showReceivables ? "md:grid-cols-2 lg:grid-cols-5" : "md:grid-cols-3"}`}>
      {cards.map(({ title, value, hint, icon: Icon, accent }) => (
        <Card
          key={title}
          className="relative overflow-hidden border-border/60 bg-card hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${accent}`}>
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
