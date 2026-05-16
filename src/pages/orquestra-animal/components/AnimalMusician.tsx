import { cn } from "@/lib/utils";
import type { AnimalMusician as AnimalType } from "../data/orchestraAnimals";

interface Props {
  animal: AnimalType;
  isPlaying: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export function AnimalMusician({ animal, isPlaying, isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={`Clique para ouvir o ${animal.name} tocar ${animal.instrument}`}
      className={cn(
        "group relative flex flex-col items-center justify-center rounded-3xl p-3 sm:p-4 transition-all duration-300",
        "bg-white/95 dark:bg-white/90 border-4 shadow-lg hover:shadow-2xl",
        "hover:scale-110 active:scale-95",
        isPlaying && "animate-bounce",
        isSelected ? "ring-4 ring-yellow-300 scale-110" : ""
      )}
      style={{ borderColor: animal.color }}
    >
      {/* Animal emoji */}
      <div
        className={cn(
          "text-5xl sm:text-6xl leading-none transition-transform",
          isPlaying && "animate-pulse"
        )}
      >
        {animal.animalEmoji}
      </div>

      {/* Instrument badge */}
      <div
        className="absolute -bottom-2 -right-2 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-md border-2 border-white"
        style={{ backgroundColor: animal.color }}
      >
        {animal.instrumentEmoji}
      </div>

      {/* Name label */}
      <div
        className="mt-1 text-[10px] sm:text-xs font-black uppercase tracking-wide text-gray-800"
        style={{ fontFamily: "'Fredoka', 'Comic Sans MS', sans-serif" }}
      >
        {animal.name}
      </div>

      {/* Musical notes flying */}
      {isPlaying && (
        <>
          <span className="absolute -top-2 left-1/2 text-2xl animate-[float_1.2s_ease-out_infinite]">🎵</span>
          <span className="absolute -top-4 left-1/3 text-xl animate-[float_1.5s_ease-out_infinite] delay-150">🎶</span>
        </>
      )}
    </button>
  );
}
