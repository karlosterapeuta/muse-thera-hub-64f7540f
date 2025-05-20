import { StudyTemplate } from "../types";

export const musicStudyTemplates: StudyTemplate[] = [
  {
    id: "estudo1-2",
    name: "Estudo 1 e 2",
    rows: 2,
    columns: 10,
    description: "Padrão de barras verticais, quadrado e espirais",
    previewContent: `
      <div class="grid grid-cols-5 gap-1">
        <div class="text-3xl">|</div>
        <div class="text-3xl">|</div>
        <div class="text-3xl">□</div>
      </div>
    `,
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
    previewContent: `
      <div class="grid grid-cols-3 gap-1">
        <div class="text-3xl">@</div>
        <div class="text-3xl">@</div>
        <div class="text-3xl">□</div>
      </div>
    `,
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
    ]
  },
  {
    id: "estudo4",
    name: "Estudo 4",
    rows: 3,
    columns: 8,
    description: "Padrão com barras verticais, espirais e dois pontos",
    previewContent: `
      <div class="grid grid-cols-3 gap-1">
        <div class="text-3xl">|</div>
        <div class="text-3xl">@</div>
        <div class="text-3xl">:||</div>
      </div>
    `,
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
      { id: "17", type: "element", x: 200, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "18", type: "element", x: 280, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "19", type: "element", x: 360, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "20", type: "element", x: 440, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
    ]
  },
  {
    id: "estudo5",
    name: "Estudo 5",
    rows: 3,
    columns: 7,
    description: "Padrão alternando barras verticais e espirais",
    previewContent: `
      <div class="grid grid-cols-3 gap-1">
        <div class="text-3xl">|</div>
        <div class="text-3xl">|</div>
        <div class="text-3xl">@</div>
      </div>
    `,
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
      { id: "12", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Third row
      { id: "13", type: "element", x: 40, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "14", type: "element", x: 120, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "15", type: "element", x: 200, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "16", type: "element", x: 280, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "17", type: "element", x: 360, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "18", type: "element", x: 440, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
    ]
  },
  {
    id: "estudo6",
    name: "Estudo 6",
    rows: 2,
    columns: 7,
    description: "Padrão de barras e espirais no final",
    previewContent: `
      <div class="grid grid-cols-3 gap-1">
        <div class="text-3xl">|</div>
        <div class="text-3xl">|</div>
        <div class="text-3xl">@</div>
      </div>
    `,
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
      { id: "12", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Third row
      { id: "13", type: "element", x: 40, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "14", type: "element", x: 120, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "15", type: "element", x: 200, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "16", type: "element", x: 280, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "17", type: "element", x: 360, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "18", type: "element", x: 440, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
    ]
  },
  {
    id: "estudo7",
    name: "Estudo 7",
    rows: 2,
    columns: 8,
    description: "Padrão com barras verticais seguidas de espirais",
    previewContent: `
      <div class="grid grid-cols-3 gap-1">
        <div class="text-3xl">|</div>
        <div class="text-3xl">@</div>
        <div class="text-3xl">□</div>
      </div>
    `,
    elements: [
      // First row
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 80, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 80, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "4", type: "element", x: 160, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 160, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "6", type: "element", x: 240, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 240, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "7", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "8", type: "element", x: 320, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 320, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "9", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "10", type: "element", x: 400, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 400, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "11", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "12", type: "element", x: 480, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 480, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "13", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "square", position: { x: 520, y: 40 }, rotation: 0 },
      
      // Second row
      { id: "14", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "15", type: "element", x: 80, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 80, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "16", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "17", type: "element", x: 160, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 160, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "18", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "19", type: "element", x: 240, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 240, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "20", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Third row
      { id: "21", type: "element", x: 40, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "22", type: "element", x: 120, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "23", type: "element", x: 200, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "24", type: "element", x: 280, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "25", type: "element", x: 360, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "26", type: "element", x: 440, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
    ]
  },
  {
    id: "estudo8",
    name: "Estudo 8",
    rows: 3,
    columns: 7,
    description: "Padrão similar ao Estudo 4",
    previewContent: `
      <div class="grid grid-cols-3 gap-1">
        <div class="text-3xl">|</div>
        <div class="text-3xl">@</div>
        <div class="text-3xl">:||</div>
      </div>
    `,
    elements: [
      // First row - similar to Estudo 4
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
      { id: "17", type: "element", x: 200, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "18", type: "element", x: 280, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "19", type: "element", x: 360, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "20", type: "element", x: 440, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
    ]
  },
  {
    id: "estudo9-10",
    name: "Estudo 9 e 10",
    rows: 2,
    columns: 7,
    description: "Padrão com barras verticais, espiral e repetição",
    previewContent: `
      <div class="grid grid-cols-3 gap-1">
        <div class="text-3xl">|</div>
        <div class="text-3xl">@</div>
        <div class="text-3xl">:||</div>
      </div>
    `,
    elements: [
      // First row
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 520, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      
      // Second row
      { id: "8", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "9", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "10", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "11", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "12", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "square", position: { x: 360, y: 120 }, rotation: 0 },
      { id: "13", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: ':||' }
    ]
  }
];
