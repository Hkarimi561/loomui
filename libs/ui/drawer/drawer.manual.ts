import { computed, Directive, ElementRef, inject, input, booleanAttribute } from '@angular/core';
import { buttonVariants } from '@loomui/ui/button';
import { cn } from '@loomui/ui/utils';
import { UiModalContentBase, UiModalRoot, type ModalContentConfig } from '@loomui/ui/utils';
import {
  drawerContentClass,
  drawerDescriptionClass,
  drawerFooterClass,
  drawerHeaderClass,
  drawerOverlayClass,
  drawerTitleClass,
} from './drawer';
import { UiElementHost } from '@loomui/ui/utils';

type Direction = 'top' | 'bottom' | 'left' | 'right';

/**
 * <div uiDrawer direction="bottom" class="contents">
 *   <button uiButton variant="outline" uiDrawerTrigger>Open</button>
 *   <div uiDrawerContent> <div uiDrawerHeader>…</div> <div uiDrawerFooter>…</div> </div>
 * </div>
 * The original wraps `vaul`; observed attributes (data-vaul-*) are reproduced. Drag-to-dismiss is implemented with pointer
 * events (distance > 30% of the drawer or a fast flick closes it); snap points and nested-drawer scaling are not.
 */
@Directive({ selector: '[uiDrawer], ui-drawer', hostDirectives: [UiElementHost], exportAs: 'uiDrawer' })
export class UiDrawer extends UiModalRoot {
  readonly direction = input<Direction>('bottom');
}

@Directive({
  selector: '[uiDrawerTrigger], ui-drawer-trigger', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'drawer-trigger',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': 'root.open()',
    '[attr.aria-controls]': 'root.id',
    '[attr.data-state]': 'root.open() ? "open" : "closed"',
    '(click)': 'root.toggle()',
  },
})
export class UiDrawerTrigger {
  protected readonly root = inject(UiDrawer);
  constructor() {
    this.root.trigger.set(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement);
  }
}

// vaul animates with JS transforms; here tw-animate-css slide utilities play the same role (UNKNOWN on the live classes).
const SLIDE =
  'duration-300 data-open:animate-in data-closed:animate-out data-[vaul-drawer-direction=bottom]:data-open:slide-in-from-bottom data-[vaul-drawer-direction=bottom]:data-closed:slide-out-to-bottom data-[vaul-drawer-direction=top]:data-open:slide-in-from-top data-[vaul-drawer-direction=top]:data-closed:slide-out-to-top data-[vaul-drawer-direction=left]:data-open:slide-in-from-left data-[vaul-drawer-direction=left]:data-closed:slide-out-to-left data-[vaul-drawer-direction=right]:data-open:slide-in-from-right data-[vaul-drawer-direction=right]:data-closed:slide-out-to-right';

@Directive({
  selector: '[uiDrawerContent], ui-drawer-content', hostDirectives: [UiElementHost],
  host: {
    role: 'dialog',
    'data-slot': 'drawer-content',
    'data-vaul-drawer': '',
    tabindex: '-1',
    '[id]': 'root.id',
    '[attr.aria-labelledby]': 'root.titleId',
    '[attr.aria-describedby]': 'root.descriptionId',
    '[attr.data-state]': 'root.state()',
    '[attr.data-vaul-drawer-direction]': 'root.direction()',
    '[attr.class]': 'classes()',
    '(pointerdown)': 'onPointerDown($event)',
  },
})
export class UiDrawerContent extends UiModalContentBase {
  protected readonly root = inject(UiDrawer);
  protected readonly config: ModalContentConfig = { slot: 'drawer', backdropClass: drawerOverlayClass };
  protected readonly classes = computed(() => cn(drawerContentClass, SLIDE, this.userClass()));

  constructor() {
    super();
    this.init();
    queueMicrotask(() => {
      // Grab handle (shown for bottom drawers). Classes follow shadcn's published source (not captured).
      const handle = document.createElement('div');
      handle.setAttribute('data-slot', 'drawer-handle');
      handle.className =
        'mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block';
      this.el.prepend(handle);
    });
  }

  protected onPointerDown(e: PointerEvent): void {
    if (e.button !== 0 || (e.target as HTMLElement).closest('input, textarea, select, button, a, [contenteditable]')) return;
    const dir = this.root.direction();
    const axis = dir === 'left' || dir === 'right' ? 'x' : 'y';
    const sign = dir === 'bottom' || dir === 'right' ? 1 : -1;
    const size = axis === 'x' ? this.el.offsetWidth : this.el.offsetHeight;
    const start = axis === 'x' ? e.clientX : e.clientY;
    const t0 = performance.now();
    let delta = 0;
    this.el.setPointerCapture?.(e.pointerId);
    const move = (ev: PointerEvent) => {
      delta = Math.max(0, sign * ((axis === 'x' ? ev.clientX : ev.clientY) - start));
      this.el.style.transition = 'none';
      this.el.style.transform = axis === 'x' ? `translateX(${sign * delta}px)` : `translateY(${sign * delta}px)`;
    };
    const up = () => {
      this.el.removeEventListener('pointermove', move);
      this.el.removeEventListener('pointerup', up);
      this.el.removeEventListener('pointercancel', up);
      const velocity = delta / Math.max(1, performance.now() - t0);
      this.el.style.transition = '';
      if (delta > size * 0.3 || (delta > 20 && velocity > 0.4)) this.root.close();
      this.el.style.transform = '';
    };
    this.el.addEventListener('pointermove', move);
    this.el.addEventListener('pointerup', up);
    this.el.addEventListener('pointercancel', up);
  }
}

@Directive({
  selector: '[uiDrawerHeader], ui-drawer-header', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'drawer-header', '[attr.class]': 'classes()' },
})
export class UiDrawerHeader {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(drawerHeaderClass, this.userClass()));
}

@Directive({
  selector: '[uiDrawerFooter], ui-drawer-footer', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'drawer-footer', '[attr.class]': 'classes()' },
})
export class UiDrawerFooter {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(drawerFooterClass, this.userClass()));
}

@Directive({
  selector: '[uiDrawerTitle], ui-drawer-title', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'drawer-title', '[id]': 'root.titleId', '[attr.class]': 'classes()' },
})
export class UiDrawerTitle {
  protected readonly root = inject(UiDrawer);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(drawerTitleClass, this.userClass()));
}

@Directive({
  selector: '[uiDrawerDescription], ui-drawer-description', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'drawer-description', '[id]': 'root.descriptionId', '[attr.class]': 'classes()' },
})
export class UiDrawerDescription {
  protected readonly root = inject(UiDrawer);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(drawerDescriptionClass, this.userClass()));
}

/** Observed: outline Button. */
@Directive({
  selector: 'button[uiDrawerClose], ui-drawer-close', hostDirectives: [UiElementHost],
  host: { '[attr.disabled]': 'disabled() ? "" : null',
    type: 'button',
    'data-slot': 'drawer-close',
    'data-variant': 'outline',
    'data-size': 'default',
    '[attr.class]': 'classes()',
    '(click)': 'root.close()',
  },
})
export class UiDrawerClose {
  /** Reflected as the `disabled` attribute so it also works on the custom element. */
  readonly disabled = input(false, { transform: booleanAttribute });
  protected readonly root = inject(UiDrawer);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(buttonVariants({ variant: 'outline' }), this.userClass()));
}

export const UI_DRAWER = [
  UiDrawer,
  UiDrawerTrigger,
  UiDrawerContent,
  UiDrawerHeader,
  UiDrawerFooter,
  UiDrawerTitle,
  UiDrawerDescription,
  UiDrawerClose,
] as const;
