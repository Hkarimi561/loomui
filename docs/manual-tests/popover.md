# Popover — manual test checklist
Playground: Components → Popover (buttons top / right / bottom / left). Spec: docs/behavior-specs/popover.md.

## Visual
- [ ] Open each button. Expected: 288px-wide card appears on the requested side with an 4px gap, rounded-lg, shadow + ring; animation fades/zooms in from the trigger edge. Result:
- [ ] Place a trigger near a screen edge (resize the window) and open it. Expected: flips to the opposite side when it would overflow. Result:
- [ ] Trigger state (DevTools). Expected: `aria-expanded="true"`, `data-state="open"`, `aria-controls` = content id. Result:

## Keyboard / focus
- [ ] Tab to a trigger, Enter. Expected: opens and focus moves into the content (the Width input). Result:
- [ ] Tab inside. Expected: moves through the content then **continues to the rest of the page** (no trap). Result:
- [ ] Escape. Expected: closes; focus returns to the trigger. Result:
- [ ] Click outside. Expected: closes. Focus: UNKNOWN on the original — note where it lands. Result:
- [ ] Click the trigger again while open. Expected: closes (does not close-and-reopen). Result:

## Screen reader
- [ ] Open. Expected: content announced as a dialog; focus in the input announces "Width, edit text". Result:

## Dark mode / RTL
- [ ] Dark. Expected: popover colors; ring visible. Result:
- [ ] RTL. Expected: `align="center"` unaffected; left/right sides stay physical. Result:
