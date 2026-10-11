import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '@loomui-ng/ui/utils';
import { inputOtpGroupClass, inputOtpSeparatorClass, inputOtpSlotClass } from './input-otp';
import { UiIconSvg } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * <div uiInputOtp [maxLength]="6" [(value)]="code">
 *   <div uiInputOtpGroup><div uiInputOtpSlot [index]="0"></div>…</div>
 * </div>
 * One real (transparent) <input> captures typing, paste and caret keys; slots only render characters (input-otp's approach).
 * Observed input attrs: autocomplete="one-time-code", inputmode="numeric", maxlength, pattern, spellcheck=false.
 */
@Component({
  selector: 'div[uiInputOtp], ui-input-otp', hostDirectives: [UiElementHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiInputOtp), multi: true }],
  host: {
    'data-slot': 'input-otp-container',
    '[attr.class]': 'classes()',
  },
  template: `
    <ng-content />
    <input
      #field
      data-slot="input-otp"
      data-input-otp="true"
      autocomplete="one-time-code"
      spellcheck="false"
      [attr.inputmode]="inputMode()"
      [attr.maxlength]="maxLength()"
      [attr.pattern]="pattern()"
      [disabled]="isDisabled()"
      [required]="required()"
      [attr.aria-invalid]="invalid() ? 'true' : null"
      [value]="value()"
      class="absolute inset-0 size-full cursor-text opacity-0 disabled:cursor-not-allowed"
      (input)="onInput($event)"
      (focus)="onFocus()"
      (blur)="onBlur()"
      (keyup)="syncCaret()"
      (click)="syncCaret()"
      (select)="syncCaret()"
    />
  `,
})
export class UiInputOtp implements ControlValueAccessor {
  readonly value = model('');
  readonly maxLength = input(6, { transform: numberAttribute });
  /** Allowed characters; default digits only (observed `^\d+$`; alphanumeric uses `^[a-zA-Z0-9]+$`). */
  readonly pattern = input<string>('^\\d+$');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  readonly complete = output<string>();

  private readonly field = viewChild.required<ElementRef<HTMLInputElement>>('field');
  private readonly cvaDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  readonly focused = signal(false);
  private readonly caret = signal(0);
  protected readonly inputMode = computed(() => (this.pattern().includes('\\d') && !this.pattern().includes('a-z') ? 'numeric' : 'text'));
  protected readonly classes = computed(() => cn('relative flex items-center gap-2 has-disabled:opacity-50', this.userClass()));
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  /** Index of the slot that currently owns the caret. */
  readonly activeIndex = computed(() => Math.min(this.caret(), this.maxLength() - 1));

  charAt(i: number): string {
    return this.value()[i] ?? '';
  }

  focus(index?: number): void {
    const el = this.field().nativeElement;
    el.focus();
    if (index !== undefined) {
      const i = Math.min(index, this.value().length);
      el.setSelectionRange(i, Math.min(i + 1, this.value().length));
      this.syncCaret();
    }
  }

  protected onInput(e: Event): void {
    const el = e.target as HTMLInputElement;
    const re = new RegExp(this.pattern());
    const cleaned = el.value.slice(0, this.maxLength());
    const ok = cleaned === '' || re.test(cleaned);
    const next = ok ? cleaned : this.value();
    if (!ok) el.value = next;
    this.value.set(next);
    this.onChange(next);
    if (next.length === this.maxLength()) this.complete.emit(next);
    this.syncCaret();
  }

  protected onFocus(): void {
    this.focused.set(true);
    this.syncCaret();
  }
  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }
  protected syncCaret(): void {
    this.caret.set(this.field().nativeElement.selectionStart ?? 0);
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

@Directive({
  selector: '[uiInputOtpGroup], ui-input-otp-group', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'input-otp-group', '[attr.class]': 'classes()' },
})
export class UiInputOtpGroup {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(inputOtpGroupClass, this.userClass()));
}

@Component({
  selector: '[uiInputOtpSlot], ui-input-otp-slot', hostDirectives: [UiElementHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'input-otp-slot',
    '[attr.data-active]': 'active()',
    '[attr.aria-invalid]': 'otp.invalid() ? "true" : null',
    '[attr.class]': 'classes()',
    '(pointerdown)': '$event.preventDefault(); otp.focus(index())',
  },
  template: `
    {{ char() }}
    @if (active() && !char()) {
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div class="h-4 w-px animate-caret-blink bg-foreground duration-1000"></div>
      </div>
    }
  `,
})
export class UiInputOtpSlot {
  protected readonly otp = inject(UiInputOtp);
  readonly index = input.required<number>();
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly char = computed(() => this.otp.charAt(this.index()));
  protected readonly active = computed(() => this.otp.focused() && this.otp.activeIndex() === this.index());
  protected readonly classes = computed(() => cn(inputOtpSlotClass, this.userClass()));
}

@Component({
  selector: '[uiInputOtpSeparator], ui-input-otp-separator', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'separator', 'data-slot': 'input-otp-separator', '[attr.class]': 'classes()' },
  template: `<svg uiIcon="minus"></svg>`,
})
export class UiInputOtpSeparator {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(inputOtpSeparatorClass, this.userClass()));
}

export const UI_INPUT_OTP = [UiInputOtp, UiInputOtpGroup, UiInputOtpSlot, UiInputOtpSeparator] as const;
