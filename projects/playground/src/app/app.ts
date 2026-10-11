import { isEmbedLocation } from './embed-url';
import { afterNextRender, Component, DestroyRef, effect, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { UiButton } from '@loomui-ng/ui/button';
import { UI_DROPDOWN_MENU } from '@loomui-ng/ui/dropdown-menu';
import { UiToaster } from '@loomui-ng/ui/toast';
import './icons';
import { UiIcon } from '@loomui-ng/ui/icon';
import { AppState } from './app-state';
import { SoundService } from './sound';
import { UiToastService } from '@loomui-ng/ui/toast';
import { Palette } from './palette';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UiButton, UiToaster, Palette, UI_DROPDOWN_MENU, UiIcon],
  template: `
    @if (!embed()) {
      <a
        href="#main"
        class="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >Skip to content</a
      >
      <div class="h-14" aria-hidden="true"></div>
      <header
        class="fixed inset-x-0 top-0 z-40 border-b bg-background/75 backdrop-blur-md transition-shadow duration-300 supports-[backdrop-filter]:bg-background/60"
        [class.shadow-md]="scrolled()"
      >
        <div class="mx-auto flex max-w-7xl items-center gap-2 px-4 transition-[height] duration-300" [class]="scrolled() ? 'h-12' : 'h-14'">
          <a routerLink="/" class="me-4 flex items-center gap-2.5 font-semibold tracking-tight">
            <img src="logo-mark.svg" alt="" aria-hidden="true" class="rounded-lg shadow-sm transition-all duration-300" [class]="scrolled() ? 'size-6' : 'size-7'" />
            Loom UI
          </a>

          <nav aria-label="Main" class="hidden items-center gap-1 md:flex">
            <a routerLink="/" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="!text-foreground bg-muted" class="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">Home</a>
            <a routerLink="/components" routerLinkActive="!text-foreground bg-muted" class="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">Components</a>
            <a routerLink="/elements" routerLinkActive="!text-foreground bg-muted" class="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">Elements</a>
            <a routerLink="/themes" routerLinkActive="!text-foreground bg-muted" class="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">Themes</a>
            <a routerLink="/icons" routerLinkActive="!text-foreground bg-muted" class="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">Icons</a>
          </nav>

          <div class="ms-auto flex items-center gap-1.5">
            <button
              type="button"
              (click)="state.palette.set(true)"
              class="me-1 hidden h-8 w-56 items-center gap-2 rounded-lg border bg-muted/40 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:flex"
              aria-label="Search components (Control K)"
            >
              <ui-icon name="search" class="size-3.5" />
              <span class="flex-1 text-start">Search…</span>
              <kbd class="rounded border bg-background px-1.5 font-mono text-[10px]">{{ mod }}K</kbd>
            </button>
            <button uiButton variant="ghost" size="icon" class="sm:hidden" aria-label="Search components" (click)="state.palette.set(true)">
              <ui-icon name="search" class="size-3.5" />
            </button>
            <div uiDropdownMenu class="contents">
              <button uiButton variant="ghost" size="icon" uiDropdownMenuTrigger aria-label="Accent color" title="Accent color">
                <span class="size-4 rounded-full ring-2 ring-border" [style.background]="state.swatch(state.accent())"></span>
              </button>
              <div uiDropdownMenuContent align="end" class="w-40">
                <div uiDropdownMenuLabel>Accent color</div>
                <div uiDropdownMenuRadioGroup [value]="state.accent()" (valueChange)="state.setAccent($event ?? 'zinc')">
                  @for (a of state.accents; track a.id) {
                    <div uiDropdownMenuRadioItem [value]="a.id" (select)="$event.preventDefault()">
                      <span class="me-2 inline-block size-3 rounded-full" [style.background]="a.color"></span>{{ a.label }}
                    </div>
                  }
                </div>
              </div>
            </div>
            <button uiButton variant="ghost" size="icon" (click)="sound.toggle()" [attr.aria-pressed]="sound.enabled()" [attr.aria-label]="sound.enabled() ? 'Turn sounds off' : 'Turn sounds on'" [title]="sound.enabled() ? 'Sounds on' : 'Sounds off (UI sounds and haptics)'">
              <ui-icon [name]="sound.enabled() ? 'volume-2' : 'volume-x'" class="size-4" />
            </button>
            <button uiButton variant="ghost" size="icon" (click)="state.toggleRtl($event)" [attr.aria-pressed]="state.rtl()" [attr.aria-label]="state.rtl() ? 'Switch to left-to-right' : 'Switch to right-to-left'" title="Toggle RTL">
              <ui-icon [name]="state.rtl() ? 'pilcrow-left' : 'pilcrow-right'" class="size-4" />
            </button>
            <button uiButton variant="ghost" size="icon" (click)="state.toggleDark($event)" [attr.aria-pressed]="state.dark()" [attr.aria-label]="state.dark() ? 'Switch to light mode' : 'Switch to dark mode'" title="Toggle theme">
              <ui-icon [name]="state.dark() ? 'sun' : 'moon'" class="size-4" />
            </button>
            <button
              uiButton
              variant="ghost"
              size="icon"
              class="md:hidden"
              aria-label="Toggle menu"
              aria-controls="mobile-menu"
              [attr.aria-expanded]="menuOpen()"
              (click)="menuOpen.set(!menuOpen())"
            >
              <ui-icon [name]="menuOpen() ? 'x' : 'menu'" class="size-4" />
            </button>
          </div>
        </div>

        <div #bar class="scroll-progress pointer-events-none absolute inset-x-0 bottom-[-1px] h-0.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400" aria-hidden="true"></div>

        @if (menuOpen()) {
          <nav id="mobile-menu" aria-label="Mobile" class="rise flex flex-col border-t p-2 md:hidden">
            <a routerLink="/" class="rounded-md px-3 py-2 text-sm hover:bg-muted">Home</a>
            <a routerLink="/components" class="rounded-md px-3 py-2 text-sm hover:bg-muted">Components</a>
            <a routerLink="/elements" class="rounded-md px-3 py-2 text-sm hover:bg-muted">Elements</a>
            <a routerLink="/themes" class="rounded-md px-3 py-2 text-sm hover:bg-muted">Themes</a>
            <a routerLink="/icons" class="rounded-md px-3 py-2 text-sm hover:bg-muted">Icons</a>
          </nav>
        }
      </header>
    }

    <div id="main"><router-outlet /></div>
    <ui-toaster />
    @if (!embed()) {
      <app-palette [(open)]="state.palette" />
    }
  `,
})
export class App {
  protected readonly state = inject(AppState);
  protected readonly sound = inject(SoundService);
  private readonly toasts = inject(UiToastService);
  private readonly router = inject(Router);
  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);
  readonly mod = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl ';

  /** `/embed/<slug>` renders a bare demo (used by the resizable preview iframe). */
  readonly embed = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects.startsWith('/embed/')),
      startWith(typeof location !== 'undefined' && isEmbedLocation()),
    ),
    { initialValue: false },
  );

  private readonly bar = viewChild<ElementRef<HTMLElement>>('bar');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Sound cues: toasts appearing, plus delegated clicks on switches/checkboxes/tabs/buttons (all no-ops while sound is off).
    let seen = this.toasts.toasts().length;
    effect(() => {
      const list = this.toasts.toasts();
      if (list.length > seen) {
        const last = list[list.length - 1];
        this.sound.play(last.type === 'error' ? 'error' : last.type === 'success' ? 'success' : 'pop');
      }
      seen = list.length;
    });
    afterNextRender(() => {
      const onClick = (e: MouseEvent) => {
        if (!this.sound.enabled()) return;
        const t = e.target as HTMLElement | null;
        const el = t?.closest<HTMLElement>('[role=switch],[role=checkbox],[role=radio],[role=tab],[data-slot=button],[data-slot=toggle]');
        if (!el || el.hasAttribute('disabled')) return;
        const role = el.getAttribute('role');
        if (role === 'switch' || role === 'checkbox') this.sound.play(el.getAttribute('aria-checked') === 'true' ? 'off' : 'on');
        else if (role === 'radio' || role === 'tab') this.sound.play('tick');
        else this.sound.play('pop');
      };
      document.addEventListener('click', onClick, true);
      this.destroyRef.onDestroy(() => document.removeEventListener('click', onClick, true));
    });
    // Scroll work is rAF-throttled and passive: no change detection per event, no CSS variable on <html>
    // (that restyles the whole document), just one transform on the progress bar and a signal that flips at a threshold.
    afterNextRender(() => {
      let raf = 0;
      const update = () => {
        raf = 0;
        const y = window.scrollY;
        this.scrolled.set(y > 24);
        const bar = this.bar()?.nativeElement;
        if (bar) {
          const max = document.documentElement.scrollHeight - innerHeight;
          bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ')';
        }
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(update);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        if (raf) cancelAnimationFrame(raf);
      });
    });
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.menuOpen.set(false);
      if (!this.embed()) window.scrollTo({ top: 0 });
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey) && !this.embed()) {
      e.preventDefault();
      this.state.palette.update((v) => !v);
    }
  }
}
