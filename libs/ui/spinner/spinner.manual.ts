import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import { UiIconSvg } from '@loomui-ng/ui/icon';

/**
 * <ui-spinner /> — Observed: <svg role="status" aria-label="Loading" class="lucide lucide-loader-circle size-4 animate-spin">.
 * Deviation: the svg is rendered inside a `ui-spinner` element (display: contents) because an Angular component cannot be
 * the svg element itself.
 */
@Component({
  selector: 'ui-spinner',
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <svg uiIcon="loader-circle" data-slot="spinner" role="status" aria-label="Loading" [attr.class]="classes()"></svg>
  `,
})
export class UiSpinner {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('size-4 animate-spin', this.userClass()));
}

export const UI_SPINNER = [UiSpinner] as const;
