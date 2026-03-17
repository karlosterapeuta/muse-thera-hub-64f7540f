import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  ClipboardList,
  FileText,
  Stethoscope,
  Activity,
  BarChart2,
  Calendar,
  ChevronRight,
  Clock,
  History,
  Filter,
  ArrowLeft,
  TrendingUp,
  PieChart,
  CalendarDays,
  FileBarChart,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, differenceInDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Patient, usePatientsData } from "@/hooks/usePatientsData";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from "recharts";

type HistoryItem = {
  id: string;
  type: "anamnesis" | "assessment" | "treatment_plan" | "session" | "report";
  title: string;
  description: string;
  date: string;
  icon: typeof ClipboardList;
  gradient: string;
  badgeColor: string;
  label: string;
};

const typeConfig = {
  anamnesis: {
    icon: ClipboardList,
    gradient: "from-violet-500 to-purple-600",
    badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    label: "Anamnese",
    color: "#8b5cf6",
  },
  assessment: {
    icon: BarChart2,
    gradient: "from-blue-500 to-cyan-600",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    label: "Avaliação",
    color: "#3b82f6",
  },
  treatment_plan: {
    icon: Stethoscope,
    gradient: "from-emerald-500 to-green-600",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    label: "Plano Terapêutico",
    color: "#22c55e",
  },
  session: {
    icon: Activity,
    gradient: "from-orange-500 to-amber-600",
    badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    label: "Sessão / Intervenção",
    color: "#f59e0b",
  },
  report: {
    icon: FileText,
    gradient: "from-pink-500 to-rose-600",
    badgeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    label: "Relatório",
    color: "#ec4899",
  },
};

function usePatientHistory(patientId: string | null) {
  return useQuery({
    queryKey: ["patient-history", patientId],
    queryFn: async (): Promise<HistoryItem[]> => {
      if (!patientId) return [];

      const [anamnesisRes, assessmentsRes, plansRes, sessionsRes, reportsRes] =
        await Promise.all([
          supabase
            .from("anamnesis")
            .select("id, created_at, main_clinical_demand, legal_guardian")
            .eq("patient_id", patientId)
            .order("created_at", { ascending: false }),
          supabase
            .from("assessments")
            .select("id, created_at, type, date")
            .eq("patient_id", patientId)
            .order("created_at", { ascending: false }),
          supabase
            .from("treatment_plans")
            .select("id, created_at, therapeutic_focus, status, approach_type")
            .eq("patient_id", patientId)
            .order("created_at", { ascending: false }),
          supabase
            .from("sessions")
            .select("id, created_at, date, notes")
            .eq("patient_id", patientId)
            .order("created_at", { ascending: false }),
          supabase
            .from("reports")
            .select("id, created_at, type")
            .eq("patient_id", patientId)
            .order("created_at", { ascending: false }),
        ]);

      const items: HistoryItem[] = [];

      anamnesisRes.data?.forEach((a) => {
        items.push({
          id: a.id,
          type: "anamnesis",
          title: "Anamnese Musicoterapêutica",
          description: a.main_clinical_demand
            ? `Demanda: ${a.main_clinical_demand.substring(0, 100)}...`
            : "Anamnese registrada",
          date: a.created_at || "",
          ...typeConfig.anamnesis,
        });
      });

      assessmentsRes.data?.forEach((a) => {
        items.push({
          id: a.id,
          type: "assessment",
          title: `Avaliação — ${a.type || "Geral"}`,
          description: `Avaliação realizada em ${a.date ? format(new Date(a.date), "dd/MM/yyyy", { locale: ptBR }) : "data não informada"}`,
          date: a.created_at || "",
          ...typeConfig.assessment,
        });
      });

      plansRes.data?.forEach((p) => {
        items.push({
          id: p.id,
          type: "treatment_plan",
          title: "Plano Terapêutico",
          description: p.therapeutic_focus
            ? `Foco: ${p.therapeutic_focus.substring(0, 100)}`
            : p.approach_type || "Plano registrado",
          date: p.created_at || "",
          ...typeConfig.treatment_plan,
        });
      });

      sessionsRes.data?.forEach((s) => {
        items.push({
          id: s.id,
          type: "session",
          title: "Sessão / Intervenção",
          description: s.notes
            ? s.notes.substring(0, 100)
            : `Sessão em ${s.date ? format(new Date(s.date), "dd/MM/yyyy", { locale: ptBR }) : "data não informada"}`,
          date: s.created_at || s.date || "",
          ...typeConfig.session,
        });
      });

      reportsRes.data?.forEach((r) => {
        const reportLabels: Record<string, string> = {
          individual_session: "Sessão Individual",
          group_session: "Sessão em Grupo",
          daily_evolution: "Evolução Diária",
          monthly_evolution: "Evolução Mensal",
          semester_evolution: "Evolução Semestral",
          therapeutic_discharge: "Alta Terapêutica",
          administrative_discharge: "Alta Administrativa",
          tea_scale: "Escala TEA",
          family_report: "Relatório Família",
          team_report: "Relatório Equipe",
          technical_report: "Relatório Técnico",
          musicoterapia: "Relatório Musicoterapia",
          evolution_musicoterapia: "Evolução Musicoterapia",
        };
        items.push({
          id: r.id,
          type: "report",
          title: reportLabels[r.type] || "Relatório",
          description: `Tipo: ${reportLabels[r.type] || r.type}`,
          date: r.created_at || "",
          ...typeConfig.report,
        });
      });

      items.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return items;
    },
    enabled: !!patientId,
    staleTime: 2 * 60 * 1000,
  });
}

