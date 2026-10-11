# Tabs — manual test checklist
Playground: Components → Tabs. First demo has a disabled "Settings" tab.

## Visual
- [ ] Default list. Expected: muted pill container, 32px high; active tab has background + subtle shadow. Result:
- [ ] Inactive tab hover. Expected: text becomes full foreground. Result:
- [ ] Disabled tab. Expected: 50% opacity, not selectable, skipped by arrows. Result:
- [ ] Line variant. Expected: transparent list; active tab shows a 2px underline bar. Result:
- [ ] Vertical. Expected: triggers stacked, active marker on the end side. Result:
- [ ] Panels. Expected: only the active panel is visible; others have `hidden`. Result:

## Keyboard (first demo)
- [ ] Tab from before the tabs. Expected: focus lands on the **selected** tab. Result:
- [ ] Tab again. Expected: focus goes to the active panel, not to the next tab. Result:
- [ ] Shift+Tab. Expected: back to the selected tab. Result:
- [ ] Right Arrow. Expected: next tab gets focus and becomes selected immediately. Result:
- [ ] Right Arrow at the last enabled tab. Expected: wraps to the first; disabled tab skipped. Result:
- [ ] Left Arrow. Expected: previous tab selected. Result:
- [ ] Home / End. Expected: first / last enabled tab selected. Result:
- [ ] Vertical demo: Down / Up. Expected: move between tabs; Left/Right do nothing. Result:
- [ ] Click a tab. Expected: selects on mouse down. Result:

## ARIA (DevTools)
- [ ] Selected trigger: `aria-selected="true"`, `tabindex="0"`, `data-state="active"`; others `-1` / `inactive`.
  Expected: as listed; `aria-controls` equals the panel id; panel `aria-labelledby` equals the trigger id.
  Result:

## Screen reader
- [ ] Focus a tab. Expected: "Overview, tab, selected, 1 of 4". Result:
- [ ] Arrow to another tab. Expected: announces the new tab as selected. Result:
- [ ] Tab into the panel. Expected: panel announced with its tab's name. Result:

## Dark mode / RTL
- [ ] Dark. Expected: active tab uses `input/30` bg with a border. Result:
- [ ] RTL (page toggle). Expected: tabs run right-to-left; **Left Arrow moves to the next tab, Right Arrow to the previous** (mirrored). Result:
