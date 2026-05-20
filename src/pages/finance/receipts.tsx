import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeftIcon, ReceiptIcon, LayoutDashboardIcon, UsersIcon, FileTextIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import { ReceiptsDashboard } from "@/components/finance/receipts/ReceiptsDashboard";
import { ReceiptsHistory } from "@/components/finance/receipts/ReceiptsHistory";
import { ClientsManager } from "@/components/finance/receipts/ClientsManager";
import { TemplatesManager } from "@/components/finance/receipts/TemplatesManager";
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
        <CardContent className="p-5 relative flex items-center gap-4">
          <div className="bg-gradient-to-br from-primary to-amber-500 p-3 rounded-xl">
            <ReceiptIcon className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              Recibos de Pagamento
            </h1>
            <p className="text-sm text-muted-foreground">Dashboard, histórico, clientes, modelos e perfil de emissor</p>
          </div>
          <Button
            onClick={() => setImportOpen(true)}
            className="shrink-0 bg-gradient-to-r from-primary to-amber-500 text-white gap-2 shadow-lg"
          >
            <SparklesIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Importar Comprovante</span>
            <span className="sm:hidden">Importar</span>
          </Button>
        </CardContent>
      </Card>

      <ImportProofDialog open={importOpen} onClose={() => setImportOpen(false)} />

      <Tabs value={tab} onValueChange={(v) => setParams({ tab: v })}>
        <TabsList className="w-full overflow-x-auto flex justify-start sm:grid sm:grid-cols-5">
          <TabsTrigger value="dashboard" className="gap-1"><LayoutDashboardIcon className="h-4 w-4" /><span className="hidden sm:inline">Dashboard</span></TabsTrigger>
          <TabsTrigger value="recibos" className="gap-1"><ReceiptIcon className="h-4 w-4" /><span className="hidden sm:inline">Recibos</span></TabsTrigger>
          <TabsTrigger value="clientes" className="gap-1"><UsersIcon className="h-4 w-4" /><span className="hidden sm:inline">Clientes</span></TabsTrigger>
          <TabsTrigger value="modelos" className="gap-1"><FileTextIcon className="h-4 w-4" /><span className="hidden sm:inline">Modelos</span></TabsTrigger>
          <TabsTrigger value="emissor" className="gap-1"><ShieldCheckIcon className="h-4 w-4" /><span className="hidden sm:inline">Emissor</span></TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-4"><ReceiptsDashboard /></TabsContent>
        <TabsContent value="recibos" className="mt-4"><ReceiptsHistory /></TabsContent>
        <TabsContent value="clientes" className="mt-4"><ClientsManager /></TabsContent>
        <TabsContent value="modelos" className="mt-4"><TemplatesManager /></TabsContent>
        <TabsContent value="emissor" className="mt-4"><IssuerProfileForm /></TabsContent>
      </Tabs>
    </div>
  );
}
