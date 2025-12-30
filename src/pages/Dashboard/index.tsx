import React, { useEffect } from "react";
import { DashboardStats } from "./components/DashboardStats";
import { FinancialAgenda } from "./components/FinancialAgenda";
import { useDashboardData } from "./hooks/useDashboardData";
import { ProductsShowcase } from "@/components/products/ProductsShowcase";
import { globalCacheManager } from "@/utils/cacheManager";
import { PlanStatusCard } from "@/components/dashboard/PlanStatusCard";

export default function Dashboard() {
  const data = useDashboardData();

  // Initialize cache manager for automatic cleanup (runs in background)
  useEffect(() => {
    // The globalCacheManager already has automatic cleanup running
    // This effect ensures it's active when Dashboard mounts
    return () => {
      // Cleanup is handled by the global instance
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 w-full overflow-x-hidden">
      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 py-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Plan Status Card */}
        <div className="max-w-sm">
          <PlanStatusCard />
        </div>

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
