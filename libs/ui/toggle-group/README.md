# Toggle Group

```ts
import { UI_TOGGLE_GROUP } from '@loomui-ng/ui/toggle-group';
// add to the component `imports` array
```

```html
<div uiToggleGroup type="multiple" [(value)]="v">
  <button uiToggleGroupItem value="bold">B</button>
  <button uiToggleGroupItem value="italic">I</button>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-toggle-group type="multiple" [(value)]="v">
  <ui-toggle-group-item value="bold">B</ui-toggle-group-item>
  <ui-toggle-group-item value="italic">I</ui-toggle-group-item>
</ui-toggle-group>
```

| Input / output | Type / values | Default |
|---|---|---|
| `type` | `'single' \| 'multiple'` | `'single'` |
| `value` (model) | `string[]` | `[]` |
| `variant` | `'default' \| 'outline'` | `'default'` |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` |
| `spacing` |  | `0` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `disabled` |  | `false` |
| `disabledInput` |  | `false` |

Parts (selectors): `[uiToggleGroup], ui-toggle-group`, `button[uiToggleGroupItem], ui-toggle-group-item`.

Spec: `docs/behavior-specs/toggle-group.md` · Manual test: `docs/manual-tests/toggle-group.md`
