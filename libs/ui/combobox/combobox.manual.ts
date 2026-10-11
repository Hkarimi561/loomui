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
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { buttonVariants } from '@loomui/ui/button';
import { cn } from '@loomui/ui/utils';
import { UiLayerRoot } from '@loomui/ui/utils';
import { nextId } from '@loomui/ui/utils';
import { UiPopperContentBase } from '@loomui/ui/utils';
import { comboboxContentClass, comboboxEmptyClass, comboboxItemClass, comboboxListClass } from './combobox';
import { UiIconSvg } from '@loomui/ui/icon';
import { UiElementHost } from '@loomui/ui/utils';

/**
 * Searchable single-select (shadcn "Combobox").
 * <div uiCombobox [(value)]="v" class="contents">
 *   <button uiComboboxTrigger><span uiComboboxValue placeholder="Select framework…"></span></button>
 *   <div uiComboboxContent>
 *     <input uiComboboxInput placeholder="Search…" />
 *     <div uiComboboxList>
 *       <div uiComboboxEmpty>No results.</div>
 *       <div uiComboboxItem value="next">Next.js</div>
 *     </div>
 *   </div>
 * </div>
 * Observed on the live page (Base UI based): trigger role="combobox" aria-haspopup, list role="listbox", items role="option"
 * aria-selected, empty state role="status" aria-live="polite", content data-side/data-align. Not implemented: multi-select
 * chips (`combobox-chips`, `combobox-chip`, clear button) — classes are generated but no behavior is attached.
 */
@Directive({
  selector: '[uiCombobox], ui-combobox', hostDirectives: [UiElementHost],
  exportAs: 'uiCombobox',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCombobox), multi: true }],
})
export class UiCombobox extends UiLayerRoot implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly listId = nextId('ui-combobox-list');
  readonly search = signal('');
  readonly highlighted = signal<string | null>(null);
  readonly items = contentChildren(forwardRef(() => UiComboboxItem), { descendants: true });
  private readonly cvaDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  readonly selectedLabel = computed(() => this.items().find((i) => i.value() === this.value())?.label() ?? '');
  readonly visible = computed(() => this.items().filter((i) => i.visible()));
  readonly hasResults = computed(() => this.visible().length > 0);
  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    super();
    effect(() => {
      // reset search + highlight whenever the popup opens
      if (this.open()) {
        this.search.set('');
        queueMicrotask(() => this.ensureHighlight(true));
      }
    });
  }

  ensureHighlight(reset = false): void {
    const enabled = this.visible().filter((i) => !i.disabled);
    const selected = enabled.find((i) => i.value() === this.value());
    if (reset) this.highlighted.set((selected ?? enabled[0])?.id ?? null);
    else if (!enabled.some((i) => i.id === this.highlighted())) this.highlighted.set(enabled[0]?.id ?? null);
  }
  move(delta: 1 | -1 | 'first' | 'last'): void {
    const enabled = this.visible().filter((i) => !i.disabled);
    if (!enabled.length) return;
    let idx = enabled.findIndex((i) => i.id === this.highlighted());
    if (delta === 'first') idx = 0;
    else if (delta === 'last') idx = enabled.length - 1;
    else idx = (idx + delta + enabled.length) % enabled.length;
    this.highlighted.set(enabled[idx].id);
    enabled[idx].scrollIntoView();
  }
  choose(v: string): void {
    this.value.set(v);
    this.onChange(v);
    this.close();
  }
  chooseHighlighted(): void {
    this.items().find((i) => i.id === this.highlighted())?.activate();
  }

  writeValue(v: string | null): void {
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.cvaDisabled.set(d);
  }
}

