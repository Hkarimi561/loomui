import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import {
  contextMenuCheckboxItemClass,
  contextMenuContentClass,
  contextMenuItemClass,
  contextMenuLabelClass,
  contextMenuRadioItemClass,
  contextMenuSeparatorClass,
  contextMenuShortcutClass,
  contextMenuSubTriggerClass,
} from '@loomui/ui/context-menu';
import { cn } from '@loomui/ui/utils';
import {
  UI_MENU_CTX,
  UI_MENU_ITEM,
  UI_MENU_SUB,
  UiMenuContentBase,
  UiMenuItemBase,
  UiMenuRootBase,
  UiMenuSelectEvent,
  UiMenuSubBase,
  UiMenuSubTriggerBase,
} from '@loomui/ui/utils';
import { type Align } from '@loomui/ui/utils';
import { UiIconSvg } from '@loomui/ui/icon';
import { UiElementHost } from '@loomui/ui/utils';

export { UiMenuSelectEvent };

// The live dropdown demo showed only checkbox items and an older-generation plain item; the plain-item / sub-trigger /
// label / separator / shortcut classes come from the Context Menu capture, which uses the same menu kit (slot names swapped).
const dd = (c: string) => c.replace(/context-menu/g, 'dropdown-menu');
const CONTENT_CLASS = dd(contextMenuContentClass);
const ITEM_CLASS = dd(contextMenuItemClass);
const SUB_TRIGGER_CLASS = dd(contextMenuSubTriggerClass);
const CHECKBOX_CLASS = dd(contextMenuCheckboxItemClass);
const RADIO_CLASS = dd(contextMenuRadioItemClass);
const LABEL_CLASS = dd(contextMenuLabelClass);
const SEPARATOR_CLASS = dd(contextMenuSeparatorClass);
const SHORTCUT_CLASS = dd(contextMenuShortcutClass);

/** Root: <div uiDropdownMenu class="contents"> <button uiDropdownMenuTrigger/> <div uiDropdownMenuContent>…</div> </div> */
@Directive({
  selector: '[uiDropdownMenu], ui-dropdown-menu', hostDirectives: [UiElementHost],
  exportAs: 'uiDropdownMenu',
  providers: [{ provide: UI_MENU_CTX, useExisting: forwardRef(() => UiDropdownMenu) }],
})
export class UiDropdownMenu extends UiMenuRootBase {}

@Directive({
  selector: '[uiDropdownMenuTrigger], ui-dropdown-menu-trigger', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'dropdown-menu-trigger',
    'aria-haspopup': 'menu',
    '[attr.id]': 'root.triggerId()',
    '[attr.aria-expanded]': 'root.open()',
    '[attr.aria-controls]': 'root.open() ? root.id : null',
    '[attr.data-state]': 'root.open() ? "open" : "closed"',
    '(click)': 'onClick()',
    '(keydown.enter)': 'onKey($event, "first")',
    '(keydown.space)': 'onKey($event, "first")',
    '(keydown.arrowdown)': 'onKey($event, "first")',
    '(keydown.arrowup)': 'onKey($event, "last")',
  },
})
export class UiDropdownMenuTrigger {
  protected readonly root = inject(UiDropdownMenu);
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    this.root.trigger.set(el);
    this.root.triggerId.set(el.id || `${this.root.id}-trigger`);
  }
  protected onClick(): void {
    if (!this.root.open()) this.root.keyboardOpen = null;
    this.root.toggle();
  }
  protected onKey(e: Event, where: 'first' | 'last'): void {
    e.preventDefault();
    this.root.keyboardOpen = where;
    this.root.open.set(true);
  }
}

@Directive({
  selector: '[uiDropdownMenuContent], ui-dropdown-menu-content', hostDirectives: [UiElementHost],
  host: {
    role: 'menu',
    'aria-orientation': 'vertical',
    'data-slot': 'dropdown-menu-content',
    'data-orientation': 'vertical',
    tabindex: '-1',
    '[id]': 'root.id',
    '[attr.aria-labelledby]': 'root.triggerId()',
    '[attr.data-state]': 'root.state()',
    '[attr.dir]': 'dir.value',
    '[attr.class]': 'classes()',
    '(keydown)': 'onMenuKeydown($event)',
  },
})
export class UiDropdownMenuContent extends UiMenuContentBase {
  protected readonly root = inject(UiDropdownMenu);
  protected readonly menu = this.root;
  protected readonly varPrefix = '--radix-dropdown-menu';
  override readonly align = input<Align>('start');
  private readonly items = contentChildren<UiMenuItemBase>(UI_MENU_ITEM, { descendants: true });
  protected readonly classes = computed(() => cn(CONTENT_CLASS, this.userClass()));
  protected menuItems(): readonly UiMenuItemBase[] {
    return this.items();
  }
  constructor() {
    super();
    this.init();
  }
}

