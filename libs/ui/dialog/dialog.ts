import { computed, Directive, ElementRef, inject, input, booleanAttribute } from '@angular/core';
import { buttonVariants } from '@loomui-ng/ui/button';
import { cn } from '@loomui-ng/ui/utils';
import { UiModalContentBase, UiModalRoot, type ModalContentConfig } from '@loomui-ng/ui/utils';
import { iconToSvg, LIB_ICONS } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

const OVERLAY_CLASS =
  'fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0';

const CONTENT_CLASS =
  'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:max-w-sm';

/**
 * <div uiDialog [(open)]="open">
 *   <button uiButton uiDialogTrigger>Open</button>
 *   <div uiDialogContent>…</div>
 * </div>
 * `uiDialog` renders no element of its own styling; it is a state holder. Content is moved to <body>
 * through a CDK overlay while open.
 */
@Directive({ selector: '[uiDialog], ui-dialog', hostDirectives: [UiElementHost], exportAs: 'uiDialog' })
export class UiDialog extends UiModalRoot {}

@Directive({
  selector: '[uiDialogTrigger], ui-dialog-trigger', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'dialog-trigger',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': 'root.open()',
    '[attr.aria-controls]': 'root.id',
    '[attr.data-state]': 'root.open() ? "open" : "closed"',
    '(click)': 'root.toggle()',
  },
})
export class UiDialogTrigger {
  protected readonly root = inject(UiDialog);
  constructor() {
    this.root.trigger.set(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement);
  }
}

@Directive({
  selector: '[uiDialogContent], ui-dialog-content', hostDirectives: [UiElementHost],
  host: {
    role: 'dialog',
    'data-slot': 'dialog-content',
    tabindex: '-1',
    '[id]': 'root.id',
    '[attr.aria-labelledby]': 'root.titleId',
    '[attr.aria-describedby]': 'root.descriptionId',
    '[attr.data-state]': 'root.state()',
    '[attr.class]': 'classes()',
  },
})
export class UiDialogContent extends UiModalContentBase {
  protected readonly root = inject(UiDialog);
  protected readonly config: ModalContentConfig = { slot: 'dialog', backdropClass: OVERLAY_CLASS };
  /** Built-in top-corner close button, like shadcn's `showCloseButton` (default true). */
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
    btn.setAttribute('data-slot', 'dialog-close');
    btn.setAttribute('data-variant', 'ghost');
    btn.setAttribute('data-size', 'icon-sm');
    btn.className = cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'absolute end-2 top-2');
    btn.innerHTML = iconToSvg(LIB_ICONS['X'], { size: 16 }).replace('<svg ', '<svg class="size-4" aria-hidden="true" ') + '<span class="sr-only">Close</span>';
    btn.addEventListener('click', () => this.root.close());
    return btn;
  }
}

@Directive({
  selector: '[uiDialogHeader], ui-dialog-header', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'dialog-header', '[attr.class]': 'classes()' },
})
export class UiDialogHeader {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-2', this.userClass()));
}

@Directive({
  selector: '[uiDialogFooter], ui-dialog-footer', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'dialog-footer', '[attr.class]': 'classes()' },
})
export class UiDialogFooter {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end', this.userClass()),
  );
}

@Directive({
  selector: '[uiDialogTitle], ui-dialog-title', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'dialog-title', '[id]': 'root.titleId', '[attr.class]': 'classes()' },
})
export class UiDialogTitle {
  protected readonly root = inject(UiDialog);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('text-base leading-none font-medium', this.userClass()));
}

@Directive({
  selector: '[uiDialogDescription], ui-dialog-description', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'dialog-description', '[id]': 'root.descriptionId', '[attr.class]': 'classes()' },
})
export class UiDialogDescription {
  protected readonly root = inject(UiDialog);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground', this.userClass()),
  );
}

/** Any element/button inside the dialog that should close it. */
@Directive({
  selector: '[uiDialogClose], ui-dialog-close', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'dialog-close', '(click)': 'root.close()' },
})
export class UiDialogClose {
  protected readonly root = inject(UiDialog);
}

export const UI_DIALOG = [
  UiDialog,
  UiDialogTrigger,
  UiDialogContent,
  UiDialogHeader,
  UiDialogFooter,
  UiDialogTitle,
  UiDialogDescription,
  UiDialogClose,
] as const;
