# Menubar — manual test checklist
Playground: Components → Menubar. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Open File, then hover Edit.
  Expected: Edit opens, File closes.
  Result:
## Keyboard
- [ ] Focus File, ArrowRight, ArrowDown, Esc.
  Expected: Moves to Edit, opens it, Esc closes and keeps focus on the trigger.
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
  Expected: ArrowLeft moves to the next menu.
  Result:
