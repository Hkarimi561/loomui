import { FocusKeyManager, FocusableOption } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  computed,
  contentChildren,
  Directive,
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
import { toggleVariants } from '@loomui-ng/ui/toggle';
import { toggleGroupClass, toggleGroupItemClass } from './toggle-group';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * <div uiToggleGroup type="multiple" variant="outline" [(value)]="v">
 *   <button uiToggleGroupItem value="bold" aria-label="Toggle bold">B</button>
 * </div>
 * single → items are role="radio" (aria-checked); multiple → items are aria-pressed buttons. `value` is always an array.
 */
@Directive({
  selector: '[uiToggleGroup], ui-toggle-group', hostDirectives: [UiElementHost],
  exportAs: 'uiToggleGroup',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiToggleGroup), multi: true }],
  host: {
    role: 'group',
    'data-slot': 'toggle-group',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-spacing]': 'spacing()',
    '[attr.data-orientation]': 'orientation()',
    '[style.--gap]': 'spacing()',
    '[attr.dir]': 'dir.value',
    '[attr.class]': 'classes()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiToggleGroup implements ControlValueAccessor {
  readonly type = input<'single' | 'multiple'>('single');
  readonly value = model<string[]>([]);
  readonly variant = input<'default' | 'outline'>('default');
  readonly size = input<'default' | 'sm' | 'lg'>('default');
  readonly spacing = input(0, { transform: numberAttribute });
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly dir = inject(Directionality);
  private readonly cvaDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  readonly items = contentChildren(forwardRef(() => UiToggleGroupItem), { descendants: true });
  protected readonly classes = computed(() => cn(toggleGroupClass, this.userClass()));
  private onChange: (v: string[]) => void = () => {};
  onTouched: () => void = () => {};

  isOn(v: string): boolean {
    return this.value().includes(v);
  }

  toggle(v: string): void {
    const on = this.isOn(v);
    const next = this.type() === 'multiple' ? (on ? this.value().filter((x) => x !== v) : [...this.value(), v]) : on ? [] : [v];
    this.value.set(next);
    this.onChange(next);
  }

  /** Roving tabindex: the first "on" item, else the first enabled item, is the tab stop. */
  tabStop = computed(() => {
    const enabled = this.items().filter((i) => !i.isDisabled());
    return (enabled.find((i) => this.isOn(i.value())) ?? enabled[0])?.value() ?? null;
  });

  protected onKeydown(e: KeyboardEvent): void {
    const enabled = this.items().filter((i) => !i.isDisabled());
    const i = enabled.findIndex((it) => it.el === document.activeElement);
    if (i < 0) return;
    const horizontal = this.orientation() === 'horizontal';
    const rtl = this.dir.value === 'rtl';
    const next = horizontal ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    const prev = horizontal ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
    let t = -1;
    if (e.key === next) t = (i + 1) % enabled.length;
    else if (e.key === prev) t = (i - 1 + enabled.length) % enabled.length;
    else if (e.key === 'Home') t = 0;
    else if (e.key === 'End') t = enabled.length - 1;
    if (t >= 0) {
      e.preventDefault();
      enabled[t].el.focus();
    }
  }

  writeValue(v: string[] | string | null): void {
    this.value.set(Array.isArray(v) ? v : v ? [v] : []);
  }
  registerOnChange(fn: (v: string[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.cvaDisabled.set(d);
  }
}

@Directive({
  selector: 'button[uiToggleGroupItem], ui-toggle-group-item', hostDirectives: [UiElementHost],
  host: {
    type: 'button',
    'data-slot': 'toggle-group-item',
    '[attr.role]': 'group.type() === "single" ? "radio" : null',
    '[attr.aria-checked]': 'group.type() === "single" ? on() : null',
    '[attr.aria-pressed]': 'group.type() === "multiple" ? on() : null',
    '[attr.data-state]': 'on() ? "on" : "off"',
    '[attr.data-variant]': 'resolvedVariant()',
    '[attr.data-size]': 'resolvedSize()',
    '[attr.data-spacing]': 'group.spacing()',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.disabled]': '(isDisabled()) ? "" : null',
    '[attr.tabindex]': 'group.tabStop() === value() ? 0 : -1',
    '[attr.class]': 'classes()',
    '(click)': 'group.toggle(value())',
    '(blur)': 'group.onTouched()',
  },
})
export class UiToggleGroupItem implements FocusableOption {
  protected readonly group = inject(UiToggleGroup);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly value = input<string>('');
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly variant = input<'default' | 'outline' | undefined>(undefined);
  readonly size = input<'default' | 'sm' | 'lg' | undefined>(undefined);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly on = computed(() => this.group.isOn(this.value()));
  protected readonly resolvedVariant = computed(() => this.variant() ?? this.group.variant());
  protected readonly resolvedSize = computed(() => this.size() ?? this.group.size());
  get disabled(): boolean {
    return this.isDisabled();
  }
  isDisabled = () => this.disabledInput() || this.group.isDisabled();
  focus(): void {
    this.el.focus();
  }
  protected readonly classes = computed(() =>
    cn(toggleVariants({ variant: this.resolvedVariant(), size: this.resolvedSize() }), toggleGroupItemClass, this.userClass()),
  );
}

export const UI_TOGGLE_GROUP = [UiToggleGroup, UiToggleGroupItem] as const;
void FocusKeyManager;
