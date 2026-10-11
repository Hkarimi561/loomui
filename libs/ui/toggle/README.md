# Toggle

```ts
import { UI_TOGGLE } from '@loomui-ng/ui/toggle';
// add to the component `imports` array
```

```html
<button uiToggle [(pressed)]="bold" aria-label="Bold">B</button>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-toggle [(pressed)]="bold" aria-label="Bold">B</ui-toggle>
```

| Input / output | Type / values | Default |
|---|---|---|
| `pressed` (model) |  | `false` |
| `variant` | `NonNullable<ToggleVariants['variant']>` | `'default'` |
| `size` | `NonNullable<ToggleVariants['size']>` | `'default'` |
| `disabled` |  | `false` |

Parts (selectors): `button[uiToggle], ui-toggle`.

Spec: `docs/behavior-specs/toggle.md` · Manual test: `docs/manual-tests/toggle.md`
