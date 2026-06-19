import type { AnimalMusician } from "../data/orchestraAnimals";

interface Props {
  sequence: AnimalMusician[];
  isPlaying: boolean;
  onPlay: () => void;
  onClear: () => void;
  onRemoveLast: () => void;
}

export function SequencerBar({ sequence, isPlaying, onPlay, onClear, onRemoveLast }: Props) {
  return (
    <div
      className="bg-white/95 rounded-3xl border-4 border-purple-400 shadow-xl p-3 sm:p-4 mb-4"
      style={{ fontFamily: "'Fredoka', 'Comic Sans MS', sans-serif" }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm sm:text-base font-black text-purple-700 uppercase tracking-wide">
          🎼 Sua Música ({sequence.length})
        </span>
        <div className="flex gap-2">
          <button
            onClick={onPlay}
            disabled={sequence.length === 0 || isPlaying}
            className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full px-4 py-1.5 text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
          >
            ▶ Tocar
          </button>
          <button
            onClick={onRemoveLast}
            disabled={sequence.length === 0}
            className="bg-amber-400 text-amber-900 rounded-full px-3 py-1.5 text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
          >
            ↩
          </button>
          <button
            onClick={onClear}
            disabled={sequence.length === 0}
            className="bg-red-500 text-white rounded-full px-3 py-1.5 text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 min-h-[2.5rem] items-center bg-purple-50 rounded-2xl p-2">
        {sequence.length === 0 ? (
          <span className="text-xs text-purple-400 px-2">
            Toque nos bichinhos para criar sua música! 🎵
          </span>
        ) : (
          sequence.map((a, i) => (
            <span
              key={`${a.id}-${i}`}
              className="text-2xl sm:text-3xl w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl border-2 shadow-sm bg-white"
              style={{ borderColor: a.color }}
              title={a.name}
            >
              {a.animalEmoji}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
