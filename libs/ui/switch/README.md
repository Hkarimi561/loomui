# uiSwitch

```ts
import { UiSwitch } from '@loomui/ui/switch';
// add to the component imports array
```

```html
<button uiSwitch [(checked)]="on"></button>
<button uiSwitch size="sm" [formControl]="ctrl"></button>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-switch [(checked)]="on"></ui-switch>
<ui-switch size="sm" [formControl]="ctrl"></ui-switch>
```

| Input | Values | Default |
|---|---|---|
| `checked` | model boolean | `false` |
| `size` | `default` `sm` | `default` |
| `disabled` / `invalid` | boolean | `false` |
| `class` | extra classes | - |

ControlValueAccessor + signal-forms compatible shape. RTL mirrors the thumb.

Spec: docs/behavior-specs/switch.md - Manual checks: docs/manual-tests/switch.md
