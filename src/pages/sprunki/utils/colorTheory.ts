
export const gameModes: Record<string, any> = {
  calm: {
    id: 'calm',
    name: 'Calmo',
    description: 'Sons suaves e cores relaxantes',
    baseFrequency: 200,
    colorPalette: ['#87CEEB', '#98D8E8', '#B0E0E6', '#E0F6FF', '#F0F8FF'],
    sensitivity: 0.7,
    waveDecay: 0.95,
    maxWaves: 15
  },
  energy: {
    id: 'energy',
    name: 'Energia',
    description: 'Ritmos dinâmicos e cores vibrantes',
    baseFrequency: 400,
    colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    sensitivity: 1.3,
    waveDecay: 0.92,
    maxWaves: 25
  },
  focus: {
    id: 'focus',
    name: 'Foco',
    description: 'Padrões repetitivos para concentração',
    baseFrequency: 300,
    colorPalette: ['#6C5CE7', '#A29BFE', '#FDCB6E', '#E17055', '#00B894'],
    sensitivity: 1.0,
    waveDecay: 0.97,
    maxWaves: 10
  },
  creative: {
    id: 'creative',
    name: 'Criativo',
    description: 'Liberdade total de expressão',
    baseFrequency: 250,
    colorPalette: ['#FF7675', '#74B9FF', '#00CEC9', '#FDCB6E', '#FD79A8', '#E84393'],
    sensitivity: 1.1,
    waveDecay: 0.94,
    maxWaves: 30
  }
};

export function getColorFromPosition(x: number, y: number, canvasWidth: number, canvasHeight: number, palette: string[]): string {
  const normalizedX = x / canvasWidth;
  const normalizedY = y / canvasHeight;
  
  // Create color mixing based on position
  const colorIndex = Math.floor(normalizedX * palette.length);
  const baseColor = palette[colorIndex] || palette[0];
  
  // Modify brightness based on Y position
  const brightness = 0.5 + (1 - normalizedY) * 0.5;
  
  return adjustColorBrightness(baseColor, brightness);
}

function adjustColorBrightness(color: string, brightness: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.round(r * brightness);
  const newG = Math.round(g * brightness);
  const newB = Math.round(b * brightness);
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

export function generateParticleColor(baseColor: string, intensity: number): string {
  const alpha = Math.max(0.1, Math.min(1, intensity));
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
