# Carousel — manual test checklist
Playground: Components → Carousel. Run each step and write what you observed under "Result:".

## Visual
- [ ] Horizontal and vertical carousels.
  Expected: Buttons sit outside the viewport (-12 offset); vertical buttons rotate 90°.
  Result:
## Interaction
- [ ] Click Next until the end.
  Expected: Next disables on the last slide; Prev enabled.
  Result:
- [ ] Drag/swipe a slide.
  Expected: Scrolls with inertia and snaps.
  Result:
## Keyboard
- [ ] Focus inside the carousel; ArrowRight/ArrowLeft.
  Expected: Scrolls one slide.
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
  Expected: Embla receives `direction: "rtl"`; chevrons and arrow keys mirror.
  Result:
