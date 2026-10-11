# Menubar

```ts
import { UI_MENUBAR } from '@loomui/ui/menubar';
// add to the component `imports` array
```

```html
<div uiMenubar>
  <div uiMenubarMenu>
    <button uiMenubarTrigger>File</button>
    <div uiMenubarContent><div uiMenubarItem>New</div></div>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-menubar>
  <ui-menubar-menu>
    <ui-menubar-trigger>File</ui-menubar-trigger>
    <ui-menubar-content><ui-menubar-item>New</ui-menubar-item></ui-menubar-content>
  </ui-menubar-menu>
</ui-menubar>
```

| Input / output | Type / values | Default |
|---|---|---|
| `align` | `Align` | `'start'` |
| `sideOffset` |  | `8` |
| `variant` | `'default' \| 'destructive'` | `'default'` |
| `inset` |  | `false` |
| `checked` (model) |  | `false` |
| `value` (model) | `string \| undefined` | `undefined` |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |

Parts (selectors): `[uiMenubar], ui-menubar`, `[uiMenubarMenu], ui-menubar-menu`, `[uiMenubarTrigger], ui-menubar-trigger`, `[uiMenubarContent], ui-menubar-content`, `[uiMenubarItem], ui-menubar-item`, `[uiMenubarCheckboxItem], ui-menubar-checkbox-item`, `[uiMenubarRadioGroup], ui-menubar-radio-group`, `[uiMenubarRadioItem], ui-menubar-radio-item`, `[uiMenubarSub], ui-menubar-sub`, `[uiMenubarSubTrigger], ui-menubar-sub-trigger`, `[uiMenubarSubContent], ui-menubar-sub-content`, `[uiMenubarLabel], ui-menubar-label`, `[uiMenubarSeparator], ui-menubar-separator`, `[uiMenubarShortcut], ui-menubar-shortcut`, `[uiMenubarGroup], ui-menubar-group`.

Spec: `docs/behavior-specs/menubar.md` · Manual test: `docs/manual-tests/menubar.md`
