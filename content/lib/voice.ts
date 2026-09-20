/**
 * Voix et sons d'interface de Radia — synthétisés, jamais échantillonnés.
 *
 * La parole suit le procédé des jeux où chaque lettre déclenche une syllabe :
 * un bip très court par caractère, dont la hauteur dépend de la lettre, ce qui
 * donne l'illusion d'une élocution. Les sons de menu — validation, fermeture —
 * sont des accords brillants à attaque rapide, dans l'esprit des interfaces de
 * jeu portables. Tout est produit par l'API Web Audio à l'exécution : aucun
 * fichier, aucun son sous licence.
 */

const MUTE_KEY = "souss-mute";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let muted = false;
let restored = false;

/** Lit le réglage enregistré. Sûr côté serveur et en navigation privée. */
export function isMuted(): boolean {
  if (!restored && typeof window !== "undefined") {
    restored = true;
    try {
      muted = localStorage.getItem(MUTE_KEY) === "1";
    } catch {
      muted = false;
    }
  }
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  restored = true;
  try {
    localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    // Stockage bloqué : le réglage vaut pour cette page seulement.
  }
}

/**
 * Ouvre le contexte audio. À appeler depuis un geste de l'utilisateur : les
 * navigateurs refusent le son autrement.
 */
function audio(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === "undefined") return null;

  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;

    try {
      ctx = new Ctor();
    } catch {
      return null;
    }

    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);

    // Un souffle court, réutilisé pour le « swish » des sons de menu.
    const frames = Math.floor(ctx.sampleRate * 0.2);
    noise = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
  }

  if (ctx.state === "suspended") void ctx.resume();
  return master ? { ctx, master } : null;
}

/** Réveille le contexte audio pendant un geste utilisateur. */
export function primeAudio(): void {
  audio();
}

type Tone = {
  freq: number;
  glide?: number;
  type?: OscillatorType;
  gain?: number;
  attack?: number;
  decay?: number;
  delay?: number;
};

function tone(spec: Tone): void {
  const a = audio();
  if (!a || isMuted()) return;

  const now = a.ctx.currentTime + (spec.delay ?? 0);
  const osc = a.ctx.createOscillator();
  osc.type = spec.type ?? "triangle";
  osc.frequency.setValueAtTime(spec.freq, now);
  if (spec.glide) {
    osc.frequency.exponentialRampToValueAtTime(spec.glide, now + 0.09);
  }

  const gain = a.ctx.createGain();
  const peak = spec.gain ?? 0.1;
  const decay = spec.decay ?? 0.22;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + (spec.attack ?? 0.006));
  gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

  osc.connect(gain);
  gain.connect(a.master);
  osc.start(now);
  osc.stop(now + decay + 0.02);
}

function swish(peak = 0.05, decay = 0.13, freq = 3200): void {
  const a = audio();
  if (!a || isMuted() || !noise) return;

  const now = a.ctx.currentTime;
  const src = a.ctx.createBufferSource();
  src.buffer = noise;

  const band = a.ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.setValueAtTime(freq, now);
  band.frequency.exponentialRampToValueAtTime(freq * 0.45, now + decay);
  band.Q.value = 1.1;

  const gain = a.ctx.createGain();
  gain.gain.setValueAtTime(peak, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

  src.connect(band);
  band.connect(gain);
  gain.connect(a.master);
  src.start(now);
  src.stop(now + decay + 0.02);
}

/** Une lettre prononcée. */
export function say(char: string): void {
  const a = audio();
  if (!a || isMuted()) return;

  const code = char.toLowerCase().charCodeAt(0);
  if (Number.isNaN(code)) return;

  const now = a.ctx.currentTime;
  const step = code % 14;
  const base = 260 + step * 34;

  const osc = a.ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(base * 1.9, now);
  osc.frequency.exponentialRampToValueAtTime(base * 1.25, now + 0.055);

  // Le filtre arrondit le carré : on passe du bip à la voyelle.
  const formant = a.ctx.createBiquadFilter();
  formant.type = "bandpass";
  formant.frequency.value = 780 + step * 45;
  formant.Q.value = 1.4;

  const gain = a.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

  osc.connect(formant);
  formant.connect(gain);
  gain.connect(a.master);
  osc.start(now);
  osc.stop(now + 0.09);
}

/** Carillon d'allumage. */
export function chime(): void {
  [392.0, 523.25, 659.25, 783.99].forEach((freq, i) => {
    tone({
      freq,
      type: "triangle",
      gain: 0.12,
      attack: 0.05,
      decay: 1.5,
      delay: 0.05 + i * 0.17,
    });
    tone({
      freq: freq / 2,
      type: "sine",
      gain: 0.07,
      attack: 0.05,
      decay: 1.5,
      delay: 0.05 + i * 0.17,
    });
  });
}

/** Coup de touche. */
export function key(): void {
  tone({ freq: 1500, glide: 900, type: "triangle", gain: 0.05, decay: 0.04 });
}

/** La bulle s'ouvre. */
export function open(): void {
  tone({ freq: 660, glide: 990, gain: 0.09, decay: 0.16 });
  swish(0.04, 0.12, 2600);
}

/**
 * On valide et on passe à la bulle suivante : deux notes claires, une quinte,
 * avec une montée rapide et un souffle bref. C'est le son de menu qu'on
 * entend dans les jeux de combat portables.
 */
export function advance(): void {
  tone({ freq: 1046.5, glide: 1568, gain: 0.1, decay: 0.2 });
  tone({ freq: 1568, type: "sine", gain: 0.07, decay: 0.24, delay: 0.02 });
  tone({ freq: 2093, type: "sine", gain: 0.035, decay: 0.3, delay: 0.04 });
  swish(0.055, 0.14, 3400);
}

/** On ferme : le même accord, mais qui redescend. */
export function dismiss(): void {
  tone({ freq: 1046.5, glide: 698.46, gain: 0.09, decay: 0.2 });
  tone({ freq: 698.46, type: "sine", gain: 0.06, decay: 0.26, delay: 0.03 });
  swish(0.04, 0.16, 2200);
}
