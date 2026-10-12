import { DashboardStats } from "./components/DashboardStats";
import { useDashboardData } from "./hooks/useDashboardData";
import { ProductsShowcase } from "@/components/products/ProductsShowcase";
import { PlanStatusCard } from "@/components/dashboard/PlanStatusCard";
import { PendingUsersPanel } from "@/components/dashboard/PendingUsersPanel";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, ClipboardList, CalendarDays, FileText, Plus, ArrowRight, Clock3, Activity } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { data: isAdmin } = useAdmin();
  const navigate = useNavigate();
  const data = useDashboardData();
  const now = new Date();
  const weeklySessions = data.weekDays.flatMap(day => day.sessions.map(session => ({ ...session, dateForSort: day.date })));
  const upcoming = weeklySessions
    .filter(session => new Date(session.date).getTime() >= now.getTime() || (isSameDay(new Date(session.date), now) && !String(session.formatted_time).includes("Invalid")))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-teal-50/40 to-emerald-50/20 dark:via-teal-950/20 dark:to-background">
      <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6">
        <header className="rounded-2xl border border-teal-700/15 bg-card px-4 py-5 shadow-sm sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
              <div className="rounded-xl bg-teal-800 p-3 text-white"><LayoutDashboard className="h-6 w-6" aria-hidden="true" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">Painel clínico · MuseTera</p>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Visão geral</h1>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">Acompanhe seus pacientes, documentos e atendimentos em um só lugar.</p>
              </div>
            </div>
            {isAdmin && <Button variant="outline" className="w-full gap-2 sm:w-auto" onClick={() => navigate("/users")}><ShieldCheck className="h-4 w-4" /> Administração</Button>}
          </div>
          <nav aria-label="Ações rápidas" className="mt-5 flex flex-wrap gap-2 border-t border-border/70 pt-4">
            <Button className="gap-2 bg-teal-700 text-white hover:bg-teal-800" onClick={() => navigate("/anamnesis")}><Plus className="h-4 w-4" /> Nova anamnese</Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate("/processes/musicoterapia")}><FileText className="h-4 w-4" /> Relatório TEA</Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate("/patients")}><ClipboardList className="h-4 w-4" /> Pacientes</Button>
          </nav>
        </header>

        <PendingUsersPanel />

        <section aria-label="Indicadores da clínica">
          <DashboardStats
            totalPatients={data.totalPatients}
            totalReports={data.totalReports}
            totalAnamnesis={data.totalAnamnesis}
            totalInterventions={data.totalInterventions}
            isLoading={data.isLoading}
          />
        </section>

        <section aria-label="Rotina clínica" className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <Card className="border-teal-700/15 shadow-sm lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><CalendarDays className="h-5 w-5 text-teal-700 dark:text-teal-300" /> Próximos atendimentos</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-teal-700 dark:text-teal-300" onClick={() => navigate("/patients")}>Pacientes <ArrowRight className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.isLoading ? <p className="text-sm text-muted-foreground" role="status">Carregando atendimentos...</p> : upcoming.length > 0 ? upcoming.map(session => (
                <div key={session.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-foreground">{session.patient_name}</p>
                    <p className="text-xs text-muted-foreground">{format(session.dateForSort, "EEEE, dd 'de' MMMM", { locale: ptBR })}</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-teal-700 dark:text-teal-300"><Clock3 className="h-4 w-4" />{session.formatted_time || "Horário não informado"}</span>
                </div>
              )) : <div className="rounded-xl border border-dashed border-border p-6 text-center"><CalendarDays className="mx-auto mb-2 h-7 w-7 text-teal-600" /><p className="font-medium">Nenhum atendimento futuro encontrado nesta semana</p><p className="mt-1 text-sm text-muted-foreground">Os atendimentos registrados aparecerão aqui quando houver dados disponíveis.</p></div>}
            </CardContent>
          </Card>
          <Card className="border-teal-700/15 shadow-sm lg:col-span-2">
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base sm:text-lg"><Activity className="h-5 w-5 text-teal-700 dark:text-teal-300" /> Resumo desta semana</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-teal-50/70 p-4 dark:bg-teal-950/30">
                <p className="text-sm text-muted-foreground">Atendimentos registrados</p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-teal-800 dark:text-teal-200">{data.isLoading ? "—" : data.totalSessions}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">Resumo baseado nos registros da semana do profissional autenticado. Nenhum dado demonstrativo é exibido.</p>
              <Button variant="outline" className="w-full gap-2" onClick={() => navigate("/intervention")}>Ver intervenções <ArrowRight className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        </section>

        <PlanStatusCard />
        <section aria-label="Outros produtos"><ProductsShowcase /></section>
      </main>
    </div>
  );
}
