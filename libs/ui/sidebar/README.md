# Sidebar

```ts
import { UI_SIDEBAR } from '@loomui/ui/sidebar';
// add to the component `imports` array
```

```html
<div uiSidebarProvider>
  <aside uiSidebar collapsible="icon">
    <div uiSidebarContent>
      <div uiSidebarGroup>
        <div uiSidebarGroupLabel>Platform</div>
        <ul uiSidebarMenu>
          <li uiSidebarMenuItem><a uiSidebarMenuButton [isActive]="true" href="#">Home</a></li>
        </ul>
      </div>
    </div>
    <button uiSidebarRail></button>
  </aside>
  <main uiSidebarInset><button uiSidebarTrigger></button>…</main>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-sidebar-provider>
  <ui-sidebar collapsible="icon">
    <ui-sidebar-content>
      <ui-sidebar-group>
        <ui-sidebar-group-label>Platform</ui-sidebar-group-label>
        <ui-sidebar-menu>
          <ui-sidebar-menu-item><ui-sidebar-menu-button [isActive]="true" href="#">Home</ui-sidebar-menu-button></ui-sidebar-menu-item>
        </ui-sidebar-menu>
      </ui-sidebar-group>
    </ui-sidebar-content>
    <ui-sidebar-rail></ui-sidebar-rail>
  </ui-sidebar>
  <ui-sidebar-inset><ui-sidebar-trigger></ui-sidebar-trigger>…</ui-sidebar-inset>
</ui-sidebar-provider>
```

| Input / output | Type / values | Default |
|---|---|---|
| `open` (model) |  | `true` |
| `openMobile` (model) |  | `false` |
| `width` |  | `'16rem'` |
| `shortcut` |  | `'b'` |
| `side` | `'left' \| 'right'` | `'left'` |
| `variant` | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'` |
| `collapsible` | `'offcanvas' \| 'icon' \| 'none'` | `'offcanvas'` |
| `disabled` |  | `false` |
| `isActive` |  | `false` |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` |
| `tooltip` | `string` | `''` |

Parts (selectors): `[uiSidebarProvider], ui-sidebar-provider`, `[uiSidebar], ui-sidebar`, `button[uiSidebarTrigger], ui-sidebar-trigger`, `button[uiSidebarRail], ui-sidebar-rail`, `[uiSidebarInset], ui-sidebar-inset`, `[uiSidebarHeader], ui-sidebar-header`, `[uiSidebarFooter], ui-sidebar-footer`, `[uiSidebarContent], ui-sidebar-content`, `[uiSidebarSeparator], ui-sidebar-separator`, `[uiSidebarGroup], ui-sidebar-group`, `[uiSidebarGroupLabel], ui-sidebar-group-label`, `button[uiSidebarGroupAction], ui-sidebar-group-action`, `[uiSidebarGroupContent], ui-sidebar-group-content`, `ul[uiSidebarMenu], ui-sidebar-menu`, `li[uiSidebarMenuItem], ui-sidebar-menu-item`, `button[uiSidebarMenuAction], ui-sidebar-menu-action`, `[uiSidebarMenuBadge], ui-sidebar-menu-badge`, `ul[uiSidebarMenuSub], ui-sidebar-menu-sub`, `li[uiSidebarMenuSubItem], ui-sidebar-menu-sub-item`, `button[uiSidebarMenuButton], a[uiSidebarMenuButton], ui-sidebar-menu-button`, `a[uiSidebarMenuSubButton], button[uiSidebarMenuSubButton], ui-sidebar-menu-sub-button`.

Requires the `--sidebar-*` tokens (see the playground `styles.css`). Spec: `docs/behavior-specs/sidebar.md` · Manual test: `docs/manual-tests/sidebar.md`
