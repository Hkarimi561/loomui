import { Directionality } from '@angular/cdk/bidi';
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import {
  booleanAttribute,
  computed,
  contentChildren,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import { cn } from '@loomui/ui/utils';
import { UiElementHost } from '@loomui/ui/utils';

let nextTabsId = 0;

/**
 * <div uiTabs [(value)]="tab">
 *   <div uiTabsList>
 *     <button uiTabsTrigger value="a">A</button> <button uiTabsTrigger value="b">B</button>
 *   </div>
 *   <div uiTabsContent value="a">…</div> <div uiTabsContent value="b">…</div>
 * </div>
 */
@Directive({
  selector: '[uiTabs], ui-tabs', hostDirectives: [UiElementHost],
  exportAs: 'uiTabs',
  host: {
    'data-slot': 'tabs',
    '[attr.data-orientation]': 'orientation()',
    '[attr.dir]': 'dir()',
    '[attr.class]': 'classes()',
  },
})
export class UiTabs {
  readonly value = model<string | undefined>(undefined);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  /** Optional explicit direction; otherwise inherited. (Live site always forces dir="ltr" — deviation.) */
  readonly dir = input<'ltr' | 'rtl' | undefined>(undefined);
  readonly activationMode = input<'automatic' | 'manual'>('automatic');
  readonly userClass = input<string>('', { alias: 'class' });

  readonly baseId = `ui-tabs-${nextTabsId++}`;
  private readonly directionality = inject(Directionality);
  resolvedDir(): 'ltr' | 'rtl' {
    return this.dir() ?? this.directionality.value;
  }

  protected readonly classes = computed(() =>
    cn('group/tabs flex gap-2 data-horizontal:flex-col', this.userClass()),
  );

  triggerId(v: string) {
    return `${this.baseId}-trigger-${v}`;
  }
  contentId(v: string) {
    return `${this.baseId}-content-${v}`;
  }
}

@Directive({
  selector: '[uiTabsList], ui-tabs-list', hostDirectives: [UiElementHost],
  host: {
    role: 'tablist',
    'data-slot': 'tabs-list',
    '[attr.aria-orientation]': 'tabs.orientation()',
    '[attr.data-orientation]': 'tabs.orientation()',
    '[attr.data-variant]': 'variant()',
    '[attr.class]': 'classes()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiTabsList {
  protected readonly tabs = inject(UiTabs);
  readonly variant = input<'default' | 'line'>('default');
  readonly userClass = input<string>('', { alias: 'class' });
  private readonly triggers = contentChildren(forwardRef(() => UiTabsTrigger), { descendants: true });

  protected readonly classes = computed(() =>
    cn(
      'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none',
      this.variant() === 'line' ? 'gap-1 bg-transparent' : 'bg-muted',
      this.userClass(),
    ),
  );

  protected onKeydown(event: KeyboardEvent): void {
    const items = this.triggers();
    const index = items.findIndex((t) => t.el.nativeElement === document.activeElement);
    if (index < 0) return;
    const manager = new FocusKeyManager<UiTabsTrigger>(items)
      .withWrap()
      .withHomeAndEnd()
      .skipPredicate((t) => t.disabled);
    if (this.tabs.orientation() === 'horizontal') {
      manager.withHorizontalOrientation(this.tabs.resolvedDir()).withVerticalOrientation(false);
    } else {
      manager.withVerticalOrientation(true).withHorizontalOrientation(null);
    }
    manager.setActiveItem(index);
    manager.onKeydown(event);
    const active = manager.activeItem;
    if (active && active !== items[index] && this.tabs.activationMode() === 'automatic') {
      active.select();
    }
  }
}

@Directive({
  selector: 'button[uiTabsTrigger], ui-tabs-trigger', hostDirectives: [UiElementHost],
  host: {
    type: 'button',
    role: 'tab',
    'data-slot': 'tabs-trigger',
    '[id]': 'tabs.triggerId(value())',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-controls]': 'tabs.contentId(value())',
    '[attr.data-state]': 'selected() ? "active" : "inactive"',
    '[attr.data-orientation]': 'tabs.orientation()',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.disabled]': '(isDisabled()) ? "" : null',
    // Roving tabindex (observed: selected tab = 0, others = -1).
    '[attr.tabindex]': 'selected() ? 0 : -1',
    '[attr.class]': 'classes()',
    '(mousedown)': 'onMouseDown($event)',
    '(focus)': 'onFocus()',
    '(keydown.enter)': 'select()',
    '(keydown.space)': 'select()',
  },
})
export class UiTabsTrigger implements FocusableOption {
  protected readonly tabs = inject(UiTabs);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly value = input<string>('');
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly selected = computed(() => this.tabs.value() === this.value());
  /** FocusableOption contract (CDK key manager reads this). */
  get disabled(): boolean {
    return this.disabledInput();
  }
  protected readonly isDisabled = computed(() => this.disabledInput());
  protected readonly classes = computed(() =>
    cn(
      "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pe-1 has-data-[icon=inline-start]:ps-1 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-end-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
      this.userClass(),
    ),
  );

  focus(): void {
    this.el.nativeElement.focus();
  }

  select(): void {
    if (!this.isDisabled()) this.tabs.value.set(this.value());
  }

  protected onMouseDown(e: MouseEvent): void {
    if (e.button === 0 && !e.ctrlKey && !this.isDisabled()) this.select();
  }

  protected onFocus(): void {
    // Automatic activation on keyboard focus; mouse already selected on mousedown.
    if (this.tabs.activationMode() === 'automatic' && !this.selected()) this.select();
  }
}

@Directive({
  selector: '[uiTabsContent], ui-tabs-content', hostDirectives: [UiElementHost],
  host: {
    role: 'tabpanel',
    'data-slot': 'tabs-content',
    '[id]': 'tabs.contentId(value())',
    '[attr.aria-labelledby]': 'tabs.triggerId(value())',
    '[attr.data-state]': 'selected() ? "active" : "inactive"',
    '[attr.data-orientation]': 'tabs.orientation()',
    '[attr.hidden]': 'selected() ? null : ""',
    tabindex: '0',
    '[attr.class]': 'classes()',
  },
})
export class UiTabsContent {
  protected readonly tabs = inject(UiTabs);
  readonly value = input<string>('');
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly selected = computed(() => this.tabs.value() === this.value());
  protected readonly classes = computed(() => cn('flex-1 text-sm outline-none', this.userClass()));
}

export const UI_TABS = [UiTabs, UiTabsList, UiTabsTrigger, UiTabsContent] as const;
