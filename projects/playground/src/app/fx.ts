import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input, numberAttribute } from '@angular/core';

const reduceMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => typeof matchMedia !== 'undefined' && matchMedia('(pointer: fine)').matches;

/** Fades/slides the element in when it scrolls into view. `appReveal` value = delay in ms. */
@Directive({ selector: '[appReveal]' })
export class Reveal {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly delay = input(0, { alias: 'appReveal', transform: numberAttribute });

  constructor() {
    afterNextRender(() => {
      if (reduceMotion() || typeof IntersectionObserver === 'undefined') return;
      this.el.classList.add('reveal');
      this.el.style.transitionDelay = this.delay() + 'ms';
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            this.el.classList.add('reveal-in');
            io.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      );
      io.observe(this.el);
      inject(DestroyRef).onDestroy(() => io.disconnect());
    });
  }
}

/** Subtle 3D tilt that follows the pointer (fine pointers only). Writes are batched to one per animation frame. */
@Directive({
  selector: '[appTilt]',
  host: { '(pointermove)': 'move($event)', '(pointerleave)': 'reset()' },
})
export class Tilt {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly max = input(5, { alias: 'appTilt', transform: numberAttribute });
  private raf = 0;
  private px = 0;
  private py = 0;

  move(e: PointerEvent): void {
    if (e.pointerType !== 'mouse' || reduceMotion() || !finePointer()) return;
    const r = this.el.getBoundingClientRect();
    this.px = (e.clientX - r.left) / r.width - 0.5;
    this.py = (e.clientY - r.top) / r.height - 0.5;
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      const m = this.max();
      this.el.style.transform = `perspective(900px) rotateX(${(-this.py * m).toFixed(2)}deg) rotateY(${(this.px * m).toFixed(2)}deg) translateY(-2px)`;
      this.el.style.setProperty('--gx', `${((this.px + 0.5) * 100).toFixed(1)}%`);
      this.el.style.setProperty('--gy', `${((this.py + 0.5) * 100).toFixed(1)}%`);
    });
  }

  reset(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.el.style.transform = '';
  }
}

/** Makes an element draggable with the pointer (transform based, keeps its layout slot). Ignores drags that start on controls. */
@Directive({
  selector: '[appDraggable]',
  host: { '(pointerdown)': 'down($event)', '(pointermove)': 'move($event)', '(pointerup)': 'up($event)', '(pointercancel)': 'up($event)', class: 'touch-none' },
})
export class Draggable {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private x = 0;
  private y = 0;
  private sx = 0;
  private sy = 0;
  private dragging = false;

  down(e: PointerEvent): void {
    if ((e.target as HTMLElement).closest('button, input, a, [role=slider], [role=switch], [role=checkbox], label, select, textarea')) return;
    this.dragging = true;
    this.sx = e.clientX - this.x;
    this.sy = e.clientY - this.y;
    this.el.setPointerCapture(e.pointerId);
    this.el.style.cursor = 'grabbing';
    this.el.style.zIndex = '20';
  }

  move(e: PointerEvent): void {
    if (!this.dragging) return;
    this.x = e.clientX - this.sx;
    this.y = e.clientY - this.sy;
    this.el.style.translate = `${this.x}px ${this.y}px`;
  }

  up(e: PointerEvent): void {
    if (!this.dragging) return;
    this.dragging = false;
    this.el.style.cursor = '';
    if (this.el.hasPointerCapture(e.pointerId)) this.el.releasePointerCapture(e.pointerId);
  }
}

/**
 * Moves a small glowing disc (`[data-spot]` child) with the pointer. Transform-only and rAF-throttled, so it never repaints the
 * hero or restyles its descendants (writing CSS variables on a large parent was the main cause of hover lag).
 */
@Directive({ selector: '[appSpotlight]', host: { '(pointermove)': 'move($event)' } })
export class Spotlight {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private raf = 0;
  private x = 0;
  private y = 0;

  move(e: PointerEvent): void {
    if (e.pointerType !== 'mouse' || reduceMotion()) return;
    const r = this.el.getBoundingClientRect();
    this.x = e.clientX - r.left;
    this.y = e.clientY - r.top;
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      const spot = this.el.querySelector<HTMLElement>('[data-spot]');
      if (spot) spot.style.transform = `translate3d(${this.x.toFixed(0)}px, ${this.y.toFixed(0)}px, 0)`;
    });
  }
}

export const FX = [Reveal, Tilt, Draggable, Spotlight] as const;
