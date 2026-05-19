import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ReceiptIcon, TrendingUpIcon, BanknoteIcon, XCircleIcon, UsersIcon, CreditCardIcon } from "lucide-react";
import { usePaymentReceipts } from "@/hooks/usePaymentReceipts";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

const fmtBRL = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const COLORS = ["hsl(var(--primary))", "#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ef4444"];

export function ReceiptsDashboard() {
  const { data: receipts = [] } = usePaymentReceipts();

  const stats = useMemo(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthReceipts = receipts.filter((r) => r.payment_date?.startsWith(ym) && r.status === "issued");
    const total = monthReceipts.reduce((s, r) => s + Number(r.amount), 0);
    const count = monthReceipts.length;
    const avg = count ? total / count : 0;
    const cancelled = receipts.filter((r) => r.status === "cancelled").length;
    return { total, count, avg, cancelled };
  }, [receipts]);

  const dailyData = useMemo(() => {
    const map = new Map<string, number>();
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map.set(key, 0);
    }
    receipts.filter((r) => r.status === "issued").forEach((r) => {
      if (map.has(r.payment_date)) map.set(r.payment_date, (map.get(r.payment_date) || 0) + Number(r.amount));
    });
    return Array.from(map.entries()).map(([date, total]) => ({
      day: date.slice(8, 10) + "/" + date.slice(5, 7),
      total,
    }));
  }, [receipts]);

  const topClients = useMemo(() => {
    const m = new Map<string, { name: string; count: number; total: number }>();
    receipts.filter((r) => r.status === "issued").forEach((r) => {
      const key = r.patient_name;
      const cur = m.get(key) || { name: key, count: 0, total: 0 };
      cur.count += 1; cur.total += Number(r.amount);
      m.set(key, cur);
    });
    return Array.from(m.values()).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [receipts]);

  const methodData = useMemo(() => {
    const m = new Map<string, number>();
    receipts.filter((r) => r.status === "issued").forEach((r) => {
      const k = r.payment_method.toUpperCase();
      m.set(k, (m.get(k) || 0) + 1);
    });
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [receipts]);

  const recent = receipts.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={BanknoteIcon} label="Recebido no mês" value={fmtBRL(stats.total)} color="from-emerald-500 to-emerald-600" />
        <StatCard icon={ReceiptIcon} label="Recibos no mês" value={String(stats.count)} color="from-primary to-amber-500" />
        <StatCard icon={TrendingUpIcon} label="Ticket médio" value={fmtBRL(stats.avg)} color="from-blue-500 to-indigo-600" />
        <StatCard icon={XCircleIcon} label="Cancelados" value={String(stats.cancelled)} color="from-rose-500 to-pink-600" />
      </div>

      <Card className="bg-card/60 backdrop-blur-xl">
        <CardContent className="p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><TrendingUpIcon className="h-4 w-4 text-primary" /> Receita nos últimos 30 dias</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="rcg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${v}`} />
                <Tooltip formatter={(v: any) => fmtBRL(Number(v))} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fill="url(#rcg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><UsersIcon className="h-4 w-4 text-primary" /> Clientes mais frequentes</h3>
            {topClients.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Sem dados ainda</p>
            ) : (
              <div className="space-y-2">
                {topClients.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-amber-500 text-white flex items-center justify-center text-xs font-bold">{i + 1}</div>
                      <span className="font-medium truncate">{c.name}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-muted-foreground">{c.count} recibos</div>
                      <div className="text-sm font-semibold text-primary">{fmtBRL(c.total)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><CreditCardIcon className="h-4 w-4 text-primary" /> Formas de pagamento</h3>
            {methodData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Sem dados ainda</p>
            ) : (
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={methodData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                      {methodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/60 backdrop-blur-xl">
        <CardContent className="p-5">
          <h3 className="font-semibold mb-3">Últimos recibos</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhum recibo ainda</p>
          ) : (
            <div className="grid gap-2">
              {recent.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-primary/10 px-2 py-1 rounded text-xs font-bold text-primary">#{String(r.receipt_number).padStart(4, "0")}</div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{r.patient_name}</div>
                      <div className="text-xs text-muted-foreground">{new Date(r.payment_date + "T00:00:00").toLocaleDateString("pt-BR")}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-primary">{fmtBRL(Number(r.amount))}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="bg-card/60 backdrop-blur-xl overflow-hidden relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`} />
      <CardContent className="p-4 relative">
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-bold truncate">{value}</div>
      </CardContent>
    </Card>
  );
}
