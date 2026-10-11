import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { buttonVariants } from '@loomui-ng/ui/button';
import { cn } from '@loomui-ng/ui/utils';
import { UI_PAGINATION_GENERATED } from './pagination';
import { UiIconSvg } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

type LinkSize = 'default' | 'icon' | 'sm' | 'lg' | 'xs' | 'icon-xs' | 'icon-sm' | 'icon-lg';

/** <a uiPaginationLink [isActive]="page === 2" href="#">2</a> — Button variants: ghost, outline when active. */
@Component({
  selector: 'a[uiPaginationLink], ui-pagination-link', hostDirectives: [UiElementHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'pagination-link',
    '[attr.aria-current]': 'isActive() ? "page" : null',
    '[attr.data-active]': 'isActive() ? "true" : null',
    '[attr.data-variant]': 'isActive() ? "outline" : "ghost"',
    '[attr.data-size]': 'size()',
    '[attr.class]': 'classes()',
  },
  template: `<ng-content />`,
})
export class UiPaginationLink {
  readonly isActive = input(false, { transform: booleanAttribute });
  readonly size = input<LinkSize>('icon');
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(buttonVariants({ variant: this.isActive() ? 'outline' : 'ghost', size: this.size() }), this.userClass()),
  );
}

// Previous/Next: observed aria-label "Go to previous/next page", ghost + default size. The icon+text layout and the
// ps-1.5!/pe-1.5! padding follow shadcn's published source (the capture only shows the outer anchor).
@Component({
  selector: 'a[uiPaginationPrevious], ui-pagination-previous', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-label': 'Go to previous page',
    'data-slot': 'pagination-link',
    'data-variant': 'ghost',
    'data-size': 'default',
    '[attr.class]': 'classes()',
  },
  template: `
    <svg uiIcon="chevron-left" class="rtl:rotate-180"></svg>
    <span class="hidden sm:block"><ng-content>Previous</ng-content></span>
  `,
})
export class UiPaginationPrevious {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'ps-1.5!', this.userClass()),
  );
}

@Component({
  selector: 'a[uiPaginationNext], ui-pagination-next', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-label': 'Go to next page',
    'data-slot': 'pagination-link',
    'data-variant': 'ghost',
    'data-size': 'default',
    '[attr.class]': 'classes()',
  },
  template: `
    <span class="hidden sm:block"><ng-content>Next</ng-content></span>
    <svg uiIcon="chevron-right" class="rtl:rotate-180"></svg>
  `,
})
export class UiPaginationNext {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'pe-1.5!', this.userClass()),
  );
}

@Component({
  selector: 'span[uiPaginationEllipsis], ui-pagination-ellipsis', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', 'data-slot': 'pagination-ellipsis', '[attr.class]': 'classes()' },
  template: `
    <svg uiIcon="ellipsis"></svg>
    <span class="sr-only">More pages</span>
  `,
})
export class UiPaginationEllipsis {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn("flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4", this.userClass()),
  );
}

export const UI_PAGINATION = [
  ...UI_PAGINATION_GENERATED,
  UiPaginationLink,
  UiPaginationPrevious,
  UiPaginationNext,
  UiPaginationEllipsis,
] as const;
