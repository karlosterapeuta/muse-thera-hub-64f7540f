import { forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface GradientButtonProps extends ButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, isLoading, children, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "relative overflow-hidden group",
          "bg-gradient-to-r from-primary via-primary/95 to-secondary",
          "hover:shadow-lg hover:shadow-primary/50",
          "transition-all duration-300",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
          "before:translate-x-[-200%] hover:before:translate-x-[200%]",
          "before:transition-transform before:duration-700",
          "after:absolute after:inset-0",
          "after:bg-gradient-to-r after:from-primary/90 after:to-secondary/90",
          "after:opacity-0 hover:after:opacity-100",
          "after:transition-opacity after:duration-300",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {children}
        </span>
      </Button>
    );
  }
);

GradientButton.displayName = "GradientButton";
