import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
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
import { cn } from '@loomui-ng/ui/utils';
import { UiLayerRoot } from '@loomui-ng/ui/utils';
import { UiPopperContentBase } from '@loomui-ng/ui/utils';
import { UiIconSvg } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

const TRIGGER_CLASS =
  "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 ps-2.5 pe-2 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

// Radix "item-aligned" positioning (data-align-trigger) is NOT reproduced; the list opens below the trigger (popper mode).
const CONTENT_CLASS =
  'relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95';

const ITEM_CLASS =
  "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 ps-1.5 pe-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2";

/**
 * <div uiSelect [(value)]="v" class="contents">
 *   <button uiSelectTrigger><span uiSelectValue placeholder="Pick one"></span></button>
 *   <div uiSelectContent><div uiSelectGroup>
 *     <div uiSelectLabel>Fruits</div><div uiSelectItem value="apple">Apple</div>
 *   </div></div>
 * </div>
 * Form control: ngModel / reactive forms (CVA); `value` + `disabled` also match Angular signal forms' FormValueControl.
 */
@Directive({
  selector: '[uiSelect], ui-select', hostDirectives: [UiElementHost],
  exportAs: 'uiSelect',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSelect), multi: true }],
})
export class UiSelect extends UiLayerRoot implements ControlValueAccessor {
  readonly value = model<string>('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  private readonly cvaDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  readonly items = contentChildren(forwardRef(() => UiSelectItem), { descendants: true });
  readonly manager = signal<FocusKeyManager<UiSelectItem> | null>(null);
  keyboardOpen = false;
  readonly selectedLabel = computed(() => this.items().find((i) => i.value() === this.value())?.label() ?? '');

  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  choose(v: string): void {
    this.value.set(v);
    this.onChange(v);
    this.close();
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
  selector: 'button[uiSelectTrigger], ui-select-trigger', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    role: 'combobox',
    'aria-autocomplete': 'none',
    'data-slot': 'select-trigger',
    '[attr.aria-controls]': 'root.id',
    '[attr.aria-expanded]': 'root.open()',
    '[attr.aria-invalid]': 'root.invalid() ? "true" : null',
    '[attr.data-state]': 'root.open() ? "open" : "closed"',
    '[attr.data-placeholder]': 'root.value() === "" ? "" : null',
    '[attr.data-size]': 'size()',
    '[attr.data-disabled]': 'root.isDisabled() ? "" : null',
    '[attr.disabled]': '(root.isDisabled()) ? "" : null',
    '[attr.class]': 'classes()',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
    '(blur)': 'root.onTouched()',
  },
  template: `
    <ng-content />
    <svg uiIcon="chevron-down" class="pointer-events-none size-4 text-muted-foreground"></svg>
  `,
})
export class UiSelectTrigger {
  protected readonly root = inject(UiSelect);
  readonly size = input<'default' | 'sm'>('default');
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(TRIGGER_CLASS, this.userClass()));

  constructor() {
    this.root.trigger.set(inject<ElementRef<HTMLElement>>(ElementRef).nativeElement);
  }

  protected onClick(): void {
    this.root.keyboardOpen = false;
    this.root.toggle();
  }

  protected onKeydown(e: KeyboardEvent): void {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      this.root.keyboardOpen = true;
      this.root.open.set(true);
    }
  }
}

@Directive({
  selector: '[uiSelectValue], ui-select-value', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'select-value', style: 'pointer-events: none', '[textContent]': 'text()' },
})
export class UiSelectValue {
  private readonly root = inject(UiSelect);
  readonly placeholder = input('');
  protected readonly text = computed(() => this.root.selectedLabel() || this.placeholder());
}

