import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Sparkles, Star, Egg } from "lucide-react";
import { DinoSettingsProvider, useDinoSettings, loadProgress, addTime } from "./context/DinoSettings";
import { ensureAudioReady, startAmbient, stopAmbient } from "./audio/dinoSounds";
import { dinos } from "./data/dinos";
import { SettingsPanel } from "./components/SettingsPanel";
import { TherapistPanel } from "./components/TherapistPanel";
import { FreeMode } from "./components/modes/FreeMode";
import { ImitateMode } from "./components/modes/ImitateMode";
import { DanceMode } from "./components/modes/DanceMode";
import { DiscoverMode } from "./components/modes/DiscoverMode";
import { SpeechMode } from "./components/modes/SpeechMode";
import { StoryMode } from "./components/modes/StoryMode";

type Screen = "home" | "modeSelect" | "mode";
type ModeKey = "free" | "imitate" | "dance" | "discover" | "speech" | "story";

const MODES: { key: ModeKey; emoji: string; label: string; desc: string; color: string }[] = [
  { key: "free", emoji: "🎵", label: "Modo Livre", desc: "Crie sua música", color: "from-pink-400 to-rose-500" },
  { key: "imitate", emoji: "🥁", label: "Imitar Ritmo", desc: "Repita o que ouviu", color: "from-amber-400 to-orange-500" },
  { key: "dance", emoji: "💃", label: "Dança dos Dinos", desc: "Eles dançam pra você", color: "from-violet-400 to-purple-500" },
  { key: "discover", emoji: "🔍", label: "Descobrir o Som", desc: "Qual dino tocou?", color: "from-emerald-400 to-teal-500" },
  { key: "speech", emoji: "🗣️", label: "Comunicação", desc: "Fale com os dinos", color: "from-sky-400 to-blue-500" },
  { key: "story", emoji: "📖", label: "História Musical", desc: "Uma aventura sonora", color: "from-fuchsia-400 to-pink-600" },
];

