
import { MusicElement, MusicogramTemplate, PatientMusicogram } from "../types";

export const defaultTemplates: MusicogramTemplate[] = [
  {
    id: "standard",
    name: "Padrão",
    rows: 12,
    columns: 16,
    description: "Template padrão de musicograma com 12 linhas e 16 colunas",
    elements: []
  },
  {
    id: "small",
    name: "Compacto",
    rows: 8,
    columns: 8,
    description: "Template compacto para musicogramas curtos",
    elements: []
  },
  {
    id: "large",
    name: "Amplo",
    rows: 16,
    columns: 24,
    description: "Template amplo com mais células para musicogramas detalhados",
    elements: []
  }
];

export const sampleElements: MusicElement[] = [
  { id: "quarter-note", name: "Semínima", category: "note", defaultColor: "#000000", defaultShape: "circle", defaultSize: 20 },
  { id: "half-note", name: "Mínima", category: "note", defaultColor: "#000000", defaultShape: "circle", defaultSize: 20 }
];

export const samplePatientMusicograms: PatientMusicogram[] = [
  {
    id: "1",
    patientId: "pat1",
    templateId: "standard",
    elements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
