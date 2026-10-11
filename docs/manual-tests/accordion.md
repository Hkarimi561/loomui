# Accordion — manual test checklist
Playground: Components → Accordion. Run each step and write what you observed under "Result:".

## Visual
- [ ] Open and close an item.
  Expected: Height animates; chevron rotates 180°.
  Result:
## Interaction
- [ ] Single mode: open item A then item B.
  Expected: A closes when B opens; with `collapsible` clicking the open item closes it.
  Result:
- [ ] Multiple mode.
  Expected: Several items can stay open.
  Result:
## Keyboard
- [ ] Tab to the first trigger, ArrowDown ×2, ArrowUp, Home, End.
  Expected: Focus follows 2nd, 3rd(wrap→1st if only 2), … Home = first, End = last.
  Result:
- [ ] Space / Enter on a trigger.
  Expected: Item toggles.
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
