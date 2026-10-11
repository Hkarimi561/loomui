# Alert Dialog

```ts
import { UI_ALERT_DIALOG } from '@loomui/ui/alert-dialog';
// add to the component `imports` array
```

```html
<div uiAlertDialog>
  <button uiButton uiAlertDialogTrigger>Delete</button>
  <div uiAlertDialogContent>
    <div uiAlertDialogHeader><h2 uiAlertDialogTitle>Are you sure?</h2><p uiAlertDialogDescription>This cannot be undone.</p></div>
    <div uiAlertDialogFooter><button uiAlertDialogCancel>Cancel</button><button uiAlertDialogAction>Continue</button></div>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-alert-dialog>
  <ui-button uiAlertDialogTrigger>Delete</ui-button>
  <ui-alert-dialog-content>
    <ui-alert-dialog-header><ui-alert-dialog-title>Are you sure?</ui-alert-dialog-title><ui-alert-dialog-description>This cannot be undone.</ui-alert-dialog-description></ui-alert-dialog-header>
    <ui-alert-dialog-footer><ui-alert-dialog-cancel>Cancel</ui-alert-dialog-cancel><ui-alert-dialog-action>Continue</ui-alert-dialog-action></ui-alert-dialog-footer>
  </ui-alert-dialog-content>
</ui-alert-dialog>
```

| Input / output | Type / values | Default |
|---|---|---|
| `size` | `'default' \| 'sm'` | `'default'` |
| `disabled` |  | `false` |

Parts (selectors): `[uiAlertDialog], ui-alert-dialog`, `[uiAlertDialogTrigger], ui-alert-dialog-trigger`, `[uiAlertDialogContent], ui-alert-dialog-content`, `[uiAlertDialogHeader], ui-alert-dialog-header`, `[uiAlertDialogFooter], ui-alert-dialog-footer`, `[uiAlertDialogTitle], ui-alert-dialog-title`, `[uiAlertDialogDescription], ui-alert-dialog-description`, `button[uiAlertDialogCancel], ui-alert-dialog-cancel`, `button[uiAlertDialogAction], ui-alert-dialog-action`.

Spec: `docs/behavior-specs/alert-dialog.md` · Manual test: `docs/manual-tests/alert-dialog.md`
