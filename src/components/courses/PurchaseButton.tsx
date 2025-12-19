import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/types/courses";
import { cn } from "@/lib/utils";

interface PurchaseButtonProps {
  priceCents: number;
  onClick: () => void;
  size?: "sm" | "default" | "lg";
  className?: string;
  showIcon?: boolean;
  variant?: "default" | "hero" | "card";
}

export function PurchaseButton({
  priceCents,
  onClick,
  size = "default",
  className,
  showIcon = true,
  variant = "default"
}: PurchaseButtonProps) {
  const baseStyles = cn(
    "relative overflow-hidden font-semibold transition-all duration-300",
    "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600",
    "hover:from-emerald-400 hover:via-green-400 hover:to-emerald-500",
    "text-white border-0 shadow-lg",
    "hover:shadow-emerald-500/30 hover:shadow-xl",
    "before:absolute before:inset-0",
    "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
    "before:translate-x-[-200%] hover:before:translate-x-[200%]",
    "before:transition-transform before:duration-700"
  );

  const variantStyles = {
    default: "",
    hero: "px-8 rounded-full",
    card: "w-full rounded-md"
  };

  return (
    <Button
      size={size}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      <span className="relative z-10 flex items-center gap-2">
        {showIcon && <ShoppingCart className="h-4 w-4" />}
        <span>Comprar por {formatPrice(priceCents)}</span>
      </span>
    </Button>
  );
}
