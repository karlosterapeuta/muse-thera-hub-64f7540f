import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import museteraBotGreeting from "@/assets/musetera-mascot.png";

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton = ({ onClick }: FloatingChatButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 h-24 w-24 rounded-full bg-transparent shadow-none hover:scale-110 transition-all duration-300 animate-scale-in p-0 hover:bg-transparent"
            size="icon"
          >
            <div className="relative h-24 w-24">
              {/* Outer glow halo */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-60 blur-xl animate-pulse" />
              {/* Rotating gradient ring */}
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,hsl(var(--primary)),#a855f7,#ec4899,hsl(var(--primary)))] animate-spin [animation-duration:6s] p-[3px]">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-background via-background/95 to-primary/10" />
              </div>
              {/* Inner solid circle to highlight mascot */}
              <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-white via-purple-50 to-pink-100 dark:from-slate-900 dark:via-purple-950/80 dark:to-slate-900 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]" />
              {/* Mascot */}
              <img
                src={museteraBotGreeting}
                alt="Assistente MuseTera"
                className="absolute inset-0 m-auto h-[86%] w-[86%] object-contain drop-shadow-[0_4px_14px_rgba(168,85,247,0.7)] z-10"
              />
            </div>
            <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-green-500 animate-pulse ring-2 ring-background z-20" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-popover text-popover-foreground">
          <p>MuseBot</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FloatingChatButton;
