import { dinos } from "../../data/dinos";
import { DinoCard } from "../DinoCard";
import { playDino } from "../../audio/dinoSounds";
import { trackInteraction } from "../../context/DinoSettings";

export function FreeMode() {
  return (
    <div>
      <h3 className="text-2xl font-black text-center mb-1 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        🎵 Modo Livre
      </h3>
      <p className="text-center text-slate-600 dark:text-slate-300 mb-5">Toque nos dinossauros para criar sua música!</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
        {dinos.map((d) => (
          <DinoCard key={d.id} dino={d} onTap={() => { playDino(d); trackInteraction(d.id, "free", 1); }} />
        ))}
      </div>
    </div>
  );
}
