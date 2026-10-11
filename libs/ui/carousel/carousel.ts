import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import EmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType, type EmblaPluginType } from 'embla-carousel';
import { buttonVariants } from '@loomui-ng/ui/button';
import { cn } from '@loomui-ng/ui/utils';
import { UiIconSvg } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * <div uiCarousel [opts]="{ loop: true }" orientation="horizontal">
 *   <div uiCarouselContent>
 *     <div uiCarouselItem>…</div>
 *   </div>
 *   <button uiCarouselPrevious></button>
 *   <button uiCarouselNext></button>
 * </div>
 *
 * Observed (shadcn/Radix variant): root role="region" aria-roledescription="carousel"; items role="group"
 * aria-roledescription="slide"; prev/next are outline icon-sm buttons positioned outside the viewport, disabled at the ends.
 * Behavior is Embla's (drag/swipe/inertia); ArrowLeft/ArrowRight on the focused carousel scroll (mirrored in RTL), as in
 * shadcn's `handleKeyDown`. UNKNOWN: slide-change announcements (shadcn adds no live region).
 */
@Component({
  selector: 'div[uiCarousel], ui-carousel', hostDirectives: [UiElementHost],
  exportAs: 'uiCarousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'region',
    'aria-roledescription': 'carousel',
    'data-slot': 'carousel',
    '[attr.dir]': 'dir.value',
    '[attr.class]': 'classes()',
    '(keydown)': 'onKey($event)',
  },
  template: `<ng-content />`,
})
export class UiCarousel {
  protected readonly dir = inject(Directionality);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly opts = input<Record<string, any>>({});
  readonly plugins = input<any[]>([]);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly userClass = input<string>('', { alias: 'class' });
  /** Emits the Embla instance once initialised (for plugins/autoplay control). */
  readonly ready = output<EmblaCarouselType>();

  readonly api = signal<EmblaCarouselType | null>(null);
  readonly canPrev = signal(false);
  readonly canNext = signal(false);
  readonly selectedIndex = signal(0);
  protected readonly classes = computed(() => cn('relative', this.userClass()));

  constructor() {
    afterNextRender(() => this.init());
    inject(DestroyRef).onDestroy(() => this.api()?.destroy());
  }

  private init(): void {
    const viewport = this.el.querySelector<HTMLElement>('[data-slot=carousel-content]');
    if (!viewport) return;
    const api = EmblaCarousel(
      viewport,
      { ...(this.opts() as EmblaOptionsType), axis: this.orientation() === 'horizontal' ? 'x' : 'y', direction: this.dir.value === 'rtl' ? 'rtl' : 'ltr' },
      this.plugins() as EmblaPluginType[],
    );
    const sync = () => {
      this.canPrev.set(api.canScrollPrev());
      this.canNext.set(api.canScrollNext());
      this.selectedIndex.set(api.selectedScrollSnap());
    };
    api.on('select', sync).on('reInit', sync);
    sync();
    this.api.set(api);
    this.ready.emit(api);
  }

  scrollPrev(): void {
    this.api()?.scrollPrev();
  }
  scrollNext(): void {
    this.api()?.scrollNext();
  }
  scrollTo(i: number): void {
    this.api()?.scrollTo(i);
  }

  protected onKey(e: KeyboardEvent): void {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const rtl = this.dir.value === 'rtl';
    e.preventDefault();
    (e.key === 'ArrowLeft') !== rtl ? this.scrollPrev() : this.scrollNext();
  }
}

/** Embla viewport (overflow-hidden) wrapping the slide track. */
@Component({
  selector: 'div[uiCarouselContent], ui-carousel-content', hostDirectives: [UiElementHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'carousel-content', class: 'overflow-hidden' },
  template: `<div [class]="trackClass()"><ng-content /></div>`,
})
export class UiCarouselContent {
  private readonly root = inject(UiCarousel);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly trackClass = computed(() =>
    cn('flex', this.root.orientation() === 'horizontal' ? '-ms-4' : '-mt-4 flex-col', this.userClass()),
  );
}

@Directive({
  selector: 'div[uiCarouselItem], ui-carousel-item', hostDirectives: [UiElementHost],
  host: {
    role: 'group',
    'aria-roledescription': 'slide',
    'data-slot': 'carousel-item',
    '[attr.class]': 'classes()',
  },
})
export class UiCarouselItem {
  private readonly root = inject(UiCarousel);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('min-w-0 shrink-0 grow-0 basis-full', this.root.orientation() === 'horizontal' ? 'ps-4' : 'pt-4', this.userClass()),
  );
}


@Component({
  selector: 'button[uiCarouselPrevious], ui-carousel-previous', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    'data-slot': 'carousel-previous',
    'data-variant': 'outline',
    'data-size': 'icon-sm',
    '[attr.disabled]': '(!root.canPrev()) ? "" : null',
    '[attr.class]': 'classes()',
    '(click)': 'root.scrollPrev()',
  },
  template: `<svg uiIcon="arrow-left" [class]="icon()"></svg><span class="sr-only">Previous slide</span>`,
})
export class UiCarouselPrevious {
  protected readonly root = inject(UiCarousel);
  readonly userClass = input<string>('', { alias: 'class' });
  // chevron-right drawn; flipped so it points to the start edge (and mirrors under RTL because `dir` flips `rtl:`)
  protected readonly icon = computed(() => (this.root.orientation() === 'horizontal' ? 'rtl:rotate-180' : ''));
  protected readonly classes = computed(() =>
    cn(
      buttonVariants({ variant: 'outline', size: 'icon-sm' }),
      'absolute touch-manipulation rounded-full',
      this.root.orientation() === 'horizontal' ? 'top-1/2 -start-12 -translate-y-1/2' : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
      this.userClass(),
    ),
  );
}

@Component({
  selector: 'button[uiCarouselNext], ui-carousel-next', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    'data-slot': 'carousel-next',
    'data-variant': 'outline',
    'data-size': 'icon-sm',
    '[attr.disabled]': '(!root.canNext()) ? "" : null',
    '[attr.class]': 'classes()',
    '(click)': 'root.scrollNext()',
  },
  template: `<svg uiIcon="arrow-right" [class]="icon()"></svg><span class="sr-only">Next slide</span>`,
})
export class UiCarouselNext {
  protected readonly root = inject(UiCarousel);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly icon = computed(() => (this.root.orientation() === 'horizontal' ? 'rtl:rotate-180' : ''));
  protected readonly classes = computed(() =>
    cn(
      buttonVariants({ variant: 'outline', size: 'icon-sm' }),
      'absolute touch-manipulation rounded-full',
      this.root.orientation() === 'horizontal' ? 'top-1/2 -end-12 -translate-y-1/2' : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
      this.userClass(),
    ),
  );
}

export const UI_CAROUSEL = [UiCarousel, UiCarouselContent, UiCarouselItem, UiCarouselPrevious, UiCarouselNext] as const;
