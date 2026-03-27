import React, { useEffect } from "react";
import { DashboardStats } from "./components/DashboardStats";
import { FinancialAgenda } from "./components/FinancialAgenda";
import { useDashboardData } from "./hooks/useDashboardData";
import { ProductsShowcase } from "@/components/products/ProductsShowcase";
import { globalCacheManager } from "@/utils/cacheManager";
import { PlanStatusCard } from "@/components/dashboard/PlanStatusCard";
import { CosmicBackground } from "@/components/auth/CosmicBackground";
import { PendingUsersPanel } from "@/components/dashboard/PendingUsersPanel";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

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
      {/* Main Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 py-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Admin: Pending Users Approval */}
        <PendingUsersPanel />

        {/* Admin Quick Access Button */}
        {isAdmin && (
          <Button
            onClick={() => navigate("/users")}
            className="gap-2"
            variant="outline"
          >
            <ShieldCheck className="h-4 w-4" />
            Painel Administrativo
          </Button>
        )}

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

        {/* Financial Agenda */}
        <FinancialAgenda 
          financialSchedule={data.financialSchedule} 
          isLoading={data.isLoading}
        />

        {/* Products Showcase */}
        <ProductsShowcase />
      </div>
    </div>
  );
}
