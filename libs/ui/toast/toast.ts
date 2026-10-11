import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injectable,
  input,
  PLATFORM_ID,
  signal,
  untracked,
  viewChildren,
} from '@angular/core';
import { iconChildren, LIB_ICONS } from '@loomui/ui/icon';

export type ToastType = 'normal' | 'success' | 'error' | 'info' | 'warning' | 'loading';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick?: () => void;
}

export interface ToastOptions {
  description?: string;
  type?: ToastType;
  /** ms; `Infinity` keeps it until dismissed. */
  duration?: number;
  action?: ToastAction;
  id?: string;
}

export interface ToastItem extends Required<Pick<ToastOptions, 'type'>> {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  action?: ToastAction;
  removed: boolean;
}

let counter = 0;

/**
 * Sonner-style toast API. Inject it anywhere and call `toast.show('Saved', { description })`.
 * Render once: <ui-toaster />.
 */
@Injectable({ providedIn: 'root' })
export class UiToastService {
  readonly toasts = signal<ToastItem[]>([]);

  show(title: string, opts: ToastOptions = {}): string {
    const id = opts.id ?? `ui-toast-${counter++}`;
    const item: ToastItem = {
      id,
      title,
      description: opts.description,
      type: opts.type ?? 'normal',
      duration: opts.duration,
      action: opts.action,
      removed: false,
    };
    this.toasts.update((l) => (l.some((t) => t.id === id) ? l.map((t) => (t.id === id ? item : t)) : [...l, item]));
    return id;
  }
  success(title: string, o: ToastOptions = {}) {
    return this.show(title, { ...o, type: 'success' });
  }
  error(title: string, o: ToastOptions = {}) {
    return this.show(title, { ...o, type: 'error' });
  }
  info(title: string, o: ToastOptions = {}) {
    return this.show(title, { ...o, type: 'info' });
  }
  warning(title: string, o: ToastOptions = {}) {
    return this.show(title, { ...o, type: 'warning' });
  }
  loading(title: string, o: ToastOptions = {}) {
    return this.show(title, { ...o, type: 'loading', duration: o.duration ?? Infinity });
  }

  dismiss(id?: string): void {
    this.toasts.update((l) => l.map((t) => (id === undefined || t.id === id ? { ...t, removed: true } : t)));
    setTimeout(() => this.toasts.update((l) => l.filter((t) => !t.removed)), 250);
  }
}

const ICONS: Record<Exclude<ToastType, 'normal'>, string> = {
  success: iconChildren(LIB_ICONS['CircleCheck']),
  error: iconChildren(LIB_ICONS['OctagonX']),
  info: iconChildren(LIB_ICONS['Info']),
  warning: iconChildren(LIB_ICONS['TriangleAlert']),
  loading: iconChildren(LIB_ICONS['LoaderCircle']),
};

/**
 * Mirrors Sonner's DOM (observed): section[aria-label="Notifications alt+T"] > ol[data-sonner-toaster] >
 * li[data-sonner-toast …] > div[data-content] > div[data-title] + div[data-description], button[data-button][data-action].
 * Behavior: newest toast in front, stack collapses/expands on hover, auto-dismiss (4000ms), Alt+T focuses the region.
 * NOT implemented: swipe-to-dismiss, promise toasts, close button, rich colors (UNKNOWN on live site).
 */