@Component({
  selector: 'button[uiComboboxTrigger], ui-combobox-trigger', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    role: 'combobox',
    'aria-haspopup': 'listbox',
    'data-slot': 'combobox-trigger',
    '[attr.aria-expanded]': 'root.open()',
    '[attr.aria-controls]': 'root.open() ? root.listId : null',
    '[attr.data-state]': 'root.open() ? "open" : "closed"',
    '[attr.data-placeholder]': 'root.value() === "" ? "" : null',
    '[attr.disabled]': '(root.isDisabled()) ? "" : null',
    '[attr.class]': 'classes()',
    '(click)': 'root.toggle()',
    '(keydown)': 'onKeydown($event)',
    '(blur)': 'root.onTouched()',
  },
  template: `<ng-content /><svg uiIcon="chevrons-up-down" class="pointer-events-none size-4 shrink-0 text-muted-foreground"></svg>`,
})
export class UiComboboxTrigger {
  protected readonly root = inject(UiCombobox);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(buttonVariants({ variant: 'outline' }), 'w-[200px] justify-between font-normal', this.userClass()),
  );
  constructor() {
    this.root.trigger.set(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement);
  }
  protected onKeydown(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.root.open.set(true);
    }
  }
}

@Directive({
  selector: '[uiComboboxValue], ui-combobox-value', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'combobox-value', '[textContent]': 'text()', '[class.text-muted-foreground]': '!root.selectedLabel()' },
})
export class UiComboboxValue {
  protected readonly root = inject(UiCombobox);
  readonly placeholder = input('');
  protected readonly text = computed(() => this.root.selectedLabel() || this.placeholder());
}

@Directive({
  selector: '[uiComboboxContent], ui-combobox-content', hostDirectives: [UiElementHost],
  host: {
    role: 'presentation',
    'data-slot': 'combobox-content',
    'data-chips': 'false',
    tabindex: '-1',
    '[attr.data-open]': 'root.state() === "open" ? "" : null',
    '[attr.data-state]': 'root.state()',
    '[attr.data-empty]': '!root.hasResults() ? "" : null',
    '[attr.class]': 'classes()',
  },
})
export class UiComboboxContent extends UiPopperContentBase {
  protected readonly root = inject(UiCombobox);
  protected readonly varPrefix = '--radix-combobox';
  override readonly align = input<'start' | 'center' | 'end'>('start');
  protected readonly classes = computed(() => cn(comboboxContentClass, this.userClass()));
  constructor() {
    super();
    this.matchTriggerWidth = true;
    this.init();
  }
  protected override onAttached(): void {
    // Base UI exposes these as CSS variables; the shadcn classes read them.
    const t = this.root.trigger();
    if (t) {
      const r = t.getBoundingClientRect();
      this.el.style.setProperty('--anchor-width', `${r.width}px`);
      this.el.style.setProperty('--available-height', `${window.innerHeight - 16}px`);
      this.el.style.setProperty('--available-width', `${window.innerWidth - 16}px`);
      this.el.style.setProperty('--transform-origin', 'top');
    }
    queueMicrotask(() => this.el.querySelector<HTMLInputElement>('[data-slot=combobox-input]')?.focus());
  }
}

@Directive({
  selector: 'input[uiComboboxInput]',
  host: {
    'data-slot': 'combobox-input',
    type: 'text',
    role: 'combobox',
    autocomplete: 'off',
    spellcheck: 'false',
    'aria-autocomplete': 'list',
    'aria-expanded': 'true',
    '[attr.aria-controls]': 'root.listId',
    '[attr.aria-activedescendant]': 'root.highlighted()',
    class: 'w-full border-b border-input bg-transparent px-3 py-2 text-sm outline-hidden placeholder:text-muted-foreground',
    '(input)': 'onInput($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiComboboxInput {
  protected readonly root = inject(UiCombobox);
  protected onInput(e: Event): void {
    this.root.search.set((e.target as HTMLInputElement).value);
    queueMicrotask(() => this.root.ensureHighlight());
  }
  protected onKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        return this.root.move(1);
      case 'ArrowUp':
        e.preventDefault();
        return this.root.move(-1);
      case 'Home':
        e.preventDefault();
        return this.root.move('first');
      case 'End':
        e.preventDefault();
        return this.root.move('last');
      case 'Enter':
        e.preventDefault();
        return this.root.chooseHighlighted();
    }
  }
}

