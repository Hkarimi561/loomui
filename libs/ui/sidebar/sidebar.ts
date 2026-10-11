import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  inject,
  input,
  model,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { cva } from 'class-variance-authority';
import { buttonVariants } from '@loomui-ng/ui/button';
import { UI_SHEET } from '@loomui-ng/ui/sheet';
import { cn } from '@loomui-ng/ui/utils';
import { UiIconSvg } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * Composable sidebar (shadcn structure): SidebarProvider > Sidebar (+ Inset) with Header/Content/Footer, Groups and Menus.
 *
 * <div uiSidebarProvider>
 *   <aside uiSidebar collapsible="icon">
 *     <div uiSidebarHeader>…</div>
 *     <div uiSidebarContent>
 *       <div uiSidebarGroup>
 *         <div uiSidebarGroupLabel>Platform</div>
 *         <ul uiSidebarMenu><li uiSidebarMenuItem><a uiSidebarMenuButton [isActive]="true">Home</a></li></ul>
 *       </div>
 *     </div>
 *     <div uiSidebarRail></div>
 *   </aside>
 *   <main uiSidebarInset><button uiSidebarTrigger></button>…</main>
 * </div>
 *
 * Behavior: Ctrl/Cmd+B toggles; below 768px the sidebar renders inside the Sheet (left/right) and the trigger opens it;
 * `collapsible`: "offcanvas" slides away, "icon" shrinks to an icon rail, "none" is static. State is exposed through
 * data-state / data-collapsible / data-variant / data-side on the sidebar wrapper (styles key off these via group-data-*).
 * Deviations: `side` is physical (left/right) as in shadcn, not auto-mirrored in RTL; open state is not persisted in a cookie;
 * evidence for this component comes from the docs site's own (customised) sidebar, the rest follows shadcn's source (UNKNOWN: exact live DOM).
 */
@Directive({
  selector: '[uiSidebarProvider], ui-sidebar-provider', hostDirectives: [UiElementHost],
  exportAs: 'uiSidebarProvider',
  host: {
    'data-slot': 'sidebar-wrapper',
    '[style]': '{"--sidebar-width": width(), "--sidebar-width-icon": "3rem"}',
    '[attr.class]': 'classes()',
    '(document:keydown)': 'onKey($event)',
  },
})
export class UiSidebarProvider {
  readonly open = model(true);
  readonly openMobile = model(false);
  readonly width = input('16rem');
  readonly shortcut = input('b');
  readonly userClass = input<string>('', { alias: 'class' });

  readonly isMobile = signal(false);
  readonly state = computed<'expanded' | 'collapsed'>(() => (this.open() ? 'expanded' : 'collapsed'));
  protected readonly classes = computed(() =>
    cn('group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar', this.userClass()),
  );

  constructor() {
    if (typeof matchMedia !== 'undefined') {
      const mq = matchMedia('(max-width: 767px)');
      const update = () => this.isMobile.set(mq.matches);
      update();
      mq.addEventListener('change', update);
      inject(DestroyRef).onDestroy(() => mq.removeEventListener('change', update));
    }
  }

  toggle(): void {
    if (this.isMobile()) this.openMobile.update((v) => !v);
    else this.open.update((v) => !v);
  }

  protected onKey(e: KeyboardEvent): void {
    if (e.key.toLowerCase() === this.shortcut() && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.toggle();
    }
  }
}

