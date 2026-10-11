import { Directionality } from '@angular/cdk/bidi';
import { computed, contentChildren, Directive, ElementRef, forwardRef, inject, input } from '@angular/core';
import { cn } from '@loomui/ui/utils';
import { UI_MENU_CTX, UI_MENU_ITEM, UiMenuContentBase, UiMenuItemBase, UiMenuRootBase } from '@loomui/ui/utils';
import { type Align, type Side } from '@loomui/ui/utils';
import { contextMenuContentClass } from './context-menu';
import { CONTEXT_MENU_SHARED } from './context-menu.shared';
import { UiElementHost } from '@loomui/ui/utils';

/**
 * <div uiContextMenu class="contents">
 *   <div uiContextMenuTrigger class="…">Right click here</div>
 *   <div uiContextMenuContent>…items…</div>
 * </div>
 * Opens at the pointer on `contextmenu` (right click) and on Shift+F10 / the ContextMenu key.
 */
@Directive({
  selector: '[uiContextMenu], ui-context-menu', hostDirectives: [UiElementHost],
  exportAs: 'uiContextMenu',
  providers: [{ provide: UI_MENU_CTX, useExisting: forwardRef(() => UiContextMenu) }],
})
export class UiContextMenu extends UiMenuRootBase {}

@Directive({
  selector: '[uiContextMenuTrigger], ui-context-menu-trigger', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'context-menu-trigger',
    '[attr.data-state]': 'root.open() ? "open" : "closed"',
    '(contextmenu)': 'onContext($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiContextMenuTrigger {
  protected readonly root = inject(UiContextMenu);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  constructor() {
    this.root.trigger.set(this.el);
  }
  protected onContext(e: MouseEvent): void {
    e.preventDefault();
    this.root.anchorPoint.set({ x: e.clientX, y: e.clientY });
    this.root.keyboardOpen = null;
    this.root.open.set(true);
  }
  protected onKeydown(e: KeyboardEvent): void {
    if (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) {
      e.preventDefault();
      const r = this.el.getBoundingClientRect();
      this.root.anchorPoint.set({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      this.root.keyboardOpen = 'first';
      this.root.open.set(true);
    }
  }
}

@Directive({
  selector: '[uiContextMenuContent], ui-context-menu-content', hostDirectives: [UiElementHost],
  host: {
    role: 'menu',
    'aria-orientation': 'vertical',
    'data-slot': 'context-menu-content',
    'data-orientation': 'vertical',
    tabindex: '-1',
    '[id]': 'root.id',
    '[attr.data-state]': 'root.state()',
    '[attr.dir]': 'dir.value',
    '[attr.class]': 'classes()',
    '(keydown)': 'onMenuKeydown($event)',
  },
})
export class UiContextMenuContent extends UiMenuContentBase {
  protected readonly root = inject(UiContextMenu);
  protected readonly menu = this.root;
  protected readonly varPrefix = '--radix-context-menu';
  override readonly side = input<Side>('right');
  override readonly align = input<Align>('start');
  override readonly sideOffset = input(2);
  private readonly items = contentChildren<UiMenuItemBase>(UI_MENU_ITEM, { descendants: true });
  protected readonly classes = computed(() => cn(contextMenuContentClass, this.userClass()));
  protected menuItems(): readonly UiMenuItemBase[] {
    return this.items();
  }
  constructor() {
    super();
    this.init();
  }
}

export const UI_CONTEXT_MENU = [UiContextMenu, UiContextMenuTrigger, UiContextMenuContent, ...CONTEXT_MENU_SHARED] as const;
void Directionality;
