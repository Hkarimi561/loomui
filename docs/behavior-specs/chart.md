# Chart — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/chart.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Charts with shadcn's `ChartConfig` contract (label + color per series; `--color-<key>` variables), implemented with Chart.js instead of Recharts: bar, line, pie/doughnut, radar, etc.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `chart` | `div` | `data-chart=chart-_R_4g7aanpfknqbr6lb_\|chart-_R_dibaanpfknqbr6lb_\|chart-_R_6inaanpfknqbr6lb_\|chart-_R_6j3aanpfknqbr6lb_` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- The host sets `--color-<key>` CSS variables from `config`; colors are resolved to canvas colors and re-resolved when the `class` on `<html>` changes (dark mode).
- Tooltip is Chart.js' with shadcn-like colors; legend is HTML under the canvas.

## Keyboard
No keyboard interaction beyond native browser behavior.

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- **Large deviation:** the original wraps Recharts (SVG, composable `<Bar>`/`<XAxis>` children, `ChartTooltipContent` props). Chart.js renders to canvas with a data-driven API, so markup, tooltip DOM and keyboard/AT access differ.
- Canvas charts are not accessible by default; only `role="img"` + `aria-label` is provided.

## Angular notes
`ui-chart`: `type`, `data` (row objects), `xKey`, `valueKey` (pie/doughnut), `config`, `options` (Chart.js options merged last), `showLegend`, `label`.

## UNKNOWN
- Recharts-specific features (brush, stacked tooltips, ChartTooltipContent indicators).
- Original DOM was captured from demos only; Chart.js output cannot match SVG DOM.
