import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dinos, Dino } from "../../data/dinos";
import { DinoCard } from "../DinoCard";
import { playDino, playSuccess, playError, vibrate } from "../../audio/dinoSounds";
import { trackInteraction, useDinoSettings, loadBest, saveBest } from "../../context/DinoSettings";

type Phase = "idle" | "watching" | "playing" | "success" | "fail";

// 4 fixed dinos keeps the board readable for the child
const BOARD = dinos.slice(0, 4);

export function ImitateMode() {
  const { settings } = useDinoSettings();
  const [sequence, setSequence] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [userIndex, setUserIndex] = useState(0);
  const [level, setLevel] = useState(1);
  const [best, setBest] = useState(() => loadBest("imitate"));
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState("Toque em ▶️ para começar!");
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const dinoById = (id: string) => BOARD.find((d) => d.id === id)!;

  // Play a sequence back to the child with visual + audio highlight
  const showSequence = useCallback(
    (seq: string[]) => {
      clearTimers();
      setPhase("watching");
      setActiveId(null);
      setUserIndex(0);
      setFeedback("👀 Preste atenção na ordem...");
      const step = settings.calmMode ? 1000 : 750;
      seq.forEach((id, i) => {
        const onT = window.setTimeout(() => {
          setActiveId(id);
          playDino(dinoById(id));
        }, i * step + 400);
        const offT = window.setTimeout(() => setActiveId(null), i * step + 400 + step * 0.6);
        timers.current.push(onT, offT);
      });
      const doneT = window.setTimeout(() => {
        setPhase("playing");
        setUserIndex(0);
        setFeedback("🎵 Sua vez! Repita a ordem.");
      }, seq.length * step + 600);
      timers.current.push(doneT);
    },
    [clearTimers, settings.calmMode],
  );

  const startGame = useCallback(() => {
    const first = [BOARD[Math.floor(Math.random() * BOARD.length)].id];
    setLevel(1);
    setLives(3);
    setSequence(first);
    showSequence(first);
  }, [showSequence]);

  const nextLevel = useCallback(
    (prev: string[]) => {
      const next = [...prev, BOARD[Math.floor(Math.random() * BOARD.length)].id];
      setSequence(next);
      setLevel(next.length);
      setBest((b) => {
        const nb = Math.max(b, next.length);
        saveBest("imitate", nb);
        return nb;
      });
      showSequence(next);
    },
    [showSequence],
  );

  const handleTap = (dino: Dino) => {
    if (phase !== "playing") return;
    playDino(dino);
    setActiveId(dino.id);
    window.setTimeout(() => setActiveId(null), 250);

    const expected = sequence[userIndex];
    if (dino.id === expected) {
      const nextIdx = userIndex + 1;
      if (nextIdx === sequence.length) {
        // Completed this round
        setPhase("success");
        setFeedback("⭐ Muito bem! Próximo nível!");
        playSuccess();
        if (settings.vibration) vibrate([20, 40, 20]);
        trackInteraction(dino.id, "imitate", 2, sequence.length >= 4 ? 1 : 0);
        const t = window.setTimeout(() => nextLevel(sequence), 1300);
        timers.current.push(t);
      } else {
        setUserIndex(nextIdx);
      }
    } else {
      // Wrong tap
      const left = lives - 1;
      setLives(left);
      playError();
      if (settings.vibration) vibrate(60);
      trackInteraction(dino.id, "imitate");
      if (left <= 0) {
        setPhase("fail");
        setFeedback("💛 Fim de jogo! Vamos tentar de novo?");
        clearTimers();
      } else {
        setFeedback(`Ops! Vamos ouvir de novo 💛 (${left} ❤️)`);
        const t = window.setTimeout(() => showSequence(sequence), 1100);
        timers.current.push(t);
      }
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-black mb-1 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        🥁 Imitar o Ritmo
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-3 min-h-[1.5rem]">{feedback}</p>

      {/* Score row */}
      <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
        <Stat label="Nível" value={level} className="bg-purple-500" />
        <Stat label="Recorde" value={best} className="bg-amber-500" />
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-700 shadow font-bold text-sm">
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < lives ? "" : "opacity-25 grayscale"}>❤️</span>
          ))}
        </div>
      </div>

      {/* Progress dots for current attempt */}
      {(phase === "playing" || phase === "watching") && (
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {sequence.map((_, i) => (
            <span
              key={i}
              className={`h-2.5 rounded-full transition-all ${
                phase === "playing" && i < userIndex
                  ? "w-6 bg-emerald-500"
                  : "w-2.5 bg-slate-300 dark:bg-slate-600"
              }`}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center max-w-2xl mx-auto">
        {BOARD.map((d) => (
          <div
            key={d.id}
            className={phase === "watching" ? "pointer-events-none opacity-90" : ""}
          >
            <DinoCard dino={d} isActive={activeId === d.id} onTap={() => handleTap(d)} />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(phase === "idle" || phase === "fail" || phase === "success") && (
          <motion.button
            key="cta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={startGame}
            disabled={phase === "success"}
            className="mt-6 px-7 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black shadow-lg hover:opacity-90 disabled:opacity-50"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {phase === "fail" ? "🔄 Jogar de novo" : phase === "success" ? "⭐ Indo bem!" : "▶️ Começar"}
          </motion.button>
        )}
      </AnimatePresence>

      {phase === "playing" && (
        <button
          onClick={() => showSequence(sequence)}
          className="mt-6 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-700 text-purple-700 dark:text-purple-200 font-bold shadow"
        >
          🔁 Ouvir a sequência de novo
        </button>
      )}

      {phase === "watching" && (
        <p className="mt-6 text-sm font-semibold text-purple-500 animate-pulse">Observando a sequência...</p>
      )}
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className={`px-3 py-1.5 rounded-full text-white shadow text-sm font-bold ${className}`}>
      {label}: <span className="tabular-nums">{value}</span>
    </div>
  );
}
