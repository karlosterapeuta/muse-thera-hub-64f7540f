
import { cn } from "@/lib/utils";

interface LogoRoundProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LogoRound = ({ className, size = "md" }: LogoRoundProps) => {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  return (
    <div className={cn(
      "rounded-full overflow-hidden p-2 bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/20",
      sizes[size],
      className
    )}>
      <div className="w-full h-full rounded-full overflow-hidden">
        <img
          src="/lovable-uploads/934e42dc-e002-4eaa-add0-0fd741e314c8.png"
          alt="Musetera Logo"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LogoRound;
