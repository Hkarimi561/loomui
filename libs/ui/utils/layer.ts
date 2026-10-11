import { Directive, effect, model, signal, untracked } from '@angular/core';
import { nextId, whenAnimationDone } from './overlay-helpers';

/**
 * State holder shared by every overlay root (Dialog, Sheet, Popover, DropdownMenu, Select, Tooltip).
 * `open` is the source of truth; `mounted` stays true until the exit animation finishes so the content can
 * play tw-animate-css `animate-out` with data-state="closed" (observed on the live site).
 */
@Directive()
export abstract class UiLayerRoot {
  readonly open = model(false);
  readonly id = nextId('ui-layer');
  readonly mounted = signal(false);
  readonly state = signal<'open' | 'closed'>('closed');
  readonly trigger = signal<HTMLElement | null>(null);
  readonly contentEl = signal<HTMLElement | null>(null);
  /** Virtual anchor (context menus open at the pointer instead of a trigger element). */
  readonly anchorPoint = signal<{ x: number; y: number } | null>(null);
  /** Panes of nested layers (sub-menus): clicks inside them are not "outside" for this layer. */
  readonly childPanes = new Set<HTMLElement>();

  constructor() {
    effect(() => {
      const open = this.open();
      untracked(() => {
        if (open) {
          this.mounted.set(true);
          this.state.set('open');
        } else if (this.mounted()) {
          this.state.set('closed');
          void whenAnimationDone(this.contentEl()).then(() => {
            if (!this.open()) this.mounted.set(false);
          });
        }
      });
    });
  }

  toggle(): void {
    this.open.update((v) => !v);
  }
  close(): void {
    this.open.set(false);
  }
}
