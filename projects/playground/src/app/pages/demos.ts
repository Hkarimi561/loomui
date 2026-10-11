import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UiBadge } from '@loomui-ng/ui/badge';
import { UiButton } from '@loomui-ng/ui/button';
import { UI_CARD } from '@loomui-ng/ui/card';
import { UiCheckbox } from '@loomui-ng/ui/checkbox';
import { UiInput } from '@loomui-ng/ui/input';
import { UiLabel } from '@loomui-ng/ui/label';
import { UiSeparator } from '@loomui-ng/ui/separator';
import { UiSwitch } from '@loomui-ng/ui/switch';
import { UI_TABS } from '@loomui-ng/ui/tabs';

@Component({
  selector: 'app-badge-page',
  imports: [UiBadge],
  template: `<h1 class="mb-1 text-2xl font-semibold">Badge</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/badge.md</p>
    <div class="flex flex-wrap items-center gap-2">
      @for (v of variants; track v) {
        <span uiBadge [variant]="v">{{ v }}</span>
      }
      <a uiBadge variant="secondary" href="#">as link</a>
    </div>`,
})
export class BadgePage {
  readonly variants = ['default', 'secondary', 'destructive', 'outline', 'ghost'] as const;
}

@Component({
  selector: 'app-input-page',
  imports: [UiInput, UiLabel, ReactiveFormsModule],
  template: `<h1 class="mb-1 text-2xl font-semibold">Input</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/input.md</p>
    <div class="flex max-w-sm flex-col gap-4">
      <div class="grid gap-2">
        <label uiLabel for="email">Email (reactive form)</label>
        <input uiInput id="email" type="email" placeholder="you@example.com" [formControl]="email" />
        <span class="text-xs text-muted-foreground">Value: {{ email.value }}</span>
      </div>
      <input uiInput placeholder="Disabled" disabled />
      <input uiInput placeholder="Invalid" aria-invalid="true" />
      <input uiInput type="file" />
      <input uiInput type="password" placeholder="Password" />
    </div>`,
})
export class InputPage {
  readonly email = new FormControl('');
}

@Component({
  selector: 'app-label-page',
  imports: [UiLabel, UiCheckbox],
  template: `<h1 class="mb-1 text-2xl font-semibold">Label</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/label.md</p>
    <div class="flex items-center gap-2">
      <button uiCheckbox id="terms"></button>
      <label uiLabel for="terms">Accept terms and conditions</label>
    </div>
    <p class="mt-4 text-sm text-muted-foreground">Click the label: the checkbox should toggle.</p>`,
})
export class LabelPage {}

@Component({
  selector: 'app-card-page',
  imports: [UI_CARD, UiButton],
  template: `<h1 class="mb-1 text-2xl font-semibold">Card</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/card.md</p>
    <div class="grid gap-6 md:grid-cols-2">
      <div uiCard class="w-full max-w-sm">
        <div uiCardHeader>
          <div uiCardTitle>Login to your account</div>
          <div uiCardDescription>Enter your email below to login</div>
          <div uiCardAction><button uiButton variant="link">Sign Up</button></div>
        </div>
        <div uiCardContent>Card content goes here.</div>
        <div uiCardFooter class="flex-col gap-2">
          <button uiButton class="w-full">Login</button>
          <button uiButton variant="outline" class="w-full">Login with Google</button>
        </div>
      </div>
      <div uiCard size="sm" class="w-full max-w-sm">
        <div uiCardHeader>
          <div uiCardTitle>Small card</div>
          <div uiCardDescription>size="sm" tightens --card-spacing</div>
        </div>
        <div uiCardContent>Content</div>
      </div>
    </div>`,
})
export class CardPage {}

@Component({
  selector: 'app-separator-page',
  imports: [UiSeparator],
  template: `<h1 class="mb-1 text-2xl font-semibold">Separator</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/separator.md</p>
    <div class="max-w-sm">
      <div class="font-medium">Loom UI</div>
      <div class="text-sm text-muted-foreground">An open-source UI component library.</div>
      <div uiSeparator class="my-4"></div>
      <div class="flex h-5 items-center gap-4 text-sm">
        <div>Blog</div>
        <div uiSeparator orientation="vertical"></div>
        <div>Docs</div>
        <div uiSeparator orientation="vertical"></div>
        <div>Source</div>
      </div>
    </div>`,
})
export class SeparatorPage {}

