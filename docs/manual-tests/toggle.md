# Toggle — manual test checklist
Playground: Components → Toggle. Run each step and write what you observed under "Result:".

## Visual
- [ ] Off/on, both variants and sizes.
  Expected: On state has accent background.
  Result:
## Keyboard
- [ ] Space/Enter.
  Expected: Toggles; screen reader says "pressed/not pressed".
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: "<label>, toggle button, pressed/not pressed".
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
