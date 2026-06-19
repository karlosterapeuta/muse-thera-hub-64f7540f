import { useEffect, useMemo, useState } from "react";
import { orchestraAnimals, type Section, type AnimalMusician as AnimalType } from "./data/orchestraAnimals";
import {
  orchestraAudio,
  preloadAnimalSounds,
  setMasterVolume,
  getMasterVolume,
} from "./utils/orchestraAudioEngine";
import { AnimalMusician } from "./components/AnimalMusician";
import { SectionFilter } from "./components/SectionFilter";
import { InstrumentInfoCard } from "./components/InstrumentInfoCard";
import { SequencerBar } from "./components/SequencerBar";
import { QuizPanel } from "./components/QuizPanel";

type Mode = "livre" | "compositor" | "quiz";

export default function OrquestraAnimal() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section | "tutti">("tutti");
  const [mode, setMode] = useState<Mode>("livre");
  const [volume, setVolume] = useState<number>(getMasterVolume());

  // Sequencer state
  const [sequence, setSequence] = useState<AnimalType[]>([]);
  const [seqPlaying, setSeqPlaying] = useState(false);

  // Quiz state
  const [quizTarget, setQuizTarget] = useState<AnimalType | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizRounds, setQuizRounds] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    preloadAnimalSounds(orchestraAnimals);
  }, []);

  useEffect(() => {
    setMasterVolume(volume);
  }, [volume]);

  const filtered = useMemo(() => {
    if (activeSection === "tutti") return orchestraAnimals;
    return orchestraAnimals.filter((a) => a.section === activeSection);
  }, [activeSection]);

  const selectedAnimal = useMemo(
    () => orchestraAnimals.find((a) => a.id === selectedId) ?? null,
    [selectedId]
  );

  const handleAnimalClick = (id: string) => {
    const animal = orchestraAnimals.find((a) => a.id === id);
    if (!animal) return;

    if (mode === "compositor") {
      orchestraAudio.play(animal);
      setSequence((prev) => [...prev, animal]);
      setPlayingId(id);
      setTimeout(() => setPlayingId(null), 600);
      return;
    }

    if (mode === "quiz") {
      if (!quizTarget) return;
      orchestraAudio.play(animal);
      setPlayingId(id);
      setTimeout(() => setPlayingId(null), 600);
      const correct = animal.id === quizTarget.id;
      setQuizRounds((r) => r + 1);
      if (correct) setQuizScore((s) => s + 1);
      setQuizFeedback(correct ? "correct" : "wrong");
      const finished = quizTarget;
      setQuizTarget(null);
      setTimeout(() => {
        startQuizRound();
      }, 1600);
      void finished;
      return;
    }

    // Free play
    orchestraAudio.play(animal);
    setSelectedId(id);
    setPlayingId(id);
    setTimeout(() => setPlayingId(null), 1600);
  };

  const handlePlayTutti = () => {
    orchestraAudio.playTutti(orchestraAnimals);
    setPlayingId("__tutti__");
    setTimeout(() => setPlayingId(null), 2200);
  };

  const handleStop = () => {
    orchestraAudio.stopAll();
    setPlayingId(null);
    setSeqPlaying(false);
  };

  // ----- Sequencer handlers -----
  const playSequence = () => {
    if (sequence.length === 0) return;
    setSeqPlaying(true);
    orchestraAudio.playSequence(
      sequence,
      650,
      (a) => {
        setPlayingId(a.id);
        setTimeout(() => setPlayingId(null), 500);
      },
      () => setSeqPlaying(false)
    );
  };

  // ----- Quiz handlers -----
  const startQuizRound = () => {
    setQuizFeedback(null);
    const target = orchestraAnimals[Math.floor(Math.random() * orchestraAnimals.length)];
    setQuizTarget(target);
    setTimeout(() => orchestraAudio.play(target), 250);
  };

  const replayQuiz = () => {
    if (quizTarget) orchestraAudio.play(quizTarget);
  };

  const switchMode = (m: Mode) => {
    handleStop();
    setMode(m);
    setSelectedId(null);
    setQuizFeedback(null);
    setQuizTarget(null);
  };

  const modeButtons: { id: Mode; label: string; emoji: string }[] = [
    { id: "livre", label: "Livre", emoji: "🎵" },
    { id: "compositor", label: "Compositor", emoji: "🎼" },
    { id: "quiz", label: "Adivinhe", emoji: "🎯" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Stage background — red curtains + wooden floor */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #7f1d1d 0%, #991b1b 30%, #b91c1c 55%, #fbbf24 56%, #f59e0b 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 2px, transparent 2px, transparent 40px)",
            height: "56%",
          }}
        />
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[80%] h-[60%] rounded-b-full opacity-30 blur-2xl"
          style={{ background: "radial-gradient(ellipse at top, #fef3c7 0%, transparent 60%)" }}
        />
      </div>

      <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1
            className="text-4xl sm:text-6xl font-black text-yellow-300 drop-shadow-[0_4px_0_rgba(0,0,0,0.4)] mb-2"
            style={{
              fontFamily: "'Fredoka', 'Comic Sans MS', sans-serif",
              WebkitTextStroke: "2px #7c2d12",
            }}
          >
            🎺 Orquestra Animal 🎻
          </h1>
          <p
            className="text-white text-base sm:text-lg font-bold drop-shadow-md"
            style={{ fontFamily: "'Fredoka', 'Comic Sans MS', sans-serif" }}
          >
            Clique nos bichinhos para ouvir os instrumentos!
          </p>
        </div>

        {/* Mode selector */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {modeButtons.map((b) => (
            <button
              key={b.id}
              onClick={() => switchMode(b.id)}
              className={`rounded-full px-4 py-2 text-sm font-black uppercase tracking-wide border-4 shadow-md transition-all hover:scale-105 active:scale-95 ${
                mode === b.id
                  ? "bg-yellow-300 text-amber-900 border-amber-600 scale-105"
                  : "bg-white/90 text-gray-700 border-white"
              }`}
              style={{ fontFamily: "'Fredoka', 'Comic Sans MS', sans-serif" }}
            >
              {b.emoji} {b.label}
            </button>
          ))}
        </div>

        {/* Volume control */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <span className="text-xl">{volume === 0 ? "🔇" : "🔊"}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Controle de volume"
            className="w-40 sm:w-56 accent-yellow-400 cursor-pointer"
          />
        </div>

        {/* Mode-specific panels */}
        {mode === "compositor" && (
          <SequencerBar
            sequence={sequence}
            isPlaying={seqPlaying}
            onPlay={playSequence}
            onClear={() => setSequence([])}
            onRemoveLast={() => setSequence((prev) => prev.slice(0, -1))}
          />
        )}
        {mode === "quiz" && (
          <QuizPanel
            question={quizTarget ? quizTarget.name : null}
            score={quizScore}
            rounds={quizRounds}
            feedback={quizFeedback}
            lastAnswerName={null}
            onNewRound={startQuizRound}
            onReplay={replayQuiz}
          />
        )}

        {/* Filters (hidden in quiz mode to avoid confusion) */}
        {mode !== "quiz" && (
          <div className="mb-6">
            <SectionFilter
              active={activeSection}
              onChange={setActiveSection}
              onPlayTutti={handlePlayTutti}
            />
          </div>
        )}

        {/* Stage — animals grid */}
        <div className="relative bg-amber-100/40 backdrop-blur-sm rounded-[3rem] p-4 sm:p-8 border-4 border-amber-300/60 shadow-2xl">
          {mode === "livre" && (
            <>
              {/* Conductor */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={handlePlayTutti}
                  aria-label="Maestro: tocar toda a orquestra"
                  className="group relative flex flex-col items-center bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-3xl px-5 py-3 border-4 border-yellow-300 shadow-xl hover:scale-110 active:scale-95 transition-all"
                >
                  <div className="text-4xl sm:text-5xl">🐧</div>
                  <span
                    className="text-xs sm:text-sm font-black uppercase tracking-wider mt-1"
                    style={{ fontFamily: "'Fredoka', 'Comic Sans MS', sans-serif" }}
                  >
                    Maestro Pinguim
                  </span>
                  <span className="text-[10px] sm:text-xs opacity-90">Toca tudo junto!</span>
                </button>
              </div>
            </>
          )}

          {/* Stop button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleStop}
              aria-label="Parar todos os sons"
              className="flex items-center gap-2 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full px-5 py-2 border-4 border-yellow-300 shadow-lg hover:scale-105 active:scale-95 transition-all font-black uppercase tracking-wider text-sm"
              style={{ fontFamily: "'Fredoka', 'Comic Sans MS', sans-serif" }}
            >
              <span className="text-xl leading-none">⏹</span>
              Parar Som
            </button>
          </div>

          {/* Musicians grid — quiz uses full roster */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
            {(mode === "quiz" ? orchestraAnimals : filtered).map((animal) => (
              <AnimalMusician
                key={animal.id}
                animal={animal}
                isPlaying={playingId === animal.id || playingId === "__tutti__"}
                isSelected={mode === "livre" && selectedId === animal.id}
                onClick={() => handleAnimalClick(animal.id)}
              />
            ))}
          </div>
        </div>

        {/* Info card (only in free play) */}
        {mode === "livre" && (
          <div className="mt-6 max-w-2xl mx-auto">
            <InstrumentInfoCard animal={selectedAnimal} />
          </div>
        )}
      </div>

      {/* Inline keyframes for floating notes */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-40px) scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
