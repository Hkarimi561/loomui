# Kbd

```ts
import { UI_KBD_GENERATED } from '@loomui/ui/kbd';
// add to the component `imports` array
```

```html
<kbd uiKbdGroup><kbd uiKbd>Ctrl</kbd><kbd uiKbd>K</kbd></kbd>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-kbd-group><ui-kbd>Ctrl</ui-kbd><ui-kbd>K</ui-kbd></ui-kbd-group>
```


Parts (selectors): `kbd[uiKbd], ui-kbd`, `kbd[uiKbdGroup], ui-kbd-group`.

Spec: `docs/behavior-specs/kbd.md` · Manual test: `docs/manual-tests/kbd.md`
