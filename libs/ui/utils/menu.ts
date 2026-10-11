import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import {
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  InjectionToken,
  input,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { UiLayerRoot } from './layer';
import { UiPopperContentBase } from './popper';

/**
 * Shared kit behind DropdownMenu, ContextMenu and Menubar (Radix Menu equivalent): items, sub-menus, roving focus,
 * typeahead and keyboard rules live here; the three components only add their own roots, triggers and classes.
 */
export class UiMenuSelectEvent {
  defaultPrevented = false;
  preventDefault(): void {
    this.defaultPrevented = true;
  }
}

/** What an item/content needs from "its" menu (a root menu or a sub-menu). */
export interface MenuCtx {
  readonly manager: WritableSignal<FocusKeyManager<UiMenuItemBase> | null>;
  readonly contentEl: WritableSignal<HTMLElement | null>;
  readonly childPanes: Set<HTMLElement>;
  readonly dirIsRtl: () => boolean;
  /** Close the whole menu tree (after selecting an item). */
  closeAll(): void;
  /** Menubar: ArrowLeft/Right inside an open menu moves to the neighbouring menu. */
  horizontal?(dir: 'prev' | 'next'): void;
}
export const UI_MENU_CTX = new InjectionToken<MenuCtx>('UI_MENU_CTX');
export const UI_MENU_ITEM = new InjectionToken<UiMenuItemBase>('UI_MENU_ITEM');
export const UI_MENU_SUB = new InjectionToken<UiMenuSubBase>('UI_MENU_SUB');

@Directive()
export abstract class UiMenuRootBase extends UiLayerRoot implements MenuCtx {
  /** Set by the trigger when opened with the keyboard so the content can focus the first/last item. */
  keyboardOpen: 'first' | 'last' | null = null;
  readonly manager = signal<FocusKeyManager<UiMenuItemBase> | null>(null);
  readonly triggerId = signal<string>('');
  private readonly directionality = inject(Directionality);
  dirIsRtl = (): boolean => this.directionality.value === 'rtl';
  closeAll(): void {
    this.close();
  }
}

@Directive()
export abstract class UiMenuItemBase implements FocusableOption {
  readonly ctx = inject(UI_MENU_CTX);
  protected readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly select = output<UiMenuSelectEvent>();
  readonly highlighted = signal(false);
  readonly userClass = input<string>('', { alias: 'class' });

  get disabled(): boolean {
    return this.disabledInput();
  }
  focus(): void {
    this.el.focus();
  }
  getLabel(): string {
    return (this.el.textContent ?? '').trim();
  }
  protected onFocus(): void {
    this.highlighted.set(true);
  }
  protected onBlur(): void {
    this.highlighted.set(false);
  }
  protected onPointerMove(): void {
    if (this.disabled || this.highlighted()) return;
    const m = this.ctx.manager();
    if (m) m.setActiveItem(this as UiMenuItemBase);
    else this.focus();
  }
  protected onPointerLeave(): void {
    if (this.highlighted() && !this.keepFocusOnLeave()) this.ctx.contentEl()?.focus();
  }
  protected keepFocusOnLeave(): boolean {
    return false;
  }
  /** Run by click or Enter/Space. */
  activate(): void {
    if (this.disabled) return;
    this.beforeSelect();
    const ev = new UiMenuSelectEvent();
    this.select.emit(ev);
    if (!ev.defaultPrevented) this.ctx.closeAll();
  }
  protected beforeSelect(): void {}
  /** Sub-menu triggers override to open on ArrowRight/ArrowLeft (direction-aware). */
  openOnArrow(): boolean {
    return false;
  }
}

/** Host bindings shared by every menu item directive (spread into `host`; override `data-slot`). */
export const MENU_ITEM_HOST = {
  tabindex: '-1',
  '[attr.data-disabled]': 'disabled ? "" : null',
  '[attr.aria-disabled]': 'disabled ? "true" : null',
  '[attr.data-highlighted]': 'highlighted() ? "" : null',
  '(focus)': 'onFocus()',
  '(blur)': 'onBlur()',
  '(pointermove)': 'onPointerMove()',
  '(pointerleave)': 'onPointerLeave()',
  '(click)': 'activate()',
};

/** A sub-menu root: it is itself a menu context nested in its parent's. */
@Directive()
export abstract class UiMenuSubBase extends UiMenuRootBase {
  readonly parent = inject(UI_MENU_CTX, { skipSelf: true });
  override closeAll(): void {
    this.parent.closeAll();
  }
  override dirIsRtl = (): boolean => this.parent.dirIsRtl();
}

@Directive()
export abstract class UiMenuSubTriggerBase extends UiMenuItemBase {
  protected readonly sub = inject(UI_MENU_SUB);
  /** The trigger is an item of the PARENT menu (the nearest UI_MENU_CTX is the sub-menu it opens). */
  override readonly ctx: MenuCtx = this.sub.parent;
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    super();
    this.sub.trigger.set(this.el);
  }
  override activate(): void {
    if (this.disabled) return;
    this.sub.keyboardOpen = 'first';
    this.sub.open.set(true);
  }
  override openOnArrow(): boolean {
    this.activate();
    return true;
  }
  protected override keepFocusOnLeave(): boolean {
    return this.sub.open();
  }
  protected override onPointerMove(): void {
    super.onPointerMove();
    if (this.disabled || this.sub.open()) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.sub.keyboardOpen = null;
      this.sub.open.set(true);
    }, 100);
  }
}

@Directive()
export abstract class UiMenuContentBase extends UiPopperContentBase {
  protected abstract readonly menu: UiMenuRootBase;
  protected abstract menuItems(): readonly UiMenuItemBase[];
  private manager: FocusKeyManager<UiMenuItemBase> | null = null;

  /** Content of a sub-menu closes itself on the "back" arrow. */
  protected isSub = false;

  protected override onAttached(): void {
    const items = this.menuItems().filter((i) => i.ctx === (this.menu as MenuCtx));
    this.manager = new FocusKeyManager<UiMenuItemBase>([...items])
      .withVerticalOrientation()
      .withHomeAndEnd()
      .withTypeAhead(150)
      .skipPredicate((i) => i.disabled);
    this.menu.manager.set(this.manager);
    queueMicrotask(() => {
      if (this.menu.keyboardOpen === 'first') this.manager?.setFirstItemActive();
      else if (this.menu.keyboardOpen === 'last') this.manager?.setLastItemActive();
      else this.el.focus();
    });
  }

  protected override onDetached(): void {
    if (this.isSub) (this.menu as unknown as { parent: MenuCtx }).parent.childPanes.delete(this.el);
    this.manager = null;
    this.menu.manager.set(null);
    this.menu.keyboardOpen = null;
  }

  protected onMenuKeydown(e: KeyboardEvent): void {
    if (e.key === 'Tab') return e.preventDefault(); // Radix menus keep focus inside; Tab does nothing
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.manager?.activeItem?.activate();
      return;
    }
    const rtl = this.menu.dirIsRtl();
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === forward) {
      const item = this.manager?.activeItem;
      if (item?.openOnArrow()) {
        e.preventDefault();
        return;
      }
      if (!this.isSub) {
        e.preventDefault();
        (this.menu as MenuCtx).horizontal?.('next');
      }
      return;
    }
    if (e.key === back) {
      e.preventDefault();
      if (this.isSub) this.menu.close();
      else (this.menu as MenuCtx).horizontal?.('prev');
      return;
    }
    this.manager?.onKeydown(e);
  }

  protected override registerChildPane(): void {
    if (this.isSub) {
      const parent = (this.menu as unknown as { parent: MenuCtx }).parent;
      parent.childPanes.add(this.el);
      this.menu.contentEl.set(this.el);
    }
  }
}
