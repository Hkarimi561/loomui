# Message

```ts
import { UI_MESSAGE_GENERATED } from '@loomui-ng/ui/message';
// add to the component `imports` array
```

```html
<div uiMessageGroup>
  <div uiMessage>
    <div uiMessageContent><div uiMessageHeader>Assistant</div><div uiBubble>…</div><div uiMessageFooter>10:42</div></div>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-message-group>
  <ui-message>
    <ui-message-content><ui-message-header>Assistant</ui-message-header><ui-bubble>…</ui-bubble><ui-message-footer>10:42</ui-message-footer></ui-message-content>
  </ui-message>
</ui-message-group>
```

| Input / output | Type / values | Default |
|---|---|---|
| `align` | `'end' \| 'start'` | `'start'` |

Parts (selectors): `[uiMessage], ui-message`, `[uiMessageAvatar], ui-message-avatar`, `[uiMessageContent], ui-message-content`, `[uiMessageFooter], ui-message-footer`, `[uiMessageGroup], ui-message-group`, `[uiMessageHeader], ui-message-header`.

Spec: `docs/behavior-specs/message.md` · Manual test: `docs/manual-tests/message.md`
