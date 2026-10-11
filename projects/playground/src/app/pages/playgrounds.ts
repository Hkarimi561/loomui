import { Component, computed, input, signal, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { UI_ALERT } from '@loomui-ng/ui/alert';
import { UiBadge } from '@loomui-ng/ui/badge';
import { UiButton } from '@loomui-ng/ui/button';
import { UiInput } from '@loomui-ng/ui/input';
import { UiProgress } from '@loomui-ng/ui/progress';
import { UiSwitch } from '@loomui-ng/ui/switch';
import { UiToggle } from '@loomui-ng/ui/toggle';
import { CodeCard } from './code-card';

export type KnobValue = string | number | boolean;
export type Values = Record<string, KnobValue>;

interface Knob {
  key: string;
  label: string;
  type: 'select' | 'bool' | 'text' | 'range';
  options?: string[];
  def: KnobValue;
  min?: number;
  max?: number;
}

interface PlaygroundDef {
  knobs: Knob[];
  preview: Type<{ v: unknown }>;
  code: (v: Values) => string;
}

/* ---------------- previews ---------------- */
const VALUES = { required: true } as const;

@Component({ selector: 'pg-button', imports: [UiButton], template: `<button uiButton [variant]="$any(v().variant)" [size]="$any(v().size)" [disabled]="!!v().disabled">{{ isIcon() ? '★' : v().label }}</button>` })
export class PgButton {
  readonly v = input.required<any>();
  readonly isIcon = computed(() => String(this.v().size).startsWith('icon'));
}

@Component({ selector: 'pg-badge', imports: [UiBadge], template: `<span uiBadge [variant]="$any(v().variant)">{{ v().label }}</span>` })
export class PgBadge {
  readonly v = input.required<any>();
}

@Component({
  selector: 'pg-alert',
  imports: [UI_ALERT],
  template: `
    <div uiAlert [variant]="$any(v().variant)" class="max-w-md">
      @if (v().icon) {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
      }
      <div uiAlertTitle>{{ v().title }}</div>
      <div uiAlertDescription>{{ v().description }}</div>
    </div>
  `,
})
export class PgAlert {
  readonly v = input.required<any>();
}

@Component({
  selector: 'pg-progress',
  imports: [UiProgress],
  template: `<div uiProgress [value]="v().indeterminate ? null : +v().value" class="w-72"></div>`,
})
export class PgProgress {
  readonly v = input.required<any>();
}

@Component({
  selector: 'pg-switch',
  imports: [UiSwitch],
  template: `
    <label class="flex items-center gap-3 text-sm font-medium">
      <button uiSwitch [checked]="!!v().checked" [size]="$any(v().size)" [disabled]="!!v().disabled" aria-label="Demo switch"></button>
      Airplane mode
    </label>
  `,
})
export class PgSwitch {
  readonly v = input.required<any>();
}

@Component({
  selector: 'pg-toggle',
  imports: [UiToggle],
  template: `<button uiToggle [pressed]="!!v().pressed" [variant]="$any(v().variant)" [size]="$any(v().size)" [disabled]="!!v().disabled" aria-label="Bold">B</button>`,
})
export class PgToggle {
  readonly v = input.required<any>();
}

@Component({
  selector: 'pg-input',
  imports: [UiInput],
  template: `<input uiInput class="w-72" [type]="'' + v().type" [placeholder]="'' + v().placeholder" [disabled]="!!v().disabled" [attr.aria-invalid]="v().invalid ? 'true' : null" aria-label="Demo input" />`,
})
export class PgInput {
  readonly v = input.required<any>();
}

/* ---------------- definitions ---------------- */
const attr = (name: string, val: KnobValue, def: KnobValue) => (val === def ? '' : ` ${name}="${val}"`);
const flag = (name: string, on: KnobValue) => (on ? ` ${name}` : '');

export const PLAYGROUNDS: Record<string, PlaygroundDef> = {
  button: {
    knobs: [
      { key: 'variant', label: 'variant', type: 'select', options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'], def: 'default' },
      { key: 'size', label: 'size', type: 'select', options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'], def: 'default' },
      { key: 'label', label: 'label', type: 'text', def: 'Button' },
      { key: 'disabled', label: 'disabled', type: 'bool', def: false },
    ],
    preview: PgButton as Type<{ v: unknown }>,
    code: (v) => `<button uiButton${attr('variant', v['variant'], 'default')}${attr('size', v['size'], 'default')}${flag('disabled', v['disabled'])}>${String(v['size']).startsWith('icon') ? '★' : v['label']}</button>`,
  },
  badge: {
    knobs: [
      { key: 'variant', label: 'variant', type: 'select', options: ['default', 'secondary', 'destructive', 'outline', 'ghost'], def: 'default' },
      { key: 'label', label: 'label', type: 'text', def: 'Badge' },
    ],
    preview: PgBadge as Type<{ v: unknown }>,
    code: (v) => `<span uiBadge${attr('variant', v['variant'], 'default')}>${v['label']}</span>`,
  },
  alert: {
    knobs: [
      { key: 'variant', label: 'variant', type: 'select', options: ['default', 'destructive'], def: 'default' },
      { key: 'title', label: 'title', type: 'text', def: 'Heads up!' },
      { key: 'description', label: 'description', type: 'text', def: 'You can add components to your app.' },
      { key: 'icon', label: 'icon', type: 'bool', def: true },
    ],
    preview: PgAlert as Type<{ v: unknown }>,
    code: (v) => `<div uiAlert${attr('variant', v['variant'], 'default')}>\n${v['icon'] ? '  <svg …></svg>\n' : ''}  <div uiAlertTitle>${v['title']}</div>\n  <div uiAlertDescription>${v['description']}</div>\n</div>`,
  },
  progress: {
    knobs: [
      { key: 'value', label: 'value', type: 'range', min: 0, max: 100, def: 60 },
      { key: 'indeterminate', label: 'indeterminate', type: 'bool', def: false },
    ],
    preview: PgProgress as Type<{ v: unknown }>,
    code: (v) => (v['indeterminate'] ? `<div uiProgress></div>` : `<div uiProgress [value]="${v['value']}"></div>`),
  },
  switch: {
    knobs: [
      { key: 'checked', label: 'checked', type: 'bool', def: true },
      { key: 'size', label: 'size', type: 'select', options: ['default', 'sm'], def: 'default' },
      { key: 'disabled', label: 'disabled', type: 'bool', def: false },
    ],
    preview: PgSwitch as Type<{ v: unknown }>,
    code: (v) => `<button uiSwitch [(checked)]="on"${attr('size', v['size'], 'default')}${flag('disabled', v['disabled'])}></button>`,
  },
  toggle: {
    knobs: [
      { key: 'variant', label: 'variant', type: 'select', options: ['default', 'outline'], def: 'outline' },
      { key: 'size', label: 'size', type: 'select', options: ['default', 'sm', 'lg'], def: 'default' },
      { key: 'pressed', label: 'pressed', type: 'bool', def: false },
      { key: 'disabled', label: 'disabled', type: 'bool', def: false },
    ],
    preview: PgToggle as Type<{ v: unknown }>,
    code: (v) => `<button uiToggle [(pressed)]="bold"${attr('variant', v['variant'], 'default')}${attr('size', v['size'], 'default')}${flag('disabled', v['disabled'])} aria-label="Bold">B</button>`,
  },
  input: {
    knobs: [
      { key: 'type', label: 'type', type: 'select', options: ['text', 'email', 'password', 'number', 'search', 'file'], def: 'text' },
      { key: 'placeholder', label: 'placeholder', type: 'text', def: 'Email' },
      { key: 'disabled', label: 'disabled', type: 'bool', def: false },
      { key: 'invalid', label: 'invalid', type: 'bool', def: false },
    ],
    preview: PgInput as Type<{ v: unknown }>,
    code: (v) => `<input uiInput${attr('type', v['type'], 'text')} placeholder="${v['placeholder']}"${flag('disabled', v['disabled'])}${v['invalid'] ? ' aria-invalid="true"' : ''} />`,
  },
};
void VALUES;

/** Knobs panel + live preview + generated snippet for one component. */
@Component({
  selector: 'app-playground',
  imports: [NgComponentOutlet, CodeCard],
  template: `
    @if (def(); as d) {
      <div class="grid gap-4 lg:grid-cols-[1fr_17rem]">
        <div
          class="grid min-h-56 place-items-center rounded-xl border bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_9%,transparent)_1px,transparent_1px)] [background-size:16px_16px] p-8"
          role="group"
          aria-label="Live preview"
        >
          <ng-container *ngComponentOutlet="d.preview; inputs: { v: values() }" />
        </div>

        <form class="flex flex-col gap-3 rounded-xl border bg-card p-4" aria-label="Controls" (submit)="$event.preventDefault()">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-medium">Controls</h2>
            <button type="button" class="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline" (click)="reset()">Reset</button>
          </div>
          @for (k of d.knobs; track k.key) {
            <label class="flex flex-col gap-1.5 text-xs font-medium">
              <span class="flex items-center justify-between"
                >{{ k.label }} @if (k.type === 'range') { <span class="font-mono text-muted-foreground">{{ values()[k.key] }}</span> }</span
              >
              @switch (k.type) {
                @case ('select') {
                  <select class="h-8 rounded-lg border border-input bg-background px-2 text-sm font-normal focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" [value]="values()[k.key]" (change)="set(k.key, $any($event.target).value)">
                    @for (o of k.options; track o) {
                      <option [value]="o" [selected]="o === values()[k.key]">{{ o }}</option>
                    }
                  </select>
                }
                @case ('bool') {
                  <input type="checkbox" class="size-4 accent-[var(--primary)]" [checked]="!!values()[k.key]" (change)="set(k.key, $any($event.target).checked)" />
                }
                @case ('text') {
                  <input type="text" class="h-8 rounded-lg border border-input bg-background px-2 text-sm font-normal focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" [value]="values()[k.key]" (input)="set(k.key, $any($event.target).value)" />
                }
                @case ('range') {
                  <input type="range" class="accent-[var(--primary)]" [min]="k.min ?? 0" [max]="k.max ?? 100" [value]="values()[k.key]" (input)="set(k.key, +$any($event.target).value)" />
                }
              }
            </label>
          }
        </form>
      </div>
      <div class="mt-4">
        <app-code-card label="Generated usage" [tabs]="[{ label: 'Usage', file: 'example.html', code: code() }]" />
      </div>
    }
  `,
})
export class Playground {
  readonly slug = input.required<string>();
  readonly def = computed(() => PLAYGROUNDS[this.slug()] ?? null);
  private readonly overrides = signal<{ slug: string; v: Values }>({ slug: '', v: {} });
  readonly values = computed<Values>(() => {
    const d = this.def();
    const base = Object.fromEntries((d?.knobs ?? []).map((k) => [k.key, k.def]));
    const o = this.overrides();
    return { ...base, ...(o.slug === this.slug() ? o.v : {}) };
  });
  readonly code = computed(() => this.def()?.code(this.values()) ?? '');

  set(key: string, v: KnobValue): void {
    const slug = this.slug();
    this.overrides.update((o) => ({ slug, v: { ...(o.slug === slug ? o.v : {}), [key]: v } }));
  }
  reset(): void {
    this.overrides.set({ slug: '', v: {} });
  }
}
