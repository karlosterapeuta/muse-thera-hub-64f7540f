import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Download, 
  Loader2, 
  Users, 
  FileText, 
  DollarSign, 
  Building2, 
  GraduationCap, 
  Activity,
  AlertTriangle,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { saveAs } from "file-saver";

interface SystemBackupProps {
  isAdmin: boolean;
}

interface GlobalStatistics {
  profiles: number;
  professionals: number;
  patients: number;
  anamnesis: number;
  assessments: number;
  treatment_plans: number;
  reports: number;
  sessions: number;
  financial_records: number;
  clinics: number;
  courses: number;
  course_modules: number;
  course_lessons: number;
  user_course_progress: number;
}

export function SystemBackup({ isAdmin }: SystemBackupProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statistics, setStatistics] = useState<GlobalStatistics | null>(null);

  const loadGlobalStatistics = async () => {
    setIsLoadingStats(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Sessão expirada");
        return;
      }

      const { data, error } = await supabase.functions.invoke("backup-full-system", {
        body: { action: "statistics" },
      });

      if (error) throw error;
      if (data?.statistics) {
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error("Error loading statistics:", error);
      toast.error("Erro ao carregar estatísticas globais");
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSystemBackup = async () => {
    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Sessão expirada");
        return;
      }

      toast.info("Gerando backup do sistema... Isso pode levar alguns segundos.");

      const { data, error } = await supabase.functions.invoke("backup-full-system", {
        body: { action: "backup" },
      });

      if (error) throw error;
      
      if (!data?.success) {
        throw new Error(data?.error || "Erro ao gerar backup");
      }

      // Generate and download the file
      const backupContent = JSON.stringify(data.data, null, 2);
      const blob = new Blob([backupContent], { type: "application/json" });
      const date = new Date().toISOString().split("T")[0];
      const fileName = `mustera_backup_sistema_${date}.json`;
      
      saveAs(blob, fileName);
      
      toast.success("Backup do sistema gerado com sucesso!");
    } catch (error: any) {
      console.error("Error generating system backup:", error);
      toast.error(error.message || "Erro ao gerar backup do sistema");
    } finally {
      setIsGenerating(false);
    }
  };

  // Load statistics on first render if admin
  useState(() => {
    if (isAdmin) {
      loadGlobalStatistics();
    }
  });

  if (!isAdmin) {
    return null;
  }

  const statItems = [
    { key: "profiles", label: "Usuários", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { key: "professionals", label: "Profissionais", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { key: "patients", label: "Pacientes", icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    { key: "anamnesis", label: "Anamneses", icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
    { key: "assessments", label: "Avaliações", icon: FileText, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { key: "treatment_plans", label: "Planos", icon: FileText, color: "text-orange-500", bg: "bg-orange-500/10" },
    { key: "reports", label: "Relatórios", icon: FileText, color: "text-rose-500", bg: "bg-rose-500/10" },
    { key: "financial_records", label: "Financeiro", icon: DollarSign, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { key: "clinics", label: "Clínicas", icon: Building2, color: "text-teal-500", bg: "bg-teal-500/10" },
    { key: "sessions", label: "Sessões", icon: Activity, color: "text-pink-500", bg: "bg-pink-500/10" },
    { key: "courses", label: "Cursos", icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { key: "course_lessons", label: "Aulas", icon: GraduationCap, color: "text-lime-500", bg: "bg-lime-500/10" },
  ];

  const totalRecords = statistics 
    ? Object.values(statistics).reduce((sum, val) => sum + val, 0) 
    : 0;

  const estimatedSize = Math.round((totalRecords * 0.5) / 1024 * 100) / 100; // Rough estimate in MB

  return (
    <Card className="border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5">
      <CardContent className="p-4 sm:p-6">
        {/* Header with Warning */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-500/20">
            <Lock className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
              🔐 Backup do Sistema (Administrador)
            </h3>
            <p className="text-sm text-muted-foreground">
              Exportar dados de TODOS os profissionais
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-6">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-yellow-700 dark:text-yellow-400 text-sm">
              Atenção: Backup Completo do Sistema
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
              Este backup inclui dados de TODOS os profissionais cadastrados no sistema. 
              Use apenas para migração de servidor ou backup de segurança institucional.
            </p>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">📊 Estatísticas Globais do Sistema</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={loadGlobalStatistics}
              disabled={isLoadingStats}
            >
              {isLoadingStats ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Atualizar"
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {statItems.map((item) => {
              const Icon = item.icon;
              const value = statistics?.[item.key as keyof GlobalStatistics] ?? 0;
              
              return (
                <div 
                  key={item.key} 
                  className={`flex items-center gap-2 p-3 rounded-lg ${item.bg}`}
                >
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <div>
                    <p className="text-lg font-bold">
                      {isLoadingStats ? "-" : value.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Backup Info */}
        <div className="p-4 rounded-lg bg-muted/50 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total de registros</span>
            <span className="text-2xl font-bold">
              {isLoadingStats ? "-" : totalRecords.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Tamanho estimado</span>
            <span className="text-sm font-medium">~{estimatedSize} MB</span>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleSystemBackup}
          disabled={isGenerating || totalRecords === 0}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Gerando Backup do Sistema...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Gerar Backup Completo do Sistema
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-3">
          Inclui: 17 tabelas • Usuários • Dados Clínicos • Cursos • Logs
        </p>
      </CardContent>
    </Card>
  );
}
