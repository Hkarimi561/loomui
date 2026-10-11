# Navigation Menu

```ts
import { UI_NAVIGATION_MENU } from '@loomui/ui/navigation-menu';
// add to the component `imports` array
```

```html
<nav uiNavigationMenu>
  <ul uiNavigationMenuList>
    <li uiNavigationMenuItem>
      <button uiNavigationMenuTrigger>Getting started</button>
      <div uiNavigationMenuContent>…</div>
    </li>
  </ul>
</nav>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-navigation-menu>
  <ui-navigation-menu-list>
    <ui-navigation-menu-item>
      <ui-navigation-menu-trigger>Getting started</ui-navigation-menu-trigger>
      <ui-navigation-menu-content>…</ui-navigation-menu-content>
    </ui-navigation-menu-item>
  </ui-navigation-menu-list>
</ui-navigation-menu>
```

| Input / output | Type / values | Default |
|---|---|---|
| `delay` |  | `200` |
| `active` |  | `false` |

Parts (selectors): `nav[uiNavigationMenu], ui-navigation-menu`, `ul[uiNavigationMenuList], ui-navigation-menu-list`, `li[uiNavigationMenuItem], ui-navigation-menu-item`, `button[uiNavigationMenuTrigger], ui-navigation-menu-trigger`, `[uiNavigationMenuContent], ui-navigation-menu-content`, `a[uiNavigationMenuLink], ui-navigation-menu-link`.

Spec: `docs/behavior-specs/navigation-menu.md` · Manual test: `docs/manual-tests/navigation-menu.md`
