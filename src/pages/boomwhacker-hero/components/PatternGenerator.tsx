
import React from 'react';

export interface NotePattern {
  time: number;
  track: number;
  duration: number;
  velocity?: number;
}

export interface GeneratedSong {
  id: string;
  title: string;
  artist: string;
  duration: number;
  bpm: number;
  difficulty: 'easy' | 'medium' | 'hard';
  pattern: NotePattern[];
}

// Padrões pré-definidos para diferentes tipos de música
const PATTERN_TEMPLATES = {
  simple: {
    notesPerBeat: 1,
    trackVariation: 'low', // usa principalmente tracks 0-3
    complexity: 'single', // notas simples, não acordes
  },
  medium: {
    notesPerBeat: 1.5,
    trackVariation: 'medium', // usa tracks 0-5
    complexity: 'mixed', // mistura notas simples e duplas
  },
  complex: {
    notesPerBeat: 2,
    trackVariation: 'full', // usa todos os tracks
    complexity: 'chords', // pode incluir acordes
  }
};

// Escalas musicais comuns
const SCALES = {
  C_MAJOR: [0, 1, 2, 3, 4, 5, 6, 7], // C D E F G A B C
  PENTATONIC: [0, 1, 2, 4, 5], // C D E G A
  CHILDREN: [0, 2, 4, 5], // C E G A (comum em músicas infantis)
};

export class PatternGenerator {
  // Gerar padrão baseado em BPM e duração
  static generatePattern(
    title: string,
    artist: string,
    duration: number,
    bpm: number,
    difficulty: 'easy' | 'medium' | 'hard'
  ): GeneratedSong {
    const pattern: NotePattern[] = [];
    const template = PATTERN_TEMPLATES[difficulty === 'easy' ? 'simple' : difficulty === 'medium' ? 'medium' : 'complex'];
    
    // Calcular intervalo entre batidas (em ms)
    const beatInterval = (60 / bpm) * 1000;
    const noteInterval = beatInterval / template.notesPerBeat;
    
    // Escolher escala baseada na dificuldade
    let scale: number[];
    switch (difficulty) {
      case 'easy':
        scale = SCALES.CHILDREN;
        break;
      case 'medium':
        scale = SCALES.PENTATONIC;
        break;
      case 'hard':
        scale = SCALES.C_MAJOR;
        break;
      default:
        scale = SCALES.CHILDREN;
    }
    
    // Gerar padrão estruturado
    const totalNotes = Math.floor((duration * 1000) / noteInterval);
    
    for (let i = 0; i < totalNotes; i++) {
      const time = i * noteInterval;
      
      // Adicionar variação baseada na posição na música
      const progressRatio = i / totalNotes;
      const shouldAddNote = this.shouldAddNote(progressRatio, difficulty, i);
      
      if (shouldAddNote) {
        const track = this.selectTrack(scale, progressRatio, difficulty);
        const noteDuration = this.calculateNoteDuration(noteInterval, difficulty);
        
        pattern.push({
          time: Math.round(time),
          track,
          duration: noteDuration,
          velocity: this.calculateVelocity(progressRatio, difficulty)
        });
      }
    }
    
    return {
      id: `generated-${Date.now()}`,
      title,
      artist,
      duration,
      bpm,
      difficulty,
      pattern: this.optimizePattern(pattern)
    };
  }
  
  // Determinar se deve adicionar uma nota nesta posição
  private static shouldAddNote(progressRatio: number, difficulty: string, noteIndex: number): boolean {
    // Intro (primeiros 20%)
    if (progressRatio < 0.2) {
      return difficulty === 'easy' ? noteIndex % 8 === 0 : noteIndex % 4 === 0;
    }
    
    // Desenvolvimento (20% - 80%)
    if (progressRatio < 0.8) {
      switch (difficulty) {
        case 'easy':
          return noteIndex % 4 === 0 || (noteIndex % 8 === 4 && Math.random() > 0.5);
        case 'medium':
          return noteIndex % 2 === 0 || Math.random() > 0.3;
        case 'hard':
          return Math.random() > 0.2;
        default:
          return noteIndex % 4 === 0;
      }
    }
    
    // Final (últimos 20%) - diminuir densidade
    return difficulty === 'easy' ? noteIndex % 8 === 0 : noteIndex % 6 === 0;
  }
  
  // Selecionar track baseado na escala e progressão
  private static selectTrack(scale: number[], progressRatio: number, difficulty: string): number {
    // Padrão mais musical - começar e terminar na tônica
    if (progressRatio < 0.1 || progressRatio > 0.9) {
      return scale[0]; // Tônica (C)
    }
    
    // No meio da música, usar variação
    switch (difficulty) {
      case 'easy':
        // Alternar entre notas próximas
        return scale[Math.floor(Math.random() * Math.min(3, scale.length))];
      
      case 'medium':
        // Usar mais da escala com padrões
        const midIndex = Math.floor(scale.length / 2);
        return scale[Math.floor(Math.random() * scale.length)];
      
      case 'hard':
        // Usar toda a escala com saltos maiores
        return scale[Math.floor(Math.random() * scale.length)];
      
      default:
        return scale[0];
    }
  }
  
  // Calcular duração da nota
  private static calculateNoteDuration(baseInterval: number, difficulty: string): number {
    switch (difficulty) {
      case 'easy':
        return baseInterval * 2; // Notas mais longas
      case 'medium':
        return baseInterval * 1.5;
      case 'hard':
        return baseInterval; // Notas mais curtas
      default:
        return baseInterval;
    }
  }
  
