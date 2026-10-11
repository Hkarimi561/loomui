import { computed, Directive, input } from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import { UiElementHost } from '@loomui-ng/ui/utils';

const CARD_BASE =
  'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl';

/** <div uiCard size="sm"> … </div> */
@Directive({
  selector: '[uiCard], ui-card', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'card', '[attr.data-size]': 'size()', '[attr.class]': 'classes()' },
})
export class UiCard {
  readonly size = input<'default' | 'sm'>('default');
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(CARD_BASE, this.userClass()));
}

@Directive({
  selector: '[uiCardHeader], ui-card-header', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'card-header', '[attr.class]': 'classes()' },
})
export class UiCardHeader {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[uiCardTitle], ui-card-title', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'card-title', '[attr.class]': 'classes()' },
})
export class UiCardTitle {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('text-base leading-snug font-medium group-data-[size=sm]/card:text-sm', this.userClass()),
  );
}

@Directive({
  selector: '[uiCardDescription], ui-card-description', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'card-description', '[attr.class]': 'classes()' },
})
export class UiCardDescription {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('text-sm text-muted-foreground', this.userClass()));
}

/** Logical placement: observed `col-start-2 … justify-self-end` already mirrors in RTL. */
@Directive({
  selector: '[uiCardAction], ui-card-action', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'card-action', '[attr.class]': 'classes()' },
})
export class UiCardAction {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', this.userClass()),
  );
}

@Directive({
  selector: '[uiCardContent], ui-card-content', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'card-content', '[attr.class]': 'classes()' },
})
export class UiCardContent {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('px-(--card-spacing)', this.userClass()));
}

@Directive({
  selector: '[uiCardFooter], ui-card-footer', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'card-footer', '[attr.class]': 'classes()' },
})
export class UiCardFooter {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)', this.userClass()),
  );
}

export const UI_CARD = [UiCard, UiCardHeader, UiCardTitle, UiCardDescription, UiCardAction, UiCardContent, UiCardFooter] as const;
