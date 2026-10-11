import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { cn } from '@loomui-ng/ui/utils';
import { nextId, whenAnimationDone } from '@loomui-ng/ui/utils';
import {
  accordionClass,
  accordionContentClass,
  accordionItemClass,
  accordionTriggerClass,
} from './accordion';
import { UiIconSvg } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * <div uiAccordion type="single" [(value)]="open" class="rounded-lg border">
 *   <div uiAccordionItem value="a">
 *     <button uiAccordionTrigger>Question</button>
 *     <div uiAccordionContent>Answer</div>
 *   </div>
 * </div>
 * `value` is always an array (single mode holds at most one entry).
 */
@Directive({
  selector: '[uiAccordion], ui-accordion', hostDirectives: [UiElementHost],
  exportAs: 'uiAccordion',
  host: {
    'data-slot': 'accordion',
    '[attr.data-orientation]': 'orientation()',
    '[attr.class]': 'classes()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiAccordion {
  readonly type = input<'single' | 'multiple'>('single');
  readonly collapsible = input(true, { transform: booleanAttribute });
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  readonly value = model<string[]>([]);
  readonly userClass = input<string>('', { alias: 'class' });
  readonly baseId = nextId('ui-accordion');

  private readonly dir = inject(Directionality);
  private readonly triggers = contentChildren(forwardRef(() => UiAccordionTrigger), { descendants: true });
  protected readonly classes = computed(() => cn(accordionClass, this.userClass()));

  isOpen(v: string): boolean {
    return this.value().includes(v);
  }

  toggle(v: string): void {
    const open = this.isOpen(v);
    if (this.type() === 'multiple') {
      this.value.update((list) => (open ? list.filter((x) => x !== v) : [...list, v]));
    } else if (open) {
      if (this.collapsible()) this.value.set([]);
    } else {
      this.value.set([v]);
    }
  }

  protected onKeydown(e: KeyboardEvent): void {
    const enabled = this.triggers().filter((t) => !t.isDisabled());
    const i = enabled.findIndex((t) => t.el === document.activeElement);
    if (i < 0) return;
    const horizontal = this.orientation() === 'horizontal';
    const rtl = this.dir.value === 'rtl';
    const next = horizontal ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    const prev = horizontal ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
    let target = -1;
    if (e.key === next) target = (i + 1) % enabled.length;
    else if (e.key === prev) target = (i - 1 + enabled.length) % enabled.length;
    else if (e.key === 'Home') target = 0;
    else if (e.key === 'End') target = enabled.length - 1;
    if (target >= 0) {
      e.preventDefault();
      enabled[target].el.focus();
    }
  }
}

@Directive({
  selector: '[uiAccordionItem], ui-accordion-item', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'accordion-item',
    '[attr.data-state]': 'open() ? "open" : "closed"',
    '[attr.data-orientation]': 'root.orientation()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.class]': 'classes()',
  },
})
export class UiAccordionItem {
  protected readonly root = inject(UiAccordion);
  readonly value = input<string>('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  readonly open = computed(() => this.root.isOpen(this.value()));
  readonly triggerId = computed(() => `${this.root.baseId}-trigger-${this.value()}`);
  readonly contentId = computed(() => `${this.root.baseId}-content-${this.value()}`);
  protected readonly classes = computed(() => cn(accordionItemClass, this.userClass()));
}

const CHEVRON =
  'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

@Component({
  selector: 'button[uiAccordionTrigger], ui-accordion-trigger', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    'data-slot': 'accordion-trigger',
    '[id]': 'item.triggerId()',
    '[attr.aria-expanded]': 'item.open()',
    '[attr.aria-controls]': 'item.contentId()',
    '[attr.data-state]': 'item.open() ? "open" : "closed"',
    '[attr.data-orientation]': 'root.orientation()',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.disabled]': '(isDisabled()) ? "" : null',
    '[attr.class]': 'classes()',
    '(click)': 'root.toggle(item.value())',
  },
  template: `
    <ng-content />
    <svg uiIcon="chevron-down" data-slot="accordion-trigger-icon" class="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"></svg>
    <svg uiIcon="chevron-up" data-slot="accordion-trigger-icon" class="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"></svg>
  `,
})
export class UiAccordionTrigger {
  protected readonly root = inject(UiAccordion);
  protected readonly item = inject(UiAccordionItem);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly userClass = input<string>('', { alias: 'class' });
  isDisabled = () => this.item.disabled();
  protected readonly classes = computed(() => cn(accordionTriggerClass, this.userClass()));
}

@Component({
  selector: '[uiAccordionContent], ui-accordion-content', hostDirectives: [UiElementHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'region',
    'data-slot': 'accordion-content',
    '[id]': 'item.contentId()',
    '[attr.aria-labelledby]': 'item.triggerId()',
    '[attr.data-state]': 'item.open() ? "open" : "closed"',
    '[attr.data-orientation]': 'root.orientation()',
    '[attr.data-disabled]': 'item.disabled() ? "" : null',
    '[hidden]': '!present()',
    '[attr.class]': 'classes()',
  },
  template: `<div #inner class="pt-0 pb-2.5"><ng-content /></div>`,
})
export class UiAccordionContent {
  protected readonly root = inject(UiAccordion);
  protected readonly item = inject(UiAccordionItem);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly inner = viewChild.required<ElementRef<HTMLElement>>('inner');
  readonly userClass = input<string>('', { alias: 'class' });
  /** Stays true during the exit animation so `animate-accordion-up` can play. */
  protected readonly present = signal(false);
  protected readonly classes = computed(() => cn(accordionContentClass, this.userClass()));

  constructor() {
    effect(() => {
      const open = this.item.open();
      untracked(() => {
        if (open) {
          this.present.set(true);
          setTimeout(() => this.setHeight(), 0);
        } else if (this.present()) {
          this.setHeight();
          void whenAnimationDone(this.el, 400).then(() => !this.item.open() && this.present.set(false));
        }
      });
    });
  }

  private setHeight(): void {
    this.el.style.setProperty('--radix-accordion-content-height', `${this.inner().nativeElement.scrollHeight}px`);
  }
}

export const UI_ACCORDION = [UiAccordion, UiAccordionItem, UiAccordionTrigger, UiAccordionContent] as const;
