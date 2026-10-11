import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import { nextId } from '@loomui-ng/ui/utils';
import { UiIconSvg } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * cmdk-style command palette.
 * <div uiCommand>
 *   <input uiCommandInput placeholder="Type a command or search..." />
 *   <div uiCommandList>
 *     <div uiCommandEmpty>No results found.</div>
 *     <div uiCommandGroup heading="Suggestions">
 *       <div uiCommandItem value="Calendar" (select)="…">Calendar</div>
 *     </div>
 *   </div>
 * </div>
 * Focus stays in the input; the highlighted item is exposed with aria-activedescendant + data-selected.
 * Not reproduced (UNKNOWN / not implemented): cmdk's score-based re-ordering of results.
 */
@Directive({
  selector: '[uiCommand], ui-command', hostDirectives: [UiElementHost],
  exportAs: 'uiCommand',
  host: { tabindex: '-1', 'data-slot': 'command', '[attr.class]': 'classes()' },
})
export class UiCommand {
  readonly userClass = input<string>('', { alias: 'class' });
  readonly search = signal('');
  readonly listId = nextId('ui-command-list');
  readonly items = contentChildren(forwardRef(() => UiCommandItem), { descendants: true });
  readonly selectedId = signal<string | null>(null);

  protected readonly classes = computed(() =>
    cn(
      'flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground',
      this.userClass(),
    ),
  );

  readonly visibleItems = computed(() => this.items().filter((i) => i.visible()));
  readonly hasResults = computed(() => this.visibleItems().length > 0);

  constructor() {
    // Keep a valid selection: first enabled visible item when the search changes or items change.
    queueMicrotask(() => this.ensureSelection(true));
  }

  matches(value: string, keywords: string[]): boolean {
    const q = this.search().trim().toLowerCase();
    if (!q) return true;
    return [value, ...keywords].some((s) => s.toLowerCase().includes(q));
  }

  ensureSelection(reset = false): void {
    const enabled = this.visibleItems().filter((i) => !i.disabled);
    const current = enabled.find((i) => i.id === this.selectedId());
    if (reset || !current) this.selectedId.set(enabled[0]?.id ?? null);
  }

  move(delta: 1 | -1 | 'first' | 'last'): void {
    const enabled = this.visibleItems().filter((i) => !i.disabled);
    if (!enabled.length) return;
    let idx = enabled.findIndex((i) => i.id === this.selectedId());
    if (delta === 'first') idx = 0;
    else if (delta === 'last') idx = enabled.length - 1;
    else idx = (idx + delta + enabled.length) % enabled.length; // cmdk loops by default? UNKNOWN; we loop.
    this.selectedId.set(enabled[idx].id);
    enabled[idx].scrollIntoView();
  }

  activateSelected(): void {
    this.items().find((i) => i.id === this.selectedId())?.activate();
  }
}

@Directive({
  selector: 'input[uiCommandInput]',
  host: {
    'data-slot': 'command-input',
    type: 'text',
    role: 'combobox',
    autocomplete: 'off',
    autocorrect: 'off',
    spellcheck: 'false',
    'aria-autocomplete': 'list',
    'aria-expanded': 'true',
    '[attr.aria-controls]': 'cmd.listId',
    '[attr.aria-activedescendant]': 'cmd.selectedId()',
    '[attr.class]': 'classes()',
    '(input)': 'onInput($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiCommandInput {
  protected readonly cmd = inject(UiCommand);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50', this.userClass()),
  );

  protected onInput(e: Event): void {
    this.cmd.search.set((e.target as HTMLInputElement).value);
    queueMicrotask(() => this.cmd.ensureSelection(true));
  }

  protected onKeydown(e: KeyboardEvent): void {
    const ctrl = e.ctrlKey && !e.altKey && !e.metaKey;
    switch (true) {
      case e.key === 'ArrowDown' || (ctrl && (e.key === 'n' || e.key === 'j')):
        e.preventDefault();
        return this.cmd.move(1);
      case e.key === 'ArrowUp' || (ctrl && (e.key === 'p' || e.key === 'k')):
        e.preventDefault();
        return this.cmd.move(-1);
      case e.key === 'Home':
        e.preventDefault();
        return this.cmd.move('first');
      case e.key === 'End':
        e.preventDefault();
        return this.cmd.move('last');
      case e.key === 'Enter' && !e.isComposing:
        e.preventDefault();
        return this.cmd.activateSelected();
    }
  }
}

/** Wrapper around the input with a search icon (icon/wrapper classes are UNKNOWN; wrapper `p-1 pb-0` observed). */
@Component({
  selector: '[uiCommandInputWrapper], ui-command-input-wrapper', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'command-input-wrapper', class: 'p-1 pb-0' },
  template: `
    <div class="flex h-8 items-center gap-2 rounded-lg border border-input bg-input/30 px-2.5">
      <svg uiIcon="search" class="size-4 shrink-0 opacity-50"></svg>
      <ng-content />
    </div>
  `,
})
export class UiCommandInputWrapper {}

@Directive({
  selector: '[uiCommandList], ui-command-list', hostDirectives: [UiElementHost],
  host: {
    role: 'listbox',
    tabindex: '-1',
    'aria-label': 'Suggestions',
    'data-slot': 'command-list',
    '[id]': 'cmd.listId',
    '[attr.class]': 'classes()',
  },
})
export class UiCommandList {
  protected readonly cmd = inject(UiCommand);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none', this.userClass()),
  );
}

@Directive({
  selector: '[uiCommandEmpty], ui-command-empty', hostDirectives: [UiElementHost],
  host: {
    role: 'presentation',
    'data-slot': 'command-empty',
    '[hidden]': 'cmd.hasResults()',
    '[attr.class]': 'classes()',
  },
})
export class UiCommandEmpty {
  protected readonly cmd = inject(UiCommand);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('py-6 text-center text-sm', this.userClass()));
}

@Component({
  selector: '[uiCommandGroup], ui-command-group', hostDirectives: [UiElementHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'presentation',
    'data-slot': 'command-group',
    '[attr.data-value]': 'heading()',
    '[hidden]': '!hasVisible()',
    '[attr.class]': 'classes()',
  },
  template: `
    @if (heading()) {
      <div cmdk-group-heading aria-hidden="true" class="px-2 py-1.5 text-xs font-medium text-muted-foreground">{{ heading() }}</div>
    }
    <div role="group" cmdk-group-items [attr.aria-label]="heading() || null"><ng-content /></div>
  `,
})
export class UiCommandGroup {
  private readonly cmd = inject(UiCommand);
  readonly heading = input('');
  readonly userClass = input<string>('', { alias: 'class' });
  private readonly items = contentChildren(forwardRef(() => UiCommandItem), { descendants: true });
  protected readonly hasVisible = computed(() => this.items().some((i) => i.visible()));
  protected readonly classes = computed(() => cn('overflow-hidden p-1 text-foreground', this.userClass()));
}

@Directive({
  selector: '[uiCommandSeparator], ui-command-separator', hostDirectives: [UiElementHost],
  host: {
    role: 'separator',
    'data-slot': 'command-separator',
    '[hidden]': 'cmd.search().trim() !== ""',
    '[attr.class]': 'classes()',
  },
})
export class UiCommandSeparator {
  protected readonly cmd = inject(UiCommand);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('-mx-1 h-px bg-border', this.userClass()));
}

@Directive({
  selector: '[uiCommandItem], ui-command-item', hostDirectives: [UiElementHost],
  host: {
    role: 'option',
    'data-slot': 'command-item',
    '[id]': 'id',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-disabled]': 'disabled',
    '[attr.data-disabled]': 'disabled',
    '[attr.data-selected]': 'selected()',
    '[attr.data-value]': 'resolvedValue()',
    '[hidden]': '!visible()',
    '[attr.class]': 'classes()',
    '(click)': 'activate()',
    '(pointermove)': 'onPointerMove()',
  },
})
export class UiCommandItem {
  private readonly cmd = inject(UiCommand);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly id = nextId('ui-command-item');
  readonly value = input<string>('');
  readonly keywords = input<string[]>([]);
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  readonly select = output<void>();

  get disabled(): boolean {
    return this.disabledInput();
  }
  protected readonly resolvedValue = computed(() => this.value() || (this.el.textContent ?? '').trim());
  readonly visible = computed(() => this.cmd.matches(this.resolvedValue(), this.keywords()));
  protected readonly selected = computed(() => this.cmd.selectedId() === this.id);
  protected readonly classes = computed(() =>
    cn(
      "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
      this.userClass(),
    ),
  );

  activate(): void {
    if (!this.disabled) this.select.emit();
  }
  scrollIntoView(): void {
    this.el.scrollIntoView({ block: 'nearest' });
  }
  protected onPointerMove(): void {
    if (!this.disabled && this.cmd.selectedId() !== this.id) this.cmd.selectedId.set(this.id);
  }
}

@Directive({
  selector: '[uiCommandShortcut], ui-command-shortcut', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'command-shortcut', '[attr.class]': 'classes()' },
})
export class UiCommandShortcut {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn('ms-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground', this.userClass()),
  );
}

/** <ui-command-input placeholder="Type a command…" /> — custom-element form of `<input uiCommandInput>`. */
@Component({
  selector: 'ui-command-input',
  imports: [UiCommandInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `<input uiCommandInput [class]="userClass()" [attr.placeholder]="placeholder() || null" [attr.aria-label]="ariaLabel() || null" />`,
})
export class UiCommandInputElement {
  readonly placeholder = input<string>('');
  readonly ariaLabel = input<string>('', { alias: 'aria-label' });
  readonly userClass = input<string>('', { alias: 'class' });
}

export const UI_COMMAND = [
  UiCommand,
  UiCommandInput,
  UiCommandInputWrapper,
  UiCommandList,
  UiCommandEmpty,
  UiCommandGroup,
  UiCommandSeparator,
  UiCommandItem,
  UiCommandShortcut,
  UiCommandInputElement,
] as const;
