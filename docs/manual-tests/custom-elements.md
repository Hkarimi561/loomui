# Custom elements — manual test checklist
Showcase: **Elements** (header link, `/elements`). Everything on that page is written with `<ui-*>` elements only.

## Buttons & roles
- [ ] Inspect a `ui-button` in DevTools.
  Expected: `role="button"`, `tabindex="0"`, `data-slot="button"`, same classes as the directive.
  Result:
- [ ] Tab to the "Default" button, press Enter, then Space.
  Expected: the click counter increases by 1 per press (Space fires on key-up); the page does not scroll on Space.
  Result:
- [ ] Click / Enter on the "Disabled" button.
  Expected: nothing happens (no toast), the element has the `disabled` attribute, looks 50% opaque.
  Result:

## Forms
- [ ] Type in the Email `ui-input`, change the `ui-native-select`, check the checkbox, flip the switch.
  Expected: the status line under the form updates for each; the label "Email" focuses the input when clicked.
  Result:
- [ ] Inspect `ui-input`.
  Expected: the host has no `id`; the inner `<input>` has `id="e-email"`.
  Result:

## Composite widgets (real keys)
- [ ] Focus the first tab, press ArrowRight / ArrowLeft / Home / End.
  Expected: focus and selection move; roving tabindex (selected tab = 0, others -1).
  Result:
- [ ] Open the dialog with Enter on "Open dialog", press Tab several times, then Esc.
  Expected: focus stays trapped; Esc closes; focus returns to the trigger.
  Result:
- [ ] Focus "Menu", Enter, ArrowDown, Enter.
  Expected: menu opens on the first item, moves to the second, selects it (toast), closes, focus back on the trigger.
  Result:
- [ ] Focus the plan select trigger, Enter, ArrowDown, Enter.
  Expected: value changes (plan=team), list closes, focus returns to the trigger.
  Result:
- [ ] Click the accordion triggers.
  Expected: `aria-expanded` toggles, content animates.
  Result:

## Layout parts
- [ ] Look at the table and pagination.
  Expected: rows/cells lay out as a table (display table-*), hover rows highlight; pagination links are tab stops.
  Result:
- [ ] Alert with `<ui-icon>`.
  Expected: icon sits in the first column, text in the second (same as with an `<svg>`).
  Result:

## Screen reader
- [ ] Navigate the page with a screen reader (NVDA/VoiceOver).
  Expected: buttons are announced as buttons, tabs as tabs with selection state, the dialog as a dialog with its title, table as a table with rows/cells. UNKNOWN — note anything announced differently from the directive pages.
  Result:

## Dark mode / RTL
- [ ] Toggle Dark, then RTL.
  Expected: same as the directive demos; tabs ArrowLeft/Right mirror in RTL.
  Result:
