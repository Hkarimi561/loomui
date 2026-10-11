# Dialog — manual test checklist
Playground: Components → Dialog. Spec: docs/behavior-specs/dialog.md.

## Visual
- [ ] Closed. Expected: only the "Open Dialog" outline button; nothing else on screen. Result:
- [ ] Open (click the trigger). Expected: dimmed + blurred overlay; centered card 384px max wide, rounded-xl, ring border, title/description/two fields/footer; X button top-right (top-left corner mirrored in RTL). Result:
- [ ] Open/close animation. Expected: fade + zoom-in over ~100ms; on close fade + zoom-out, content stays visible until the animation ends. Result:
- [ ] Footer. Expected: muted band flush to card edges; buttons stacked (reverse) on narrow screens, side by side from 640px. Result:
- [ ] Trigger while open. Expected: `aria-expanded="true"` and `data-state="open"` (DevTools). Result:

## Keyboard
- [ ] Focus the trigger with Tab, press Enter. Expected: dialog opens; focus lands on the **Name** input (first tabbable). Result:
- [ ] Same with Space. Expected: identical. Result:
- [ ] Tab ×1…5. Expected: Name → Username → Cancel → Save changes → X (Close) → wraps to Name. Focus never reaches the page behind. Result:
- [ ] Shift+Tab from Name. Expected: goes to X (Close), wrapping backwards. Result:
- [ ] Escape. Expected: closes; focus returns to the "Open Dialog" button. Result:
- [ ] Click the dimmed overlay. Expected: closes; focus returns to the trigger. Result:
- [ ] Click X, Cancel and Save changes in turn. Expected: each closes the dialog and returns focus to the trigger. Result:
- [ ] Press Escape while typing in an input. Expected: closes (UNKNOWN on the original — note any difference). Result:

## Scroll lock / portal (DevTools)
- [ ] Elements panel while open. Expected: dialog and overlay are inside `.cdk-overlay-container` under `<body>`; the app root has `aria-hidden="true"`; `<body data-scroll-locked="1">`. Result:
- [ ] After closing. Expected: `aria-hidden` and `data-scroll-locked` are removed. Result:
- [ ] Scroll the page with the mouse wheel while open. Expected: page behind does not scroll. Result:

## Screen reader
- [ ] Open the dialog. Expected: announces "Edit profile, dialog" then the description. Result:
- [ ] Browse the page behind. Expected: not reachable (hidden). Result:
- [ ] X button. Expected: "Close, button". Result:

## Dark mode / RTL
- [ ] Dark. Expected: card uses popover colors; overlay darker; text readable. Result:
- [ ] RTL. Expected: X moves to the top-left (we use `end-2`; the original keeps `right-2` — deliberate deviation); footer buttons align to the start side. Result:
