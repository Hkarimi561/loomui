import {
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import { UI_MENU_CTX, UI_MENU_ITEM, UiMenuContentBase, UiMenuItemBase, UiMenuRootBase } from '@loomui-ng/ui/utils';
import { type Align } from '@loomui-ng/ui/utils';
import { menubarClass, menubarContentClass, menubarTriggerClass } from './menubar';
import { MENUBAR_SHARED } from './menubar.shared';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * <div uiMenubar class="w-72">
 *   <div uiMenubarMenu>
 *     <button uiMenubarTrigger>File</button>
 *     <div uiMenubarContent> <div uiMenubarItem>New</div> … </div>
 *   </div>
 * </div>
 * Observed: role="menubar", triggers role="menuitem" with roving tabindex (0/-1), content `data-radix-menubar-content`.
 * Behavior: ArrowLeft/Right move between triggers; while one menu is open, ArrowLeft/Right (outside sub-menus) and hovering
 * another trigger switch menus. The root tabindex=0 seen on the live page is omitted (it would add a second tab stop).
 */
@Directive({
  selector: '[uiMenubar], ui-menubar', hostDirectives: [UiElementHost],
  exportAs: 'uiMenubar',
  host: {
    role: 'menubar',
    'data-slot': 'menubar',
    'data-orientation': 'horizontal',
    '[attr.class]': 'classes()',
  },
})
export class UiMenubar {
  readonly userClass = input<string>('', { alias: 'class' });
  readonly menus = contentChildren(forwardRef(() => UiMenubarMenu), { descendants: true });
  readonly active = signal<UiMenubarMenu | null>(null);
  /** Last trigger that had focus/was open: it stays the roving tab stop after the menu closes. */
  readonly lastActive = signal<UiMenubarMenu | null>(null);
  protected readonly classes = computed(() => cn(menubarClass, this.userClass()));

  activate(menu: UiMenubarMenu | null): void {
    this.active.set(menu);
    if (menu) this.lastActive.set(menu);
    for (const m of this.menus()) if (m !== menu && m.open()) m.open.set(false);
  }

  /** Move to the neighbouring menu (wraps); open it when `open` is true. */
  step(from: UiMenubarMenu, dir: 'prev' | 'next', open: boolean): void {
    const menus = this.menus();
    const i = menus.indexOf(from);
    const target = menus[(i + (dir === 'next' ? 1 : -1) + menus.length) % menus.length];
    if (!target) return;
    target.keyboardOpen = open ? 'first' : null;
    target.triggerEl()?.focus();
    if (open) {
      this.activate(target);
      target.open.set(true);
    }
  }

  /** Roving tabindex: the first trigger is the tab stop (or the open menu's). */
  tabStop = computed(() => this.active() ?? this.lastActive() ?? this.menus()[0] ?? null);
}

@Directive({
  selector: '[uiMenubarMenu], ui-menubar-menu', hostDirectives: [UiElementHost],
  exportAs: 'uiMenubarMenu',
  providers: [{ provide: UI_MENU_CTX, useExisting: forwardRef(() => UiMenubarMenu) }],
})
export class UiMenubarMenu extends UiMenuRootBase {
  readonly bar = inject(UiMenubar);
  readonly triggerEl = this.trigger;

  constructor() {
    super();
    effect(() => {
      const open = this.open();
      untracked(() => {
        if (open) this.bar.activate(this);
        else if (this.bar.active() === this) this.bar.active.set(null);
      });
    });
  }

  horizontal(dir: 'prev' | 'next'): void {
    this.bar.step(this, dir, true);
  }
}

@Directive({
  selector: '[uiMenubarTrigger], ui-menubar-trigger', hostDirectives: [UiElementHost],
  host: {
    role: 'menuitem',
    'aria-haspopup': 'menu',
    'data-slot': 'menubar-trigger',
    'data-orientation': 'horizontal',
    '[attr.id]': 'menu.triggerId()',
    '[attr.aria-expanded]': 'menu.open()',
    '[attr.aria-controls]': 'menu.open() ? menu.id : null',
    '[attr.data-state]': 'menu.open() ? "open" : "closed"',
    '[attr.tabindex]': 'menu.bar.tabStop() === menu ? 0 : -1',
    '[attr.class]': 'classes()',
    '(click)': 'onClick()',
    '(focus)': 'menu.bar.lastActive.set(menu)',
    '(pointerenter)': 'onEnter()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiMenubarTrigger {
  protected readonly menu = inject(UiMenubarMenu);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(menubarTriggerClass, this.userClass()));

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    this.menu.trigger.set(el);
    this.menu.triggerId.set(el.id || `${this.menu.id}-trigger`);
  }

  protected onClick(): void {
    this.menu.keyboardOpen = null;
    this.menu.toggle();
  }
  protected onEnter(): void {
    const active = this.menu.bar.active();
    if (active && active !== this.menu) {
      this.menu.keyboardOpen = null;
      this.menu.open.set(true);
    }
  }
  protected onKeydown(e: KeyboardEvent): void {
    const rtl = this.menu.dirIsRtl();
    const next = rtl ? 'ArrowLeft' : 'ArrowRight';
    const prev = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.menu.keyboardOpen = 'first';
      this.menu.open.set(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.menu.keyboardOpen = 'last';
      this.menu.open.set(true);
    } else if (e.key === next) {
      e.preventDefault();
      this.menu.bar.step(this.menu, 'next', false);
    } else if (e.key === prev) {
      e.preventDefault();
      this.menu.bar.step(this.menu, 'prev', false);
    }
  }
}

@Directive({
  selector: '[uiMenubarContent], ui-menubar-content', hostDirectives: [UiElementHost],
  host: {
    role: 'menu',
    'aria-orientation': 'vertical',
    'data-slot': 'menubar-content',
    'data-orientation': 'vertical',
    'data-radix-menubar-content': '',
    tabindex: '-1',
    '[id]': 'root.id',
    '[attr.aria-labelledby]': 'root.triggerId()',
    '[attr.data-state]': 'root.state()',
    '[attr.dir]': 'dir.value',
    '[attr.class]': 'classes()',
    '(keydown)': 'onMenuKeydown($event)',
  },
})
export class UiMenubarContent extends UiMenuContentBase {
  protected readonly root = inject(UiMenubarMenu);
  protected readonly menu = this.root;
  protected readonly varPrefix = '--radix-menubar';
  override readonly align = input<Align>('start');
  override readonly sideOffset = input(8);
  private readonly items = contentChildren<UiMenuItemBase>(UI_MENU_ITEM, { descendants: true });
  protected readonly classes = computed(() => cn(menubarContentClass, this.userClass()));
  protected menuItems(): readonly UiMenuItemBase[] {
    return this.items();
  }
  constructor() {
    super();
    this.init();
  }
}

export const UI_MENUBAR = [UiMenubar, UiMenubarMenu, UiMenubarTrigger, UiMenubarContent, ...MENUBAR_SHARED] as const;
