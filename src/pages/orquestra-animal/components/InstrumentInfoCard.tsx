import type { AnimalMusician } from "../data/orchestraAnimals";
import { sectionLabels } from "../data/orchestraAnimals";

interface Props {
  animal: AnimalMusician | null;
}

export function InstrumentInfoCard({ animal }: Props) {
  if (!animal) {
    return (
      <div className="rounded-3xl bg-white/90 dark:bg-white/80 p-6 shadow-xl border-4 border-dashed border-purple-300 text-center">
        <div className="text-5xl mb-2">👆</div>
        <p
          className="text-gray-700 font-bold text-base"
          style={{ fontFamily: "'Fredoka', 'Comic Sans MS', sans-serif" }}
        >
          Clique em um animal para ouvir o instrumento dele!
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl p-6 shadow-2xl border-4 text-center animate-[scale-in_0.3s_ease-out]"
      style={{ borderColor: animal.color, backgroundColor: "rgba(255,255,255,0.95)" }}
    >
      <div className="text-7xl mb-2 animate-bounce">{animal.animalEmoji}</div>
      <h3
        className="text-2xl font-black text-gray-900 mb-1"
        style={{ fontFamily: "'Fredoka', 'Comic Sans MS', sans-serif" }}
      >
        {animal.name} tocando {animal.instrument}!
      </h3>
      <div
        className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-3"
        style={{ backgroundColor: animal.color }}
      >
        Naipe: {sectionLabels[animal.section]}
      </div>
      <p className="text-gray-700 text-sm font-medium italic">"{animal.fact}"</p>
    </div>
  );
}
