import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import { nextId } from '@loomui-ng/ui/utils';
import {
  navigationMenuClass,
  navigationMenuContentClass,
  navigationMenuItemClass,
  navigationMenuLinkClass,
  navigationMenuListClass,
  navigationMenuTriggerClass,
} from './navigation-menu';
import { UiIconSvg } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * <nav uiNavigationMenu>
 *   <ul uiNavigationMenuList>
 *     <li uiNavigationMenuItem>
 *       <button uiNavigationMenuTrigger>Getting started</button>
 *       <div uiNavigationMenuContent> <a uiNavigationMenuLink href="/docs">Docs</a> </div>
 *     </li>
 *     <li uiNavigationMenuItem><a uiNavigationMenuLink href="/pricing">Pricing</a></li>
 *   </ul>
 * </nav>
 * Observed (Radix): nav[aria-label=Main][data-orientation][data-viewport], triggers with aria-expanded/data-state.
 * Deviation: always the "viewport=false" layout — content opens under its own item (no shared animated viewport that morphs
 * between items). Hover opens after 200ms, click toggles, Esc closes, ArrowLeft/Right move between triggers (RTL-mirrored),
 * ArrowDown opens and focuses the first link.
 */
@Directive({
  selector: 'nav[uiNavigationMenu], ui-navigation-menu', hostDirectives: [UiElementHost],
  exportAs: 'uiNavigationMenu',
  host: {
    'aria-label': 'Main',
    'data-slot': 'navigation-menu',
    'data-orientation': 'horizontal',
    'data-viewport': 'false',
    '[attr.dir]': 'dir.value',
    '[attr.class]': 'classes()',
  },
})
export class UiNavigationMenu {
  readonly delay = input(200, { transform: numberAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  readonly dir = inject(Directionality);
  readonly value = signal<string | null>(null);
  readonly triggers = contentChildren(forwardRef(() => UiNavigationMenuTrigger), { descendants: true });
  protected readonly classes = computed(() => cn(navigationMenuClass, this.userClass()));
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }
  openNow(id: string): void {
    clearTimeout(this.timer);
    this.value.set(id);
  }
  openSoon(id: string): void {
    clearTimeout(this.timer);
    this.timer = this.value() ? undefined : setTimeout(() => this.value.set(id), this.delay());
    if (this.value()) this.value.set(id);
  }
  closeSoon(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.value.set(null), 150);
  }
  keep(): void {
    clearTimeout(this.timer);
  }
  close(): void {
    clearTimeout(this.timer);
    this.value.set(null);
  }
}

@Directive({
  selector: 'ul[uiNavigationMenuList], ui-navigation-menu-list', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'navigation-menu-list', 'data-orientation': 'horizontal', '[attr.class]': 'classes()' },
})
export class UiNavigationMenuList {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(navigationMenuListClass, this.userClass()));
}

@Directive({
  selector: 'li[uiNavigationMenuItem], ui-navigation-menu-item', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'navigation-menu-item', '[attr.class]': 'classes()' },
})
export class UiNavigationMenuItem {
  readonly id = nextId('ui-nav');
  readonly userClass = input<string>('', { alias: 'class' });
  // Observed item class carries `hidden md:flex` from the site header demo; the base item is just `relative`.
  protected readonly classes = computed(() => cn(navigationMenuItemClass.replace('hidden md:flex', 'flex'), this.userClass()));
}

@Component({
  selector: 'button[uiNavigationMenuTrigger], ui-navigation-menu-trigger', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    'data-slot': 'navigation-menu-trigger',
    '[attr.aria-expanded]': 'open()',
    '[attr.aria-controls]': 'item.id + "-content"',
    '[attr.data-state]': 'open() ? "open" : "closed"',
    '[attr.class]': 'classes()',
    '(click)': 'toggle()',
    '(pointerenter)': 'onEnter($event)',
    '(pointerleave)': 'onLeave($event)',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <ng-content />
    <svg uiIcon="chevron-down" class="relative top-px ms-1 size-3 transition duration-300 group-data-open/navigation-menu-trigger:rotate-180"></svg>
  `,
})
export class UiNavigationMenuTrigger {
  protected readonly nav = inject(UiNavigationMenu);
  protected readonly item = inject(UiNavigationMenuItem);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly open = computed(() => this.nav.value() === this.item.id);
  protected readonly classes = computed(() => cn(navigationMenuTriggerClass, this.userClass()));

  protected toggle(): void {
    this.open() ? this.nav.close() : this.nav.openNow(this.item.id);
  }
  protected onEnter(e: PointerEvent): void {
    if (e.pointerType !== 'touch') this.nav.openSoon(this.item.id);
  }
  protected onLeave(e: PointerEvent): void {
    if (e.pointerType !== 'touch') this.nav.closeSoon();
  }
  protected onKeydown(e: KeyboardEvent): void {
    const triggers = this.nav.triggers();
    const i = triggers.indexOf(this);
    const rtl = this.nav.dir.value === 'rtl';
    const next = rtl ? 'ArrowLeft' : 'ArrowRight';
    const prev = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.nav.openNow(this.item.id);
      setTimeout(() => this.el.closest('li')?.querySelector<HTMLElement>('[data-slot=navigation-menu-content] a, [data-slot=navigation-menu-content] button')?.focus(), 0);
    } else if (e.key === 'Escape') {
      this.nav.close();
    } else if (e.key === next || e.key === prev || e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const t = e.key === 'Home' ? 0 : e.key === 'End' ? triggers.length - 1 : (i + (e.key === next ? 1 : -1) + triggers.length) % triggers.length;
      triggers[t]?.el.focus();
    }
  }
}

@Directive({
  selector: '[uiNavigationMenuContent], ui-navigation-menu-content', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'navigation-menu-content',
    'data-orientation': 'horizontal',
    '[id]': 'item.id + "-content"',
    '[attr.data-state]': 'open() ? "open" : "closed"',
    '[hidden]': '!open()',
    '[attr.class]': 'classes()',
    '(pointerenter)': 'nav.keep()',
    '(pointerleave)': 'nav.closeSoon()',
    '(keydown.escape)': 'onEscape()',
  },
})
export class UiNavigationMenuContent {
  protected readonly nav = inject(UiNavigationMenu);
  protected readonly item = inject(UiNavigationMenuItem);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly open = computed(() => this.nav.value() === this.item.id);
  protected readonly classes = computed(() =>
    cn(
      navigationMenuContentClass,
      'absolute z-50 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
      this.userClass(),
    ),
  );
  protected onEscape(): void {
    this.nav.close();
    this.el.closest('li')?.querySelector<HTMLElement>('[data-slot=navigation-menu-trigger]')?.focus();
  }
}

@Directive({
  selector: 'a[uiNavigationMenuLink], ui-navigation-menu-link', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'navigation-menu-link',
    '[attr.data-active]': 'active() ? "" : null',
    '[attr.aria-current]': 'active() ? "page" : null',
    '[attr.class]': 'classes()',
    '(click)': 'nav.close()',
  },
})
export class UiNavigationMenuLink {
  protected readonly nav = inject(UiNavigationMenu);
  readonly active = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(navigationMenuLinkClass, this.userClass()));
}

export const UI_NAVIGATION_MENU = [
  UiNavigationMenu,
  UiNavigationMenuList,
  UiNavigationMenuItem,
  UiNavigationMenuTrigger,
  UiNavigationMenuContent,
  UiNavigationMenuLink,
] as const;
