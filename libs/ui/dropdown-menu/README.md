# uiDropdownMenu

```ts
import { UI_DROPDOWN_MENU } from '@loomui-ng/ui/dropdown-menu';
// add to the component imports array
```

```html
<div uiDropdownMenu class="contents">
  <button uiButton variant="outline" uiDropdownMenuTrigger>Open</button>
  <div uiDropdownMenuContent class="w-56">
    <div uiDropdownMenuLabel>My Account</div>
    <div uiDropdownMenuItem (select)="go()">Profile <span uiDropdownMenuShortcut>Ctrl+P</span></div>
    <div uiDropdownMenuCheckboxItem [(checked)]="bar">Status Bar</div>
    <div uiDropdownMenuSeparator></div>
    <div uiDropdownMenuItem variant="destructive">Log out</div>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-dropdown-menu class="contents">
  <ui-button variant="outline" uiDropdownMenuTrigger>Open</ui-button>
  <ui-dropdown-menu-content class="w-56">
    <ui-dropdown-menu-label>My Account</ui-dropdown-menu-label>
    <ui-dropdown-menu-item (select)="go()">Profile <ui-dropdown-menu-shortcut>Ctrl+P</ui-dropdown-menu-shortcut></ui-dropdown-menu-item>
    <ui-dropdown-menu-checkbox-item [(checked)]="bar">Status Bar</ui-dropdown-menu-checkbox-item>
    <ui-dropdown-menu-separator></ui-dropdown-menu-separator>
    <ui-dropdown-menu-item variant="destructive">Log out</ui-dropdown-menu-item>
  </ui-dropdown-menu-content>
</ui-dropdown-menu>
```

| Input | Values | Default |
|---|---|---|
| `open` (uiDropdownMenu) | model boolean | `false` |
| `variant` (item) | `default` `destructive` | `default` |
| `checked` (checkbox item) | model boolean | `false` |
| `value` (radio group / item) | model string | - |
| `(select)` | event with `preventDefault()` | - |

Not implemented: sub-menus, context menu. Parts: Item, CheckboxItem, RadioGroup, RadioItem, Label, Separator, Shortcut, Group.

Spec: docs/behavior-specs/dropdown-menu.md - Manual checks: docs/manual-tests/dropdown-menu.md
