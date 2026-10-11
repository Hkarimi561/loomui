# Aspect Ratio

```ts
import { UI_ASPECT_RATIO } from '@loomui/ui/aspect-ratio';
// add to the component `imports` array
```

```html
<div uiAspectRatio [ratio]="16 / 9" class="rounded-lg bg-muted">…</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-aspect-ratio [ratio]="16 / 9" class="rounded-lg bg-muted">…</ui-aspect-ratio>
```

| Input / output | Type / values | Default |
|---|---|---|
| `ratio` |  | `1` |

Parts (selectors): `[uiAspectRatio], ui-aspect-ratio`.

Spec: `docs/behavior-specs/aspect-ratio.md` · Manual test: `docs/manual-tests/aspect-ratio.md`