function DinoRitmosInner() {
  const { settings, update: toggleCalm } = useDinoSettings();
  const [screen, setScreen] = useState<Screen>("home");
  const [mode, setMode] = useState<ModeKey>("free");
  const [showSettings, setShowSettings] = useState(false);
  const [showTherapist, setShowTherapist] = useState(false);
  const [progress, setProgress] = useState(loadProgress());
  const startedAt = useRef<number>(Date.now());

  // Track session time
  useEffect(() => {
    const id = window.setInterval(() => setProgress(loadProgress()), 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      const seconds = Math.floor((Date.now() - startedAt.current) / 1000);
      if (seconds > 0) addTime(seconds);
    };
  }, []);

  // Ambient music on home screen
  useEffect(() => {
    if (screen === "home" && !settings.reducedSensory) {
      ensureAudioReady(settings.volume).then(() => startAmbient());
    } else {
      stopAmbient();
    }
    return () => stopAmbient();
  }, [screen, settings.reducedSensory, settings.volume]);

  const start = async () => {
    await ensureAudioReady(settings.volume);
    setScreen("modeSelect");
  };

  const enterMode = async (m: ModeKey) => {
    await ensureAudioReady(settings.volume);
    setMode(m);
    setScreen("mode");
  };

  const calm = settings.calmMode;
  const bgGradient = calm
    ? "from-slate-900 via-indigo-950 to-slate-900"
    : "from-sky-200 via-purple-200 to-pink-200";
  const cardBg = calm ? "bg-slate-800/80 border-slate-700" : "bg-white/70 border-white";

  return (
    <div className={`min-h-[calc(100vh-4rem)] relative overflow-hidden bg-gradient-to-br ${bgGradient}`}>
      {/* Soft floating particles */}
      {!settings.reducedVisuals && !settings.reducedSensory && (
        <div className="pointer-events-none absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${calm ? "bg-indigo-300/30" : "bg-white/60"}`}
              initial={{ x: `${(i * 37) % 100}%`, y: "110%" }}
              animate={{ y: "-10%" }}
              transition={{ duration: 18 + (i % 5) * 3, repeat: Infinity, delay: i * 1.4, ease: "linear" }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setScreen("home")}
            className={`text-xl font-black ${calm ? "text-purple-200" : "text-purple-700"}`}
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            🦖 Dino Ritmos
          </button>

          <div className="flex items-center gap-2">
            <Badge icon={<Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />} value={progress.stars} />
            <Badge icon={<Egg className="w-4 h-4 text-orange-500" />} value={progress.eggs} />
            <button
              onClick={() => setShowTherapist(true)}
              className="px-3 py-2 rounded-full bg-emerald-500 text-white font-bold text-sm shadow hover:bg-emerald-600"
              title="Área terapêutica"
            >
              👩‍⚕️
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full bg-white/80 dark:bg-slate-700 text-slate-700 dark:text-slate-100 shadow"
              aria-label="Configurações"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {screen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h1
                className={`text-5xl sm:text-7xl font-black mb-3 ${calm ? "text-yellow-200" : "text-purple-700"} drop-shadow`}
                style={{ fontFamily: "'Fredoka', sans-serif", WebkitTextStroke: calm ? "1px #312e81" : "2px #ffffff" }}
              >
                🦖 Dino Ritmos
              </h1>
              <p className={`mb-8 font-semibold ${calm ? "text-indigo-200" : "text-purple-900/80"}`}>
                Música, ritmo e diversão com os dinossauros mais fofos!
              </p>

              {/* Dancing dinos preview */}
              <div className="flex justify-center gap-3 mb-8 flex-wrap">
                {dinos.slice(0, 6).map((d, i) => (
                  <motion.div
                    key={d.id}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${d.bg} flex items-center justify-center text-3xl border-4 border-white/70 shadow-lg`}
                    animate={settings.reducedSensory ? undefined : { y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 3 / settings.animationSpeed, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                  >
                    {d.emoji}
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <HomeButton onClick={start} color="from-purple-500 to-pink-500" label="▶️ Jogar" />
                <HomeButton onClick={() => setShowSettings(true)} color="from-amber-400 to-orange-500" label="⚙️ Configurações" />
                <HomeButton
                  onClick={() => toggleCalm("calmMode", !settings.calmMode)}
                  color="from-indigo-500 to-blue-600"
                  label={settings.calmMode ? "☀️ Modo Normal" : "🌙 Modo Calmo"}
                />
              </div>

              <p className={`mt-8 text-xs ${calm ? "text-indigo-300" : "text-purple-900/60"} flex items-center justify-center gap-1`}>
                <Sparkles className="w-3 h-3" /> Feito com carinho para todas as crianças
              </p>
            </motion.div>
          )}

          {screen === "modeSelect" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className={`text-3xl font-black text-center mb-6 ${calm ? "text-yellow-200" : "text-purple-700"}`} style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Escolha um modo de jogo
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {MODES.map((m) => (
                  <motion.button
                    key={m.key}
                    onClick={() => enterMode(m.key)}
                    whileHover={settings.reducedSensory ? undefined : { scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`p-5 rounded-3xl bg-gradient-to-br ${m.color} text-white text-left shadow-xl border-4 border-white/60`}
                  >
                    <div className="text-4xl mb-2">{m.emoji}</div>
                    <div className="text-xl font-black" style={{ fontFamily: "'Fredoka', sans-serif" }}>{m.label}</div>
                    <div className="text-sm opacity-90">{m.desc}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {screen === "mode" && (
            <motion.div
              key={`mode-${mode}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className={`rounded-3xl p-5 sm:p-6 backdrop-blur-sm border-4 shadow-xl ${cardBg}`}
            >
              <div className="flex justify-between items-center mb-3">
                <button onClick={() => setScreen("modeSelect")} className="px-3 py-1 rounded-full bg-purple-500 text-white text-sm font-bold shadow">
                  ← Modos
                </button>
              </div>
              {mode === "free" && <FreeMode />}
              {mode === "imitate" && <ImitateMode />}
              {mode === "dance" && <DanceMode />}
              {mode === "discover" && <DiscoverMode />}
              {mode === "speech" && <SpeechMode />}
              {mode === "story" && <StoryMode />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showTherapist && <TherapistPanel onClose={() => setShowTherapist(false)} />}
    </div>
  );
}

function HomeButton({ onClick, color, label }: { onClick: () => void; color: string; label: string }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      className={`px-6 py-4 rounded-2xl font-black text-white text-lg bg-gradient-to-r ${color} shadow-lg border-4 border-white/60`}
      style={{ fontFamily: "'Fredoka', sans-serif" }}
    >
      {label}
    </motion.button>
  );
}

function Badge({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-700 text-sm font-bold shadow">
      {icon}
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export default function DinoRitmos() {
  return (
    <DinoSettingsProvider>
      <DinoRitmosInner />
    </DinoSettingsProvider>
  );
}
