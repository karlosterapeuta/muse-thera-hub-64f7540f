import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dinos } from "../../data/dinos";
import { playDino, speak, playSuccess, vibrate } from "../../audio/dinoSounds";
import { trackInteraction, useDinoSettings } from "../../context/DinoSettings";

const STORY = [
  { dinoId: "braquio", text: "Era uma vez um dino muito gentil chamado Braquio.", emotion: "😊 Feliz" },
  { dinoId: "ptero", text: "Ele voou junto com seu amigo Ptero pelas nuvens.", emotion: "🥰 Animado" },
  { dinoId: "espino", text: "Encontraram um rio cheio de sons mágicos.", emotion: "😮 Curioso" },
  { dinoId: "trex", text: "T-Rex apareceu fazendo um som forte de bateria!", emotion: "😲 Surpreso" },
  { dinoId: "triceratops", text: "Mas Triceratops mostrou que ele era amigo.", emotion: "🤗 Acolhedor" },
  { dinoId: "velociraptor", text: "Velociraptor tocou o xilofone e todos dançaram.", emotion: "🥳 Alegre" },
  { dinoId: "stego", text: "Estegossauro acompanhou na guitarra infantil.", emotion: "😄 Divertido" },
  { dinoId: "anquilo", text: "E Anquilo fechou a história com um som grave e calmo.", emotion: "😌 Tranquilo" },
];

export function StoryMode() {
  const { settings } = useDinoSettings();
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const timer = useRef<number | null>(null);

  const node = STORY[step];
  const dino = dinos.find((d) => d.id === node.dinoId)!;

  const narrate = (index: number) => {
    const n = STORY[index];
    const d = dinos.find((x) => x.id === n.dinoId)!;
    playDino(d);
    if (settings.narration) speak(n.text);
    if (settings.vibration) vibrate(15);
    trackInteraction(d.id, "story", 1);
  };

  const goTo = (index: number) => {
    if (index < 0) return;
    if (index >= STORY.length) {
      setFinished(true);
      setAutoPlay(false);
      playSuccess();
      trackInteraction(undefined, "story", 3, 1);
      return;
    }
    setStep(index);
    narrate(index);
  };

  // Auto-play with a calm pace
  useEffect(() => {
    if (!autoPlay || finished) return;
    const delay = settings.calmMode ? 7000 : 5000;
    timer.current = window.setTimeout(() => goTo(step + 1), delay);
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, step, finished, settings.calmMode]);

  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  const restart = () => {
    setFinished(false);
    setStep(0);
    narrate(0);
  };

  if (finished) {
    return (
      <div className="text-center py-6">
        <div className="text-6xl mb-3">🌟</div>
        <h3 className="text-2xl font-black text-purple-700 dark:text-purple-200 mb-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Fim da história!
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-5">Você ganhou 3 estrelas e 1 ovo 🥚</p>
        <button onClick={restart} className="px-6 py-3 rounded-full bg-purple-500 text-white font-black shadow-lg hover:bg-purple-600">
          🔄 Contar de novo
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3 className="text-2xl font-black mb-1 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        📖 História Musical
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4">Avance página a página ou deixe a história tocar sozinha</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          className={`mx-auto max-w-md rounded-3xl p-6 bg-gradient-to-br ${dino.bg} border-4 border-white/70 shadow-xl ${dino.shadow}`}
        >
          <div className="text-7xl mb-2">{dino.emoji}</div>
          <div className={`font-bold ${dino.textColor} text-lg`} style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {node.text}
          </div>
          <div className={`mt-3 inline-block px-3 py-1 rounded-full bg-white/40 ${dino.textColor} text-sm font-semibold`}>
            {node.emotion}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => goTo(step - 1)}
          disabled={step === 0}
          className="px-4 py-3 rounded-full bg-white/80 dark:bg-slate-700 text-purple-700 dark:text-purple-200 font-bold shadow disabled:opacity-40"
        >
          ⬅️ Voltar
        </button>
        <button onClick={() => narrate(step)} className="px-4 py-3 rounded-full bg-amber-400 text-amber-900 font-bold shadow">
          🔊 Ouvir
        </button>
        <button onClick={() => goTo(step + 1)} className="px-6 py-3 rounded-full bg-purple-500 text-white font-black shadow-lg hover:bg-purple-600">
          ▶️ Continuar
        </button>
        <button
          onClick={() => setAutoPlay((a) => !a)}
          className={`px-4 py-3 rounded-full font-bold shadow ${autoPlay ? "bg-rose-500 text-white" : "bg-white/80 dark:bg-slate-700 text-rose-500"}`}
        >
          {autoPlay ? "⏸️ Parar auto" : "🎬 Auto"}
        </button>
      </div>

      {/* Page progress */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {STORY.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir para página ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${i === step ? "w-7 bg-purple-500" : "w-2.5 bg-slate-300 dark:bg-slate-600"}`}
          />
        ))}
      </div>
      <div className="mt-2 text-xs text-slate-500">Página {step + 1} de {STORY.length}</div>
    </div>
  );
}
