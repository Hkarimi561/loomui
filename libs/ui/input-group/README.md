# Input Group

```ts
import { UI_INPUT_GROUP } from '@loomui-ng/ui/input-group';
// add to the component `imports` array
```

```html
<div uiInputGroup>
  <div uiInputGroupAddon>https://</div>
  <input uiInputGroupControl placeholder="example.com" />
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-input-group>
  <ui-input-group-addon>https://</ui-input-group-addon>
  <ui-input-group-control placeholder="example.com" />
</ui-input-group>
```

| Input / output | Type / values | Default |
|---|---|---|
| `type` | `string` | `'text'` |
| `min` | `string \| number \| null` | `null` |
| `max` | `string \| number \| null` | `null` |
| `step` | `string \| number \| null` | `null` |
| `pattern` | `string` | `''` |
| `maxlength` | `number \| null` | `null` |
| `minlength` | `number \| null` | `null` |
| `accept` | `string` | `''` |
| `inputmode` | `string` | `''` |
| `multiple` |  | `false` |
| `align` | `'inline-start' \| 'inline-end' \| 'block-start' \| 'block-end'` | `'inline-start'` |

Parts (selectors): `ui-input-group-control`, `[uiInputGroup], ui-input-group`, `input[uiInputGroupControl]`, `[uiInputGroupAddon], ui-input-group-addon`.

Spec: `docs/behavior-specs/input-group.md` · Manual test: `docs/manual-tests/input-group.md`
