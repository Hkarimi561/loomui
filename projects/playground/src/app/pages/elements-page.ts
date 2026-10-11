import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UI_ACCORDION } from '@loomui/ui/accordion';
import { UI_ALERT } from '@loomui/ui/alert';
import { UI_AVATAR } from '@loomui/ui/avatar';
import { UiBadge } from '@loomui/ui/badge';
import { UI_BREADCRUMB } from '@loomui/ui/breadcrumb';
import { UiButton } from '@loomui/ui/button';
import { UI_CARD } from '@loomui/ui/card';
import { UiCheckbox } from '@loomui/ui/checkbox';
import { UI_DIALOG } from '@loomui/ui/dialog';
import { UI_DROPDOWN_MENU } from '@loomui/ui/dropdown-menu';
import { UiIcon } from '@loomui/ui/icon';
import { UI_INPUT } from '@loomui/ui/input';
import { UiKbd } from '@loomui/ui/kbd';
import { UiLabel } from '@loomui/ui/label';
import { UI_NATIVE_SELECT } from '@loomui/ui/native-select';
import { UI_PAGINATION } from '@loomui/ui/pagination';
import { UI_POPOVER } from '@loomui/ui/popover';
import { UI_PROGRESS } from '@loomui/ui/progress';
import { UI_RADIO_GROUP } from '@loomui/ui/radio-group';
import { UI_SELECT } from '@loomui/ui/select';
import { UiSeparator } from '@loomui/ui/separator';
import { UiSkeleton } from '@loomui/ui/skeleton';
import { UiSwitch } from '@loomui/ui/switch';
import { UI_TABLE } from '@loomui/ui/table';
import { UI_TABS } from '@loomui/ui/tabs';
import { UI_TEXTAREA } from '@loomui/ui/textarea';
import { UiToastService } from '@loomui/ui/toast';
import { UI_TOOLTIP } from '@loomui/ui/tooltip';
import '../icons';

