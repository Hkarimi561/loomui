# Sidebar — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/sidebar.json`: slots, tags, ARIA/data attributes, class strings). The only live evidence is the docs site's own (customised) sidebar, so the structure follows shadcn's published `sidebar.tsx` and the captured slot names/classes where they overlap.
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Composable app sidebar: provider, sidebar (side left/right; variant sidebar/floating/inset; collapsible offcanvas/icon/none), header/content/footer, groups, menus (buttons, actions, badges, sub-menus), rail, inset and trigger.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `sidebar-wrapper` | `div` | — |
| `sidebar` | `div` | — |
| `sidebar-content` | `div` | `data-sidebar=content data-docs-sidebar-content=""` |
| `sidebar-group` | `div` | `data-sidebar=group` |
| `sidebar-group-label` | `div` | `data-sidebar=group-label` |
| `sidebar-group-content` | `div` | `data-sidebar=group-content` |
| `sidebar-menu` | `ul` | `data-sidebar=menu` |
| `sidebar-menu-item` | `li` | `data-sidebar=menu-item` |
| `sidebar-menu-button` | `a` | `data-sidebar=menu-button data-size=default data-active=false\|true` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Provider exposes `open` (desktop) and `openMobile`, sets `--sidebar-width` (16rem) and `--sidebar-width-icon` (3rem).
- Below 768px the sidebar renders inside the Sheet; the trigger toggles it.
- Wrapper exposes `data-state`, `data-collapsible`, `data-variant`, `data-side`; descendants use `group-data-*` selectors for the icon-rail/offcanvas styling.
- Menu buttons set `data-active` / `aria-current="page"`; `tooltip` is applied as a native `title` while collapsed.

## Keyboard
| Keys | Result |
|---|---|
| Ctrl / Cmd + B | Toggles the sidebar (desktop collapse or mobile sheet). |
| Tab / Enter | Standard links/buttons; the rail is `tabindex="-1"`. |
| Esc (mobile sheet) | Closes the sheet. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- `side` is physical (left/right) as in shadcn, not auto-mirrored in RTL.
- Open state is not persisted in a cookie.
- Collapsed-icon tooltips use the native `title` attribute instead of the Tooltip component.
- Sub-menu collapsibles / mobile sheet close-on-navigate are left to the app.

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Exact live DOM for stock sidebar parts (only the docs-site variant was observable).
- Screen-reader output for collapsed icon mode.
- Verified in browser: desktop collapse via trigger and Ctrl+B, mobile sheet open at 375px.