@Directive({
  selector: '[uiComboboxList], ui-combobox-list', hostDirectives: [UiElementHost],
  host: { role: 'listbox', tabindex: '-1', 'aria-orientation': 'vertical', 'data-slot': 'combobox-list', '[id]': 'root.listId', '[attr.class]': 'classes()' },
})
export class UiComboboxList {
  protected readonly root = inject(UiCombobox);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(comboboxListClass, this.userClass()));
}

@Directive({
  selector: '[uiComboboxEmpty], ui-combobox-empty', hostDirectives: [UiElementHost],
  host: { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true', 'data-slot': 'combobox-empty', '[hidden]': 'root.hasResults()', '[attr.class]': 'classes()' },
})
export class UiComboboxEmpty {
  protected readonly root = inject(UiCombobox);
  readonly userClass = input<string>('', { alias: 'class' });
  // Observed base uses `hidden … group-data-empty/combobox-content:flex`; we toggle via [hidden] and force flex when shown.
  protected readonly classes = computed(() => cn(comboboxEmptyClass, 'flex', this.userClass()));
}

@Component({
  selector: '[uiComboboxItem], ui-combobox-item', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    'data-slot': 'combobox-item',
    '[id]': 'id',
    '[attr.aria-selected]': 'selected()',
    '[attr.data-highlighted]': 'highlighted() ? "" : null',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.aria-disabled]': 'disabled ? "true" : null',
    '[hidden]': '!visible()',
    '[attr.class]': 'classes()',
    '(click)': 'activate()',
    '(pointermove)': 'onMove()',
  },
  template: `
    <span><ng-content /></span>
    <span class="pointer-events-none absolute end-2 flex size-4 items-center justify-center">
      @if (selected()) {
        <svg uiIcon="check"></svg>
      }
    </span>
  `,
})
export class UiComboboxItem {
  private readonly root = inject(UiCombobox);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly id = nextId('ui-combobox-item');
  readonly value = input<string>('');
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  readonly label = signal('');
  get disabled(): boolean {
    return this.disabledInput();
  }
  protected readonly selected = computed(() => this.root.value() === this.value());
  protected readonly highlighted = computed(() => this.root.highlighted() === this.id);
  readonly visible = computed(() => {
    const q = this.root.search().trim().toLowerCase();
    return !q || (this.label() || this.value()).toLowerCase().includes(q);
  });
  protected readonly classes = computed(() => cn(comboboxItemClass, this.userClass()));

  constructor() {
    effect(() => {
      this.value();
      queueMicrotask(() => this.label.set((this.el.querySelector('span')?.textContent ?? '').trim()));
    });
  }
  activate(): void {
    if (!this.disabled) this.root.choose(this.value());
  }
  scrollIntoView(): void {
    this.el.scrollIntoView({ block: 'nearest' });
  }
  protected onMove(): void {
    if (!this.disabled && this.root.highlighted() !== this.id) this.root.highlighted.set(this.id);
  }
}

/** <ui-combobox-input placeholder="Search…" /> — custom-element form of `<input uiComboboxInput>`. */
@Component({
  selector: 'ui-combobox-input',
  imports: [UiComboboxInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `<input uiComboboxInput [attr.placeholder]="placeholder() || null" [attr.aria-label]="ariaLabel() || null" />`,
})
export class UiComboboxInputElement {
  readonly placeholder = input<string>('');
  readonly ariaLabel = input<string>('', { alias: 'aria-label' });
}

export const UI_COMBOBOX = [
  UiCombobox,
  UiComboboxTrigger,
  UiComboboxValue,
  UiComboboxContent,
  UiComboboxInput,
  UiComboboxList,
  UiComboboxEmpty,
  UiComboboxItem,
  UiComboboxInputElement,
] as const;
