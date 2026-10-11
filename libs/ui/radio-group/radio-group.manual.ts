import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '@loomui/ui/utils';
import { radioGroupClass, radioGroupIndicatorClass, radioGroupItemClass } from './radio-group';
import { UiElementHost } from '@loomui/ui/utils';

/**
 * <div uiRadioGroup [(value)]="plan">
 *   <button uiRadioGroupItem value="a" id="a"></button><label uiLabel for="a">A</label>
 * </div>
 * Arrow keys move focus AND select (Radix). Roving tabindex: the selected item (else the first) is the tab stop.
 */
@Directive({
  selector: '[uiRadioGroup], ui-radio-group', hostDirectives: [UiElementHost],
  exportAs: 'uiRadioGroup',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiRadioGroup), multi: true }],
  host: {
    role: 'radiogroup',
    'data-slot': 'radio-group',
    '[attr.aria-required]': 'required()',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.dir]': 'dir.value',
    '[attr.class]': 'classes()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiRadioGroup implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<'vertical' | 'horizontal' | undefined>(undefined);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly dir = inject(Directionality);
  private readonly cvaDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  readonly items = contentChildren(forwardRef(() => UiRadioGroupItem), { descendants: true });
  protected readonly classes = computed(() => cn(radioGroupClass, this.userClass()));
  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  readonly tabStop = computed(() => {
    const enabled = this.items().filter((i) => !i.isDisabled());
    return (enabled.find((i) => i.value() === this.value()) ?? enabled[0])?.value() ?? null;
  });

  select(v: string): void {
    this.value.set(v);
    this.onChange(v);
  }

  protected onKeydown(e: KeyboardEvent): void {
    const enabled = this.items().filter((i) => !i.isDisabled());
    const i = enabled.findIndex((it) => it.el === document.activeElement);
    if (i < 0) return;
    const rtl = this.dir.value === 'rtl';
    let t = -1;
    if (e.key === 'ArrowDown' || e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) t = (i + 1) % enabled.length;
    else if (e.key === 'ArrowUp' || e.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) t = (i - 1 + enabled.length) % enabled.length;
    else if (e.key === 'Home') t = 0;
    else if (e.key === 'End') t = enabled.length - 1;
    if (t >= 0) {
      e.preventDefault();
      enabled[t].el.focus();
      this.select(enabled[t].value());
    }
  }

  writeValue(v: string | null): void {
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.cvaDisabled.set(d);
  }
}

@Component({
  selector: 'button[uiRadioGroupItem], ui-radio-group-item', hostDirectives: [UiElementHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    role: 'radio',
    'data-slot': 'radio-group-item',
    '[attr.aria-checked]': 'checked()',
    '[attr.data-state]': 'checked() ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.aria-invalid]': 'invalid() ? "true" : null',
    '[attr.disabled]': '(isDisabled()) ? "" : null',
    '[attr.tabindex]': 'group.tabStop() === value() ? 0 : -1',
    '[attr.class]': 'classes()',
    '(click)': 'group.select(value())',
    '(focus)': 'onFocus()',
    '(blur)': 'group.onTouched()',
  },
  // The indicator's inner dot is not captured (only the outer span was); sized/colored like shadcn's source.
  template: `
    @if (checked()) {
      <span data-slot="radio-group-indicator" data-state="checked" class="${radioGroupIndicatorClass}">
        <span class="size-2 rounded-full bg-primary-foreground"></span>
      </span>
    }
  `,
})
export class UiRadioGroupItem {
  protected readonly group = inject(UiRadioGroup);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly value = input<string>('');
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly checked = computed(() => this.group.value() === this.value());
  isDisabled = () => this.disabledInput() || this.group.isDisabled();
  protected readonly classes = computed(() => cn(radioGroupItemClass, this.userClass()));
  protected onFocus(): void {
    // Radix: focusing via keyboard does not select by itself (arrows do); nothing to do here.
  }
}

export const UI_RADIO_GROUP = [UiRadioGroup, UiRadioGroupItem] as const;
