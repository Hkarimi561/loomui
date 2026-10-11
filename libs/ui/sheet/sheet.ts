import { computed, Directive, ElementRef, inject, input, booleanAttribute } from '@angular/core';
import { buttonVariants } from '@loomui/ui/button';
import { cn } from '@loomui/ui/utils';
import { UiModalContentBase, UiModalRoot, type ModalContentConfig } from '@loomui/ui/utils';
import { iconToSvg, LIB_ICONS } from '@loomui/ui/icon';
import { UiElementHost } from '@loomui/ui/utils';

const OVERLAY_CLASS =
  'fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0';

// Observed classes use physical left-0/right-0 with border-e/border-s (logical). In RTL a "left" sheet would
// stay on the left; we keep the observed physical positioning (deviation note in docs/behavior-specs/sheet.md).
const CONTENT_CLASS =
  'fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-e data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-s data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-[side=bottom]:data-open:slide-in-from-bottom-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:animate-out data-closed:fade-out-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=right]:data-closed:slide-out-to-right-10 data-[side=top]:data-closed:slide-out-to-top-10';

/** <div uiSheet [(open)]="o"> <button uiSheetTrigger/> <div uiSheetContent side="right">…</div> </div> */
@Directive({ selector: '[uiSheet], ui-sheet', hostDirectives: [UiElementHost], exportAs: 'uiSheet' })
export class UiSheet extends UiModalRoot {}

@Directive({
  selector: '[uiSheetTrigger], ui-sheet-trigger', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'sheet-trigger',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': 'root.open()',
    '[attr.aria-controls]': 'root.id',
    '[attr.data-state]': 'root.open() ? "open" : "closed"',
    '(click)': 'root.toggle()',
  },
})
export class UiSheetTrigger {
  protected readonly root = inject(UiSheet);
  constructor() {
    this.root.trigger.set(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement);
  }
}

@Directive({
  selector: '[uiSheetContent], ui-sheet-content', hostDirectives: [UiElementHost],
  host: {
    role: 'dialog',
    'data-slot': 'sheet-content',
    tabindex: '-1',
    '[id]': 'root.id',
    '[attr.aria-labelledby]': 'root.titleId',
    '[attr.aria-describedby]': 'root.descriptionId',
    '[attr.data-state]': 'root.state()',
    '[attr.data-side]': 'side()',
    '[attr.class]': 'classes()',
  },
})
export class UiSheetContent extends UiModalContentBase {
  protected readonly root = inject(UiSheet);
  protected readonly config: ModalContentConfig = { slot: 'sheet', backdropClass: OVERLAY_CLASS };
  readonly side = input<'top' | 'right' | 'bottom' | 'left'>('right');
  readonly showCloseButton = input(true, { transform: booleanAttribute });
  protected readonly classes = computed(() => cn(CONTENT_CLASS, this.userClass()));

  constructor() {
    super();
    this.init();
    queueMicrotask(() => {
      if (this.showCloseButton()) this.el.appendChild(this.createCloseButton());
    });
  }

  private createCloseButton(): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-slot', 'sheet-close');
    btn.setAttribute('data-variant', 'ghost');
    btn.setAttribute('data-size', 'icon-sm');
    btn.className = cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'absolute end-3 top-3');
    btn.innerHTML = iconToSvg(LIB_ICONS['X'], { size: 16 }).replace('<svg ', '<svg class="size-4" aria-hidden="true" ') + '<span class="sr-only">Close</span>';
    btn.addEventListener('click', () => this.root.close());
    return btn;
  }
}

@Directive({
  selector: '[uiSheetHeader], ui-sheet-header', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sheet-header', '[attr.class]': 'classes()' },
})
export class UiSheetHeader {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-0.5 p-4', this.userClass()));
}

@Directive({
  selector: '[uiSheetFooter], ui-sheet-footer', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sheet-footer', '[attr.class]': 'classes()' },
})
export class UiSheetFooter {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('mt-auto flex flex-col gap-2 p-4', this.userClass()));
}

@Directive({
  selector: '[uiSheetTitle], ui-sheet-title', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sheet-title', '[id]': 'root.titleId', '[attr.class]': 'classes()' },
})
export class UiSheetTitle {
  protected readonly root = inject(UiSheet);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('text-base font-medium text-foreground', this.userClass()));
}

@Directive({
  selector: '[uiSheetDescription], ui-sheet-description', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sheet-description', '[id]': 'root.descriptionId', '[attr.class]': 'classes()' },
})
export class UiSheetDescription {
  protected readonly root = inject(UiSheet);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('text-sm text-muted-foreground', this.userClass()));
}

@Directive({
  selector: '[uiSheetClose], ui-sheet-close', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sheet-close', '(click)': 'root.close()' },
})
export class UiSheetClose {
  protected readonly root = inject(UiSheet);
}

export const UI_SHEET = [
  UiSheet,
  UiSheetTrigger,
  UiSheetContent,
  UiSheetHeader,
  UiSheetFooter,
  UiSheetTitle,
  UiSheetDescription,
  UiSheetClose,
] as const;
