import { cn } from "@/lib/utils";
import { sectionLabels, sectionColors, type Section } from "../data/orchestraAnimals";

interface Props {
  active: Section | "tutti";
  onChange: (s: Section | "tutti") => void;
  onPlayTutti: () => void;
}

const items: Array<Section | "tutti"> = ["tutti", "cordas", "madeiras", "metais", "percussao"];

export function SectionFilter({ active, onChange, onPlayTutti }: Props) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
      {items.map((key) => {
        const isActive = active === key;
        const color = key === "tutti" ? "#a855f7" : sectionColors[key as Section];
        return (
          <button
            key={key}
            onClick={() => {
              onChange(key);
              if (key === "tutti") onPlayTutti();
            }}
            className={cn(
              "px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-200 border-4 shadow-md",
              "hover:scale-105 active:scale-95",
              isActive ? "text-white scale-105" : "text-gray-800 bg-white/90"
            )}
            style={{
              borderColor: color,
              backgroundColor: isActive ? color : undefined,
              fontFamily: "'Fredoka', 'Comic Sans MS', sans-serif",
            }}
          >
            {key === "tutti" && "🎼 "}
            {sectionLabels[key]}
          </button>
        );
      })}
    </div>
  );
}
