import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  numberAttribute,
  signal,
  untracked,
} from '@angular/core';
import { cn } from '@loomui/ui/utils';
import { resizableHandleClass, resizablePanelGroupClass } from './resizable';
import { UiIconSvg } from '@loomui/ui/icon';
import { UiElementHost } from '@loomui/ui/utils';

/**
 * <div uiResizablePanelGroup direction="horizontal" class="max-w-sm rounded-lg border">
 *   <div uiResizablePanel [defaultSize]="50">One</div>
 *   <div uiResizableHandle withHandle></div>
 *   <div uiResizablePanel [defaultSize]="50">Two</div>
 * </div>
 * Observed (react-resizable-panels): group `data-group`, panel `data-panel`, handle role="separator" tabindex=0
 * aria-valuemin/max/now, aria-orientation (perpendicular to the group), data-separator inactive|hover|active.
 * Own implementation (the original wraps a React library): pointer drag + keyboard (arrows ±step, Home/End).
 */
@Directive({
  selector: '[uiResizablePanelGroup], ui-resizable-panel-group', hostDirectives: [UiElementHost],
  exportAs: 'uiResizablePanelGroup',
  host: {
    'data-slot': 'resizable-panel-group',
    'data-group': 'true',
    '[attr.aria-orientation]': 'direction()',
    '[attr.data-panel-group-direction]': 'direction()',
    '[attr.class]': 'classes()',
  },
})
export class UiResizablePanelGroup {
  readonly direction = input<'horizontal' | 'vertical'>('horizontal');
  readonly userClass = input<string>('', { alias: 'class' });
  readonly dir = inject(Directionality);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly panels = contentChildren(forwardRef(() => UiResizablePanel), { descendants: false });
  readonly sizes = signal<number[]>([]);
  protected readonly classes = computed(() => cn(resizablePanelGroupClass, this.userClass()));

  constructor() {
    effect(() => {
      const panels = this.panels();
      untracked(() => {
        if (this.sizes().length === panels.length) return;
        const fixed = panels.map((p) => p.defaultSize());
        const set = fixed.filter((s): s is number => s !== undefined);
        const rest = 100 - set.reduce((a, b) => a + b, 0);
        const unset = fixed.length - set.length;
        this.sizes.set(fixed.map((s) => s ?? (unset ? rest / unset : 0)));
      });
    });
  }

  /** Move the boundary after panel `i` by `delta` percent (positive grows panel i). */
  resize(i: number, delta: number): void {
    const panels = this.panels();
    const sizes = [...this.sizes()];
    const a = panels[i];
    const b = panels[i + 1];
    if (!a || !b) return;
    let d = delta;
    d = Math.min(d, a.maxSize() - sizes[i], sizes[i + 1] - b.minSize());
    d = Math.max(d, a.minSize() - sizes[i], sizes[i + 1] - b.maxSize());
    sizes[i] += d;
    sizes[i + 1] -= d;
    this.sizes.set(sizes);
  }

  isRtl(): boolean {
    return this.dir.value === 'rtl' && this.direction() === 'horizontal';
  }
}

@Directive({
  selector: '[uiResizablePanel], ui-resizable-panel', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'resizable-panel',
    'data-panel': 'true',
    '[attr.data-panel-size]': 'size().toFixed(1)',
    '[style.flex]': 'size() + " 1 0px"',
    '[style.overflow]': '"hidden"',
    '[attr.class]': 'userClass()',
  },
})
export class UiResizablePanel {
  private readonly group = inject(UiResizablePanelGroup);
  readonly defaultSize = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v === undefined || v === null || v === '' ? undefined : numberAttribute(v)),
  });
  readonly minSize = input(0, { transform: numberAttribute });
  readonly maxSize = input(100, { transform: numberAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  readonly index = computed(() => this.group.panels().indexOf(this));
  readonly size = computed(() => this.group.sizes()[this.index()] ?? this.defaultSize() ?? 0);
}

@Component({
  selector: '[uiResizableHandle], ui-resizable-handle', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'separator',
    tabindex: '0',
    'data-slot': 'resizable-handle',
    '[attr.aria-orientation]': 'group.direction() === "horizontal" ? "vertical" : "horizontal"',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
    '[attr.aria-valuenow]': 'valueNow()',
    '[attr.data-separator]': 'state()',
    '[attr.data-panel-group-direction]': 'group.direction()',
    '[attr.class]': 'classes()',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointerenter)': 'hover.set(true)',
    '(pointerleave)': 'hover.set(false)',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    @if (withHandle()) {
      <div class="z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border">
        <svg uiIcon="grip-vertical" class="size-2.5"></svg>
      </div>
    }
  `,
})
export class UiResizableHandle {
  protected readonly group = inject(UiResizablePanelGroup);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly withHandle = input(false, { transform: booleanAttribute });
  readonly keyboardStep = input(10, { transform: numberAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly hover = signal(false);
  private readonly dragging = signal(false);
  protected readonly state = computed(() => (this.dragging() ? 'drag' : this.hover() ? 'hover' : 'inactive'));
  protected readonly classes = computed(() => cn(resizableHandleClass, this.userClass()));

  /** Handle i sits between panel i and i+1: index = number of handles before it. */
  private index(): number {
    const handles = Array.from(this.group.el.querySelectorAll(':scope > [data-slot=resizable-handle]'));
    return handles.indexOf(this.el);
  }
  protected valueNow(): number {
    return Math.round(this.group.sizes()[this.index()] ?? 0);
  }

  protected onPointerDown(e: PointerEvent): void {
    if (e.button !== 0) return;
    e.preventDefault();
    const horizontal = this.group.direction() === 'horizontal';
    const rect = this.group.el.getBoundingClientRect();
    const total = horizontal ? rect.width : rect.height;
    let last = horizontal ? e.clientX : e.clientY;
    const sign = this.group.isRtl() ? -1 : 1;
    const i = this.index();
    this.dragging.set(true);
    this.el.setPointerCapture?.(e.pointerId);
    const move = (ev: PointerEvent) => {
      const cur = horizontal ? ev.clientX : ev.clientY;
      this.group.resize(i, (sign * (cur - last) * 100) / total);
      last = cur;
    };
    const up = () => {
      this.dragging.set(false);
      this.el.removeEventListener('pointermove', move);
      this.el.removeEventListener('pointerup', up);
      this.el.removeEventListener('pointercancel', up);
    };
    this.el.addEventListener('pointermove', move);
    this.el.addEventListener('pointerup', up);
    this.el.addEventListener('pointercancel', up);
  }

  protected onKeydown(e: KeyboardEvent): void {
    const horizontal = this.group.direction() === 'horizontal';
    const step = this.keyboardStep();
    const sign = this.group.isRtl() ? -1 : 1;
    const i = this.index();
    let handled = true;
    switch (e.key) {
      case horizontal ? 'ArrowLeft' : 'ArrowUp':
        this.group.resize(i, -step * sign);
        break;
      case horizontal ? 'ArrowRight' : 'ArrowDown':
        this.group.resize(i, step * sign);
        break;
      case 'Home':
        this.group.resize(i, -100);
        break;
      case 'End':
        this.group.resize(i, 100);
        break;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  }
}

export const UI_RESIZABLE = [UiResizablePanelGroup, UiResizablePanel, UiResizableHandle] as const;
