import { Component, ElementRef, inject, signal } from '@angular/core';
import { UI_AVATAR } from '@loomui-ng/ui/avatar';
import { UiBadge } from '@loomui-ng/ui/badge';
import { UiButton } from '@loomui-ng/ui/button';
import { UI_CARD } from '@loomui-ng/ui/card';
import { UI_INPUT } from '@loomui-ng/ui/input';
import { UiProgress } from '@loomui-ng/ui/progress';
import { UiSwitch } from '@loomui-ng/ui/switch';
import '../icons';

/** The same UI, rendered twice with real components: once forced light, once forced dark. */
@Component({
  selector: 'app-compare-sample',
  imports: [UI_CARD, UI_INPUT, UiButton, UiSwitch, UiBadge, UiProgress, UI_AVATAR],
  template: `
    <div class="mx-auto grid w-full max-w-sm gap-4">
      <ui-card>
        <ui-card-header>
          <ui-card-title>Welcome back</ui-card-title>
          <ui-card-description>Sign in to continue to your workspace.</ui-card-description>
        </ui-card-header>
        <ui-card-content class="grid gap-3">
          <ui-input type="email" placeholder="you@example.com" aria-label="Email" />
          <ui-input type="password" placeholder="Password" aria-label="Password" />
          <label class="flex items-center justify-between text-sm">Remember me <ui-switch [checked]="true" aria-label="Remember me" /></label>
        </ui-card-content>
        <ui-card-footer class="gap-2">
          <ui-button class="flex-1">Sign in</ui-button>
          <ui-button variant="outline" class="flex-1">Cancel</ui-button>
        </ui-card-footer>
      </ui-card>
      <div class="flex items-center gap-3 rounded-xl border bg-card p-3 text-card-foreground">
        <ui-avatar><ui-avatar-fallback>HK</ui-avatar-fallback></ui-avatar>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 text-sm font-medium">Storage <ui-badge variant="secondary">Pro</ui-badge></div>
          <ui-progress [value]="72" class="mt-2" />
        </div>
      </div>
    </div>
  `,
})
export class CompareSample {}

/** Drag the handle (or use the arrow keys) to reveal the dark theme over the light one. */
@Component({
  selector: 'app-compare-slider',
  imports: [CompareSample],
  template: `
    <div
      dir="ltr"
      class="relative cursor-ew-resize touch-none overflow-hidden rounded-2xl border select-none"
      role="group"
      aria-label="Light and dark theme comparison"
      (pointerdown)="down($event)"
      (pointermove)="move($event)"
      (pointerup)="up($event)"
      (pointercancel)="up($event)"
    >
      <div class="force-light bg-background p-6 text-foreground md:p-10" inert aria-hidden="true">
        <app-compare-sample />
      </div>
      <div class="dark absolute inset-0 bg-background p-6 text-foreground md:p-10" [style.clip-path]="'inset(0 0 0 ' + pos() + '%)'" inert aria-hidden="true">
        <app-compare-sample />
      </div>

      <span class="pointer-events-none absolute start-4 top-4 rounded-full border bg-background/80 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur force-light">Light</span>
      <span class="pointer-events-none absolute end-4 top-4 rounded-full border bg-background/80 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur dark">Dark</span>

      <div class="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-primary" [style.left.%]="pos()"></div>
      <button
        type="button"
        role="slider"
        class="absolute top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border-2 border-primary bg-background text-primary shadow-lg transition-transform outline-none hover:scale-110 focus-visible:ring-4 focus-visible:ring-ring/40"
        [style.left.%]="pos()"
        aria-label="Theme comparison position"
        aria-valuemin="0"
        aria-valuemax="100"
        [attr.aria-valuenow]="pos()"
        [attr.aria-valuetext]="pos() + '% light'"
        (keydown)="key($event)"
      >
        <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 7-5 5 5 5M15 7l5 5-5 5" /></svg>
      </button>
    </div>
  `,
})
export class CompareSlider {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly pos = signal(50);
  private dragging = false;

  private set(e: PointerEvent): void {
    const r = this.el.firstElementChild!.getBoundingClientRect();
    this.pos.set(Math.round(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100))));
  }
  down(e: PointerEvent): void {
    this.dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.set(e);
  }
  move(e: PointerEvent): void {
    if (this.dragging) this.set(e);
  }
  up(e: PointerEvent): void {
    this.dragging = false;
    const t = e.currentTarget as HTMLElement;
    if (t.hasPointerCapture(e.pointerId)) t.releasePointerCapture(e.pointerId);
  }
  key(e: KeyboardEvent): void {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') this.pos.update((p) => Math.max(0, p - step));
    else if (e.key === 'ArrowRight') this.pos.update((p) => Math.min(100, p + step));
    else if (e.key === 'Home') this.pos.set(0);
    else if (e.key === 'End') this.pos.set(100);
    else return;
    e.preventDefault();
  }
}
