import { computed, Directive, input, booleanAttribute } from '@angular/core';
import { buttonVariants } from '@loomui-ng/ui/button';
import { cn } from '@loomui-ng/ui/utils';
import { attachmentTriggerClass, UI_ATTACHMENT_GENERATED } from './attachment';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * Overlay link/button that makes the whole attachment clickable (observed on <a target=_blank> and <button aria-haspopup=dialog>):
 * <a uiAttachmentTrigger href="…" aria-label="Open workspace.png"></a>
 */
@Directive({
  selector: 'a[uiAttachmentTrigger], button[uiAttachmentTrigger], ui-attachment-trigger', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'attachment-trigger', '[attr.class]': 'classes()' },
})
export class UiAttachmentTrigger {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(attachmentTriggerClass, this.userClass()));
}

/** Per-attachment action (observed: ghost icon-xs Button, aria-label "Remove <file>" / "Cancel upload"). */
@Directive({
  selector: 'button[uiAttachmentAction], ui-attachment-action', hostDirectives: [UiElementHost],
  host: { '[attr.disabled]': 'disabled() ? "" : null',
    type: 'button',
    'data-slot': 'attachment-action',
    'data-variant': 'ghost',
    'data-size': 'icon-xs',
    '[attr.class]': 'classes()',
  },
})
export class UiAttachmentAction {
  /** Reflected as the `disabled` attribute so it also works on the custom element. */
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(buttonVariants({ variant: 'ghost', size: 'icon-xs' }), 'relative z-20', this.userClass()));
}

export const UI_ATTACHMENT = [...UI_ATTACHMENT_GENERATED, UiAttachmentTrigger, UiAttachmentAction] as const;
