import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User as UserIcon, Stethoscope, Eye, Edit, Download, Copy, Trash2, Loader2, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { MusicotherapyTreatmentPlanSummary } from "@/hooks/useMusicotherapyTreatmentPlans";

interface PlanListCardProps {
  plan: MusicotherapyTreatmentPlanSummary;
  index: number;
  isDownloading: boolean;
  isDuplicating: boolean;
  onView: () => void;
  onEdit: () => void;
  onDownload: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const statusStyle = (status: string) => {
  switch ((status || "draft").toLowerCase()) {
    case "active":
    case "ativo":
      return { label: "Ativo", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" };
    case "completed":
    case "concluído":
      return { label: "Concluído", className: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30" };
    case "archived":
    case "arquivado":
      return { label: "Arquivado", className: "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30" };
    default:
      return { label: "Rascunho", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30" };
  }
};

const initials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")).toUpperCase();
};

const formatDate = (s: string) => {
  try { return format(new Date(s), "dd 'de' MMM, yyyy", { locale: ptBR }); }
  catch { return "—"; }
};

export function PlanListCard({ plan, index, isDownloading, isDuplicating, onView, onEdit, onDownload, onDuplicate, onDelete }: PlanListCardProps) {
  const st = statusStyle(plan.status || "draft");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Card className="group relative h-full flex flex-col overflow-hidden border border-border/60 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-primary to-purple-500 opacity-[0.06] dark:opacity-[0.12] rounded-full blur-2xl group-hover:opacity-[0.15] transition-opacity" />

        <div className="relative p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white font-bold flex items-center justify-center shadow-md shrink-0">
              {initials(plan.patient_full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-foreground leading-tight truncate" title={plan.patient_full_name}>
                {plan.patient_full_name || "Sem nome"}
              </h3>
              {plan.patient_age && (
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  {plan.patient_age}
                </p>
              )}
            </div>
            <Badge variant="outline" className={`shrink-0 ${st.className}`}>{st.label}</Badge>
          </div>

          {/* Diagnosis */}
          <div className="flex items-start gap-2 mb-3 p-2.5 rounded-lg bg-muted/40">
            <Stethoscope className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-foreground/80 line-clamp-2" title={plan.clinical_diagnosis}>
              {plan.clinical_diagnosis || "Diagnóstico não informado"}
            </p>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Atualizado {formatDate(plan.updated_at)}</span>
            </div>
            {plan.responsible_person && (
              <span className="truncate max-w-[40%]" title={plan.responsible_person}>{plan.responsible_person}</span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
            <Button size="sm" variant="ghost" onClick={onView} className="flex-1 min-w-[68px] gap-1.5 hover:bg-primary/10 hover:text-primary">
              <Eye className="h-3.5 w-3.5" /> Ver
            </Button>
            <Button size="sm" variant="ghost" onClick={onEdit} className="flex-1 min-w-[68px] gap-1.5 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400">
              <Edit className="h-3.5 w-3.5" /> Editar
            </Button>
            <Button size="sm" variant="ghost" onClick={onDownload} disabled={isDownloading} className="flex-1 min-w-[68px] gap-1.5 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400">
              {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} PDF
            </Button>
            <Button size="sm" variant="ghost" onClick={onDuplicate} disabled={isDuplicating} className="flex-1 min-w-[68px] gap-1.5 hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400">
              {isDuplicating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Copy className="h-3.5 w-3.5" />} Duplicar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" className="flex-1 min-w-[68px] gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" /> Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir plano musicoterapêutico</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o plano de <strong>{plan.patient_full_name}</strong>? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
