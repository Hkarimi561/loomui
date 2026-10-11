import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { DomPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import {
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  untracked,
} from '@angular/core';
import { UiLayerRoot } from './layer';
import { hideOthers } from './overlay-helpers';

/**
 * Shared engine for Dialog and Sheet (Radix Dialog equivalent); state lives in UiLayerRoot.
 * Contract (see docs/behavior-specs/dialog.md): portal to <body>, overlay + content as siblings, focus trap,
 * first tabbable focused on open, focus restored to the trigger on close, Esc / overlay click dismiss,
 * aria-hidden on everything else, body scroll lock, content stays mounted with data-state="closed"
 * until the exit animation finishes.
 */
@Directive()
export abstract class UiModalRoot extends UiLayerRoot {
  readonly titleId = `${this.id}H1`;
  readonly descriptionId = `${this.id}H2`;
}

export interface ModalContentConfig {
  slot: string;
  backdropClass: string;
  /** false for Alert Dialog: clicking the overlay does not dismiss. Default true. */
  closeOnBackdrop?: boolean;
  /** CSS selector of the element to focus on open (Alert Dialog focuses Cancel). Default: first tabbable. */
  initialFocusSelector?: string;
}

/** Base for the content directive: moves the host element into a CDK overlay while mounted. */
@Directive()
export abstract class UiModalContentBase {
  protected abstract readonly root: UiModalRoot;
  protected abstract readonly config: ModalContentConfig;

  protected readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly overlay = inject(Overlay);
  private readonly trapFactory = inject(FocusTrapFactory);
  private readonly injector = inject(Injector);
  private overlayRef: OverlayRef | null = null;
  private trap: FocusTrap | null = null;
  private restoreAria: (() => void) | null = null;
  private lastActive: HTMLElement | null = null;
  readonly userClass = input<string>('', { alias: 'class' });

  protected init(): void {
    this.el.hidden = true;
    this.root.contentEl.set(this.el);
    effect(
      () => {
        const mounted = this.root.mounted();
        untracked(() => (mounted ? this.attach() : this.detach()));
      },
      { injector: this.injector },
    );
    effect(
      () => {
        const state = this.root.state();
        this.overlayRef?.backdropElement?.setAttribute('data-state', state);
      },
      { injector: this.injector },
    );
    inject(DestroyRef).onDestroy(() => this.detach(false));
  }

  private attach(): void {
    if (this.overlayRef) return;
    this.lastActive = document.activeElement as HTMLElement | null;
    const ref = this.overlay.create({
      hasBackdrop: true,
      backdropClass: this.config.backdropClass.split(/\s+/).filter(Boolean),
      positionStrategy: this.overlay.position().global(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });
    this.overlayRef = ref;
    ref.attach(new DomPortal(this.el));
    this.el.hidden = false;

    const backdrop = ref.backdropElement;
    backdrop?.setAttribute('data-slot', `${this.config.slot}-overlay`);
    backdrop?.setAttribute('data-state', 'open');
    backdrop?.setAttribute('aria-hidden', 'true');
    backdrop?.setAttribute('data-aria-hidden', 'true');

    ref.keydownEvents().subscribe((e) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        e.preventDefault();
        this.root.close();
      }
    });
    if (this.config.closeOnBackdrop !== false) ref.backdropClick().subscribe(() => this.root.close());

    const container = ref.hostElement.parentElement as Element;
    this.restoreAria = hideOthers(container);
    document.body.setAttribute('data-scroll-locked', '1');

    this.trap = this.trapFactory.create(this.el);
    const preferred = this.config.initialFocusSelector ? this.el.querySelector<HTMLElement>(this.config.initialFocusSelector) : null;
    if (preferred) queueMicrotask(() => preferred.focus());
    else
      void this.trap.focusInitialElementWhenReady().then((ok) => {
        if (!ok) this.el.focus();
      });
  }

  private detach(restoreFocus = true): void {
    if (!this.overlayRef) return;
    this.trap?.destroy();
    this.trap = null;
    this.overlayRef.dispose();
    this.overlayRef = null;
    this.el.hidden = true;
    this.restoreAria?.();
    this.restoreAria = null;
    document.body.removeAttribute('data-scroll-locked');
    if (restoreFocus) (this.root.trigger() ?? this.lastActive)?.focus();
  }
}