// Analytics sub-components
function ActivityOverTimeChart({ items }: { items: HistoryItem[] }) {
  const chartData = useMemo(() => {
    const months: { month: string; total: number; sessoes: number; relatorios: number; avaliacoes: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const monthItems = items.filter((item) => {
        if (!item.date) return false;
        try {
          const d = new Date(item.date);
          return isWithinInterval(d, { start, end });
        } catch { return false; }
      });
      months.push({
        month: format(date, "MMM", { locale: ptBR }),
        total: monthItems.length,
        sessoes: monthItems.filter(i => i.type === "session").length,
        relatorios: monthItems.filter(i => i.type === "report").length,
        avaliacoes: monthItems.filter(i => i.type === "assessment").length,
      });
    }
    return months;
  }, [items]);

  return (
    <Card className="border border-border/50 shadow-lg bg-card/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">Atividade ao Longo do Tempo</CardTitle>
            <CardDescription className="text-xs">Últimos 6 meses</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSessoes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Area type="monotone" dataKey="total" stroke="#8b5cf6" fill="url(#colorTotal)" strokeWidth={2} name="Total" />
              <Area type="monotone" dataKey="sessoes" stroke="#f59e0b" fill="url(#colorSessoes)" strokeWidth={2} name="Sessões" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentDistributionChart({ items }: { items: HistoryItem[] }) {
  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([key, value]) => ({
        name: typeConfig[key as keyof typeof typeConfig]?.label || key,
        value,
        color: typeConfig[key as keyof typeof typeConfig]?.color || "#888",
      }))
      .filter(d => d.value > 0);
  }, [items]);

  if (pieData.length === 0) return null;

  return (
    <Card className="border border-border/50 shadow-lg bg-card/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500">
            <PieChart className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">Distribuição de Documentos</CardTitle>
            <CardDescription className="text-xs">Por tipo de registro</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: '11px' }}>{value}</span>}
                iconType="circle"
                iconSize={8}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'hsl(var(--foreground))',
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyBarChart({ items }: { items: HistoryItem[] }) {
  const chartData = useMemo(() => {
    const months: { month: string; anamnese: number; avaliação: number; plano: number; sessão: number; relatório: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const monthItems = items.filter((item) => {
        if (!item.date) return false;
        try {
          return isWithinInterval(new Date(item.date), { start, end });
        } catch { return false; }
      });
      months.push({
        month: format(date, "MMM", { locale: ptBR }),
        anamnese: monthItems.filter(i => i.type === "anamnesis").length,
        avaliação: monthItems.filter(i => i.type === "assessment").length,
        plano: monthItems.filter(i => i.type === "treatment_plan").length,
        sessão: monthItems.filter(i => i.type === "session").length,
        relatório: monthItems.filter(i => i.type === "report").length,
      });
    }
    return months;
  }, [items]);

  return (
    <Card className="border border-border/50 shadow-lg bg-card/90 backdrop-blur-sm col-span-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500">
            <FileBarChart className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">Registros por Mês</CardTitle>
            <CardDescription className="text-xs">Detalhamento por tipo nos últimos 6 meses</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Legend
                formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: '11px' }}>{value}</span>}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="anamnese" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Anamnese" />
              <Bar dataKey="avaliação" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Avaliação" />
              <Bar dataKey="plano" fill="#22c55e" radius={[3, 3, 0, 0]} name="Plano" />
              <Bar dataKey="sessão" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Sessão" />
              <Bar dataKey="relatório" fill="#ec4899" radius={[3, 3, 0, 0]} name="Relatório" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function PatientInsights({ items, patient }: { items: HistoryItem[]; patient: Patient }) {
  const insights = useMemo(() => {
    if (items.length === 0) return null;

    const dates = items.filter(i => i.date).map(i => new Date(i.date));
    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    const firstRecord = sortedDates[0];
    const lastRecord = sortedDates[sortedDates.length - 1];
    const daysInTreatment = firstRecord && lastRecord ? differenceInDays(lastRecord, firstRecord) : 0;

    const thisMonth = items.filter(i => {
      if (!i.date) return false;
      try {
        return isWithinInterval(new Date(i.date), { start: startOfMonth(new Date()), end: endOfMonth(new Date()) });
      } catch { return false; }
    }).length;

    const lastMonth = items.filter(i => {
      if (!i.date) return false;
      const lm = subMonths(new Date(), 1);
      try {
        return isWithinInterval(new Date(i.date), { start: startOfMonth(lm), end: endOfMonth(lm) });
      } catch { return false; }
    }).length;

    const trend = thisMonth >= lastMonth ? "up" : "down";
    const sessionCount = items.filter(i => i.type === "session").length;

    return { daysInTreatment, thisMonth, lastMonth, trend, sessionCount, totalRecords: items.length, firstRecord, lastRecord };
  }, [items]);

  if (!insights) return null;

  const insightCards = [
    {
      label: "Dias em Tratamento",
      value: insights.daysInTreatment,
      icon: CalendarDays,
      gradient: "from-violet-500 to-purple-600",
      suffix: " dias",
    },
    {
      label: "Total de Sessões",
      value: insights.sessionCount,
      icon: Activity,
      gradient: "from-orange-500 to-amber-600",
      suffix: "",
    },
    {
      label: "Registros este Mês",
      value: insights.thisMonth,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-green-600",
      suffix: "",
      extra: insights.lastMonth > 0 ? `${insights.trend === "up" ? "↑" : "↓"} vs mês anterior (${insights.lastMonth})` : undefined,
    },
    {
      label: "Total de Documentos",
      value: insights.totalRecords,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-600",
      suffix: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {insightCards.map((card, idx) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.08 }}
        >
          <Card className="border border-border/50 shadow-md bg-card/90 backdrop-blur-sm overflow-hidden relative group hover:shadow-lg transition-shadow duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`} />
            <CardContent className="p-4 relative">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-r ${card.gradient}`}>
                  <card.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">{card.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {card.value}{card.suffix}
              </p>
              {card.extra && (
                <p className="text-[10px] text-muted-foreground mt-1">{card.extra}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default function PatientHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("timeline");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { data: patients = [], isLoading: loadingPatients } = usePatientsData();
  const { data: historyItems = [], isLoading: loadingHistory } = usePatientHistory(selectedPatient?.id || null);

  const filteredPatients = useMemo(
    () =>
      patients.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [patients, searchTerm]
  );

  const filteredHistory = useMemo(
    () =>
      typeFilter === "all"
        ? historyItems
        : historyItems.filter((item) => item.type === typeFilter),
    [historyItems, typeFilter]
  );

  const stats = useMemo(() => {
    const counts: Record<string, number> = {
      anamnesis: 0,
      assessment: 0,
      treatment_plan: 0,
      session: 0,
      report: 0,
    };
    historyItems.forEach((item) => counts[item.type]++);
    return counts;
  }, [historyItems]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 md:py-8 space-y-6 animate-fadeIn">
        {/* Hero */}
        <div className="text-center space-y-3 mb-6">
          <div className="relative inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary to-purple-600 rounded-2xl shadow-2xl">
            <History className="h-7 w-7 text-white" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Histórico do Paciente
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Visualize todo o percurso terapêutico com analytics detalhados
            </p>
          </div>
        </div>

        {!selectedPatient ? (
          /* Patient Selection */
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Selecione um Paciente
                  </CardTitle>
                  <CardDescription>
                    {patients.length} paciente{patients.length !== 1 ? "s" : ""} cadastrado{patients.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Search */}
              <div className="relative max-w-md mx-auto mb-6">
                <div className="flex items-center bg-background border-2 border-border rounded-xl p-3 hover:border-primary/30 transition-colors">
                  <Search className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    type="search"
                    placeholder="Buscar paciente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {loadingPatients ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/30 border-t-primary" />
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">Nenhum paciente encontrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPatients.map((patient, index) => (
                    <motion.button
                      key={patient.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setSearchTerm("");
                        setActiveTab("timeline");
                      }}
                      className="group relative flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 text-left"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary font-bold text-sm shrink-0">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">
                          {patient.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {patient.age ? `${patient.age} anos` : "Idade não informada"}
                          {patient.responsible && ` · ${patient.responsible}`}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </motion.button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Patient History */
          <div className="space-y-5">
            {/* Back + Patient Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPatient(null);
                  setTypeFilter("all");
                }}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-lg shadow-lg">
                  {selectedPatient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedPatient.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.age ? `${selectedPatient.age} anos` : ""}
                    {selectedPatient.responsible
                      ? ` · Responsável: ${selectedPatient.responsible}`
                      : ""}
                    {selectedPatient.contact
                      ? ` · ${selectedPatient.contact}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Insights Cards */}
            <PatientInsights items={historyItems} patient={selectedPatient} />

            {/* Tabs: Timeline / Analytics */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="bg-muted/50 border border-border">
                <TabsTrigger value="timeline" className="gap-1.5 data-[state=active]:bg-background">
                  <History className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Linha do Tempo</span>
                  <span className="sm:hidden">Timeline</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-1.5 data-[state=active]:bg-background">
                  <BarChart2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Analytics</span>
                  <span className="sm:hidden">Gráficos</span>
                </TabsTrigger>
              </TabsList>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4">
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/30 border-t-primary" />
                  </div>
                ) : historyItems.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground/40" />
                    <p className="text-muted-foreground">Sem dados para exibir analytics</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ActivityOverTimeChart items={historyItems} />
                      <DocumentDistributionChart items={historyItems} />
                    </div>
                    <MonthlyBarChart items={historyItems} />
                  </>
                )}
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="space-y-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() =>
                        setTypeFilter(typeFilter === key ? "all" : key)
                      }
                      className={`cursor-pointer relative p-3 rounded-xl border transition-all duration-300 ${
                        typeFilter === key
                          ? "border-primary shadow-lg bg-primary/5"
                          : "border-border hover:border-primary/30 bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-r ${config.gradient} flex items-center justify-center`}
                        >
                          <config.icon className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-foreground">
                          {stats[key] || 0}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium truncate">
                        {config.label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-3">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[200px] bg-card border-border">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os registros</SelectItem>
                      <SelectItem value="anamnesis">Anamnese</SelectItem>
                      <SelectItem value="assessment">Avaliação</SelectItem>
                      <SelectItem value="treatment_plan">Plano Terapêutico</SelectItem>
                      <SelectItem value="session">Sessão / Intervenção</SelectItem>
                      <SelectItem value="report">Relatório</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {filteredHistory.length} registro{filteredHistory.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                {/* Timeline */}
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/30 border-t-primary" />
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                      <History className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Nenhum registro encontrado
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Este paciente ainda não possui documentos registrados
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[23px] md:left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-purple-500/20 to-transparent" />

                    <AnimatePresence mode="popLayout">
                      <div className="space-y-3">
                        {filteredHistory.map((item, index) => {
                          const ItemIcon = item.icon;
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3, delay: index * 0.04 }}
                              className="relative flex gap-4 pl-1"
                            >
                              {/* Timeline dot */}
                              <div
                                className={`relative z-10 flex items-center justify-center w-[46px] h-[46px] md:w-[54px] md:h-[54px] rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg shrink-0`}
                              >
                                <ItemIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                              </div>

                              {/* Card */}
                              <div className="flex-1 group rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 p-4">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-foreground text-sm">
                                      {item.title}
                                    </h3>
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] px-1.5 py-0 ${item.badgeColor}`}
                                    >
                                      {item.label}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-xs">
                                      {item.date
                                        ? format(
                                            new Date(item.date),
                                            "dd MMM yyyy, HH:mm",
                                            { locale: ptBR }
                                          )
                                        : "Sem data"}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
