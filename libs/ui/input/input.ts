import { computed, Directive, input, ChangeDetectionStrategy, Component, forwardRef, booleanAttribute } from '@angular/core';
import { cn, UiNativeControl } from '@loomui/ui/utils';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export const inputClasses =
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40';

/**
 * <input uiInput />
 * Styles a native <input>, so ngModel, reactive forms and signal forms (`[field]`) work unchanged.
 */
@Directive({
  selector: 'input[uiInput]',
  host: { 'data-slot': 'input', '[attr.class]': 'classes()' },
})
export class UiInput {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(inputClasses, this.userClass()));
}

/**
 * <ui-input type="email" placeholder="you@example.com" [(ngModel)]="email" />
 * Custom-element form of `<input uiInput>`: a real input lives inside, so ngModel / reactive forms work.
 */
@Component({
  selector: 'ui-input',
  imports: [UiInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiInputElement), multi: true }],
  host: { class: 'contents' },
  template: `<input #control uiInput [class]="userClass()" [type]="type()" [attr.id]="id() || null" [attr.name]="name() || null" [attr.placeholder]="placeholder() || null" [value]="current()" [disabled]="isDisabled()" [readOnly]="readonly()" [required]="required()" [attr.autocomplete]="autocomplete() || null" [attr.aria-label]="ariaLabel() || null" [attr.aria-describedby]="ariaDescribedby() || null" [attr.aria-invalid]="invalid() ? 'true' : null" (input)="onInput($event)" (blur)="onTouched()" [attr.min]="min() ?? null" [attr.max]="max() ?? null" [attr.step]="step() ?? null" [attr.pattern]="pattern() || null" [attr.maxlength]="maxlength() ?? null" [attr.minlength]="minlength() ?? null" [attr.accept]="accept() || null" [attr.inputmode]="inputmode() || null" [multiple]="multiple()" />`,
})
export class UiInputElement extends UiNativeControl {
  readonly type = input<string>('text');
  readonly min = input<string | number | null>(null);
  readonly max = input<string | number | null>(null);
  readonly step = input<string | number | null>(null);
  readonly pattern = input<string>('');
  readonly maxlength = input<number | null>(null);
  readonly minlength = input<number | null>(null);
  readonly accept = input<string>('');
  readonly inputmode = input<string>('');
  readonly multiple = input(false, { transform: booleanAttribute });
}

export const UI_INPUT = [UiInput, UiInputElement] as const;
