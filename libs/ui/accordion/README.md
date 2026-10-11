# Accordion

```ts
import { UI_ACCORDION } from '@loomui-ng/ui/accordion';
// add to the component `imports` array
```

```html
<div uiAccordion type="single" [collapsible]="true">
  <div uiAccordionItem value="a">
    <button uiAccordionTrigger>Is it accessible?</button>
    <div uiAccordionContent>Yes.</div>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-accordion type="single" [collapsible]="true">
  <ui-accordion-item value="a">
    <ui-accordion-trigger>Is it accessible?</ui-accordion-trigger>
    <ui-accordion-content>Yes.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>
```

| Input / output | Type / values | Default |
|---|---|---|
| `type` | `'single' \| 'multiple'` | `'single'` |
| `collapsible` |  | `true` |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` |
| `value` (model) | `string[]` | `[]` |
| `disabled` |  | `false` |

Parts (selectors): `[uiAccordion], ui-accordion`, `[uiAccordionItem], ui-accordion-item`, `button[uiAccordionTrigger], ui-accordion-trigger`, `[uiAccordionContent], ui-accordion-content`.

Spec: `docs/behavior-specs/accordion.md` · Manual test: `docs/manual-tests/accordion.md`
