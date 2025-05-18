
export interface InstrumentType {
  id: string;
  name: string;
  shape: string;
  color: string;
  iconType?: 'svg' | 'symbol' | 'image' | 'instrument';
  iconContent?: string;
  size?: number;  // Adicionada propriedade de tamanho opcional
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

export interface PatientMusicogram {
  id: string;
  patientId: string;
  templateId: string;
  elements: VisualElement[];
  createdAt: string;
  updatedAt: string;
}
