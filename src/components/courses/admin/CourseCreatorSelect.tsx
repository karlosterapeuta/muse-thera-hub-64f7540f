import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCourseCreators } from "@/hooks/useCourseCreators";
import { User, Loader2 } from "lucide-react";

interface CourseCreatorSelectProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

export function CourseCreatorSelect({ value, onChange }: CourseCreatorSelectProps) {
  const { data: creators, isLoading } = useCourseCreators();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 h-10 px-3 border rounded-md text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Carregando...</span>
      </div>
    );
  }

  return (
    <Select
      value={value || "none"}
      onValueChange={(val) => onChange(val === "none" ? undefined : val)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione um criador" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <span className="text-muted-foreground">Nenhum (curso da plataforma)</span>
        </SelectItem>
        {creators?.map((creator) => (
          <SelectItem key={creator.id} value={creator.id}>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{creator.name}</span>
              <span className="text-xs text-muted-foreground">
                ({creator.commission_percentage}%)
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
