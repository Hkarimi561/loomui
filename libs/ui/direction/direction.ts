import { Directionality, type Direction } from '@angular/cdk/bidi';
import { computed, Directive, effect, ElementRef, EventEmitter, forwardRef, inject, input, OnDestroy } from '@angular/core';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * shadcn's DirectionProvider (Radix) sets `dir` for a subtree so every primitive resolves layout/keyboard direction from it.
 * Here the provider sets the `dir` attribute and replaces CDK's `Directionality` for descendants, so all Loom UI components
 * (menus, tabs, carousel, calendar, sliders, overlays) follow the subtree direction instead of the document's.
 *
 * <div uiDirection="rtl"> … </div>
 */
@Directive({
  selector: '[uiDirection], ui-direction', hostDirectives: [UiElementHost],
  exportAs: 'uiDirection',
  providers: [{ provide: Directionality, useExisting: forwardRef(() => UiDirection) }],
  host: { '[attr.dir]': 'dir()' },
})
export class UiDirection implements OnDestroy {
  /** Attribute form: `<div [uiDirection]="'rtl'">`. */
  readonly attrDir = input<Direction | ''>('', { alias: 'uiDirection' });
  /** Element form: `<ui-direction dir="rtl">`. */
  readonly elDir = input<Direction | ''>('', { alias: 'dir' });
  readonly dir = computed<Direction>(() => (this.attrDir() || this.elDir() || 'ltr') as Direction);
  readonly change = new EventEmitter<Direction>();
  /** Resolved value read by CDK consumers (`Directionality#value`). */
  get value(): Direction {
    return this.dir() === 'rtl' ? 'rtl' : 'ltr';
  }
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  constructor() {
    effect(() => {
      const d = this.value;
      this.el.setAttribute('dir', d);
      this.change.emit(d);
    });
  }
  ngOnDestroy(): void {
    this.change.complete();
  }
}

export const UI_DIRECTION = [UiDirection] as const;
