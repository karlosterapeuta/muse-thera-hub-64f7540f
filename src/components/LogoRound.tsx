import { cn } from "@/lib/utils";
import { MuseteraLogo } from "@/components/MuseteraLogo";

interface LogoRoundProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LogoRound = ({ className, size = "md" }: LogoRoundProps) => {
  const sizeMap = {
    sm: 64,
    md: 96,
    lg: 128
  };

  return (
    <div className={cn(
      "rounded-full overflow-hidden p-2 bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/20 flex items-center justify-center",
      className
    )}>
      <MuseteraLogo size={sizeMap[size]} showText={false} />
    </div>
  );
};

export default LogoRound;
