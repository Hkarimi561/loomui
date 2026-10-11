import { FocusTrapFactory } from '@angular/cdk/a11y';
import { computed, Directive, ElementRef, inject } from '@angular/core';
import { cn } from '@loomui/ui/utils';
import { UiLayerRoot } from '@loomui/ui/utils';
import { UiPopperContentBase } from '@loomui/ui/utils';
import { input } from '@angular/core';
import { UiElementHost } from '@loomui/ui/utils';

const CONTENT_CLASS =
  'z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95';

/**
 * <div uiPopover [(open)]="o" class="contents">
 *   <button uiButton uiPopoverTrigger>Open</button>
 *   <div uiPopoverContent side="bottom" align="center">…</div>
 * </div>
 */
@Directive({ selector: '[uiPopover], ui-popover', hostDirectives: [UiElementHost], exportAs: 'uiPopover' })
export class UiPopover extends UiLayerRoot {}

@Directive({
  selector: '[uiPopoverTrigger], ui-popover-trigger', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'popover-trigger',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': 'root.open()',
    '[attr.aria-controls]': 'root.id',
    '[attr.data-state]': 'root.open() ? "open" : "closed"',
    '(click)': 'root.toggle()',
  },
})
export class UiPopoverTrigger {
  protected readonly root = inject(UiPopover);
  constructor() {
    this.root.trigger.set(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement);
  }
}

@Directive({
  selector: '[uiPopoverContent], ui-popover-content', hostDirectives: [UiElementHost],
  host: {
    role: 'dialog',
    'data-slot': 'popover-content',
    tabindex: '-1',
    '[id]': 'root.id',
    '[attr.data-state]': 'root.state()',
    '[attr.class]': 'classes()',
  },
})
export class UiPopoverContent extends UiPopperContentBase {
  protected readonly root = inject(UiPopover);
  protected readonly varPrefix = '--radix-popover';
  private readonly trapFactory = inject(FocusTrapFactory);
  protected readonly classes = computed(() => cn(CONTENT_CLASS, this.userClass()));

  constructor() {
    super();
    this.init();
  }

  protected override onAttached(): void {
    // Radix Popover moves focus into the content (first tabbable, else the content itself); focus is not trapped.
    const trap = this.trapFactory.create(this.el);
    void trap.focusInitialElementWhenReady().then((ok) => {
      if (!ok) this.el.focus();
      trap.destroy();
    });
  }
}

@Directive({
  selector: '[uiPopoverHeader], ui-popover-header', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'popover-header', '[attr.class]': 'classes()' },
})
export class UiPopoverHeader {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-0.5 text-sm', this.userClass()));
}

@Directive({
  selector: '[uiPopoverTitle], ui-popover-title', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'popover-title', '[attr.class]': 'classes()' },
})
export class UiPopoverTitle {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('font-medium', this.userClass()));
}

@Directive({
  selector: '[uiPopoverDescription], ui-popover-description', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'popover-description', '[attr.class]': 'classes()' },
})
export class UiPopoverDescription {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('text-muted-foreground', this.userClass()));
}

export const UI_POPOVER = [
  UiPopover,
  UiPopoverTrigger,
  UiPopoverContent,
  UiPopoverHeader,
  UiPopoverTitle,
  UiPopoverDescription,
] as const;
