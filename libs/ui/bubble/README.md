# Bubble

```ts
import { UI_BUBBLE_GENERATED } from '@loomui/ui/bubble';
// add to the component `imports` array
```

```html
<div uiBubbleGroup>
  <div uiBubble variant="muted"><div uiBubbleContent>Hello!</div></div>
  <div uiBubble align="end"><div uiBubbleContent>Hi.</div></div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-bubble-group>
  <ui-bubble variant="muted"><ui-bubble-content>Hello!</ui-bubble-content></ui-bubble>
  <ui-bubble align="end"><ui-bubble-content>Hi.</ui-bubble-content></ui-bubble>
</ui-bubble-group>
```

| Input / output | Type / values | Default |
|---|---|---|
| `variant` | `'default' \| 'muted' \| 'secondary' \| 'tinted' \| 'outline' \| 'destructive' \| 'ghost'` | `'default'` |
| `align` | `'end' \| 'start'` | `'start'` |
| `side` | `'bottom' \| 'top'` | `'bottom'` |

Parts (selectors): `[uiBubble], ui-bubble`, `[uiBubbleContent], ui-bubble-content`, `[uiBubbleGroup], ui-bubble-group`, `[uiBubbleReactions], ui-bubble-reactions`.

Spec: `docs/behavior-specs/bubble.md` · Manual test: `docs/manual-tests/bubble.md`
