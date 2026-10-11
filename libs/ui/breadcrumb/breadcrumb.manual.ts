import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import { UI_BREADCRUMB_GENERATED } from './breadcrumb';
import { UiIconSvg } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

/** <li uiBreadcrumbSeparator></li> — renders a chevron (mirrored in RTL). Pass custom content to replace it. */
@Component({
  selector: 'li[uiBreadcrumbSeparator], ui-breadcrumb-separator', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'presentation',
    'aria-hidden': 'true',
    'data-slot': 'breadcrumb-separator',
    '[attr.class]': 'classes()',
  },
  template: `
    <ng-content>
      <svg uiIcon="chevron-right" class="rtl:rotate-180"></svg>
    </ng-content>
  `,
})
export class UiBreadcrumbSeparator {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('[&>svg]:size-3.5 [&>ui-icon]:size-3.5', this.userClass()));
}

/** <span uiBreadcrumbEllipsis></span> — "…" with an sr-only "More" label. */
@Component({
  selector: 'span[uiBreadcrumbEllipsis], ui-breadcrumb-ellipsis', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'presentation',
    'aria-hidden': 'true',
    'data-slot': 'breadcrumb-ellipsis',
    '[attr.class]': 'classes()',
  },
  template: `
    <svg uiIcon="ellipsis"></svg>
    <span class="sr-only">More</span>
  `,
})
export class UiBreadcrumbEllipsis {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex size-5 items-center justify-center [&>svg]:size-4 [&>ui-icon]:size-4', this.userClass()),
  );
}

export const UI_BREADCRUMB = [...UI_BREADCRUMB_GENERATED, UiBreadcrumbSeparator, UiBreadcrumbEllipsis] as const;
