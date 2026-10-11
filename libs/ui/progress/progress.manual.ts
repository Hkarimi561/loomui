import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';
import { cn } from '@loomui/ui/utils';
import { UiElementHost } from '@loomui/ui/utils';

/**
 * <div uiProgress [value]="60"></div>
 * Observed (Radix): role="progressbar", aria-valuemin=0, aria-valuemax, data-state, data-max; the indicator is
 * translated by -(100 - value)% and the root flips with `rtl:rotate-180`.
 */
@Component({
  selector: 'div[uiProgress], ui-progress', hostDirectives: [UiElementHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.data-state]': 'state()',
    '[attr.data-value]': 'value()',
    '[attr.data-max]': 'max()',
    'data-slot': 'progress',
    '[attr.class]': 'classes()',
  },
  template: `
    <div
      data-slot="progress-indicator"
      [attr.data-state]="state()"
      [attr.data-value]="value()"
      [attr.data-max]="max()"
      class="size-full flex-1 bg-primary transition-all"
      [style.transform]="'translateX(-' + (100 - percent()) + '%)'"
    ></div>
  `,
})
export class UiProgress {
  /** `null` = indeterminate (observed on the live page: data-state="indeterminate"). */
  readonly value = input<number | null, unknown>(null, {
    transform: (v: unknown) => (v === null || v === undefined || v === '' ? null : numberAttribute(v)),
  });
  readonly max = input(100, { transform: numberAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly percent = computed(() => {
    const v = this.value();
    return v === null ? 0 : Math.min(100, Math.max(0, (v / this.max()) * 100));
  });
  protected readonly state = computed(() => {
    const v = this.value();
    return v === null ? 'indeterminate' : v >= this.max() ? 'complete' : 'loading';
  });
  protected readonly classes = computed(() =>
    cn('relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted rtl:rotate-180', this.userClass()),
  );
}

export const UI_PROGRESS = [UiProgress] as const;
