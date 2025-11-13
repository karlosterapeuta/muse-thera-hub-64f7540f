
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative group">
      {/* Glow effect no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="relative rounded-full w-10 h-10 sm:w-11 sm:h-11 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-950/50 dark:hover:to-blue-950/50 transition-all duration-300 hover:scale-110 hover:shadow-lg group"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-amber-500 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <Moon className="h-5 w-5 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </Button>
    </div>
  );
}
