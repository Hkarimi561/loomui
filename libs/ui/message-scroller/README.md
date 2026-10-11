# Message Scroller

```ts
import { UI_MESSAGE_SCROLLER } from '@loomui/ui/message-scroller';
// add to the component `imports` array
```

```html
<div uiMessageScroller class="h-80">
  <div uiMessageScrollerViewport>
    <div uiMessageScrollerContent>
      <div uiMessageScrollerItem messageId="m1">…</div>
    </div>
  </div>
  <button uiMessageScrollerButton aria-label="Scroll to latest"></button>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-message-scroller class="h-80">
  <ui-message-scroller-viewport>
    <ui-message-scroller-content>
      <ui-message-scroller-item messageId="m1">…</ui-message-scroller-item>
    </ui-message-scroller-content>
  </ui-message-scroller-viewport>
  <ui-message-scroller-button aria-label="Scroll to latest"></ui-message-scroller-button>
</ui-message-scroller>
```

| Input / output | Type / values | Default |
|---|---|---|
| `busy` |  | `false` |
| `messageId` | `string` | `''` |
| `scrollAnchor` |  | `false` |

Parts (selectors): `div[uiMessageScroller], ui-message-scroller`, `[uiMessageScrollerViewport], ui-message-scroller-viewport`, `[uiMessageScrollerContent], ui-message-scroller-content`, `[uiMessageScrollerItem], ui-message-scroller-item`, `button[uiMessageScrollerButton], ui-message-scroller-button`.

Spec: `docs/behavior-specs/message-scroller.md` · Manual test: `docs/manual-tests/message-scroller.md`
