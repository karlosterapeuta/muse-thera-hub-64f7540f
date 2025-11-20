import { Loader2 } from "lucide-react";

interface GenerationProgressProps {
  message: string;
}

export function GenerationProgress({ message }: GenerationProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="text-center">
        <p className="text-lg font-medium">{message}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Isso pode levar alguns segundos...
        </p>
      </div>
    </div>
  );
}
