import { useCallback, useRef } from "react";

// Tiny Web Audio API sound synthesizer - no external deps needed
const ctx = () => {
  if (!(window as any).__sfxCtx) {
    (window as any).__sfxCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return (window as any).__sfxCtx as AudioContext;
};

const playTone = (freq: number, duration: number, type: OscillatorType = "sine", vol = 0.15) => {
  try {
    const c = ctx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, c.currentTime);
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    o.connect(g).connect(c.destination);
    o.start();
    o.stop(c.currentTime + duration);
  } catch {}
};

const sfx = {
  click: () => {
    playTone(800, 0.08, "square", 0.08);
    playTone(1200, 0.06, "sine", 0.06);
  },
  pop: () => {
    playTone(400, 0.12, "sine", 0.15);
    setTimeout(() => playTone(600, 0.08, "sine", 0.1), 30);
  },
  chime: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => playTone(f, 0.3, "sine", 0.1), i * 80)
    );
  },
  spin: () => {
    let i = 0;
    const id = setInterval(() => {
      playTone(300 + i * 40, 0.06, "square", 0.06);
      i++;
      if (i > 15) clearInterval(id);
    }, 80);
  },
  reward: () => {
    [523, 659, 784, 1047, 1318].forEach((f, i) =>
      setTimeout(() => playTone(f, 0.4, "triangle", 0.12), i * 100)
    );
  },
  tap: () => {
    playTone(200 + Math.random() * 400, 0.05, "sine", 0.1);
  },
  success: () => {
    [440, 554, 659, 880].forEach((f, i) =>
      setTimeout(() => playTone(f, 0.25, "sine", 0.12), i * 120)
    );
  },
  heartbeat: () => {
    playTone(60, 0.15, "sine", 0.2);
    setTimeout(() => playTone(50, 0.2, "sine", 0.15), 150);
  },
  whoosh: () => {
    try {
      const c = ctx();
      const bufferSize = c.sampleRate * 0.15;
      const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      const src = c.createBufferSource();
      const g = c.createGain();
      const f = c.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.setValueAtTime(1000, c.currentTime);
      f.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.15);
      g.gain.setValueAtTime(0.08, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
      src.buffer = buffer;
      src.connect(f).connect(g).connect(c.destination);
      src.start();
    } catch {}
  },
};

export type SfxName = keyof typeof sfx;

export const useSfx = () => {
  const enabled = useRef(true);

  const play = useCallback((name: SfxName) => {
    if (enabled.current) sfx[name]();
  }, []);

  return { play };
};

export default useSfx;
