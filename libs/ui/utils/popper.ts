import { Directionality } from '@angular/cdk/bidi';
import {
  ConnectedPosition,
  ConnectedOverlayPositionChange,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { DestroyRef, Directive, effect, ElementRef, inject, Injector, input, untracked } from '@angular/core';
import { UiLayerRoot } from './layer';

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

interface Meta {
  side: Side;
  align: Align;
}

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/** Preferred placement first, then the opposite side as a flip fallback (what Radix/floating-ui do). */
export function buildPositions(
  side: Side,
  align: Align,
  sideOffset: number,
  rtl: boolean,
): { positions: ConnectedPosition[]; meta: WeakMap<ConnectedPosition, Meta> } {
  const meta = new WeakMap<ConnectedPosition, Meta>();
  const make = (s: Side): ConnectedPosition => {
    let p: ConnectedPosition;
    const xAlign = align === 'center' ? 'center' : align; // logical start/end (flips with dir like floating-ui)
    if (s === 'bottom' || s === 'top') {
      p = {
        originX: xAlign,
        originY: s === 'bottom' ? 'bottom' : 'top',
        overlayX: xAlign,
        overlayY: s === 'bottom' ? 'top' : 'bottom',
        offsetY: s === 'bottom' ? sideOffset : -sideOffset,
      };
    } else {
      const yAlign = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
      // physical left/right regardless of direction
      const outerX = (s === 'right') !== rtl ? 'end' : 'start';
      const innerX = outerX === 'end' ? 'start' : 'end';
      p = {
        originX: outerX,
        originY: yAlign,
        overlayX: innerX,
        overlayY: yAlign,
        offsetX: s === 'right' ? sideOffset : -sideOffset,
      };
    }
    meta.set(p, { side: s, align });
    return p;
  };
  return { positions: [make(side), make(OPPOSITE[side])], meta };
}

function transformOrigin(side: Side, align: Align): string {
  const x = align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
  const y = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
  if (side === 'bottom') return `${x} top`;
  if (side === 'top') return `${x} bottom`;
  if (side === 'right') return `left ${y}`;
  return `right ${y}`;
}

/**
 * Base for popper-based content (Popover, DropdownMenu, Select, Tooltip). The host element is declared inline,
 * hidden, and moved into a CDK connected overlay (DomPortal) while `root.mounted()`.
 */
@Directive()
export abstract class UiPopperContentBase {
  protected abstract readonly root: UiLayerRoot;
  /** CSS custom-property prefix used by shadcn classes, e.g. `--radix-popover`. */
  protected abstract readonly varPrefix: string;

  readonly side = input<Side>('bottom');
  readonly align = input<Align>('center');
  readonly sideOffset = input(4);
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly overlay = inject(Overlay);
  protected readonly dir = inject(Directionality);
  protected readonly injector = inject(Injector);
  protected overlayRef: OverlayRef | null = null;
  private lastActive: HTMLElement | null = null;

  /** Hook for subclasses. Return false to skip default focus handling. */
  protected onAttached(): void {}
  protected onDetached(): void {}
  /** Whether outside pointer / Esc should close. Tooltip overrides to false. */
  protected closeOnOutside = true;
  protected restoreFocusOnClose = true;
  protected matchTriggerWidth = false;

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
    inject(DestroyRef).onDestroy(() => this.detach(false));
  }

  private attach(): void {
    const trigger = this.root.trigger();
    const point = this.root.anchorPoint();
    if (this.overlayRef || (!trigger && !point)) return;
    this.lastActive = document.activeElement as HTMLElement | null;
    const rtl = this.dir.value === 'rtl';
    const { positions, meta } = buildPositions(this.side(), this.align(), this.sideOffset(), rtl);
    const strategy = this.overlay
      .position()
      .flexibleConnectedTo(point ?? trigger!)
      .withPositions(positions)
      .withPush(false)
      .withFlexibleDimensions(false)
      .withViewportMargin(8);
    const ref = this.overlay.create({
      positionStrategy: strategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      direction: this.dir.value,
      minWidth: this.matchTriggerWidth && trigger ? trigger.getBoundingClientRect().width : undefined,
    });
    this.overlayRef = ref;

    strategy.positionChanges.subscribe((c: ConnectedOverlayPositionChange) => {
      const m = meta.get(c.connectionPair);
      if (!m) return;
      this.el.setAttribute('data-side', m.side);
      this.el.setAttribute('data-align', m.align);
      this.setVars(m.side, m.align, trigger);
    });

    ref.attach(new DomPortal(this.el));
    this.el.hidden = false;
    this.el.setAttribute('data-side', this.side());
    this.el.setAttribute('data-align', this.align());
    this.setVars(this.side(), this.align(), trigger);
    this.registerChildPane();

    if (this.closeOnOutside) {
      ref.keydownEvents().subscribe((e) => {
        if (e.key === 'Escape' && !e.defaultPrevented) {
          e.preventDefault();
          this.root.close();
        }
      });
      ref.outsidePointerEvents().subscribe((e) => {
        const t = e.target as Node | null;
        if (t && trigger?.contains(t)) return; // trigger click handles its own toggle
        if (t && [...this.root.childPanes].some((pane) => pane.contains(t))) return;
        this.root.close();
      });
    }
    this.onAttached();
  }

  private detach(restoreFocus = true): void {
    if (!this.overlayRef) return;
    this.onDetached();
    this.overlayRef.dispose();
    this.overlayRef = null;
    this.el.hidden = true;
    if (restoreFocus && this.restoreFocusOnClose) (this.root.trigger() ?? this.lastActive)?.focus();
  }

  /** Hook: sub-menus register their pane with the parent layer. */
  protected registerChildPane(): void {}

  private setVars(side: Side, align: Align, trigger: HTMLElement | null): void {
    const r = trigger?.getBoundingClientRect() ?? new DOMRect(0, 0, 0, 0);
    const s = this.el.style;
    s.setProperty(`${this.varPrefix}-content-transform-origin`, transformOrigin(side, align));
    s.setProperty(`${this.varPrefix}-trigger-width`, `${r.width}px`);
    s.setProperty(`${this.varPrefix}-trigger-height`, `${r.height}px`);
    s.setProperty(`${this.varPrefix}-content-available-height`, `${window.innerHeight - 16}px`);
    s.setProperty(`${this.varPrefix}-content-available-width`, `${window.innerWidth - 16}px`);
  }
}
