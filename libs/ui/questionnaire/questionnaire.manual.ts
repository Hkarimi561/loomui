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
  model,
  output,
  signal,
} from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import {
  questionnaireActionsClass,
  questionnaireChoiceClass,
  questionnaireChoiceIndicatorClass,
  questionnaireChoiceIndicatorDotClass,
  questionnaireChoiceInputClass,
  questionnaireChoiceLabelClass,
  questionnaireChoiceShortcutClass,
  questionnaireChoicesClass,
  questionnaireClass,
  questionnaireDescriptionClass,
  questionnaireErrorClass,
  questionnaireInputClass,
  questionnaireInputWrapperClass,
  questionnaireItemClass,
  questionnaireProgressClass,
  questionnaireTitleClass,
} from './questionnaire';
import { UiIconSvg } from '@loomui-ng/ui/icon';
import { UiElementHost } from '@loomui-ng/ui/utils';

let uid = 0;

/**
 * Step-by-step form. Observed root: <form novalidate data-current data-total data-first data-last data-shortcuts>;
 * one <fieldset> per question (hidden + inert unless active) with data-status/required/multiple.
 *
 * <form uiQuestionnaire #q="uiQuestionnaire" (submitted)="save($event)">
 *   <div uiQuestionnaireProgress></div>
 *   <fieldset uiQuestionnaireItem name="plan" required>
 *     <legend uiQuestionnaireTitle>Pick a plan</legend>
 *     <div uiQuestionnaireChoices>
 *       <label uiQuestionnaireChoice value="free">Free</label>
 *     </div>
 *   </fieldset>
 *   <div uiQuestionnaireActions>…buttons call q.previous() / q.next() / q.submit()…</div>
 * </form>
 *
 * Keys (observed in the docs; wiring is own reconstruction): letter/number shortcuts pick a choice, Enter = next,
 * Ctrl/Cmd+Enter = submit. UNKNOWN: ArrowUp/Down inside choices relies on native radio-group behavior only.
 */
@Component({
  selector: 'form[uiQuestionnaire], ui-questionnaire', hostDirectives: [UiElementHost],
  exportAs: 'uiQuestionnaire',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    novalidate: '',
    'data-slot': 'questionnaire',
    '[attr.data-current]': 'current()',
    '[attr.data-total]': 'total()',
    '[attr.data-first]': 'isFirst()',
    '[attr.data-last]': 'isLast()',
    '[attr.data-shortcuts]': 'shortcuts()',
    '[attr.class]': 'classes()',
    '(keydown)': 'onKey($event)',
    '(submit)': '$event.preventDefault(); submit()',
  },
  template: `<ng-content />`,
})
export class UiQuestionnaire {
  readonly items = contentChildren(forwardRef(() => UiQuestionnaireItem), { descendants: true });
  readonly current = model(0);
  readonly shortcuts = input(true, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });
  /** Emits { [itemName]: string | string[] } after every required question validated. */
  readonly submitted = output<Record<string, string | string[]>>();

  readonly total = computed(() => this.items().length);
  readonly isFirst = computed(() => this.current() <= 0);
  readonly isLast = computed(() => this.current() >= this.total() - 1);
  protected readonly classes = computed(() => cn(questionnaireClass, this.userClass()));

  readonly activeItem = computed(() => this.items()[this.current()]);

  previous(): void {
    if (this.current() > 0) this.current.update((c) => c - 1);
  }

  /** Validates the active question first (when required); `skip` bypasses it for optional questions. */
  next(): void {
    const item = this.activeItem();
    if (!item || !item.validate()) return;
    if (!this.isLast()) this.current.update((c) => c + 1);
  }

  skip(): void {
    if (!this.isLast()) this.current.update((c) => c + 1);
  }

  submit(): void {
    const items = this.items();
    for (let i = 0; i < items.length; i++) {
      if (!items[i].validate()) {
        this.current.set(i);
        return;
      }
    }
    const result: Record<string, string | string[]> = {};
    for (const it of items) result[it.name() || it.id] = it.multiple() ? it.values() : (it.values()[0] ?? it.text());
    this.submitted.emit(result);
  }

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected onKey(e: KeyboardEvent): void {
    const t = e.target as HTMLElement;
    if (this.shortcuts() && !e.ctrlKey && !e.metaKey && !e.altKey && /^[a-z0-9]$/i.test(e.key) && !(t instanceof HTMLInputElement && t.type === 'text') && t.tagName !== 'TEXTAREA') {
      const choice = this.el.querySelector<HTMLInputElement>(`[data-slot=questionnaire-item]:not([hidden]) [data-shortcut="${e.key.toUpperCase()}"] input`);
      if (choice) {
        e.preventDefault();
        choice.click();
        return;
      }
    }
    if (e.key !== 'Enter' || e.isComposing) return;
    if (t.tagName === 'BUTTON' || t.tagName === 'TEXTAREA') return;
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) this.submit();
    else if (this.isLast()) this.submit();
    else this.next();
  }
}

