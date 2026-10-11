# Toast (Sonner) — behavior spec

Evidence: **[REA-DOM]** DOM of `…/radix/sonner` after clicking "Show Toast". Not done: dismissal/timer/hover/swipe observation, source cross-check, dark/RTL.
Note: the page contains two toast systems. The one used here is **Sonner** (`data-sonner-*`). The site's own Base UI toast portal (`toast-viewport`, `role="region"`) is unrelated and ignored.

## Structure [REA-DOM]
```
<section aria-label="Notifications alt+T" tabindex="-1" aria-live="polite" aria-relevant="additions text" aria-atomic="false">
  <ol dir="ltr" tabindex="-1" class="toaster group" data-sonner-toaster="true" data-sonner-theme="light|dark" data-y-position="top|bottom" data-x-position="left|center|right"
      style="--front-toast-height; --width:356px; --gap:14px; --normal-bg:var(--popover); --normal-text:var(--popover-foreground); --normal-border:var(--border); --border-radius:var(--radius); --offset-*:24px; --mobile-offset-*:16px">
    <li tabindex="0" data-sonner-toast data-styled="true" data-mounted="true" data-promise="false" data-swiped="false" data-removed="false"
        data-visible="true" data-y-position data-x-position data-index="0" data-front="true" data-swiping="false" data-dismissible="true"
        data-swipe-out="false" data-expanded="false" style="--index:0; --toasts-before:0; --z-index:1; --offset:0px; --initial-height:73.7px">
      <div data-content><div data-title>Event has been created</div><div data-description>Sunday, December 03, 2023 at 9:00 AM</div></div>
      <button data-button="true" data-action="true">Undo</button>
```
- Theme variables map to shadcn tokens (`--popover`, `--popover-foreground`, `--border`, `--radius`).
- The sample's position was `top` / `center`; the **default position is UNKNOWN** (the demo may set it). We default to bottom-right.
- Sonner's own stylesheet (injected at runtime) was **not captured**: every visual rule in `libs/ui/toast/toast.css` is our reconstruction from the data attributes.

## Behavior
| | Result | Evidence |
|---|---|---|
| Region | live region, label includes the hotkey `alt+T` | REA-DOM |
| Hotkey | Alt+T focuses the region (Sonner default) | label text only; behavior UNKNOWN on original; implemented |
| Stack | newest `data-index="0"` `data-front="true"`; older ones indexed up | REA-DOM (single toast) + our build |
| Auto-dismiss | Sonner default 4000 ms | UNKNOWN on original; we use 4000 |
| Hover expands stack / pauses timer | Sonner behavior; UNKNOWN on original | — |
| Swipe to dismiss | Sonner behavior; **not implemented** | — |

## Our implementation
`UiToastService` (`show/success/error/info/warning/loading/dismiss`) + `<ui-toaster position visibleToasts duration theme />`. Verified in the playground: three stacked toasts with `data-index` 2/1/0, scaled 0.9/0.95/1 and offset 28/14/0 px, correct ARIA region.

## Deviations
No swipe, no close button, no promise toast, no rich colors; simplified animation; icons are inline SVG. Timing and easing are guesses.

## UNKNOWN
Default position/offset on the original; real CSS; timers; swipe thresholds; focus behavior on Alt+T; dark/RTL.
