# Context Menu

```ts
import { UI_CONTEXT_MENU } from '@loomui-ng/ui/context-menu';
// add to the component `imports` array
```

```html
<div uiContextMenu>
  <div uiContextMenuTrigger class="h-32 w-64 border">Right click</div>
  <div uiContextMenuContent><div uiContextMenuItem>Back</div></div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-context-menu>
  <ui-context-menu-trigger class="h-32 w-64 border">Right click</ui-context-menu-trigger>
  <ui-context-menu-content><ui-context-menu-item>Back</ui-context-menu-item></ui-context-menu-content>
</ui-context-menu>
```

| Input / output | Type / values | Default |
|---|---|---|
| `side` | `Side` | `'right'` |
| `align` | `Align` | `'start'` |
| `sideOffset` |  | `2` |
| `variant` | `'default' \| 'destructive'` | `'default'` |
| `inset` |  | `false` |
| `checked` (model) |  | `false` |
| `value` (model) | `string \| undefined` | `undefined` |

Parts (selectors): `[uiContextMenu], ui-context-menu`, `[uiContextMenuTrigger], ui-context-menu-trigger`, `[uiContextMenuContent], ui-context-menu-content`, `[uiContextMenuItem], ui-context-menu-item`, `[uiContextMenuCheckboxItem], ui-context-menu-checkbox-item`, `[uiContextMenuRadioGroup], ui-context-menu-radio-group`, `[uiContextMenuRadioItem], ui-context-menu-radio-item`, `[uiContextMenuSub], ui-context-menu-sub`, `[uiContextMenuSubTrigger], ui-context-menu-sub-trigger`, `[uiContextMenuSubContent], ui-context-menu-sub-content`, `[uiContextMenuLabel], ui-context-menu-label`, `[uiContextMenuSeparator], ui-context-menu-separator`, `[uiContextMenuShortcut], ui-context-menu-shortcut`, `[uiContextMenuGroup], ui-context-menu-group`.

Spec: `docs/behavior-specs/context-menu.md` · Manual test: `docs/manual-tests/context-menu.md`
