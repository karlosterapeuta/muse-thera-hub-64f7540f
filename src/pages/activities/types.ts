
import { LucideIcon } from "lucide-react";

export interface Activity {
  title: string;
  description: string;
  target: string[];
  materials: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ActivityCategory {
  [key: string]: Activity[];
}
