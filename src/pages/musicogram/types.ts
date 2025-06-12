
export interface InstrumentType {
  id: string;
  name: string;
  shape: string;
  color: string;
  iconType?: 'svg' | 'symbol' | 'image' | 'instrument';
  iconContent?: string;
  size?: number;
}

export interface MusicElement {
  id: string;
  name: string;
  category: string;
  defaultColor: string;
  defaultShape: string;
  defaultSize: number;
}

export interface VisualElement {
  id: string;
  type: string;
  x: number;
  y: number;
  color: string;
  size: number;
  shape: string;
  position?: { x: number; y: number };
  rotation?: number;
  label?: string;
  iconType?: 'svg' | 'symbol' | 'image' | 'instrument';
  iconContent?: string;
}

export interface MusicogramTemplate {
  id: string;
  name: string;
  rows: number;
  columns: number;
  backgroundImage?: string;
  description?: string;
  background?: string;
  elements?: VisualElement[];
}

export interface StudyTemplate {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  objective: string;
  description: string;
  ageGroup: string;
  duration: string;
  materials?: string[];
  instructions?: string[];
  rows: number;
  columns: number;
  gridLayout?: {
    rows: number;
    cols: number;
    cellSize: number;
  };
  backgroundColor?: string;
  previewContent?: string;
  imageUrl?: string;
  elements: VisualElement[];
}

export interface PatientMusicogram {
  id: string;
  patientId: string;
  templateId: string;
  elements: VisualElement[];
  createdAt: string;
  updatedAt: string;
}

export interface GuitarChordGrid {
  rows: number;
  columns: number;
  backgroundColor: string;
  labels?: { [key: string]: string };
}
