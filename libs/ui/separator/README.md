# uiSeparator

```ts
import { UiSeparator } from '@loomui-ng/ui/separator';
// add to the component imports array
```

```html
<div uiSeparator></div>
<div uiSeparator orientation="vertical"></div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-separator></ui-separator>
<ui-separator orientation="vertical"></ui-separator>
```

| Input | Values | Default |
|---|---|---|
| `orientation` | `horizontal` `vertical` | `horizontal` |
| `decorative` | boolean | `true` (role=none) |
| `class` | extra classes | - |

decorative=false gives role=separator.

Spec: docs/behavior-specs/separator.md - Manual checks: docs/manual-tests/separator.md
