
import { MusicElement, MusicogramTemplate, PatientMusicogram } from "../types";

// Music Elements Library
export const musicElements: MusicElement[] = [
  // Notes
  { id: "note-1", name: "Dó (C)", category: "note", description: "Nota musical Dó", defaultColor: "#FF5252", defaultShape: "circle", defaultSize: 40 },
  { id: "note-2", name: "Ré (D)", category: "note", description: "Nota musical Ré", defaultColor: "#FF7B52", defaultShape: "circle", defaultSize: 40 },
  { id: "note-3", name: "Mi (E)", category: "note", description: "Nota musical Mi", defaultColor: "#FFD152", defaultShape: "circle", defaultSize: 40 },
  { id: "note-4", name: "Fá (F)", category: "note", description: "Nota musical Fá", defaultColor: "#A8FF52", defaultShape: "circle", defaultSize: 40 },
  { id: "note-5", name: "Sol (G)", category: "note", description: "Nota musical Sol", defaultColor: "#52FF9B", defaultShape: "circle", defaultSize: 40 },
  { id: "note-6", name: "Lá (A)", category: "note", description: "Nota musical Lá", defaultColor: "#52DDFF", defaultShape: "circle", defaultSize: 40 },
  { id: "note-7", name: "Si (B)", category: "note", description: "Nota musical Si", defaultColor: "#527BFF", defaultShape: "circle", defaultSize: 40 },
  
  // Rhythms
  { id: "rhythm-1", name: "Semínima", category: "rhythm", description: "Um tempo", defaultColor: "#7E69AB", defaultShape: "rect", defaultSize: 50 },
  { id: "rhythm-2", name: "Mínima", category: "rhythm", description: "Dois tempos", defaultColor: "#7E69AB", defaultShape: "rect", defaultSize: 60 },
  { id: "rhythm-3", name: "Semibreve", category: "rhythm", description: "Quatro tempos", defaultColor: "#7E69AB", defaultShape: "rect", defaultSize: 70 },
  { id: "rhythm-4", name: "Colcheia", category: "rhythm", description: "Meio tempo", defaultColor: "#7E69AB", defaultShape: "rect", defaultSize: 40 },
  { id: "rhythm-5", name: "Semicolcheia", category: "rhythm", description: "Um quarto de tempo", defaultColor: "#7E69AB", defaultShape: "rect", defaultSize: 30 },
  
  // Instruments
  { id: "instrument-1", name: "Tambor", category: "instrument", description: "Instrumento de percussão", defaultColor: "#8B5CF6", defaultShape: "triangle", defaultSize: 55 },
  { id: "instrument-2", name: "Violão", category: "instrument", description: "Instrumento de cordas", defaultColor: "#D946EF", defaultShape: "star", defaultSize: 55 },
  { id: "instrument-3", name: "Piano", category: "instrument", description: "Instrumento de teclas", defaultColor: "#F97316", defaultShape: "hexagon", defaultSize: 55 },
  { id: "instrument-4", name: "Flauta", category: "instrument", description: "Instrumento de sopro", defaultColor: "#0EA5E9", defaultShape: "pentagon", defaultSize: 55 },
  { id: "instrument-5", name: "Xilofone", category: "instrument", description: "Instrumento de percussão melódico", defaultColor: "#10B981", defaultShape: "diamond", defaultSize: 55 },
  
  // Dynamics
  { id: "dynamics-1", name: "Forte (f)", category: "dynamics", description: "Tocar com intensidade forte", defaultColor: "#F43F5E", defaultShape: "arrow-up", defaultSize: 45 },
  { id: "dynamics-2", name: "Piano (p)", category: "dynamics", description: "Tocar suavemente", defaultColor: "#60A5FA", defaultShape: "arrow-down", defaultSize: 45 },
  { id: "dynamics-3", name: "Crescendo", category: "dynamics", description: "Aumentar gradualmente o volume", defaultColor: "#14B8A6", defaultShape: "wedge-right", defaultSize: 60 },
  { id: "dynamics-4", name: "Diminuendo", category: "dynamics", description: "Diminuir gradualmente o volume", defaultColor: "#F59E0B", defaultShape: "wedge-left", defaultSize: 60 },
  
  // Silences
  { id: "silence-1", name: "Pausa", category: "silence", description: "Momento de silêncio", defaultColor: "#6B7280", defaultShape: "square", defaultSize: 40 },
  { id: "silence-2", name: "Pausa longa", category: "silence", description: "Silêncio prolongado", defaultColor: "#4B5563", defaultShape: "rect", defaultSize: 60 },
  
  // Structures
  { id: "structure-1", name: "Início", category: "structure", description: "Início da música", defaultColor: "#059669", defaultShape: "flag", defaultSize: 50 },
  { id: "structure-2", name: "Fim", category: "structure", description: "Final da música", defaultColor: "#DC2626", defaultShape: "flag", defaultSize: 50 },
  { id: "structure-3", name: "Repetição", category: "structure", description: "Seção que se repete", defaultColor: "#7C3AED", defaultShape: "repeat", defaultSize: 50 },
  { id: "structure-4", name: "Seção A", category: "structure", description: "Primeira parte da música", defaultColor: "#2563EB", defaultShape: "section", defaultSize: 70 },
  { id: "structure-5", name: "Seção B", category: "structure", description: "Segunda parte da música", defaultColor: "#9333EA", defaultShape: "section", defaultSize: 70 },
];