@Component({
  selector: 'ui-toaster',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onDocKeydown($event)',
  },
  template: `
    <section
      #region
      [attr.aria-label]="'Notifications ' + hotkeyLabel"
      tabindex="-1"
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic="false"
    >
      <ol
        class="toaster group"
        data-sonner-toaster="true"
        [attr.data-sonner-theme]="resolvedTheme()"
        [attr.data-y-position]="y()"
        [attr.data-x-position]="x()"
        [attr.dir]="dir()"
        tabindex="-1"
        style="--width: 356px; --gap: 14px; --normal-bg: var(--popover); --normal-text: var(--popover-foreground); --normal-border: var(--border); --border-radius: var(--radius); --offset-top: 24px; --offset-right: 24px; --offset-bottom: 24px; --offset-left: 24px;"
        (pointerenter)="expand()"
        (pointerleave)="collapse()"
        (focusin)="expand()"
        (focusout)="collapse()"
      >
        @for (t of toasts(); track t.id; let i = $index) {
          <li
            #toastEl
            tabindex="0"
            data-sonner-toast=""
            data-styled="true"
            [attr.data-type]="t.type"
            [attr.data-mounted]="mounted().has(t.id)"
            [attr.data-removed]="t.removed"
            [attr.data-visible]="indexOf(i) < visibleToasts()"
            [attr.data-front]="indexOf(i) === 0"
            [attr.data-index]="indexOf(i)"
            [attr.data-y-position]="y()"
            [attr.data-x-position]="x()"
            [attr.data-expanded]="expanded()"
            data-dismissible="true"
            [style.--index]="indexOf(i)"
            [style.--offset.px]="offsets()[indexOf(i)] ?? 0"
            [style.--z-index]="toasts().length - indexOf(i)"
            (keydown.escape)="svc.dismiss(t.id)"
          >
            @if (t.type !== 'normal') {
              <div data-icon="" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [attr.data-spin]="t.type === 'loading'" [innerHTML]="icon(t.type)"></svg>
              </div>
            }
            <div data-content="">
              <div data-title="">{{ t.title }}</div>
              @if (t.description) {
                <div data-description="">{{ t.description }}</div>
              }
            </div>
            @if (t.action) {
              <button data-button="true" data-action="true" type="button" (click)="runAction(t)">{{ t.action.label }}</button>
            }
          </li>
        }
      </ol>
    </section>
  `,
})
export class UiToaster {
  protected readonly svc = inject(UiToastService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly position = input<ToastPosition>('bottom-right');
  readonly visibleToasts = input(3);
  readonly duration = input(4000);
  readonly theme = input<'light' | 'dark' | 'system'>('system');
  readonly hotkeyLabel = 'alt+T';

  protected readonly toasts = this.svc.toasts;
  protected readonly y = computed(() => (this.position().startsWith('top') ? 'top' : 'bottom'));
  protected readonly x = computed(() => this.position().split('-')[1] as 'left' | 'center' | 'right');
  protected readonly expanded = signal(false);
  protected readonly mounted = signal<Set<string>>(new Set());
  protected readonly offsets = signal<number[]>([]);
  protected readonly toastEls = viewChildren<ElementRef<HTMLElement>>('toastEl');
  private readonly region = viewChildren<ElementRef<HTMLElement>>('region');
  private readonly timers = new Map<string, { handle: ReturnType<typeof setTimeout>; started: number; remaining: number }>();

  protected readonly resolvedTheme = computed(() => {
    const t = this.theme();
    if (t !== 'system') return t;
    return isPlatformBrowser(this.platformId) && document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  protected dir(): string {
    return isPlatformBrowser(this.platformId) ? document.documentElement.dir || 'ltr' : 'ltr';
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => this.timers.forEach((t) => clearTimeout(t.handle)));
    let known = new Set<string>();
    effect(() => {
      const list = this.toasts();
      untracked(() => {
        for (const t of list) {
          if (!known.has(t.id)) {
            known.add(t.id);
            if (isPlatformBrowser(this.platformId)) {
              requestAnimationFrame(() => this.mounted.update((s) => new Set(s).add(t.id)));
              this.startTimer(t);
            }
          }
        }
        known = new Set([...known].filter((id) => list.some((t) => t.id === id)));
      });
    });
  }

  protected indexOf(i: number): number {
    return this.toasts().length - 1 - i;
  }

  protected icon(type: ToastType): string {
    return type === 'normal' ? '' : ICONS[type];
  }

  private startTimer(t: ToastItem): void {
    const d = t.duration ?? this.duration();
    if (!isFinite(d)) return;
    this.timers.set(t.id, {
      handle: setTimeout(() => this.svc.dismiss(t.id), d),
      started: Date.now(),
      remaining: d,
    });
  }

  protected expand(): void {
    if (this.expanded()) return;
    this.expanded.set(true);
    // Measure heights for the expanded layout (index 0 = newest).
    const els = this.toastEls().map((e) => e.nativeElement);
    const heights = els.map((el) => el.offsetHeight).reverse();
    const out: number[] = [];
    let acc = 0;
    heights.forEach((h, i) => {
      out[i] = acc;
      acc += h + 14;
    });
    this.offsets.set(out);
    // Pause timers while expanded.
    this.timers.forEach((t, id) => {
      clearTimeout(t.handle);
      t.remaining -= Date.now() - t.started;
      this.timers.set(id, t);
    });
  }

  protected collapse(): void {
    if (!this.expanded()) return;
    this.expanded.set(false);
    this.timers.forEach((t, id) => {
      t.started = Date.now();
      t.handle = setTimeout(() => this.svc.dismiss(id), Math.max(t.remaining, 1000));
    });
  }

  protected runAction(t: ToastItem): void {
    t.action?.onClick?.();
    this.svc.dismiss(t.id);
  }

  protected onDocKeydown(e: KeyboardEvent): void {
    if (e.altKey && e.code === 'KeyT') {
      e.preventDefault();
      this.region()[0]?.nativeElement.focus();
      this.expand();
    }
  }
}