@Directive({
  selector: 'div[uiQuestionnaireProgress], ui-questionnaire-progress', hostDirectives: [UiElementHost],
  host: {
    role: 'progressbar',
    'aria-valuemin': '1',
    '[attr.aria-valuemax]': 'root.total()',
    '[attr.aria-valuenow]': 'root.current() + 1',
    '[attr.aria-valuetext]': '"Question " + (root.current() + 1) + " of " + root.total()',
    'data-slot': 'questionnaire-progress',
    '[attr.class]': 'classes()',
    '[textContent]': '"Question " + (root.current() + 1) + " of " + root.total()',
  },
})
export class UiQuestionnaireProgress {
  protected readonly root = inject(UiQuestionnaire);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(questionnaireProgressClass, this.userClass()));
}

@Component({
  selector: 'fieldset[uiQuestionnaireItem], ui-questionnaire-item', hostDirectives: [UiElementHost],
  exportAs: 'uiQuestionnaireItem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'questionnaire-item',
    '[attr.data-active]': 'active() ? "" : null',
    '[attr.data-status]': 'status()',
    '[attr.data-required]': 'required()',
    '[attr.data-multiple]': 'multiple()',
    '[attr.hidden]': 'active() ? null : ""',
    '[attr.inert]': 'active() ? null : ""',
    '[attr.class]': 'classes()',
  },
  template: `<ng-content />
    @if (error()) {
      <p data-slot="questionnaire-error" role="alert" [class]="errorClass">{{ error() }}</p>
    }`,
})
export class UiQuestionnaireItem {
  private readonly root = inject(UiQuestionnaire);
  readonly id = `uiq-${++uid}`;
  readonly name = input<string>('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });

  readonly values = signal<string[]>([]);
  readonly text = signal('');
  readonly error = signal('');
  protected readonly errorClass = questionnaireErrorClass;

  readonly index = computed(() => this.root.items().indexOf(this));
  readonly active = computed(() => this.index() === this.root.current());
  readonly answered = computed(() => this.values().length > 0 || this.text().trim().length > 0);
  readonly status = computed(() => (this.error() ? 'invalid' : this.answered() ? 'answered' : 'pending'));
  protected readonly classes = computed(() => cn(questionnaireItemClass, this.userClass()));

  toggle(value: string): void {
    this.error.set('');
    if (this.multiple()) this.values.update((v) => (v.includes(value) ? v.filter((x) => x !== value) : [...v, value]));
    else this.values.set([value]);
  }

  validate(): boolean {
    if (this.required() && !this.answered()) {
      this.error.set('This question is required.');
      return false;
    }
    this.error.set('');
    return true;
  }
}

@Directive({
  selector: 'legend[uiQuestionnaireTitle], ui-questionnaire-title', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'questionnaire-title', '[attr.class]': 'classes()' },
})
export class UiQuestionnaireTitle {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(questionnaireTitleClass, this.userClass()));
}

@Directive({
  selector: 'p[uiQuestionnaireDescription], ui-questionnaire-description', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'questionnaire-description', '[attr.class]': 'classes()' },
})
export class UiQuestionnaireDescription {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(questionnaireDescriptionClass, this.userClass()));
}

@Directive({
  selector: 'div[uiQuestionnaireChoices], ui-questionnaire-choices', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'questionnaire-choices', '[attr.class]': 'classes()' },
})
export class UiQuestionnaireChoices {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(questionnaireChoicesClass, this.userClass()));
}

