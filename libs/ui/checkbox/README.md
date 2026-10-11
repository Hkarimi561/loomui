# uiCheckbox

```ts
import { UiCheckbox } from '@loomui-ng/ui/checkbox';
// add to the component imports array
```

```html
<button uiCheckbox [(checked)]="accepted"></button>
<button uiCheckbox [formControl]="ctrl"></button>
<button uiCheckbox [indeterminate]="true"></button>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-checkbox [(checked)]="accepted"></ui-checkbox>
<ui-checkbox [formControl]="ctrl"></ui-checkbox>
<ui-checkbox [indeterminate]="true"></ui-checkbox>
```

| Input | Values | Default |
|---|---|---|
| `checked` | model boolean | `false` |
| `indeterminate` | model boolean | `false` |
| `disabled` / `invalid` | boolean | `false` |
| `class` | extra classes | - |

Space toggles, Enter does not. ControlValueAccessor + signal-forms compatible shape. Needs the data-checked custom variants from the playground styles.css.

Spec: docs/behavior-specs/checkbox.md - Manual checks: docs/manual-tests/checkbox.md
