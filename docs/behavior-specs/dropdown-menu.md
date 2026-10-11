# Dropdown Menu — behavior spec

Evidence: **[REA-DOM]** DOM of `…/radix/dropdown-menu` with a demo menu open (content, group, label, checkbox items incl. disabled) and the site's own "page actions" menu (older class generation, `role="menuitem"` links). **[LIVE]** built-in browser real keys, with the caveat below. **[OUR-BUILD]** playground, real key presses. Not done: source cross-check, sub-menus, radio items on the original, RTL.

## Structure [REA-DOM]
```
trigger: <button data-slot="dropdown-menu-trigger" id="<tid>" aria-haspopup="menu" aria-expanded="true|false" data-state="open|closed" [aria-controls="<cid>" only while open]>
content: <div role="menu" id="<cid>" aria-labelledby="<tid>" aria-orientation="vertical" data-orientation="vertical" data-side="bottom" data-align="start" data-state="open"
          data-radix-menu-content dir="ltr" tabindex="-1" data-slot="dropdown-menu-content" style="--radix-dropdown-menu-content-transform-origin…, -available-height…, -trigger-width…">
  group: <div role="group" data-slot="dropdown-menu-group">
  label: <div data-slot="dropdown-menu-label" class="px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7">
  item:  role="menuitem" tabindex="-1" data-slot="dropdown-menu-item" data-variant="default|destructive" data-orientation="vertical" data-radix-collection-item
  check: role="menuitemcheckbox" aria-checked data-state="checked|unchecked" [aria-disabled="true" data-disabled=""] tabindex="-1"
```
Content classes (demo): `z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 …` + width utility (`w-40`/`w-48`). Default align in demos: `start`, side `bottom`.
Checkbox item: `relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground … data-disabled:opacity-50`.
**UNKNOWN: exact new-style class strings for plain `menuitem`, radio item, separator, shortcut** (only checkbox items and the older-generation site menu were captured); reconstructed from those.

## Keyboard
Observed live on the original (harness caveat: Radix applies focus on animation frames and the pane is throttled, so results lagged one step; final state read after waiting):
| Action | Result |
|---|---|
| Enter on trigger | opens; first **enabled** item gets focus and `data-highlighted`; the content element itself is not focused [LIVE] |
| Typeahead / Down | highlight moved to "Panel" (skipping the disabled "Activity Bar") [LIVE, delayed read] |
| Tab inside open menu | menu stays open, focus does not leave [LIVE] |
| Escape | **inconclusive on the original** (menu still open after ~2.5 s in the throttled pane); UNKNOWN |
| `body` while open | `data-scroll-locked="1"` [LIVE] |

Our build (verified with real keys in the playground): Enter on trigger opens + focuses first item (aria `role=menu`, `data-side=bottom`, `data-align=start`, `aria-labelledby` = trigger id); Down/Up skip disabled; Home/End; Tab blocked; Enter on an item runs `select` and closes unless `preventDefault()`; typeahead; Escape closes and returns focus to the trigger.
Up Arrow on the trigger opens with the **last** item focused (Radix behavior; not exercised). Wrap-around: none (UNKNOWN on original).

## Not implemented
Sub-menus (`Sub`, `SubTrigger`, `SubContent`), `modal={false}`, `loop`, right-click ContextMenu, scroll buttons. Radio group/radio item are implemented but were **not** observed on the original.

## UNKNOWN
Escape and arrow behavior on the original (harness limits); wrap-around; radio item markup; sub-menu markup; RTL arrow mirroring; screen-reader output.
