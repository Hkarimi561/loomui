import { booleanAttribute, computed, Directive, ElementRef, input, linkedSignal, signal, viewChild } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';

/**
 * Base for the custom-element wrappers around native form controls (`<ui-input>`, `<ui-textarea>`, `<ui-native-select>`, …).
 * A custom element cannot be a form control, so the wrapper renders the real control inside its template (template ref
 * `#control`) and forwards the common attributes. It implements ControlValueAccessor, so `ngModel`, reactive forms and
 * `[(value)]`-style one-way binding keep working. `aria-label` / `aria-describedby` are forwarded to the inner control.
 */
// The id belongs on the inner control (so <label for> and aria-labelledby find it), not on the custom element.
@Directive({ host: { '[attr.id]': 'null' } })
export abstract class UiNativeControl implements ControlValueAccessor {
  readonly control = viewChild.required<ElementRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>>('control');

  readonly id = input<string>('');
  readonly name = input<string>('');
  readonly placeholder = input<string>('');
  /** Initial / one-way value. With forms, the form owns the value. */
  readonly value = input<string>('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly autocomplete = input<string>('');
  readonly ariaLabel = input<string>('', { alias: 'aria-label' });
  readonly ariaDescribedby = input<string>('', { alias: 'aria-describedby' });
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly current = linkedSignal(() => this.value());
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange: (v: string) => void = () => {};
  protected onTouched: () => void = () => {};

  focus(options?: FocusOptions): void {
    this.control().nativeElement.focus(options);
  }

  protected onInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.current.set(v);
    this.onChange(v);
  }

  writeValue(v: string | null): void {
    this.current.set(v ?? '');
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
