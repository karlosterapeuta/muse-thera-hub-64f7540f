import { DashboardStats } from "./components/DashboardStats";
import { useDashboardData } from "./hooks/useDashboardData";
import { useDashboardIdentity } from "./hooks/useDashboardIdentity";
import { ProductsShowcase } from "@/components/products/ProductsShowcase";
import { PlanStatusCard } from "@/components/dashboard/PlanStatusCard";
import { PendingUsersPanel } from "@/components/dashboard/PendingUsersPanel";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, ClipboardList, CalendarDays, FileText, Plus, ArrowRight, Clock3, Activity, RefreshCw, Stethoscope, AlertCircle } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: isAdmin } = useAdmin();
  const navigate = useNavigate();
  const identity = useDashboardIdentity();
  const data = useDashboardData(identity.userId, identity.ready);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);
  const weeklySessions = data.weekDays.flatMap(day => day.sessions.map(session => ({ ...session, dateForSort: day.date })));
  const upcoming = weeklySessions
    .filter(session => session.date.getTime() >= startOfDay(now).getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 4);
  const highlighted = upcoming.find(session => Boolean(session.patient_id));
  const goToEvolution = (patientId: string) => navigate(`/processes/evolution?patient_id=${encodeURIComponent(patientId)}`);

  if (identity.ready && !identity.userId) {
    return <main className="mx-auto max-w-xl px-4 py-12"><Card className="border-teal-700/20 p-6 text-center"><h1 className="text-xl font-bold">Entre para acessar seu painel clínico</h1><p className="mt-2 text-sm text-muted-foreground">Os indicadores ficam disponíveis somente para o profissional autenticado.</p><Button className="mt-5 min-h-11 bg-teal-700 hover:bg-teal-800" onClick={() => navigate("/login")}>Ir para login</Button></Card></main>;
  }

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
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">Retome atendimentos, acompanhe documentos e organize sua rotina.</p>
              </div>
            </div>
            {isAdmin && <Button variant="outline" className="min-h-11 w-full gap-2 sm:w-auto" onClick={() => navigate("/users")}><ShieldCheck className="h-4 w-4" /> Administração</Button>}
          </div>
          <nav aria-label="Ações rápidas" className="mt-5 grid grid-cols-1 gap-2 border-t border-border/70 pt-4 sm:flex sm:flex-wrap">
            <Button className="min-h-11 gap-2 bg-teal-700 text-white hover:bg-teal-800" onClick={() => navigate("/processes/evolution")}><Stethoscope className="h-4 w-4" aria-hidden="true" /> Registrar evolução</Button>
            <Button variant="outline" className="min-h-11 gap-2" onClick={() => navigate("/anamnesis")}><Plus className="h-4 w-4" /> Nova anamnese</Button>
            <Button variant="outline" className="min-h-11 gap-2" onClick={() => navigate("/patients")}><ClipboardList className="h-4 w-4" /> Pacientes</Button>
            <Button variant="outline" className="min-h-11 gap-2" onClick={() => navigate("/processes/musicoterapia")}><FileText className="h-4 w-4" /> Relatório TEA</Button>
          </nav>
        </header>

        <PendingUsersPanel userId={identity.userId} />

        {data.hasAnyError && <div role="alert" className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-start gap-2 text-sm font-medium"><AlertCircle className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" /> Alguns indicadores estão indisponíveis. Uma falha não será apresentada como ausência de registros.</p><Button type="button" variant="outline" className="min-h-11 gap-2" onClick={data.refresh}><RefreshCw className="h-4 w-4" aria-hidden="true" /> Tentar novamente</Button></div>}

        <section aria-label="Continuar atendimento">
          <Card className="border-teal-700/20 bg-gradient-to-r from-teal-50/80 to-emerald-50/40 shadow-sm dark:from-teal-950/40 dark:to-emerald-950/20">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="min-w-0 space-y-1">
                <p className="flex items-center gap-2 text-sm font-semibold text-teal-800 dark:text-teal-200"><Stethoscope className="h-4 w-4" aria-hidden="true" /> Continue o atendimento</p>
                {data.isError ? <p className="text-sm text-destructive" role="status">Agenda indisponível. Tente atualizar o painel.</p> : data.isLoading ? <Skeleton className="h-6 w-52" /> : highlighted ? <><p className="break-words text-lg font-bold text-foreground">{highlighted.patient_name}</p><p className="text-sm text-muted-foreground">{format(highlighted.dateForSort, "EEEE, dd 'de' MMMM", { locale: ptBR })} · {highlighted.formatted_time}</p></> : <p className="text-sm text-muted-foreground">Sem atendimento futuro registrado nesta semana. Você pode começar uma evolução ou consultar os pacientes.</p>}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {highlighted && !data.isError && !data.isLoading ? <><Button className="min-h-11 gap-2 bg-teal-700 text-white hover:bg-teal-800" onClick={() => goToEvolution(highlighted.patient_id!)}>Registrar evolução <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button><Button variant="outline" className="min-h-11" onClick={() => navigate(`/patients?patient_id=${encodeURIComponent(highlighted.patient_id!)}`)}>Ver ficha</Button></> : <Button variant="outline" className="min-h-11" onClick={() => navigate("/patients")}>Abrir pacientes</Button>}
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-label="Indicadores da clínica" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-base font-bold text-foreground">Indicadores da clínica</h2><div className="flex items-center gap-2 text-xs text-muted-foreground"><span role="status" aria-live="polite">{data.isRefreshing ? "Atualizando…" : data.updatedAt ? `Atualizado às ${format(new Date(data.updatedAt), "HH:mm")}` : "Aguardando dados"}</span><Button type="button" variant="outline" size="sm" className="min-h-11 gap-2" onClick={data.refresh} disabled={data.isRefreshing || !identity.userId}><RefreshCw className={`h-4 w-4 ${data.isRefreshing ? "animate-spin" : ""}`} aria-hidden="true" /> Atualizar</Button></div></div>
          <DashboardStats
            totalPatients={data.totalPatients}
            totalReports={data.totalReports}
            totalAnamnesis={data.totalAnamnesis}
            totalInterventions={data.totalInterventions}
            isLoading={data.isLoading}
            metricLoading={data.metricLoading}
            metricErrors={data.metricErrors}
          />
        </section>

        <section aria-label="Rotina clínica" className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <Card className="border-teal-700/15 shadow-sm lg:col-span-3">
            <CardHeader className="flex flex-wrap flex-row items-center justify-between gap-2 pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg"><CalendarDays className="h-5 w-5 text-teal-700 dark:text-teal-300" /> Atendimentos desta semana</CardTitle>
              <Button variant="ghost" size="sm" className="min-h-11 gap-1 text-teal-700 dark:text-teal-300" onClick={() => navigate("/patients")}>Pacientes <ArrowRight className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.isError ? <p className="rounded-xl border border-destructive/30 p-4 text-sm text-destructive" role="status">Não foi possível consultar os atendimentos. Atualize o painel para tentar novamente.</p> : data.isLoading ? <div role="status" aria-label="Carregando atendimentos" className="space-y-3"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div> : upcoming.length > 0 ? upcoming.map(session => (
                <div key={session.id} className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-foreground">{session.patient_name}</p>
                    <p className="text-xs text-muted-foreground">{format(session.dateForSort, "EEEE, dd 'de' MMMM", { locale: ptBR })}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-medium text-teal-800 dark:text-teal-200"><Clock3 className="h-4 w-4" aria-hidden="true" />{session.formatted_time}</p>
                  </div>
                  {session.patient_id && <div className="flex flex-wrap gap-2"><Button variant="outline" className="min-h-11 flex-1 gap-1 sm:flex-none" onClick={() => goToEvolution(session.patient_id!)}>Evolução <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button><Button variant="outline" className="min-h-11 flex-1 sm:flex-none" onClick={() => navigate(`/evaluation/paciente/${encodeURIComponent(session.patient_id!)}`)}>Avaliação</Button></div>}
                </div>
              )) : <div className="rounded-xl border border-dashed border-border p-6 text-center"><CalendarDays className="mx-auto mb-2 h-7 w-7 text-teal-600" /><p className="font-medium">Nenhum atendimento registrado para os próximos dias desta semana</p><p className="mt-1 text-sm text-muted-foreground">Os atendimentos registrados aparecerão aqui quando houver dados disponíveis.</p></div>}
            </CardContent>
          </Card>
          <Card className="border-teal-700/15 shadow-sm lg:col-span-2">
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base sm:text-lg"><Activity className="h-5 w-5 text-teal-700 dark:text-teal-300" /> Resumo desta semana</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-teal-50/70 p-4 dark:bg-teal-950/30">
                <p className="text-sm text-muted-foreground">Atendimentos registrados</p>
                {data.isError ? <p className="mt-1 text-sm font-semibold text-destructive">Indisponível</p> : data.isLoading ? <Skeleton className="mt-2 h-9 w-14" /> : <p className="mt-1 text-3xl font-bold tabular-nums text-teal-800 dark:text-teal-200">{data.totalSessions}</p>}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">Resumo baseado nos registros da semana do profissional autenticado. Nenhum dado demonstrativo é exibido.</p>
              <Button variant="outline" className="min-h-11 w-full gap-2" onClick={() => navigate("/intervention")}>Ver intervenções <ArrowRight className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        </section>

        <PlanStatusCard userId={identity.userId} />
        <section aria-label="Outros produtos"><ProductsShowcase /></section>
      </main>
    </div>
  );
}