@Component({
  selector: '[uiSidebar], ui-sidebar', hostDirectives: [UiElementHost],
  exportAs: 'uiSidebar',
  imports: [NgTemplateOutlet, UI_SHEET],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'sidebar', '[attr.class]': 'hostClasses()', '[attr.data-state]': 'hostState()', '[attr.data-collapsible]': 'hostCollapsible()', '[attr.data-variant]': 'variant()', '[attr.data-side]': 'side()' },
  template: `
    <ng-template #body><ng-content /></ng-template>
    @if (collapsible() === 'none') {
      <div data-sidebar="sidebar" [class]="staticClasses()">
        <ng-container [ngTemplateOutlet]="body" />
      </div>
    } @else if (provider.isMobile()) {
      <div uiSheet class="contents" [(open)]="provider.openMobile">
        <div
          uiSheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          [side]="side()"
          [showCloseButton]="false"
          class="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style="--sidebar-width: 18rem"
        >
          <h2 uiSheetTitle class="sr-only">Sidebar</h2>
          <div class="flex h-full w-full flex-col"><ng-container [ngTemplateOutlet]="body" /></div>
        </div>
      </div>
    } @else {
      <div data-slot="sidebar-gap" [class]="gapClasses()"></div>
      <div data-slot="sidebar-container" [class]="containerClasses()">
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          class="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
        >
          <ng-container [ngTemplateOutlet]="body" />
        </div>
      </div>
    }
  `,
})
export class UiSidebar {
  protected readonly provider = inject(UiSidebarProvider);
  readonly side = input<'left' | 'right'>('left');
  readonly variant = input<'sidebar' | 'floating' | 'inset'>('sidebar');
  readonly collapsible = input<'offcanvas' | 'icon' | 'none'>('offcanvas');
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly hostState = computed(() => this.provider.state());
  protected readonly hostCollapsible = computed(() => (this.provider.state() === 'collapsed' ? this.collapsible() : ''));
  protected readonly hostClasses = computed(() =>
    this.collapsible() === 'none' || this.provider.isMobile()
      ? cn('contents', this.userClass())
      : cn('group peer hidden text-sidebar-foreground md:block', this.userClass()),
  );
  protected readonly staticClasses = computed(() =>
    cn('flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground', this.userClass()),
  );
  private readonly floating = computed(() => this.variant() === 'floating' || this.variant() === 'inset');
  protected readonly gapClasses = computed(() =>
    cn(
      'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
      'group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180',
      this.floating()
        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
    ),
  );
  protected readonly containerClasses = computed(() =>
    cn(
      'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
      this.side() === 'left'
        ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
        : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
      this.floating()
        ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
    ),
  );
}

@Component({
  selector: 'button[uiSidebarTrigger], ui-sidebar-trigger', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    'data-sidebar': 'trigger',
    'data-slot': 'sidebar-trigger',
    '[attr.class]': 'classes()',
    '(click)': 'provider.toggle()',
  },
  template: `<svg uiIcon="panel-left" class="rtl:rotate-180"></svg><span class="sr-only">Toggle Sidebar</span>`,
})
export class UiSidebarTrigger {
  protected readonly provider = inject(UiSidebarProvider);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'size-7', this.userClass()));
}

@Directive({
  selector: 'button[uiSidebarRail], ui-sidebar-rail', hostDirectives: [UiElementHost],
  host: {
    type: 'button',
    'aria-label': 'Toggle Sidebar',
    tabindex: '-1',
    title: 'Toggle Sidebar',
    'data-sidebar': 'rail',
    'data-slot': 'sidebar-rail',
    '[attr.class]': 'classes()',
    '(click)': 'provider.toggle()',
  },
})
export class UiSidebarRail {
  protected readonly provider = inject(UiSidebarProvider);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex',
      'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
      'in-data-[side=left]:in-data-[state=collapsed]:cursor-e-resize in-data-[side=right]:in-data-[state=collapsed]:cursor-w-resize',
      'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
      '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[uiSidebarInset], ui-sidebar-inset', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-inset', '[attr.class]': 'classes()' },
})
export class UiSidebarInset {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'relative flex w-full flex-1 flex-col bg-background',
      'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2',
      this.userClass(),
    ),
  );
}

@Directive({
  selector: '[uiSidebarHeader], ui-sidebar-header', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-header', 'data-sidebar': 'header', '[attr.class]': 'classes()' },
})
export class UiSidebarHeader {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-2 p-2', this.userClass()));
}

@Directive({
  selector: '[uiSidebarFooter], ui-sidebar-footer', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-footer', 'data-sidebar': 'footer', '[attr.class]': 'classes()' },
})
export class UiSidebarFooter {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex flex-col gap-2 p-2', this.userClass()));
}

@Directive({
  selector: '[uiSidebarContent], ui-sidebar-content', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-content', 'data-sidebar': 'content', '[attr.class]': 'classes()' },
})
export class UiSidebarContent {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden', this.userClass()));
}

@Directive({
  selector: '[uiSidebarSeparator], ui-sidebar-separator', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-separator', 'data-sidebar': 'separator', role: 'separator', '[attr.class]': 'classes()' },
})
export class UiSidebarSeparator {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('mx-2 block h-px w-auto shrink-0 bg-sidebar-border', this.userClass()));
}

@Directive({
  selector: '[uiSidebarGroup], ui-sidebar-group', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-group', 'data-sidebar': 'group', '[attr.class]': 'classes()' },
})
export class UiSidebarGroup {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('relative flex w-full min-w-0 flex-col p-2', this.userClass()));
}

@Directive({
  selector: '[uiSidebarGroupLabel], ui-sidebar-group-label', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-group-label', 'data-sidebar': 'group-label', '[attr.class]': 'classes()' },
})
export class UiSidebarGroupLabel {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>ui-icon]:size-4 [&>svg]:shrink-0 [&>ui-icon]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0', this.userClass()));
}

@Directive({
  selector: 'button[uiSidebarGroupAction], ui-sidebar-group-action', hostDirectives: [UiElementHost],
  host: { '[attr.disabled]': 'disabled() ? "" : null', 'data-slot': 'sidebar-group-action', 'data-sidebar': 'group-action', type: 'button', '[attr.class]': 'classes()' },
})
export class UiSidebarGroupAction {
  /** Reflected as the `disabled` attribute so it also works on the custom element. */
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('absolute top-3.5 end-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>ui-icon]:size-4 [&>svg]:shrink-0 [&>ui-icon]:shrink-0 after:absolute after:-inset-2 md:after:hidden group-data-[collapsible=icon]:hidden', this.userClass()));
}

@Directive({
  selector: '[uiSidebarGroupContent], ui-sidebar-group-content', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-group-content', 'data-sidebar': 'group-content', '[attr.class]': 'classes()' },
})
export class UiSidebarGroupContent {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('w-full text-sm', this.userClass()));
}

@Directive({
  selector: 'ul[uiSidebarMenu], ui-sidebar-menu', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-menu', 'data-sidebar': 'menu', '[attr.class]': 'classes()' },
})
export class UiSidebarMenu {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('flex w-full min-w-0 flex-col gap-1 list-none m-0 p-0', this.userClass()));
}

@Directive({
  selector: 'li[uiSidebarMenuItem], ui-sidebar-menu-item', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-menu-item', 'data-sidebar': 'menu-item', '[attr.class]': 'classes()' },
})
export class UiSidebarMenuItem {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('group/menu-item relative', this.userClass()));
}

@Directive({
  selector: 'button[uiSidebarMenuAction], ui-sidebar-menu-action', hostDirectives: [UiElementHost],
  host: { '[attr.disabled]': 'disabled() ? "" : null', 'data-slot': 'sidebar-menu-action', 'data-sidebar': 'menu-action', type: 'button', '[attr.class]': 'classes()' },
})
export class UiSidebarMenuAction {
  /** Reflected as the `disabled` attribute so it also works on the custom element. */
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('absolute top-1.5 end-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>ui-icon]:size-4 [&>svg]:shrink-0 [&>ui-icon]:shrink-0 after:absolute after:-inset-2 md:after:hidden peer-data-[size=sm]/menu-button:top-1 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 group-data-[collapsible=icon]:hidden', this.userClass()));
}

@Directive({
  selector: '[uiSidebarMenuBadge], ui-sidebar-menu-badge', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-menu-badge', 'data-sidebar': 'menu-badge', '[attr.class]': 'classes()' },
})
export class UiSidebarMenuBadge {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('pointer-events-none absolute end-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground peer-data-[size=sm]/menu-button:top-1 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 group-data-[collapsible=icon]:hidden', this.userClass()));
}

