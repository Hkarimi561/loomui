# Icon (Lucide)

Lucide icons as an Angular component (`<ui-icon>`) and as a directive on a real `<svg>` (`<svg uiIcon>`). The `lucide` package is a peer dependency; import only the icons you use and they tree-shake.

```ts
import { Search } from 'lucide';
import { UiIcon } from '@loomui-ng/ui/icon';   // or: npx @loomui-ng/cli add icon
```

```html
<!-- by node (preferred: tree-shakeable) -->
<ui-icon [icon]="Search" />                 <!-- 16px (size-4), shadcn's default -->
<ui-icon [icon]="Search" [size]="24" [strokeWidth]="1.5" />
<ui-icon [icon]="Search" class="size-6 text-primary" />

<!-- on a real <svg>: keeps parent selectors such as [&>svg]:size-4 and has-[>svg] working -->
<svg uiIcon [icon]="Search" class="size-5"></svg>

<!-- by name, after registering -->
<ui-icon name="search" />
```

```ts
import { Search, Moon } from 'lucide';
import { registerIcons } from '@loomui-ng/ui/icon';

registerIcons({ Search, Moon });   // PascalCase or kebab-case keys
```

| Input | Type | Default |
|---|---|---|
| `icon` | Lucide icon node | – |
| `name` / `uiIcon` | registered icon name (kebab or Pascal) | – |
| `size` | number (px) | `16` via `size-4` |
| `strokeWidth` | number | `2` |
| `absoluteStrokeWidth` | boolean — keeps the stroke the same pixel width at any size | `false` |
| `color` | any CSS color | `currentColor` |
| `label` | accessible name; without it the icon is `aria-hidden` | – |

The icons used by the Loom UI components themselves (chevrons, check, x, …) are registered automatically (`LIB_ICONS`). Helpers: `iconToSvg(node, { size, strokeWidth, color })`, `iconChildren(node)`, `toKebab`, `toPascal`.

Browse and copy all 1,877 icons in the showcase: **/icons**. Manual checklist: `docs/manual-tests/icons.md`.
