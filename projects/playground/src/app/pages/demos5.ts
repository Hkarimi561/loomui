import { Component, signal } from '@angular/core';
import { UI_ALERT_DIALOG } from '@loomui-ng/ui/alert-dialog';
import { UiButton } from '@loomui-ng/ui/button';
import { UI_COMBOBOX } from '@loomui-ng/ui/combobox';
import { UI_CONTEXT_MENU } from '@loomui-ng/ui/context-menu';
import { UI_DRAWER } from '@loomui-ng/ui/drawer';
import { UI_HOVER_CARD } from '@loomui-ng/ui/hover-card';
import { UI_MENUBAR } from '@loomui-ng/ui/menubar';
import { UI_NAVIGATION_MENU } from '@loomui-ng/ui/navigation-menu';

@Component({
  selector: 'app-alert-dialog-page',
  imports: [UI_ALERT_DIALOG, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Alert Dialog</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/alert-dialog.md</p>
    <div uiAlertDialog [(open)]="open" class="contents">
      <button uiButton variant="outline" uiAlertDialogTrigger>Show Dialog</button>
      <div uiAlertDialogContent>
        <div uiAlertDialogHeader>
          <h2 uiAlertDialogTitle>Are you absolutely sure?</h2>
          <p uiAlertDialogDescription>This action cannot be undone. This will permanently delete your account.</p>
        </div>
        <div uiAlertDialogFooter>
          <button uiAlertDialogCancel>Cancel</button>
          <button uiAlertDialogAction (click)="confirmed.set(confirmed() + 1)">Continue</button>
        </div>
      </div>
    </div>
    <p class="mt-4 text-sm text-muted-foreground">open = {{ open() }} · confirmed = {{ confirmed() }}</p>
  `,
})
export class AlertDialogPage {
  readonly open = signal(false);
  readonly confirmed = signal(0);
}

@Component({
  selector: 'app-context-menu-page',
  imports: [UI_CONTEXT_MENU],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Context Menu</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/context-menu.md</p>
    <div uiContextMenu class="contents">
      <div uiContextMenuTrigger class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm select-none" tabindex="0">
        Right click here
      </div>
      <div uiContextMenuContent class="w-52">
        <div uiContextMenuItem (select)="last.set('Back')">Back <span uiContextMenuShortcut>⌘[</span></div>
        <div uiContextMenuItem disabled>Forward <span uiContextMenuShortcut>⌘]</span></div>
        <div uiContextMenuItem (select)="last.set('Reload')">Reload <span uiContextMenuShortcut>⌘R</span></div>
        <div uiContextMenuSub>
          <div uiContextMenuSubTrigger>More Tools</div>
          <div uiContextMenuSubContent class="w-44">
            <div uiContextMenuItem (select)="last.set('Save Page')">Save Page…</div>
            <div uiContextMenuItem (select)="last.set('Developer Tools')">Developer Tools</div>
            <div uiContextMenuSeparator></div>
            <div uiContextMenuItem variant="destructive" (select)="last.set('Delete')">Delete</div>
          </div>
        </div>
        <div uiContextMenuSeparator></div>
        <div uiContextMenuCheckboxItem [(checked)]="bookmarks" (select)="$event.preventDefault()">Show Bookmarks</div>
        <div uiContextMenuCheckboxItem [(checked)]="urls">Show Full URLs</div>
        <div uiContextMenuSeparator></div>
        <div uiContextMenuLabel>People</div>
        <div uiContextMenuRadioGroup [(value)]="person">
          <div uiContextMenuRadioItem value="pedro" (select)="$event.preventDefault()">Pedro Duarte</div>
          <div uiContextMenuRadioItem value="colm" (select)="$event.preventDefault()">Colm Tuite</div>
        </div>
      </div>
    </div>
    <p class="mt-4 text-sm text-muted-foreground">last = {{ last() }} · bookmarks = {{ bookmarks() }} · urls = {{ urls() }} · person = {{ person() }}</p>
  `,
})
export class ContextMenuPage {
  readonly last = signal('-');
  readonly bookmarks = signal(true);
  readonly urls = signal(false);
  readonly person = signal<string | undefined>('pedro');
}

@Component({
  selector: 'app-menubar-page',
  imports: [UI_MENUBAR],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Menubar</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/menubar.md</p>
    <div uiMenubar class="w-72">
      <div uiMenubarMenu>
        <button uiMenubarTrigger>File</button>
        <div uiMenubarContent>
          <div uiMenubarItem (select)="last.set('New Tab')">New Tab <span uiMenubarShortcut>⌘T</span></div>
          <div uiMenubarItem (select)="last.set('New Window')">New Window <span uiMenubarShortcut>⌘N</span></div>
          <div uiMenubarItem disabled>New Incognito Window</div>
          <div uiMenubarSeparator></div>
          <div uiMenubarSub>
            <div uiMenubarSubTrigger>Share</div>
            <div uiMenubarSubContent>
              <div uiMenubarItem (select)="last.set('Email')">Email link</div>
              <div uiMenubarItem (select)="last.set('Messages')">Messages</div>
            </div>
          </div>
          <div uiMenubarSeparator></div>
          <div uiMenubarItem (select)="last.set('Print')">Print… <span uiMenubarShortcut>⌘P</span></div>
        </div>
      </div>
      <div uiMenubarMenu>
        <button uiMenubarTrigger>Edit</button>
        <div uiMenubarContent>
          <div uiMenubarItem (select)="last.set('Undo')">Undo <span uiMenubarShortcut>⌘Z</span></div>
          <div uiMenubarItem (select)="last.set('Redo')">Redo <span uiMenubarShortcut>⇧⌘Z</span></div>
        </div>
      </div>
      <div uiMenubarMenu>
        <button uiMenubarTrigger>View</button>
        <div uiMenubarContent>
          <div uiMenubarCheckboxItem [(checked)]="bookmarks" (select)="$event.preventDefault()">Always Show Bookmarks Bar</div>
          <div uiMenubarCheckboxItem [(checked)]="urls">Always Show Full URLs</div>
        </div>
      </div>
    </div>
    <p class="mt-4 text-sm text-muted-foreground">last = {{ last() }} · bookmarks = {{ bookmarks() }} · urls = {{ urls() }}</p>
  `,
})
export class MenubarPage {
  readonly last = signal('-');
  readonly bookmarks = signal(false);
  readonly urls = signal(true);
}

@Component({
  selector: 'app-drawer-page',
  imports: [UI_DRAWER, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Drawer</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/drawer.md · drag the drawer downwards to dismiss.</p>
    <div class="flex flex-wrap gap-2">
      @for (d of dirs; track d) {
        <div uiDrawer [direction]="d" class="contents">
          <button uiButton variant="outline" uiDrawerTrigger>{{ d }}</button>
          <div uiDrawerContent>
            <div class="mx-auto w-full max-w-sm">
              <div uiDrawerHeader>
                <h2 uiDrawerTitle>Move Goal</h2>
                <p uiDrawerDescription>Set your daily activity goal.</p>
              </div>
              <div class="p-4 text-center text-5xl font-bold tracking-tighter">350</div>
              <div uiDrawerFooter>
                <button uiButton uiDrawerClose>Submit</button>
                <button uiDrawerClose>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class DrawerPage {
  readonly dirs = ['bottom', 'top', 'left', 'right'] as const;
}

@Component({
  selector: 'app-hover-card-page',
  imports: [UI_HOVER_CARD, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Hover Card</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/hover-card.md</p>
    <div uiHoverCard class="contents">
      <button uiButton variant="link" uiHoverCardTrigger>&#64;nextjs</button>
      <div uiHoverCardContent class="w-64">
        <div class="flex flex-col gap-0.5">
          <h4 class="text-sm font-semibold">&#64;nextjs</h4>
          <p class="text-sm">The React Framework – created and maintained by &#64;vercel.</p>
          <p class="text-xs text-muted-foreground">Joined December 2021</p>
        </div>
      </div>
    </div>
  `,
})
export class HoverCardPage {}

@Component({
  selector: 'app-navigation-menu-page',
  imports: [UI_NAVIGATION_MENU],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Navigation Menu</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/navigation-menu.md</p>
    <div class="flex justify-center">
      <nav uiNavigationMenu>
        <ul uiNavigationMenuList>
          <li uiNavigationMenuItem>
            <button uiNavigationMenuTrigger>Getting started</button>
            <div uiNavigationMenuContent class="w-64">
              <a uiNavigationMenuLink href="#intro" class="flex-col items-start"><span class="text-sm font-medium">Introduction</span><span class="text-xs text-muted-foreground">Re-usable components.</span></a>
              <a uiNavigationMenuLink href="#install" class="flex-col items-start"><span class="text-sm font-medium">Installation</span><span class="text-xs text-muted-foreground">How to install.</span></a>
            </div>
          </li>
          <li uiNavigationMenuItem>
            <button uiNavigationMenuTrigger>Components</button>
            <div uiNavigationMenuContent class="w-64">
              <a uiNavigationMenuLink href="#alert" class="flex-col items-start"><span class="text-sm font-medium">Alert Dialog</span></a>
              <a uiNavigationMenuLink href="#hover" class="flex-col items-start"><span class="text-sm font-medium">Hover Card</span></a>
            </div>
          </li>
          <li uiNavigationMenuItem><a uiNavigationMenuLink href="#docs" [active]="true">Docs</a></li>
        </ul>
      </nav>
    </div>
  `,
})
export class NavigationMenuPage {}

@Component({
  selector: 'app-combobox-page',
  imports: [UI_COMBOBOX],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Combobox</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/combobox.md</p>
    <div uiCombobox [(value)]="value" class="contents">
      <button uiComboboxTrigger>
        <span uiComboboxValue placeholder="Select framework…"></span>
      </button>
      <div uiComboboxContent>
        <input uiComboboxInput placeholder="Search framework…" />
        <div uiComboboxList>
          <div uiComboboxEmpty>No framework found.</div>
          @for (f of frameworks; track f.v) {
            <div uiComboboxItem [value]="f.v" [disabled]="f.v === 'nuxt'">{{ f.l }}</div>
          }
        </div>
      </div>
    </div>
    <p class="mt-4 text-sm text-muted-foreground">value = "{{ value() }}"</p>
  `,
})
export class ComboboxPage {
  readonly value = signal('');
  readonly frameworks = [
    { v: 'next', l: 'Next.js' },
    { v: 'svelte', l: 'SvelteKit' },
    { v: 'nuxt', l: 'Nuxt.js (disabled)' },
    { v: 'remix', l: 'Remix' },
    { v: 'astro', l: 'Astro' },
  ];
}
