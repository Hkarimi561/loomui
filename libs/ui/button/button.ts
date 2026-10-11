import { computed, Directive, input, booleanAttribute } from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import { buttonVariants, type ButtonVariants } from './button-variants';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * <button uiButton variant="outline" size="sm">…</button>
 * <a uiButton href="/">…</a>
 *
 * Directive (not a component) so the native element, its semantics and keyboard behaviour are kept.
 * Consumer classes passed via `class` are merged with tailwind-merge; because the whole class
 * attribute is owned by this directive, avoid `[class.foo]` bindings on the same element.
 */
@Directive({
  selector: 'button[uiButton], a[uiButton], ui-button', hostDirectives: [UiElementHost],
  exportAs: 'uiButton',
  host: { '[attr.disabled]': 'disabled() ? "" : null',
    'data-slot': 'button',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.class]': 'classes()',
  },
})
export class UiButton {
  /** Reflected as the `disabled` attribute so it also works on the custom element. */
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly variant = input<NonNullable<ButtonVariants['variant']>>('default');
  readonly size = input<NonNullable<ButtonVariants['size']>>('default');
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly classes = computed(() =>
    cn(buttonVariants({ variant: this.variant(), size: this.size() }), this.userClass()),
  );
}
