
// Serviço de áudio específico para musicograma com múltiplos fallbacks
class MusicogramAudioService {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.isInitialized = true;
      console.log('[AUDIO] Serviço inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('[AUDIO] Erro ao inicializar:', error);
      return false;
    }
  }

  // Método 1: Text-to-Speech (mais confiável)
  async playTextToSpeech(text: string, lang: string = 'pt-BR'): Promise<boolean> {
    try {
      if (!('speechSynthesis' in window)) {
        console.warn('[AUDIO] Text-to-Speech não suportado');
        return false;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 0.7;

      speechSynthesis.speak(utterance);
      console.log(`[AUDIO] ✅ Text-to-Speech: ${text}`);
      return true;
    } catch (error) {
      console.warn('[AUDIO] Text-to-Speech falhou:', error);
      return false;
    }
  }

  // Método 2: Som sintético melhorado por categoria
  async playSyntheticSound(category: string, name: string): Promise<boolean> {
    try {
      await this.initialize();
      if (!this.audioContext) return false;

      const categoryFrequencies: { [key: string]: number } = {
        instrument: 440, // Lá
        emotion: 523,    // Dó
        action: 659,     // Mi
        dynamic: 392,    // Sol
        nature: 294      // Ré
      };

      const categoryWaveTypes: { [key: string]: OscillatorType } = {
        instrument: 'sine',
        emotion: 'triangle',
        action: 'square',
        dynamic: 'sawtooth',
        nature: 'sine'
      };

      const frequency = categoryFrequencies[category] || 440;
      const waveType = categoryWaveTypes[category] || 'sine';

      // Criar oscilador principal
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      oscillator.type = waveType;
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

      // Configurar filtro
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);

      // Envelope ADSR
      const now = this.audioContext.currentTime;
      const attackTime = 0.05;
      const decayTime = 0.1;
      const sustainLevel = 0.4;
      const releaseTime = 0.4;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.6, now + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime);

      // Conectar nós
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Reproduzir
      oscillator.start(now);
      oscillator.stop(now + attackTime + decayTime + releaseTime);

      console.log(`[AUDIO] ✅ Som sintético: ${category} - ${frequency}Hz (${waveType})`);
      return true;
    } catch (error) {
      console.error('[AUDIO] Som sintético falhou:', error);
      return false;
    }
  }

  // Método 3: Beep simples de emergência
  async playEmergencyBeep(): Promise<boolean> {
    try {
      await this.initialize();
      if (!this.audioContext) return false;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.2);

      console.log('[AUDIO] 🔔 Beep de emergência');
      return true;
    } catch (error) {
      console.error('[AUDIO] Beep de emergência falhou:', error);
      return false;
    }
  }

  // Método 4: Vibração (se disponível)
  playVibration(): boolean {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
        console.log('[AUDIO] 📳 Vibração');
        return true;
      }
      return false;
    } catch (error) {
      console.warn('[AUDIO] Vibração falhou:', error);
      return false;
    }
  }

  // Método principal com fallbacks em cascata
  async playSymbolSound(name: string, category: string): Promise<void> {
    console.log(`[AUDIO] Tentando reproduzir som para: ${name} (${category})`);

    // 1. Tentar Text-to-Speech primeiro
    const ttsSuccess = await this.playTextToSpeech(name);
    if (ttsSuccess) return;

    // 2. Tentar som sintético
    const synthSuccess = await this.playSyntheticSound(category, name);
    if (synthSuccess) return;

    // 3. Tentar beep de emergência
    const beepSuccess = await this.playEmergencyBeep();
    if (beepSuccess) return;

    // 4. Última tentativa: vibração
    this.playVibration();
    
    console.log('[AUDIO] ✅ Feedback fornecido com sucesso');
  }

  // Sons especiais para feedback
  async playSuccessSound(): Promise<void> {
    try {
      await this.playTextToSpeech('Parabéns!');
    } catch {
      await this.playSyntheticSound('emotion', 'sucesso');
    }
  }

  async playErrorSound(): Promise<void> {
    try {
      await this.playTextToSpeech('Tente novamente');
    } catch {
      await this.playSyntheticSound('action', 'erro');
    }
  }

  cleanup(): void {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
      this.isInitialized = false;
    }
  }
}

// Singleton instance
export const musicogramAudio = new MusicogramAudioService();
