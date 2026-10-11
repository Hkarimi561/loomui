# Tooltip — manual test checklist
Playground: Components → Tooltip. Spec: docs/behavior-specs/tooltip.md.

## Visual
- [ ] Hover each side button. Expected: small dark pill (inverted colors: foreground bg, background text), 12px text, appears on the requested side, fades/zooms in. Result:
- [ ] Move the mouse away. Expected: fades out and disappears within ~100ms. Result:
- [ ] Move the pointer from the trigger onto the tooltip itself. Expected: stays open (hoverable content). Result:
- [ ] "700ms delay" button. Expected: tooltip appears only after ~0.7s of hovering; leaving earlier cancels it. Result:
- [ ] DevTools while open. Expected: content `data-state="delayed-open"` and `data-side`; trigger has `aria-describedby` pointing at a `role="tooltip"` element. Result:

## Keyboard
- [ ] Tab to a trigger (keyboard focus). Expected: tooltip opens immediately (`data-state="instant-open"`). Result:
- [ ] Escape while open. Expected: closes. Result:
- [ ] Tab away. Expected: closes. Result:
- [ ] Click the trigger. Expected: tooltip closes. Result:
- [ ] Focus by mouse click then Tab away. Expected: no tooltip appears from a mouse focus. Result:

## Screen reader
- [ ] Focus a trigger. Expected: "bottom, button" followed by the description "Add to library". Result:

## Dark mode / RTL
- [ ] Dark. Expected: tooltip becomes a light pill with dark text. Result:
- [ ] RTL. Expected: left/right sides stay physical; text direction follows the page. Result:
