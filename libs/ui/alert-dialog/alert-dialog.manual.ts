import { computed, Directive, ElementRef, inject, input, booleanAttribute } from '@angular/core';
import { buttonVariants } from '@loomui-ng/ui/button';
import { cn } from '@loomui-ng/ui/utils';
import { UiModalContentBase, UiModalRoot, type ModalContentConfig } from '@loomui-ng/ui/utils';
import {
  alertDialogContentClass,
  alertDialogDescriptionClass,
  alertDialogFooterClass,
  alertDialogHeaderClass,
  alertDialogOverlayClass,
  alertDialogTitleClass,
} from './alert-dialog';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * <div uiAlertDialog class="contents">
 *   <button uiButton variant="outline" uiAlertDialogTrigger>Delete</button>
 *   <div uiAlertDialogContent>
 *     <div uiAlertDialogHeader><h2 uiAlertDialogTitle>Are you sure?</h2><p uiAlertDialogDescription>…</p></div>
 *     <div uiAlertDialogFooter><button uiAlertDialogCancel>Cancel</button><button uiAlertDialogAction>Continue</button></div>
 *   </div>
 * </div>
 * Differences from Dialog (Radix AlertDialog): role="alertdialog", clicking the overlay does NOT dismiss, no corner close
 * button, and initial focus goes to the Cancel button.
 */
@Directive({ selector: '[uiAlertDialog], ui-alert-dialog', hostDirectives: [UiElementHost], exportAs: 'uiAlertDialog' })
export class UiAlertDialog extends UiModalRoot {}

@Directive({
  selector: '[uiAlertDialogTrigger], ui-alert-dialog-trigger', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'alert-dialog-trigger',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': 'root.open()',
    '[attr.aria-controls]': 'root.id',
    '[attr.data-state]': 'root.open() ? "open" : "closed"',
    '(click)': 'root.toggle()',
  },
})
export class UiAlertDialogTrigger {
  protected readonly root = inject(UiAlertDialog);
  constructor() {
    this.root.trigger.set(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement);
  }
}

@Directive({
  selector: '[uiAlertDialogContent], ui-alert-dialog-content', hostDirectives: [UiElementHost],
  host: {
    role: 'alertdialog',
    'data-slot': 'alert-dialog-content',
    tabindex: '-1',
    '[id]': 'root.id',
    '[attr.aria-labelledby]': 'root.titleId',
    '[attr.aria-describedby]': 'root.descriptionId',
    '[attr.data-state]': 'root.state()',
    '[attr.data-size]': 'size()',
    '[attr.class]': 'classes()',
  },
})
export class UiAlertDialogContent extends UiModalContentBase {
  protected readonly root = inject(UiAlertDialog);
  protected readonly config: ModalContentConfig = {
    slot: 'alert-dialog',
    backdropClass: alertDialogOverlayClass,
    closeOnBackdrop: false,
    initialFocusSelector: '[data-slot=alert-dialog-cancel]',
  };
  readonly size = input<'default' | 'sm'>('default');
  protected readonly classes = computed(() => cn(alertDialogContentClass, this.userClass()));
  constructor() {
    super();
    this.init();
  }
}

@Directive({
  selector: '[uiAlertDialogHeader], ui-alert-dialog-header', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'alert-dialog-header', '[attr.class]': 'classes()' },
})
export class UiAlertDialogHeader {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(alertDialogHeaderClass, this.userClass()));
}

@Directive({
  selector: '[uiAlertDialogFooter], ui-alert-dialog-footer', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'alert-dialog-footer', '[attr.class]': 'classes()' },
})
export class UiAlertDialogFooter {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(alertDialogFooterClass, this.userClass()));
}

@Directive({
  selector: '[uiAlertDialogTitle], ui-alert-dialog-title', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'alert-dialog-title', '[id]': 'root.titleId', '[attr.class]': 'classes()' },
})
export class UiAlertDialogTitle {
  protected readonly root = inject(UiAlertDialog);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(alertDialogTitleClass, this.userClass()));
}

@Directive({
  selector: '[uiAlertDialogDescription], ui-alert-dialog-description', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'alert-dialog-description', '[id]': 'root.descriptionId', '[attr.class]': 'classes()' },
})
export class UiAlertDialogDescription {
  protected readonly root = inject(UiAlertDialog);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(alertDialogDescriptionClass, this.userClass()));
}

/** Observed: outline Button. Closes the dialog. */
@Directive({
  selector: 'button[uiAlertDialogCancel], ui-alert-dialog-cancel', hostDirectives: [UiElementHost],
  host: { '[attr.disabled]': 'disabled() ? "" : null',
    type: 'button',
    'data-slot': 'alert-dialog-cancel',
    'data-variant': 'outline',
    'data-size': 'default',
    '[attr.class]': 'classes()',
    '(click)': 'root.close()',
  },
})
export class UiAlertDialogCancel {
  /** Reflected as the `disabled` attribute so it also works on the custom element. */
  readonly disabled = input(false, { transform: booleanAttribute });
  protected readonly root = inject(UiAlertDialog);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(buttonVariants({ variant: 'outline' }), this.userClass()));
}

/** Observed: default Button. Closes the dialog after your own (click) handler runs. */
@Directive({
  selector: 'button[uiAlertDialogAction], ui-alert-dialog-action', hostDirectives: [UiElementHost],
  host: { '[attr.disabled]': 'disabled() ? "" : null',
    type: 'button',
    'data-slot': 'alert-dialog-action',
    'data-variant': 'default',
    'data-size': 'default',
    '[attr.class]': 'classes()',
    '(click)': 'root.close()',
  },
})
export class UiAlertDialogAction {
  /** Reflected as the `disabled` attribute so it also works on the custom element. */
  readonly disabled = input(false, { transform: booleanAttribute });
  protected readonly root = inject(UiAlertDialog);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(buttonVariants({ variant: 'default' }), this.userClass()));
}

export const UI_ALERT_DIALOG = [
  UiAlertDialog,
  UiAlertDialogTrigger,
  UiAlertDialogContent,
  UiAlertDialogHeader,
  UiAlertDialogFooter,
  UiAlertDialogTitle,
  UiAlertDialogDescription,
  UiAlertDialogCancel,
  UiAlertDialogAction,
] as const;
