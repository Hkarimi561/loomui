# Textarea

```ts
import { UI_TEXTAREA } from '@loomui-ng/ui/textarea';
// add to the component `imports` array
```

```html
<textarea uiTextarea placeholder="Type here"></textarea>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-textarea placeholder="Type here"></ui-textarea>
```

| Input / output | Type / values | Default |
|---|---|---|
| `rows` | `number \| string \| null` | `null` |
| `cols` | `number \| string \| null` | `null` |
| `maxlength` | `number \| null` | `null` |
| `minlength` | `number \| null` | `null` |
| `wrap` | `string` | `''` |

Parts (selectors): `ui-textarea`, `textarea[uiTextarea]`.

Spec: `docs/behavior-specs/textarea.md` · Manual test: `docs/manual-tests/textarea.md`
