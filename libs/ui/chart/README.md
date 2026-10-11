# Chart

```ts
import { UI_CHART } from '@loomui/ui/chart';
// add to the component `imports` array
```

```html
<ui-chart type="bar" [data]="rows" xKey="month" [config]="config" class="h-64 w-full" label="Visitors" />
```

| Input / output | Type / values | Default |
|---|---|---|
| `type` | `ChartType` | `'bar'` |
| `data` | `Record<string, unknown>[]` | required |
| `xKey` | `string` | required |
| `valueKey` | `string` | `''` |
| `config` | `ChartConfig` | required |
| `options` | `Record<string, any>` | `{}` |
| `showLegend` |  | `true` |
| `label` |  | `'Chart'` |

Parts (selectors): `ui-chart`.

Spec: `docs/behavior-specs/chart.md` · Manual test: `docs/manual-tests/chart.md`
