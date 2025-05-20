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
    id: "visual-rhythm",
    name: "Ritmo Visual",
    rows: 5,
    columns: 10,
    background: "#F2FCE2", // Soft green background
    description: "Template colorido baseado em formas e cores para visualizar o ritmo musical",
    elements: [
      // Row 1 - Pattern of circles with alternating colors
      { id: "1", type: "element", x: 40, y: 40, color: "#9b87f5", size: 60, shape: "circle", position: { x: 40, y: 40 }, rotation: 0 },
      { id: "2", type: "element", x: 120, y: 40, color: "#FFC107", size: 60, shape: "circle", position: { x: 120, y: 40 }, rotation: 0 },
      { id: "3", type: "element", x: 200, y: 40, color: "#9b87f5", size: 60, shape: "circle", position: { x: 200, y: 40 }, rotation: 0 },
      { id: "4", type: "element", x: 280, y: 40, color: "#FFC107", size: 60, shape: "circle", position: { x: 280, y: 40 }, rotation: 0 },
      { id: "5", type: "element", x: 360, y: 40, color: "#9b87f5", size: 60, shape: "circle", position: { x: 360, y: 40 }, rotation: 0 },
      { id: "6", type: "element", x: 440, y: 40, color: "#FFC107", size: 60, shape: "circle", position: { x: 440, y: 40 }, rotation: 0 },
      { id: "7", type: "element", x: 520, y: 40, color: "#9b87f5", size: 60, shape: "circle", position: { x: 520, y: 40 }, rotation: 0 },
      
      // Row 2 - Alternating squares and triangles
      { id: "8", type: "element", x: 40, y: 120, color: "#33C3F0", size: 60, shape: "square", position: { x: 40, y: 120 }, rotation: 0 },
      { id: "9", type: "element", x: 120, y: 120, color: "#FF5252", size: 60, shape: "triangle", position: { x: 120, y: 120 }, rotation: 0 },
      { id: "10", type: "element", x: 200, y: 120, color: "#33C3F0", size: 60, shape: "square", position: { x: 200, y: 120 }, rotation: 0 },
      { id: "11", type: "element", x: 280, y: 120, color: "#FF5252", size: 60, shape: "triangle", position: { x: 280, y: 120 }, rotation: 0 },
      { id: "12", type: "element", x: 360, y: 120, color: "#33C3F0", size: 60, shape: "square", position: { x: 360, y: 120 }, rotation: 0 },
      { id: "13", type: "element", x: 440, y: 120, color: "#FF5252", size: 60, shape: "triangle", position: { x: 440, y: 120 }, rotation: 0 },
      { id: "14", type: "element", x: 520, y: 120, color: "#33C3F0", size: 60, shape: "square", position: { x: 520, y: 120 }, rotation: 0 },
      
      // Row 3 - Pattern with symbols
      { id: "15", type: "element", x: 40, y: 200, color: "#000000", size: 60, shape: "symbol", position: { x: 40, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '♩' },
      { id: "16", type: "element", x: 120, y: 200, color: "#000000", size: 60, shape: "symbol", position: { x: 120, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '♪' },
      { id: "17", type: "element", x: 200, y: 200, color: "#000000", size: 60, shape: "symbol", position: { x: 200, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '♩' },
      { id: "18", type: "element", x: 280, y: 200, color: "#000000", size: 60, shape: "symbol", position: { x: 280, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '♪' },
      { id: "19", type: "element", x: 360, y: 200, color: "#000000", size: 60, shape: "symbol", position: { x: 360, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '♩' },
      { id: "20", type: "element", x: 440, y: 200, color: "#000000", size: 60, shape: "symbol", position: { x: 440, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '♪' },
      { id: "21", type: "element", x: 520, y: 200, color: "#000000", size: 60, shape: "symbol", position: { x: 520, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '♩' },
      
      // Row 4 - Emoji pattern
      { id: "22", type: "element", x: 40, y: 280, color: "#000000", size: 60, shape: "symbol", position: { x: 40, y: 280 }, rotation: 0, iconType: 'symbol', iconContent: '👏' },
      { id: "23", type: "element", x: 120, y: 280, color: "#000000", size: 60, shape: "symbol", position: { x: 120, y: 280 }, rotation: 0, iconType: 'symbol', iconContent: '🎵' },
      { id: "24", type: "element", x: 200, y: 280, color: "#000000", size: 60, shape: "symbol", position: { x: 200, y: 280 }, rotation: 0, iconType: 'symbol', iconContent: '👏' },
      { id: "25", type: "element", x: 280, y: 280, color: "#000000", size: 60, shape: "symbol", position: { x: 280, y: 280 }, rotation: 0, iconType: 'symbol', iconContent: '🎵' },
      { id: "26", type: "element", x: 360, y: 280, color: "#000000", size: 60, shape: "symbol", position: { x: 360, y: 280 }, rotation: 0, iconType: 'symbol', iconContent: '👏' },
      { id: "27", type: "element", x: 440, y: 280, color: "#000000", size: 60, shape: "symbol", position: { x: 440, y: 280 }, rotation: 0, iconType: 'symbol', iconContent: '🎵' },
      { id: "28", type: "element", x: 520, y: 280, color: "#000000", size: 60, shape: "symbol", position: { x: 520, y: 280 }, rotation: 0, iconType: 'symbol', iconContent: '👏' },
      
      // Row 5 - Instrument representations
      { id: "29", type: "element", x: 40, y: 360, color: "#FF9800", size: 60, shape: "symbol", position: { x: 40, y: 360 }, rotation: 0, iconType: 'instrument', iconContent: "🎸" },
      { id: "30", type: "element", x: 120, y: 360, color: "#1E88E5", size: 60, shape: "symbol", position: { x: 120, y: 360 }, rotation: 0, iconType: 'instrument', iconContent: "●" },
      { id: "31", type: "element", x: 200, y: 360, color: "#7E69AB", size: 60, shape: "symbol", position: { x: 200, y: 360 }, rotation: 0, iconType: 'instrument', iconContent: "▲" },
      { id: "32", type: "element", x: 280, y: 360, color: "#FFFFFF", size: 60, shape: "symbol", position: { x: 280, y: 360 }, rotation: 0, iconType: 'instrument', iconContent: "●" },
      { id: "33", type: "element", x: 360, y: 360, color: "#FFC107", size: 60, shape: "symbol", position: { x: 360, y: 360 }, rotation: 0, iconType: 'instrument', iconContent: "▪" },
      { id: "34", type: "element", x: 440, y: 360, color: "#FF9800", size: 60, shape: "symbol", position: { x: 440, y: 360 }, rotation: 0, iconType: 'instrument', iconContent: "✋" },
      { id: "35", type: "element", x: 520, y: 360, color: "#8FD28E", size: 60, shape: "symbol", position: { x: 520, y: 360 }, rotation: 0, iconType: 'instrument', iconContent: "👣" }
    ]
  },
  {
    id: "estudo1-2",
    name: "Estudo 1 e 2",
    rows: 2,
    columns: 10,
    description: "Padrão de barras verticais, quadrado e espirais",
    elements: [
      // First row
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "square", position: { x: 360, y: 40 }, rotation: 0 },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 520, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "8", type: "element", x: 600, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 600, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "9", type: "element", x: 680, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 680, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "10", type: "element", x: 760, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 760, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Second row
      { id: "11", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "12", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "13", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "14", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "15", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "16", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "17", type: "element", x: 520, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 520, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "18", type: "element", x: 600, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 600, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "19", type: "element", x: 680, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 680, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "20", type: "element", x: 760, y: 120, color: "#000000", size: 60, shape: "square", position: { x: 760, y: 120 }, rotation: 0 }
    ]
  },
  {
    id: "estudo3",
    name: "Estudo 3",
    rows: 3,
    columns: 7,
    description: "Padrão com espirais, quadrados e barras verticais",
    elements: [
      // First row - all spirals except last square
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "square", position: { x: 520, y: 40 }, rotation: 0 },
      
      // Second row - all spirals except last square
      { id: "8", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "9", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "10", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "11", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "12", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "13", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "14", type: "element", x: 520, y: 120, color: "#000000", size: 60, shape: "square", position: { x: 520, y: 120 }, rotation: 0 },
      
      // Third row - mix of bars and spirals
      { id: "15", type: "element", x: 40, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "16", type: "element", x: 120, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "17", type: "element", x: 200, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "18", type: "element", x: 280, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "19", type: "element", x: 360, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "20", type: "element", x: 440, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "21", type: "element", x: 520, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 520, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' }
    ]
  },
  {
    id: "estudo4",
    name: "Estudo 4",
    rows: 3,
    columns: 8,
    description: "Padrão com barras verticais, espirais e dois pontos",
    elements: [
      // First row
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 520, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "8", type: "element", x: 600, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 600, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: ':||' },
      
      // Second row
      { id: "9", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "10", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "11", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "12", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "13", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "14", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Third row
      { id: "15", type: "element", x: 40, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "16", type: "element", x: 120, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "17", type: "element", x: 200, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "18", type: "element", x: 280, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "19", type: "element", x: 360, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "20", type: "element", x: 440, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "21", type: "element", x: 520, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 520, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' }
    ]
  },
  {
    id: "estudo5",
    name: "Estudo 5",
    rows: 3,
    columns: 7,
    description: "Padrão com barras verticais e espirais",
    elements: [
      // First row
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Second row
      { id: "7", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "8", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "9", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "10", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "11", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "12", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "13", type: "element", x: 520, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 520, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Third row
      { id: "14", type: "element", x: 40, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "15", type: "element", x: 120, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "16", type: "element", x: 200, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "17", type: "element", x: 280, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "18", type: "element", x: 360, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 360, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "19", type: "element", x: 440, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' }
    ]
  },
  {
    id: "estudo5-continuacao",
    name: "Continuação do Estudo 5",
    rows: 3, 
    columns: 10,
    description: "Continuação do padrão do Estudo 5 com barras verticais, espirais e quadrados",
    elements: [
      // First row
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 520, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Second row - spirals and bars with square at end
      { id: "8", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "9", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "10", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "11", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "12", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "13", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "14", type: "element", x: 520, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 520, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "15", type: "element", x: 600, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 600, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "16", type: "element", x: 680, y: 120, color: "#000000", size: 60, shape: "square", position: { x: 680, y: 120 }, rotation: 0 },
      
      // Third row - similar to second row
      { id: "17", type: "element", x: 40, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 40, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "18", type: "element", x: 120, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 120, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "19", type: "element", x: 200, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "20", type: "element", x: 280, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 280, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "21", type: "element", x: 360, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "22", type: "element", x: 440, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "23", type: "element", x: 520, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 520, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "24", type: "element", x: 600, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 600, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "25", type: "element", x: 680, y: 200, color: "#000000", size: 60, shape: "square", position: { x: 680, y: 200 }, rotation: 0 }
    ]
  },
  {
    id: "estudo6",
    name: "Estudo 6",
    rows: 2,
    columns: 7,
    description: "Padrão com barras verticais e espirais",
    elements: [
      // First row
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 520, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Second row
      { id: "8", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "9", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "10", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "11", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "12", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "13", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "14", type: "element", x: 520, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 520, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' }
    ]
  },
  {
    id: "estudo7",
    name: "Estudo 7",
    rows: 2,
    columns: 13,
    description: "Padrão com barras verticais, espirais e quadrados",
    elements: [
      // First row - all bars and square at end
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 520, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "8", type: "element", x: 600, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 600, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "9", type: "element", x: 680, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 680, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "10", type: "element", x: 760, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 760, y: 40 }, rotation: 0, iconType
