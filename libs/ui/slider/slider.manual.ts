import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '@loomui-ng/ui/utils';
import { sliderClass, sliderRangeClass, sliderThumbClass, sliderTrackClass } from './slider';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * <span uiSlider [(value)]="v" [min]="0" [max]="100" [step]="1"></span>   v: number[] (one entry per thumb)
 * Observed (Radix): thumbs are span[role=slider] with aria-valuemin/max/now, aria-orientation, data-orientation, tabindex=0;
 * root carries dir, data-orientation, aria-disabled, data-disabled. Keys (Radix, not captured live): arrows ±step
 * (mirrored in RTL), Shift/PageUp/PageDown ±10 steps, Home/End min/max.
 * Also a ControlValueAccessor: single-thumb sliders read/write a number, multi-thumb ones an array.
 */
@Component({
  selector: 'span[uiSlider], ui-slider', hostDirectives: [UiElementHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSlider), multi: true }],
  host: {
    'data-slot': 'slider',
    '[attr.dir]': 'dir.value',
    '[attr.data-orientation]': 'orientation()',
    '[attr.aria-disabled]': 'isDisabled()',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.class]': 'classes()',
    '(pointerdown)': 'onPointerDown($event)',
  },
  template: `
    <span data-slot="slider-track" [attr.data-orientation]="orientation()" [attr.data-disabled]="isDisabled() ? '' : null" [class]="trackClass">
      <span data-slot="slider-range" [attr.data-orientation]="orientation()" [attr.data-disabled]="isDisabled() ? '' : null" [class]="rangeClass" [style]="rangeStyle()"></span>
    </span>
    @for (v of value(); track $index) {
      <span
        data-slot="slider-thumb"
        role="slider"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
        [attr.aria-valuenow]="v"
        [attr.aria-orientation]="orientation()"
        [attr.aria-label]="value().length > 1 ? 'Value ' + ($index + 1) + ' of ' + value().length : null"
        [attr.data-orientation]="orientation()"
        [attr.data-disabled]="isDisabled() ? '' : null"
        [attr.tabindex]="isDisabled() ? null : 0"
        [class]="thumbClass"
        [style]="thumbStyle(v)"
        (keydown)="onKeydown($event, $index)"
        (blur)="onTouched()"
      ></span>
    }
  `,
})
export class UiSlider implements ControlValueAccessor {
  readonly value = model<number[]>([0]);
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly step = input(1, { transform: numberAttribute });
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly dir = inject(Directionality);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected readonly classes = computed(() => cn(sliderClass, this.userClass()));
  protected readonly trackClass = sliderTrackClass;
  protected readonly rangeClass = sliderRangeClass;
  protected readonly thumbClass = sliderThumbClass;

  private onChange: (v: number | number[]) => void = () => {};
  protected onTouched: () => void = () => {};
  private dragging: number | null = null;

  private pct(v: number): number {
    const span = this.max() - this.min();
    return span === 0 ? 0 : ((v - this.min()) / span) * 100;
  }

  protected rangeStyle = computed(() => {
    const vals = this.value();
    const start = vals.length > 1 ? this.pct(Math.min(...vals)) : 0;
    const end = this.pct(Math.max(...vals));
    return this.orientation() === 'horizontal'
      ? { 'inset-inline-start': `${start}%`, 'inset-inline-end': `${100 - end}%` }
      : { bottom: `${start}%`, top: `${100 - end}%` };
  });

  protected thumbStyle(v: number): Record<string, string> {
    const p = this.pct(v);
    // Keep the thumb (12px) fully inside the track like Radix: offset by (50 - p) % of the thumb size.
    const offset = `calc(${p}% + ${(50 - p) * 0.12}px)`;
    return this.orientation() === 'horizontal'
      ? { position: 'absolute', 'inset-inline-start': offset, transform: this.dir.value === 'rtl' ? 'translateX(50%)' : 'translateX(-50%)' }
      : { position: 'absolute', bottom: offset, transform: 'translateY(50%)' };
  }

  private snap(raw: number): number {
    const step = this.step();
    const snapped = Math.round((raw - this.min()) / step) * step + this.min();
    const decimals = (String(step).split('.')[1] ?? '').length;
    return Math.min(this.max(), Math.max(this.min(), Number(snapped.toFixed(decimals))));
  }

  private setAt(index: number, v: number): void {
    const next = [...this.value()];
    next[index] = this.snap(v);
    const sorted = [...next].sort((a, b) => a - b);
    // keep thumbs ordered (Radix keeps thumb identity by index and clamps neighbours)
    next[index] = Math.min(Math.max(next[index], next[index - 1] ?? this.min()), next[index + 1] ?? this.max());
    void sorted;
    this.value.set(next);
    this.onChange(next.length === 1 ? next[0] : next);
  }

  private valueFromPointer(e: PointerEvent): number {
    const r = this.el.getBoundingClientRect();
    const horizontal = this.orientation() === 'horizontal';
    let ratio = horizontal ? (e.clientX - r.left) / r.width : 1 - (e.clientY - r.top) / r.height;
    if (horizontal && this.dir.value === 'rtl') ratio = 1 - ratio;
    ratio = Math.min(1, Math.max(0, ratio));
    return this.min() + ratio * (this.max() - this.min());
  }

  protected onPointerDown(e: PointerEvent): void {
    if (this.isDisabled() || e.button !== 0) return;
    const v = this.valueFromPointer(e);
    const vals = this.value();
    let nearest = 0;
    vals.forEach((x, i) => {
      if (Math.abs(x - v) < Math.abs(vals[nearest] - v)) nearest = i;
    });
    this.dragging = nearest;
    this.el.setPointerCapture?.(e.pointerId);
    this.setAt(nearest, v);
    const thumbs = this.el.querySelectorAll<HTMLElement>('[data-slot=slider-thumb]');
    thumbs[nearest]?.focus();
    const move = (ev: PointerEvent) => this.dragging !== null && this.setAt(this.dragging, this.valueFromPointer(ev));
    const up = () => {
      this.dragging = null;
      this.el.removeEventListener('pointermove', move);
      this.el.removeEventListener('pointerup', up);
      this.el.removeEventListener('pointercancel', up);
    };
    this.el.addEventListener('pointermove', move);
    this.el.addEventListener('pointerup', up);
    this.el.addEventListener('pointercancel', up);
  }

  protected onKeydown(e: KeyboardEvent, index: number): void {
    if (this.isDisabled()) return;
    const cur = this.value()[index];
    const step = this.step();
    const big = step * 10;
    const rtl = this.dir.value === 'rtl' && this.orientation() === 'horizontal';
    let next: number | null = null;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = cur + ((e.key === 'ArrowRight' && rtl ? -1 : 1) * (e.shiftKey ? big : step));
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = cur - ((e.key === 'ArrowLeft' && rtl ? -1 : 1) * (e.shiftKey ? big : step));
        break;
      case 'PageUp':
        next = cur + big;
        break;
      case 'PageDown':
        next = cur - big;
        break;
      case 'Home':
        next = this.min();
        break;
      case 'End':
        next = this.max();
        break;
    }
    if (next !== null) {
      e.preventDefault();
      this.setAt(index, next);
    }
  }

  writeValue(v: number | number[] | null): void {
    this.value.set(Array.isArray(v) ? v : v === null || v === undefined ? [this.min()] : [v]);
  }
  registerOnChange(fn: (v: number | number[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.cvaDisabled.set(d);
  }
}

export const UI_SLIDER = [UiSlider] as const;
