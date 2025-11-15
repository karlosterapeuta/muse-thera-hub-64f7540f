import { useState, useEffect } from "react";
import { Sparkles, Music2, Users, TrendingUp, Award } from "lucide-react";

const benefits = [
  {
    icon: Music2,
    title: "10.000+ Músicas",
    description: "Biblioteca completa de músicas terapêuticas",
  },
  {
    icon: Users,
    title: "500+ Terapeutas",
    description: "Profissionais confiam no MuseTera",
  },
  {
    icon: TrendingUp,
    title: "95% Satisfação",
    description: "Resultados comprovados cientificamente",
  },
  {
    icon: Award,
    title: "Certificado",
    description: "Protocolos validados internacionalmente",
  },
];

export function VideoBackground() {
  const [currentBenefit, setCurrentBenefit] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % benefits.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070"
      >
        <source
          src="https://videos.pexels.com/video-files/7534310/7534310-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-primary/40" />

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 animate-gradient" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-12">
        {/* Top Section - Logo and Tagline */}
        <div className="space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-md border border-white/10">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-white">Plataforma #1 de Musicoterapia</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            Transforme vidas
            <br />
            através da música
          </h2>
          
          <p className="text-lg lg:text-xl text-white/80 max-w-md">
            A plataforma mais completa para musicoterapeutas gerenciarem seus pacientes e sessões.
          </p>
        </div>

        {/* Bottom Section - Rotating Benefits */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const isActive = index === currentBenefit;
              
              return (
                <div
                  key={index}
                  className={`
                    p-4 rounded-2xl backdrop-blur-md border transition-all duration-500
                    ${isActive 
                      ? 'bg-white/20 border-white/30 scale-105 shadow-2xl' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }
                  `}
                  style={{
                    animation: isActive ? 'pulse-glow 2s ease-in-out infinite' : 'none',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      p-2 rounded-xl transition-all duration-500
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/50' 
                        : 'bg-white/10 text-white'
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{benefit.title}</h3>
                      <p className="text-sm text-white/70 mt-1">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2 justify-center">
            {benefits.map((_, index) => (
              <div
                key={index}
                className={`
                  h-1 rounded-full transition-all duration-500
                  ${index === currentBenefit ? 'w-12 bg-primary' : 'w-6 bg-white/30'}
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-slow ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
