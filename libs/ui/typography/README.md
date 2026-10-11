# Typography

```ts
import { UI_TYPOGRAPHY } from '@loomui/ui/typography';
// add to the component `imports` array
```

```html
<h1 uiTypography="h1">Title</h1>
<p uiTypography="lead">Intro</p>
<code uiTypography="code">npm i</code>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-typography variant="h1">Title</ui-typography>
<ui-typography variant="lead">Intro</ui-typography>
<ui-typography variant="code">npm i</ui-typography>
```

| Input / output | Type / values | Default |
|---|---|---|
| `attrVariant` | `TypographyVariant \| ''` | `''` |
| `elVariant` | `TypographyVariant \| ''` | `''` |

Parts (selectors): `[uiTypography], ui-typography`.

Spec: `docs/behavior-specs/typography.md` · Manual test: `docs/manual-tests/typography.md`
