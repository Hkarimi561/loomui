# uiCard

```ts
import { UI_CARD } from '@loomui/ui/card';
// add to the component imports array
```

```html
<div uiCard size="sm">
  <div uiCardHeader>
    <div uiCardTitle>Title</div>
    <div uiCardDescription>Description</div>
    <div uiCardAction><button uiButton variant="link">Action</button></div>
  </div>
  <div uiCardContent>…</div>
  <div uiCardFooter>…</div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-card size="sm">
  <ui-card-header>
    <ui-card-title>Title</ui-card-title>
    <ui-card-description>Description</ui-card-description>
    <ui-card-action><ui-button variant="link">Action</ui-button></ui-card-action>
  </ui-card-header>
  <ui-card-content>…</ui-card-content>
  <ui-card-footer>…</ui-card-footer>
</ui-card>
```

| Input | Values | Default |
|---|---|---|
| `size` (uiCard) | `default` `sm` | `default` |
| `class` | extra classes (all parts) | - |

Parts: uiCard, uiCardHeader, uiCardTitle, uiCardDescription, uiCardAction, uiCardContent, uiCardFooter.

Spec: docs/behavior-specs/card.md - Manual checks: docs/manual-tests/card.md
