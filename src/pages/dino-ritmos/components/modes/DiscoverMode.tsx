import { useCallback, useEffect, useRef, useState } from "react";
import { dinos, Dino } from "../../data/dinos";
import { DinoCard } from "../DinoCard";
import { playDino, playSuccess, playError, vibrate } from "../../audio/dinoSounds";
import { trackInteraction, useDinoSettings, loadBest, saveBest } from "../../context/DinoSettings";

type Level = 2 | 3 | 4;

function pick(n: number): Dino[] {
  const shuffled = [...dinos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function DiscoverMode() {
  const { settings } = useDinoSettings();
  const [level, setLevel] = useState<Level>(3);
  const [options, setOptions] = useState<Dino[]>(() => pick(3));
  const [target, setTarget] = useState<Dino | null>(null);
  const [feedback, setFeedback] = useState("Toque em ▶️ para ouvir o som!");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [best, setBest] = useState(() => loadBest("discover"));
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  const newRound = useCallback(
    (n: Level, bumpRound = true) => {
      clearTimers();
      const opts = pick(n);
      const t = opts[Math.floor(Math.random() * opts.length)];
      setOptions(opts);
      setTarget(t);
      setAttempts(0);
      setLocked(false);
      setFeedback("👂 Ouça com atenção...");
      if (bumpRound) setRound((r) => r + 1);
      const id = window.setTimeout(() => playDino(t), 500);
      timers.current.push(id);
    },
    [clearTimers],
  );

  const changeLevel = (n: Level) => {
    setLevel(n);
    setScore(0);
    setStreak(0);
    setRound(1);
    newRound(n, false);
  };

  const handle = (d: Dino) => {
    if (!target || locked) return;
    if (d.id === target.id) {
      const gained = attempts === 0 ? 3 : 1;
      const nextScore = score + gained;
      const nextStreak = streak + 1;
      setScore(nextScore);
      setStreak(nextStreak);
      setLocked(true);
      setFeedback(`🎉 Isso! Era o ${target.name} (${target.instrumentLabel}) +${gained}`);
      playSuccess();
      if (settings.vibration) vibrate([20, 40, 20]);
      trackInteraction(d.id, "discover", gained, nextStreak % 5 === 0 ? 1 : 0);
      if (nextScore > best) { setBest(nextScore); saveBest("discover", nextScore); }
      const id = window.setTimeout(() => newRound(level), 1600);
      timers.current.push(id);
    } else {
      setAttempts((a) => a + 1);
      setStreak(0);
      setFeedback(`Quase! Esse é o ${d.name}. Vamos ouvir de novo 💛`);
      playError();
      trackInteraction(d.id, "discover");
      const id = window.setTimeout(() => target && playDino(target), 600);
      timers.current.push(id);
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-black mb-1 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        🔍 Descobrir o Som
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-3 min-h-[1.5rem]">{feedback}</p>

      <div className="flex items-center justify-center gap-2 mb-4 flex-wrap text-sm font-bold">
        <span className="px-3 py-1.5 rounded-full bg-purple-500 text-white shadow">Rodada: <span className="tabular-nums">{round}</span></span>
        <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white shadow">Pontos: <span className="tabular-nums">{score}</span></span>
        <span className="px-3 py-1.5 rounded-full bg-amber-500 text-white shadow">Sequência: <span className="tabular-nums">{streak}</span>🔥</span>
        <span className="px-3 py-1.5 rounded-full bg-slate-500 text-white shadow">Recorde: <span className="tabular-nums">{best}</span></span>
      </div>

      <div className="flex justify-center gap-2 mb-3 flex-wrap">
        {([2, 3, 4] as Level[]).map((n) => (
          <button
            key={n}
            onClick={() => changeLevel(n)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold shadow border-2 ${
              level === n ? "bg-purple-500 border-purple-300 text-white" : "bg-white/80 dark:bg-slate-700 border-transparent text-purple-700 dark:text-purple-200"
            }`}
          >
            {n} opções
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        <button
          onClick={() => target ? playDino(target) : newRound(level, false)}
          className="px-4 py-2 rounded-full bg-purple-500 text-white font-bold shadow"
        >
          ▶️ {target ? "Ouvir de novo" : "Começar"}
        </button>
        <button onClick={() => newRound(level)} className="px-4 py-2 rounded-full bg-amber-400 text-amber-900 font-bold shadow">
          🔄 Pular
        </button>
        {attempts >= 2 && target && (
          <span className="px-4 py-2 rounded-full bg-sky-100 text-sky-800 text-sm font-bold">
            💡 Dica: instrumento é {target.instrumentLabel}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
        {options.map((d) => (
          <DinoCard key={d.id} dino={d} onTap={() => handle(d)} isActive={locked && target?.id === d.id} />
        ))}
      </div>
    </div>
  );
}
