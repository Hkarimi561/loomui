# Typography — manual test checklist
Playground: Components → Typography. Run each step and write what you observed under "Result:".

## Visual
- [ ] Render every variant on the demo page.
  Expected: Sizes/weights match the former shadcn typography page; blockquote border is on the start side.
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
  Expected: Blockquote border and list indent use logical properties and mirror.
  Result:
