import { cn } from "@/lib/utils";

interface MuseteraLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function MuseteraLogo({ 
  size = 120, 
  showText = true,
  className 
}: MuseteraLogoProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200"
        className="drop-shadow-xl"
      >
        <defs>
          <radialGradient id="bgGradient">
            <stop offset="0%" stopColor="#1e90ff" />
            <stop offset="100%" stopColor="#0066cc" />
          </radialGradient>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Círculo de fundo azul */}
        <circle 
          cx="100" 
          cy="100" 
          r="95" 
          fill="url(#bgGradient)"
          className="drop-shadow-2xl"
        />
        
        {/* Cérebro estilizado (lado esquerdo) */}
        <g transform="translate(35, 65)" filter="url(#glow)">
          {/* Hemisfério esquerdo */}
          <path
            d="M 15 35 Q 5 25, 8 15 Q 12 5, 22 8 Q 32 5, 38 15 Q 42 25, 32 35 Q 28 40, 22 38 Q 16 40, 15 35 Z"
            fill="url(#goldGradient)"
            stroke="#FF8C00"
            strokeWidth="2"
          />
          {/* Hemisfério direito */}
          <path
            d="M 38 35 Q 48 25, 52 15 Q 58 5, 68 8 Q 78 5, 82 15 Q 85 25, 75 35 Q 71 40, 65 38 Q 59 40, 38 35 Z"
            fill="url(#goldGradient)"
            stroke="#FF8C00"
            strokeWidth="2"
          />
          {/* Detalhes do cérebro - sulcos */}
          <path
            d="M 22 18 Q 27 15, 32 18"
            stroke="#FF8C00"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 20 25 Q 25 22, 30 25"
            stroke="#FF8C00"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 65 18 Q 70 15, 75 18"
            stroke="#FF8C00"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 62 25 Q 67 22, 72 25"
            stroke="#FF8C00"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        
        {/* Nota musical (lado direito) */}
        <g transform="translate(125, 70)" filter="url(#glow)">
          {/* Cabeça da nota (elipse inclinada) */}
          <ellipse
            cx="12"
            cy="40"
            rx="10"
            ry="7"
            fill="url(#goldGradient)"
            stroke="#FF8C00"
            strokeWidth="2"
            transform="rotate(-20 12 40)"
          />
          {/* Haste da nota */}
          <line
            x1="20"
            y1="38"
            x2="20"
            y2="8"
            stroke="url(#goldGradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Bandeira da nota */}
          <path
            d="M 20 8 Q 32 8, 35 15 Q 36 22, 20 20"
            fill="url(#goldGradient)"
            stroke="#FF8C00"
            strokeWidth="1"
          />
          {/* Segunda bandeira */}
          <path
            d="M 20 14 Q 30 14, 32 20 Q 33 26, 20 25"
            fill="url(#goldGradient)"
            stroke="#FF8C00"
            strokeWidth="1"
          />
        </g>
      </svg>
      
      {showText && (
        <div className="text-center">
          <h1 
            className="font-bold tracking-wide"
            style={{
              fontSize: size * 0.25,
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(255,165,0,0.3)'
            }}
          >
            MuseTera
          </h1>
        </div>
      )}
    </div>
  );
}
