import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeftIcon, ReceiptIcon, LayoutDashboardIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import { ReceiptsDashboard } from "@/components/finance/receipts/ReceiptsDashboard";
import { ReceiptsHistory } from "@/components/finance/receipts/ReceiptsHistory";
import { IssuerProfileForm } from "@/components/finance/receipts/IssuerProfileForm";
import { ImportProofDialog } from "@/components/finance/receipts/ImportProofDialog";

export default function ReceiptsListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "dashboard";
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="container max-w-6xl py-6 space-y-5 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 blur-3xl rounded-full -z-10" />

      <Button variant="ghost" size="sm" onClick={() => navigate("/finance")} className="gap-2">
        <ArrowLeftIcon className="h-4 w-4" /> Voltar
      </Button>

      <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl border-border/60 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-amber-400/5 pointer-events-none" />
        <CardContent className="p-5 relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="bg-gradient-to-br from-primary to-amber-500 p-3 rounded-xl">
            <ReceiptIcon className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              Recibos de Pagamento
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Dashboard, histórico e perfil de emissor</p>
          </div>
          <Button
            onClick={() => setImportOpen(true)}
            className="shrink-0 bg-gradient-to-r from-primary to-amber-500 text-white gap-2 shadow-lg w-full sm:w-auto h-auto py-2.5 whitespace-normal"
          >
            <SparklesIcon className="h-4 w-4 shrink-0" />
            <span className="text-xs sm:text-sm text-center leading-tight">
              <span className="block sm:inline">Importar Comprovante</span>
              <span className="block sm:inline text-white/80"> e Gerar Recibo</span>
            </span>
          </Button>
        </CardContent>
      </Card>

      <ImportProofDialog open={importOpen} onClose={() => setImportOpen(false)} />

      <Tabs value={tab} onValueChange={(v) => setParams({ tab: v })}>
        <TabsList className="w-full grid grid-cols-3 gap-2 bg-transparent p-0 h-auto">
          <TabsTrigger
            value="dashboard"
            className="gap-2 py-3 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            <LayoutDashboardIcon className="h-5 w-5" />
            <span className="text-xs sm:text-sm font-semibold">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger
            value="recibos"
            className="gap-2 py-3 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            <ReceiptIcon className="h-5 w-5" />
            <span className="text-xs sm:text-sm font-semibold">Recibos</span>
          </TabsTrigger>
          <TabsTrigger
            value="emissor"
            className="gap-2 py-3 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            <ShieldCheckIcon className="h-5 w-5" />
            <span className="text-xs sm:text-sm font-semibold">Emissor</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-4"><ReceiptsDashboard /></TabsContent>
        <TabsContent value="recibos" className="mt-4"><ReceiptsHistory /></TabsContent>
        <TabsContent value="emissor" className="mt-4"><IssuerProfileForm /></TabsContent>
      </Tabs>
    </div>
  );
}
