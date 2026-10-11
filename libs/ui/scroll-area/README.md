# Scroll Area

```ts
import { UI_SCROLL_AREA } from '@loomui-ng/ui/scroll-area';
// add to the component `imports` array
```

```html
<div uiScrollArea class="h-48 w-64">
  <div uiScrollAreaViewport>…long content…</div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-scroll-area class="h-48 w-64">
  <ui-scroll-area-viewport>…long content…</ui-scroll-area-viewport>
</ui-scroll-area>
```


Parts (selectors): `[uiScrollArea], ui-scroll-area`, `[uiScrollAreaViewport], ui-scroll-area-viewport`.

Spec: `docs/behavior-specs/scroll-area.md` · Manual test: `docs/manual-tests/scroll-area.md`
