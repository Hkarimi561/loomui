# Drawer

```ts
import { UI_DRAWER } from '@loomui/ui/drawer';
// add to the component `imports` array
```

```html
<div uiDrawer>
  <button uiButton uiDrawerTrigger>Open</button>
  <div uiDrawerContent>
    <div uiDrawerHeader><h2 uiDrawerTitle>Move goal</h2></div>
    <div uiDrawerFooter><button uiDrawerClose>Cancel</button></div>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-drawer>
  <ui-button uiDrawerTrigger>Open</ui-button>
  <ui-drawer-content>
    <ui-drawer-header><ui-drawer-title>Move goal</ui-drawer-title></ui-drawer-header>
    <ui-drawer-footer><ui-drawer-close>Cancel</ui-drawer-close></ui-drawer-footer>
  </ui-drawer-content>
</ui-drawer>
```

| Input / output | Type / values | Default |
|---|---|---|
| `direction` | `Direction` | `'bottom'` |
| `disabled` |  | `false` |

Parts (selectors): `[uiDrawer], ui-drawer`, `[uiDrawerTrigger], ui-drawer-trigger`, `[uiDrawerContent], ui-drawer-content`, `[uiDrawerHeader], ui-drawer-header`, `[uiDrawerFooter], ui-drawer-footer`, `[uiDrawerTitle], ui-drawer-title`, `[uiDrawerDescription], ui-drawer-description`, `button[uiDrawerClose], ui-drawer-close`.

Spec: `docs/behavior-specs/drawer.md` · Manual test: `docs/manual-tests/drawer.md`
