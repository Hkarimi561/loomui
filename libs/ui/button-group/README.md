# Button Group

```ts
import { UI_BUTTON_GROUP_GENERATED } from '@loomui/ui/button-group';
// add to the component `imports` array
```

```html
<div uiButtonGroup>
  <button uiButton variant="outline">Left</button>
  <button uiButton variant="outline">Right</button>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-button-group>
  <ui-button variant="outline">Left</ui-button>
  <ui-button variant="outline">Right</ui-button>
</ui-button-group>
```

| Input / output | Type / values | Default |
|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |

Parts (selectors): `[uiButtonGroup], ui-button-group`, `[uiButtonGroupSeparator], ui-button-group-separator`.

Spec: `docs/behavior-specs/button-group.md` · Manual test: `docs/manual-tests/button-group.md`
