import { Injectable, signal } from '@angular/core';

export type Cue = 'tick' | 'pop' | 'on' | 'off' | 'success' | 'error';

const read = (): boolean => {
  try {
    return localStorage.getItem('loom-sound') === 'on';
  } catch {
    return false;
  }
};

/**
 * Subtle UI sounds (Web Audio, no files) and haptics (`navigator.vibrate`). Off by default; the choice is remembered.
 * Short, quiet envelopes — it should feel like a keyboard click, not a game.
 */
@Injectable({ providedIn: 'root' })
export class SoundService {
  readonly enabled = signal(read());
  private ctx: AudioContext | null = null;

  toggle(): void {
    const next = !this.enabled();
    this.enabled.set(next);
    try {
      localStorage.setItem('loom-sound', next ? 'on' : 'off');
    } catch {}
    if (next) this.play('on');
  }

  play(cue: Cue): void {
    if (!this.enabled() || typeof AudioContext === 'undefined') return;
    const ctx = (this.ctx ??= new AudioContext());
    if (ctx.state === 'suspended') void ctx.resume();
    const t = ctx.currentTime;
    const note = (freq: number, start: number, dur: number, type: OscillatorType, gain: number, to?: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t + start);
      if (to) osc.frequency.exponentialRampToValueAtTime(to, t + start + dur);
      g.gain.setValueAtTime(0.0001, t + start);
      g.gain.exponentialRampToValueAtTime(gain, t + start + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t + start);
      osc.stop(t + start + dur + 0.02);
    };
    switch (cue) {
      case 'tick':
        note(1100, 0, 0.035, 'triangle', 0.035);
        this.buzz(6);
        break;
      case 'pop':
        note(520, 0, 0.09, 'sine', 0.05, 900);
        this.buzz(8);
        break;
      case 'on':
        note(660, 0, 0.08, 'sine', 0.05);
        note(990, 0.07, 0.12, 'sine', 0.05);
        this.buzz([8, 30, 8]);
        break;
      case 'off':
        note(660, 0, 0.08, 'sine', 0.04, 440);
        this.buzz(6);
        break;
      case 'success':
        note(659, 0, 0.1, 'sine', 0.05);
        note(880, 0.09, 0.1, 'sine', 0.05);
        note(1319, 0.18, 0.18, 'sine', 0.045);
        this.buzz([10, 40, 10]);
        break;
      case 'error':
        note(220, 0, 0.16, 'sawtooth', 0.03, 150);
        this.buzz([20, 40, 20]);
        break;
    }
  }

  private buzz(pattern: number | number[]): void {
    try {
      navigator.vibrate?.(pattern);
    } catch {}
  }
}
