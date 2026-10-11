import { computed, Directive, input } from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import { UI_FIELD_GENERATED } from './field';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * <div uiFieldSeparator><span>or</span></div>
 * Observed: relative -my-2 h-5 text-sm. The label span is shaped like shadcn's source (UNKNOWN on the live capture,
 * which had no content child on the sampled instances).
 */
@Directive({
  selector: '[uiFieldSeparator], ui-field-separator', hostDirectives: [UiElementHost],
  host: { role: 'none', 'data-slot': 'field-separator', '[attr.class]': 'classes()' },
})
export class UiFieldSeparator {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2', this.userClass()),
  );
}

/** Validation message: <div uiFieldError>Required</div>. Not captured on the live page; class from shadcn's source. */
@Directive({
  selector: '[uiFieldError], ui-field-error', hostDirectives: [UiElementHost],
  host: { role: 'alert', 'data-slot': 'field-error', '[attr.class]': 'classes()' },
})
export class UiFieldError {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('text-sm font-normal text-destructive', this.userClass()));
}

export const UI_FIELD = [...UI_FIELD_GENERATED, UiFieldSeparator, UiFieldError] as const;