// Predefined Templates
export const musicogramTemplates: MusicogramTemplate[] = [
  {
    id: "template-1",
    name: "Escala Musical",
    description: "Template para visualizar escalas musicais básicas",
    elements: [
      {
        id: "t1-el-1",
        type: "note",
        color: "#FF5252",
        shape: "circle",
        size: 40,
        position: { x: 100, y: 100 },
        rotation: 0,
        label: "Dó"
      },
      {
        id: "t1-el-2",
        type: "note",
        color: "#FF7B52",
        shape: "circle",
        size: 40,
        position: { x: 180, y: 100 },
        rotation: 0,
        label: "Ré"
      },
      {
        id: "t1-el-3",
        type: "note",
        color: "#FFD152",
        shape: "circle",
        size: 40,
        position: { x: 260, y: 100 },
        rotation: 0,
        label: "Mi"
      },
      {
        id: "t1-el-4",
        type: "note",
        color: "#A8FF52",
        shape: "circle",
        size: 40,
        position: { x: 340, y: 100 },
        rotation: 0,
        label: "Fá"
      },
      {
        id: "t1-el-5",
        type: "note",
        color: "#52FF9B",
        shape: "circle",
        size: 40,
        position: { x: 420, y: 100 },
        rotation: 0,
        label: "Sol"
      },
      {
        id: "t1-el-6",
        type: "note",
        color: "#52DDFF",
        shape: "circle",
        size: 40,
        position: { x: 500, y: 100 },
        rotation: 0,
        label: "Lá"
      },
      {
        id: "t1-el-7",
        type: "note",
        color: "#527BFF",
        shape: "circle",
        size: 40,
        position: { x: 580, y: 100 },
        rotation: 0,
        label: "Si"
      }
    ],
    background: "#FFFFFF"
  },
  {
    id: "template-2",
    name: "Ritmos Básicos",
    description: "Padrões rítmicos para iniciantes",
    elements: [
      {
        id: "t2-el-1",
        type: "rhythm",
        color: "#7E69AB",
        shape: "rect",
        size: 50,
        position: { x: 100, y: 100 },
        rotation: 0,
        label: "Semínima"
      },
      {
        id: "t2-el-2",
        type: "rhythm",
        color: "#7E69AB",
        shape: "rect",
        size: 60,
        position: { x: 200, y: 100 },
        rotation: 0,
        label: "Mínima"
      },
      {
        id: "t2-el-3",
        type: "rhythm",
        color: "#7E69AB",
        shape: "rect",
        size: 70,
        position: { x: 320, y: 100 },
        rotation: 0,
        label: "Semibreve"
      },
      {
        id: "t2-el-4",
        type: "rhythm",
        color: "#7E69AB",
        shape: "rect",
        size: 40,
        position: { x: 450, y: 100 },
        rotation: 0,
        label: "Colcheia"
      }
    ],
    background: "#F8F9FA"
  },
  {
    id: "template-3",
    name: "Instrumentos Musicais",
    description: "Diferentes tipos de instrumentos musicais",
    elements: [
      {
        id: "t3-el-1",
        type: "instrument",
        color: "#8B5CF6",
        shape: "triangle",
        size: 55,
        position: { x: 100, y: 100 },
        rotation: 0,
        label: "Tambor"
      },
      {
        id: "t3-el-2",
        type: "instrument",
        color: "#D946EF",
        shape: "star",
        size: 55,
        position: { x: 220, y: 100 },
        rotation: 0,
        label: "Violão"
      },
      {
        id: "t3-el-3",
        type: "instrument",
        color: "#F97316",
        shape: "hexagon",
        size: 55,
        position: { x: 340, y: 100 },
        rotation: 0,
        label: "Piano"
      },
      {
        id: "t3-el-4",
        type: "instrument",
        color: "#0EA5E9",
        shape: "pentagon",
        size: 55,
        position: { x: 460, y: 100 },
        rotation: 0,
        label: "Flauta"
      }
    ],
    background: "#F0F4F8"
  }
];

// Sample saved musicograms
export const sampleMusicograms: PatientMusicogram[] = [
  {
    id: "musicogram-1",
    patientId: "patient-123",
    patientName: "João Silva",
    date: "2025-05-17",
    musicogramData: [
      {
        id: "m1-el-1",
        type: "note",
        color: "#FF5252",
        shape: "circle",
        size: 40,
        position: { x: 100, y: 100 },
        rotation: 0,
        label: "Dó"
      },
      {
        id: "m1-el-2",
        type: "note",
        color: "#FF7B52",
        shape: "circle",
        size: 40,
        position: { x: 180, y: 100 },
        rotation: 0,
        label: "Ré"
      },
      {
        id: "m1-el-3",
        type: "rhythm",
        color: "#7E69AB",
        shape: "rect",
        size: 50,
        position: { x: 260, y: 200 },
        rotation: 0,
        label: "Semínima"
      }
    ],
    notes: "Primeira sessão de musicograma com o paciente. Demonstrou compreensão básica dos elementos."
  }
];
