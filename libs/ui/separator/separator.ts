import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { cn } from '@loomui/ui/utils';
import { UiElementHost } from '@loomui/ui/utils';

/**
 * <div uiSeparator></div>  /  <div uiSeparator orientation="vertical"></div>
 * Observed: role="none" (decorative) + data-orientation. With `decorative=false` we expose
 * role="separator" and aria-orientation (Radix behaviour, not observed live).
 */
@Directive({
  selector: '[uiSeparator], ui-separator', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'separator',
    '[attr.data-orientation]': 'orientation()',
    '[attr.role]': 'decorative() ? "none" : "separator"',
    '[attr.aria-orientation]': 'decorative() || orientation() === "horizontal" ? null : "vertical"',
    '[attr.class]': 'classes()',
  },
})
export class UiSeparator {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly decorative = input(true, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
      this.userClass(),
    ),
  );
}
