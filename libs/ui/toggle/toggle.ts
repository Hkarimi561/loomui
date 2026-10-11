import { booleanAttribute, computed, Directive, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@loomui/ui/utils';
import { UiElementHost } from '@loomui/ui/utils';

/** Classes derived from the live Toggle (docs/behavior-specs/toggle.md); pl/pr → ps/pe for RTL. */
export const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-transparent hover:bg-muted',
        outline: 'border border-input bg-transparent hover:bg-muted',
      },
      size: {
        default: 'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2',
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);
export type ToggleVariants = VariantProps<typeof toggleVariants>;

/** <button uiToggle [(pressed)]="bold" aria-label="Toggle bold">B</button> */
@Directive({
  selector: 'button[uiToggle], ui-toggle', hostDirectives: [UiElementHost],
  exportAs: 'uiToggle',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiToggle), multi: true }],
  host: {
    type: 'button',
    'data-slot': 'toggle',
    '[attr.aria-pressed]': 'pressed()',
    '[attr.data-state]': 'pressed() ? "on" : "off"',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.disabled]': '(isDisabled()) ? "" : null',
    '[attr.class]': 'classes()',
    '(click)': 'toggle()',
    '(blur)': 'onTouched()',
  },
})
export class UiToggle implements ControlValueAccessor {
  readonly pressed = model(false);
  readonly variant = input<NonNullable<ToggleVariants['variant']>>('default');
  readonly size = input<NonNullable<ToggleVariants['size']>>('default');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  private readonly cvaDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected readonly classes = computed(() => cn(toggleVariants({ variant: this.variant(), size: this.size() }), this.userClass()));

  private onChange: (v: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected toggle(): void {
    if (this.isDisabled()) return;
    const next = !this.pressed();
    this.pressed.set(next);
    this.onChange(next);
  }
  writeValue(v: boolean | null): void {
    this.pressed.set(!!v);
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

export const UI_TOGGLE = [UiToggle] as const;
