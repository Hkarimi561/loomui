# Resizable

```ts
import { UI_RESIZABLE } from '@loomui/ui/resizable';
// add to the component `imports` array
```

```html
<div uiResizablePanelGroup direction="horizontal" class="h-40 rounded-lg border">
  <div uiResizablePanel [defaultSize]="50">A</div>
  <div uiResizableHandle [withHandle]="true"></div>
  <div uiResizablePanel [defaultSize]="50">B</div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-resizable-panel-group direction="horizontal" class="h-40 rounded-lg border">
  <ui-resizable-panel [defaultSize]="50">A</ui-resizable-panel>
  <ui-resizable-handle [withHandle]="true"></ui-resizable-handle>
  <ui-resizable-panel [defaultSize]="50">B</ui-resizable-panel>
</ui-resizable-panel-group>
```

| Input / output | Type / values | Default |
|---|---|---|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `defaultSize` | `number \| undefined, unknown` | `undefined` |
| `minSize` |  | `0` |
| `maxSize` |  | `100` |
| `withHandle` |  | `false` |
| `keyboardStep` |  | `10` |

Parts (selectors): `[uiResizablePanelGroup], ui-resizable-panel-group`, `[uiResizablePanel], ui-resizable-panel`, `[uiResizableHandle], ui-resizable-handle`.

Spec: `docs/behavior-specs/resizable.md` · Manual test: `docs/manual-tests/resizable.md`
