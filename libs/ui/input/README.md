# uiInput

```ts
import { UiInput } from '@loomui-ng/ui/input';
// add to the component imports array
```

```html
<input uiInput placeholder="Email" [formControl]="email" />
<input uiInput [(ngModel)]="name" aria-invalid="true" />
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-input placeholder="Email" [formControl]="email" />
<ui-input [(ngModel)]="name" aria-invalid="true" />
```

| Input | Values | Default |
|---|---|---|
| `class` | extra classes (tailwind-merge) | - |

Native input: ngModel, reactive forms and signal forms work unchanged.

Spec: docs/behavior-specs/input.md - Manual checks: docs/manual-tests/input.md
