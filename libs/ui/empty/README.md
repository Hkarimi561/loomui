# Empty

```ts
import { UI_EMPTY_GENERATED } from '@loomui-ng/ui/empty';
// add to the component `imports` array
```

```html
<div uiEmpty>
  <div uiEmptyHeader>
    <div uiEmptyIcon>…</div>
    <div uiEmptyTitle>No projects</div>
    <p uiEmptyDescription>Create one to get started.</p>
  </div>
  <div uiEmptyContent><button uiButton>New project</button></div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-empty>
  <ui-empty-header>
    <ui-empty-icon>…</ui-empty-icon>
    <ui-empty-title>No projects</ui-empty-title>
    <ui-empty-description>Create one to get started.</ui-empty-description>
  </ui-empty-header>
  <ui-empty-content><ui-button>New project</ui-button></ui-empty-content>
</ui-empty>
```

| Input / output | Type / values | Default |
|---|---|---|
| `variant` | `'icon' \| 'default'` | `'default'` |

Parts (selectors): `[uiEmpty], ui-empty`, `[uiEmptyHeader], ui-empty-header`, `[uiEmptyIcon], ui-empty-icon`, `[uiEmptyTitle], ui-empty-title`, `[uiEmptyDescription], ui-empty-description`, `[uiEmptyContent], ui-empty-content`.

Spec: `docs/behavior-specs/empty.md` · Manual test: `docs/manual-tests/empty.md`