/** Every control below is written with custom elements only — no directive attribute on a native tag. */
@Component({
  selector: 'app-elements-page',
  imports: [
    FormsModule, UiIcon, UiBadge, UiButton, UiCheckbox, UiKbd, UiLabel, UiSeparator, UiSkeleton, UiSwitch,
    UI_ACCORDION, UI_ALERT, UI_AVATAR, UI_BREADCRUMB, UI_CARD, UI_DIALOG, UI_DROPDOWN_MENU, UI_INPUT, UI_NATIVE_SELECT,
    UI_PAGINATION, UI_POPOVER, UI_PROGRESS, UI_RADIO_GROUP, UI_SELECT, UI_TABLE, UI_TABS, UI_TEXTAREA, UI_TOOLTIP,
  ],
  template: `
    <div class="mx-auto max-w-5xl px-4 py-8 md:py-10">
      <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight md:text-4xl">Custom elements</h1>
        <p class="mt-2 max-w-2xl text-muted-foreground">
          Every component also exists as a custom element: <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">&lt;ui-button&gt;</code>,
          <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">&lt;ui-table&gt;</code>, … The directives still work exactly as before. Everything on this
          page is written with elements only.
        </p>
      </header>

      <div class="grid gap-6 md:grid-cols-2">
        <section aria-labelledby="e-buttons" class="grid gap-3 rounded-2xl border bg-card p-5">
          <h2 id="e-buttons" class="font-medium">Buttons & badges</h2>
          <div class="flex flex-wrap gap-2">
            <ui-button (click)="clicks.set(clicks() + 1); toast.success('ui-button clicked')">Default</ui-button>
            <ui-button variant="secondary">Secondary</ui-button>
            <ui-button variant="outline">Outline</ui-button>
            <ui-button variant="ghost">Ghost</ui-button>
            <ui-button variant="destructive">Destructive</ui-button>
            <ui-button [disabled]="true" (click)="toast.error('disabled buttons must not fire')">Disabled</ui-button>
            <ui-button size="icon" variant="outline" aria-label="Search"><ui-icon name="search" /></ui-button>
          </div>
          <div class="flex flex-wrap gap-2">
            <ui-badge>Badge</ui-badge><ui-badge variant="secondary">Secondary</ui-badge><ui-badge variant="outline">Outline</ui-badge>
            <ui-kbd>Ctrl</ui-kbd><ui-kbd>K</ui-kbd>
          </div>
          <p class="text-xs text-muted-foreground">Enter / Space on a focused ui-button clicks it. Clicks so far: {{ clicks() }}</p>
        </section>

        <section aria-labelledby="e-form" class="grid gap-3 rounded-2xl border bg-card p-5">
          <h2 id="e-form" class="font-medium">Form controls</h2>
          <div class="grid gap-1.5">
            <ui-label for="e-email">Email</ui-label>
            <ui-input id="e-email" type="email" placeholder="you@example.com" [(ngModel)]="email" />
          </div>
          <ui-textarea rows="2" placeholder="Tell us more…" [(ngModel)]="bio" aria-label="Bio" />
          <ui-native-select [(ngModel)]="fruit" aria-label="Fruit">
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="cherry">Cherry</option>
          </ui-native-select>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 text-sm"><ui-checkbox [(ngModel)]="agree" aria-label="Agree" /> Agree</label>
            <label class="flex items-center gap-2 text-sm"><ui-switch [(ngModel)]="notify" aria-label="Notify" /> Notify</label>
          </div>
          <p class="text-xs text-muted-foreground" aria-live="polite">email={{ email() }} · fruit={{ fruit() }} · agree={{ agree() }} · notify={{ notify() }}</p>
        </section>

        <section aria-labelledby="e-tabs" class="rounded-2xl border bg-card p-5">
          <h2 id="e-tabs" class="mb-3 font-medium">Tabs & accordion</h2>
          <ui-tabs [(value)]="tab">
            <ui-tabs-list>
              <ui-tabs-trigger value="a">Account</ui-tabs-trigger>
              <ui-tabs-trigger value="b">Password</ui-tabs-trigger>
              <ui-tabs-trigger value="c">Team</ui-tabs-trigger>
            </ui-tabs-list>
            <ui-tabs-content value="a">Account panel</ui-tabs-content>
            <ui-tabs-content value="b">Password panel</ui-tabs-content>
            <ui-tabs-content value="c">Team panel</ui-tabs-content>
          </ui-tabs>
          <ui-accordion type="single" class="mt-4">
            <ui-accordion-item value="1">
              <ui-accordion-trigger>Is it accessible?</ui-accordion-trigger>
              <ui-accordion-content>Yes. Roles, keyboard and focus are restored on the element.</ui-accordion-content>
            </ui-accordion-item>
            <ui-accordion-item value="2">
              <ui-accordion-trigger>Is it styled?</ui-accordion-trigger>
              <ui-accordion-content>Yes, with the same classes as the directive.</ui-accordion-content>
            </ui-accordion-item>
          </ui-accordion>
        </section>

        <section aria-labelledby="e-overlay" class="grid content-start gap-3 rounded-2xl border bg-card p-5">
          <h2 id="e-overlay" class="font-medium">Overlays</h2>
          <div class="flex flex-wrap gap-2">
            <ui-dialog [(open)]="dialogOpen" class="contents">
              <ui-button variant="outline" uiDialogTrigger>Open dialog</ui-button>
              <ui-dialog-content>
                <ui-dialog-header>
                  <ui-dialog-title>Custom-element dialog</ui-dialog-title>
                  <ui-dialog-description>Focus is trapped, Esc closes and focus returns to the trigger.</ui-dialog-description>
                </ui-dialog-header>
                <ui-dialog-footer>
                  <ui-button variant="outline" uiDialogClose>Cancel</ui-button>
                  <ui-button uiDialogClose>Save</ui-button>
                </ui-dialog-footer>
              </ui-dialog-content>
            </ui-dialog>

            <ui-dropdown-menu class="contents">
              <ui-button variant="outline" uiDropdownMenuTrigger>Menu</ui-button>
              <ui-dropdown-menu-content class="w-44">
                <ui-dropdown-menu-label>My account</ui-dropdown-menu-label>
                <ui-dropdown-menu-item (select)="toast.info('Profile')">Profile</ui-dropdown-menu-item>
                <ui-dropdown-menu-item (select)="toast.info('Billing')">Billing</ui-dropdown-menu-item>
                <ui-dropdown-menu-separator />
                <ui-dropdown-menu-item variant="destructive">Log out</ui-dropdown-menu-item>
              </ui-dropdown-menu-content>
            </ui-dropdown-menu>

            <ui-popover class="contents">
              <ui-button variant="outline" uiPopoverTrigger>Popover</ui-button>
              <ui-popover-content>
                <ui-popover-header><ui-popover-title>Dimensions</ui-popover-title><ui-popover-description>Set the layer size.</ui-popover-description></ui-popover-header>
              </ui-popover-content>
            </ui-popover>

            <ui-tooltip class="contents">
              <ui-button variant="outline" uiTooltipTrigger>Hover me</ui-button>
              <ui-tooltip-content>A tooltip</ui-tooltip-content>
            </ui-tooltip>

            <ui-select [(value)]="plan" class="contents">
              <ui-select-trigger class="w-36"><ui-select-value placeholder="Plan" /></ui-select-trigger>
              <ui-select-content>
                <ui-select-item value="free">Free</ui-select-item>
                <ui-select-item value="pro">Pro</ui-select-item>
                <ui-select-item value="team">Team</ui-select-item>
              </ui-select-content>
            </ui-select>
          </div>
          <p class="text-xs text-muted-foreground">plan={{ plan() }}</p>
        </section>

        <section aria-labelledby="e-card" class="grid content-start gap-4">
          <ui-card>
            <ui-card-header>
              <ui-card-title>Card</ui-card-title>
              <ui-card-description>Header, content and footer as elements.</ui-card-description>
            </ui-card-header>
            <ui-card-content class="grid gap-3">
              <ui-alert><ui-icon name="info" /><ui-alert-title>Heads up</ui-alert-title><ui-alert-description>Alerts work too.</ui-alert-description></ui-alert>
              <ui-progress [value]="64" />
              <div class="flex items-center gap-3">
                <ui-avatar><ui-avatar-image src="https://github.com/shadcn.png" alt="shadcn" /><ui-avatar-fallback>CN</ui-avatar-fallback></ui-avatar>
                <ui-skeleton class="h-4 w-40" />
              </div>
            </ui-card-content>
            <ui-card-footer><ui-button size="sm">Save</ui-button></ui-card-footer>
          </ui-card>
        </section>

        <section aria-labelledby="e-nav" class="grid content-start gap-4 rounded-2xl border bg-card p-5">
          <h2 id="e-nav" class="font-medium">Navigation</h2>
          <ui-breadcrumb>
            <ui-breadcrumb-list>
              <ui-breadcrumb-item><ui-breadcrumb-link href="/">Home</ui-breadcrumb-link></ui-breadcrumb-item>
              <ui-breadcrumb-separator />
              <ui-breadcrumb-item><ui-breadcrumb-link href="/components">Components</ui-breadcrumb-link></ui-breadcrumb-item>
              <ui-breadcrumb-separator />
              <ui-breadcrumb-item><ui-breadcrumb-page>Elements</ui-breadcrumb-page></ui-breadcrumb-item>
            </ui-breadcrumb-list>
          </ui-breadcrumb>
          <ui-separator />
          <ui-radio-group [(value)]="radio">
            <label class="flex items-center gap-2 text-sm"><ui-radio-group-item value="a" /> Option A</label>
            <label class="flex items-center gap-2 text-sm"><ui-radio-group-item value="b" /> Option B</label>
          </ui-radio-group>
          <p class="text-xs text-muted-foreground">radio={{ radio() }}</p>
        </section>

        <section aria-labelledby="e-table" class="overflow-hidden rounded-2xl border bg-card md:col-span-2">
          <h2 id="e-table" class="p-5 pb-3 font-medium">Table</h2>
          <ui-table-container>
            <ui-table>
              <ui-table-header>
                <ui-table-row><ui-table-head>Invoice</ui-table-head><ui-table-head>Status</ui-table-head><ui-table-head class="text-end">Amount</ui-table-head></ui-table-row>
              </ui-table-header>
              <ui-table-body>
                @for (r of rows; track r.id) {
                  <ui-table-row>
                    <ui-table-cell class="font-medium">{{ r.id }}</ui-table-cell>
                    <ui-table-cell>{{ r.status }}</ui-table-cell>
                    <ui-table-cell class="text-end">{{ r.amount }}</ui-table-cell>
                  </ui-table-row>
                }
              </ui-table-body>
            </ui-table>
          </ui-table-container>
          <div class="p-4">
            <ui-pagination>
              <ui-pagination-content>
                <ui-pagination-item><ui-pagination-previous href="#" /></ui-pagination-item>
                <ui-pagination-item><ui-pagination-link href="#" [isActive]="true">1</ui-pagination-link></ui-pagination-item>
                <ui-pagination-item><ui-pagination-link href="#">2</ui-pagination-link></ui-pagination-item>
                <ui-pagination-item><ui-pagination-ellipsis /></ui-pagination-item>
                <ui-pagination-item><ui-pagination-next href="#" /></ui-pagination-item>
              </ui-pagination-content>
            </ui-pagination>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class ElementsPage {
  readonly toast = inject(UiToastService);
  readonly clicks = signal(0);
  readonly email = signal('');
  readonly bio = signal('');
  readonly fruit = signal('banana');
  readonly agree = signal(false);
  readonly notify = signal(true);
  readonly tab = signal('a');
  readonly dialogOpen = signal(false);
  readonly plan = signal('pro');
  readonly radio = signal('a');
  readonly rows = [
    { id: 'INV001', status: 'Paid', amount: '$250.00' },
    { id: 'INV002', status: 'Pending', amount: '$150.00' },
    { id: 'INV003', status: 'Unpaid', amount: '$350.00' },
  ];
}
