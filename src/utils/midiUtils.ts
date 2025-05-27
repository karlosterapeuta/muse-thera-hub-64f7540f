
// Utility functions for MIDI support
interface MidiNote {
  note: number;
  velocity: number;
  channel: number;
}

interface MidiCallbacks {
  onNoteOn: (note: MidiNote) => void;
  onNoteOff: (note: MidiNote) => void;
}

class MidiManager {
  private midiAccess: any = null;
  private callbacks: MidiCallbacks | null = null;

  async initialize(): Promise<boolean> {
    try {
      if (navigator.requestMIDIAccess) {
        this.midiAccess = await navigator.requestMIDIAccess();
        this.setupMidiInputs();
        return true;
      } else {
        console.warn('Web MIDI API não suportada neste navegador');
        return false;
      }
    } catch (error) {
      console.error('Erro ao inicializar MIDI:', error);
      return false;
    }
  }

  private setupMidiInputs() {
    if (!this.midiAccess) return;

    for (const input of this.midiAccess.inputs.values()) {
      input.onmidimessage = this.handleMidiMessage.bind(this);
    }
  }

  private handleMidiMessage(message: any) {
    const [status, note, velocity] = message.data;
    const command = status >> 4;
    const channel = status & 0xf;

    if (command === 9 && velocity > 0) {
      // Note On
      this.callbacks?.onNoteOn({ note, velocity, channel });
    } else if (command === 8 || (command === 9 && velocity === 0)) {
      // Note Off
      this.callbacks?.onNoteOff({ note, velocity, channel });
    }
  }

  setCallbacks(callbacks: MidiCallbacks) {
    this.callbacks = callbacks;
  }

  // Converter número MIDI para nome da nota
  static midiNoteToName(midiNote: number): string {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = midiNote % 12;
    return noteNames[noteIndex] + (octave > 0 ? octave.toString() : '');
  }

  // Converter número MIDI para frequência
  static midiNoteToFrequency(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  // Converter nome da nota para cor educativa
  static noteToEducationalColor(noteName: string): string {
    const noteColorMap: { [key: string]: string } = {
      'C': '#FF0000',  // Vermelho
      'C#': '#FF4400', // Vermelho escuro
      'D': '#FF9900',  // Laranja
      'D#': '#FFAA44', // Laranja escuro
      'E': '#FFFF00',  // Amarelo
      'F': '#00FF00',  // Verde
      'F#': '#44FF44', // Verde claro
      'G': '#0099FF',  // Azul claro
      'G#': '#0066CC', // Azul médio
      'A': '#0000FF',  // Azul
      'A#': '#4444FF', // Azul claro
      'B': '#9900FF',  // Roxo
    };

    const noteLetter = noteName.replace(/[0-9]/g, '');
    return noteColorMap[noteLetter] || '#888888';
  }
}

export { MidiManager, type MidiNote, type MidiCallbacks };
