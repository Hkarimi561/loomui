# uiTabs

```ts
import { UI_TABS } from '@loomui/ui/tabs';
// add to the component imports array
```

```html
<div uiTabs [(value)]="tab">
  <div uiTabsList variant="line">
    <button uiTabsTrigger value="a">A</button>
    <button uiTabsTrigger value="b" disabled>B</button>
  </div>
  <div uiTabsContent value="a">…</div>
  <div uiTabsContent value="b">…</div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-tabs [(value)]="tab">
  <ui-tabs-list variant="line">
    <ui-tabs-trigger value="a">A</ui-tabs-trigger>
    <ui-tabs-trigger value="b" disabled>B</ui-tabs-trigger>
  </ui-tabs-list>
  <ui-tabs-content value="a">…</ui-tabs-content>
  <ui-tabs-content value="b">…</ui-tabs-content>
</ui-tabs>
```

| Input | Values | Default |
|---|---|---|
| `value` (uiTabs) | model string | - |
| `orientation` | `horizontal` `vertical` | `horizontal` |
| `activationMode` | `automatic` `manual` | `automatic` |
| `dir` | `ltr` `rtl` | inherited |
| `variant` (uiTabsList) | `default` `line` | `default` |

Uses CDK FocusKeyManager. Needs data-active/data-horizontal/data-vertical custom variants.

Spec: docs/behavior-specs/tabs.md - Manual checks: docs/manual-tests/tabs.md
