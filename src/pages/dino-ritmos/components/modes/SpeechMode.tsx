import { useState } from "react";
import { dinos, SYLLABLES } from "../../data/dinos";
import { DinoCard } from "../DinoCard";
import { playDino, speak } from "../../audio/dinoSounds";
import { trackInteraction, useDinoSettings } from "../../context/DinoSettings";

export function SpeechMode() {
  const { settings } = useDinoSettings();
  const [syllable, setSyllable] = useState<(typeof SYLLABLES)[number]>("PA");
  const speakers = dinos.slice(0, 4);

  const sayWith = (i: number) => {
    const d = speakers[i];
    playDino(d, { duration: "8n" });
    if (settings.narration) speak(syllable + " " + syllable, { rate: 0.8, pitch: 1.3 });
    trackInteraction(d.id, "speech", 1);
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-black mb-1 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        🗣️ Comunicação e Fala
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-3">Escolha uma sílaba e toque num dino para ouvir!</p>

      <div className="flex justify-center gap-2 mb-5 flex-wrap">
        {SYLLABLES.map((s) => (
          <button
            key={s}
            onClick={() => setSyllable(s)}
            className={`px-5 py-3 rounded-2xl font-black text-xl border-4 shadow ${syllable === s ? "bg-pink-500 border-pink-300 text-white scale-110" : "bg-white border-pink-200 text-pink-600"} transition-all`}
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
        {speakers.map((d, i) => (
          <DinoCard key={d.id} dino={d} label={syllable} onTap={() => sayWith(i)} />
        ))}
      </div>

      {!settings.narration && (
        <p className="text-xs text-amber-600 mt-4">Narração desativada — ative em ⚙️ Configurações.</p>
      )}
    </div>
  );
}
