# Progress

```ts
import { UI_PROGRESS } from '@loomui-ng/ui/progress';
// add to the component `imports` array
```

```html
<div uiProgress [value]="60"></div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-progress [value]="60"></ui-progress>
```

| Input / output | Type / values | Default |
|---|---|---|
| `value` | `number \| null, unknown` | `null` |
| `max` |  | `100` |

Parts (selectors): `div[uiProgress], ui-progress`.

Spec: `docs/behavior-specs/progress.md` · Manual test: `docs/manual-tests/progress.md`
