import { computed, Directive, input } from '@angular/core';
import { cn } from '@loomui/ui/utils';
import { UiElementHost } from '@loomui/ui/utils';

const labelClasses =
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50';

/** <label uiLabel for="email">Email</label> */
@Directive({
  selector: 'label[uiLabel], ui-label', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'label', '[attr.class]': 'classes()' },
})
export class UiLabel {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(labelClasses, this.userClass()));
}
