
export type VisualElement = {
  id: string;
  type: 'note' | 'rhythm' | 'instrument' | 'dynamics' | 'silence' | 'structure';
  color: string;
  shape: string;
  size: number;
  position: { x: number; y: number };
  rotation: number;
  label?: string;
};

export type MusicogramTemplate = {
  id: string;
  name: string;
  description: string;
  elements: VisualElement[];
  background: string;
};

export type PatientMusicogram = {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  musicogramData: VisualElement[];
  notes: string;
  templateId?: string;
};

export type MusicElement = {
  id: string;
  name: string;
  category: 'note' | 'rhythm' | 'instrument' | 'dynamics' | 'silence' | 'structure';
  description: string;
  defaultColor: string;
  defaultShape: string;
  defaultSize: number;
};
