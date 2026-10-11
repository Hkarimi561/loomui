# Command — manual test checklist
Playground: Components → Command. Items: Calendar, Search Emoji, Calculator (disabled); Profile, Billing, Settings.

## Visual
- [ ] Initial. Expected: rounded bordered panel with a search field, two groups ("Suggestions", "Settings") with small muted headings and a separator; first item highlighted. Result:
- [ ] Hover items. Expected: the hovered item becomes the highlighted one (muted background). Result:
- [ ] Disabled item. Expected: dimmed, cannot be highlighted or activated. Result:
- [ ] Shortcuts. Expected: pushed to the end edge, small and letter-spaced; text brightens on the highlighted row. Result:

## Typing / filtering (keep focus in the input)
- [ ] Type "bil". Expected: only "Billing" remains; the "Suggestions" group and the separator disappear; Billing is highlighted. Result:
- [ ] Type more until nothing matches ("bilzzz"). Expected: "No results found." appears. Result:
- [ ] Clear the field. Expected: everything returns; first item highlighted again. Result:
- [ ] Case. Type "CAL". Expected: matches "Calendar" and "Calculator" (disabled one still not selectable). Result:

## Keyboard
- [ ] Down / Up. Expected: highlight moves; disabled "Calculator" is skipped; wraps at the ends (UNKNOWN on original). Result:
- [ ] Home / End. Expected: first / last enabled item. Result:
- [ ] Ctrl+N / Ctrl+P (and Ctrl+J / Ctrl+K). Expected: same as Down / Up. Result:
- [ ] Enter. Expected: "Selected: <item>" updates below. Result:
- [ ] Focus never leaves the input while navigating. Expected: the caret stays in the field. Result:
- [ ] Click an item. Expected: "Selected: …" updates. Result:

## ARIA (DevTools)
- [ ] Expected: input `role="combobox"`, `aria-controls` = list id, `aria-activedescendant` = highlighted item id; list `role="listbox"`; items `role="option"` with `aria-selected`; disabled item `aria-disabled="true"`. Result:

## Screen reader
- [ ] Arrow through items. Expected: each option announced as it becomes active, with "selected". Result:
- [ ] Filter to nothing. Expected: "No results found." is available to read (not announced live: UNKNOWN on original). Result:

## Dark mode / RTL
- [ ] Dark. Expected: popover colors; muted highlight readable. Result:
- [ ] RTL. Expected: search icon on the right, shortcuts on the left, text right-aligned. Result:
