# uiBadge

```ts
import { UiBadge } from '@loomui/ui/badge';
// add to the component imports array
```

```html
<span uiBadge>New</span>
<span uiBadge variant="secondary">Beta</span>
<a uiBadge variant="outline" href="/changelog">v1.2</a>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-badge>New</ui-badge>
<ui-badge variant="secondary">Beta</ui-badge>
<ui-badge variant="outline" href="/changelog">v1.2</ui-badge>
```

| Input | Values | Default |
|---|---|---|
| `variant` | `default` `secondary` `destructive` `outline` `ghost` | `default` |
| `class` | extra classes (tailwind-merge) | - |

Deviation: ps-/pe- instead of pl-/pr-.

Spec: docs/behavior-specs/badge.md - Manual checks: docs/manual-tests/badge.md
