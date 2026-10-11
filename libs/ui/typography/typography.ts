import { computed, Directive, input } from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import { UiElementHost } from '@loomui-ng/ui/utils';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'blockquote' | 'list' | 'code' | 'lead' | 'large' | 'small' | 'muted';

export const typographyClasses: Record<TypographyVariant, string> = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  blockquote: 'mt-6 border-s-2 ps-6 italic',
  list: 'my-6 ms-6 list-disc [&>li]:mt-2',
  code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm leading-none font-medium',
  muted: 'text-sm text-muted-foreground',
};

/**
 * Typographic styles as a directive: <h1 uiTypography="h1">Title</h1>, <p uiTypography="lead">…</p>, or as an element:
 * <ui-typography variant="h1">Title</ui-typography>.
 * Deviation: the live docs Typography page now redirects to "Typeset" (a CSS system with its own builder). This ships the
 * classic shadcn typography recipe (class strings from the former docs page) as a thin directive; Typeset is not reproduced.
 */
@Directive({
  selector: '[uiTypography], ui-typography', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'typography', '[attr.data-variant]': 'variant()', '[attr.class]': 'classes()' },
})
export class UiTypography {
  /** Attribute form: `<p uiTypography="lead">`. */
  readonly attrVariant = input<TypographyVariant | ''>('', { alias: 'uiTypography' });
  /** Element form: `<ui-typography variant="lead">`. */
  readonly elVariant = input<TypographyVariant | ''>('', { alias: 'variant' });
  readonly variant = computed<TypographyVariant>(() => this.attrVariant() || this.elVariant() || 'p');
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(typographyClasses[this.variant()], this.userClass()));
}

export const UI_TYPOGRAPHY = [UiTypography] as const;
