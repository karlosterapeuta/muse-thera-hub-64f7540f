import { useEffect, useMemo, useRef, useState } from "react";
import { dinos } from "../../data/dinos";
import { DinoCard } from "../DinoCard";
import { playDino, startAmbient, stopAmbient, vibrate } from "../../audio/dinoSounds";
import { trackInteraction, useDinoSettings } from "../../context/DinoSettings";

type ChoreoKey = "calma" | "festa" | "marcha";

const CHOREO: Record<ChoreoKey, { label: string; emoji: string; steps: number[][] }> = {
  // each step = indexes of dinos that play on that beat
  calma: { label: "Calma", emoji: "🌙", steps: [[3], [], [4], [], [1], [], [7], []] },
  festa: { label: "Festa", emoji: "🎉", steps: [[0], [2], [0, 5], [2], [0], [4], [0, 2], [5]] },
  marcha: { label: "Marcha", emoji: "🥁", steps: [[0], [], [1], [], [0], [], [1], [6]] },
};

export function DanceMode() {
  const { settings } = useDinoSettings();
  const [playing, setPlaying] = useState(true);
  const [bpm, setBpm] = useState(90);
  const [choreo, setChoreo] = useState<ChoreoKey>("festa");
  const [beat, setBeat] = useState(0);
  const [withAmbient, setWithAmbient] = useState(true);
  const beatRef = useRef(0);

  const steps = CHOREO[choreo].steps;
  const activeIdx = useMemo(() => new Set(steps[beat % steps.length] ?? []), [steps, beat]);

  // Ambient pad follows its own toggle
  useEffect(() => {
    if (withAmbient && !settings.reducedSensory) startAmbient();
    else stopAmbient();
    return () => stopAmbient();
  }, [withAmbient, settings.reducedSensory]);

  // Beat clock
  useEffect(() => {
    if (!playing) return;
    const interval = (60 / bpm) * 1000;
    const id = window.setInterval(() => {
      const b = beatRef.current % steps.length;
      const notes = steps[b] ?? [];
      notes.forEach((i) => {
        const d = dinos[i];
        if (d) playDino(d, { duration: "8n" });
      });
      if (notes.length && settings.vibration) vibrate(18);
      beatRef.current += 1;
      setBeat(beatRef.current);
    }, interval);
    return () => clearInterval(id);
  }, [playing, bpm, steps, settings.vibration]);

  const togglePlay = () => {
    setPlaying((p) => {
      if (!p) trackInteraction(undefined, "dance", 1);
      return !p;
    });
  };

  const tapDino = (i: number) => {
    const d = dinos[i];
    playDino(d);
    if (settings.vibration) vibrate(20);
    trackInteraction(d.id, "dance", 1);
  };

  return (
    <div>
      <h3 className="text-2xl font-black text-center mb-1 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        💃 Dança dos Dinos
      </h3>
      <p className="text-center text-slate-600 dark:text-slate-300 mb-4">
        Escolha a coreografia, ajuste o ritmo e toque nos dinos para entrar na dança!
      </p>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <button
          onClick={togglePlay}
          className={`px-5 py-2 rounded-full font-black text-white shadow ${playing ? "bg-rose-500" : "bg-emerald-500"}`}
        >
          {playing ? "⏸️ Pausar" : "▶️ Dançar"}
        </button>
        {(Object.keys(CHOREO) as ChoreoKey[]).map((k) => (
          <button
            key={k}
            onClick={() => { setChoreo(k); beatRef.current = 0; setBeat(0); }}
            className={`px-4 py-2 rounded-full font-bold text-sm shadow border-2 transition-colors ${
              choreo === k
                ? "bg-purple-500 border-purple-300 text-white"
                : "bg-white/80 dark:bg-slate-700 border-transparent text-purple-700 dark:text-purple-200"
            }`}
          >
            {CHOREO[k].emoji} {CHOREO[k].label}
          </button>
        ))}
        <button
          onClick={() => setWithAmbient((v) => !v)}
          className={`px-4 py-2 rounded-full font-bold text-sm shadow ${withAmbient ? "bg-sky-500 text-white" : "bg-white/80 dark:bg-slate-700 text-sky-600"}`}
        >
          {withAmbient ? "🎼 Fundo ligado" : "🔇 Fundo desligado"}
        </button>
      </div>

      <div className="max-w-sm mx-auto mb-5">
        <label className="block text-center text-sm font-bold text-slate-600 dark:text-slate-300 mb-1">
          🕒 Andamento — {bpm} BPM
        </label>
        <input
          type="range"
          min={50}
          max={160}
          step={5}
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value, 10))}
          className="w-full accent-purple-500"
          aria-label="Andamento em batidas por minuto"
        />
      </div>

      {/* Beat indicator */}
      <div className="flex items-center justify-center gap-1.5 mb-5">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-3 rounded-full transition-all ${
              beat % steps.length === i ? "w-7 bg-purple-500" : "w-3 bg-slate-300 dark:bg-slate-600"
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
        {dinos.map((d, i) => (
          <DinoCard key={d.id} dino={d} isActive={activeIdx.has(i)} onTap={() => tapDino(i)} />
        ))}
      </div>
    </div>
  );
}
