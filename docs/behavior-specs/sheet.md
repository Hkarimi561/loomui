# Sheet — behavior spec

Evidence: **[REA-DOM]** `capture_browser_scenario` DOM of `…/radix/sheet` after clicking the first `sheet-trigger` (open state). Sheet is a Dialog with edge placement, so keyboard/focus/dismiss behavior = Dialog (see `dialog.md`); the Dialog keyboard evidence was observed live, **not re-run on Sheet** (UNKNOWN). Not done: source cross-check, closed-state capture, RTL.

## Structure (open) [REA-DOM]
```
trigger: <button data-slot="sheet-trigger" aria-haspopup="dialog" aria-expanded="true" aria-controls="<id>" data-state="open">
overlay: <div data-slot="sheet-overlay" data-state="open" aria-hidden="true" data-aria-hidden="true" class="fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs …">
content: <div role="dialog" id="<id>" aria-labelledby="<id>H1" aria-describedby="<id>H2" data-state="open" data-slot="sheet-content" data-side="left|right|top|bottom" tabindex="-1" class="fixed z-50 flex flex-col gap-4 bg-popover … transition duration-200 ease-in-out data-[side=…]:…">
  header(flex flex-col gap-0.5 p-4) > h2#H1 sheet-title + p#H2 sheet-description
  footer(mt-auto flex flex-col gap-2 p-4), close: <button data-slot="sheet-close" data-variant="ghost" data-size="icon-sm" class="… absolute end-3 top-3">
```
Differences from Dialog: `data-side`, 200 ms duration (`duration-200`), per-side slide animation classes (`slide-in-from-{side}-10` / `slide-out-to-{side}-10`), width `w-3/4 sm:max-w-sm` for left/right, `h-auto` for top/bottom, border on the inner edge (`border-e` / `border-s` / `border-t` / `border-b`).

## Side classes
`data-[side=left]:left-0 inset-y-0 h-full`, `right-0`, `top-0 inset-x-0`, `bottom-0 inset-x-0`. These use **physical** left/right. The captured sample had `dir="rtl"` with `data-side="left"`; whether shadcn mirrors "left/right" in RTL is UNKNOWN.

## Our implementation
Same engine as Dialog (`UiModalRoot`/`UiModalContentBase`): CDK overlay + FocusTrap, Esc and backdrop click dismiss, focus returns to the trigger, `aria-hidden` on everything else, body `data-scroll-locked`. Verified in the playground: `side="right"` opens as a 384 px panel at the right edge, first input focused, overlay `data-state="open"`.

## Deviations
Directive parts, DomPortal-based content (always in DOM, `hidden` while closed). Physical left/right kept as observed.

## UNKNOWN
Live Sheet keyboard run; RTL side mirroring; swipe-to-close (none observed); close-animation timing (we wait for animationend, fallback 250 ms).
