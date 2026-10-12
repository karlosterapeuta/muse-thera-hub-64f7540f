import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, FileEdit, Archive } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PlanStatsHeaderProps {
  total: number;
  active: number;
  draft: number;
  completed: number;
}

const stats = [
  { key: "total", label: "Total", icon: ClipboardList, gradient: "from-teal-700 to-teal-800", text: "text-teal-700 dark:text-teal-300" },
  { key: "active", label: "Ativos", icon: CheckCircle2, gradient: "from-emerald-500 to-green-600", text: "text-emerald-600 dark:text-emerald-400" },
  { key: "draft", label: "Rascunhos", icon: FileEdit, gradient: "from-teal-600 to-emerald-700", text: "text-teal-700 dark:text-teal-300" },
  { key: "completed", label: "Concluídos", icon: Archive, gradient: "from-teal-700 to-emerald-700", text: "text-teal-700 dark:text-teal-300" },
];

export function PlanStatsHeader(props: PlanStatsHeaderProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        const value = (props as any)[s.key] as number;
        return (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <Card className="relative overflow-hidden border border-border/60 bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 p-4">
              <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${s.gradient} opacity-[0.10] dark:opacity-[0.18] rounded-full blur-2xl`} />
              <div className="relative flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} p-[1px] shadow-md`}>
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                    <Icon className={`h-5 w-5 ${s.text}`} />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
