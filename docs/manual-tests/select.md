# Select — manual test checklist
Playground: Components → Select (a fruit select with a disabled option, and a small "Theme" select bound to a reactive form control).

## Visual
- [ ] Closed, empty. Expected: 180px outline-style trigger, muted placeholder "Select a fruit", chevron at the end; height 32px (28px for `size="sm"`). Result:
- [ ] Open. Expected: list below the trigger, at least as wide as the trigger; "Fruits" label, items with the check mark on the end for the selected one; shadow + ring. Result:
- [ ] Hover items. Expected: hovered item gets the accent background; disabled "Grapes" is dimmed and not highlightable. Result:
- [ ] After choosing "Blueberry". Expected: trigger shows "Blueberry" in normal text color (no placeholder style). Result:
- [ ] Reactive-form select on load. Expected: shows "Dark" before ever being opened. Result:
- [ ] Original uses item-aligned positioning (list overlaps the trigger); ours opens below. Expected: below the trigger (known deviation). Result:

## Keyboard
- [ ] Tab to the trigger. Expected: focus ring. Result:
- [ ] Enter / Space / Down / Up. Expected: opens; focus goes to the first option (or the selected one when re-opening). Result:
- [ ] Down / Up. Expected: moves, skipping the disabled option. Result:
- [ ] Home / End. Expected: first / last enabled option. Result:
- [ ] Type "p". Expected: jumps to "Pineapple". Result:
- [ ] Enter on an option. Expected: selects, closes, focus returns to the trigger, `value = …` text updates. Result:
- [ ] Escape. Expected: closes without changing the value, focus returns to the trigger. Result:
- [ ] Tab while open. Expected: no focus change. Result:
- [ ] Click outside. Expected: closes. Result:

## ARIA (DevTools)
- [ ] Expected: trigger `role="combobox"`, `aria-expanded`, `aria-controls` = listbox id, `data-state`, `data-placeholder` only while empty; listbox `role="listbox"`; options `role="option"` + `aria-selected`; group `role="group"`. Result:

## Screen reader
- [ ] Focus the trigger. Expected: "Select a fruit, combo box, collapsed". Result:
- [ ] Open and arrow. Expected: each option read with "selected" on the chosen one. Result:

## Dark mode / RTL
- [ ] Dark. Expected: trigger `input/30` background; list popover colors. Result:
- [ ] RTL. Expected: chevron on the left, check marks on the left (end side), text right-aligned. Result:
