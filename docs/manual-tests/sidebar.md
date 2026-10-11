# Sidebar — manual test checklist
Playground: Components → Sidebar. Run each step and write what you observed under "Result:".

## Visual
- [ ] Expanded vs icon-collapsed sidebar.
  Expected: Width 16rem → 3rem; group labels fade out; menu buttons become 32px squares.
  Result:
## Interaction
- [ ] Click the trigger twice.
  Expected: Collapses to icons then expands; main content width follows.
  Result:
- [ ] Click the rail.
  Expected: Same toggle.
  Result:
- [ ] Resize below 768px and click the trigger.
  Expected: Sidebar opens as a left Sheet; Esc closes it.
  Result:
## Keyboard
- [ ] Press Ctrl/Cmd+B.
  Expected: Toggles; the browser's bookmark shortcut is suppressed.
  Result:
## Focus
- [ ] Open the mobile sheet.
  Expected: Focus moves into the sheet; closing returns it to the trigger.
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: Role, name and state are announced as described in the spec.
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