@Directive({
  selector: 'ul[uiSidebarMenuSub], ui-sidebar-menu-sub', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-menu-sub', 'data-sidebar': 'menu-sub', '[attr.class]': 'classes()' },
})
export class UiSidebarMenuSub {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-s border-sidebar-border px-2.5 py-0.5 list-none group-data-[collapsible=icon]:hidden', this.userClass()));
}

@Directive({
  selector: 'li[uiSidebarMenuSubItem], ui-sidebar-menu-sub-item', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'sidebar-menu-sub-item', 'data-sidebar': 'menu-sub-item', '[attr.class]': 'classes()' },
})
export class UiSidebarMenuSubItem {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('group/menu-sub-item relative', this.userClass()));
}


export const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pe-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>ui-icon]:size-4 [&>svg]:shrink-0 [&>ui-icon]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

@Directive({
  selector: 'button[uiSidebarMenuButton], a[uiSidebarMenuButton], ui-sidebar-menu-button', hostDirectives: [UiElementHost],
  host: { '[attr.disabled]': 'disabled() ? "" : null',
    'data-slot': 'sidebar-menu-button',
    'data-sidebar': 'menu-button',
    '[attr.data-size]': 'size()',
    '[attr.data-active]': 'isActive()',
    '[attr.aria-current]': 'isActive() ? "page" : null',
    '[attr.title]': 'tooltipText()',
    '[attr.class]': 'classes()',
  },
})
export class UiSidebarMenuButton {
  /** Reflected as the `disabled` attribute so it also works on the custom element. */
  readonly disabled = input(false, { transform: booleanAttribute });
  private readonly provider = inject(UiSidebarProvider);
  readonly isActive = input(false, { transform: booleanAttribute });
  readonly variant = input<'default' | 'outline'>('default');
  readonly size = input<'default' | 'sm' | 'lg'>('default');
  /** Shown as native title while the sidebar is collapsed to icons (shadcn shows a Tooltip; deviation, see README). */
  readonly tooltip = input<string>('');
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly tooltipText = computed(() =>
    this.tooltip() && this.provider.state() === 'collapsed' && !this.provider.isMobile() ? this.tooltip() : null,
  );
  protected readonly classes = computed(() =>
    cn(sidebarMenuButtonVariants({ variant: this.variant(), size: this.size() }), this.userClass()),
  );
}

@Directive({
  selector: 'a[uiSidebarMenuSubButton], button[uiSidebarMenuSubButton], ui-sidebar-menu-sub-button', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'sidebar-menu-sub-button',
    'data-sidebar': 'menu-sub-button',
    '[attr.data-size]': 'size()',
    '[attr.data-active]': 'isActive()',
    '[attr.class]': 'classes()',
  },
})
export class UiSidebarMenuSubButton {
  readonly isActive = input(false, { transform: booleanAttribute });
  readonly size = input<'sm' | 'md'>('md');
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>ui-icon]:size-4 [&>svg]:shrink-0 [&>ui-icon]:shrink-0 [&>svg]:text-sidebar-accent-foreground [&>ui-icon]:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden',
      this.size() === 'sm' ? 'text-xs' : 'text-sm',
      this.userClass(),
    ),
  );
}

export const UI_SIDEBAR = [
  UiSidebarProvider,
  UiSidebar,
  UiSidebarTrigger,
  UiSidebarRail,
  UiSidebarInset,
  UiSidebarHeader,
  UiSidebarFooter,
  UiSidebarContent,
  UiSidebarSeparator,
  UiSidebarGroup,
  UiSidebarGroupLabel,
  UiSidebarGroupAction,
  UiSidebarGroupContent,
  UiSidebarMenu,
  UiSidebarMenuItem,
  UiSidebarMenuButton,
  UiSidebarMenuAction,
  UiSidebarMenuBadge,
  UiSidebarMenuSub,
  UiSidebarMenuSubItem,
  UiSidebarMenuSubButton,
] as const;