  // Calcular velocidade/intensidade da nota
  private static calculateVelocity(progressRatio: number, difficulty: string): number {
    // Criar dinâmica musical
    const baseDynamic = 0.7;
    
    if (progressRatio < 0.2) {
      return baseDynamic * 0.8; // Início mais suave
    }
    
    if (progressRatio > 0.8) {
      return baseDynamic * 0.9; // Final crescendo
    }
    
    // Meio com variação
    const variation = difficulty === 'hard' ? 0.3 : 0.2;
    return baseDynamic + (Math.random() - 0.5) * variation;
  }
  
  // Otimizar padrão removendo notas muito próximas
  private static optimizePattern(pattern: NotePattern[]): NotePattern[] {
    const optimized: NotePattern[] = [];
    const minInterval = 150; // ms mínimo entre notas na mesma track
    
    pattern.forEach(note => {
      const lastNoteInTrack = optimized
        .filter(n => n.track === note.track)
        .pop();
      
      if (!lastNoteInTrack || note.time - lastNoteInTrack.time >= minInterval) {
        optimized.push(note);
      }
    });
    
    return optimized.sort((a, b) => a.time - b.time);
  }
  
  // Gerar padrão para música conhecida
  static generateKnownSong(songType: 'twinkle' | 'happy' | 'scale' | 'mary'): GeneratedSong {
    switch (songType) {
      case 'twinkle':
        return {
          id: 'twinkle-generated',
          title: 'Twinkle Twinkle Little Star',
          artist: 'Tradicional',
          duration: 30,
          bpm: 120,
          difficulty: 'easy',
          pattern: [
            { time: 0, track: 0, duration: 500 },     // C
            { time: 1000, track: 0, duration: 500 },  // C
            { time: 2000, track: 4, duration: 500 },  // G
            { time: 3000, track: 4, duration: 500 },  // G
            { time: 4000, track: 5, duration: 500 },  // A
            { time: 5000, track: 5, duration: 500 },  // A
            { time: 6000, track: 4, duration: 1000 }, // G
            { time: 8000, track: 3, duration: 500 },  // F
            { time: 9000, track: 3, duration: 500 },  // F
            { time: 10000, track: 2, duration: 500 }, // E
            { time: 11000, track: 2, duration: 500 }, // E
            { time: 12000, track: 1, duration: 500 }, // D
            { time: 13000, track: 1, duration: 500 }, // D
            { time: 14000, track: 0, duration: 1000 }, // C
          ]
        };
      
      case 'happy':
        return {
          id: 'happy-generated',
          title: 'Happy Birthday',
          artist: 'Tradicional',
          duration: 25,
          bpm: 140,
          difficulty: 'medium',
          pattern: [
            { time: 0, track: 0, duration: 400 },
            { time: 600, track: 0, duration: 400 },
            { time: 1200, track: 1, duration: 400 },
            { time: 1800, track: 0, duration: 400 },
            { time: 2400, track: 3, duration: 400 },
            { time: 3200, track: 2, duration: 800 },
            { time: 4400, track: 0, duration: 400 },
            { time: 5000, track: 0, duration: 400 },
            { time: 5600, track: 1, duration: 400 },
            { time: 6200, track: 0, duration: 400 },
            { time: 6800, track: 4, duration: 400 },
            { time: 7600, track: 3, duration: 800 },
          ]
        };
      
      case 'scale':
        return {
          id: 'scale-generated',
          title: 'Escala Musical',
          artist: 'Exercício',
          duration: 20,
          bpm: 100,
          difficulty: 'hard',
          pattern: [
            { time: 0, track: 0, duration: 400 },    // C
            { time: 500, track: 1, duration: 400 },  // D
            { time: 1000, track: 2, duration: 400 }, // E
            { time: 1500, track: 3, duration: 400 }, // F
            { time: 2000, track: 4, duration: 400 }, // G
            { time: 2500, track: 5, duration: 400 }, // A
            { time: 3000, track: 6, duration: 400 }, // B
            { time: 3500, track: 7, duration: 400 }, // C2
            { time: 4000, track: 7, duration: 400 }, // C2
            { time: 4500, track: 6, duration: 400 }, // B
            { time: 5000, track: 5, duration: 400 }, // A
            { time: 5500, track: 4, duration: 400 }, // G
            { time: 6000, track: 3, duration: 400 }, // F
            { time: 6500, track: 2, duration: 400 }, // E
            { time: 7000, track: 1, duration: 400 }, // D
            { time: 7500, track: 0, duration: 400 }, // C
          ]
        };
      
      case 'mary':
        return {
          id: 'mary-generated',
          title: 'Mary Had a Little Lamb',
          artist: 'Tradicional',
          duration: 20,
          bpm: 120,
          difficulty: 'easy',
          pattern: [
            { time: 0, track: 2, duration: 500 },    // E
            { time: 500, track: 1, duration: 500 },  // D
            { time: 1000, track: 0, duration: 500 }, // C
            { time: 1500, track: 1, duration: 500 }, // D
            { time: 2000, track: 2, duration: 500 }, // E
            { time: 2500, track: 2, duration: 500 }, // E
            { time: 3000, track: 2, duration: 1000 }, // E
            { time: 4500, track: 1, duration: 500 }, // D
            { time: 5000, track: 1, duration: 500 }, // D
            { time: 5500, track: 1, duration: 1000 }, // D
            { time: 7000, track: 2, duration: 500 }, // E
            { time: 7500, track: 4, duration: 500 }, // G
            { time: 8000, track: 4, duration: 1000 }, // G
          ]
        };
      
      default:
        return this.generatePattern('Música Desconhecida', 'Artista', 30, 120, 'easy');
    }
  }
}

export default PatternGenerator;
