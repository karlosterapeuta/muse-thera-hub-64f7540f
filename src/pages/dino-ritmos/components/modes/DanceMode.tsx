import { useEffect, useRef, useState } from "react";
import { dinos } from "../../data/dinos";
import { DinoCard } from "../DinoCard";
import { playDino, startAmbient, stopAmbient } from "../../audio/dinoSounds";

export function DanceMode() {
  const [tick, setTick] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    startAmbient();
    const id = window.setInterval(() => {
      setTick((t) => (t + 1) % dinos.length);
      const d = dinos[Math.floor(Math.random() * dinos.length)];
      playDino(d, { duration: "8n" });
    }, 900);
    ref.current = id;
    return () => {
      if (ref.current) clearInterval(ref.current);
      stopAmbient();
    };
  }, []);

  return (
    <div>
      <h3 className="text-2xl font-black text-center mb-1 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        💃 Dança dos Dinos
      </h3>
      <p className="text-center text-slate-600 dark:text-slate-300 mb-5">Os dinos estão dançando para você!</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
        {dinos.map((d, i) => (
          <DinoCard key={d.id} dino={d} isActive={i === tick} />
        ))}
      </div>
    </div>
  );
}
