import { useEffect, useMemo, useState } from "react";
import { orchestraAnimals, type Section } from "./data/orchestraAnimals";
import { orchestraAudio, preloadAnimalSounds } from "./utils/orchestraAudioEngine";
import { AnimalMusician } from "./components/AnimalMusician";
import { SectionFilter } from "./components/SectionFilter";
import { InstrumentInfoCard } from "./components/InstrumentInfoCard";

export default function OrquestraAnimal() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section | "tutti">("tutti");

  useEffect(() => {
    preloadAnimalSounds(orchestraAnimals);
  }, []);

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
    // Call audio FIRST, synchronously, inside the user gesture
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
        {/* Curtain folds */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 2px, transparent 2px, transparent 40px)",
            height: "56%",
          }}
        />
        {/* Spotlight */}
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

        {/* Filters */}
        <div className="mb-6">
          <SectionFilter
            active={activeSection}
            onChange={setActiveSection}
            onPlayTutti={handlePlayTutti}
          />
        </div>

        {/* Stage — animals grid (semicircle vibe via flex wrap) */}
        <div className="relative bg-amber-100/40 backdrop-blur-sm rounded-[3rem] p-4 sm:p-8 border-4 border-amber-300/60 shadow-2xl">
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

          {/* Musicians grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
            {filtered.map((animal) => (
              <AnimalMusician
                key={animal.id}
                animal={animal}
                isPlaying={playingId === animal.id || playingId === "__tutti__"}
                isSelected={selectedId === animal.id}
                onClick={() => handleAnimalClick(animal.id)}
              />
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="mt-6 max-w-2xl mx-auto">
          <InstrumentInfoCard animal={selectedAnimal} />
        </div>
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
