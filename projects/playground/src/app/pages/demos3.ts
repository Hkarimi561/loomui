import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UiButton } from '@loomui-ng/ui/button';
import { UI_ACCORDION } from '@loomui-ng/ui/accordion';
import { UI_COLLAPSIBLE } from '@loomui-ng/ui/collapsible';
import { UiLabel } from '@loomui-ng/ui/label';
import { UI_RADIO_GROUP } from '@loomui-ng/ui/radio-group';
import { UI_SLIDER } from '@loomui-ng/ui/slider';
import { UiToggle } from '@loomui-ng/ui/toggle';
import { UI_TOGGLE_GROUP } from '@loomui-ng/ui/toggle-group';

@Component({
  selector: 'app-accordion-page',
  imports: [UI_ACCORDION],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Accordion</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/accordion.md</p>
    <div class="grid max-w-lg gap-8">
      <div uiAccordion type="single" [(value)]="single" class="rounded-lg border">
        @for (it of items; track it.v) {
          <div uiAccordionItem [value]="it.v" [disabled]="it.disabled">
            <button uiAccordionTrigger>{{ it.q }}</button>
            <div uiAccordionContent>{{ it.a }}</div>
          </div>
        }
      </div>
      <p class="text-sm text-muted-foreground">single value: {{ single() }}</p>
      <div uiAccordion type="multiple" [(value)]="multi" class="rounded-lg border">
        @for (it of items; track it.v) {
          <div uiAccordionItem [value]="it.v">
            <button uiAccordionTrigger>{{ it.q }}</button>
            <div uiAccordionContent>{{ it.a }}</div>
          </div>
        }
      </div>
      <p class="text-sm text-muted-foreground">multiple values: {{ multi().join(', ') }}</p>
    </div>
  `,
})
export class AccordionPage {
  readonly single = signal<string[]>(['a']);
  readonly multi = signal<string[]>([]);
  readonly items = [
    { v: 'a', q: 'Is it accessible?', a: 'Yes. It adheres to the WAI-ARIA design pattern.', disabled: false },
    { v: 'b', q: 'Is it styled?', a: 'Yes. It comes with default styles that match the other components.', disabled: false },
    { v: 'c', q: 'Disabled item', a: 'You cannot open this one.', disabled: true },
    { v: 'd', q: 'Is it animated?', a: 'Yes. It is animated by default, but you can disable it if you prefer.', disabled: false },
  ];
}

@Component({
  selector: 'app-collapsible-page',
  imports: [UI_COLLAPSIBLE, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Collapsible</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/collapsible.md</p>
    <div uiCollapsible [(open)]="open" class="w-80 rounded-md border">
      <div class="flex items-center justify-between gap-4 p-2.5">
        <h4 class="text-sm font-semibold">@peduarte starred 3 repositories</h4>
        <button uiCollapsibleTrigger uiButton variant="ghost" size="icon-sm" aria-label="Toggle">⌄</button>
      </div>
      <div class="px-2.5 pb-2.5 font-mono text-sm">@radix-ui/primitives</div>
      <div uiCollapsibleContent>
        <div class="px-2.5 font-mono text-sm">@radix-ui/colors</div>
        <div class="px-2.5 pb-2.5 font-mono text-sm">@stitches/react</div>
      </div>
    </div>
    <p class="mt-4 text-sm text-muted-foreground">open = {{ open() }}</p>
  `,
})
export class CollapsiblePage {
  readonly open = signal(false);
}

