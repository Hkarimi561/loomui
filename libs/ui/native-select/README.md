# Native Select

```ts
import { UI_NATIVE_SELECT } from '@loomui-ng/ui/native-select';
// add to the component `imports` array
```

```html
<div uiNativeSelectWrapper>
  <select uiNativeSelect><option value="a">A</option></select>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-native-select><option value="a">A</option></ui-native-select>
```

| Input / output | Type / values | Default |
|---|---|---|
| `size` | `'default' \| 'sm'` | `'default'` |

Parts (selectors): `div[uiNativeSelectWrapper], ui-native-select-wrapper`, `ui-native-select`, `select[uiNativeSelect]`, `option[uiNativeSelectOption]`, `optgroup[uiNativeSelectOptgroup]`.

Spec: `docs/behavior-specs/native-select.md` · Manual test: `docs/manual-tests/native-select.md`
