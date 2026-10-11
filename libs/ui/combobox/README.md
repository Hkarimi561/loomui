# Combobox

```ts
import { UI_COMBOBOX } from '@loomui/ui/combobox';
// add to the component `imports` array
```

```html
<div uiCombobox [(value)]="fw" class="contents">
  <button uiComboboxTrigger><span uiComboboxValue placeholder="Select framework…"></span></button>
  <div uiComboboxContent>
    <input uiComboboxInput placeholder="Search…" />
    <div uiComboboxList>
      <div uiComboboxEmpty>No results.</div>
      <div uiComboboxItem value="next">Next.js</div>
    </div>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-combobox [(value)]="fw" class="contents">
  <ui-combobox-trigger><ui-combobox-value placeholder="Select framework…"></ui-combobox-value></ui-combobox-trigger>
  <ui-combobox-content>
    <ui-combobox-input placeholder="Search…" />
    <ui-combobox-list>
      <ui-combobox-empty>No results.</ui-combobox-empty>
      <ui-combobox-item value="next">Next.js</ui-combobox-item>
    </ui-combobox-list>
  </ui-combobox-content>
</ui-combobox>
```

| Input / output | Type / values | Default |
|---|---|---|
| `value` (model) | `string` | `''` |
| `disabled` |  | `false` |
| `placeholder` |  | `''` |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` |
| `disabledInput` |  | `false` |
| `ariaLabel` | `string` | `''` |

Parts (selectors): `[uiCombobox], ui-combobox`, `button[uiComboboxTrigger], ui-combobox-trigger`, `[uiComboboxValue], ui-combobox-value`, `[uiComboboxContent], ui-combobox-content`, `input[uiComboboxInput]`, `[uiComboboxList], ui-combobox-list`, `[uiComboboxEmpty], ui-combobox-empty`, `[uiComboboxItem], ui-combobox-item`, `ui-combobox-input`.

Spec: `docs/behavior-specs/combobox.md` · Manual test: `docs/manual-tests/combobox.md`
