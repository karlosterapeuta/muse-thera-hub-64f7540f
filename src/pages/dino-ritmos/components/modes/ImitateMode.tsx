import { useEffect, useRef, useState } from "react";
import { dinos } from "../../data/dinos";
import { DinoCard } from "../DinoCard";
import { playDino } from "../../audio/dinoSounds";
import { trackInteraction } from "../../context/DinoSettings";

export function ImitateMode() {
  const [chosen] = useState(() => dinos[Math.floor(Math.random() * dinos.length)]);
  const [pattern, setPattern] = useState<number>(0);
  const [userTaps, setUserTaps] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("Ouça com atenção...");
  const [active, setActive] = useState(false);
  const playingRef = useRef(false);

  const generate = () => {
    const len = 2 + Math.floor(Math.random() * 3); // 2..4
    setPattern(len);
    setUserTaps(0);
    setFeedback("Ouça...");
    playingRef.current = true;
    setActive(true);
    let i = 0;
    const interval = setInterval(() => {
      playDino(chosen);
      i++;
      if (i >= len) {
        clearInterval(interval);
        playingRef.current = false;
        setActive(false);
        setFeedback(`Sua vez! Toque ${len} vez(es).`);
      }
    }, 550);
  };

  useEffect(() => { generate(); /* eslint-disable-next-line */ }, []);

  const handleTap = () => {
    if (playingRef.current) return;
    playDino(chosen);
    const next = userTaps + 1;
    setUserTaps(next);
    if (next === pattern) {
      setFeedback("⭐ Muito bem! Você conseguiu!");
      trackInteraction(chosen.id, "imitate", 2, 1);
      setTimeout(generate, 1500);
    } else if (next > pattern) {
      setFeedback("Vamos tentar de novo 💛");
      trackInteraction(chosen.id, "imitate");
      setTimeout(generate, 1200);
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-black mb-1 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        🥁 Imitar o Ritmo
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4">{feedback}</p>
      <div className="flex justify-center mb-4">
        <DinoCard dino={chosen} size="lg" isActive={active} onTap={handleTap} />
      </div>
      <button onClick={generate} className="px-5 py-2 rounded-full bg-purple-500 text-white font-bold shadow hover:bg-purple-600">
        🔄 Novo ritmo
      </button>
    </div>
  );
}
