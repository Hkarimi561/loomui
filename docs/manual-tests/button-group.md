# Button Group — manual test checklist
Playground: Components → Button Group. Run each step and write what you observed under "Result:".

## Visual
- [ ] Horizontal group of three outline buttons.
  Expected: Shared borders, only outer corners rounded.
  Result:
- [ ] Vertical group.
  Expected: Same, stacked.
  Result:
- [ ] Group with an input.
  Expected: Input and button visually joined.
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
  Expected: Rounded outer corners swap sides; first button sits on the right.
  Result:
