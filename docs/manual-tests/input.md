# Input — manual test checklist
Playground: Components → Input.

- [ ] Default look.
  Expected: 32px high, 1px `input` border, rounded-lg, transparent bg, placeholder muted.
  Result:
- [ ] Click into the field / Tab to it.
  Expected: border turns ring color and a 3px ring appears.
  Result:
- [ ] Type into the reactive-form input.
  Expected: "Value:" text below updates on every keystroke.
  Result:
- [ ] Disabled input.
  Expected: 50% opacity, not focusable by Tab, cursor not-allowed, no text entry.
  Result:
- [ ] Invalid input (`aria-invalid="true"`).
  Expected: destructive border and red ring (stronger on focus).
  Result:
- [ ] File input.
  Expected: "Choose file" button styled small and transparent.
  Result:
- [ ] Password input.
  Expected: characters masked.
  Result:
- [ ] Narrow the window below 768px.
  Expected: text is 16px; at ≥768px it is 14px.
  Result:
- [ ] Screen reader on the Email input.
  Expected: "Email (reactive form), edit text" (label association via `for`).
  Result:
- [ ] Dark mode.
  Expected: `input/30` background; border visible; placeholder readable.
  Result:
- [ ] RTL: type Arabic/Persian text.
  Expected: text right-aligned and caret on the right; padding symmetric.
  Result:
