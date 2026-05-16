import { useDinoSettings } from "../context/DinoSettings";
import { X } from "lucide-react";

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { settings, update, reset } = useDinoSettings();

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl border-4 border-purple-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            ⚙️ Configurações
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm">
          <Range label={`🔊 Volume — ${Math.round(settings.volume * 100)}%`} value={settings.volume} min={0} max={1} step={0.05} onChange={(v) => update("volume", v)} />

          <Toggle label="🗣️ Narração ativada" checked={settings.narration} onChange={(v) => update("narration", v)} />

          <Toggle label="🌿 Modo sensorial reduzido" checked={settings.reducedSensory} onChange={(v) => update("reducedSensory", v)} />

          <Toggle label="👁️ Reduzir estímulos visuais" checked={settings.reducedVisuals} onChange={(v) => update("reducedVisuals", v)} />

          <Toggle label="🌙 Modo escuro/calmo" checked={settings.calmMode} onChange={(v) => update("calmMode", v)} />

          <Toggle label="📳 Vibração" checked={settings.vibration} onChange={(v) => update("vibration", v)} />

          <Range label={`🐢 Velocidade animações — ${settings.animationSpeed.toFixed(1)}x`} value={settings.animationSpeed} min={0.5} max={1.5} step={0.1} onChange={(v) => update("animationSpeed", v)} />

          <button onClick={reset} className="w-full mt-2 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600">
            Restaurar padrões
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors ${checked ? "bg-purple-500" : "bg-slate-300"}`}
      >
        <span className={`absolute top-1 ${checked ? "left-6" : "left-1"} w-5 h-5 rounded-full bg-white shadow transition-all`} />
      </button>
    </label>
  );
}

function Range({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-purple-500"
      />
    </div>
  );
}
