import { Component, signal } from '@angular/core';
import { UI_ALERT } from '@loomui-ng/ui/alert';
import { UI_AVATAR } from '@loomui-ng/ui/avatar';
import { UI_BREADCRUMB } from '@loomui-ng/ui/breadcrumb';
import { UiButton } from '@loomui-ng/ui/button';
import { UI_BUTTON_GROUP } from '@loomui-ng/ui/button-group';
import { UI_EMPTY } from '@loomui-ng/ui/empty';
import { UI_FIELD } from '@loomui-ng/ui/field';
import { UiInput } from '@loomui-ng/ui/input';
import { UI_INPUT_GROUP } from '@loomui-ng/ui/input-group';
import { UI_ITEM } from '@loomui-ng/ui/item';
import { UI_KBD } from '@loomui-ng/ui/kbd';
import { UI_NATIVE_SELECT } from '@loomui-ng/ui/native-select';
import { UI_PAGINATION } from '@loomui-ng/ui/pagination';
import { UI_PROGRESS } from '@loomui-ng/ui/progress';
import { UI_SKELETON } from '@loomui-ng/ui/skeleton';
import { UI_SPINNER } from '@loomui-ng/ui/spinner';
import { UI_TABLE } from '@loomui-ng/ui/table';
import { UI_TEXTAREA } from '@loomui-ng/ui/textarea';

const ICON = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

@Component({
  selector: 'app-alert-page',
  imports: [UI_ALERT],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Alert</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/alert.md</p>
    <div class="grid max-w-xl gap-4">
      <div uiAlert>
        <svg ${ICON}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
        <div uiAlertTitle>Heads up!</div>
        <div uiAlertDescription>You can add components to your app using the CLI.</div>
      </div>
      <div uiAlert variant="destructive">
        <svg ${ICON}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
        <div uiAlertTitle>Unable to process your payment.</div>
        <div uiAlertDescription>Please verify your billing information and try again.</div>
      </div>
    </div>
  `,
})
export class AlertPage {}

@Component({
  selector: 'app-avatar-page',
  imports: [UI_AVATAR],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Avatar</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/avatar.md</p>
    <div class="flex flex-wrap items-center gap-6">
      <span uiAvatar size="sm"><img uiAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /><span uiAvatarFallback>CN</span></span>
      <span uiAvatar><img uiAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /><span uiAvatarFallback>CN</span></span>
      <span uiAvatar size="lg"><img uiAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /><span uiAvatarFallback>CN</span></span>
      <span uiAvatar><img uiAvatarImage src="/broken.png" alt="broken" /><span uiAvatarFallback>ER</span></span>
      <span uiAvatar><span uiAvatarFallback>JD</span><span uiAvatarBadge class="bg-green-600"></span></span>
      <div uiAvatarGroup>
        <span uiAvatar><span uiAvatarFallback>A</span></span>
        <span uiAvatar><span uiAvatarFallback>B</span></span>
        <span uiAvatar><span uiAvatarFallback>C</span></span>
        <div uiAvatarGroupCount>+3</div>
      </div>
    </div>
  `,
})
export class AvatarPage {}

