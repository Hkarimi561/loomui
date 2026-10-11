# Breadcrumb — manual test checklist
Playground: Components → Breadcrumb. Run each step and write what you observed under "Result:".

## Visual
- [ ] Three-level breadcrumb with ellipsis.
  Expected: Links muted→foreground on hover; page item foreground; chevron separators.
  Result:
## Keyboard
- [ ] Tab across the links.
  Expected: Each link focusable with a ring; the current page is not a tab stop.
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: Landmark "breadcrumb navigation"; current item announced as "current page".
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Order reverses; separator chevrons point left.
  Result:
