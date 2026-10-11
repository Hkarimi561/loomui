import { booleanAttribute, ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UiNativeControl } from '@loomui-ng/ui/utils';
import { UI_INPUT_GROUP_GENERATED, UiInputGroupControl } from './input-group';

/**
 * <ui-input-group><ui-input-group-control placeholder="Search…" /></ui-input-group>
 * Custom-element form of `<input uiInputGroupControl>`: a real input lives inside, so ngModel / reactive forms work.
 */
@Component({
  selector: 'ui-input-group-control',
  imports: [UiInputGroupControl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiInputGroupControlElement), multi: true }],
  host: { class: 'contents' },
  template: `<input #control uiInputGroupControl [class]="userClass()" [type]="type()" [attr.id]="id() || null" [attr.name]="name() || null" [attr.placeholder]="placeholder() || null" [value]="current()" [disabled]="isDisabled()" [readOnly]="readonly()" [required]="required()" [attr.autocomplete]="autocomplete() || null" [attr.aria-label]="ariaLabel() || null" [attr.aria-describedby]="ariaDescribedby() || null" [attr.aria-invalid]="invalid() ? 'true' : null" (input)="onInput($event)" (blur)="onTouched()" [attr.min]="min() ?? null" [attr.max]="max() ?? null" [attr.step]="step() ?? null" [attr.pattern]="pattern() || null" [attr.maxlength]="maxlength() ?? null" [attr.minlength]="minlength() ?? null" [attr.accept]="accept() || null" [attr.inputmode]="inputmode() || null" [multiple]="multiple()" />`,
})
export class UiInputGroupControlElement extends UiNativeControl {
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

export const UI_INPUT_GROUP = [...UI_INPUT_GROUP_GENERATED, UiInputGroupControlElement] as const;