@Component({
  selector: 'app-toggle-page',
  imports: [UiToggle, UI_TOGGLE_GROUP],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Toggle</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/toggle.md</p>
    <div class="flex flex-wrap items-center gap-3">
      <button uiToggle aria-label="Toggle bold" [(pressed)]="bold">B</button>
      <button uiToggle variant="outline" aria-label="Toggle italic">I</button>
      <button uiToggle variant="outline" size="sm" aria-label="Toggle small">S</button>
      <button uiToggle variant="outline" size="lg" aria-label="Toggle large">L</button>
      <button uiToggle disabled aria-label="Toggle disabled">D</button>
      <span class="text-sm text-muted-foreground">bold = {{ bold() }}</span>
    </div>
  `,
})
export class TogglePage {
  readonly bold = signal(false);
}

@Component({
  selector: 'app-toggle-group-page',
  imports: [UI_TOGGLE_GROUP],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Toggle Group</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/toggle-group.md</p>
    <div class="flex flex-col gap-6">
      <div uiToggleGroup type="multiple" variant="outline" [(value)]="multi">
        <button uiToggleGroupItem value="bold" aria-label="Toggle bold">B</button>
        <button uiToggleGroupItem value="italic" aria-label="Toggle italic">I</button>
        <button uiToggleGroupItem value="underline" aria-label="Toggle underline">U</button>
      </div>
      <div uiToggleGroup type="single" variant="outline" [spacing]="2" [(value)]="single">
        <button uiToggleGroupItem value="left" aria-label="Left">Left</button>
        <button uiToggleGroupItem value="center" aria-label="Center">Center</button>
        <button uiToggleGroupItem value="right" aria-label="Right">Right</button>
      </div>
      <div uiToggleGroup type="single" orientation="vertical" size="sm" variant="outline">
        <button uiToggleGroupItem value="a">A</button>
        <button uiToggleGroupItem value="b">B</button>
      </div>
      <p class="text-sm text-muted-foreground">multi: {{ multi().join(', ') }} · single: {{ single().join(', ') }}</p>
    </div>
  `,
})
export class ToggleGroupPage {
  readonly multi = signal<string[]>(['bold']);
  readonly single = signal<string[]>(['center']);
}

@Component({
  selector: 'app-radio-group-page',
  imports: [UI_RADIO_GROUP, UiLabel, ReactiveFormsModule],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Radio Group</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/radio-group.md</p>
    <div class="grid max-w-sm gap-6">
      <div uiRadioGroup [(value)]="plan">
        @for (p of plans; track p) {
          <div class="flex items-center gap-3">
            <button uiRadioGroupItem [value]="p" [id]="'plan-' + p" [disabled]="p === 'team'"></button>
            <label uiLabel [attr.for]="'plan-' + p">{{ p }}{{ p === 'team' ? ' (disabled)' : '' }}</label>
          </div>
        }
      </div>
      <p class="text-sm text-muted-foreground">plan = {{ plan() }}</p>
      <div uiRadioGroup [formControl]="ctrl">
        <div class="flex items-center gap-3"><button uiRadioGroupItem value="x" id="rx"></button><label uiLabel for="rx">X</label></div>
        <div class="flex items-center gap-3"><button uiRadioGroupItem value="y" id="ry" invalid></button><label uiLabel for="ry">Y (invalid)</label></div>
      </div>
      <p class="text-sm text-muted-foreground">reactive = {{ ctrl.value }}</p>
    </div>
  `,
})
export class RadioGroupPage {
  readonly plan = signal('pro');
  readonly plans = ['free', 'pro', 'team'];
  readonly ctrl = new FormControl('x');
}

@Component({
  selector: 'app-slider-page',
  imports: [UI_SLIDER, ReactiveFormsModule],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Slider</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/slider.md</p>
    <div class="grid max-w-xs gap-8">
      <span uiSlider [(value)]="single" [max]="100" [step]="1"></span>
      <p class="text-sm text-muted-foreground">single = {{ single() }}</p>
      <span uiSlider [(value)]="range" [max]="100" [step]="5"></span>
      <p class="text-sm text-muted-foreground">range = {{ range().join(' – ') }}</p>
      <span uiSlider [value]="[30]" disabled></span>
      <span uiSlider [formControl]="ctrl"></span>
      <p class="text-sm text-muted-foreground">reactive = {{ ctrl.value }}</p>
      <span uiSlider [(value)]="vertical" orientation="vertical"></span>
    </div>
  `,
})
export class SliderPage {
  readonly single = signal([50]);
  readonly range = signal([25, 75]);
  readonly vertical = signal([40]);
  readonly ctrl = new FormControl<number | number[]>(20);
}
