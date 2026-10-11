import { computed, Directive, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@loomui/ui/utils';
import { UiElementHost } from '@loomui/ui/utils';

/** Classes copied from live shadcn Badge (docs/behavior-specs/badge.md); pl/pr → ps/pe for RTL. */
export const badgeVariants = cva(
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>ui-icon]:pointer-events-none [&>svg]:size-3! [&>ui-icon]:size-3!',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        destructive:
          'bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20',
        outline: 'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);
export type BadgeVariants = VariantProps<typeof badgeVariants>;

/** <span uiBadge variant="secondary">New</span> — also valid on <a>. */
@Directive({
  selector: '[uiBadge], ui-badge', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'badge',
    '[attr.data-variant]': 'variant()',
    '[attr.class]': 'classes()',
  },
})
export class UiBadge {
  readonly variant = input<NonNullable<BadgeVariants['variant']>>('default');
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(badgeVariants({ variant: this.variant() }), this.userClass()));
}
