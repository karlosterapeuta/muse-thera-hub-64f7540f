import { useEffect, useState } from "react";
import { dinos } from "../../data/dinos";
import { DinoCard } from "../DinoCard";
import { playDino } from "../../audio/dinoSounds";
import { trackInteraction } from "../../context/DinoSettings";

function pickFour() {
  const shuffled = [...dinos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

export function DiscoverMode() {
  const [round, setRound] = useState(0);
  const [options, setOptions] = useState(() => pickFour());
  const [target, setTarget] = useState(() => options[Math.floor(Math.random() * 4)]);
  const [feedback, setFeedback] = useState("Ouça o som e descubra qual dino tocou!");

  useEffect(() => {
    const t = setTimeout(() => playDino(target), 400);
    return () => clearTimeout(t);
  }, [target]);

  const next = () => {
    const opts = pickFour();
    setOptions(opts);
    setTarget(opts[Math.floor(Math.random() * 4)]);
    setFeedback("Ouça com atenção...");
    setRound((r) => r + 1);
  };

  const handle = (id: string) => {
    if (id === target.id) {
      setFeedback("🎉 Você acertou!");
      trackInteraction(id, "discover", 3, 1);
      setTimeout(next, 1500);
    } else {
      setFeedback("Quase! Vamos ouvir de novo 💛");
      trackInteraction(id, "discover");
      setTimeout(() => playDino(target), 400);
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-black mb-1 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        🔍 Descobrir o Som
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4">{feedback}</p>
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        <button onClick={() => playDino(target)} className="px-4 py-2 rounded-full bg-purple-500 text-white font-bold shadow">▶️ Ouvir de novo</button>
        <button onClick={next} className="px-4 py-2 rounded-full bg-amber-400 text-amber-900 font-bold shadow">🔄 Próximo</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center" key={round}>
        {options.map((d) => (
          <DinoCard key={d.id} dino={d} onTap={() => handle(d.id)} />
        ))}
      </div>
    </div>
  );
}
