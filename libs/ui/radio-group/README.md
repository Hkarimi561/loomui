# Radio Group

```ts
import { UI_RADIO_GROUP } from '@loomui/ui/radio-group';
// add to the component `imports` array
```

```html
<div uiRadioGroup [(value)]="plan">
  <button uiRadioGroupItem value="a" id="a"></button><label uiLabel for="a">A</label>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-radio-group [(value)]="plan">
  <ui-radio-group-item value="a" id="a"></ui-radio-group-item><ui-label for="a">A</ui-label>
</ui-radio-group>
```

| Input / output | Type / values | Default |
|---|---|---|
| `value` (model) | `string` | `''` |
| `required` |  | `false` |
| `disabled` |  | `false` |
| `orientation` | `'vertical' \| 'horizontal' \| undefined` | `undefined` |
| `disabledInput` |  | `false` |
| `invalid` |  | `false` |

Parts (selectors): `[uiRadioGroup], ui-radio-group`, `button[uiRadioGroupItem], ui-radio-group-item`.

Spec: `docs/behavior-specs/radio-group.md` · Manual test: `docs/manual-tests/radio-group.md`
