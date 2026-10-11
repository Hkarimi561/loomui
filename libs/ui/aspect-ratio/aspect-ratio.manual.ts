import { computed, Directive, input, numberAttribute } from '@angular/core';
import { cn } from '@loomui/ui/utils';
import { aspectRatioClass } from './aspect-ratio';
import { UiElementHost } from '@loomui/ui/utils';

/**
 * <div uiAspectRatio [ratio]="16 / 9"><img class="size-full object-cover" … /></div>
 * Uses the CSS `aspect-ratio` property (Radix uses a padding-bottom wrapper; the visible result is the same).
 */
@Directive({
  selector: '[uiAspectRatio], ui-aspect-ratio', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'aspect-ratio',
    '[style.aspect-ratio]': 'ratio()',
    '[attr.class]': 'classes()',
  },
})
export class UiAspectRatio {
  readonly ratio = input(1, { transform: numberAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(aspectRatioClass, this.userClass()));
}

export const UI_ASPECT_RATIO = [UiAspectRatio] as const;
