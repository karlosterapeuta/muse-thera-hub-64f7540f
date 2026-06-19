import { useRef, useState, useCallback, useEffect } from "react";
import { dinos, Dino } from "../../data/dinos";
import { DinoCard } from "../DinoCard";
import { playDino } from "../../audio/dinoSounds";
import { trackInteraction } from "../../context/DinoSettings";

interface RecordedNote { dino: Dino; at: number }

export function FreeMode() {
  const [recording, setRecording] = useState(false);
  const [notes, setNotes] = useState<RecordedNote[]>([]);
  const [playing, setPlaying] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const startRef = useRef(0);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  const tap = (d: Dino) => {
    playDino(d);
    setActiveId(d.id);
    window.setTimeout(() => setActiveId((id) => (id === d.id ? null : id)), 220);
    trackInteraction(d.id, "free", 1);
    if (recording) {
      setNotes((n) => [...n, { dino: d, at: Date.now() - startRef.current }]);
    }
  };

  const toggleRecord = () => {
    if (recording) {
      setRecording(false);
    } else {
      setNotes([]);
      startRef.current = Date.now();
      setRecording(true);
    }
  };

  const playback = () => {
    if (!notes.length || playing) return;
    setPlaying(true);
    clearTimers();
    notes.forEach((n) => {
      const t = window.setTimeout(() => {
        playDino(n.dino);
        setActiveId(n.dino.id);
        window.setTimeout(() => setActiveId((id) => (id === n.dino.id ? null : id)), 220);
      }, n.at);
      timers.current.push(t);
    });
    const end = window.setTimeout(() => setPlaying(false), (notes[notes.length - 1]?.at ?? 0) + 600);
    timers.current.push(end);
  };

  const clear = () => {
    clearTimers();
    setNotes([]);
    setRecording(false);
    setPlaying(false);
  };

  return (
    <div>
      <h3 className="text-2xl font-black text-center mb-1 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        🎵 Modo Livre
      </h3>
      <p className="text-center text-slate-600 dark:text-slate-300 mb-4">Toque nos dinossauros para criar sua música!</p>

      {/* Recorder toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        <button
          onClick={toggleRecord}
          className={`px-4 py-2 rounded-full font-bold text-sm shadow transition-colors ${
            recording ? "bg-red-500 text-white animate-pulse" : "bg-white/80 dark:bg-slate-700 text-red-500"
          }`}
        >
          {recording ? "⏺️ Gravando..." : "⏺️ Gravar"}
        </button>
        <button
          onClick={playback}
          disabled={!notes.length || recording || playing}
          className="px-4 py-2 rounded-full bg-emerald-500 text-white font-bold text-sm shadow disabled:opacity-40"
        >
          {playing ? "🔊 Tocando..." : "▶️ Tocar"}
        </button>
        <button
          onClick={clear}
          disabled={!notes.length && !recording}
          className="px-4 py-2 rounded-full bg-slate-400 text-white font-bold text-sm shadow disabled:opacity-40"
        >
          🗑️ Limpar
        </button>
        {notes.length > 0 && (
          <span className="px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 text-sm font-bold">
            {notes.length} nota{notes.length > 1 ? "s" : ""} 🎶
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
        {dinos.map((d) => (
          <DinoCard key={d.id} dino={d} isActive={activeId === d.id} onTap={() => tap(d)} />
        ))}
      </div>
    </div>
  );
}
