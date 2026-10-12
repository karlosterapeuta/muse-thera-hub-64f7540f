import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, Download, Loader2, Shield, Clock, FileJson, Server } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBackupStatistics, fetchBackupData } from "./hooks/useBackupData";
import { generateBackupFile } from "./utils/backupGenerator";
import { BackupStats } from "./components/BackupStats";
import { BackupHistory } from "./components/BackupHistory";
import { SelectiveBackup } from "./components/SelectiveBackup";
import { SystemBackup } from "./components/SystemBackup";
import { useAdmin } from "@/hooks/use-admin";
import { supabase } from "@/integrations/supabase/client";

const ALL_CATEGORIES = [
  "patients",
  "anamnesis",
  "assessments",
  "treatmentPlans",
  "reports",
  "financialRecords",
  "clinics",
  "sessions",
];

export default function BackupPage() {
  const navigate = useNavigate();
  const { data: statistics, isLoading: isLoadingStats } = useBackupStatistics();
  const { data: isAdmin, isLoading: isLoadingAdmin } = useAdmin();
  const [isGeneratingFull, setIsGeneratingFull] = useState(false);
  const [isGeneratingSelective, setIsGeneratingSelective] = useState(false);

  const handleFullBackup = async () => {
    setIsGeneratingFull(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const data = await fetchBackupData(ALL_CATEGORIES);
      
      generateBackupFile(
        data,
        user.id,
        data.professional?.email || user.email || "",
        data.professional?.name || "Profissional",
        "complete",
        ALL_CATEGORIES
      );

      toast.success("Backup completo gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar backup:", error);
      toast.error("Erro ao gerar backup");
    } finally {
      setIsGeneratingFull(false);
    }
  };

  const handleSelectiveBackup = async (categories: string[]) => {
    setIsGeneratingSelective(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const data = await fetchBackupData(categories);
      
      generateBackupFile(
        data,
        user.id,
        data.professional?.email || user.email || "",
        data.professional?.name || "Profissional",
        "selective",
        categories
      );

      toast.success("Backup seletivo gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar backup:", error);
      toast.error("Erro ao gerar backup");
    } finally {
      setIsGeneratingSelective(false);
    }
  };

  const totalRecords = statistics
    ? Object.values(statistics).reduce((sum, val) => sum + val, 0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-slate-500 to-zinc-600 text-white">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Central de Backup</h1>
                <p className="text-sm text-muted-foreground">
                  Exporte e proteja todos os seus dados clínicos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Full Backup Card */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 pointer-events-none" />
            <CardContent className="relative p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Backup Completo</h3>
                  <p className="text-sm text-muted-foreground">
                    Exportar TODOS os dados em um arquivo
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total de registros</span>
                    <span className="text-2xl font-bold">{totalRecords}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Inclui pacientes, anamneses, relatórios, financeiro e mais
                  </p>
                </div>

                <Button
                  onClick={handleFullBackup}
                  disabled={isGeneratingFull || totalRecords === 0}
                  className="w-full bg-gradient-to-r from-primary to-primary/80"
                  size="lg"
                >
                  {isGeneratingFull ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gerando Backup...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Gerar Backup Completo
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Selective Backup */}
          <SelectiveBackup
            statistics={statistics}
            onGenerate={handleSelectiveBackup}
            isGenerating={isGeneratingSelective}
          />
        </div>

        {/* Statistics */}
        <BackupStats statistics={statistics} isLoading={isLoadingStats} />

        {/* History */}
        <BackupHistory />

        {/* System Backup - Admin Only */}
        {!isLoadingAdmin && isAdmin && <SystemBackup isAdmin={isAdmin} />}

        {/* Info Card */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ⚠️ Informações Importantes
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Seguro</p>
                  <p className="text-xs text-muted-foreground">
                    Seus dados são exportados com segurança
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 text-teal-700 dark:text-teal-300 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Recomendação</p>
                  <p className="text-xs text-muted-foreground">
                    Faça backup semanalmente
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <FileJson className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Formato JSON</p>
                  <p className="text-xs text-muted-foreground">
                    Compatível com importação futura
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Server className="h-5 w-5 text-teal-700 dark:text-teal-300 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Migração VPS</p>
                  <p className="text-xs text-muted-foreground">
                    Pronto para migrar seus dados
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
