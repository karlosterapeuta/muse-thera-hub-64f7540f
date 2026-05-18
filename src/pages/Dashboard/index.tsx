import React, { useEffect } from "react";
import { DashboardStats } from "./components/DashboardStats";
import { useDashboardData } from "./hooks/useDashboardData";
import { ProductsShowcase } from "@/components/products/ProductsShowcase";
import { PlanStatusCard } from "@/components/dashboard/PlanStatusCard";
import { CosmicBackground } from "@/components/auth/CosmicBackground";
import { PendingUsersPanel } from "@/components/dashboard/PendingUsersPanel";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles, LayoutDashboard, Activity, Users, FileText } from "lucide-react";

export default function Dashboard() {
  const { data: isAdmin } = useAdmin();
  const navigate = useNavigate();
  const data = useDashboardData();

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden">
      <CosmicBackground />

      {/* Ambient cosmic blobs */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 py-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-400/5" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-amber-500 blur-xl opacity-40" />
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary to-amber-500 shadow-lg">
                    <LayoutDashboard className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                </div>
                <div className="space-y-2 min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-background/40 backdrop-blur text-xs font-medium text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Visão Geral · MuseTera
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                    Acompanhe pacientes, relatórios e a evolução do seu trabalho clínico em musicoterapia em um só lugar.
                  </p>
                </div>
              </div>

              {isAdmin && (
                <div className="flex flex-col gap-2 lg:items-end">
                  <Button
                    onClick={() => navigate("/users")}
                    className="bg-gradient-to-br from-primary to-amber-500 text-white border-0 shadow-md hover:opacity-90 transition-all duration-200 font-semibold"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Painel Administrativo
                  </Button>
                </div>
              )}
            </div>

            {/* Status pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium">
                <Users className="h-3.5 w-3.5 text-primary" /> Pacientes
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium">
                <FileText className="h-3.5 w-3.5 text-amber-500" /> Relatórios
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium">
                <Activity className="h-3.5 w-3.5 text-rose-400" /> Evolução
              </div>
            </div>
          </div>
        </div>

        {/* Admin: Pending Users Approval */}
        <PendingUsersPanel />

        {/* Plan Status Card */}
        <PlanStatusCard />

        {/* Statistics Cards */}
        <div>
          <DashboardStats
            totalPatients={data.totalPatients}
            totalReports={data.totalReports}
            totalAnamnesis={data.totalAnamnesis}
            totalInterventions={data.totalInterventions}
            isLoading={data.isLoading}
          />
        </div>

        {/* Products Showcase */}
        <ProductsShowcase />
      </div>
    </div>
  );
}

