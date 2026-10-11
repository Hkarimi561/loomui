# Calendar

```ts
import { UI_CALENDAR } from '@loomui-ng/ui/calendar';
// add to the component `imports` array
```

```html
<div uiCalendar mode="single" [(selected)]="date" class="rounded-lg border"></div>
<div uiCalendar mode="range" [(selected)]="range" [numberOfMonths]="2"></div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-calendar mode="single" [(selected)]="date" class="rounded-lg border"></ui-calendar>
<ui-calendar mode="range" [(selected)]="range" [numberOfMonths]="2"></ui-calendar>
```

| Input / output | Type / values | Default |
|---|---|---|
| `mode` | `'single' \| 'multiple' \| 'range'` | `'single'` |
| `selected` (model) | `CalendarSelection` | `undefined` |
| `month` (model) | `Date` | `startOfDay(new Date(` |
| `numberOfMonths` |  | `1` |
| `showOutsideDays` |  | `true` |
| `weekStartsOn` |  | `0` |
| `locale` | `string` | `typeof document !== 'undefined' ? document.documentElement.lang \|\| 'en-US' : 'en-US'` |
| `minDate` | `Date \| undefined` | `undefined` |
| `maxDate` | `Date \| undefined` | `undefined` |
| `required` |  | `false` |

Parts (selectors): `div[uiCalendar], ui-calendar`.

Spec: `docs/behavior-specs/calendar.md` · Manual test: `docs/manual-tests/calendar.md`
