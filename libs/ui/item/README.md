# Item

```ts
import { UI_ITEM_GENERATED } from '@loomui-ng/ui/item';
// add to the component `imports` array
```

```html
<div uiItem variant="outline">
  <div uiItemMedia>…</div>
  <div uiItemContent><div uiItemTitle>Title</div><p uiItemDescription>Description</p></div>
  <div uiItemActions><button uiButton size="sm">Open</button></div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-item variant="outline">
  <ui-item-media>…</ui-item-media>
  <ui-item-content><ui-item-title>Title</ui-item-title><ui-item-description>Description</ui-item-description></ui-item-content>
  <ui-item-actions><ui-button size="sm">Open</ui-button></ui-item-actions>
</ui-item>
```

| Input / output | Type / values | Default |
|---|---|---|
| `variant` | `'default' \| 'outline' \| 'muted'` | `'default'` |
| `size` | `'default' \| 'sm' \| 'xs'` | `'default'` |

Parts (selectors): `[uiItem], ui-item`, `[uiItemContent], ui-item-content`, `[uiItemTitle], ui-item-title`, `[uiItemDescription], ui-item-description`, `[uiItemActions], ui-item-actions`, `[uiItemMedia], ui-item-media`, `[uiItemGroup], ui-item-group`, `[uiItemHeader], ui-item-header`.

Spec: `docs/behavior-specs/item.md` · Manual test: `docs/manual-tests/item.md`
