# Date Picker

```ts
import { UiDatePicker } from '@loomui/ui/date-picker';
// add to the component `imports` array
```

```html
<ui-date-picker [(value)]="date" placeholder="Pick a date" />
<ui-date-picker [formControl]="ctrl" />
```

| Input / output | Type / values | Default |
|---|---|---|
| `value` (model) | `Date \| null` | `null` |
| `placeholder` |  | `'Pick a date'` |
| `locale` | `string \| undefined` | `undefined` |
| `disabled` |  | `false` |
| `invalid` |  | `false` |

Parts (selectors): `ui-date-picker`.

Spec: `docs/behavior-specs/date-picker.md` · Manual test: `docs/manual-tests/date-picker.md`