@Component({
  selector: 'app-checkbox-page',
  imports: [UiCheckbox, UiLabel, ReactiveFormsModule],
  template: `<h1 class="mb-1 text-2xl font-semibold">Checkbox</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/checkbox.md</p>
    <div class="flex max-w-sm flex-col gap-4">
      <div class="flex items-center gap-2">
        <button uiCheckbox id="c1" [(checked)]="a"></button>
        <label uiLabel for="c1">Two-way [(checked)] — {{ a() }}</label>
      </div>
      <div class="flex items-center gap-2">
        <button uiCheckbox id="c2" [formControl]="ctrl"></button>
        <label uiLabel for="c2">Reactive form — {{ ctrl.value }}</label>
      </div>
      <div class="flex items-center gap-2">
        <button uiCheckbox id="c3" [indeterminate]="true"></button>
        <label uiLabel for="c3">Indeterminate (click to check)</label>
      </div>
      <div class="flex items-center gap-2">
        <button uiCheckbox id="c4" disabled></button>
        <label uiLabel for="c4">Disabled</label>
      </div>
      <div class="flex items-center gap-2">
        <button uiCheckbox id="c5" invalid></button>
        <label uiLabel for="c5">Invalid</label>
      </div>
    </div>`,
})
export class CheckboxPage {
  readonly a = signal(false);
  readonly ctrl = new FormControl(true);
}

@Component({
  selector: 'app-switch-page',
  imports: [UiSwitch, UiLabel, ReactiveFormsModule],
  template: `<h1 class="mb-1 text-2xl font-semibold">Switch</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/switch.md</p>
    <div class="flex max-w-sm flex-col gap-4">
      <div class="flex items-center gap-2">
        <button uiSwitch id="s1" [(checked)]="a"></button>
        <label uiLabel for="s1">Airplane mode — {{ a() }}</label>
      </div>
      <div class="flex items-center gap-2">
        <button uiSwitch id="s2" size="sm" [formControl]="ctrl"></button>
        <label uiLabel for="s2">Small, reactive — {{ ctrl.value }}</label>
      </div>
      <div class="flex items-center gap-2">
        <button uiSwitch id="s3" disabled></button>
        <label uiLabel for="s3">Disabled off</label>
      </div>
      <div class="flex items-center gap-2">
        <button uiSwitch id="s4" disabled [checked]="true"></button>
        <label uiLabel for="s4">Disabled on</label>
      </div>
    </div>`,
})
export class SwitchPage {
  readonly a = signal(false);
  readonly ctrl = new FormControl(true);
}

@Component({
  selector: 'app-tabs-page',
  imports: [UI_TABS],
  template: `<h1 class="mb-1 text-2xl font-semibold">Tabs</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/tabs.md</p>
    <div class="flex flex-col gap-8">
      <div uiTabs [(value)]="tab" class="w-[400px] max-w-full">
        <div uiTabsList>
          <button uiTabsTrigger value="overview">Overview</button>
          <button uiTabsTrigger value="analytics">Analytics</button>
          <button uiTabsTrigger value="reports">Reports</button>
          <button uiTabsTrigger value="settings" disabled>Settings</button>
        </div>
        <div uiTabsContent value="overview">Overview panel</div>
        <div uiTabsContent value="analytics">Analytics panel</div>
        <div uiTabsContent value="reports">Reports panel</div>
        <div uiTabsContent value="settings">Settings panel</div>
      </div>
      <p class="text-sm text-muted-foreground">Selected: {{ tab() }}</p>

      <div uiTabs [value]="'a'" #v="uiTabs" class="w-[400px] max-w-full">
        <div uiTabsList variant="line">
          <button uiTabsTrigger value="a">Line A</button>
          <button uiTabsTrigger value="b">Line B</button>
        </div>
        <div uiTabsContent value="a">Panel A</div>
        <div uiTabsContent value="b">Panel B</div>
      </div>

      <div uiTabs [(value)]="vtab" orientation="vertical">
        <div uiTabsList variant="line">
          <button uiTabsTrigger value="one">One</button>
          <button uiTabsTrigger value="two">Two</button>
        </div>
        <div uiTabsContent value="one">Vertical one</div>
        <div uiTabsContent value="two">Vertical two</div>
      </div>
    </div>`,
})
export class TabsPage {
  readonly tab = signal<string | undefined>('overview');
  readonly vtab = signal<string | undefined>('one');
}
