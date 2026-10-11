import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '@loomui-ng/ui/utils';
import { UiIconSvg } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

const checkboxClasses =
  'peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-[:focus-visible]/field-label:data-checked:border-primary dark:data-checked:bg-primary';

/**
 * <button uiCheckbox [(checked)]="x"></button>
 *
 * Works with: [(checked)] two-way binding, ngModel / reactive forms (ControlValueAccessor),
 * and signal forms (`checked` model + `disabled`/`invalid` inputs match FormCheckboxControl).
 */
@Component({
  selector: 'button[uiCheckbox], ui-checkbox', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCheckbox), multi: true }],
  host: {
    type: 'button',
    role: 'checkbox',
    'data-slot': 'checkbox',
    '[attr.aria-checked]': 'indeterminate() ? "mixed" : checked()',
    '[attr.aria-invalid]': 'invalid() ? "true" : null',
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.disabled]': 'isDisabled() ? "" : null',
    '[attr.class]': 'classes()',
    '(click)': 'toggle()',
    // Observed on live site: Space toggles, Enter does not.
    '(keydown.enter)': '$event.preventDefault()',
    '(blur)': 'onTouched()',
  },
  template: `
    @if (state() !== 'unchecked') {
      <span
        data-slot="checkbox-indicator"
        [attr.data-state]="state()"
        class="grid place-content-center text-current transition-none [&>svg]:size-3.5 [&>ui-icon]:size-3.5"
        style="pointer-events: none"
      >
        @if (indeterminate()) {
          <svg uiIcon="minus"></svg>
        } @else {
          <svg uiIcon="check"></svg>
        }
      </span>
    }
  `,
})
export class UiCheckbox implements ControlValueAccessor {
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });

  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected readonly state = computed(() => (this.indeterminate() ? 'indeterminate' : this.checked() ? 'checked' : 'unchecked'));
  protected readonly classes = computed(() => cn(checkboxClasses, this.userClass()));

  private onChange: (v: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected toggle(): void {
    if (this.isDisabled()) return;
    const next = this.indeterminate() ? true : !this.checked();
    this.indeterminate.set(false);
    this.checked.set(next);
    this.onChange(next);
  }

  writeValue(v: boolean | null): void {
    this.checked.set(!!v);
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.cvaDisabled.set(d);
  }
}
