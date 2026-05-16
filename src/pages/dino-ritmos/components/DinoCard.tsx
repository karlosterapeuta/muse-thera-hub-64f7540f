import { motion } from "framer-motion";
import { Dino } from "../data/dinos";
import { useDinoSettings } from "../context/DinoSettings";

interface Props {
  dino: Dino;
  onTap?: () => void;
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = {
  sm: { card: "w-24 h-28 text-5xl", title: "text-xs" },
  md: { card: "w-32 h-36 text-6xl", title: "text-sm" },
  lg: { card: "w-40 h-44 text-7xl", title: "text-base" },
};

export function DinoCard({ dino, onTap, isActive, size = "md", label }: Props) {
  const { settings } = useDinoSettings();
  const speed = settings.animationSpeed;
  const breathDur = 4 / speed;
  const blinkDur = 5 / speed;
  const s = sizeMap[size];

  return (
    <motion.button
      type="button"
      onClick={onTap}
      whileTap={settings.reducedSensory ? undefined : { scale: 0.92 }}
      whileHover={settings.reducedSensory ? undefined : { scale: 1.04 }}
      className={`relative ${s.card} rounded-3xl bg-gradient-to-br ${dino.bg} flex flex-col items-center justify-center gap-1 border-4 border-white/70 shadow-xl ${dino.shadow} ${isActive ? `ring-4 ${dino.ring}` : ""} transition-shadow`}
      aria-label={`${dino.name} – ${dino.instrumentLabel}`}
    >
      {/* breathing emoji */}
      <motion.span
        className="leading-none drop-shadow"
        animate={settings.reducedSensory ? undefined : { scale: [1, 1.06, 1] }}
        transition={{ duration: breathDur, repeat: Infinity, ease: "easeInOut" }}
      >
        {dino.emoji}
      </motion.span>

      {/* blink overlay */}
      {!settings.reducedVisuals && (
        <motion.div
          className="absolute inset-0 rounded-3xl bg-white/0"
          animate={{ backgroundColor: ["rgba(255,255,255,0)", "rgba(255,255,255,0.18)", "rgba(255,255,255,0)"] }}
          transition={{ duration: 0.25, repeat: Infinity, repeatDelay: blinkDur, ease: "easeInOut" }}
        />
      )}

      <span className={`font-black uppercase tracking-wider ${s.title} ${dino.textColor} drop-shadow`} style={{ fontFamily: "'Fredoka', 'Comic Sans MS', sans-serif" }}>
        {label ?? dino.name}
      </span>

      {/* active glow ring */}
      {isActive && !settings.reducedVisuals && (
        <motion.div
          className={`absolute -inset-2 rounded-3xl border-4 ${dino.ring} pointer-events-none`}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2 / speed, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
