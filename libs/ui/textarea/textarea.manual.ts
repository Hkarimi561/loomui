import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UiNativeControl } from '@loomui/ui/utils';
import { UI_TEXTAREA_GENERATED, UiTextarea } from './textarea';

/** <ui-textarea rows="4" [(ngModel)]="bio" /> — custom-element form of `<textarea uiTextarea>` (a real textarea lives inside). */
@Component({
  selector: 'ui-textarea',
  imports: [UiTextarea],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiTextareaElement), multi: true }],
  host: { class: 'contents' },
  template: `<textarea #control uiTextarea [class]="userClass()" [attr.id]="id() || null" [attr.name]="name() || null" [attr.placeholder]="placeholder() || null" [value]="current()" [disabled]="isDisabled()" [readOnly]="readonly()" [required]="required()" [attr.autocomplete]="autocomplete() || null" [attr.aria-label]="ariaLabel() || null" [attr.aria-describedby]="ariaDescribedby() || null" [attr.aria-invalid]="invalid() ? 'true' : null" (input)="onInput($event)" (blur)="onTouched()" [attr.rows]="rows() ?? null" [attr.cols]="cols() ?? null" [attr.maxlength]="maxlength() ?? null" [attr.minlength]="minlength() ?? null" [attr.wrap]="wrap() || null"></textarea>`,
})
export class UiTextareaElement extends UiNativeControl {
  readonly rows = input<number | string | null>(null);
  readonly cols = input<number | string | null>(null);
  readonly maxlength = input<number | null>(null);
  readonly minlength = input<number | null>(null);
  readonly wrap = input<string>('');
}

export const UI_TEXTAREA = [...UI_TEXTAREA_GENERATED, UiTextareaElement] as const;
