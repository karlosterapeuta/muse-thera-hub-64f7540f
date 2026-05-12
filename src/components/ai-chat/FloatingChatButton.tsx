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
            className="fixed bottom-6 right-6 z-50 h-20 w-20 rounded-full bg-transparent shadow-lg hover:scale-110 transition-all duration-300 animate-scale-in p-0 hover:bg-transparent"
            size="icon"
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-primary/80 via-purple-500/80 to-pink-500/80 rounded-full blur-sm" />
              <img 
                src={museteraBotGreeting} 
                alt="Assistente MuseTera"
                className="relative h-20 w-20 object-contain drop-shadow-xl"
              />
            </div>
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-green-500 animate-pulse ring-2 ring-background" />
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
