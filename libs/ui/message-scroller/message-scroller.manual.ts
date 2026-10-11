import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import {
  messageScrollerButtonClass,
  messageScrollerClass,
  messageScrollerContentClass,
  messageScrollerItemClass,
  messageScrollerViewportClass,
} from './message-scroller';
import { UiIconSvg } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * Chat viewport that sticks to the newest message.
 * <div uiMessageScroller class="h-96">
 *   <div uiMessageScrollerViewport>
 *     <div uiMessageScrollerContent>
 *       <div uiMessageScrollerItem messageId="m1">…</div>
 *     </div>
 *   </div>
 *   <button uiMessageScrollerButton aria-label="Scroll to latest"></button>
 * </div>
 * Observed: viewport role="region" aria-label="Messages" tabindex=0, content role="log" aria-relevant="additions" aria-busy,
 * items data-message-id / data-scroll-anchor, root+viewport data-scrollable="start|end|start end" (edges that have more
 * content), button data-direction="end" data-active toggled with inert/tabindex=-1 while inactive.
 * Own reconstruction of the behavior: while the user is at the end, new content keeps the view at the end; scrolling up
 * releases it; the button (visible when more content is below) scrolls back. `scrollAnchor` items scroll their top into view
 * when they are added.
 */
@Component({
  selector: 'div[uiMessageScroller], ui-message-scroller', hostDirectives: [UiElementHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'message-scroller',
    '[attr.data-scrollable]': 'scrollable() || null',
    '[attr.class]': 'classes()',
  },
  template: `<ng-content />`,
})
export class UiMessageScroller {
  readonly userClass = input<string>('', { alias: 'class' });
  readonly scrollable = signal<string>('');
  readonly atEnd = signal(true);
  viewport: HTMLElement | null = null;
  protected readonly classes = computed(() => cn(messageScrollerClass, this.userClass()));

  scrollToEnd(smooth = true): void {
    const v = this.viewport;
    if (v) v.scrollTo({ top: v.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }

  update(): void {
    const v = this.viewport;
    if (!v) return;
    const start = v.scrollTop > 1;
    const end = v.scrollHeight - v.clientHeight - v.scrollTop > 1;
    this.atEnd.set(!end);
    this.scrollable.set([start ? 'start' : '', end ? 'end' : ''].filter(Boolean).join(' '));
  }
}

@Directive({
  selector: '[uiMessageScrollerViewport], ui-message-scroller-viewport', hostDirectives: [UiElementHost],
  host: {
    role: 'region',
    'aria-label': 'Messages',
    tabindex: '0',
    'data-slot': 'message-scroller-viewport',
    '[attr.data-scrollable]': 'root.scrollable() || null',
    '[attr.class]': 'classes()',
    '(scroll)': 'root.update()',
  },
})
export class UiMessageScrollerViewport {
  protected readonly root = inject(UiMessageScroller);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(messageScrollerViewportClass, this.userClass()));
  constructor() {
    this.root.viewport = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    queueMicrotask(() => {
      this.root.scrollToEnd(false);
      this.root.update();
    });
  }
}

@Directive({
  selector: '[uiMessageScrollerContent], ui-message-scroller-content', hostDirectives: [UiElementHost],
  host: {
    role: 'log',
    'aria-relevant': 'additions',
    '[attr.aria-busy]': 'busy()',
    'data-slot': 'message-scroller-content',
    '[attr.class]': 'classes()',
  },
})
export class UiMessageScrollerContent {
  private readonly root = inject(UiMessageScroller);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly busy = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(messageScrollerContentClass, this.userClass()));
  constructor() {
    if (typeof ResizeObserver === 'undefined') return;
    let stick = true;
    const ro = new ResizeObserver(() => {
      if (stick) this.root.scrollToEnd(false);
      this.root.update();
    });
    ro.observe(this.el);
    // remember whether the user was at the end before the content grows
    const onScroll = () => (stick = this.root.atEnd());
    queueMicrotask(() => this.root.viewport?.addEventListener('scroll', onScroll, { passive: true }));
    inject(DestroyRef).onDestroy(() => {
      ro.disconnect();
      this.root.viewport?.removeEventListener('scroll', onScroll);
    });
  }
}

@Directive({
  selector: '[uiMessageScrollerItem], ui-message-scroller-item', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'message-scroller-item',
    '[attr.data-message-id]': 'messageId() || null',
    '[attr.data-scroll-anchor]': 'scrollAnchor()',
    '[attr.class]': 'classes()',
  },
})
export class UiMessageScrollerItem {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly messageId = input<string>('');
  readonly scrollAnchor = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(messageScrollerItemClass, this.userClass()));
  constructor() {
    queueMicrotask(() => {
      if (this.scrollAnchor()) this.el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }
}

/** "Scroll to latest" button; inert while the viewport is already at the end. */
@Component({
  selector: 'button[uiMessageScrollerButton], ui-message-scroller-button', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    'data-slot': 'message-scroller-button',
    'data-variant': 'secondary',
    'data-size': 'icon-sm',
    'data-direction': 'end',
    '[attr.data-active]': '!root.atEnd()',
    '[attr.inert]': 'root.atEnd() ? "" : null',
    '[attr.tabindex]': 'root.atEnd() ? -1 : null',
    '[attr.class]': 'classes()',
    '(click)': 'root.scrollToEnd()',
  },
  template: `<svg uiIcon="arrow-down" class="size-4"></svg>`,
})
export class UiMessageScrollerButton {
  protected readonly root = inject(UiMessageScroller);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(messageScrollerButtonClass, this.userClass()));
}

export const UI_MESSAGE_SCROLLER = [
  UiMessageScroller,
  UiMessageScrollerViewport,
  UiMessageScrollerContent,
  UiMessageScrollerItem,
  UiMessageScrollerButton,
] as const;
