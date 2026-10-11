import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { buttonVariants } from '@loomui-ng/ui/button';
import { UiCalendar } from '@loomui-ng/ui/calendar';
import { UI_POPOVER, UiPopover } from '@loomui-ng/ui/popover';
import { cn } from '@loomui-ng/ui/utils';
import { UiIconSvg } from '@loomui-ng/ui/icon';

/**
 * shadcn's "Date Picker" is a recipe: Popover + Calendar + outline Button (`data-empty` while no date, muted text).
 * <ui-date-picker [(value)]="date" placeholder="Pick a date" />
 * Works with ngModel / reactive forms (ControlValueAccessor) and as a signal-forms value control (`value` model).
 * Selecting a date closes the popover and returns focus to the trigger (Radix Popover behavior).
 */
@Component({
  selector: 'ui-date-picker',
  imports: [UiIconSvg, UI_POPOVER, UiCalendar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiDatePicker), multi: true }],
  host: { 'data-slot': 'date-picker', class: 'contents' },
  template: `
    <div uiPopover class="contents">
      <button
        uiPopoverTrigger
        type="button"
        data-slot="date-picker-trigger"
        [attr.data-empty]="value() ? null : ''"
        [disabled]="isDisabled()"
        [class]="triggerClasses()"
        [attr.aria-invalid]="invalid() ? 'true' : null"
      >
        <svg uiIcon="calendar" class="size-4"></svg>
        {{ label() }}
      </button>
      <div uiPopoverContent class="w-auto p-0" align="start">
        <div uiCalendar mode="single" [selected]="value() ?? undefined" (selectedChange)="pick($event)"></div>
      </div>
    </div>
  `,
})
export class UiDatePicker implements ControlValueAccessor {
  readonly value = model<Date | null>(null);
  readonly placeholder = input('Pick a date');
  readonly locale = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });

  private readonly popover = viewChild(UiPopover);
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected readonly label = computed(() => {
    const v = this.value();
    return v ? new Intl.DateTimeFormat(this.locale(), { dateStyle: 'long' }).format(v) : this.placeholder();
  });
  protected readonly triggerClasses = computed(() =>
    cn(
      buttonVariants({ variant: 'outline' }),
      'w-[240px] justify-start text-start font-normal data-[empty]:text-muted-foreground',
      this.userClass(),
    ),
  );

  private onChange: (v: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  protected pick(sel: unknown): void {
    const d = sel instanceof Date ? sel : null;
    this.value.set(d);
    this.onChange(d);
    this.onTouched();
    this.popover()?.close();
  }

  writeValue(v: Date | null): void {
    this.value.set(v ?? null);
  }
  registerOnChange(fn: (v: Date | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.cvaDisabled.set(d);
  }
}
