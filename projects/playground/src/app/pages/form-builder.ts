import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiButton } from '@loomui-ng/ui/button';
import { UiCheckbox } from '@loomui-ng/ui/checkbox';
import { UiIcon } from '@loomui-ng/ui/icon';
import { UI_INPUT } from '@loomui-ng/ui/input';
import { UI_NATIVE_SELECT } from '@loomui-ng/ui/native-select';
import { UI_RADIO_GROUP } from '@loomui-ng/ui/radio-group';
import { UiSwitch } from '@loomui-ng/ui/switch';
import { UI_TEXTAREA } from '@loomui-ng/ui/textarea';
import '../icons';
import { CodeCard, type CodeTab } from './code-card';

type Kind = 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'switch' | 'radio';

interface Field {
  id: number;
  kind: Kind;
  label: string;
  placeholder: string;
  required: boolean;
}

const KINDS: { kind: Kind; label: string; icon: string; placeholder: string }[] = [
  { kind: 'text', label: 'Text', icon: 'type', placeholder: 'Your name' },
  { kind: 'email', label: 'Email', icon: 'mail', placeholder: 'you@example.com' },
  { kind: 'password', label: 'Password', icon: 'lock', placeholder: '••••••••' },
  { kind: 'textarea', label: 'Textarea', icon: 'align-left', placeholder: 'Tell us more…' },
  { kind: 'select', label: 'Select', icon: 'chevrons-up-down', placeholder: '' },
  { kind: 'checkbox', label: 'Checkbox', icon: 'square-check', placeholder: '' },
  { kind: 'switch', label: 'Switch', icon: 'toggle-right', placeholder: '' },
  { kind: 'radio', label: 'Radio group', icon: 'circle-dot', placeholder: '' },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'field';
const camel = (s: string) => slug(s).replace(/-([a-z0-9])/g, (_m, c: string) => c.toUpperCase());

/** Click or drag fields from the palette; the preview is made of real components and the code is generated live. */
@Component({
  selector: 'app-form-builder',
  imports: [FormsModule, UiIcon, UiButton, UiCheckbox, UiSwitch, UI_INPUT, UI_NATIVE_SELECT, UI_RADIO_GROUP, UI_TEXTAREA, CodeCard],
  template: `
    <div class="grid gap-4 md:grid-cols-[13rem_1fr]">
      <!-- palette -->
      <div class="flex flex-col gap-2" role="group" aria-label="Field palette">
        <p class="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">Fields</p>
        @for (k of kinds; track k.kind) {
          <button
            type="button"
            draggable="true"
            class="flex h-10 cursor-grab items-center gap-2.5 rounded-lg border bg-card px-3 text-sm transition-colors hover:border-primary/50 hover:bg-muted active:cursor-grabbing focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            (click)="add(k.kind)"
            (dragstart)="onDragStart($event, k.kind)"
          >
            <ui-icon [name]="k.icon" class="size-4 text-muted-foreground" />
            {{ k.label }}
            <ui-icon name="plus" class="ms-auto size-3.5 text-muted-foreground" />
          </button>
        }
        <p class="px-1 text-xs text-muted-foreground">Click or drag onto the form.</p>
      </div>

      <!-- canvas -->
      <div
        class="min-h-72 rounded-2xl border-2 border-dashed p-4 transition-colors"
        [class]="over() ? 'border-primary bg-primary/5' : 'border-border bg-card/40'"
        (dragover)="$event.preventDefault(); over.set(true)"
        (dragleave)="over.set(false)"
        (drop)="onDrop($event)"
        role="region"
        aria-label="Form preview"
      >
        @if (!fields().length) {
          <div class="grid h-64 place-items-center text-center text-sm text-muted-foreground">
            <div class="grid justify-items-center gap-2">
              <ui-icon name="blocks" class="size-8" />
              <p>Drop a field here to start building.</p>
            </div>
          </div>
        } @else {
          <div class="grid gap-4">
            @for (f of fields(); track f.id; let i = $index; let first = $first; let last = $last) {
              <div class="group/field relative grid gap-1.5 rounded-xl border bg-background p-3 pe-24 transition-shadow hover:shadow-sm">
                <div class="absolute end-2 top-2 flex gap-1 opacity-60 transition-opacity group-hover/field:opacity-100 group-focus-within/field:opacity-100">
                  <button type="button" class="grid size-7 place-items-center rounded-md border hover:bg-muted disabled:opacity-30" [disabled]="first" aria-label="Move up" (click)="move(i, -1)"><ui-icon name="arrow-up" /></button>
                  <button type="button" class="grid size-7 place-items-center rounded-md border hover:bg-muted disabled:opacity-30" [disabled]="last" aria-label="Move down" (click)="move(i, 1)"><ui-icon name="arrow-down" /></button>
                  <button type="button" class="grid size-7 place-items-center rounded-md border text-destructive hover:bg-destructive/10" aria-label="Remove field" (click)="remove(f.id)"><ui-icon name="trash-2" /></button>
                </div>

                <input
                  class="-ms-1 w-full max-w-60 rounded-md bg-transparent px-1 text-sm font-medium outline-none hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
                  [value]="f.label"
                  [attr.aria-label]="'Label for field ' + (i + 1)"
                  (input)="patch(f.id, { label: $any($event.target).value })"
                />

                @switch (f.kind) {
                  @case ('textarea') {
                    <ui-textarea rows="2" [placeholder]="f.placeholder" [aria-label]="f.label" />
                  }
                  @case ('select') {
                    <ui-native-select [aria-label]="f.label"><option>Option one</option><option>Option two</option></ui-native-select>
                  }
                  @case ('checkbox') {
                    <label class="flex items-center gap-2 text-sm"><ui-checkbox [aria-label]="f.label" /> {{ f.label }}</label>
                  }
                  @case ('switch') {
                    <label class="flex items-center gap-2 text-sm"><ui-switch [aria-label]="f.label" /> {{ f.label }}</label>
                  }
                  @case ('radio') {
                    <ui-radio-group value="a">
                      <label class="flex items-center gap-2 text-sm"><ui-radio-group-item value="a" /> Option A</label>
                      <label class="flex items-center gap-2 text-sm"><ui-radio-group-item value="b" /> Option B</label>
                    </ui-radio-group>
                  }
                  @default {
                    <ui-input [type]="f.kind" [placeholder]="f.placeholder" [aria-label]="f.label" />
                  }
                }

                <label class="flex items-center gap-2 text-xs text-muted-foreground">
                  <ui-checkbox [ngModel]="f.required" (ngModelChange)="patch(f.id, { required: $event })" [aria-label]="'Required: ' + f.label" /> Required
                </label>
              </div>
            }
            <ui-button class="justify-self-start">Submit</ui-button>
          </div>
        }
      </div>
    </div>

    @if (fields().length) {
      <div class="mt-4">
        <app-code-card label="Generated form code" [tabs]="tabs()" />
        <p class="mt-2 text-xs text-muted-foreground">
          Written with custom elements. Note: <code class="rounded bg-muted px-1 font-mono">&lt;ui-button&gt;</code> is not a native submit button, so the code calls <code class="rounded bg-muted px-1 font-mono">submit()</code> on click.
        </p>
      </div>
    }
  `,
})
export class FormBuilder {
  readonly kinds = KINDS;
  readonly fields = signal<Field[]>([
    { id: 1, kind: 'email', label: 'Email', placeholder: 'you@example.com', required: true },
    { id: 2, kind: 'switch', label: 'Subscribe to updates', placeholder: '', required: false },
  ]);
  readonly over = signal(false);
  private nextId = 3;

  add(kind: Kind): void {
    const k = KINDS.find((x) => x.kind === kind)!;
    this.fields.update((l) => [...l, { id: this.nextId++, kind, label: k.label, placeholder: k.placeholder, required: false }]);
  }
  remove(id: number): void {
    this.fields.update((l) => l.filter((f) => f.id !== id));
  }
  patch(id: number, p: Partial<Field>): void {
    this.fields.update((l) => l.map((f) => (f.id === id ? { ...f, ...p } : f)));
  }
  move(i: number, d: number): void {
    this.fields.update((l) => {
      const n = [...l];
      const j = i + d;
      if (j < 0 || j >= n.length) return l;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  }

  onDragStart(e: DragEvent, kind: Kind): void {
    e.dataTransfer?.setData('text/plain', kind);
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copy';
  }
  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.over.set(false);
    const kind = e.dataTransfer?.getData('text/plain') as Kind;
    if (KINDS.some((k) => k.kind === kind)) this.add(kind);
  }

  readonly tabs = computed<CodeTab[]>(() => {
    const fs = this.fields();
    const names = new Map<number, string>();
    const used = new Set<string>();
    for (const f of fs) {
      let n = camel(f.label);
      while (used.has(n)) n += '2';
      used.add(n);
      names.set(f.id, n);
    }
    const html = fs
      .map((f) => {
        const n = names.get(f.id)!;
        const id = slug(f.label) + '-' + f.id;
        const req = f.required ? ' required' : '';
        switch (f.kind) {
          case 'textarea':
            return `  <div class="grid gap-1.5">\n    <ui-label for="${id}">${f.label}</ui-label>\n    <ui-textarea id="${id}" rows="3" placeholder="${f.placeholder}" [(ngModel)]="${n}"${req} />\n  </div>`;
          case 'select':
            return `  <div class="grid gap-1.5">\n    <ui-label for="${id}">${f.label}</ui-label>\n    <ui-native-select id="${id}" [(ngModel)]="${n}">\n      <option value="one">Option one</option>\n      <option value="two">Option two</option>\n    </ui-native-select>\n  </div>`;
          case 'checkbox':
            return `  <label class="flex items-center gap-2 text-sm">\n    <ui-checkbox [(ngModel)]="${n}" /> ${f.label}\n  </label>`;
          case 'switch':
            return `  <label class="flex items-center gap-2 text-sm">\n    <ui-switch [(ngModel)]="${n}" /> ${f.label}\n  </label>`;
          case 'radio':
            return `  <ui-radio-group [(value)]="${n}">\n    <label class="flex items-center gap-2 text-sm"><ui-radio-group-item value="a" /> Option A</label>\n    <label class="flex items-center gap-2 text-sm"><ui-radio-group-item value="b" /> Option B</label>\n  </ui-radio-group>`;
          default:
            return `  <div class="grid gap-1.5">\n    <ui-label for="${id}">${f.label}</ui-label>\n    <ui-input id="${id}" type="${f.kind}" placeholder="${f.placeholder}" [(ngModel)]="${n}"${req} />\n  </div>`;
        }
      })
      .join('\n');
    const template = `<div class="grid max-w-sm gap-4">\n${html}\n  <ui-button (click)="submit()">Submit</ui-button>\n</div>`;

    const uses = new Set(fs.map((f) => f.kind));
    const imports = ['FormsModule', 'UiButton', 'UiLabel'];
    if (['text', 'email', 'password'].some((k) => uses.has(k as Kind))) imports.push('UI_INPUT');
    if (uses.has('textarea')) imports.push('UI_TEXTAREA');
    if (uses.has('select')) imports.push('UI_NATIVE_SELECT');
    if (uses.has('checkbox')) imports.push('UiCheckbox');
    if (uses.has('switch')) imports.push('UiSwitch');
    if (uses.has('radio')) imports.push('UI_RADIO_GROUP');
    const initial = (f: Field) => (f.kind === 'checkbox' || f.kind === 'switch' ? 'false' : f.kind === 'radio' ? "'a'" : f.kind === 'select' ? "'one'" : "''");
    const signals = fs.map((f) => `  readonly ${names.get(f.id)} = signal(${initial(f)});`).join('\n');
    const ts = `import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\n// import the Loom UI parts you use: ${imports.slice(1).join(', ')}\n\n@Component({\n  selector: 'app-form',\n  imports: [${imports.join(', ')}],\n  templateUrl: './form.component.html',\n})\nexport class FormComponent {\n${signals}\n\n  submit() {\n    console.log({ ${fs.map((f) => names.get(f.id) + ': this.' + names.get(f.id) + '()').join(', ')} });\n  }\n}`;
    return [
      { label: 'Template', file: 'form.component.html', code: template },
      { label: 'Component', file: 'form.component.ts', code: ts },
    ];
  });
}
