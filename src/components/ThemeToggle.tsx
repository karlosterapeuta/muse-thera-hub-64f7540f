
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-lg hover:shadow-xl"
      style={{
        backgroundColor: isDark ? 'rgb(30, 58, 138)' : 'rgb(37, 99, 235)',
      }}
      aria-label="Toggle theme"
    >
      {/* Círculo deslizante com ícone */}
      <div
        className={`absolute top-0.5 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out transform ${
          isDark ? 'translate-x-7' : 'translate-x-0.5'
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-blue-900" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
      </div>
    </button>
  );
}
