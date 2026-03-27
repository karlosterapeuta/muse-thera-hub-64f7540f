import { useEffect, useRef } from "react";

const LOOP_DURATION_SECONDS = 32;
const OUTPUT_VOLUME = 1.0;

const PLANETARY_FREQUENCIES = {
  cosmos: 64,
  earth: 136.1,
  venus: 221.23,
  jupiter: 183.58,
  saturn: 147.85,
  neptune: 211.44,
};

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;
  const samples = buffer.length;
  const blockAlign = numberOfChannels * bitDepth / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  const channels = Array.from({ length: numberOfChannels }, (_, channel) => buffer.getChannelData(channel));
  let offset = 44;

  for (let i = 0; i < samples; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i] || 0));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

async function renderCosmicLoop(): Promise<string> {
  const sampleRate = 44100;
  const frameCount = LOOP_DURATION_SECONDS * sampleRate;
  const ctx = new OfflineAudioContext(2, frameCount, sampleRate);

  const master = ctx.createGain();
  master.gain.setValueAtTime(2.5, 0);
  master.connect(ctx.destination);

  const makePad = (frequency: number, gainValue: number, pan: number, harmonic = 1) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency * harmonic, 0);

    const detuned = ctx.createOscillator();
    detuned.type = "triangle";
    detuned.frequency.setValueAtTime(frequency * harmonic * 1.002, 0);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainValue, 0);
    gain.gain.linearRampToValueAtTime(gainValue * 1.18, LOOP_DURATION_SECONDS / 2);
    gain.gain.linearRampToValueAtTime(gainValue, LOOP_DURATION_SECONDS);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, 0);
    filter.frequency.linearRampToValueAtTime(1400, LOOP_DURATION_SECONDS / 2);
    filter.frequency.linearRampToValueAtTime(900, LOOP_DURATION_SECONDS);

    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(pan, 0);

    osc.connect(gain);
    detuned.connect(gain);
    gain.connect(filter);
    filter.connect(panner);
    panner.connect(master);

    osc.start(0);
    detuned.start(0);
    osc.stop(LOOP_DURATION_SECONDS);
    detuned.stop(LOOP_DURATION_SECONDS);
  };

  makePad(PLANETARY_FREQUENCIES.cosmos, 0.08, 0);
  makePad(PLANETARY_FREQUENCIES.earth, 0.06, -0.2);
  makePad(PLANETARY_FREQUENCIES.venus, 0.04, 0.22);
  makePad(PLANETARY_FREQUENCIES.jupiter, 0.035, -0.35, 0.5);
  makePad(PLANETARY_FREQUENCIES.saturn, 0.03, 0.38, 1.5);

  const arpNotes = [
    PLANETARY_FREQUENCIES.earth,
    PLANETARY_FREQUENCIES.earth * 1.125,
    PLANETARY_FREQUENCIES.earth * 1.25,
    PLANETARY_FREQUENCIES.earth * 1.5,
    PLANETARY_FREQUENCIES.earth * 1.667,
  ];

  for (let i = 0; i < 7; i++) {
    const start = 2 + i * 4;
    const duration = 2.8;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(arpNotes[i % arpNotes.length] * 2, start);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.028, start + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, start);
    filter.frequency.linearRampToValueAtTime(650, start + duration);

    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(i % 2 === 0 ? -0.45 : 0.45, start);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(panner);
    panner.connect(master);

    osc.start(start);
    osc.stop(start + duration + 0.1);
  }

  [6, 16, 26].forEach((start, index) => {
    const baseFreq = [PLANETARY_FREQUENCIES.neptune * 2, PLANETARY_FREQUENCIES.venus * 3, PLANETARY_FREQUENCIES.jupiter * 2][index];

    const fundamental = ctx.createOscillator();
    fundamental.type = "sine";
    fundamental.frequency.setValueAtTime(baseFreq, start);

    const overtone = ctx.createOscillator();
    overtone.type = "sine";
    overtone.frequency.setValueAtTime(baseFreq * 2.756, start);

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0.0001, start);
    gain1.gain.linearRampToValueAtTime(0.022, start + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.0001, start + 3.8);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.0001, start);
    gain2.gain.linearRampToValueAtTime(0.01, start + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.0001, start + 2.2);

    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(index === 1 ? 0.3 : -0.3, start);

    fundamental.connect(gain1);
    overtone.connect(gain2);
    gain1.connect(panner);
    gain2.connect(panner);
    panner.connect(master);

    fundamental.start(start);
    overtone.start(start);
    fundamental.stop(start + 4);
    overtone.stop(start + 2.4);
  });

  const buffer = await ctx.startRendering();

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const data = buffer.getChannelData(channel);
    const fadeSamples = Math.floor(sampleRate * 1.5);

    for (let i = 0; i < fadeSamples; i++) {
      const fadeIn = i / fadeSamples;
      const fadeOut = (fadeSamples - i) / fadeSamples;
      data[i] *= fadeIn;
      data[data.length - 1 - i] *= fadeOut;
    }
  }

  return URL.createObjectURL(audioBufferToWav(buffer));
}

export function CosmicAmbientMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const playAttemptedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const audio = new Audio();
    audio.loop = true;
    audio.volume = OUTPUT_VOLUME;
    audio.preload = "auto";
    audio.setAttribute("playsinline", "true");
    audioRef.current = audio;

    const tryPlay = async () => {
      if (!audioRef.current?.src) return;
      if (audioRef.current.readyState < 3) return;

      try {
        await audioRef.current.play();
        console.log("🎵 Música ambiente iniciada");
      } catch (error) {
        console.warn("🎵 Reprodução bloqueada até interação do usuário", error);
      }
    };

    const handleInteraction = () => {
      playAttemptedRef.current = true;
      void tryPlay();
    };

    const handleCanPlay = () => {
      if (playAttemptedRef.current) {
        void tryPlay();
      }
    };

    const init = async () => {
      const url = await renderCosmicLoop();
      if (!isMounted) {
        URL.revokeObjectURL(url);
        return;
      }

      urlRef.current = url;
      audio.src = url;
      audio.load();
      audio.addEventListener("canplaythrough", handleCanPlay);
      void tryPlay();
    };

    void init();

    window.addEventListener("pointerdown", handleInteraction, { passive: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true });
    window.addEventListener("keydown", handleInteraction);

    return () => {
      isMounted = false;
      audio.removeEventListener("canplaythrough", handleCanPlay);
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      audio.pause();
      audio.src = "";
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
    };
  }, []);

  return null;
}
