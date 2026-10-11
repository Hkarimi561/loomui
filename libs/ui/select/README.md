# uiSelect

```ts
import { UI_SELECT } from '@loomui-ng/ui/select';
// add to the component imports array
```

```html
<div uiSelect [(value)]="fruit" class="contents">
  <button uiSelectTrigger class="w-[180px]"><span uiSelectValue placeholder="Select a fruit"></span></button>
  <div uiSelectContent>
    <div uiSelectGroup>
      <div uiSelectLabel>Fruits</div>
      <div uiSelectItem value="apple">Apple</div>
      <div uiSelectItem value="grapes" disabled>Grapes</div>
    </div>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-select [(value)]="fruit" class="contents">
  <ui-select-trigger class="w-[180px]"><ui-select-value placeholder="Select a fruit"></ui-select-value></ui-select-trigger>
  <ui-select-content>
    <ui-select-group>
      <ui-select-label>Fruits</ui-select-label>
      <ui-select-item value="apple">Apple</ui-select-item>
      <ui-select-item value="grapes" disabled>Grapes</ui-select-item>
    </ui-select-group>
  </ui-select-content>
</ui-select>
```

| Input | Values | Default |
|---|---|---|
| `value` | model string | `''` |
| `disabled` / `invalid` | boolean | `false` |
| `size` (trigger) | `default` `sm` | `default` |
| `placeholder` (uiSelectValue) | string | `''` |

Also works with ngModel / reactive forms (ControlValueAccessor). Always wrap items in uiSelectGroup (it supplies the padding, like shadcn). Opens below the trigger (no item-aligned mode).

Spec: docs/behavior-specs/select.md - Manual checks: docs/manual-tests/select.md
