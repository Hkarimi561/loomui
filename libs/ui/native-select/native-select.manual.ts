import { ChangeDetectionStrategy, Component, computed, input, afterEveryRender, forwardRef } from '@angular/core';
import { cn, UiNativeControl } from '@loomui/ui/utils';
import { UI_NATIVE_SELECT_GENERATED, UiNativeSelect } from './native-select';
import { UiIconSvg } from '@loomui/ui/icon';
import { UiElementHost } from '@loomui/ui/utils';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * <div uiNativeSelectWrapper><select uiNativeSelect>…</select></div>
 * Wraps a native <select> and draws the chevron (observed: `native-select-icon`, aria-hidden).
 */
@Component({
  selector: 'div[uiNativeSelectWrapper], ui-native-select-wrapper', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'native-select-wrapper', '[attr.class]': 'classes()' },
  template: `
    <ng-content />
    <svg uiIcon="chevron-down" data-slot="native-select-icon" class="pointer-events-none absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground select-none"></svg>
  `,
})
export class UiNativeSelectWrapper {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('group/native-select relative w-fit has-[select:disabled]:opacity-50', this.userClass()),
  );
}

/**
 * <ui-native-select [(ngModel)]="fruit"><option value="a">Apple</option></ui-native-select>
 * Custom-element form of the wrapper + `<select uiNativeSelect>`. Options stay native <option> elements (a <select> only
 * accepts <option>/<optgroup> children, so there are no option custom elements).
 */
@Component({
  selector: 'ui-native-select',
  imports: [UiNativeSelect, UiNativeSelectWrapper],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiNativeSelectElement), multi: true }],
  host: { class: 'contents' },
  template: `<div uiNativeSelectWrapper><select #control uiNativeSelect [size]="size()" [class]="userClass()" [attr.id]="id() || null" [attr.name]="name() || null" [disabled]="isDisabled()" [required]="required()" [attr.aria-label]="ariaLabel() || null" [attr.aria-describedby]="ariaDescribedby() || null" [attr.aria-invalid]="invalid() ? 'true' : null" (change)="onInput($event)" (blur)="onTouched()"><ng-content /></select></div>`,
})
export class UiNativeSelectElement extends UiNativeControl {
  readonly size = input<'default' | 'sm'>('default');
  constructor() {
    super();
    // Options are projected by the consumer and may appear after the first binding pass: keep the control in sync.
    afterEveryRender(() => {
      const el = this.control().nativeElement;
      const v = this.current();
      if (v !== '' && el.value !== v) el.value = v;
    });
  }
}

export const UI_NATIVE_SELECT = [UiNativeSelectWrapper, ...UI_NATIVE_SELECT_GENERATED, UiNativeSelectElement] as const;