@Directive({
  selector: '[uiDropdownMenuItem], ui-dropdown-menu-item', hostDirectives: [UiElementHost],
  providers: [{ provide: UI_MENU_ITEM, useExisting: forwardRef(() => UiDropdownMenuItem) }],
  host: {
    tabindex: '-1',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.aria-disabled]': 'disabled ? "true" : null',
    '[attr.data-highlighted]': 'highlighted() ? "" : null',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(pointermove)': 'onPointerMove()',
    '(pointerleave)': 'onPointerLeave()',
    '(click)': 'activate()',
    'data-slot': 'dropdown-menu-item',
    role: 'menuitem',
    '[attr.data-variant]': 'variant()',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[attr.class]': 'classes()',
  },
})
export class UiDropdownMenuItem extends UiMenuItemBase {
  readonly variant = input<'default' | 'destructive'>('default');
  readonly inset = input(false, { transform: booleanAttribute });
  protected readonly classes = computed(() => cn(ITEM_CLASS, this.userClass()));
}

const CHECK =
  '<svg uiIcon="check" class="size-4"></svg>';

@Component({
  selector: '[uiDropdownMenuCheckboxItem], ui-dropdown-menu-checkbox-item', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: UI_MENU_ITEM, useExisting: forwardRef(() => UiDropdownMenuCheckboxItem) }],
  host: {
    tabindex: '-1',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.aria-disabled]': 'disabled ? "true" : null',
    '[attr.data-highlighted]': 'highlighted() ? "" : null',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(pointermove)': 'onPointerMove()',
    '(pointerleave)': 'onPointerLeave()',
    '(click)': 'activate()',
    'data-slot': 'dropdown-menu-checkbox-item',
    role: 'menuitemcheckbox',
    '[attr.aria-checked]': 'checked()',
    '[attr.data-state]': 'checked() ? "checked" : "unchecked"',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[attr.class]': 'classes()',
  },
  template: `
    <ng-content />
    <span class="pointer-events-none absolute end-2 flex items-center justify-center" data-slot="dropdown-menu-checkbox-item-indicator">
      @if (checked()) { ${CHECK} }
    </span>
  `,
})
export class UiDropdownMenuCheckboxItem extends UiMenuItemBase {
  readonly checked = model(false);
  readonly inset = input(false, { transform: booleanAttribute });
  protected readonly classes = computed(() => cn(CHECKBOX_CLASS, this.userClass()));
  protected override beforeSelect(): void {
    this.checked.update((v) => !v);
  }
}

@Directive({
  selector: '[uiDropdownMenuRadioGroup], ui-dropdown-menu-radio-group', hostDirectives: [UiElementHost],
  host: { role: 'group', 'data-slot': 'dropdown-menu-radio-group' },
})
export class UiDropdownMenuRadioGroup {
  readonly value = model<string | undefined>(undefined);
}

@Component({
  selector: '[uiDropdownMenuRadioItem], ui-dropdown-menu-radio-item', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: UI_MENU_ITEM, useExisting: forwardRef(() => UiDropdownMenuRadioItem) }],
  host: {
    tabindex: '-1',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.aria-disabled]': 'disabled ? "true" : null',
    '[attr.data-highlighted]': 'highlighted() ? "" : null',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(pointermove)': 'onPointerMove()',
    '(pointerleave)': 'onPointerLeave()',
    '(click)': 'activate()',
    'data-slot': 'dropdown-menu-radio-item',
    role: 'menuitemradio',
    '[attr.aria-checked]': 'checked()',
    '[attr.data-state]': 'checked() ? "checked" : "unchecked"',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[attr.class]': 'classes()',
  },
  template: `
    <ng-content />
    <span class="pointer-events-none absolute end-2 flex items-center justify-center" data-slot="dropdown-menu-radio-item-indicator">
      @if (checked()) { ${CHECK} }
    </span>
  `,
})
export class UiDropdownMenuRadioItem extends UiMenuItemBase {
  private readonly group = inject(UiDropdownMenuRadioGroup);
  readonly value = input<string>('');
  readonly inset = input(false, { transform: booleanAttribute });
  protected readonly checked = computed(() => this.group.value() === this.value());
  protected readonly classes = computed(() => cn(RADIO_CLASS, this.userClass()));
  protected override beforeSelect(): void {
    this.group.value.set(this.value());
  }
}

