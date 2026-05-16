import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dinos } from "../../data/dinos";
import { playDino, speak } from "../../audio/dinoSounds";
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
  const node = STORY[step];
  const dino = dinos.find((d) => d.id === node.dinoId)!;

  const advance = () => {
    playDino(dino);
    if (settings.narration) speak(node.text);
    trackInteraction(dino.id, "story", 1);
    setStep((s) => (s + 1) % STORY.length);
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-black mb-1 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        📖 História Musical
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4">Toque para continuar a história</p>

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

      <button onClick={advance} className="mt-5 px-6 py-3 rounded-full bg-purple-500 text-white font-black shadow-lg hover:bg-purple-600">
        ▶️ Continuar
      </button>
      <div className="mt-2 text-xs text-slate-500">Página {step + 1} de {STORY.length}</div>
    </div>
  );
}
