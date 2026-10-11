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
import { UiElementHost } from '@loomui-ng/ui/utils';

const switchClasses =
  'peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50';

// RTL deviation: observed classes translate with +x only; rtl: variants mirror the checked position.
const thumbClasses =
  'pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-checked:rtl:-translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:rtl:-translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground';

/** <button uiSwitch [(checked)]="on" size="sm"></button> */
@Component({
  selector: 'button[uiSwitch], ui-switch', hostDirectives: [UiElementHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSwitch), multi: true }],
  host: {
    type: 'button',
    role: 'switch',
    'data-slot': 'switch',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-invalid]': 'invalid() ? "true" : null',
    '[attr.data-state]': 'checked() ? "checked" : "unchecked"',
    '[attr.data-size]': 'size()',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.disabled]': 'isDisabled() ? "" : null',
    '[attr.class]': 'classes()',
    '(click)': 'toggle()',
    '(blur)': 'onTouched()',
  },
  template: `<span data-slot="switch-thumb" [attr.data-state]="checked() ? 'checked' : 'unchecked'" [attr.data-disabled]="isDisabled() ? '' : null" [class]="thumb"></span>`,
})
export class UiSwitch implements ControlValueAccessor {
  readonly checked = model(false);
  readonly size = input<'default' | 'sm'>('default');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly thumb = thumbClasses;
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected readonly classes = computed(() => cn(switchClasses, this.userClass()));

  private onChange: (v: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected toggle(): void {
    if (this.isDisabled()) return;
    const next = !this.checked();
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
