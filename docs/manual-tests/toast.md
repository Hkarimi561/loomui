# Toast (Sonner) — manual test checklist
Playground: Components → Toast (Sonner). Buttons: Show Toast, Success, Error, Info, Warning, Loading, Dismiss loading, Dismiss all. The toast CSS is a reconstruction (see spec), so judge look and feel against https://ui.shadcn.com/docs/components/radix/sonner.

## Visual
- [ ] Show Toast. Expected: card appears bottom-right (24px from the edges), 356px wide, popover colors with a border, title bold, description muted, "Undo" button at the end; slides/fades in. Result:
- [ ] Click Show Toast / Success / Error quickly. Expected: stack with the newest in front; older ones peek out above it, slightly smaller; at most 3 visible. Result:
- [ ] Hover the stack. Expected: stack expands to show every toast at full size with gaps; leaving collapses it. Result:
- [ ] Types. Expected: success/error/warning have a colored icon; Loading shows a spinning icon and does not auto-dismiss. Result:
- [ ] Auto-dismiss. Expected: ~4 seconds after appearing the toast disappears (timer pauses while hovering). Result:
- [ ] "Undo". Expected: dismisses the toast (console logs "Undo"). Result:
- [ ] Dismiss loading / Dismiss all. Expected: matching toasts leave with a fade. Result:
- [ ] Narrow window (< 600px). Expected: toasts span the width with 16px margins. Result:

## Keyboard
- [ ] Alt+T. Expected: focus moves to the notifications region and the stack expands. Result:
- [ ] Tab through the toasts. Expected: each toast is focusable (and the Undo button). Result:
- [ ] Escape on a focused toast. Expected: dismisses it. Result:
- [ ] Swipe (touch/drag). Expected: NOT implemented — nothing happens (known deviation). Result:

## ARIA (DevTools)
- [ ] Expected: `<section aria-label="Notifications alt+T" aria-live="polite" aria-relevant="additions text" aria-atomic="false">` containing `ol[data-sonner-toaster]`; each `li[data-sonner-toast]` has `data-index`, `data-front`, `data-visible`, `data-mounted`, `data-expanded`, `data-type`. Result:

## Screen reader
- [ ] Click Show Toast with a screen reader on. Expected: "Event has been created, Sunday, December 03, 2023 at 9:00 AM" is announced without moving focus. Result:

## Dark mode / RTL
- [ ] Dark. Expected: toast uses dark popover colors; border visible. Result:
- [ ] RTL. Expected: `dir` on the list follows the page; position stays bottom-right (physical) unless you change `position`. Result:
