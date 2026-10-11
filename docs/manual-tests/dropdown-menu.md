# Dropdown Menu — manual test checklist
Playground: Components → Dropdown Menu. Spec: docs/behavior-specs/dropdown-menu.md.
Items: Profile, Billing, Settings (disabled), Status Bar (checkbox), Panel (checkbox), Top/Bottom/Right (radio), Log out (destructive).

## Visual
- [ ] Open with a mouse click. Expected: 224px menu under the trigger, start-aligned; rounded-lg, shadow + ring; labels small and muted; separators between groups. Result:
- [ ] Hover items. Expected: hovered item gets the accent background; disabled item is dimmed and does not highlight. Result:
- [ ] Checked items and radio. Expected: check mark on the end side for checked Status Bar and selected "Bottom". Result:
- [ ] "Log out". Expected: red text; red-tinted background when highlighted. Result:
- [ ] Open/close animation. Expected: fade + zoom ~100ms. Result:

## Keyboard
- [ ] Trigger focused, press Enter / Space / Down Arrow. Expected: menu opens, first **enabled** item (Profile) is highlighted and focused. Result:
- [ ] Trigger focused, press Up Arrow. Expected: opens with the **last** item (Log out) focused. Result:
- [ ] Down / Up. Expected: move one item; disabled "Settings" is skipped; no wrap at the ends (UNKNOWN on original). Result:
- [ ] Home / End. Expected: first / last enabled item. Result:
- [ ] Type "l" then "o". Expected: typeahead jumps to "Log out". Result:
- [ ] Tab. Expected: nothing — focus stays in the menu. Result:
- [ ] Enter on "Profile". Expected: menu closes, "Last: Profile" updates below, focus returns to the trigger. Result:
- [ ] Enter / Space on "Status Bar" (it calls `preventDefault`). Expected: toggles and the menu stays open. Result:
- [ ] Enter on "Panel" (no preventDefault). Expected: toggles and the menu closes. Result:
- [ ] Radio items. Expected: selecting moves the check mark; menu stays open (preventDefault in the demo). Result:
- [ ] Escape. Expected: closes; focus returns to the trigger. Result:
- [ ] Click outside. Expected: closes. Result:

## ARIA (DevTools)
- [ ] Open menu. Expected: `role="menu"`, `aria-labelledby` = trigger id, `aria-orientation="vertical"`; items `role=menuitem|menuitemcheckbox|menuitemradio` with `aria-checked`; disabled items `aria-disabled="true"` + `data-disabled`; trigger `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`. Result:

## Screen reader
- [ ] Open the menu. Expected: "menu" announced, first item read with position (e.g. "Profile, menu item, 1 of 9"). Result:
- [ ] Checkbox item. Expected: "Status Bar, menu item checkbox, checked". Result:

## Dark mode / RTL
- [ ] Dark. Expected: popover colors; accent highlight readable. Result:
- [ ] RTL. Expected: menu aligns to the start (right) edge; check marks and shortcuts on the left (end side). (Arrow-key mirroring does not apply to a vertical menu.) Result:
