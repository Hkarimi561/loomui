# uiSheet

```ts
import { UI_SHEET } from '@loomui/ui/sheet';
// add to the component imports array
```

```html
<div uiSheet class="contents">
  <button uiButton uiSheetTrigger>Open</button>
  <div uiSheetContent side="right">
    <div uiSheetHeader><h2 uiSheetTitle>Title</h2><p uiSheetDescription>Description</p></div>
    <div uiSheetFooter><button uiButton uiSheetClose>Close</button></div>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-sheet class="contents">
  <ui-button uiSheetTrigger>Open</ui-button>
  <ui-sheet-content side="right">
    <ui-sheet-header><ui-sheet-title>Title</ui-sheet-title><ui-sheet-description>Description</ui-sheet-description></ui-sheet-header>
    <ui-sheet-footer><ui-button uiSheetClose>Close</ui-button></ui-sheet-footer>
  </ui-sheet-content>
</ui-sheet>
```

| Input | Values | Default |
|---|---|---|
| `open` (uiSheet) | model boolean | `false` |
| `side` (uiSheetContent) | `top` `right` `bottom` `left` | `right` |
| `showCloseButton` | boolean | `true` |

Same engine as Dialog (shared UiModalRoot).

Spec: docs/behavior-specs/sheet.md - Manual checks: docs/manual-tests/sheet.md