@Component({
  selector: 'app-breadcrumb-page',
  imports: [UI_BREADCRUMB],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Breadcrumb</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/breadcrumb.md</p>
    <nav uiBreadcrumb>
      <ol uiBreadcrumbList>
        <li uiBreadcrumbItem><a uiBreadcrumbLink href="#">Home</a></li>
        <li uiBreadcrumbSeparator></li>
        <li uiBreadcrumbItem><span uiBreadcrumbEllipsis></span></li>
        <li uiBreadcrumbSeparator></li>
        <li uiBreadcrumbItem><a uiBreadcrumbLink href="#">Components</a></li>
        <li uiBreadcrumbSeparator></li>
        <li uiBreadcrumbItem><span uiBreadcrumbPage>Breadcrumb</span></li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbPage {}

@Component({
  selector: 'app-button-group-page',
  imports: [UI_BUTTON_GROUP, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Button Group</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/button-group.md</p>
    <div class="flex flex-wrap items-start gap-8">
      <div uiButtonGroup aria-label="Text alignment">
        <button uiButton variant="outline">Left</button>
        <button uiButton variant="outline">Center</button>
        <button uiButton variant="outline">Right</button>
      </div>
      <div uiButtonGroup orientation="vertical" aria-label="Media controls">
        <button uiButton variant="outline">Play</button>
        <button uiButton variant="outline">Pause</button>
        <button uiButton variant="outline">Stop</button>
      </div>
      <div uiButtonGroup>
        <button uiButton variant="secondary">Save</button>
        <div uiButtonGroupSeparator></div>
        <button uiButton variant="secondary">Cancel</button>
      </div>
    </div>
  `,
})
export class ButtonGroupPage {}

@Component({
  selector: 'app-empty-page',
  imports: [UI_EMPTY, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Empty</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/empty.md</p>
    <div uiEmpty class="max-w-md border border-dashed">
      <div uiEmptyHeader>
        <div uiEmptyIcon variant="icon"><svg ${ICON}><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg></div>
        <div uiEmptyTitle>No projects yet</div>
        <div uiEmptyDescription>You haven't created any projects yet. Get started by creating your first project.</div>
      </div>
      <div uiEmptyContent><button uiButton>Create project</button></div>
    </div>
  `,
})
export class EmptyPage {}

@Component({
  selector: 'app-field-page',
  imports: [UI_FIELD, UiInput],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Field</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/field.md</p>
    <fieldset uiFieldSet class="w-full max-w-sm">
      <legend uiFieldLegend>Profile</legend>
      <p uiFieldDescription>This appears on invoices and emails.</p>
      <div uiFieldGroup>
        <div uiField>
          <label uiFieldLabel for="f-name">Full name</label>
          <input uiInput id="f-name" placeholder="Evil Rabbit" />
          <p uiFieldDescription>Your legal name.</p>
        </div>
        <div uiField>
          <label uiFieldLabel for="f-email">Email</label>
          <input uiInput id="f-email" aria-invalid="true" />
          <div uiFieldError>Enter a valid email.</div>
        </div>
        <div uiFieldSeparator></div>
        <div uiField orientation="horizontal">
          <label uiFieldLabel for="f-h">Horizontal</label>
          <input uiInput id="f-h" />
        </div>
      </div>
    </fieldset>
  `,
})
export class FieldPage {}

@Component({
  selector: 'app-input-group-page',
  imports: [UI_INPUT_GROUP, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Input Group</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/input-group.md</p>
    <div class="grid max-w-sm gap-4">
      <div uiInputGroup>
        <input uiInputGroupControl placeholder="Search..." />
        <div uiInputGroupAddon align="inline-start"><svg class="size-4" ${ICON}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg></div>
        <div uiInputGroupAddon align="inline-end">12 results</div>
      </div>
      <div uiInputGroup>
        <input uiInputGroupControl placeholder="example.com" />
        <div uiInputGroupAddon align="inline-start">https://</div>
        <div uiInputGroupAddon align="inline-end"><button uiButton size="icon-xs" variant="ghost" aria-label="Copy">⧉</button></div>
      </div>
    </div>
  `,
})
export class InputGroupPage {}

@Component({
  selector: 'app-item-page',
  imports: [UI_ITEM, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Item</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/item.md</p>
    <div uiItemGroup class="max-w-md gap-3">
      @for (v of variants; track v) {
        <div uiItem [variant]="v">
          <div uiItemMedia variant="icon"><svg ${ICON}><path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" /></svg></div>
          <div uiItemContent>
            <div uiItemTitle>{{ v }} item</div>
            <p uiItemDescription>A short description of the item.</p>
          </div>
          <div uiItemActions><button uiButton size="sm" variant="outline">Action</button></div>
        </div>
      }
    </div>
  `,
})
export class ItemPage {
  readonly variants = ['default', 'outline', 'muted'] as const;
}

@Component({
  selector: 'app-kbd-page',
  imports: [UI_KBD],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Kbd</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/kbd.md</p>
    <div class="flex items-center gap-4">
      <kbd uiKbd>Ctrl</kbd>
      <kbd uiKbdGroup><kbd uiKbd>Ctrl</kbd><kbd uiKbd>B</kbd></kbd>
      <kbd uiKbdGroup><kbd uiKbd>⌘</kbd><kbd uiKbd>K</kbd></kbd>
    </div>
  `,
})
export class KbdPage {}

@Component({
  selector: 'app-native-select-page',
  imports: [UI_NATIVE_SELECT],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Native Select</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/native-select.md</p>
    <div class="flex flex-wrap items-center gap-4">
      <div uiNativeSelectWrapper>
        <select uiNativeSelect aria-label="Role">
          <option uiNativeSelectOption value="">Select role</option>
          <optgroup uiNativeSelectOptgroup label="Engineering"><option uiNativeSelectOption>Frontend</option><option uiNativeSelectOption>Backend</option></optgroup>
          <optgroup uiNativeSelectOptgroup label="Sales"><option uiNativeSelectOption>Account exec</option></optgroup>
        </select>
      </div>
      <div uiNativeSelectWrapper><select uiNativeSelect size="sm" aria-label="Small"><option>Small</option></select></div>
      <div uiNativeSelectWrapper><select uiNativeSelect disabled aria-label="Disabled"><option>Disabled</option></select></div>
      <div uiNativeSelectWrapper><select uiNativeSelect aria-invalid="true" aria-label="Invalid"><option>Invalid</option></select></div>
    </div>
  `,
})
export class NativeSelectPage {}

@Component({
  selector: 'app-skeleton-page',
  imports: [UI_SKELETON],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Skeleton</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/skeleton.md</p>
    <div class="flex items-center gap-4">
      <div uiSkeleton class="size-12 rounded-full"></div>
      <div class="grid gap-2">
        <div uiSkeleton class="h-4 w-[250px]"></div>
        <div uiSkeleton class="h-4 w-[200px]"></div>
      </div>
    </div>
  `,
})
export class SkeletonPage {}

@Component({
  selector: 'app-spinner-page',
  imports: [UI_SPINNER, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Spinner</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/spinner.md</p>
    <div class="flex items-center gap-6">
      <ui-spinner />
      <ui-spinner class="size-8" />
      <button uiButton disabled><ui-spinner /> Loading…</button>
    </div>
  `,
})
export class SpinnerPage {}

@Component({
  selector: 'app-textarea-page',
  imports: [UI_TEXTAREA],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Textarea</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/textarea.md</p>
    <div class="grid max-w-sm gap-4">
      <textarea uiTextarea placeholder="Type your message here."></textarea>
      <textarea uiTextarea disabled placeholder="Disabled"></textarea>
      <textarea uiTextarea aria-invalid="true" placeholder="Invalid"></textarea>
    </div>
  `,
})
export class TextareaPage {}

@Component({
  selector: 'app-table-page',
  imports: [UI_TABLE],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Table</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/table.md</p>
    <div uiTableContainer>
      <table uiTable>
        <caption uiTableCaption>A list of recent invoices.</caption>
        <thead uiTableHeader>
          <tr uiTableRow><th uiTableHead>Invoice</th><th uiTableHead>Status</th><th uiTableHead class="text-end">Amount</th></tr>
        </thead>
        <tbody uiTableBody>
          @for (r of rows; track r.id) {
            <tr uiTableRow>
              <td uiTableCell class="font-medium">{{ r.id }}</td>
              <td uiTableCell>{{ r.status }}</td>
              <td uiTableCell class="text-end">{{ r.amount }}</td>
            </tr>
          }
        </tbody>
        <tfoot uiTableFooter>
          <tr uiTableRow><td uiTableCell colspan="2">Total</td><td uiTableCell class="text-end">$750.00</td></tr>
        </tfoot>
      </table>
    </div>
  `,
})
export class TablePage {
  readonly rows = [
    { id: 'INV001', status: 'Paid', amount: '$250.00' },
    { id: 'INV002', status: 'Pending', amount: '$150.00' },
    { id: 'INV003', status: 'Unpaid', amount: '$350.00' },
  ];
}

@Component({
  selector: 'app-progress-page',
  imports: [UI_PROGRESS, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Progress</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/progress.md</p>
    <div class="grid max-w-sm gap-4">
      <div uiProgress [value]="value()"></div>
      <div uiProgress [value]="100"></div>
      <div uiProgress></div>
      <div class="flex gap-2">
        <button uiButton variant="outline" size="sm" (click)="value.set(max(0, value() - 10))">-10</button>
        <button uiButton variant="outline" size="sm" (click)="value.set(min(100, value() + 10))">+10</button>
        <span class="text-sm text-muted-foreground">{{ value() }}%</span>
      </div>
    </div>
  `,
})
export class ProgressPage {
  readonly value = signal(40);
  max = Math.max;
  min = Math.min;
}

@Component({
  selector: 'app-pagination-page',
  imports: [UI_PAGINATION],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Pagination</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/pagination.md</p>
    <nav uiPagination>
      <ul uiPaginationContent>
        <li uiPaginationItem><a uiPaginationPrevious href="#"></a></li>
        <li uiPaginationItem><a uiPaginationLink href="#">1</a></li>
        <li uiPaginationItem><a uiPaginationLink href="#" isActive>2</a></li>
        <li uiPaginationItem><a uiPaginationLink href="#">3</a></li>
        <li uiPaginationItem><span uiPaginationEllipsis></span></li>
        <li uiPaginationItem><a uiPaginationNext href="#"></a></li>
      </ul>
    </nav>
  `,
})
export class PaginationPage {}
