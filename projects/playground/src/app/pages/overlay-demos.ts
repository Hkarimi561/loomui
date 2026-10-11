import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UiButton } from '@loomui/ui/button';
import { UI_COMMAND } from '@loomui/ui/command';
import { UI_DIALOG } from '@loomui/ui/dialog';
import { UI_DROPDOWN_MENU } from '@loomui/ui/dropdown-menu';
import { UiInput } from '@loomui/ui/input';
import { UiLabel } from '@loomui/ui/label';
import { UI_POPOVER } from '@loomui/ui/popover';
import { UI_SELECT } from '@loomui/ui/select';
import { UI_SHEET } from '@loomui/ui/sheet';
import { UiToastService } from '@loomui/ui/toast';
import { UI_TOOLTIP } from '@loomui/ui/tooltip';

@Component({
  selector: 'app-dialog-page',
  imports: [UI_DIALOG, UiButton, UiInput, UiLabel],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Dialog</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/dialog.md</p>
    <div uiDialog [(open)]="open" class="contents">
      <button uiButton variant="outline" uiDialogTrigger>Open Dialog</button>
      <div uiDialogContent>
        <div uiDialogHeader>
          <h2 uiDialogTitle>Edit profile</h2>
          <p uiDialogDescription>Make changes to your profile here. Click save when you're done.</p>
        </div>
        <div class="grid gap-3">
          <label uiLabel for="d-name">Name</label>
          <input uiInput id="d-name" value="Pedro Duarte" />
        </div>
        <div class="grid gap-3">
          <label uiLabel for="d-user">Username</label>
          <input uiInput id="d-user" value="@peduarte" />
        </div>
        <div uiDialogFooter>
          <button uiButton variant="outline" uiDialogClose>Cancel</button>
          <button uiButton uiDialogClose>Save changes</button>
        </div>
      </div>
    </div>
    <p class="mt-4 text-sm text-muted-foreground">open = {{ open() }}</p>
  `,
})
export class DialogPage {
  readonly open = signal(false);
}

@Component({
  selector: 'app-sheet-page',
  imports: [UI_SHEET, UiButton, UiInput, UiLabel],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Sheet</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/sheet.md</p>
    <div class="flex flex-wrap gap-2">
      @for (s of sides; track s) {
        <div uiSheet class="contents">
          <button uiButton variant="outline" uiSheetTrigger>{{ s }}</button>
          <div uiSheetContent [side]="s">
            <div uiSheetHeader>
              <h2 uiSheetTitle>Edit profile</h2>
              <p uiSheetDescription>Make changes to your profile here. Click save when you're done.</p>
            </div>
            <div class="grid flex-1 auto-rows-min gap-6 px-4">
              <div class="grid gap-3">
                <label uiLabel [attr.for]="'sh-name-' + s">Name</label>
                <input uiInput [id]="'sh-name-' + s" value="Pedro Duarte" />
              </div>
            </div>
            <div uiSheetFooter>
              <button uiButton uiSheetClose>Save changes</button>
              <button uiButton variant="outline" uiSheetClose>Close</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class SheetPage {
  readonly sides = ['top', 'right', 'bottom', 'left'] as const;
}

@Component({
  selector: 'app-popover-page',
  imports: [UI_POPOVER, UiButton, UiInput, UiLabel],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Popover</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/popover.md</p>
    <div class="flex flex-wrap gap-4">
      @for (s of sides; track s) {
        <div uiPopover class="contents">
          <button uiButton variant="outline" uiPopoverTrigger>{{ s }}</button>
          <div uiPopoverContent [side]="s" align="center">
            <div uiPopoverHeader>
              <div uiPopoverTitle>Dimensions</div>
              <p uiPopoverDescription>Set the dimensions for the layer.</p>
            </div>
            <div class="grid grid-cols-3 items-center gap-2">
              <label uiLabel [attr.for]="'pw-' + s">Width</label>
              <input uiInput class="col-span-2 h-8" [id]="'pw-' + s" value="100%" />
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class PopoverPage {
  readonly sides = ['top', 'right', 'bottom', 'left'] as const;
}

@Component({
  selector: 'app-tooltip-page',
  imports: [UI_TOOLTIP, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Tooltip</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/tooltip.md</p>
    <div class="flex flex-wrap gap-4">
      @for (s of sides; track s) {
        <div uiTooltip class="contents">
          <button uiButton variant="outline" uiTooltipTrigger>{{ s }}</button>
          <div uiTooltipContent [side]="s">Add to library</div>
        </div>
      }
      <div uiTooltip [delay]="700" class="contents">
        <button uiButton variant="outline" uiTooltipTrigger>700ms delay</button>
        <div uiTooltipContent>Delayed tooltip</div>
      </div>
    </div>
  `,
})
export class TooltipPage {
  readonly sides = ['top', 'right', 'bottom', 'left'] as const;
}

