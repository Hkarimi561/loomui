import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { cn } from '@loomui/ui/utils';
import { nextId, whenAnimationDone } from '@loomui/ui/utils';
import { collapsibleClass, collapsibleContentClass } from './collapsible';
import { UiElementHost } from '@loomui/ui/utils';

/**
 * <div uiCollapsible [(open)]="o">
 *   <button uiCollapsibleTrigger>Toggle</button>
 *   <div uiCollapsibleContent>…</div>
 * </div>
 */
@Directive({
  selector: '[uiCollapsible], ui-collapsible', hostDirectives: [UiElementHost],
  exportAs: 'uiCollapsible',
  host: {
    'data-slot': 'collapsible',
    '[attr.data-state]': 'open() ? "open" : "closed"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.class]': 'classes()',
  },
})
export class UiCollapsible {
  readonly open = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  readonly contentId = nextId('ui-collapsible');
  protected readonly classes = computed(() => cn(collapsibleClass, this.userClass()));
  toggle(): void {
    if (!this.disabled()) this.open.update((v) => !v);
  }
}

@Directive({
  selector: '[uiCollapsibleTrigger], ui-collapsible-trigger', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'collapsible-trigger',
    '[attr.aria-controls]': 'root.contentId',
    '[attr.aria-expanded]': 'root.open()',
    '[attr.data-state]': 'root.open() ? "open" : "closed"',
    '[attr.data-disabled]': 'root.disabled() ? "" : null',
    '[attr.disabled]': 'root.disabled() ? "" : null',
    '(click)': 'root.toggle()',
  },
})
export class UiCollapsibleTrigger {
  protected readonly root = inject(UiCollapsible);
}

@Directive({
  selector: '[uiCollapsibleContent], ui-collapsible-content', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'collapsible-content',
    '[id]': 'root.contentId',
    '[attr.data-state]': 'root.open() ? "open" : "closed"',
    '[attr.data-disabled]': 'root.disabled() ? "" : null',
    '[hidden]': '!present()',
    '[attr.class]': 'classes()',
  },
})
export class UiCollapsibleContent {
  protected readonly root = inject(UiCollapsible);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly present = signal(false);
  protected readonly classes = computed(() => cn(collapsibleContentClass, this.userClass()));

  constructor() {
    effect(() => {
      const open = this.root.open();
      untracked(() => {
        if (open) {
          this.present.set(true);
          setTimeout(() => this.setHeight(), 0);
        } else if (this.present()) {
          this.setHeight();
          void whenAnimationDone(this.el, 300).then(() => !this.root.open() && this.present.set(false));
        }
      });
    });
  }

  private setHeight(): void {
    this.el.style.setProperty('--radix-collapsible-content-height', `${this.el.scrollHeight}px`);
  }
}

export const UI_COLLAPSIBLE = [UiCollapsible, UiCollapsibleTrigger, UiCollapsibleContent] as const;
