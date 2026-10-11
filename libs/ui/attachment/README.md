# Attachment

```ts
import { UI_ATTACHMENT } from '@loomui/ui/attachment';
// add to the component `imports` array
```

```html
<div uiAttachmentGroup>
  <div uiAttachment>
    <a uiAttachmentTrigger href="/files/a.png" aria-label="Open a.png"></a>
    <div uiAttachmentContent><span uiAttachmentTitle>a.png</span><span uiAttachmentDescription>24 KB</span></div>
    <button uiAttachmentAction aria-label="Remove a.png">×</button>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-attachment-group>
  <ui-attachment>
    <ui-attachment-trigger href="/files/a.png" aria-label="Open a.png"></ui-attachment-trigger>
    <ui-attachment-content><ui-attachment-title>a.png</ui-attachment-title><ui-attachment-description>24 KB</ui-attachment-description></ui-attachment-content>
    <ui-attachment-action aria-label="Remove a.png">×</ui-attachment-action>
  </ui-attachment>
</ui-attachment-group>
```

| Input / output | Type / values | Default |
|---|---|---|
| `disabled` |  | `false` |
| `state` | `'idle' \| 'uploading' \| 'processing' \| 'done'` | `'done'` |
| `size` | `'default' \| 'sm' \| 'xs'` | `'default'` |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` |
| `variant` | `'image' \| 'icon'` | `'icon'` |

Parts (selectors): `a[uiAttachmentTrigger], button[uiAttachmentTrigger], ui-attachment-trigger`, `button[uiAttachmentAction], ui-attachment-action`, `[uiAttachmentGroup], ui-attachment-group`, `[uiAttachment], ui-attachment`, `[uiAttachmentMedia], ui-attachment-media`, `[uiAttachmentContent], ui-attachment-content`, `span[uiAttachmentTitle], ui-attachment-title`, `span[uiAttachmentDescription], ui-attachment-description`, `[uiAttachmentActions], ui-attachment-actions`.

Spec: `docs/behavior-specs/attachment.md` · Manual test: `docs/manual-tests/attachment.md`
