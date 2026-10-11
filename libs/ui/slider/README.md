# Slider

```ts
import { UI_SLIDER } from '@loomui/ui/slider';
// add to the component `imports` array
```

```html
<span uiSlider [(value)]="v" [min]="0" [max]="100" [step]="5"></span>  <!-- v: number[], e.g. [25] -->
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-slider [(value)]="v" [min]="0" [max]="100" [step]="5"></ui-slider>  <!-- v: number[], e.g. [25] -->
```

| Input / output | Type / values | Default |
|---|---|---|
| `value` (model) | `number[]` | `[0]` |
| `min` |  | `0` |
| `max` |  | `100` |
| `step` |  | `1` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `disabled` |  | `false` |

Parts (selectors): `span[uiSlider], ui-slider`.

Spec: `docs/behavior-specs/slider.md` · Manual test: `docs/manual-tests/slider.md`
