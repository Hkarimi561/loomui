import { computed, signal, DestroyRef, Directive, ElementRef, inject, input, numberAttribute } from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import { UiLayerRoot } from '@loomui-ng/ui/utils';
import { UiPopperContentBase } from '@loomui-ng/ui/utils';
import { UiElementHost } from '@loomui-ng/ui/utils';

const CONTENT_CLASS =
  'z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pe-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95';

/**
 * <div uiTooltip class="contents">
 *   <button uiButton uiTooltipTrigger>Hover</button>
 *   <div uiTooltipContent>Add to library</div>
 * </div>
 *
 * Observed on live site: content `data-state="delayed-open"` when opened by hover; a visually-hidden
 * `role="tooltip"` copy of the text is inside the content and referenced by the trigger's aria-describedby.
 */
@Directive({ selector: '[uiTooltip], ui-tooltip', hostDirectives: [UiElementHost], exportAs: 'uiTooltip' })
export class UiTooltip extends UiLayerRoot {
  /** Hover-open delay in ms (shadcn default is 0). */
  readonly delay = input(0, { transform: numberAttribute });
  readonly openedBy = signal<'hover' | 'focus'>('hover');
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  show(by: 'hover' | 'focus'): void {
    clearTimeout(this.timer);
    this.openedBy.set(by);
    if (by === 'focus' || this.delay() === 0) return this.open.set(true);
    this.timer = setTimeout(() => this.open.set(true), this.delay());
  }

  hide(graceMs = 0): void {
    clearTimeout(this.timer);
    if (!graceMs) return this.open.set(false);
    this.timer = setTimeout(() => this.open.set(false), graceMs);
  }

  cancelHide(): void {
    clearTimeout(this.timer);
  }
}

@Directive({
  selector: '[uiTooltipTrigger], ui-tooltip-trigger', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'tooltip-trigger',
    '[attr.data-state]': 'tip.open() ? (tip.openedBy() === "hover" ? "delayed-open" : "instant-open") : "closed"',
    '[attr.aria-describedby]': 'tip.open() ? tip.id + "-tip" : null',
    '(pointerenter)': 'onEnter($event)',
    '(pointerleave)': 'tip.hide(100)',
    '(focus)': 'onFocus()',
    '(blur)': 'tip.hide()',
    '(pointerdown)': 'tip.hide()',
    '(keydown.escape)': 'tip.hide()',
  },
})
export class UiTooltipTrigger {
  protected readonly tip = inject(UiTooltip);
  constructor() {
    this.tip.trigger.set(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement);
  }
  protected onEnter(e: PointerEvent): void {
    if (e.pointerType === 'touch') return;
    this.tip.show('hover');
  }
  protected onFocus(): void {
    // Only keyboard focus opens the tooltip (focus-visible), like Radix.
    const el = this.tip.trigger();
    if (el?.matches(':focus-visible')) this.tip.show('focus');
  }
}

@Directive({
  selector: '[uiTooltipContent], ui-tooltip-content', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'tooltip-content',
    '[attr.data-state]': 'root.state() === "closed" ? "closed" : root.openedBy() === "hover" ? "delayed-open" : "instant-open"',
    '[attr.class]': 'classes()',
    '(pointerenter)': 'root.cancelHide()',
    '(pointerleave)': 'root.hide(100)',
  },
})
export class UiTooltipContent extends UiPopperContentBase {
  protected readonly root = inject(UiTooltip);
  protected readonly varPrefix = '--radix-tooltip';
  protected readonly classes = computed(() => cn(CONTENT_CLASS, this.userClass()));
  private sr: HTMLElement | null = null;
  private arrow: HTMLElement | null = null;

  constructor() {
    super();
    this.closeOnOutside = false;
    this.restoreFocusOnClose = false;
    this.init();
  }

  protected override onAttached(): void {
    // Visually hidden tooltip for assistive tech (matches Radix output).
    this.sr = document.createElement('span');
    this.sr.id = `${this.root.id}-tip`;
    this.sr.setAttribute('role', 'tooltip');
    this.sr.style.cssText =
      'position:absolute;border:0;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;overflow-wrap:normal';
    this.sr.textContent = this.el.textContent;
    this.el.appendChild(this.sr);

    this.arrow = document.createElement('span');
    this.arrow.setAttribute('data-slot', 'tooltip-arrow');
    this.arrow.setAttribute('aria-hidden', 'true');
    // Arrow classes are UNKNOWN on the live site (only a Radix svg was observed); a rotated square is used.
    this.arrow.className =
      'absolute size-2.5 rotate-45 rounded-[2px] bg-foreground ' +
      'group-data-[side=bottom]:-top-1 group-data-[side=top]:-bottom-1 left-1/2 -translate-x-1/2';
    this.el.classList.add('group', 'relative');
    this.el.appendChild(this.arrow);
  }

  protected override onDetached(): void {
    this.sr?.remove();
    this.arrow?.remove();
    this.sr = this.arrow = null;
  }
}

export const UI_TOOLTIP = [UiTooltip, UiTooltipTrigger, UiTooltipContent] as const;
