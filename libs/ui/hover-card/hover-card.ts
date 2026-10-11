import { computed, DestroyRef, Directive, ElementRef, inject, input, numberAttribute } from '@angular/core';
import { cn } from '@loomui/ui/utils';
import { UiLayerRoot } from '@loomui/ui/utils';
import { UiPopperContentBase } from '@loomui/ui/utils';
import { UiElementHost } from '@loomui/ui/utils';

// Observed live (hover on the demo trigger): content has data-side/data-align/data-state and NO role; width comes from the demo (w-64).
const CONTENT_CLASS =
  'z-50 origin-(--radix-hover-card-content-transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95';

/**
 * <div uiHoverCard class="contents">
 *   <button uiButton variant="link" uiHoverCardTrigger>@nextjs</button>
 *   <div uiHoverCardContent class="w-64">…</div>
 * </div>
 * Opens on pointer hover (openDelay 700ms) and keyboard focus; closes after closeDelay 300ms (Radix defaults).
 */
@Directive({ selector: '[uiHoverCard], ui-hover-card', hostDirectives: [UiElementHost], exportAs: 'uiHoverCard' })
export class UiHoverCard extends UiLayerRoot {
  readonly openDelay = input(700, { transform: numberAttribute });
  readonly closeDelay = input(300, { transform: numberAttribute });
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }
  show(instant = false): void {
    clearTimeout(this.timer);
    if (instant || this.openDelay() === 0) return this.open.set(true);
    this.timer = setTimeout(() => this.open.set(true), this.openDelay());
  }
  hide(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.open.set(false), this.closeDelay());
  }
  keep(): void {
    clearTimeout(this.timer);
  }
}

@Directive({
  selector: '[uiHoverCardTrigger], ui-hover-card-trigger', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'hover-card-trigger',
    '[attr.data-state]': 'root.open() ? "open" : "closed"',
    '(pointerenter)': 'onEnter($event)',
    '(pointerleave)': 'root.hide()',
    '(focus)': 'onFocus()',
    '(blur)': 'root.hide()',
  },
})
export class UiHoverCardTrigger {
  protected readonly root = inject(UiHoverCard);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  constructor() {
    this.root.trigger.set(this.el);
  }
  protected onEnter(e: PointerEvent): void {
    if (e.pointerType !== 'touch') this.root.show();
  }
  protected onFocus(): void {
    if (this.el.matches(':focus-visible')) this.root.show(true);
  }
}

@Directive({
  selector: '[uiHoverCardContent], ui-hover-card-content', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'hover-card-content',
    '[attr.data-state]': 'root.state()',
    '[attr.class]': 'classes()',
    '(pointerenter)': 'root.keep()',
    '(pointerleave)': 'root.hide()',
  },
})
export class UiHoverCardContent extends UiPopperContentBase {
  protected readonly root = inject(UiHoverCard);
  protected readonly varPrefix = '--radix-hover-card';
  protected readonly classes = computed(() => cn(CONTENT_CLASS, this.userClass()));
  constructor() {
    super();
    this.restoreFocusOnClose = false;
    this.init();
  }
}

export const UI_HOVER_CARD = [UiHoverCard, UiHoverCardTrigger, UiHoverCardContent] as const;
