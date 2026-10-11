# Marker

```ts
import { UI_MARKER_GENERATED } from '@loomui/ui/marker';
// add to the component `imports` array
```

```html
<div uiMarker variant="separator"><span uiMarkerContent>New messages</span></div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-marker variant="separator"><ui-marker-content>New messages</ui-marker-content></ui-marker>
```

| Input / output | Type / values | Default |
|---|---|---|
| `variant` | `'default' \| 'separator' \| 'border'` | `'default'` |

Parts (selectors): `[uiMarker], ui-marker`, `span[uiMarkerIcon], ui-marker-icon`, `span[uiMarkerContent], ui-marker-content`.

Spec: `docs/behavior-specs/marker.md` · Manual test: `docs/manual-tests/marker.md`