@Directive({
  selector: '[uiSelectContent], ui-select-content', hostDirectives: [UiElementHost],
  host: {
    role: 'listbox',
    'data-slot': 'select-content',
    tabindex: '-1',
    '[id]': 'root.id',
    '[attr.data-state]': 'root.state()',
    '[attr.dir]': 'dir.value',
    '[attr.class]': 'classes()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiSelectContent extends UiPopperContentBase {
  protected readonly root = inject(UiSelect);
  protected readonly varPrefix = '--radix-select';
  protected readonly classes = computed(() => cn(CONTENT_CLASS, this.userClass()));
  private manager: FocusKeyManager<UiSelectItem> | null = null;

  constructor() {
    super();
    this.matchTriggerWidth = true;
    this.init();
  }

  protected override onAttached(): void {
    this.manager = new FocusKeyManager<UiSelectItem>([...this.root.items()])
      .withVerticalOrientation()
      .withHomeAndEnd()
      .withTypeAhead(150)
      .skipPredicate((i) => i.disabled);
    this.root.manager.set(this.manager);
    queueMicrotask(() => {
      const items = this.root.items();
      const selected = items.findIndex((i) => i.value() === this.root.value() && !i.disabled);
      if (selected >= 0) this.manager?.setActiveItem(selected);
      else this.manager?.setFirstItemActive();
    });
  }

  protected override onDetached(): void {
    this.manager = null;
    this.root.manager.set(null);
  }

  protected onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Tab') return e.preventDefault();
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.manager?.activeItem?.choose();
      return;
    }
    this.manager?.onKeydown(e);
  }
}

@Directive({
  selector: '[uiSelectGroup], ui-select-group', hostDirectives: [UiElementHost],
  host: { role: 'group', 'data-slot': 'select-group', '[attr.class]': 'classes()' },
})
export class UiSelectGroup {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('scroll-my-1 p-1', this.userClass()));
}

@Directive({
  selector: '[uiSelectLabel], ui-select-label', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'select-label', '[attr.class]': 'classes()' },
})
export class UiSelectLabel {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('px-1.5 py-1 text-xs text-muted-foreground', this.userClass()));
}

@Directive({
  selector: '[uiSelectSeparator], ui-select-separator', hostDirectives: [UiElementHost],
  host: { role: 'separator', 'aria-orientation': 'horizontal', 'data-slot': 'select-separator', '[attr.class]': 'classes()' },
})
export class UiSelectSeparator {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('pointer-events-none -mx-1 my-1 h-px bg-border', this.userClass()));
}

@Component({
  selector: '[uiSelectItem], ui-select-item', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    tabindex: '-1',
    'data-slot': 'select-item',
    '[attr.aria-selected]': 'selected()',
    '[attr.data-state]': 'selected() ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.aria-disabled]': 'disabled ? "true" : null',
    '[attr.data-highlighted]': 'highlighted() ? "" : null',
    '[attr.class]': 'classes()',
    '(focus)': 'highlighted.set(true)',
    '(blur)': 'highlighted.set(false)',
    '(pointermove)': 'onPointerMove()',
    '(click)': 'choose()',
  },
  template: `
    <span><ng-content /></span>
    <span class="pointer-events-none absolute end-2 flex size-4 items-center justify-center" data-slot="select-item-indicator">
      @if (selected()) {
        <svg uiIcon="check"></svg>
      }
    </span>
  `,
})
export class UiSelectItem implements FocusableOption {
  private readonly root = inject(UiSelect);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly value = input<string>('');
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  readonly highlighted = signal(false);
  protected readonly selected = computed(() => this.root.value() === this.value());
  protected readonly classes = computed(() => cn(ITEM_CLASS, this.userClass()));
  /** Display label: the item's text (read from the DOM after render, even while the list is closed). */
  readonly label = signal('');

  constructor() {
    effect(() => {
      this.value();
      queueMicrotask(() => this.label.set((this.el.querySelector('span')?.textContent ?? '').trim()));
    });
  }

  get disabled(): boolean {
    return this.disabledInput();
  }
  focus(): void {
    this.el.focus();
  }
  getLabel(): string {
    return this.label();
  }
  protected onPointerMove(): void {
    if (this.disabled || this.highlighted()) return;
    this.root.manager()?.setActiveItem(this);
  }
  choose(): void {
    if (!this.disabled) this.root.choose(this.value());
  }
}

export const UI_SELECT = [
  UiSelect,
  UiSelectTrigger,
  UiSelectValue,
  UiSelectContent,
  UiSelectGroup,
  UiSelectLabel,
  UiSelectSeparator,
  UiSelectItem,
] as const;
