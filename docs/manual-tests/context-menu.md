# Context Menu — manual test checklist
Playground: Components → Context Menu. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Right-click in the trigger area.
  Expected: Menu opens at the pointer; native menu suppressed.
  Result:
- [ ] Right-click near the viewport edge.
  Expected: Menu flips/shifts to stay visible.
  Result:
## Keyboard
- [ ] Shift+F10 / ContextMenu key on the trigger.
  Expected: Opens (UNKNOWN on the original — note what you see).
  Result:
- [ ] Arrows, Enter, Esc.
  Expected: Behave as listed.
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