/** One option; projected content becomes the label. `shortcut` defaults to the 1-based position within its question. */
@Component({
  selector: 'label[uiQuestionnaireChoice], ui-questionnaire-choice', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'questionnaire-choice',
    '[attr.data-shortcut]': 'shortcutKey()',
    '[attr.data-type]': 'item.multiple() ? "checkbox" : "radio"',
    '[attr.data-checked]': 'checked() ? "" : null',
    '[attr.class]': 'classes()',
  },
  template: `
    <input
      [class]="inputClass"
      data-slot="questionnaire-choice-input"
      [type]="item.multiple() ? 'checkbox' : 'radio'"
      [name]="item.name() || item.id"
      [value]="value()"
      [checked]="checked()"
      (change)="item.toggle(value())"
    />
    <span [class]="indicatorClass" data-slot="questionnaire-choice-indicator" aria-hidden="true">
      @if (item.multiple()) {
        @if (checked()) {
          <svg uiIcon="check" class="size-3" strokeWidth="3"></svg>
        }
      } @else {
        <span [class]="dotClass"></span>
      }
    </span>
    <span [class]="labelClass" data-slot="questionnaire-choice-label"><ng-content /></span>
    @if (root.shortcuts()) {
      <kbd [class]="shortcutClass" data-slot="questionnaire-choice-shortcut" aria-hidden="true">{{ shortcutKey() }}</kbd>
    }
  `,
  styles: [
    `
      :host:has(input:checked) [data-slot='questionnaire-choice-indicator'] {
        background: var(--primary);
        border-color: var(--primary);
        color: var(--primary-foreground);
      }
    `,
  ],
})
export class UiQuestionnaireChoice {
  protected readonly item = inject(UiQuestionnaireItem);
  protected readonly root = inject(UiQuestionnaire);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly value = input.required<string>();
  readonly shortcut = input<string>('');
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly checked = computed(() => this.item.values().includes(this.value()));
  protected readonly shortcutKey = computed(() => {
    if (this.shortcut()) return this.shortcut().toUpperCase();
    const siblings = Array.from(this.el.parentElement?.querySelectorAll('[data-slot=questionnaire-choice]') ?? []);
    return String(siblings.indexOf(this.el) + 1);
  });
  protected readonly classes = computed(() => cn(questionnaireChoiceClass, this.userClass()));
  protected readonly inputClass = questionnaireChoiceInputClass;
  protected readonly indicatorClass = questionnaireChoiceIndicatorClass;
  protected readonly dotClass = questionnaireChoiceIndicatorDotClass;
  protected readonly labelClass = questionnaireChoiceLabelClass;
  protected readonly shortcutClass = cn(questionnaireChoiceShortcutClass, 'sm:inline-flex');
}

/** Free-text answer. */
@Component({
  selector: 'div[uiQuestionnaireInput], ui-questionnaire-input', hostDirectives: [UiElementHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'questionnaire-input-wrapper', '[attr.class]': 'classes()' },
  template: `<input
    data-slot="questionnaire-input"
    type="text"
    [class]="inputClass"
    [placeholder]="placeholder()"
    [value]="item.text()"
    [attr.aria-invalid]="item.error() ? 'true' : null"
    (input)="item.text.set($any($event.target).value)"
  />`,
})
export class UiQuestionnaireInput {
  protected readonly item = inject(UiQuestionnaireItem);
  readonly placeholder = input('');
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(questionnaireInputWrapperClass, this.userClass()));
  protected readonly inputClass = questionnaireInputClass;
}

@Directive({
  selector: 'div[uiQuestionnaireActions], ui-questionnaire-actions', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'questionnaire-actions', '[attr.class]': 'classes()' },
})
export class UiQuestionnaireActions {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(questionnaireActionsClass, this.userClass()));
}

export const UI_QUESTIONNAIRE = [
  UiQuestionnaire,
  UiQuestionnaireProgress,
  UiQuestionnaireItem,
  UiQuestionnaireTitle,
  UiQuestionnaireDescription,
  UiQuestionnaireChoices,
  UiQuestionnaireChoice,
  UiQuestionnaireInput,
  UiQuestionnaireActions,
] as const;
