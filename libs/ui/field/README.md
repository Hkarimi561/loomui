# Field

```ts
import { UI_FIELD } from '@loomui-ng/ui/field';
// add to the component `imports` array
```

```html
<fieldset uiFieldSet>
  <legend uiFieldLegend>Profile</legend>
  <div uiFieldGroup>
    <div uiField>
      <label uiFieldLabel for="n">Name</label>
      <input uiInput id="n" />
      <p uiFieldDescription>Public display name.</p>
    </div>
  </div>
</fieldset>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-field-set>
  <ui-field-legend>Profile</ui-field-legend>
  <ui-field-group>
    <ui-field>
      <ui-field-label for="n">Name</ui-field-label>
      <ui-input id="n" />
      <ui-field-description>Public display name.</ui-field-description>
    </ui-field>
  </ui-field-group>
</ui-field-set>
```

| Input / output | Type / values | Default |
|---|---|---|
| `variant` | `'legend' \| 'label'` | `'legend'` |
| `orientation` | `'vertical' \| 'horizontal' \| 'responsive'` | `'vertical'` |

Parts (selectors): `[uiFieldSeparator], ui-field-separator`, `[uiFieldError], ui-field-error`, `[uiFieldGroup], ui-field-group`, `fieldset[uiFieldSet], ui-field-set`, `legend[uiFieldLegend], ui-field-legend`, `[uiFieldDescription], ui-field-description`, `[uiField], ui-field`, `label[uiFieldLabel], ui-field-label`, `[uiFieldContent], ui-field-content`.

Spec: `docs/behavior-specs/field.md` · Manual test: `docs/manual-tests/field.md`