@Component({
  selector: 'app-dropdown-menu-page',
  imports: [UI_DROPDOWN_MENU, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Dropdown Menu</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/dropdown-menu.md</p>
    <div uiDropdownMenu class="contents">
      <button uiButton variant="outline" uiDropdownMenuTrigger>Open</button>
      <div uiDropdownMenuContent class="w-56">
        <div uiDropdownMenuGroup>
          <div uiDropdownMenuLabel>My Account</div>
          <div uiDropdownMenuItem (select)="log('Profile')">Profile <span uiDropdownMenuShortcut>⇧⌘P</span></div>
          <div uiDropdownMenuItem (select)="log('Billing')">Billing <span uiDropdownMenuShortcut>⌘B</span></div>
          <div uiDropdownMenuItem disabled>Settings (disabled)</div>
        </div>
        <div uiDropdownMenuSeparator></div>
        <div uiDropdownMenuLabel>Appearance</div>
        <div uiDropdownMenuCheckboxItem [(checked)]="statusBar" (select)="$event.preventDefault()">Status Bar</div>
        <div uiDropdownMenuCheckboxItem [(checked)]="panel">Panel</div>
        <div uiDropdownMenuSeparator></div>
        <div uiDropdownMenuLabel>Position</div>
        <div uiDropdownMenuRadioGroup [(value)]="position">
          <div uiDropdownMenuRadioItem value="top" (select)="$event.preventDefault()">Top</div>
          <div uiDropdownMenuRadioItem value="bottom" (select)="$event.preventDefault()">Bottom</div>
          <div uiDropdownMenuRadioItem value="right" (select)="$event.preventDefault()">Right</div>
        </div>
        <div uiDropdownMenuSeparator></div>
        <div uiDropdownMenuSub>
          <div uiDropdownMenuSubTrigger>More tools</div>
          <div uiDropdownMenuSubContent class="w-44">
            <div uiDropdownMenuItem (select)="log('Save page')">Save page…</div>
            <div uiDropdownMenuItem (select)="log('Dev tools')">Developer tools</div>
          </div>
        </div>
        <div uiDropdownMenuSeparator></div>
        <div uiDropdownMenuItem variant="destructive" (select)="log('Log out')">Log out</div>
      </div>
    </div>
    <p class="mt-4 text-sm text-muted-foreground">
      Status bar: {{ statusBar() }} · Panel: {{ panel() }} · Position: {{ position() }} · Last: {{ last() }}
    </p>
  `,
})
export class DropdownMenuPage {
  readonly statusBar = signal(true);
  readonly panel = signal(false);
  readonly position = signal<string | undefined>('bottom');
  readonly last = signal('-');
  log(v: string) {
    this.last.set(v);
  }
}

@Component({
  selector: 'app-select-page',
  imports: [UI_SELECT, ReactiveFormsModule, UiLabel],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Select</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/select.md</p>
    <div class="flex flex-col gap-6">
      <div uiSelect [(value)]="fruit" class="contents">
        <button uiSelectTrigger class="w-[180px]">
          <span uiSelectValue placeholder="Select a fruit"></span>
        </button>
        <div uiSelectContent>
          <div uiSelectGroup>
            <div uiSelectLabel>Fruits</div>
            <div uiSelectItem value="apple">Apple</div>
            <div uiSelectItem value="banana">Banana</div>
            <div uiSelectItem value="blueberry">Blueberry</div>
            <div uiSelectItem value="grapes" disabled>Grapes (disabled)</div>
            <div uiSelectItem value="pineapple">Pineapple</div>
          </div>
        </div>
      </div>
      <p class="text-sm text-muted-foreground">value = "{{ fruit() }}"</p>

      <div class="flex items-center gap-2">
        <label uiLabel>Reactive form</label>
        <div uiSelect [formControl]="ctrl" class="contents">
          <button uiSelectTrigger size="sm" class="w-[160px]">
            <span uiSelectValue placeholder="Theme"></span>
          </button>
          <div uiSelectContent>
            <div uiSelectGroup>
              <div uiSelectItem value="light">Light</div>
              <div uiSelectItem value="dark">Dark</div>
              <div uiSelectItem value="system">System</div>
            </div>
          </div>
        </div>
        <span class="text-sm text-muted-foreground">{{ ctrl.value }}</span>
      </div>
    </div>
  `,
})
export class SelectPage {
  readonly fruit = signal('');
  readonly ctrl = new FormControl('dark');
}

@Component({
  selector: 'app-command-page',
  imports: [UI_COMMAND],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Command</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/command.md</p>
    <div uiCommand class="max-w-sm rounded-lg border">
      <div uiCommandInputWrapper><input uiCommandInput placeholder="Type a command or search..." /></div>
      <div uiCommandList>
        <div uiCommandEmpty>No results found.</div>
        <div uiCommandGroup heading="Suggestions">
          <div uiCommandItem value="Calendar" (select)="pick('Calendar')">Calendar</div>
          <div uiCommandItem value="Search Emoji" (select)="pick('Search Emoji')">Search Emoji</div>
          <div uiCommandItem value="Calculator" disabled>Calculator (disabled)</div>
        </div>
        <div uiCommandSeparator></div>
        <div uiCommandGroup heading="Settings">
          <div uiCommandItem value="Profile" (select)="pick('Profile')">Profile <span uiCommandShortcut>⌘P</span></div>
          <div uiCommandItem value="Billing" (select)="pick('Billing')">Billing <span uiCommandShortcut>⌘B</span></div>
          <div uiCommandItem value="Settings" (select)="pick('Settings')">Settings <span uiCommandShortcut>⌘S</span></div>
        </div>
      </div>
    </div>
    <p class="mt-4 text-sm text-muted-foreground">Selected: {{ picked() }}</p>
  `,
})
export class CommandPage {
  readonly picked = signal('-');
  pick(v: string) {
    this.picked.set(v);
  }
}

@Component({
  selector: 'app-toast-page',
  imports: [UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Toast (Sonner)</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/toast.md · Alt+T focuses the toast region.</p>
    <div class="flex flex-wrap gap-2">
      <button uiButton variant="outline" (click)="basic()">Show Toast</button>
      <button uiButton variant="outline" (click)="svc.success('Saved', { description: 'Your changes were saved.' })">Success</button>
      <button uiButton variant="outline" (click)="svc.error('Something went wrong')">Error</button>
      <button uiButton variant="outline" (click)="svc.info('FYI', { description: 'Heads up.' })">Info</button>
      <button uiButton variant="outline" (click)="svc.warning('Careful')">Warning</button>
      <button uiButton variant="outline" (click)="svc.loading('Loading…', { id: 'l1' })">Loading</button>
      <button uiButton variant="outline" (click)="svc.dismiss('l1')">Dismiss loading</button>
      <button uiButton variant="outline" (click)="svc.dismiss()">Dismiss all</button>
    </div>
  `,
})
export class ToastPage {
  protected readonly svc = inject(UiToastService);
  basic() {
    this.svc.show('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: { label: 'Undo', onClick: () => console.log('Undo') },
    });
  }
}
