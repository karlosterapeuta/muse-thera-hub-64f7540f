import { useState } from "react";
import { loadProgress, resetProgress } from "../context/DinoSettings";
import { dinos } from "../data/dinos";
import { Star, Egg } from "lucide-react";

const MODE_LABELS: Record<string, string> = {
  free: "Modo Livre",
  imitate: "Imitar o Ritmo",
  discover: "Descobrir o Som",
  speech: "Comunicação",
  story: "História Musical",
};

export function TherapistPanel({ onClose }: { onClose: () => void }) {
  const [p, setP] = useState(loadProgress());

  const minutes = Math.floor(p.totalSeconds / 60);
  const seconds = p.totalSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl border-4 border-emerald-200 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-emerald-700 dark:text-emerald-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            👩‍⚕️ Área Terapêutica
          </h2>
          <button onClick={onClose} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-sm font-semibold">Fechar</button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <Stat icon={<Star className="w-5 h-5" />} label="Estrelas" value={p.stars} color="bg-yellow-100 text-yellow-800" />
          <Stat icon={<Egg className="w-5 h-5" />} label="Ovos" value={p.eggs} color="bg-orange-100 text-orange-800" />
          <Stat label="Interações" value={p.interactions} color="bg-purple-100 text-purple-800" />
          <Stat label="Tempo total" value={`${minutes}m ${seconds}s`} color="bg-blue-100 text-blue-800" />
        </div>

        <section className="mb-5">
          <h3 className="font-bold mb-2 text-slate-700 dark:text-slate-200">Respostas musicais por dino</h3>
          <div className="space-y-1">
            {dinos.map((d) => {
              const v = p.byDino[d.id] ?? 0;
              const max = Math.max(1, ...Object.values(p.byDino));
              return (
                <div key={d.id} className="flex items-center gap-2 text-sm">
                  <span className="w-7">{d.emoji}</span>
                  <span className="w-32 truncate font-semibold">{d.name}</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${d.bg}`} style={{ width: `${(v / max) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right tabular-nums">{v}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-5">
          <h3 className="font-bold mb-2 text-slate-700 dark:text-slate-200">Tempo de atenção por modo</h3>
          <div className="space-y-1 text-sm">
            {Object.entries(MODE_LABELS).map(([k, label]) => (
              <div key={k} className="flex justify-between">
                <span>{label}</span>
                <span className="tabular-nums font-semibold">{p.byMode[k] ?? 0}</span>
              </div>
            ))}
          </div>
        </section>

        {p.lastSession && (
          <p className="text-xs text-slate-500 mb-3">Última sessão: {new Date(p.lastSession).toLocaleString("pt-BR")}</p>
        )}

        <button
          onClick={() => { resetProgress(); setP(loadProgress()); }}
          className="w-full py-2 rounded-xl bg-rose-100 text-rose-700 font-semibold hover:bg-rose-200"
        >
          Limpar progresso
        </button>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }: { icon?: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className={`rounded-2xl p-3 ${color} flex flex-col items-start`}>
      <div className="flex items-center gap-1 text-xs font-semibold opacity-80">{icon} {label}</div>
      <div className="text-2xl font-black tabular-nums">{value}</div>
    </div>
  );
}