/** Sub-menu: <div uiDropdownMenuSub><div uiDropdownMenuSubTrigger>More</div><div uiDropdownMenuSubContent>…</div></div> */
@Directive({
  selector: '[uiDropdownMenuSub], ui-dropdown-menu-sub', hostDirectives: [UiElementHost],
  providers: [
    { provide: UI_MENU_CTX, useExisting: forwardRef(() => UiDropdownMenuSub) },
    { provide: UI_MENU_SUB, useExisting: forwardRef(() => UiDropdownMenuSub) },
  ],
})
export class UiDropdownMenuSub extends UiMenuSubBase {}

@Component({
  selector: '[uiDropdownMenuSubTrigger], ui-dropdown-menu-sub-trigger', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: UI_MENU_ITEM, useExisting: forwardRef(() => UiDropdownMenuSubTrigger) }],
  host: {
    tabindex: '-1',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.aria-disabled]': 'disabled ? "true" : null',
    '[attr.data-highlighted]': 'highlighted() ? "" : null',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(pointermove)': 'onPointerMove()',
    '(pointerleave)': 'onPointerLeave()',
    '(click)': 'activate()',
    'data-slot': 'dropdown-menu-sub-trigger',
    role: 'menuitem',
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'sub.open()',
    '[attr.data-state]': 'sub.open() ? "open" : "closed"',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[attr.class]': 'classes()',
  },
  template: `
    <ng-content />
    <svg uiIcon="chevron-right" class="ms-auto rtl:rotate-180"></svg>
  `,
})
export class UiDropdownMenuSubTrigger extends UiMenuSubTriggerBase {
  readonly inset = input(false, { transform: booleanAttribute });
  protected readonly classes = computed(() => cn(SUB_TRIGGER_CLASS, this.userClass()));
}

@Directive({
  selector: '[uiDropdownMenuSubContent], ui-dropdown-menu-sub-content', hostDirectives: [UiElementHost],
  host: {
    role: 'menu',
    'aria-orientation': 'vertical',
    'data-slot': 'dropdown-menu-sub-content',
    tabindex: '-1',
    '[attr.data-state]': 'root.state()',
    '[attr.dir]': 'dir.value',
    '[attr.class]': 'classes()',
    '(keydown)': 'onMenuKeydown($event)',
  },
})
export class UiDropdownMenuSubContent extends UiMenuContentBase {
  protected readonly root = inject(UiDropdownMenuSub);
  protected readonly menu = this.root;
  protected readonly varPrefix = '--radix-dropdown-menu';
  override readonly side = input<'top' | 'right' | 'bottom' | 'left'>('right');
  override readonly align = input<Align>('start');
  override readonly sideOffset = input(0);
  private readonly items = contentChildren<UiMenuItemBase>(UI_MENU_ITEM, { descendants: true });
  protected readonly classes = computed(() => cn(CONTENT_CLASS, 'w-auto', this.userClass()));
  protected menuItems(): readonly UiMenuItemBase[] {
    return this.items();
  }
  constructor() {
    super();
    this.isSub = true;
    this.init();
  }
}

@Directive({
  selector: '[uiDropdownMenuLabel], ui-dropdown-menu-label', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'dropdown-menu-label', '[attr.data-inset]': 'inset() ? "" : null', '[attr.class]': 'classes()' },
})
export class UiDropdownMenuLabel {
  readonly inset = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(LABEL_CLASS, this.userClass()));
}

@Directive({
  selector: '[uiDropdownMenuSeparator], ui-dropdown-menu-separator', hostDirectives: [UiElementHost],
  host: { role: 'separator', 'aria-orientation': 'horizontal', 'data-slot': 'dropdown-menu-separator', '[attr.class]': 'classes()' },
})
export class UiDropdownMenuSeparator {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(SEPARATOR_CLASS, this.userClass()));
}

@Directive({
  selector: '[uiDropdownMenuShortcut], ui-dropdown-menu-shortcut', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'dropdown-menu-shortcut', '[attr.class]': 'classes()' },
})
export class UiDropdownMenuShortcut {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(SHORTCUT_CLASS, this.userClass()));
}

@Directive({
  selector: '[uiDropdownMenuGroup], ui-dropdown-menu-group', hostDirectives: [UiElementHost],
  host: { role: 'group', 'data-slot': 'dropdown-menu-group' },
})
export class UiDropdownMenuGroup {}

export const UI_DROPDOWN_MENU = [
  UiDropdownMenu,
  UiDropdownMenuTrigger,
  UiDropdownMenuContent,
  UiDropdownMenuItem,
  UiDropdownMenuCheckboxItem,
  UiDropdownMenuRadioGroup,
  UiDropdownMenuRadioItem,
  UiDropdownMenuSub,
  UiDropdownMenuSubTrigger,
  UiDropdownMenuSubContent,
  UiDropdownMenuLabel,
  UiDropdownMenuSeparator,
  UiDropdownMenuShortcut,
  UiDropdownMenuGroup,
] as const;
