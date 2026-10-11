# Combobox — manual test checklist
Playground: Components → Combobox. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Type "nu".
  Expected: List filters; empty state when nothing matches.
  Result:
- [ ] Press Enter on a highlighted option.
  Expected: Value set, list closes, focus stays on input.
  Result:
## Keyboard
- [ ] ArrowDown/Up, Home, End.
  Expected: Highlight moves; `aria-activedescendant` follows.
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
