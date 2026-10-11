# Alert

```ts
import { UI_ALERT_GENERATED } from '@loomui-ng/ui/alert';
// add to the component `imports` array
```

```html
<div uiAlert variant="destructive">
  <svg …></svg>
  <div uiAlertTitle>Error</div>
  <div uiAlertDescription>Your session expired.</div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-alert variant="destructive">
  <svg …></svg>
  <ui-alert-title>Error</ui-alert-title>
  <ui-alert-description>Your session expired.</ui-alert-description>
</ui-alert>
```

| Input / output | Type / values | Default |
|---|---|---|
| `variant` | `'default' \| 'destructive'` | `'default'` |

Parts (selectors): `[uiAlert], ui-alert`, `[uiAlertTitle], ui-alert-title`, `[uiAlertDescription], ui-alert-description`, `[uiAlertAction], ui-alert-action`.

Spec: `docs/behavior-specs/alert.md` · Manual test: `docs/manual-tests/alert.md`
