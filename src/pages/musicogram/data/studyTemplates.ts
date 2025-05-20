
import { StudyTemplate } from "../types";

export const musicStudyTemplates: StudyTemplate[] = [
  {
    id: "estudo1-2",
    name: "Estudo 1 e 2",
    rows: 2,
    columns: 10,
    description: "Barras verticais, quadrados e espirais",
    imageUrl: "/lovable-uploads/2361048e-84d0-47e3-ad12-32f09b7c1b1a.png",
    previewContent: `
      <div class="flex gap-2">
        <div class="text-2xl font-bold">|</div>
        <div class="text-2xl font-bold">□</div>
        <div class="text-2xl font-bold">@</div>
      </div>
    `,
    elements: [
      // First row, based on image 1: | | | | □ | | | | @ @
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
      
      // Second row, based on image 1: | | | | @ @ | | | | □
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
    description: "Espirais e barras verticais",
    imageUrl: "/lovable-uploads/bb019803-0587-462c-851c-393fcc685139.png",
    previewContent: `
      <div class="flex gap-1">
        <div class="text-2xl font-bold">@</div>
        <div class="text-2xl font-bold">@</div>
        <div class="text-2xl font-bold">□</div>
      </div>
    `,
    elements: [
      // First row (from image 2): @ @ @ @ @ @ □
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "square", position: { x: 520, y: 40 }, rotation: 0 },
      
      // Second row (from image 2): @ @ @ @ @ @ □
      { id: "8", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "9", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "10", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "11", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "12", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "13", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "14", type: "element", x: 520, y: 120, color: "#000000", size: 60, shape: "square", position: { x: 520, y: 120 }, rotation: 0 },
      
      // Third row (from image 2): | | @ | | @ | | | | | @
      { id: "15", type: "element", x: 40, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "16", type: "element", x: 120, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "17", type: "element", x: 200, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "18", type: "element", x: 280, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "19", type: "element", x: 360, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "20", type: "element", x: 440, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "21", type: "element", x: 520, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 520, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' }
    ]
  },
  {
    id: "estudo4",
    name: "Estudo 4",
    rows: 3,
    columns: 8,
    description: "Barras verticais, espiral e repetição",
    imageUrl: "/lovable-uploads/80847e14-0ceb-4478-9e62-d9757cbd7b10.png",
    previewContent: `
      <div class="flex gap-1">
        <div class="text-2xl font-bold">|</div>
        <div class="text-2xl font-bold">@</div>
        <div class="text-2xl font-bold">:||</div>
      </div>
    `,
    elements: [
      // First row (from image 3): | | | | | | @ :||
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 520, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "8", type: "element", x: 600, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 600, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: ':||' },
      
      // Second row (from image 3): | | @ | | @
      { id: "9", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "10", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "11", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "12", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "13", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "14", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Third row (from image 3): | | | | | | @
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
    columns: 6,
    description: "Barras verticais e espirais alternadas",
    imageUrl: "/lovable-uploads/65fe902f-d08a-48e5-8c93-7c4a7cc6e6a6.png",
    previewContent: `
      <div class="flex gap-1">
        <div class="text-2xl font-bold">|</div>
        <div class="text-2xl font-bold">@</div>
      </div>
    `,
    elements: [
      // First row (from image 4): | | @ | | @
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Second row (from image 4): | | | | | @
      { id: "7", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "8", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "9", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "10", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "11", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "12", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Third row (from image 4): | | | | @ @
      { id: "13", type: "element", x: 40, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "14", type: "element", x: 120, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "15", type: "element", x: 200, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "16", type: "element", x: 280, y: 200, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "17", type: "element", x: 360, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 360, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "18", type: "element", x: 440, y: 200, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 200 }, rotation: 0, iconType: 'symbol', iconContent: '@' }
    ]
  },
  {
    id: "estudo5-continuacao",
    name: "Continuação do Estudo 5",
    rows: 3,
    columns: 9,
    description: "Continuação com padrões de espirais e barras verticais",
    imageUrl: "/lovable-uploads/0302407c-ff13-485b-b92e-84d9766078e4.png",
    previewContent: `
      <div class="flex gap-1">
        <div class="text-2xl font-bold">|</div>
        <div class="text-2xl font-bold">@</div>
        <div class="text-2xl font-bold">□</div>
      </div>
    `,
    elements: [
      // First row (from image 5): | | | | | | @
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 520, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Second row (from image 5): @ @ @ @ | | | | □
      { id: "8", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "9", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "10", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "11", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "12", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "13", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "14", type: "element", x: 520, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 520, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "15", type: "element", x: 600, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 600, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "16", type: "element", x: 680, y: 120, color: "#000000", size: 60, shape: "square", position: { x: 680, y: 120 }, rotation: 0 },
      
      // Third row (from image 5): @ @ @ @ | | | | □
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
    description: "Barras verticais e espirais",
    imageUrl: "/lovable-uploads/1556ebae-2a48-401a-b199-191d6b324da2.png",
    previewContent: `
      <div class="flex gap-1">
        <div class="text-2xl font-bold">|</div>
        <div class="text-2xl font-bold">@</div>
      </div>
    `,
    elements: [
      // First row (from image 6): | | | | | | @
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 520, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Second row (from image 6): | | | | | | @
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
    description: "Padrão com barras verticais e espirais",
    imageUrl: "/lovable-uploads/89a06917-0b2b-432a-a44c-26eebae1dff1.png",
    previewContent: `
      <div class="flex gap-1">
        <div class="text-2xl font-bold">|</div>
        <div class="text-2xl font-bold">□</div>
      </div>
    `,
    elements: [
      // First row (from image 7): | | | | | | | | | | | | □
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
      
      // Second row (from image 7): | | | | | | @ @ @ □
      { id: "14", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "15", type: "element", x: 80, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 80, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "16", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "17", type: "element", x: 160, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 160, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "18", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "19", type: "element", x: 240, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 240, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "20", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "21", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "22", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "23", type: "element", x: 520, y: 120, color: "#000000", size: 60, shape: "square", position: { x: 520, y: 120 }, rotation: 0 }
    ]
  },
  {
    id: "estudo8",
    name: "Estudo 8",
    rows: 3,
    columns: 8,
    description: "Padrão com barras verticais, espirais e dois pontos",
    imageUrl: "/lovable-uploads/32b77141-7004-43e3-a188-8fe65029be60.png",
    previewContent: `
      <div class="flex gap-1">
        <div class="text-2xl font-bold">|</div>
        <div class="text-2xl font-bold">@</div>
        <div class="text-2xl font-bold">:||</div>
      </div>
    `,
    elements: [
      // First row (from image 8): | | | | | | @ :||
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 520, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "8", type: "element", x: 600, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 600, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: ':||' },
      
      // Second row (from image 8): | | | | @ @
      { id: "9", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "10", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "11", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "12", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "13", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 360, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "14", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "circle", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      
      // Third row (from image 8): | | | | | | @
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
    id: "estudo9-10",
    name: "Estudo 9 e 10",
    rows: 2,
    columns: 7,
    description: "Padrão com barras verticais, espiral, quadrado e repetição",
    imageUrl: "/lovable-uploads/6df01cd1-31a7-48e4-a002-c88f4dac3435.png",
    previewContent: `
      <div class="flex gap-1">
        <div class="text-2xl font-bold">|</div>
        <div class="text-2xl font-bold">@</div>
        <div class="text-2xl font-bold">:||</div>
      </div>
    `,
    elements: [
      // First row (from image 9): | | | | @ | |
      { id: "1", type: "element", x: 40, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "2", type: "element", x: 120, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "3", type: "element", x: 200, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "4", type: "element", x: 280, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "5", type: "element", x: 360, y: 40, color: "#000000", size: 60, shape: "circle", position: { x: 360, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '@' },
      { id: "6", type: "element", x: 440, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "7", type: "element", x: 520, y: 40, color: "#000000", size: 60, shape: "rect", position: { x: 520, y: 40 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      
      // Second row (from image 9): | | | | □ :||
      { id: "8", type: "element", x: 40, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 40, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "9", type: "element", x: 120, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 120, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "10", type: "element", x: 200, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 200, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "11", type: "element", x: 280, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 280, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: '|' },
      { id: "12", type: "element", x: 360, y: 120, color: "#000000", size: 60, shape: "square", position: { x: 360, y: 120 }, rotation: 0 },
      { id: "13", type: "element", x: 440, y: 120, color: "#000000", size: 60, shape: "rect", position: { x: 440, y: 120 }, rotation: 0, iconType: 'symbol', iconContent: ':||' }
    ]
  }
];
