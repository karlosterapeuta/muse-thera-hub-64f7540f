interface Props {
  question: string | null; // animal name to guess (hidden)
  score: number;
  rounds: number;
  feedback: "correct" | "wrong" | null;
  lastAnswerName?: string | null;
  onNewRound: () => void;
  onReplay: () => void;
}

export function QuizPanel({
  question,
  score,
  rounds,
  feedback,
  lastAnswerName,
  onNewRound,
  onReplay,
}: Props) {
  return (
    <div
      className="bg-white/95 rounded-3xl border-4 border-blue-400 shadow-xl p-4 mb-4 text-center"
      style={{ fontFamily: "'Fredoka', 'Comic Sans MS', sans-serif" }}
    >
      <div className="flex items-center justify-center gap-4 mb-3">
        <span className="text-sm font-black text-blue-700 uppercase tracking-wide">
          🎯 Adivinhe o Som
        </span>
        <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-black">
          ⭐ {score} / {rounds}
        </span>
      </div>

      {!question ? (
        <button
          onClick={onNewRound}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full px-6 py-2.5 text-base font-black shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          🎵 Começar Jogo!
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-700">
            Ouça o som e clique no bichinho certo!
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={onReplay}
              className="bg-amber-400 text-amber-900 rounded-full px-4 py-2 text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              🔁 Ouvir de novo
            </button>
          </div>
          {feedback && (
            <p
              className={`text-base font-black ${
                feedback === "correct" ? "text-green-600" : "text-red-500"
              }`}
            >
              {feedback === "correct"
                ? "🎉 Acertou! Muito bem!"
                : `🙈 Era o ${lastAnswerName}! Tente o próximo.`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
