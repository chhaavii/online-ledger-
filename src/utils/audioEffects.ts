// Web Audio API retro video game sound synthesizer
// #made by chhavi :)

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function toggleSound(enabled?: boolean): boolean {
  if (typeof enabled === "boolean") {
    soundEnabled = enabled;
  } else {
    soundEnabled = !soundEnabled;
  }
  return soundEnabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (!soundEnabled) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Retro Arcade Insert Card Sound
export function playCardInsertSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.3);
}

// Receipt Printer Sound (Chirp / Buzz / Feed)
export function playPrintReceiptSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  for (let i = 0; i < 4; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(600 + i * 150, now + i * 0.08);

    gain.gain.setValueAtTime(0.1, now + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.06);
  }
}

// Coin / Success Chime (2-Tone Success)
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Note 1
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(523.25, now); // C5
  gain1.gain.setValueAtTime(0.2, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.15);

  // Note 2
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(659.25, now + 0.1); // E5
  gain2.gain.setValueAtTime(0.25, now + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.1);
  osc2.stop(now + 0.35);
}

// Click sound
export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

// Paper Tear / Rip sound
export function playPaperTearSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // White noise burst for paper friction/ripping
  const bufferSize = ctx.sampleRate * 0.15; // 150ms noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1200, now);
  filter.frequency.exponentialRampToValueAtTime(3000, now + 0.15);
  filter.Q.value = 3;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.15);
}
