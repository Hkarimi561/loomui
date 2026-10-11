import { Injectable, signal } from '@angular/core';

export interface Accent {
  id: string;
  label: string;
  color: string;
}

const ACCENTS: Accent[] = [
  { id: 'zinc', label: 'Zinc', color: 'oklch(0.3 0 0)' },
  { id: 'blue', label: 'Blue', color: 'oklch(0.546 0.245 262.881)' },
  { id: 'violet', label: 'Violet', color: 'oklch(0.541 0.281 293.009)' },
  { id: 'rose', label: 'Rose', color: 'oklch(0.586 0.253 17.585)' },
  { id: 'orange', label: 'Orange', color: 'oklch(0.646 0.222 41.116)' },
  { id: 'green', label: 'Green', color: 'oklch(0.627 0.194 149.214)' },
];

const read = (k: string): string | null => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

/** Theme, accent, direction and palette state shared by the shell, the landing page and the palette. */
@Injectable({ providedIn: 'root' })
export class AppState {
  readonly accents = ACCENTS;
  readonly dark = signal(false);
  readonly rtl = signal(false);
  readonly accent = signal('zinc');
  readonly palette = signal(false);

  constructor() {
    const t = read('loom-theme');
    const prefersDark = typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyDark(t ? t === 'dark' : prefersDark);
    const a = read('loom-accent');
    this.applyAccent(ACCENTS.some((x) => x.id === a) ? a! : 'zinc');
    const d = read('loom-dir') === 'rtl';
    this.rtl.set(d);
    document.documentElement.dir = d ? 'rtl' : 'ltr';
    // keep embedded preview iframes (same origin) in sync with the parent page
    window.addEventListener('storage', (e) => {
      if (e.key === 'loom-theme') this.applyDark(e.newValue === 'dark');
      if (e.key === 'loom-accent') this.applyAccent(e.newValue ?? 'zinc');
      if (e.key === 'loom-dir') {
        this.rtl.set(e.newValue === 'rtl');
        document.documentElement.dir = e.newValue === 'rtl' ? 'rtl' : 'ltr';
      }
    });
  }

  swatch(id: string): string {
    return ACCENTS.find((a) => a.id === id)?.color ?? 'currentColor';
  }

  private applyDark(v: boolean) {
    this.dark.set(v);
    document.documentElement.classList.toggle('dark', v);
    document.documentElement.style.colorScheme = v ? 'dark' : 'light';
  }

  private applyAccent(id: string) {
    this.accent.set(id);
    const cl = document.documentElement.classList;
    for (const a of ACCENTS) cl.remove('theme-' + a.id);
    if (id !== 'zinc') cl.add('theme-' + id);
  }

  setAccent(id: string) {
    this.applyAccent(id);
    write('loom-accent', id);
  }

  /** Runs a DOM change inside a View Transition (circular reveal for theme, slide for direction); falls back to a CSS fade. */
  private animate(kind: 'theme' | 'dir', e: Event | undefined, change: () => void) {
    const root = document.documentElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return change();
    const r = (e?.currentTarget as HTMLElement | null)?.getBoundingClientRect();
    const x = r ? r.left + r.width / 2 : innerWidth / 2;
    const y = r ? r.top + r.height / 2 : 0;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.style.setProperty('--vt-x', x + 'px');
    root.style.setProperty('--vt-y', y + 'px');
    root.style.setProperty('--vt-r', radius + 'px');
    root.dataset['vt'] = kind;
    const done = () => delete root.dataset['vt'];
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (doc.startViewTransition) {
      doc.startViewTransition(change).finished.finally(done);
    } else {
      root.classList.add('vt-fallback');
      change();
      setTimeout(() => {
        root.classList.remove('vt-fallback');
        done();
      }, 450);
    }
  }

  toggleDark(e?: Event) {
    const next = !this.dark();
    this.animate('theme', e, () => this.applyDark(next));
    write('loom-theme', next ? 'dark' : 'light');
  }

  toggleRtl(e?: Event) {
    const next = !this.rtl();
    this.animate('dir', e, () => {
      this.rtl.set(next);
      document.documentElement.dir = next ? 'rtl' : 'ltr';
    });
    write('loom-dir', next ? 'rtl' : 'ltr');
  }
}
