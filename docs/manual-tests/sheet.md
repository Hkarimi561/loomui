# Sheet — manual test checklist
Playground: Components → Sheet (buttons top / right / bottom / left). Spec: docs/behavior-specs/sheet.md.

## Visual
- [ ] Open "right". Expected: panel slides in from the right over ~200ms, full height, up to 384px wide (75% on narrow screens), border on its inner edge, blurred overlay. Result:
- [ ] Open "left", "top", "bottom". Expected: slides from the matching edge; top/bottom span the full width and are as tall as their content. Result:
- [ ] Close. Expected: slides back out before disappearing. Result:
- [ ] Footer. Expected: pinned to the bottom of side sheets (`mt-auto`). Result:

## Keyboard (same contract as Dialog)
- [ ] Tab to a trigger, Enter. Expected: opens; focus on the first input (Name). Result:
- [ ] Tab cycling. Expected: Name → Save changes → Close → X → wraps. Page behind is unreachable. Result:
- [ ] Escape. Expected: closes; focus returns to the trigger you used. Result:
- [ ] Click the overlay. Expected: closes; focus returns. Result:

## DevTools / scroll lock
- [ ] While open. Expected: `role="dialog"`, `data-side`, `aria-labelledby`/`aria-describedby` valid, overlay `data-state="open"`, `body[data-scroll-locked]`, siblings `aria-hidden`. Result:

## Screen reader
- [ ] Open. Expected: "Edit profile, dialog" + description. Result:

## Dark mode / RTL
- [ ] Dark. Expected: popover colors, readable text. Result:
- [ ] RTL. Expected: X button on the start side (left); "left"/"right" sheets stay on their **physical** sides (as observed on the original; UNKNOWN whether the original mirrors them — note what you expect). Result:
