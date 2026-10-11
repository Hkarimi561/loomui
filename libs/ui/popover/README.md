# uiPopover

```ts
import { UI_POPOVER } from '@loomui/ui/popover';
// add to the component imports array
```

```html
<div uiPopover class="contents">
  <button uiButton uiPopoverTrigger>Open</button>
  <div uiPopoverContent side="bottom" align="center">
    <div uiPopoverHeader><div uiPopoverTitle>Title</div><p uiPopoverDescription>Text</p></div>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-popover class="contents">
  <ui-button uiPopoverTrigger>Open</ui-button>
  <ui-popover-content side="bottom" align="center">
    <ui-popover-header><ui-popover-title>Title</ui-popover-title><ui-popover-description>Text</ui-popover-description></ui-popover-header>
  </ui-popover-content>
</ui-popover>
```

| Input | Values | Default |
|---|---|---|
| `open` (uiPopover) | model boolean | `false` |
| `side` | `top` `right` `bottom` `left` | `bottom` |
| `align` | `start` `center` `end` | `center` |
| `sideOffset` | px | `4` |

Non-modal. Focus moves into the content; Esc and outside click close and return focus to the trigger.

Spec: docs/behavior-specs/popover.md - Manual checks: docs/manual-tests/popover.md
