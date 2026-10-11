# Hover Card

```ts
import { UI_HOVER_CARD } from '@loomui/ui/hover-card';
// add to the component `imports` array
```

```html
<div uiHoverCard>
  <a uiHoverCardTrigger href="#">&#64;nextjs</a>
  <div uiHoverCardContent>…</div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-hover-card>
  <ui-hover-card-trigger href="#">&#64;nextjs</ui-hover-card-trigger>
  <ui-hover-card-content>…</ui-hover-card-content>
</ui-hover-card>
```

| Input / output | Type / values | Default |
|---|---|---|
| `openDelay` |  | `700` |
| `closeDelay` |  | `300` |

Parts (selectors): `[uiHoverCard], ui-hover-card`, `[uiHoverCardTrigger], ui-hover-card-trigger`, `[uiHoverCardContent], ui-hover-card-content`.

Spec: `docs/behavior-specs/hover-card.md` · Manual test: `docs/manual-tests/hover-card.md`
