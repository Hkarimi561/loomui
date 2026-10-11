# Collapsible

```ts
import { UI_COLLAPSIBLE } from '@loomui/ui/collapsible';
// add to the component `imports` array
```

```html
<div uiCollapsible [(open)]="open">
  <button uiCollapsibleTrigger>Toggle</button>
  <div uiCollapsibleContent>…</div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-collapsible [(open)]="open">
  <ui-collapsible-trigger>Toggle</ui-collapsible-trigger>
  <ui-collapsible-content>…</ui-collapsible-content>
</ui-collapsible>
```

| Input / output | Type / values | Default |
|---|---|---|
| `open` (model) |  | `false` |
| `disabled` |  | `false` |

Parts (selectors): `[uiCollapsible], ui-collapsible`, `[uiCollapsibleTrigger], ui-collapsible-trigger`, `[uiCollapsibleContent], ui-collapsible-content`.

Spec: `docs/behavior-specs/collapsible.md` · Manual test: `docs/manual-tests/collapsible.md`
