import { useState } from "react";
import { dinos, SYLLABLES } from "../../data/dinos";
import { DinoCard } from "../DinoCard";
import { playDino, speak, vibrate } from "../../audio/dinoSounds";
import { trackInteraction, useDinoSettings } from "../../context/DinoSettings";

const WORDS = ["MAMÃE", "PAPAI", "BOLA", "ÁGUA", "OLÁ", "MAIS", "ACABOU", "OBRIGADO"];

export function SpeechMode() {
  const { settings } = useDinoSettings();
  const [syllable, setSyllable] = useState<string>("PA");
  const [phrase, setPhrase] = useState<string[]>([]);
  const speakers = dinos.slice(0, 4);

  const say = (text: string, dinoId?: string) => {
    if (settings.narration) speak(text, { rate: 0.8, pitch: 1.3 });
    if (settings.vibration) vibrate(20);
    trackInteraction(dinoId, "speech", 1);
  };

  const sayWith = (i: number) => {
    const d = speakers[i];
    playDino(d, { duration: "8n" });
    say(`${syllable} ${syllable}`, d.id);
    setPhrase((p) => (p.length >= 8 ? p : [...p, syllable]));
  };

  const playPhrase = () => {
    if (!phrase.length) return;
    say(phrase.join(" "));
    phrase.forEach((_, i) => {
      window.setTimeout(() => playDino(speakers[i % speakers.length], { duration: "8n" }), i * 420);
    });
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-black mb-1 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        🗣️ Comunicação e Fala
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-3">Escolha uma sílaba, toque num dino e monte sua frase!</p>

      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {SYLLABLES.map((s) => (
          <button
            key={s}
            onClick={() => setSyllable(s)}
            className={`px-5 py-3 rounded-2xl font-black text-xl border-4 shadow transition-all ${
              syllable === s ? "bg-pink-500 border-pink-300 text-white scale-110" : "bg-white border-pink-200 text-pink-600"
            }`}
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Phrase builder */}
      <div className="max-w-xl mx-auto mb-5">
        <div className="min-h-[3.25rem] rounded-2xl bg-white/80 dark:bg-slate-700 border-2 border-dashed border-purple-300 flex items-center justify-center gap-2 flex-wrap p-2 mb-2">
          {phrase.length === 0 ? (
            <span className="text-sm text-slate-400">Sua frase aparece aqui…</span>
          ) : (
            phrase.map((s, i) => (
              <span key={`${s}-${i}`} className="px-3 py-1 rounded-xl bg-purple-500 text-white font-black">{s}</span>
            ))
          )}
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          <button onClick={playPhrase} disabled={!phrase.length} className="px-4 py-2 rounded-full bg-emerald-500 text-white font-bold text-sm shadow disabled:opacity-40">
            🔊 Falar frase
          </button>
          <button onClick={() => setPhrase((p) => p.slice(0, -1))} disabled={!phrase.length} className="px-4 py-2 rounded-full bg-amber-400 text-amber-900 font-bold text-sm shadow disabled:opacity-40">
            ↩️ Apagar última
          </button>
          <button onClick={() => setPhrase([])} disabled={!phrase.length} className="px-4 py-2 rounded-full bg-slate-400 text-white font-bold text-sm shadow disabled:opacity-40">
            🗑️ Limpar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center mb-5">
        {speakers.map((d, i) => (
          <DinoCard key={d.id} dino={d} label={syllable} onTap={() => sayWith(i)} />
        ))}
      </div>

      {/* Functional word cards */}
      <div>
        <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Palavras funcionais</h4>
        <div className="flex justify-center gap-2 flex-wrap">
          {WORDS.map((w) => (
            <button
              key={w}
              onClick={() => { playDino(speakers[0], { duration: "8n" }); say(w); }}
              className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-black text-sm shadow hover:bg-sky-600"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {!settings.narration && (
        <p className="text-xs text-amber-600 mt-4">Narração desativada — ative em ⚙️ Configurações.</p>
      )}
    </div>
  );
}
