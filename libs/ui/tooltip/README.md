# uiTooltip

```ts
import { UI_TOOLTIP } from '@loomui/ui/tooltip';
// add to the component imports array
```

```html
<div uiTooltip [delay]="0" class="contents">
  <button uiButton uiTooltipTrigger>Hover</button>
  <div uiTooltipContent side="top">Add to library</div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-tooltip [delay]="0" class="contents">
  <ui-button uiTooltipTrigger>Hover</ui-button>
  <ui-tooltip-content side="top">Add to library</ui-tooltip-content>
</ui-tooltip>
```

| Input | Values | Default |
|---|---|---|
| `delay` (uiTooltip) | ms | `0` |
| `side` / `align` / `sideOffset` | as Popover | `top`-less: `bottom` |

Opens on hover (delayed-open) and keyboard focus (instant-open); a visually hidden role=tooltip copy is referenced by aria-describedby.

Spec: docs/behavior-specs/tooltip.md - Manual checks: docs/manual-tests/tooltip.md
