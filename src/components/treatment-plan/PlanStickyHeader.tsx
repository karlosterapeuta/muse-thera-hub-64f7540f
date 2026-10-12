import { motion } from "framer-motion";
import { ArrowLeft, Save, Download, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlanStickyHeaderProps {
  isEditing: boolean;
  patientName?: string;
  status?: string;
  completion: number; // 0-100
  isAutoSaving: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  isGeneratingPDF: boolean;
  canDownload: boolean;
  onBack: () => void;
  onSave: () => void;
  onDownload: () => void;
}

const statusBadge = (status?: string) => {
  switch ((status || 'draft').toLowerCase()) {
    case 'active':
    case 'ativo':
      return { label: 'Ativo', cn: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' };
    case 'completed':
    case 'concluído':
      return { label: 'Concluído', cn: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30' };
    case 'archived':
      return { label: 'Arquivado', cn: 'bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30' };
    default:
      return { label: 'Rascunho', cn: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' };
  }
};

export function PlanStickyHeader(p: PlanStickyHeaderProps) {
  const st = statusBadge(p.status);

  return (
    <div className="sticky top-0 z-30 -mx-4 sm:mx-0 mb-4 backdrop-blur-xl bg-background/85 border-b border-border/60">
      <div className="px-4 sm:px-0 py-3 space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" onClick={p.onBack} className="shrink-0 h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-foreground truncate">
                {p.isEditing ? (p.patientName || 'Plano sem nome') : 'Novo Plano Musicoterapêutico'}
              </h1>
              <Badge variant="outline" className={`text-[10px] ${st.cn}`}>{st.label}</Badge>
            </div>

            {/* Save status */}
            <div className="hidden sm:flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
              {p.isAutoSaving ? (
                <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3 animate-spin" /> Salvando automaticamente…</span>
              ) : p.hasUnsavedChanges ? (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-3 w-3" /> Alterações não salvas
                </span>
              ) : p.lastSaved ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Salvo às {p.lastSaved.toLocaleTimeString()}
                </span>
              ) : (
                <span>Pronto para começar</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              onClick={p.onDownload}
              variant="outline"
              size="sm"
              disabled={!p.canDownload || p.isGeneratingPDF}
              className="gap-1.5 hidden sm:inline-flex"
            >
              {p.isGeneratingPDF ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              <span className="hidden md:inline">PDF</span>
            </Button>
            <Button
              onClick={p.onSave}
              disabled={p.isSaving || p.isAutoSaving}
              size="sm"
              className="gap-1.5 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-md shadow-primary/20"
            >
              {p.isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {p.isSaving ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700"
              initial={{ width: 0 }}
              animate={{ width: `${p.completion}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground tabular-nums w-10 text-right">
            {p.completion}%
          </span>
        </div>
      </div>
    </div>
  );
}
