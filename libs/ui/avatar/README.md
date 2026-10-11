# Avatar

```ts
import { UI_AVATAR } from '@loomui/ui/avatar';
// add to the component `imports` array
```

```html
<span uiAvatar>
  <img uiAvatarImage src="/me.png" alt="Me" />
  <span uiAvatarFallback>CN</span>
</span>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-avatar>
  <ui-avatar-image src="/me.png" alt="Me" />
  <ui-avatar-fallback>CN</ui-avatar-fallback>
</ui-avatar>
```

| Input / output | Type / values | Default |
|---|---|---|
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` |
| `src` | `string` | `''` |
| `alt` | `string` | `''` |
| `srcset` | `string` | `''` |
| `sizes` | `string` | `''` |

Parts (selectors): `[uiAvatar], ui-avatar`, `img[uiAvatarImage]`, `[uiAvatarFallback], ui-avatar-fallback`, `ui-avatar-image`, `[uiAvatarBadge], ui-avatar-badge`, `[uiAvatarGroup], ui-avatar-group`, `[uiAvatarGroupCount], ui-avatar-group-count`.

Spec: `docs/behavior-specs/avatar.md` · Manual test: `docs/manual-tests/avatar.md`
